export function calculateCost(distance, amount, unit, type) {
  let cost = 0;
  if (unit === "kmph") {
    cost = (distance / 1000) * amount;
  } else {
    cost = (distance / 1609.34) * amount;
  }
  cost = type.value === "Round trip" ? 2 * cost : cost;

  return cost.toFixed(2);
}
