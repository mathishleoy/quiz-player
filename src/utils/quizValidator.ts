import { QuizQuestion, RawQuizData } from '../types/quiz';

export interface ValidationResult {
  isValid: boolean;
  quiz?: {
    title: string;
    description: string;
    questions: QuizQuestion[];
  };
  errors: string[];
  warnings?: string[];
}

export function validateAndParseQuiz(jsonString: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  let data: any;
  try {
    data = JSON.parse(jsonString);
  } catch (err: any) {
    return {
      isValid: false,
      errors: [`Invalid JSON format: ${err.message || 'Syntax error'}`],
    };
  }

  if (typeof data !== 'object' || data === null) {
    return {
      isValid: false,
      errors: ['Root JSON must be an object with "questions" array.'],
    };
  }

  const title = typeof data.title === 'string' && data.title.trim().length > 0
    ? data.title.trim()
    : 'Interactive Quiz';
  const description = typeof data.description === 'string' ? data.description.trim() : '';

  if (!Array.isArray(data.questions)) {
    return {
      isValid: false,
      errors: ['Missing "questions" property or it is not an array.'],
    };
  }

  if (data.questions.length === 0) {
    return {
      isValid: false,
      errors: ['The "questions" array cannot be empty. Please include at least one question.'],
    };
  }

  const parsedQuestions: QuizQuestion[] = [];

  data.questions.forEach((q: any, idx: number) => {
    const qNum = idx + 1;
    if (!q || typeof q !== 'object') {
      errors.push(`Question #${qNum}: Question definition must be an object.`);
      return;
    }

    const type = q.type;
    const text = typeof q.text === 'string' ? q.text.trim() : '';
    const feedback = typeof q.feedback === 'string' ? q.feedback.trim() : undefined;
    const baseId = `q_${idx}_${Date.now()}`;

    if (!type) {
      errors.push(`Question #${qNum}: Missing "type" property.`);
      return;
    }

    if (!text && type !== 'fill_blank') {
      errors.push(`Question #${qNum} (${type}): Missing question text.`);
      return;
    }

    switch (type) {
      case 'mcq': {
        if (!Array.isArray(q.options) || q.options.length < 2) {
          errors.push(`Question #${qNum} (mcq): "options" must be an array with at least 2 choices.`);
          return;
        }
        if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.options.length) {
          errors.push(`Question #${qNum} (mcq): "correct" must be a valid 0-based index between 0 and ${q.options.length - 1}. Got ${q.correct}.`);
          return;
        }

        // Lock the original correct option and shuffle options randomly for each quiz session
        const rawOptions = q.options.map((o: any) => String(o));
        const shuffled = shuffleMCQOptions(rawOptions, q.correct);

        parsedQuestions.push({
          id: baseId,
          originalIndex: idx,
          type: 'mcq',
          text,
          options: shuffled.options,
          correct: shuffled.correct,
          feedback,
        });
        break;
      }

      case 'multiple_select': {
        if (!Array.isArray(q.options) || q.options.length < 2) {
          errors.push(`Question #${qNum} (multiple_select): "options" must be an array with at least 2 choices.`);
          return;
        }
        if (!Array.isArray(q.correct) || q.correct.length === 0) {
          errors.push(`Question #${qNum} (multiple_select): "correct" must be a non-empty array of choice indices.`);
          return;
        }
        const invalidIndices = q.correct.filter((c: any) => typeof c !== 'number' || c < 0 || c >= q.options.length);
        if (invalidIndices.length > 0) {
          errors.push(`Question #${qNum} (multiple_select): "correct" contains invalid indices [${invalidIndices.join(', ')}].`);
          return;
        }
        parsedQuestions.push({
          id: baseId,
          originalIndex: idx,
          type: 'multiple_select',
          text,
          options: q.options.map((o: any) => String(o)),
          correct: Array.from(new Set(q.correct)),
          feedback,
        });
        break;
      }

      case 'fill_blank': {
        if (!text) {
          errors.push(`Question #${qNum} (fill_blank): Missing question text.`);
          return;
        }
        if (!Array.isArray(q.correct) || q.correct.length === 0) {
          errors.push(`Question #${qNum} (fill_blank): "correct" must be an array of correct blank answer strings.`);
          return;
        }
        // Count blanks like ____
        const blanksMatch = text.match(/_{2,}/g);
        const blankCount = blanksMatch ? blanksMatch.length : 1;
        if (q.correct.length < blankCount) {
          warnings.push(`Question #${qNum} (fill_blank): Found ${blankCount} blanks in text but only ${q.correct.length} answer(s) provided.`);
        }
        parsedQuestions.push({
          id: baseId,
          originalIndex: idx,
          type: 'fill_blank',
          text,
          correct: q.correct.map((c: any) => String(c).trim()),
          caseSensitive: Boolean(q.caseSensitive),
          feedback,
        });
        break;
      }

      case 'short_answer': {
        if (!Array.isArray(q.correct) || q.correct.length === 0) {
          errors.push(`Question #${qNum} (short_answer): "correct" must be an array of accepted answers.`);
          return;
        }
        parsedQuestions.push({
          id: baseId,
          originalIndex: idx,
          type: 'short_answer',
          text,
          correct: q.correct.map((c: any) => String(c).trim()),
          caseSensitive: Boolean(q.caseSensitive),
          maxLength: typeof q.maxLength === 'number' && q.maxLength > 0 ? q.maxLength : 100,
          feedback,
        });
        break;
      }

      case 'matching': {
        if (!Array.isArray(q.pairs) || q.pairs.length < 2) {
          errors.push(`Question #${qNum} (matching): "pairs" must be an array with at least 2 prompt-answer objects.`);
          return;
        }
        for (let pIdx = 0; pIdx < q.pairs.length; pIdx++) {
          const pair = q.pairs[pIdx];
          if (!pair || typeof pair.prompt !== 'string' || typeof pair.answer !== 'string') {
            errors.push(`Question #${qNum} (matching): Pair #${pIdx + 1} must have string "prompt" and "answer".`);
            return;
          }
        }
        const distractors = Array.isArray(q.distractors)
          ? q.distractors.map((d: any) => String(d).trim()).filter(Boolean)
          : [];

        parsedQuestions.push({
          id: baseId,
          originalIndex: idx,
          type: 'matching',
          text,
          pairs: q.pairs.map((p: any) => ({ prompt: String(p.prompt).trim(), answer: String(p.answer).trim() })),
          distractors,
          feedback,
        });
        break;
      }

      case 'ordering': {
        if (!Array.isArray(q.items) || q.items.length < 2) {
          errors.push(`Question #${qNum} (ordering): "items" must be an array of at least 2 items in correct sequence.`);
          return;
        }
        parsedQuestions.push({
          id: baseId,
          originalIndex: idx,
          type: 'ordering',
          text,
          items: q.items.map((it: any) => String(it).trim()),
          feedback,
        });
        break;
      }

      case 'classification': {
        if (!Array.isArray(q.categories) || q.categories.length < 2) {
          errors.push(`Question #${qNum} (classification): "categories" must be an array with at least 2 category names.`);
          return;
        }
        if (!Array.isArray(q.items) || q.items.length < 2) {
          errors.push(`Question #${qNum} (classification): "items" must be an array with at least 2 items.`);
          return;
        }
        const categories = q.categories.map((c: any) => String(c).trim());
        const catSet = new Set(categories);

        for (let itemIdx = 0; itemIdx < q.items.length; itemIdx++) {
          const item = q.items[itemIdx];
          if (!item || typeof item.text !== 'string' || typeof item.category !== 'string') {
            errors.push(`Question #${qNum} (classification): Item #${itemIdx + 1} must have string "text" and "category".`);
            return;
          }
          if (!catSet.has(item.category.trim())) {
            errors.push(`Question #${qNum} (classification): Item "${item.text}" has category "${item.category}" which is not in declared categories [${categories.join(', ')}].`);
            return;
          }
        }

        parsedQuestions.push({
          id: baseId,
          originalIndex: idx,
          type: 'classification',
          text,
          categories,
          items: q.items.map((it: any) => ({
            text: String(it.text).trim(),
            category: String(it.category).trim(),
          })),
          feedback,
        });
        break;
      }

      case 'scenario': {
        if (typeof q.scenario !== 'string' || q.scenario.trim().length === 0) {
          errors.push(`Question #${qNum} (scenario): Missing or empty "scenario" context text.`);
          return;
        }
        if (!Array.isArray(q.options) || q.options.length < 2) {
          errors.push(`Question #${qNum} (scenario): "options" must be an array with at least 2 choices.`);
          return;
        }
        if (typeof q.correct !== 'number' || q.correct < 0 || q.correct >= q.options.length) {
          errors.push(`Question #${qNum} (scenario): "correct" must be a valid 0-based index between 0 and ${q.options.length - 1}.`);
          return;
        }
        parsedQuestions.push({
          id: baseId,
          originalIndex: idx,
          type: 'scenario',
          scenario: q.scenario.trim(),
          text,
          options: q.options.map((o: any) => String(o)),
          correct: q.correct,
          feedback,
        });
        break;
      }

      default:
        errors.push(`Question #${qNum}: Unsupported question type "${type}". Allowed: mcq, multiple_select, fill_blank, short_answer, matching, ordering, classification, scenario.`);
        break;
    }
  });

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      warnings,
    };
  }

  return {
    isValid: true,
    quiz: {
      title,
      description,
      questions: parsedQuestions,
    },
    errors: [],
    warnings,
  };
}

// Shuffles the options of an MCQ question while tracking and updating the correct answer index
export function shuffleMCQOptions(
  options: string[],
  correctIndex: number
): { options: string[]; correct: number } {
  // Capture the text of the correct answer using the author's original index
  const correctText = options[correctIndex];

  // Create indexed representations of options
  const indexed = options.map((opt, idx) => ({ opt, originalIndex: idx }));

  // Perform Fisher-Yates shuffle
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }

  // Find the new index where the correct answer ended up
  const newCorrectIndex = indexed.findIndex(item => item.originalIndex === correctIndex);

  return {
    options: indexed.map(item => item.opt),
    correct: newCorrectIndex !== -1 ? newCorrectIndex : 0,
  };
}

// Fisher-Yates shuffle algorithm for truly random question and distractor order
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
