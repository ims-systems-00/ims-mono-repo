import Box from "@/components/Box/Index";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import { Link } from "react-router-dom";

const ManagementReview = ({ dataSet }) => {
  return (
    <Box className="bg-primary-light mt-2">
      <div className="d-flex align-items-center">
        <i class="fa-solid fa-circle"></i>{" "}
        <p className="card-category">
          <Link
            to="/admin/management-reviews"
            className="text-dark font-weight-bold mx-2"
          >
            Management Review
          </Link>
        </p>
      </div>
      <Row>
        <Col md="6" className="mb-3">
          <div className="numbers">
            <p className="card-category">Previous</p>
            <span className="">{dataSet.lastManagementReviewDate}</span>
          </div>
        </Col>
        <Col md="6">
          <div className="numbers">
            <p className="card-category">Next</p>
            <span className="">{dataSet.nextManagementReviewDate}</span>
          </div>
        </Col>
      </Row>
    </Box>
  );
};

export default ManagementReview;
