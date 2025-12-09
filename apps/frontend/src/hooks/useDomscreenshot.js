import { useScreenshot } from "use-react-screenshot";
const useDomscreenshot = () => {
  const [image, takeScreenshot] = useScreenshot();
  const captureImage = (elementId) => {
    if (typeof elementId === "string") {
      let selection = document.getElementById(elementId);
      takeScreenshot(selection);
    }
    if (elementId instanceof HTMLElement) {
      takeScreenshot(elementId);
    }
  };
  return {
    image,
    captureImage,
  };
};
export default useDomscreenshot;
