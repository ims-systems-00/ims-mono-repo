import ReactGA from "react-ga4";
function useGoogleAnalyticsEventTracker(category) {
  let trackEvent = (action, label) => {
    ReactGA.event({
      category,
      action,
      label,
    });
  };
  return {
    trackEvent,
  };
}

export default useGoogleAnalyticsEventTracker;
