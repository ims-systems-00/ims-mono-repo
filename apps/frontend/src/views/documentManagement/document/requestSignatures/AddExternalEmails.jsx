import useForm from "@/hooks/useForm";
import {
  Button,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import IVal from "@/validations/validator";
import useRequestSignature from "./store/useRequestSignature";
const AddExternalEmails = () => {
  const defaultData = {
    data: {
      email: "",
    },
    errors: {},
  };
  const validationSchema = {
    email: IVal.string().required().email().label("Type"),
  };
  const {
    selectedExternalEmails,
    addToSelectedExternalEmailsList,
    removeFromSelectedExternalEmailsList,
  } = useRequestSignature();
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    defaultData,
    validationSchema
  );
  return (
    <Container>
      <FormGroup>
        <Label
          style={{
            fontSize: "16px",
          }}
          className="text-dark"
        >
          Add an external email
        </Label>
        <Input
          value={dataModel?.data?.email}
          name="email"
          onChange={handleChange}
          placeholder="i.e. example@imssystems.tech"
        />
      </FormGroup>
      <Button
        disabled={validate() ? true : false}
        onClick={(e) =>
          handleSubmit(e, () =>
            addToSelectedExternalEmailsList(dataModel.data?.email)
          )
        }
        color="primary"
        className="btn-block mb-3"
      >
        Add this email to the list
      </Button>
      {selectedExternalEmails?.map((email) => {
        return (
          <Row>
            <Col md="12">
              <Button
                className="btn-icon text-danger"
                onClick={() => removeFromSelectedExternalEmailsList(email)}
              >
                <i className="fa-solid fa-trash-can" />
              </Button>{" "}
              <span className={"text-bold text-primary"}>{email}</span>
            </Col>
          </Row>
        );
      })}
    </Container>
  );
};

export default AddExternalEmails;
