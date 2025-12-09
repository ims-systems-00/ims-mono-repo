import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Form } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { imsLogger } from "@/services/loggerService";
import {
  mapToIncidentResolutionTime,
  updateIncidentResolution,
} from "@/services/organizationService";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { ImsInputText } from "@ims-systems-00/ims-ui-kit";
import ACTIONS from "./actions";

const ResolutionForm = ({ resolutionTime, processing, dispatch }) => {
  let notify = React.useContext(NotificationContext);
  let dataSet = resolutionTime
    ? mapToIncidentResolutionTime(resolutionTime)
    : {
        data: {
          p1incidentResolutionTime: 0,
          p2incidentResolutionTime: 0,
          p3incidentResolutionTime: 0,
          p4incidentResolutionTime: 0,
        },
        errors: {},
      };
  const schema = {
    p1incidentResolutionTime: IVal.number().min(0).label("P1 resolution time"),
    p2incidentResolutionTime: IVal.number().min(0).label("P2 resolution time"),
    p3incidentResolutionTime: IVal.number().min(0).label("P3 resolution time"),
    p4incidentResolutionTime: IVal.number().min(0).label("P4 resolution time"),
  };
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "confirm": {
          dispatch({
            [ACTIONS.UPDATE_RESOLUTION]: {
              status: true,
              error: false,
              id: null,
            },
          });
          let { data } = await updateIncidentResolution(dataModel.data);
          notify("Incident resolution updated successfully", "success");
          dispatch({
            [ACTIONS.UPDATE_RESOLUTION]: {
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
        [ACTIONS.UPDATE_RESOLUTION]: { status: false, error: true, id: null },
      });
      imsLogger("ResolutionForm", ex.response, ex);
      notify("Unknown server error occurred", "danger");
    }
  };

  let { data, errors } = dataModel;

  return (
    <Form action="/" className="form-horizontal" onSubmit={handleSubmit}>
      <ImsInputText
        type="number"
        label="P1 resolution time (hrs)"
        name="p1incidentResolutionTime"
        value={data.p1incidentResolutionTime}
        onChange={handleChange}
        error={errors.p1incidentResolutionTime}
      />
      <ImsInputText
        type="number"
        label="P2 resolution time (hrs)"
        name="p2incidentResolutionTime"
        value={data.p2incidentResolutionTime}
        onChange={handleChange}
        error={errors.p2incidentResolutionTime}
      />
      <ImsInputText
        type="number"
        label="P3 resolution time (hrs)"
        name="p3incidentResolutionTime"
        value={data.p3incidentResolutionTime}
        onChange={handleChange}
        error={errors.p3incidentResolutionTime}
      />
      <ImsInputText
        type="number"
        label="P4 resolution time (hrs)"
        name="p4incidentResolutionTime"
        value={data.p4incidentResolutionTime}
        onChange={handleChange}
        error={errors.p4incidentResolutionTime}
      />
      <ImsButtonGroup>
        <Button
          name="confirm"
          onClick={(e) => handleSubmit(e, doSubmit, false)}
          disabled={
            validate() ? true : processing[ACTIONS.UPDATE_RESOLUTION].status
          }
          className="btn-fill"
          color="primary"
          type="button"
        >
          {processing[ACTIONS.UPDATE_RESOLUTION].status
            ? "Processing..."
            : "Confirm"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default ResolutionForm;
