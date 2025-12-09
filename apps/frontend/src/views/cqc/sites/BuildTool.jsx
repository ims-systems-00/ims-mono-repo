import NotificationContext from "@/contexts/notificationContext";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import { useContext } from "react";
import { buildCQCToolKit } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import { ImsInputSelect } from "@/views/shared/CustomFormElements";

const BuildTool = ({
  addToTable,
  significantEvent,
  processing,
  setProcessing,
}) => {
  let { authGlobalAccess } = useAccess();
  let { groups } = useContext(SuperGlobalContext);
  let notify = useContext(NotificationContext);
  const dataSet = {
    data: {
      group: {
        value: null,
        label: "Select Business unit",
      },
    },
    errors: {},
  };
  const schema = {
    group: IVal.object().keys({
      value: IVal.string().required().label("Business unit"),
      label: IVal.label("Business unit"),
    }),
  };

  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "create": {
          setProcessing({ action: "create", id: null });
          let { data } = await buildCQCToolKit(dataModel.data);
          addToTable && addToTable(data.overview);
          notify(
            `Toolkit is built successfully for ${dataModel.data.group.label}`,
            "success"
          );
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger("CQCBuildTool", ex.response || ex);
      notify(
        (ex.response && ex.response.data.message) ||
          "Unknown server error occurred",
        "danger"
      );
    }
    setProcessing({ action: null, id: null });
  };
  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal">
      <ImsInputSelect
        label={authGlobalAccess() ? "Business unit" : "Business unit"}
        name="group"
        value={data.group}
        className="react-select default"
        classNamePrefix="react-select"
        onChange={handleChange}
        options={groups.map((group) => ({
          value: group._id,
          label: group.name,
        }))}
      />
      <Row>
        <Col sm="2"></Col>
        <Col sm="4">
          {processing.action === "create" && (
            <h5 className="text-warning">
              Creating cqc tool for {data.group.label}. Please wait, this may
              take a while to complete.
            </h5>
          )}
          <Button
            name="create"
            disabled={validate() ? true : processing.action === "create"}
            className="btn-fill"
            color="primary"
            type="button"
            onClick={(e) => handleSubmit(e, doSubmit)}
          >
            {processing.action === "create" ? "Processsing" : "Confirm"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default BuildTool;
