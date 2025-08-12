const express = require('express');
const multer = require('multer');
const documentController = require('../controllers/documentController');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/upload', upload.single('file'), documentController.uploadDocument);

module.exports = router;