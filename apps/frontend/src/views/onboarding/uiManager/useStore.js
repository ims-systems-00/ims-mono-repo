import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
export default function useStore(config) {
  const [activeStep, setActiveStep] = useState("");
  const stepsasKeys = Object.keys(config.steps);
  const history = useHistory();
  function activateStep(key) {
    setActiveStep(key);
  }
  function isFirstStep() {
    return stepsasKeys.findIndex((step) => step === activeStep) === 0;
  }
  function isLastStep() {
    return (
      stepsasKeys.findIndex((step) => step === activeStep) ===
      stepsasKeys.length - 1
    );
  }
  function nextStep() {
    let currentStepIndex = stepsasKeys.findIndex((step) => step === activeStep);
    if (currentStepIndex === stepsasKeys.length - 1) return;
    activateStep(stepsasKeys[++currentStepIndex]);
  }
  function prevStep() {
    let currentStepIndex = stepsasKeys.findIndex((step) => step === activeStep);
    if (currentStepIndex === 0) return history.goBack();
    activateStep(stepsasKeys[--currentStepIndex]);
  }
  useEffect(() => {
    activateStep(stepsasKeys[0]);
  }, []);
  return {
    activeStep,
    activateStep,
    prevStep,
    nextStep,
    isFirstStep,
    isLastStep,
  };
}
