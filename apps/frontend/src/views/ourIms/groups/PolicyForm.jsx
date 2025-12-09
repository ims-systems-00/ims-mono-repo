import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { Button, Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import {
  ACCESS_POLICY_TYPE,
  ACCESS_SCOPE,
  POLICY_USAGE,
} from "@/rolesAndPermissions";
import {
  createPolicy,
  mapToPolicyModel,
  updatePolicy,
} from "@/services/iamPolicyServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import { ImsInputText } from "@ims-systems-00/ims-ui-kit";
import Statement from "./Statement";
import Statements from "./Statements";

const PolicyForm = ({
  policy,
  setProcessing,
  processing,
  addToTable,
  refreshPolicy,
}) => {
  let notify = React.useContext(NotificationContext);
  const dataSet = policy
    ? mapToPolicyModel(policy)
    : {
        data: {
          name: "",
          usedFor: {
            value: POLICY_USAGE.BUSINESS_UNIT,
            label: POLICY_USAGE.BUSINESS_UNIT,
          },
          type: {
            value: ACCESS_POLICY_TYPE.CUSTOMER_MANAGED,
            label: ACCESS_POLICY_TYPE.CUSTOMER_MANAGED,
          },
          accessScope: {
            value: ACCESS_SCOPE.SINGLE_BUSINESS_UNIT,
            label: ACCESS_SCOPE.SINGLE_BUSINESS_UNIT,
          },
          statement: [],
        },
        errors: {},
      };
  const schema = {
    name: IVal.string().required().label("Name"),
    usedFor: IVal.object().keys({
      value: IVal.string().required().label("Used for"),
      label: IVal.label("Used for"),
    }),
    type: IVal.object().keys({
      value: IVal.string().required().label("Type"),
      label: IVal.label("Type"),
    }),
    accessScope: IVal.object().keys({
      value: IVal.string().required().label("Access scope"),
      label: IVal.label("Access scope"),
    }),
    statement: IVal.array().items(),
  };
  let doSubmit = async (e) => {
    try {
      let submissionType = e.target.name;
      switch (submissionType) {
        case "create": {
          setProcessing({ action: "create", id: null });
          let { data } = await createPolicy(dataModel.data);
          notify("Policy created successfully", "success");
          addToTable && addToTable(data.iamPolicy);
          break;
        }
        case "update": {
          setProcessing({ action: "update", id: null });
          let { data } = await updatePolicy(policy._id, dataModel.data);
          notify("Policy updated successfully", "success");
          refreshPolicy && refreshPolicy(data.iamPolicy);
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger("PolicyForm", ex);
      notify("Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  };

  const { dataModel, handleChange, handleSubmit, validate, setDataModel } =
    useForm(dataSet, schema);

  const addToStatements = (statement) => {
    const data = { ...dataModel.data };
    const errors = { ...dataModel.errors };
    data["statement"] = [statement, ...data.statement];
    setDataModel({ data, errors });
  };

  const updateStatement = (statement) => {};

  const deleteStatement = (statement) => {
    const data = { ...dataModel.data };
    const errors = { ...dataModel.errors };
    data["statement"] = data.statement.filter(
      (item) => item.service !== statement.service
    );
    setDataModel({ data, errors });
  };
  let { data, errors } = dataModel;
  return (
    <div action="/" className="form-horizontal">
      <ImsInputText
        label="Name"
        name="name"
        mandatory={true}
        value={data.name}
        onChange={handleChange}
        error={errors.name}
        placeholder="Access policy name"
      />
      <span className="text-center font-size-subtitle-1">
        Features and functionality
      </span>
      <Statement
        statements={data.statement}
        addToStatements={addToStatements}
        setProcessing={setProcessing}
        processing={processing}
      />
      {data.statement.length
        ? data.statement.map((statement) => (
            <Statements
              key={statement.service}
              deleteStatement={deleteStatement}
              statement={statement}
              setProcessing={setProcessing}
              processing={processing}
            />
          ))
        : null}
      <Row className="mt-4">
        <Col sm="2"></Col>
        <Col sm="4">
          {policy ? (
            <Button
              name="update"
              disabled={validate() ? true : processing.action === "update"}
              className="btn-fill"
              color="primary"
              type="button"
              onClick={(e) => handleSubmit(e, doSubmit, false)}
            >
              {processing.action === "update" ? "Processing..." : "Update"}
            </Button>
          ) : (
            <Button
              name="create"
              disabled={validate() ? true : processing.action === "create"}
              className="btn-fill"
              color="primary"
              type="button"
              onClick={(e) => handleSubmit(e, doSubmit)}
            >
              {processing.action === "create" ? "Processing..." : "Create"}
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default PolicyForm;
