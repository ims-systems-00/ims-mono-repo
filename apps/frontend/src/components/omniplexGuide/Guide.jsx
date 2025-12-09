import React from "react";
import useJourney from "./useJourney";
const OmniplexGuide = () => {
  const { scriptLoaded, initiateOmniplexGuide } = useJourney();
  React.useEffect(() => {
    if (scriptLoaded) {
      initiateOmniplexGuide();
    }
  }, [scriptLoaded]);
  return <React.Fragment></React.Fragment>;
};

export default OmniplexGuide;
