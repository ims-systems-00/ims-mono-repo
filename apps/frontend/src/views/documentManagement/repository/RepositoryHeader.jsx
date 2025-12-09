import { Col, Row, Button } from "@ims-systems-00/ims-ui-kit";
import { useHistory } from "react-router-dom";
import RepositoryActions from "./RepositoryActions";
import useRepository from "./store/useRepository";
const RepositoryHeader = ({}) => {
  let { repository, totalFiles } = useRepository();
  let history = useHistory();
  return (
    <Row className="mb-4">
      <Col lg={12}>
        <h4 className="d-inline font-weight-600 text-dark mb-2">
          {" "}
          <Button
            size="sm"
            outline
            className="border-0"
            onClick={() => history.push("/admin/document-repositories")}
          >
            <i className="fa-solid fa-arrow-left" />
          </Button>{" "}
          Repository: {repository?.name}
        </h4>{" "}
        {" - "}
        Reference: {repository?.reference}
        <span className="pull-right d-flex align-items-center">
          <span>
            <b>{totalFiles} </b>
            files total
          </span>{" "}
          <RepositoryActions />
        </span>
        <span className="pull-right"></span>
        {/* <p className="font-weight-300">
          <span className="ml-2">{repository?.group?.name || "N/A"}</span>
        </p> */}
      </Col>
    </Row>
  );
};

export default RepositoryHeader;
