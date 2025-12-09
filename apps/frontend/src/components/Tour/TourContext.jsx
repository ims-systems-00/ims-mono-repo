import Box from "@/components/Box/Index";
import React, { useContext, useState } from "react";
import  classNames from "classnames";
import Joyride, { STATUS } from "react-joyride";

export const TourContext = React.createContext({
  setSteps: function () {},
  startTour: function () {},
  setRun: function () {},
  setCallback: function () {},
  markTourAsEnded: function () {},
});

export function useTour() {
  return useContext(TourContext);
}

function emptyCallback() {}

export function TourProvider({ children }) {
  const [run, setRun] = useState(false);
  const [callback, setCallback] = useState(emptyCallback);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  function startTour(course) {
    setSteps(course.steps || []);
    setCallback(() => course.callback || emptyCallback);
    setCurrentStep(0);
    setRun(true);
  }

  function markTourAsEnded() {
    setRun(false);
    setCallback(() => emptyCallback);
    setSteps([]);
    setCurrentStep(0);
  }

  function getStep(stepId) {
    return steps.find((step) => step.target === `[data-tour-step="${stepId}"]`);
  }

  const handleCallback = (data) => {
    const { status } = data;
    if (callback) {
      callback({
        ...data,
        setCurrentStep: setCurrentStep,
        pauseTour: () => setRun(false),
        resumeTour: () => setRun(true),
      });
    }
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      markTourAsEnded();
    }
  };

  return (
    <>
      <Joyride
        run={run}
        steps={steps}
        callback={handleCallback}
        styles={{
          options: {
            arrowColor: "#ffff",
            backgroundColor: "#0040a3",
            overlayColor: "rgba(0, 0, 0, 0.6)",
            primaryColor: "#000",
            textColor: "#004a14",
            zIndex: 1060,
          },
          overlay: {
            mixBlendMode: "darken",
          },
          spotlight: {
            borderRadius: "12px",
            border: "2px solid #0040a3",
            backgroundColor: "#ffff",
          },
        }}
        stepIndex={currentStep}
        showSkipButton
        hideBackButton
        tooltipComponent={Tooltip}
      />
      <TourContext.Provider
        value={{
          setSteps,
          setCallback,
          setRun,
          startTour,
          markTourAsEnded,
          getStep,
          run,
          steps,
          currentStep,
        }}
      >
        {children}
      </TourContext.Provider>
    </>
  );
}

function Tooltip({
  backProps,
  continuous,
  index,
  isLastStep,
  primaryProps,
  skipProps,
  step,
  tooltipProps,
}) {
  return (
    <Box minWidth={360} maxWidth={400} {...tooltipProps}>
      <div>
        {step.title && <h5>{step.title}</h5>}
        {step.content && (
          <div className="text-justify pt-2 fs-6 fw-medium">{step.content}</div>
        )}
      </div>
      <div className="mt-4">
        <div
          className={classNames("d-flex align-items-center", {
            "justify-content-end": isLastStep,
            "justify-content-between": !isLastStep,
          })}
        >
          {!isLastStep && (
            <button
              className="border-0 text-capitalize fs-6 bg-transparent p-0 fw-bold"
              {...skipProps}
            >
              skip
            </button>
          )}
          <div>
            {/* {index > 0 && (
              <Button {...backProps} size="sm">
                back
              </Button>
            )} */}

            <button
              className="border-0 text-success text-capitalize fs-6 bg-transparent fw-bold"
              {...primaryProps}
            >
              {isLastStep ? "Finish" : "next"}
            </button>
          </div>
        </div>
      </div>
    </Box>
  );
}
export default TourProvider;
