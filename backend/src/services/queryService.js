exports.handleQuery = (query) => {
  return {
    decision: 'Approved',
    amount: 'Rs. 1,50,000',
    justification: `Matched clauses for query: "${query}"`
  };
};