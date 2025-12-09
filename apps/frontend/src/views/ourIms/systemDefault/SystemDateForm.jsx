import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { imsLogger } from "@/services/loggerService";
import {
  mapToSystemDates,
  setSystemDates,
} from "@/services/organizationService";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/CustomFormElements";
import { ImsInputDate } from "@ims-systems-00/ims-ui-kit";
import ACTIONS from "./actions";

const SystemDateForm = ({ systemDate, processing, dispatch }) => {
  let notify = React.useContext(NotificationContext);
  const dataSet = systemDate
    ? mapToSystemDates(systemDate)
    : {
        data: {
          start: "",
          end: "",
        },
        errors: {},
      };
  const schema = {
    start: IVal.label("System start date"),
    end: IVal.label("System end date"),
  };

  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "confirm": {
          dispatch({
            [ACTIONS.UPDATE_SYSTEMDATES]: {
              status: true,
              error: false,
              id: null,
            },
          });
          let { data } = await setSystemDates(dataModel.data);
          notify("System date updated successfully", "success");
          dispatch({
            [ACTIONS.UPDATE_SYSTEMDATES]: {
              status: false,
              error: false,
              id: null,
            },
          });
          break;
        }
      }
    } catch (ex) {
      dispatch({
        [ACTIONS.UPDATE_SYSTEMDATES]: { status: false, error: false, id: null },
      });
      imsLogger("SystemDateForm", ex.response || ex);
      notify(ex.response && ex.response.data.message, "danger");
    }
  };
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );

  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal" onSubmit={handleSubmit}>
      <Row>
        <Col md="6">
          <ImsInputDate
            label="System start date"
            name="start"
            value={data.start}
            onChange={handleChange}
            error={errors.start}
          />
        </Col>
        <Col md="6">
          <ImsInputDate
            label="System end date"
            name="end"
            value={data.end}
            onChange={handleChange}
            error={errors.end}
          />
        </Col>
      </Row>

      <ImsButtonGroup>
        {" "}
        <Button
          name="confirm"
          onClick={(e) => handleSubmit(e, doSubmit, false)}
          disabled={
            validate() ? true : processing[ACTIONS.UPDATE_SYSTEMDATES].status
          }
          className="btn-fill"
          color="primary"
          type="button"
        >
          {processing[ACTIONS.UPDATE_SYSTEMDATES].status
            ? "Processing..."
            : "Confirm"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default SystemDateForm;
