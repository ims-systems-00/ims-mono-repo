import Loading from "@/components/Loader/Loading";
import { Button, Col, Row, Spinner } from "@ims-systems-00/ims-ui-kit";
import { useCampaign } from "./store";

const Recipients = ({ lists, loadRecipients, processing, toolState }) => {
  const { overview } = useCampaign();
  return (
    <div className="content">
      <p className="text-primary mb-3">
        <i className="ims-icons-20 icon-icon-users-24 me-1"></i> Customer reach{" "}
        {overview?.totalCustomers}{" "}
        <i className="ms-3 ims-icons-20 icon-icon-envelope-24 me-1"></i>Total
        recipients {overview?.totalRecipients}
      </p>
      <Row>
        {lists &&
          lists.map((listItem) =>
            listItem.recipients.map((recipient) => (
              <Col md="6" key={recipient._id}>
                <div className="shadow-sm rounded-3 p-2 mb-2">
                  <p className="text-bold text-dark">
                    <i className="ims-icons-20 icon-icon-user-24 me-1"></i>
                    {recipient.name}
                    <br />
                  </p>
                  <small className="">
                    <i className="ims-icons-20 icon-icon-envelopesimple-24 me-1"></i>
                    <span className="text-secondary">{recipient.email}</span>
                  </small>
                </div>
              </Col>
            ))
          )}
        {toolState.pagination.hasNextPage && (
          <Button
            onClick={() => {
              loadRecipients();
            }}
            disabled={processing.action === "load-recipients"}
            className=" btn-block"
            color="primary"
          >
            {processing.action === "load-recipients" ? (
              <Loading />
            ) : (
              <span>
                View more{" "}
                <i className="ims-icons-16 icon-icon-filearrowdown-24" />
              </span>
            )}
          </Button>
        )}
      </Row>
    </div>
  );
};

export default Recipients;
