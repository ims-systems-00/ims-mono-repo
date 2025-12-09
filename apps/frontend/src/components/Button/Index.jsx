import { Button } from "@ims-systems-00/ims-ui-kit";

const Index = ({ children, onSelect, disabled = false }) => {
  return (
    <span className="ims-faded-button">
      <Button disabled={disabled} onClick={onSelect}>
        {children}
      </Button>
    </span>
  );
};

export default Index;
