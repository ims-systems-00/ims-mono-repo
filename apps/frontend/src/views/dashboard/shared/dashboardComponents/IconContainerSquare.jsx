import Box from "./Box";
import classNames from "classnames";

const IconContainerSquare = ({ children, className, ...rest }) => {
  return (
    <Box
      height={50}
      width={50}
      padding={0}
      rounded={1}
      className={classNames(
        "rounded  bg-secondary-extra-light border d-flex justify-content-center align-items-center object-fit-contain ",
        className
      )}
      {...rest}
    >
      {children}
    </Box>
  );
};

export default IconContainerSquare;
