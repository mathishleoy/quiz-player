export const PROMPT_1_NOTES = `You are a quiz generator for Quiz Player.

GOAL: Generate a valid Quiz Player JSON file from my attached notes.

INPUTS:
- My notes: [ATTACH YOUR PDF/DOC/TXT OR PASTE YOUR NOTES BELOW]
- Number of questions: {{Q_AMOUNT}}  <- CHANGE THIS, e.g. 10, 15, 20

RULES - OUTPUT MUST BE VALID JSON ONLY:
1. Output ONLY raw JSON. No explanation, no markdown, no \`\`\`json wrapper.
2. Follow this exact structure:
{
  "title": "Title based on notes",
  "description": "1 sentence summary of topic",
  "questions": [...]
}

3. Generate exactly {{Q_AMOUNT}} questions. Use this distribution:
- 40% mcq
- 15% multiple_select
- 15% fill_blank
- 10% short_answer
- 10% matching OR classification OR ordering
- 10% scenario

4. QUESTION TYPE FORMATS (MUST FOLLOW EXACTLY):

mcq:
{"type":"mcq","text":"Question?","options":["A","B","C","D"],"correct":0,"feedback":"Explanation"}
- correct is 0-based index

multiple_select:
{"type":"multiple_select","text":"Question?","options":["A","B","C","D"],"correct":[0,2],"feedback":"Explanation"}
- correct is array of indices

fill_blank:
{"type":"fill_blank","text":"Water is ____.","correct":["H2O"],"caseSensitive":false,"feedback":"Explanation"}
- Use ____ for blanks. If 2 blanks, 2 items in correct array.

short_answer:
{"type":"short_answer","text":"What does X stand for?","correct":["Full Form","full form"],"caseSensitive":false,"maxLength":100,"feedback":"Explanation"}

matching:
{"type":"matching","text":"Match the following.","pairs":[{"prompt":"A","answer":"1"},{"prompt":"B","answer":"2"},{"prompt":"C","answer":"3"}],"distractors":["X","Y"]}

ordering:
{"type":"ordering","text":"Order the steps.","items":["Step 1 Correct Order","Step 2","Step 3","Step 4"]}
- items MUST be in CORRECT order. App will shuffle.

classification:
{"type":"classification","text":"Classify as X or Y.","categories":["X","Y"],"items":[{"text":"Item1","category":"X"},{"text":"Item2","category":"Y"}]}
- text must be unique per item

scenario:
{"type":"scenario","scenario":"Background case/context from notes...","text":"What should be done?","options":["A","B","C","D"],"correct":1,"feedback":"Explanation"}

5. QUALITY RULES:
- All questions must come ONLY from notes. Don't hallucinate.
- Make distractors plausible.
- Feedback must reference notes.
- No duplicates, no trailing commas, double quotes only.
- Ensure correct indices are valid.

NOW GENERATE {{Q_AMOUNT}} QUESTIONS FROM MY NOTES BELOW:

[PASTE NOTES HERE OR ATTACH FILE]`;

export const PROMPT_2_TOPIC = `You are a quiz generator for Quiz Player.

GOAL: Generate a valid Quiz Player JSON file about a specific topic.

INPUTS:
- Topic: {{TOPIC}} <- CHANGE THIS, e.g. "Photosynthesis - Grade 10 Biology"
- Number of questions: {{Q_AMOUNT}} <- CHANGE THIS, e.g. 10, 15, 20
- Difficulty: {{LEVEL}} <- CHANGE THIS, e.g. Easy, Medium, Hard

RULES - OUTPUT MUST BE VALID JSON ONLY:
1. Output ONLY raw JSON. No explanation, no markdown, no \`\`\`json wrapper.
2. Follow this exact structure:
{
  "title": "{{TOPIC}}",
  "description": "1 sentence summary of topic",
  "questions": [...]
}

3. Generate exactly {{Q_AMOUNT}} questions. Use this distribution:
- 40% mcq
- 15% multiple_select
- 15% fill_blank
- 10% short_answer
- 10% matching OR classification OR ordering
- 10% scenario

4. QUESTION TYPE FORMATS (MUST FOLLOW EXACTLY):

mcq:
{"type":"mcq","text":"Question?","options":["A","B","C","D"],"correct":0,"feedback":"Explanation"}
- correct is 0-based index

multiple_select:
{"type":"multiple_select","text":"Question?","options":["A","B","C","D"],"correct":[0,2],"feedback":"Explanation"}
- correct is array of indices

fill_blank:
{"type":"fill_blank","text":"Water is ____.","correct":["H2O"],"caseSensitive":false,"feedback":"Explanation"}
- Use ____ for blanks. If 2 blanks, 2 items in correct array.

short_answer:
{"type":"short_answer","text":"What does X stand for?","correct":["Full Form","full form"],"caseSensitive":false,"maxLength":100,"feedback":"Explanation"}

matching:
{"type":"matching","text":"Match the following.","pairs":[{"prompt":"A","answer":"1"},{"prompt":"B","answer":"2"},{"prompt":"C","answer":"3"}],"distractors":["X","Y"]}

ordering:
{"type":"ordering","text":"Order the steps.","items":["Step 1 Correct Order","Step 2","Step 3","Step 4"]}
- items MUST be in CORRECT order. App will shuffle.

classification:
{"type":"classification","text":"Classify as X or Y.","categories":["X","Y"],"items":[{"text":"Item1","category":"X"},{"text":"Item2","category":"Y"}]}
- text must be unique per item

scenario:
{"type":"scenario","scenario":"Background case/context...","text":"What should be done?","options":["A","B","C","D"],"correct":1,"feedback":"Explanation"}

5. QUALITY RULES:
- Questions must be accurate and appropriate for {{LEVEL}} level.
- Make distractors plausible and challenging.
- No duplicates, no trailing commas, double quotes only.
- Ensure correct indices are valid.

NOW GENERATE {{Q_AMOUNT}} QUESTIONS ABOUT: {{TOPIC}} AT {{LEVEL}} LEVEL.`;
