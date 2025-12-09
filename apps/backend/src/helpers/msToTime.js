function msToTime(duration) {
  const secondsInMinute = 60;
  const secondsInHour = 60 * secondsInMinute;
  const secondsInDay = 24 * secondsInHour;
  const secondsInMonth = 30.44 * secondsInDay; // Average month length

  let totalSeconds = Math.floor(duration / 1000);

  const months = Math.floor(totalSeconds / secondsInMonth);
  totalSeconds %= secondsInMonth;

  const days = Math.floor(totalSeconds / secondsInDay);
  totalSeconds %= secondsInDay;

  const hours = Math.floor(totalSeconds / secondsInHour);
  totalSeconds %= secondsInHour;

  const minutes = Math.floor(totalSeconds / secondsInMinute);
  const seconds = totalSeconds % secondsInMinute;

  return {
    months: months,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  };
}
module.exports = {
  msToTime,
};
