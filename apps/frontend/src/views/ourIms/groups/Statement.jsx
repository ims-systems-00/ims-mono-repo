import useForm from "@/hooks/useForm";
import { Button } from "@ims-systems-00/ims-ui-kit";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { mapToStatementModel } from "@/services/iamPolicyServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputSelect,
} from "@/views/shared/CustomFormElements";

const Statement = ({
  statement,
  statements = [],
  addToStatements,
  updateStatement,
  toggleEditMode,
  setProcessing,
  processing,
}) => {
  const dataSet = statement
    ? mapToStatementModel(statement)
    : {
        data: {
          service: {
            value: null,
            label: "Select feature",
          },
          resources: [{ value: ACTIONS.ALL, label: "Full access" }],
          actions: [{ value: ACTIONS.ALL, label: "Full access" }],
          effect: EFFECTS.ALLOW,
        },
        errors: {},
      };
  // Validation rules ....
  const schema = {
    service: IVal.object().keys({
      value: IVal.string().required().label("Service"),
      label: IVal.label("Service"),
    }),
    resources: IVal.array().items(),
    actions: IVal.array().items(),
    effect: IVal.string().required().label("Effect"),
  };

  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );

  let doSubmit = async (e) => {
    let submissionType = e.currentTarget.name;
    try {
      switch (submissionType) {
        case "add": {
          addToStatements &&
            addToStatements({
              service: dataModel.data.service.value,
              actions: dataModel.data.actions.map((item) => item.value),
              resources: dataModel.data.resources.map((item) => item.value),
              effect: dataModel.data.effect,
            });
          break;
        }
        case "update": {
          updateStatement &&
            updateStatement({
              service: dataModel.data.service.value,
              actions: dataModel.data.actions.map((item) => item.value),
              resources: dataModel.data.resources.map((item) => item.value),
              effect: dataModel.data.effect,
            });
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger("Statement", ex.response || ex);
    }
    setProcessing({ action: null, id: null });
  };

  let { data, errors } = dataModel;

  function filterIt(arr, searchKey) {
    arr = arr.filter((obj) =>
      Object.keys(obj).some((key) => obj[key] === searchKey)
    );
    return arr.length ? false : true;
  }

  return (
    <div className="form-horizontal">
      <ImsInputSelect
        placeholder="Feature"
        label="Feature"
        name="service"
        value={data.service}
        className="react-select default"
        classNamePrefix="react-select"
        onChange={handleChange}
        options={Object.values(IMS_SERVICES)
          .filter((item) => filterIt(statements, item))
          .map((item) => ({ value: item, label: item }))}
      />
      <ImsInputSelect
        isMulti
        placeholder="Actions"
        label="Actions"
        name="actions"
        value={data.actions}
        className="react-select default"
        classNamePrefix="react-select"
        onChange={handleChange}
        options={[
          ACTIONS.ALL,
          ACTIONS.CREATE,
          ACTIONS.READ,
          ACTIONS.DELETE,
        ].map((item) => ({ value: item, label: item }))}
      />
      <ImsButtonGroup>
        {statement ? (
          <>
            <Button
              name="update"
              size="sm"
              className="btn-simple btn-primary"
              color="primary"
              type="button"
              disabled={
                validate() ? true : processing.action === "update-statement"
              }
              onClick={(e) => {
                handleSubmit(e, doSubmit, false);
              }}
            >
              {processing.action === "update-statement"
                ? "Saving..."
                : "Update"}
            </Button>
            <Button
              size="sm"
              className="border border-0"
              outline
              color="danger"
              type="button"
              onClick={() => toggleEditMode && toggleEditMode()}
            >
              cancel
            </Button>
          </>
        ) : (
          <Button
            name="add"
            size="sm"
            className="btn-simple btn-primary"
            color="primary"
            type="button"
            disabled={validate() ? true : processing.action === "add-statement"}
            onClick={(e) => handleSubmit(e, doSubmit)}
          >
            {processing.action === "add-statement" ? "Adding..." : "Add"}
          </Button>
        )}
      </ImsButtonGroup>
    </div>
  );
};

export default Statement;
