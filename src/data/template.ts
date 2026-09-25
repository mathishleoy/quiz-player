export const QUIZ_TEMPLATE_JSON = {
  title: "My Custom Quiz",
  description: "A comprehensive quiz covering multiple interactive assessment question types.",
  questions: [
    {
      type: "mcq",
      text: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correct: 1,
      feedback: "Mars appears red due to iron oxide (rust) on its surface."
    },
    {
      type: "multiple_select",
      text: "Which of the following are primary colors of light in the additive RGB model?",
      options: ["Red", "Yellow", "Green", "Blue"],
      correct: [0, 2, 3],
      feedback: "The primary additive colors of light are Red, Green, and Blue."
    },
    {
      type: "fill_blank",
      text: "Water is composed of two hydrogen atoms and one oxygen atom, giving it the chemical formula ____.",
      correct: ["H2O"],
      caseSensitive: false,
      feedback: "The chemical formula for water is H2O."
    },
    {
      type: "short_answer",
      text: "What does the abbreviation 'CPU' stand for in computer hardware?",
      correct: ["Central Processing Unit", "central processing unit"],
      caseSensitive: false,
      maxLength: 50,
      feedback: "CPU stands for Central Processing Unit."
    },
    {
      type: "matching",
      text: "Match each country with its official capital city.",
      pairs: [
        { prompt: "Japan", answer: "Tokyo" },
        { prompt: "France", answer: "Paris" },
        { prompt: "Australia", answer: "Canberra" }
      ],
      distractors: ["Sydney", "Kyoto"],
      feedback: "Canberra is the capital of Australia, Tokyo of Japan, and Paris of France."
    },
    {
      type: "ordering",
      text: "Arrange these historical computer storage media chronologically from oldest to newest invention.",
      items: [
        "Punched Paper Cards",
        "Magnetic Tape",
        "3.5-inch Floppy Disk",
        "Solid State Drive (SSD)"
      ],
      feedback: "Punch cards (1890s/1900s) -> Magnetic Tape (1950s) -> 3.5\" Floppy (1981) -> Modern SSD (2000s)."
    },
    {
      type: "classification",
      text: "Classify the following elements as either Metals or Non-Metals.",
      categories: ["Metals", "Non-Metals"],
      items: [
        { text: "Gold", category: "Metals" },
        { text: "Oxygen", category: "Non-Metals" },
        { text: "Iron", category: "Metals" },
        { text: "Nitrogen", category: "Non-Metals" }
      ],
      feedback: "Gold and Iron are transition metals; Oxygen and Nitrogen are diatomic non-metal gases."
    },
    {
      type: "scenario",
      scenario: "You are a software engineer deploying a critical update on Friday evening. Suddenly, the monitoring dashboard shows automated error rates jumping from 0.05% to 18.4% across multiple regions.",
      text: "According to production reliability engineering best practices, what should be your immediate first action?",
      options: [
        "Commit an urgent hotfix directly into the production branch.",
        "Initiate an immediate rollback to the previous stable release version.",
        "Restart all web servers simultaneously without reviewing error logs.",
        "Wait 30 minutes to see if the spikes resolve spontaneously."
      ],
      correct: 1,
      feedback: "In site reliability engineering (SRE), mitigating active customer impact by rolling back to a known stable state takes absolute priority over speculative debugging."
    }
  ]
};

export const BLANK_TEMPLATE_JSON = {
  title: "",
  questions: [
    {
      type: "mcq",
      text: "",
      options: ["", ""],
      correct: 0,
      feedback: ""
    },
    {
      type: "multiple_select",
      text: "",
      options: ["", ""],
      correct: [0],
      feedback: ""
    },
    {
      type: "fill_blank",
      text: "____",
      correct: [""],
      caseSensitive: false,
      feedback: ""
    },
    {
      type: "short_answer",
      text: "",
      correct: [""],
      caseSensitive: false,
      maxLength: 50,
      feedback: ""
    },
    {
      type: "matching",
      text: "",
      pairs: [
        { prompt: "", answer: "" },
        { prompt: "", answer: "" }
      ],
      distractors: [],
      feedback: ""
    },
    {
      type: "ordering",
      text: "",
      items: ["", ""],
      feedback: ""
    },
    {
      type: "classification",
      text: "",
      categories: ["", ""],
      items: [
        { text: "", category: "" },
        { text: "", category: "" }
      ],
      feedback: ""
    },
    {
      type: "scenario",
      scenario: "",
      text: "",
      options: ["", ""],
      correct: 0,
      feedback: ""
    }
  ]
};
