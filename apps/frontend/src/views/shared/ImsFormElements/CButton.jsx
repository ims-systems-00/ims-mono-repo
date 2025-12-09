import { Button } from "@ims-systems-00/ims-ui-kit";

const CButton = ({ children, ...rest }) => {
  return <Button {...rest}>{children}</Button>;
};

export default CButton;
