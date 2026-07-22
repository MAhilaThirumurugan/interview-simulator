const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Local fallback questions
const fallbackQuestions = {
  React: [
    "What is the difference between State and Props?",
    "Explain useEffect hook.",
    "What is Virtual DOM?",
    "What are controlled components?",
    "Explain React lifecycle.",
    "What is JSX?",
    "What is useMemo?",
    "What is useCallback?"
  ],

  JavaScript: [
    "What is a closure?",
    "Explain hoisting.",
    "Difference between let, const and var.",
    "Explain promises.",
    "What is async/await?",
    "What is event delegation?",
    "Explain callback functions."
  ],

  Node: [
    "What is Express.js?",
    "What is middleware?",
    "Explain JWT authentication.",
    "Difference between synchronous and asynchronous code."
  ],

  MongoDB: [
    "What is MongoDB?",
    "Difference between SQL and MongoDB.",
    "Explain indexing.",
    "What is aggregation?"
  ],

  DSA: [
    "What is Big O notation?",
    "Explain HashMap.",
    "Difference between Stack and Queue.",
    "Explain Binary Search."
  ]
};

async function generateQuestion(topic, difficulty, previousQuestions = []) {

  try {

    const prompt = `
You are an experienced technical interviewer.

Generate ONE interview question.

Topic: ${topic}
Difficulty: ${difficulty}

Previous Questions:
${previousQuestions.join("\n")}

Rules:
- Do not repeat questions.
- Only return the question.
`;

    const response = await ai.models.generateContent({
      model: "models/gemini-flash-latest",
      contents: prompt,
    });

    return response.text.trim();

  } catch (error) {

    console.log("Gemini unavailable. Using fallback questions.");

    const questions =
      fallbackQuestions[topic] ||
      [`Explain ${topic} with an example.`];

    const available = questions.filter(
      q => !previousQuestions.includes(q)
    );

    return (
      available[0] ||
      `Explain ${topic} with an example.`
    );
  }

}
async function evaluateAnswer(question, answer, topic) {
  try {

    const prompt = `
You are an expert technical interviewer.

Topic:
${topic}

Interview Question:
${question}

Candidate Answer:
${answer}

Evaluate the candidate's answer.

Return ONLY valid JSON in this format:

{
  "score": 8,
  "feedback": "Overall feedback",
  "strengths": [
    "Strong point 1",
    "Strong point 2"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2"
  ]
}

Rules:
- strengths must be an array.
- improvements must be an array.
- Give 2 to 4 concise points for each.
`;

    const response = await ai.models.generateContent({
      model: "models/gemini-flash-latest",
      contents: prompt,
    });

    const text = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(text);

  } catch (error) {

    console.log("Gemini unavailable. Using fallback evaluation.");

    const words = answer.trim().split(/\s+/).filter(Boolean).length;

    let score = 4;

    if (words > 25) score = 6;
    if (words > 60) score = 8;
    if (words > 100) score = 9;

    return {
      score,
      feedback:
        "AI evaluation is temporarily unavailable. This score is based on answer length.",
        strengths:
        words > 25
          ? [
              "Attempted the question with reasonable detail",
              "Good effort"
            ]
          : [
              "Answer submitted"
            ],
      
      improvements: [
        "Explain concepts in more detail",
        "Add real-world examples",
        "Use technical terminology where appropriate"
      ]
    };
  }
}

module.exports = {
  generateQuestion,
  evaluateAnswer,
};