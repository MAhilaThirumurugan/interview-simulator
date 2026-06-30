exports.generateQuestion = async (
  topic,
  difficulty,
  previousQuestions = []
) => {
  const questions = {
    React: [
      'What is the difference between state and props?',
      'Explain useEffect hook.',
      'What is Virtual DOM?',
      'Explain Lifecycle of components?'
    ],
    JavaScript: [
      'What is closure in JavaScript?',
      'Explain event delegation.',
      'What is the difference between let and var?'
    ]
  };

  const topicQuestions =
    questions[topic] ||
    [`Explain ${topic} with an example.`];

  const available = topicQuestions.filter(
    q => !previousQuestions.includes(q)
  );

  return (
    available[0] ||
    `Explain ${topic} with an example.`
  );
};
exports.evaluateAnswer = async () => {
  return {
    score: 8,
    feedback:
      'Good answer. Add more real-world examples.',
    strengths:
      'Concept explanation is clear.',
    improvements:
      'Include more practical examples.'
  };
};