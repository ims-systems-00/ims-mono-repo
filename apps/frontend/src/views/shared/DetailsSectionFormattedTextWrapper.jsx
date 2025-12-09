import classNames from "classnames";
const DetailsSectionFormattedTextWrapper = ({
  label,
  labelClass = "font-weight-bold font-size-14",
  children,
}) => {
  // let labelFont = `font-weight-bold font-size-14`;
  return (
    <>
      <div className="d-flex mt-3">
        <span
          className={classNames("", {
            [`${labelClass}`]: labelClass,
          })}
        >
          {label}{" "}
        </span>
      </div>
      {children}
    </>
  );
};

export default DetailsSectionFormattedTextWrapper;
