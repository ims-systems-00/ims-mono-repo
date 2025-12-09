import Map from "./Map";

const DirectionPicker = ({
  onDirectionsPicked = () => {},
  travelMode = "driving",
}) => {
  return (
    <Map travelMode={travelMode} onDirectionsPicked={onDirectionsPicked} />
  );
};
export default DirectionPicker;
