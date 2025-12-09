import { Button } from "@ims-systems-00/ims-ui-kit";

const DocDelete = ({ ...rest }) => {
  return (
    <>
      <Button
        {...rest}
        color="danger"
        size="sm"
        className="btn-icon  like btn-success"
      >
        <i className="ims-icons-20 icon-icon-trash-24" />
      </Button>
    </>
  );
};

export default DocDelete;
