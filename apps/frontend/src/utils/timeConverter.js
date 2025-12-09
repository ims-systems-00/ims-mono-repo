export default function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
    days = Math.floor((duration / (1000 * 60 * 60 * 24)) % 30);

  hours = hours < 10 ? "0" + hours : hours;

  minutes = minutes < 10 ? "0" + minutes : minutes;

  seconds = seconds < 10 ? "0" + seconds : seconds;

  days = days < 10 ? "0" + days : days;

  return { hours, minutes, seconds, days };
}
