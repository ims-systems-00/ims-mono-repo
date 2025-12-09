import { Button } from "@ims-systems-00/ims-ui-kit";

const DocDownload = ({ ...rest }) => {
  return (
    <>
      <Button
        {...rest}
        color="success"
        size="sm"
        className="btn-icon  like btn-success"
      >
        <i className="tim-icons icon-cloud-download-93" />
      </Button>
    </>
  );
};

export default DocDownload;
