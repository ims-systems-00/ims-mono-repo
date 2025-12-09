import NotificationContext from "@/contexts/notificationContext";
import useProcessingControl from "@/hooks/useProcessingControl";
import { Button, Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { imsLogger } from "@/services/loggerService";
import { deleteWorkingLocation } from "@/services/userServices";
import USER_ACTIONS from "./actions";

const Location = ({ userId, location, refreshUser }) => {
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.DELETE_LOCATION },
  ]);
  let notify = React.useContext(NotificationContext);
  let handleDeleteAddress = async (e) => {
    try {
      dispatch({
        [USER_ACTIONS.DELETE_LOCATION]: {
          status: true,
          error: false,
          id: location._id,
        },
      });
      let { data } = await deleteWorkingLocation(userId, location._id);
      notify("Address deleted successfully", "success");
      refreshUser && refreshUser(data.user);
      dispatch({
        [USER_ACTIONS.DELETE_LOCATION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.DELETE_LOCATION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("Location", ex.response || ex);
      notify("Address delete failed.Unknown server error occurred", "danger");
    }
  };
  return (
    <div className="content">
      <Row className="">
        <Col md="3">
          <span className="text-right">
            <span className="">{location.type} </span>{" "}
            {<i className="ims-icons-20 icon-icon-mappinline-24" />}{" "}
          </span>
        </Col>
        <Col md="9">
          <Row>
            <Col md="9">
              <span>
                Location
                <span className="text-secondary"> {location.address} </span>
              </span>
            </Col>
            <Col md="3">
              <Button
                disabled={
                  processing[USER_ACTIONS.DELETE_LOCATION].status &&
                  processing[USER_ACTIONS.DELETE_LOCATION].id === location._id
                }
                size="sm"
                // className=" btn-danger p-0 m-0"
                color="link"
                outline
                className="btn-link-danger border border-0 p-0 m-0"
                onClick={() => handleDeleteAddress()}
              >
                {processing[USER_ACTIONS.DELETE_LOCATION].status &&
                processing[USER_ACTIONS.DELETE_LOCATION].id === location._id
                  ? "Deleting..."
                  : "Delete"}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Location;
