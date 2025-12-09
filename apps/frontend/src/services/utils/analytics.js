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
export function backFillMonths(data) {
  let today = new Date();
  let currentMonth = today.getMonth() + 1;
  let monthlyCampaign = [];
  let iterator = 0;
  while (monthlyCampaign.length < 6) {
    if (currentMonth < 1) currentMonth = 12;
    if (data[iterator] && data[iterator]._id === MONTH_OF_YEAR[currentMonth]) {
      monthlyCampaign.unshift(data[iterator]);
      iterator++;
    } else {
      monthlyCampaign.unshift({ count: 0, _id: MONTH_OF_YEAR[currentMonth] });
    }
    currentMonth--;
  }
  return monthlyCampaign;
}
