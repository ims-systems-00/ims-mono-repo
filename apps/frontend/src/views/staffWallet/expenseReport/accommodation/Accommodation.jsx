import { Button, Col, Row, Spinner } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import USER_ACTIONS from "../actions";
import { useExpenseReport } from "../store";
import AccommodationForm from "./AccommodationForm";

const Accommodation = ({ accommodation }) => {
  let { processing, editMode, toggleEditMode, deleteAccommodation } =
    useExpenseReport();

  return editMode ? (
    <AccommodationForm
      accommodation={accommodation}
      toggleEditMode={toggleEditMode}
      drawerView
    />
  ) : (
    <div className="content">
      <Row className="">
        <Col md="2">
          <span className="text-right">
            <span className="">{accommodation.type} </span>{" "}
            {<i className="ims-icons-20 icon-icon-houseline-24" />}{" "}
          </span>
        </Col>
        <Col md="10">
          <Row>
            <Col md="4">
              <span>
                Location
                <span className="text-secondary">
                  {" "}
                  {accommodation.location}{" "}
                </span>
              </span>
            </Col>
            <Col md="4">
              <span>
                Check in
                <span className="text-secondary">
                  {" "}
                  {moment(accommodation.checkin).format(
                    "DD/MM/YYYY HH:MM"
                  )}{" "}
                </span>
                Check out
                <span className="text-secondary">
                  {" "}
                  {moment(accommodation.checkout).format(
                    "DD/MM/YYYY HH:MM"
                  )}{" "}
                </span>
              </span>
            </Col>
            <Col md="2">
              <span className="text-success">£{accommodation.cost}</span>
            </Col>
            <Col md="2">
              <Button
                size="sm"
                id="detail"
                className="border-0"
                color="link"
                onClick={() => toggleEditMode()}
              >
                <i className="ims-icons-20 icon-icon-pencil-24" />
              </Button>{" "}
              <Button
                disabled={
                  processing[USER_ACTIONS.DELETE_TRAVEL].status &&
                  processing[USER_ACTIONS.DELETE_TRAVEL].id ===
                    accommodation._id
                }
                size="sm"
                name="delete"
                id="delete"
                color="link"
                className="btn-link-danger border border-0"
                onClick={() => deleteAccommodation(accommodation._id)}
              >
                {processing[USER_ACTIONS.DELETE_TRAVEL].status &&
                processing[USER_ACTIONS.DELETE_TRAVEL].id ===
                  accommodation._id ? (
                  <Spinner size="sm" />
                ) : (
                  <i className="ims-icons-20 icon-icon-trash-24" />
                )}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
export default Accommodation;
