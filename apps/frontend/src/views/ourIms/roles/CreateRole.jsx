import NotificationContext from "@/contexts/notificationContext";
import useAlert from "@/hooks/useAlerts";
import useForm from "@/hooks/useForm";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom";
import { getPolicies } from "@/services/iamPolicyServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import {
  ImsInputSelect,
  ImsInputText,
} from "@/views/shared/CustomFormElements";
import {
  createRole,
  mapToIamRoleModel,
  updateRole,
} from "../../../services/iamRoleServices";

let rolesType = [
  {
    value: "premitive",
    label: "premitive",
  },
  {
    value: "custom",
    label: "custom",
  },
];

const CreateRole = ({
  role,
  setProcessing,
  processing,
  addToTable,
  refreshRole,
}) => {
  const [policies, setPolicies] = React.useState([
    { label: "Select policy", value: null },
  ]);
  const dataSet = role
    ? mapToIamRoleModel(role)
    : {
        data: {
          policy: {
            value: null,
            label: "Select policy",
          },
          name: "",
          type: {
            value: "custom",
            label: "custom",
          },
        },
        errors: {},
      };
  const schema = {
    type: IVal.object().keys({
      value: IVal.string().required().label("Type"),
      label: IVal.label("Type"),
    }),
    policy: IVal.object().keys({
      value: IVal.string().required().label("Policy"),
      label: IVal.label("Policy"),
    }),
    name: IVal.string().required().label("Name"),
  };
  let history = useHistory();
  let notify = React.useContext(NotificationContext);
  let { alert, successAlert } = useAlert();

  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "create": {
          setProcessing({ action: "create", id: null });
          let { data } = await createRole(dataModel.data);
          addToTable && addToTable(data.iamRole);
          notify("Role created successfully", "success");
          break;
        }
        case "update": {
          setProcessing({ action: "update", id: role._id });
          let { data } = await updateRole(role._id, dataModel.data);
          refreshRole(data.iamRole);
          notify("Role updated successfully", "success");
          history.goBack();
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger("CreateRole", ex.response || ex);
      notify("Operation failed", "danger");
    }
    setProcessing({ action: null, id: null });
  };
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );

  React.useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await getPolicies();
        setPolicies(data.iamPolicies);
      } catch (ex) {
        imsLogger("CreateRole", ex.response);
      }
    }
    fetchData();
  }, []);

  let { data, errors } = dataModel;

  return (
    <Form action="/" className="form-horizontal" method="get">
      {alert}
      <ImsInputText
        label="Name"
        name="name"
        value={data.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Role name"
      />

      <ImsInputSelect
        label="Role Policy"
        name="policy"
        value={data.policy}
        className="react-select default"
        classNamePrefix="react-select"
        onChange={handleChange}
        options={policies.map((policy) => ({
          value: policy._id,
          label: policy.name,
        }))}
      />

      <Row>
        <Col sm="2"></Col>
        <Col sm="3">
          {role ? (
            <Button
              name="update"
              onClick={(e) => handleSubmit(e, doSubmit, false)}
              disabled={validate() ? true : processing.action === "update"}
              className="btn-fill"
              color="primary"
              type="button"
            >
              {processing.action === "update" ? "Processing..." : "Update"}
            </Button>
          ) : (
            <Button
              name="create"
              onClick={(e) => handleSubmit(e, doSubmit)}
              disabled={validate() ? true : processing.action === "create"}
              className="btn-fill"
              color="primary"
              type="button"
            >
              {processing.action === "create" ? "Processing..." : "Create"}
            </Button>
          )}
        </Col>
      </Row>
    </Form>
  );
};

export default CreateRole;
