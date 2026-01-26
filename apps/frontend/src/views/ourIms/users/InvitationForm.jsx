import useForm from "@/hooks/useForm";
import {
  Button,
  Col,
  Form,
  ImsInputSelect,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import { ROLES } from "@/rolesAndPermissions";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { TourStep } from "../../../components/Tour";

const InvitaionForm = ({ user, onSubmit = () => {} }) => {
  let dataSet = {
    data: {
      email: "",
      role: {
        value: ROLES.BASIC_USER,
        label: ROLES.BASIC_USER,
      },
    },
    errors: {},
  };
  const schema = {
    email: IVal.string().email().required().label("Email"),
    role: IVal.object().keys({
      value: IVal.string().required().label("Role"),
      label: IVal.label("User type"),
    }),
  };

  const { dataModel, handleChange, handleSubmit, validate, isBusy } = useForm(
    dataSet,
    schema,
  );

  let { data, errors } = dataModel;

  return (
    <Form action="/" className="form-horizontal">
      <TourStep stepId="create-user-form">
        <ImsInputText
          label="Email"
          disabled={user ? true : false}
          name="email"
          mandatory={true}
          value={data.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="Email"
        />
        <ImsInputSelect
          label="Role"
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
      </TourStep>
      <ImsButtonGroup>
        <TourStep stepId="create-user-confirm">
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
        </TourStep>
      </ImsButtonGroup>
    </Form>
  );
};

export default InvitaionForm;
