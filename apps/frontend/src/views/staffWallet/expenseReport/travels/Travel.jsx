import { Button, Col, Row, Spinner } from "@ims-systems-00/ims-ui-kit";
import { useState } from "react";
import USER_ACTIONS from "../actions";
import { useExpenseReport } from "../store";
import TravelForm from "./TravelForm";

const Travel = ({ travel }) => {
  let { processing, handleDeleteTravel, editMode, toggleEditMode } =
    useExpenseReport();
  return editMode ? (
    <TravelForm travel={travel} toggleEditMode={toggleEditMode} />
  ) : (
    <div className="content">
      <Row className="">
        <Col md="2">
          <span className="text-right">
            <span className="">
              {travel.transport}{" "}
              {travel.transport !== "Public transport" && "travel"}
            </span>{" "}
            {travel.transport === "Car" ? (
              <i className="icon-icon-car-24" />
            ) : travel.transport === "Air" ? (
              <i className="icon-icon-airplanetilt-24" />
            ) : (
              <i className="icon-icon-bus-24" />
            )}{" "}
          </span>
        </Col>
        <Col md="10">
          <Row>
            <Col md="8">
              <span>
                From
                <span className="text-secondary"> {travel.from} </span>
                To
                <span className="text-secondary"> {travel.to} </span>(
                {(travel.distance * 0.62).toFixed(2)} Miles)
              </span>
            </Col>
            <Col md="2">
              <p className="text-success">£{travel.cost.toFixed(2)}</p>
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
                  processing[USER_ACTIONS.DELETE_TRAVEL].id === travel._id
                }
                size="sm"
                name="delete"
                id="delete"
                color="link"
                className="btn-link-danger border border-0"
                onClick={() => handleDeleteTravel(travel._id)}
              >
                {processing[USER_ACTIONS.DELETE_TRAVEL].status &&
                processing[USER_ACTIONS.DELETE_TRAVEL].id === travel._id ? (
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

export default Travel;
