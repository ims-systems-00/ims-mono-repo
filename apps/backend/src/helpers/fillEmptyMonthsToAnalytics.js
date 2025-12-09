const MONTH_OF_YEAR = [
  "",
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const backFillMonths = (data = []) => {
  let preparedData = [];
  MONTH_OF_YEAR.forEach((MONTH) => {
    let match = data.find((d) => d._id === MONTH);
    if (match)
      return preparedData.push({
        ...match,
      });
    return preparedData.push({
      count: 0,
      _id: MONTH,
    });
  });
  return preparedData;
};

module.exports = {
  backFillMonths,
};
