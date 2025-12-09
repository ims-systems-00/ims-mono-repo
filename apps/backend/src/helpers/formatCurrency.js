function formatCurrency(value) {
  const K = 1e3;
  const M = 1e6;
  const B = 1e9;
  const originalValue = value;

  // Calculate billions, millions, and thousands
  const billions = Math.floor(value / B);
  value %= B;

  const millions = Math.floor(value / M);
  value %= M;

  const thousands = Math.floor(value / K);
  const H = value % K;

  return {
    B: billions || 0,
    M: millions || 0,
    K: thousands || 0,
    H: H || 0,
    actualValue: originalValue,
  };
}

module.exports = {
  formatCurrency,
};
