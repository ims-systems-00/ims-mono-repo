import React, { useContext, useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  useLoadScript,
  useJsApiLoader,
} from "@react-google-maps/api";
import mapStyles from "./daylight.mapstyle";
import InputContainer from "./InputsContainer";
import NotificationContext from "@/contexts/notificationContext";
import USER_ACTIONS from "./actions";
import useProcessingControl from "@/hooks/useProcessingControl";
import Loading from "@/components/Loader/Loading";
import { imsLogger } from "@/services/loggerService";
import InformationBar from "./InformationBar";
const travelModes = new Map();
travelModes.set("bicycling", "BICYCLING");
travelModes.set("transit", "TRANSIT");
travelModes.set("driving", "DRIVING");
travelModes.set("walking", "WALKING");

const googleLibraries = ["places"];
const defaultMap = {
  center: { lat: 52.3555, lng: 1.1743 },
  zoom: 8,
  mapContainerStyle: {
    width: "100%",
    height: "100%",
  },
  options: {
    // styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: true,
  },
};
const defaultResultInfo = {
  origin: "",
  destination: "",
  duration: {
    text: "",
    value: 0,
  },
  distance: {
    text: "",
    value: 0,
  },
};
function IMSMap({ onDirectionsPicked, travelMode, ...rest }) {
  let notify = useContext(NotificationContext);
  let [mapState, setMapState] = useState(defaultMap);
  let { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
    libraries: googleLibraries,
  });
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_DIRECTIONS },
  ]);
  React.useEffect(() => {
    if ("geolocation" in navigator) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          setMapState((prevState) => ({
            ...prevState,
            center: { lat: pos.coords.latitude, lng: pos.coords.longitude },
          }));
        });
      } else {
        alert(
          "Error loading data.Sorry geolocation has been blocked on this device. Please refresh and allow access"
        );
      }
    } else {
    }
  }, []);
  let [resultentInfo, setResultentInfo] = useState(defaultResultInfo);
  let [directionResponse, setDirectionResponse] = useState(null);
  let onMapClick = React.useCallback((e) => {}, []);
  let onMapLoad = React.useCallback((map) => {}, []);
  let [inputDataSet, setInoutDataset] = useState({
    origin: "",
    destination: "",
  });
  let handleChange = (key, value) =>
    setInoutDataset((prevState) => ({ ...prevState, [key]: value }));
  const handleSearchDirections = async () => {
    try {
      dispatch({
        [USER_ACTIONS.LOAD_DIRECTIONS]: {
          status: true,
          error: false,
          id: null,
        },
      });
      if (inputDataSet.origin == "" || inputDataSet.destination == "") return;
      let google = window.google;
      let directionService = new google.maps.DirectionsService();
      const result = await directionService.route({
        origin: inputDataSet.origin,
        destination: inputDataSet.destination,
        travelMode: google.maps.TravelMode[travelModes.get(travelMode)],
      });
      let updatedInfo = {
        origin: result.request.origin.query,
        destination: result.request.destination.query,
        duration: {
          text: result.routes[0]?.legs[0]?.duration.text,
          value: result.routes[0]?.legs[0]?.duration.value,
        },
        distance: {
          text: result.routes[0]?.legs[0]?.distance.text,
          value: result.routes[0]?.legs[0]?.distance.value,
        },
      };
      /**
       * TODO: Sequence matters for onDirectionsPicked & setDirectionResponse,
       * google map stops working if onDirectionsPicked is placed later than state updater,
       * need to figure out the state updating and component lifecyle clash here
       */
      onDirectionsPicked(updatedInfo);
      setDirectionResponse(result);
      setResultentInfo((prevInfo) => ({
        ...prevInfo,
        ...updatedInfo,
      }));
      dispatch({
        [USER_ACTIONS.LOAD_DIRECTIONS]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (err) {
      imsLogger(err);
      notify("Directions not found with the provided info", "danger");
      dispatch({
        [USER_ACTIONS.LOAD_DIRECTIONS]: {
          status: false,
          error: true,
          id: null,
        },
      });
    }
  };
  if (!isLoaded) return <span className="text-success">Loading maps...</span>;
  if (loadError)
    return (
      <span className="text-danger">Error occurred while loading maps.</span>
    );
  return (
    <>
      <InputContainer
        onOriginChange={(val) => handleChange("origin", val)}
        onDestinationChange={(val) => handleChange("destination", val)}
        onSearch={handleSearchDirections}
      />
      {processing[USER_ACTIONS.LOAD_DIRECTIONS].status ? (
        <Loading />
      ) : (
        <InformationBar resultentInfo={resultentInfo} />
      )}
      <div className="google-map">
        <GoogleMap
          center={mapState.center}
          zoom={mapState.zoom}
          mapContainerStyle={mapState.mapContainerStyle}
          options={mapState.options}
          onClick={onMapClick}
          onLoad={onMapLoad}
        >
          <Marker position={mapState.center} />
          {directionResponse && (
            <>
              <DirectionsRenderer directions={directionResponse} />
            </>
          )}
        </GoogleMap>
      </div>
    </>
  );
}
export default IMSMap;
