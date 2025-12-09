import { useContext } from "react";
import { JourneyContext } from "./Context";
export default function useJourney() {
  const { ...store } = useContext(JourneyContext);
  return { ...store };
}
