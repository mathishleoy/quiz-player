import { QuizQuestion, UserAnswerValue, QuestionScoreResult, QuizAttemptResult } from '../types/quiz';

export function scoreQuestion(question: QuizQuestion, answer: UserAnswerValue): QuestionScoreResult {
  const possible = 1.0;
  let earned = 0.0;
  let correctAnswerSummary = '';
  let userAnswerSummary = '';

  switch (question.type) {
    case 'mcq': {
      const selected = typeof answer === 'number' ? answer : -1;
      const isCorrect = selected === question.correct;
      earned = isCorrect ? 1.0 : 0.0;
      correctAnswerSummary = question.options[question.correct] || `Option ${question.correct + 1}`;
      userAnswerSummary = selected >= 0 && question.options[selected]
        ? question.options[selected]
        : 'No answer selected';
      break;
    }

    case 'multiple_select': {
      const selected: number[] = Array.isArray(answer) ? (answer as number[]) : [];
      const correctSet = new Set(question.correct);
      const totalCorrect = question.correct.length;
      const totalIncorrect = question.options.length - totalCorrect;

      let correctChosen = 0;
      let incorrectChosen = 0;

      selected.forEach(idx => {
        if (correctSet.has(idx)) {
          correctChosen++;
        } else {
          incorrectChosen++;
        }
      });

      // Moodle grading formula: (correctChosen / totalCorrect) - (incorrectChosen / totalIncorrect)
      const penalty = totalIncorrect > 0 ? incorrectChosen / totalIncorrect : 0;
      const rawScore = totalCorrect > 0 ? (correctChosen / totalCorrect) - penalty : 0;
      earned = Math.max(0, Math.min(1.0, Math.round(rawScore * 100) / 100));

      correctAnswerSummary = question.correct
        .map(i => question.options[i])
        .filter(Boolean)
        .join('; ');
      userAnswerSummary = selected.length > 0
        ? selected.map(i => question.options[i]).filter(Boolean).join('; ')
        : 'No options selected';
      break;
    }

    case 'fill_blank': {
      const userBlanks: string[] = Array.isArray(answer) ? (answer as string[]) : [];
      const correctBlanks = question.correct;
      const totalBlanks = correctBlanks.length;
      let matches = 0;

      for (let i = 0; i < totalBlanks; i++) {
        const expected = (correctBlanks[i] || '').trim();
        const actual = (userBlanks[i] || '').trim();
        if (question.caseSensitive) {
          if (actual === expected) matches++;
        } else {
          if (actual.toLowerCase() === expected.toLowerCase()) matches++;
        }
      }

      earned = totalBlanks > 0 ? Math.round((matches / totalBlanks) * 100) / 100 : 0;
      correctAnswerSummary = correctBlanks.join(' / ');
      userAnswerSummary = userBlanks.some(b => b.trim())
        ? userBlanks.map(b => b.trim() || '[Empty]').join(' / ')
        : 'No answer entered';
      break;
    }

    case 'short_answer': {
      const userText = (typeof answer === 'string' ? answer : '').trim();
      let matched = false;

      for (const opt of question.correct) {
        const expected = (opt || '').trim();
        if (question.caseSensitive) {
          if (userText === expected) {
            matched = true;
            break;
          }
        } else {
          if (userText.toLowerCase() === expected.toLowerCase()) {
            matched = true;
            break;
          }
        }
      }

      earned = matched ? 1.0 : 0.0;
      correctAnswerSummary = question.correct.join(' OR ');
      userAnswerSummary = userText || 'No answer entered';
      break;
    }

    case 'matching': {
      const userPairs = (typeof answer === 'object' && answer !== null && !Array.isArray(answer))
        ? (answer as Record<string, string>)
        : {};
      const pairs = question.pairs;
      let matched = 0;

      pairs.forEach(p => {
        if (userPairs[p.prompt] && userPairs[p.prompt] === p.answer) {
          matched++;
        }
      });

      earned = pairs.length > 0 ? Math.round((matched / pairs.length) * 100) / 100 : 0;
      correctAnswerSummary = pairs.map(p => `${p.prompt} → ${p.answer}`).join('; ');
      const userSummaryParts = pairs.map(p => {
        const ans = userPairs[p.prompt];
        return ans ? `${p.prompt} → ${ans}` : `${p.prompt} → [Unmatched]`;
      });
      userAnswerSummary = Object.keys(userPairs).length > 0 ? userSummaryParts.join('; ') : 'No matches made';
      break;
    }

    case 'ordering': {
      const userOrder = Array.isArray(answer) ? (answer as string[]) : [];
      const correctOrder = question.items;
      let correctPositions = 0;

      correctOrder.forEach((item, idx) => {
        if (userOrder[idx] === item) {
          correctPositions++;
        }
      });

      earned = correctOrder.length > 0 ? Math.round((correctPositions / correctOrder.length) * 100) / 100 : 0;
      correctAnswerSummary = correctOrder.join(' → ');
      userAnswerSummary = userOrder.length > 0 ? userOrder.join(' → ') : 'No sequence set';
      break;
    }

    case 'classification': {
      const userClassification = (typeof answer === 'object' && answer !== null && !Array.isArray(answer))
        ? (answer as Record<string, string[]>)
        : {};
      const items = question.items;
      let correctClassified = 0;

      items.forEach(it => {
        const categoryItems = userClassification[it.category] || [];
        if (categoryItems.includes(it.text)) {
          correctClassified++;
        }
      });

      earned = items.length > 0 ? Math.round((correctClassified / items.length) * 100) / 100 : 0;
      
      const correctMap: Record<string, string[]> = {};
      question.categories.forEach(c => { correctMap[c] = []; });
      items.forEach(it => {
        if (!correctMap[it.category]) correctMap[it.category] = [];
        correctMap[it.category].push(it.text);
      });

      correctAnswerSummary = Object.entries(correctMap)
        .map(([cat, list]) => `${cat}: [${list.join(', ')}]`)
        .join('; ');

      userAnswerSummary = Object.entries(userClassification).some(([_, list]) => list.length > 0)
        ? Object.entries(userClassification)
            .map(([cat, list]) => `${cat}: [${list.join(', ')}]`)
            .join('; ')
        : 'No items categorized';
      break;
    }

    case 'scenario': {
      const selected = typeof answer === 'number' ? answer : -1;
      const isCorrect = selected === question.correct;
      earned = isCorrect ? 1.0 : 0.0;
      correctAnswerSummary = question.options[question.correct] || `Option ${question.correct + 1}`;
      userAnswerSummary = selected >= 0 && question.options[selected]
        ? question.options[selected]
        : 'No answer selected';
      break;
    }
  }

  const isCorrect = earned >= 0.999;
  const isPartial = earned > 0 && earned < 0.999;
  const isIncorrect = earned === 0;

  return {
    questionId: question.id,
    earned,
    possible,
    isCorrect,
    isPartial,
    isIncorrect,
    correctAnswerSummary,
    userAnswerSummary,
    feedback: question.feedback,
  };
}

export function scoreFullQuiz(
  questions: QuizQuestion[],
  answers: Record<string, UserAnswerValue>
): QuizAttemptResult {
  let totalEarned = 0;
  let totalPossible = questions.length * 1.0;
  const questionResults: Record<string, QuestionScoreResult> = {};

  questions.forEach(q => {
    const res = scoreQuestion(q, answers[q.id]);
    questionResults[q.id] = res;
    totalEarned += res.earned;
  });

  const percentage = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 1000) / 10 : 0;

  return {
    totalEarned: Math.round(totalEarned * 100) / 100,
    totalPossible,
    percentage,
    questionResults,
    completedAt: new Date(),
  };
}

export function isQuestionAnswered(question: QuizQuestion, answer: UserAnswerValue): boolean {
  if (answer === null || answer === undefined) return false;

  switch (question.type) {
    case 'mcq':
    case 'scenario':
      return typeof answer === 'number' && answer >= 0;

    case 'multiple_select':
      return Array.isArray(answer) && answer.length > 0;

    case 'fill_blank':
      return Array.isArray(answer) && answer.some(b => typeof b === 'string' && b.trim().length > 0);

    case 'short_answer':
      return typeof answer === 'string' && answer.trim().length > 0;

    case 'matching':
      return typeof answer === 'object' && !Array.isArray(answer) && Object.keys(answer).length > 0;

    case 'ordering':
      return Array.isArray(answer) && answer.length === question.items.length;

    case 'classification': {
      if (typeof answer !== 'object' || Array.isArray(answer)) return false;
      const count = Object.values(answer as Record<string, string[]>).reduce((acc, arr) => acc + (arr?.length || 0), 0);
      return count > 0;
    }

    default:
      return false;
  }
}
