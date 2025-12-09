import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { mapToRatingModel, updateRating } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { ImsInputSelect } from "@ims-systems-00/ims-ui-kit";
import ACTIONS from "./actions";

const ratings = [
  "Not rated",
  "Inadequate",
  "Requires improvement",
  "Good",
  "Outstanding",
];

const RatingForm = ({
  overview,
  processing,
  dispatch,
  refreshOverview,
  ...props
}) => {
  let notify = React.useContext(NotificationContext);
  const dataSet = overview
    ? mapToRatingModel(overview)
    : {
        data: {
          safe: {
            value: "Not rated",
            label: "Not rated",
          },
          effective: {
            value: "Not rated",
            label: "Not rated",
          },
          caring: {
            value: "Not rated",
            label: "Not rated",
          },
          responsive: {
            value: "Not rated",
            label: "Not rated",
          },
          wellLed: {
            value: "Not rated",
            label: "Not rated",
          },
          overall: {
            value: "Not rated",
            label: "Not rated",
          },
        },
        errors: {},
      };
  const schema = {
    safe: IVal.object().keys({
      value: IVal.label("Safe"),
      label: IVal.label("Safe"),
    }),
    effective: IVal.object().keys({
      value: IVal.label("Effective"),
      label: IVal.label("Effective"),
    }),
    caring: IVal.object().keys({
      value: IVal.label("Caring"),
      label: IVal.label("Caring"),
    }),
    responsive: IVal.object().keys({
      value: IVal.label("Responsive"),
      label: IVal.label("Responsive"),
    }),
    wellLed: IVal.object().keys({
      value: IVal.label("Well Led"),
      label: IVal.label("Well Led"),
    }),
    overall: IVal.object().keys({
      value: IVal.label("Well Led"),
      label: IVal.label("Well Led"),
    }),
  };
  const { dataModel, handleChange, handleSubmit, validate, setDataModel } =
    useForm(dataSet, schema);
  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "update": {
          dispatch({
            [ACTIONS.UPDATE_RATINGS]: {
              status: true,
              error: false,
              id: null,
            },
          });
          let { data } = await updateRating(dataModel.data, {
            query: `group=${overview.group._id}`,
          });
          refreshOverview && refreshOverview(data.overview);
          notify("Rating updated successfully", "success");
          dispatch({
            [ACTIONS.UPDATE_RATINGS]: {
              status: false,
              error: false,
              id: null,
            },
          });
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      dispatch({
        [ACTIONS.UPDATE_RATINGS]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("CQCRatingForm", ex.response, ex);
      notify("Unknown server error occurred", "danger");
    }
    dispatch({ action: null, id: null });
  };
  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal">
      <Row>
        <Col md="6">
          <ImsInputSelect
            label="Safe"
            name="safe"
            value={data.safe}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={ratings.map((rating) => ({
              value: rating,
              label: rating,
            }))}
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            label="Effective"
            name="effective"
            value={data.effective}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={ratings.map((rating) => ({
              value: rating,
              label: rating,
            }))}
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            label="Caring"
            name="caring"
            value={data.caring}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={ratings.map((rating) => ({
              value: rating,
              label: rating,
            }))}
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            label="Responsive"
            name="responsive"
            value={data.responsive}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={ratings.map((rating) => ({
              value: rating,
              label: rating,
            }))}
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            label="Well Led"
            name="wellLed"
            value={data.wellLed}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={ratings.map((rating) => ({
              value: rating,
              label: rating,
            }))}
          />
        </Col>
        <Col md="6">
          <ImsInputSelect
            label="Overall"
            name="overall"
            value={data.overall}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={ratings.map((rating) => ({
              value: rating,
              label: rating,
            }))}
          />
        </Col>
      </Row>

      <ImsButtonGroup>
        <Button
          name="update"
          onClick={(e) => handleSubmit(e, doSubmit, false)}
          disabled={
            validate() ? true : processing[ACTIONS.UPDATE_RATINGS].status
          }
          className="btn-fill"
          color="primary"
          type="button"
        >
          {processing[ACTIONS.UPDATE_RATINGS].status ? "Processing" : "Update"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default RatingForm;
