import { useJsApiLoader } from "@react-google-maps/api";
import React from "react";
import SelectLocation from "./SelectLocation";

const googleLibraries = ["places"];
const ImsLocationPicker = (props) => {
  let { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: googleLibraries,
  });
  if (!isLoaded) return <span className="text-success">Loading picker...</span>;
  if (loadError)
    return (
      <span className="text-danger">Error occurred while loading picker.</span>
    );
  return <SelectLocation {...props} />;
};

export default ImsLocationPicker;
