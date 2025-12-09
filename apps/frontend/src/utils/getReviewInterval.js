import moment from "moment";

/**
 * Get the next review date based on creation date and interval
 * @param {Date | string} created - The creation date
 * @param {"Yearly" | "Half-Yearly" | "Quarterly"} interval - The interval type
 * @returns {string} - The next review date
 */
export const getReviewInterval = (created, interval) => {
  if (!created || !interval) return "";

  const startDate = moment(created);
  let nextDate = startDate.clone();

  const addDuration = {
    Yearly: { years: 1 },
    "Half yearly": { months: 6 },
    Quarterly: { months: 4 },
  }[interval];

  while (nextDate.isSameOrBefore(moment(), "day")) {
    nextDate.add(addDuration);
  }

  return nextDate.format("ll");
};
