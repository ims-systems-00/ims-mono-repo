import moment from "moment";

const useTime = () => {
  function getTimeStops(start, end) {
    let startTime = moment(start, "HH:mm");
    let endTime = moment(end, "HH:mm");
    let timeStops = [];
    while (startTime < endTime) {
      timeStops.push(new moment(startTime).format("HH:mm"));
      startTime.add(30, "minutes");
    }
    return timeStops;
  }
  return {
    getTimeStops,
  };
};
export default useTime;
