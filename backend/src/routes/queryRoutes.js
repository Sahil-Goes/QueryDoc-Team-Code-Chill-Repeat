const express = require('express');
const queryController = require('../controllers/queryController');

const router = express.Router();
router.post('/', queryController.processQuery);

module.exports = router;