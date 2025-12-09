import useForm from "@/hooks/useForm";
import {
  Button,
  Col,
  Form,
  ImsInputSelect,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import { ROLES } from "@/rolesAndPermissions";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
const ChangeRoleForm = ({ membership, onSubmit = () => {} }) => {
  let dataSet = {
    data: {
      role: {
        value: membership?.role || null,
        label: membership?.role || null,
      },
    },
    errors: {},
  };
  const schema = {
    role: IVal.object().keys({
      value: IVal.string().required().label("Role"),
      label: IVal.label("User type"),
    }),
  };

  const { dataModel, handleChange, handleSubmit, validate, isBusy } = useForm(
    dataSet,
    schema
  );

  let { data, errors } = dataModel;

  return (
    <Form action="/" className="form-horizontal">
      <Row>
        <Col md="12">
          <ImsInputSelect
            label="Change user role"
            name="role"
            value={data.role}
            mandatory={true}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={[
              ROLES.SUPER_ADMIN,
              ROLES.HEAD_OF_SERVICE,
              ROLES.BASIC_USER,
              ROLES.INTERNAL_AUDITOR,
              ROLES.EXTERNAL_AUDITOR,
              ROLES.EXTERNAL_USER,
            ].map((item) => ({
              value: item,
              label: item,
            }))}
          />
          <small>Current user role is {membership?.role}</small>
        </Col>
      </Row>
      <ImsButtonGroup>
        <Button
          name="create"
          disabled={validate() ? true : isBusy}
          className="btn-fill"
          color="primary"
          type="button"
          onClick={(e) => handleSubmit(e, () => onSubmit(dataModel.data))}
        >
          {isBusy ? "Processing" : "Confirm"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default ChangeRoleForm;
