const documentService = require('../services/documentService');

exports.uploadDocument = (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });
  const id = documentService.saveDocument(file);
  res.status(201).json({ message: 'Document uploaded', id });
};