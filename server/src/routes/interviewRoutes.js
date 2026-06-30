const router  = require('express').Router();
const protect = require('../middleware/authMiddleware');
const { aiLimiter } = require('../middleware/rateLimiter');
const ctrl    = require('../controllers/interviewController');

// All routes are protected — must be logged in
router.use(protect);

router.post('/start',        ctrl.start);
router.post('/answer',   aiLimiter, ctrl.submitAnswer);
router.post('/answer',       ctrl.submitAnswer);
router.patch('/:id/end',     ctrl.end);
router.get('/history',       ctrl.getHistory);
router.get('/:id',           ctrl.getOne);

module.exports = router;