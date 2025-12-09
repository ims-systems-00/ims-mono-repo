import classNames from "classnames";

const Box = ({
  children,
  minHeight,
  height,
  maxHeight,
  className,
  width,
  minWidth,
  maxWidth,
  padding = 4,
  rounded = 3,
}) => {
  return (
    <div
      style={{
        minHeight,
        height,
        maxHeight,
        width,
        minWidth,
        maxWidth,
        padding,
      }}
      className={classNames(
        "bg-white ",
        { "p-0": padding === 0 },
        { "p-1": padding === 1 },
        { "p-2": padding === 2 },
        { "p-3": padding === 3 },
        { "p-4": padding === 4 },
        { "p-5": padding === 5 },
        { rounded: rounded === 1 },
        { "rounded-3": rounded === 3 },
        { "rounded-pill": rounded === "pill" },
        { "rounded-circle": rounded === "circle" },

        className
      )}
    >
      {children}
    </div>
  );
};

export default Box;
