import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import useDataProcessing from "@/hooks/useProcessing";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Container,
  Form,
  Spinner,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { forgotPassword } from "@/services/authService";
import { getCurrentUserInfo } from "@/services/userServices";
import IVal from "@/validations/validator";
import imsLogo from "@/assets/img/ims-logo-stacked-text.svg";
const UpdatePassword = () => {
  let notify = React.useContext(NotificationContext);
  let { processing, setProcessing } = useDataProcessing();

  // defination of dataSet ...
  let dataSet = {
    data: {
      email: getCurrentUserInfo().email,
    },
    errors: {},
  };
  // Validation rules ....
  const schema = {
    email: IVal.string().email().required().label("Email"),
  };

  // submission logic to sever goes here ...
  let doSubmit = async () => {
    try {
      setProcessing("Sending email");
      await forgotPassword(dataModel.data);
      setProcessing("Mail sent");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        let msg = ex.response.data.errors[0].msg;
        notify(msg, "danger");
      } else {
        notify("Access denied", "danger");
      }
      setProcessing("Mail not sent");
    }
  };
  const { dataModel, handleSubmit, validate } = useForm(dataSet, schema);

  return (
    <>
      <div className="content">
        <Container>
          <Col className="ml-auto me-auto" lg="4" md="6">
            <Form className="form" onSubmit={handleSubmit}>
              <Card className="card-login card-white">
                <CardHeader>
                  <img alt="imssystems" src={imsLogo} />
                </CardHeader>
                <h4 className="text-dark text-center">Update password</h4>
                <CardBody>
                  <span className="text-dark text-center  font-size-subtitle-2">
                    To Change your password please verify yourself
                  </span>
                </CardBody>
                <CardFooter>
                  <Button
                    block
                    disabled={validate() ? !processing : false}
                    className="mb-3"
                    color="primary"
                    size="sm"
                    onClick={(e) => handleSubmit(e, doSubmit)}
                  >
                    {processing === "Sending email" ? (
                      <span>
                        Sending email <Spinner size="sm" />
                      </span>
                    ) : (
                      "Send verification email"
                    )}
                  </Button>
                  {processing === "Mail sent" ? (
                    <CardBody>
                      <div className="pull-left">
                        <span className="text-info">
                          An email has been sent to your email to reset your
                          password. Please check your inbox.
                        </span>
                      </div>
                    </CardBody>
                  ) : (
                    ""
                  )}
                </CardFooter>
              </Card>
            </Form>
          </Col>
        </Container>
      </div>
    </>
  );
};

export default UpdatePassword;
