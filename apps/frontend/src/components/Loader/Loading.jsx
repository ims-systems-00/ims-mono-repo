import { Spinner } from "@ims-systems-00/ims-ui-kit";
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
const Loading = ({ color = "primary", text = "Loading...", height }) => {
  return (
    <p
      style={{ height: height }}
      className={"mt-3 text-center " + textClasses(color)}
    >
      <Spinner size={"sm"} color={animationClasses()} type="grow"></Spinner>{" "}
      {/* Loading */}
      <span className="text-secondary">{text}</span>
    </p>
  );
};

export default Loading;
