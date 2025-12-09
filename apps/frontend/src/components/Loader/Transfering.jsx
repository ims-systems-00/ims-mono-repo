import React from "react";
import { useEffect, useState } from "react";
function textClasses(color) {
  switch (color) {
    case "waring":
      return "text-warning";
    case "info":
      return "text-info";
    case "success":
      return "text-success";
    case "primary":
      return "text-primary";
    case "danger":
      return "text-danger";
    case "light":
      return "text-light";
    default:
      return "";
  }
}
function animationClasses(color) {
  return color ? color : "";
}
const transferDots = 20;
const Transfering = ({ color = "primary", text = "Transfer in progress" }) => {
  const [progress, setProgress] = useState("");
  function renderDotCount(c) {
    let count = 1;
    return () => {
      if (count < c) count++;
      else count = 1;
      return count;
    };
  }
  let runAnimation = renderDotCount(transferDots);
  function renderDots() {
    const count = runAnimation();
    setProgress(
      Array.from(Array(transferDots).keys())
        .map((item) => (item === count || item === count - 1 ? " * " : " . "))
        .join("")
    );
  }
  useEffect(() => {
    let interval = setInterval(renderDots, 80);
    return () => clearInterval(interval);
  }, []);
  return (
    <React.Fragment>
      <span className={"text-center " + textClasses(color)}>
        <i className="fa-solid fa-user"></i> {progress}{" "}
        <i className="fa-solid fa-user"></i>
      </span>
      <span className={"text-center " + textClasses(color)}>{text}</span>
    </React.Fragment>
  );
};

export default Transfering;
