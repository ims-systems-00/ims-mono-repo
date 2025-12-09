import Select from "react-select";
import { imsLogger } from "@/services/loggerService";
import usePlacesAutocomplete from "use-places-autocomplete";
const PlacesAutoComplete = ({ onSelected = () => {} }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
  } = usePlacesAutocomplete();
  imsLogger(data);
  return (
    <Select
      placeholder={"Search location"}
      className="react-select default"
      classNamePrefix="react-select"
      onChange={(e) => {
        onSelected(e);
      }}
      onInputChange={(value) => {
        setValue(value);
      }}
      options={
        status === "OK"
          ? data.map((place) => ({
              value: place.description,
              label: place.description,
            }))
          : []
      }
    />
  );
};
export default PlacesAutoComplete;
