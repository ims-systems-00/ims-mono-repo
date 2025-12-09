import useAccess from "@/hooks/useAccess";
import useAlert from "@/hooks/useAlerts";
import useForm from "@/hooks/useForm";
import useProcessingControl from "@/hooks/useProcessingControl";
import {
  Button,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
} from "@ims-systems-00/ims-ui-kit";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import {
  extractBusinessFunctionDashboardReport,
  extractDashboardReport,
} from "@/services/dashBoardServices";
import { imsLogger } from "@/services/loggerService";
import { getCurrentUserInfo } from "@/services/userServices";
import IVal from "@/validations/validator";
import USER_ACTIONS from "./actions";
import { useApplication } from "@/stores/applicationStore";

const SendMailModal = ({ modalSend, toggleModalSend }) => {
  let { tokenPair } = useApplication();
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.SEND_REPORT },
  ]);
  let { alert, successAlert, failedAlert } = useAlert();
  let { authUser, authGlobalAccess } = useAccess(getCurrentUserInfo());
  // defination of dataSet ...
  let dataSet = {
    data: {
      email: "",
      name: "",
      message: "",
    },
    errors: {},
  };
  // Validation rules ....
  const schema = {
    email: IVal.string().email().required().label("Email"),
    name: IVal.string().required().label("Name"),
    message: IVal.label("Message"),
  };
  // submission logic to sever goes here ...
  let doSubmit = async () => {
    try {
      dispatch({
        [USER_ACTIONS.SEND_REPORT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      authUser({
        service: IMS_SERVICES.DASHBOARD,
        action: ACTIONS.READ,
        effect: EFFECTS.ALLOW,
      }) && authGlobalAccess()
        ? await extractDashboardReport(dataModel.data)
        : await extractBusinessFunctionDashboardReport(
            tokenPair?.accessTokenData?.user?.groupId,
            dataModel.data
          );
      successAlert(
        `Your report has been sent to ${dataModel.data.name}, ${dataModel.data.email}`
      );
      dispatch({
        [USER_ACTIONS.SEND_REPORT]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.SEND_REPORT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("SendEmailModal", ex, ex.response);
      failedAlert("Your email could not be sent");
      if (ex.response && ex.response.status === 400) {
        imsLogger("SendEmailModal", ex, ex.response);
      }
    }
  };
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let { data } = dataModel;

  return (
    <>
      {alert}
      <Modal isOpen={modalSend} toggle={toggleModalSend}>
        <ModalHeader toggle={toggleModalSend}>
          Send dashboard report
        </ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label
                style={{
                  fontSize: "16px",
                }}
                className="text-dark"
              >
                Name
              </Label>
              <Input
                placeholder="Name"
                type="text"
                onChange={handleChange}
                value={data.name}
                name="name"
              />
            </FormGroup>
            <FormGroup>
              <Label
                style={{
                  fontSize: "16px",
                }}
                className="text-dark"
              >
                Email
              </Label>
              <Input
                placeholder="Email"
                type="email"
                onChange={handleChange}
                value={data.email}
                name="email"
              />
            </FormGroup>
            <FormGroup>
              <Label
                style={{
                  fontSize: "16px",
                }}
                className="text-dark"
              >
                Message
              </Label>
              <Input
                placeholder="Send a message..."
                type="textarea"
                onChange={handleChange}
                value={data.message}
                name="message"
                rows="3"
              />
            </FormGroup>
            <Button
              color="primary"
              type="button"
              onClick={(e) => handleSubmit(e, doSubmit)}
              disabled={
                validate() ? true : processing[USER_ACTIONS.SEND_REPORT].status
              }
            >
              {processing[USER_ACTIONS.SEND_REPORT].status ? (
                "Processing"
              ) : (
                <>
                  <i className="ims-icons-20 icon-icon-paperplanetilt-24" />{" "}
                  Send
                </>
              )}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default SendMailModal;
