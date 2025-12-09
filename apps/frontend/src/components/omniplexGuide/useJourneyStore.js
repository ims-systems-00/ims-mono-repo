import { useEffect, useState } from "react";
import { getOmniplexToken } from "@/services/authService";
const omniplexJourneySource = process.env.REACT_APP_OMNIPLEX_SCRIPT;
const scriptId = "__omniplex__guide__script__";
export default function useJourneyStore(config) {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  function isScriptInTheDom() {
    return document.getElementById(scriptId);
  }
  /**
   * inject the script in the system...
   */
  useEffect(() => {
    // to be removed later : don't init in prod mode still in dev

    if (process.env.REACT_APP_ENV !== "staging") return;

    /** check if script already exist in the page */

    if (omniplexJourneySource && !isScriptInTheDom()) {
      const script = document.createElement("script");
      script.src = omniplexJourneySource;
      /** we are setting unique id for this script element */
      script.id = scriptId;
      script.async = true;
      script.onload = function () {
        setScriptLoaded(true);
      };
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, []);
  function initiateOmniplexGuide() {
    const token = getOmniplexToken();
    if (token && isScriptInTheDom()) {
      window.Guide.init({
        jwt: () =>
          new Promise((resolve, reject) => {
            resolve(token);
          }),
      });
    } else throw new Error("Token not found. Failed to init omniplex guide.");
  }
  function destroyOmniplexGuide() {
    if (isScriptInTheDom()) {
      window.Guide.destroy();
    }
  }
  return {
    scriptLoaded,
    initiateOmniplexGuide,
    destroyOmniplexGuide,
  };
}
