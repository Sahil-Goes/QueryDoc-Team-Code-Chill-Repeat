const queryService = require('../services/queryService');

exports.processQuery = (req, res) => {
  const { query } = req.body;
  const result = queryService.handleQuery(query);
  res.json(result);
};