import React from "react";

//third party libraries ...
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import IVal from "@/validations/validator";

// custom components ...
import { ImsInputCheck } from "@/views/shared/ImsFormElements/Index";
import { ImsInputText } from "@ims-systems-00/ims-ui-kit";

// api consumer services ...
import {
  mapToIncidentResolutionModel,
  resolveIncident,
} from "../../services/incidentManagenmentService";

// cotexts ...
import useForm from "@/hooks/useForm";
import { useContext } from "react";
import { imsLogger } from "@/services/loggerService";
import NotificationContext from "../../contexts/notificationContext";
import { IncidentActionsContext } from "./contexts/RiskActionsContext";

// default dataSet for the form fields ...

const IncidentResolution = ({ incident }) => {
  let { processing, setProcessing, refreshIncident } = useContext(
    IncidentActionsContext
  );
  const dataSet = incident
    ? mapToIncidentResolutionModel(incident)
    : {
        data: {
          resolution: "",
          resolveStatus: false,
        },
        errors: {},
      };

  // Validation rules ....

  const schema = {
    resolution: IVal.string().required().label("Resolution"),
    resolveStatus: IVal.label("Resolve"),
  };

  let notify = React.useContext(NotificationContext);

  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );

  // submission logic to sever goes here ...

  let doSubmit = async (e) => {
    setProcessing({ action: "resolve", id: null });
    try {
      let { data } = await resolveIncident(incident._id, dataModel.data);
      notify("Incident resolved successfully.", "success");
      refreshIncident(data.incident);
    } catch (ex) {
      imsLogger("IncidentResolution", ex.response || ex);
      notify("Incident resolve failed", "danger");
    }
    setProcessing({ action: null, id: null });
  };

  let { data, errors } = dataModel;

  return (
    <Form action="/" className="form-horizontal" method="get">
      {alert}
      <ImsInputText
        label="Resolution"
        placeholder="Resolution"
        cols="80"
        rows="2"
        type="textarea"
        name="resolution"
        value={data.resolution}
        onChange={handleChange}
        error={errors.resolution}
      />
      <ImsInputCheck
        checked={data.resolveStatus}
        label="Resolve"
        name="resolveStatus"
        value={data.resolveStatus}
        onChange={handleChange}
        error={errors.resolveStatus}
      />
      <Row>
        <Col sm="2"></Col>
        <Col sm="3">
          <Button
            size="sm"
            onClick={(e) => handleSubmit(e, doSubmit, false)}
            disabled={validate() ? true : processing.action === "resolve"}
            className="btn-fill"
            color="primary"
            type="button"
          >
            {processing.action === "resolve" ? "Processing..." : "Update"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default IncidentResolution;
