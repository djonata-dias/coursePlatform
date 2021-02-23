const convertToMinutes = (timeString) => {
  const newTime = timeString.match(/[0-9'\-]+/gi);
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  switch (newTime.length) {
    case 1:
      seconds = newTime[0];
      break;
    case 2:
      minutes = newTime[0];
      seconds = newTime[1];
      break;

    default:
      hours = newTime[0];
      minutes = newTime[1];
      seconds = newTime[2];
      break;
  }
  hours = Number(hours)
  minutes = Number(minutes)
  seconds = Number(seconds)

  const totalMinutes = ((hours * 60) + minutes + (seconds / 60)).toFixed(2);
  return totalMinutes;
};

module.exports = convertToMinutes  