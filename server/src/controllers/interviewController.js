const Interview = require('../models/Interview');
const { generateQuestion, evaluateAnswer } = require('../services/aiService');

exports.start = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({
        message: 'Topic and difficulty are required'
      });
    }

    // Generate first question
    const result = await generateQuestion(topic, difficulty);

    const question = result.question;
    const mode = result.mode;

    const session = await Interview.create({
      user: req.user._id,
      topic,
      difficulty,
      turns: [{ question }],
    });

    res.status(201).json({
      sessionId: session._id,
      question,
      mode,
      turnNumber: 1,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


// POST /api/interviews/answer
exports.submitAnswer = async (req, res) => {
  try {
    const { sessionId, answer } = req.body;

    if (!sessionId || !answer) {
      return res.status(400).json({
        message: 'Session ID and answer are required'
      });
    }

    const session = await Interview.findById(sessionId);

    if (!session) {
      return res.status(404).json({
        message: 'Session not found'
      });
    }

    if (session.status === 'completed') {
      return res.status(400).json({
        message: 'Interview already completed'
      });
    }

    // Evaluate current answer
    const lastTurn = session.turns[session.turns.length - 1];

    const evaluation = await evaluateAnswer(
      lastTurn.question,
      answer,
      session.topic
    );

    // Save answer + feedback
    lastTurn.answer = answer;
    lastTurn.score = evaluation.score;
    lastTurn.feedback = evaluation.feedback;

    // Check how many questions have been answered
    const answeredQuestions = session.turns.filter(
      (t) => t.answer
    ).length;

    // Complete interview after 3 answered questions
    if (answeredQuestions >= 3) {

      const avgScore =
        session.turns.reduce(
          (sum, t) => sum + (t.score || 0),
          0
        ) / answeredQuestions;

      session.overallScore = Number(avgScore.toFixed(1));
      session.status = 'completed';

      await session.save();

      return res.json({
        completed: true,
        evaluation,
        overallScore: session.overallScore,
        totalQuestions: answeredQuestions,
      });
    }

    // Previous questions
    const previousQuestions = session.turns.map(
      (t) => t.question
    );

    // Generate next question
    const nextResult = await generateQuestion(
      session.topic,
      session.difficulty,
      previousQuestions
    );

    const nextQuestion = nextResult.question;
    const mode = nextResult.mode;

    session.turns.push({
      question: nextQuestion,
    });

    await session.save();

    res.json({
      completed: false,
      evaluation,
      nextQuestion,
      mode,
      turnNumber: session.turns.length,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


// PATCH /api/interviews/:id/end
exports.end = async (req, res) => {
  try {
    const session = await Interview.findById(req.params.id);

    if (!session) {
      return res.status(404).json({
        message: 'Session not found'
      });
    }

    // Calculate overall score
    const answeredTurns = session.turns.filter(
      (t) => t.answer
    );

    const avgScore = answeredTurns.length
      ? answeredTurns.reduce(
          (sum, t) => sum + t.score,
          0
        ) / answeredTurns.length
      : 0;

    session.overallScore =
      Math.round(avgScore * 10) / 10;

    session.status = 'completed';

    await session.save();

    res.json({
      message: 'Interview completed',
      overallScore: session.overallScore,
      totalQuestions: answeredTurns.length,
      session,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


// GET /api/interviews/history
exports.getHistory = async (req, res) => {
  try {
    const interviews = await Interview.find({
      user: req.user._id
    })
      .sort({ createdAt: -1 })
      .select(
        'topic difficulty overallScore status createdAt turns'
      );

    res.json({
      interviews
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


// GET /api/interviews/:id
exports.getOne = async (req, res) => {
  try {
    const interview = await Interview.findById(
      req.params.id
    );

    if (!interview) {
      return res.status(404).json({
        message: 'Interview not found'
      });
    }

    res.json({
      interview
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};