import useAlerts from "@/hooks/useAlerts";
import useModal from "@/hooks/useModal";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import { Link } from "react-router-dom";
import Wallet from "../myWallet/Wallet";

const ManageIndividualEmployee = ({ employee }) => {
  let { activateView, Modal } = useModal();
  let { alert, warningWithConfirmMessage, successAlert } = useAlerts();
  return (
    <>
      {alert}
      <Col md="4">
        <Card className="card-stats">
          <CardHeader></CardHeader>
          <CardBody>
            <Row>
              <Col xs="2">
                <div className="info-icon text-center icon-info">
                  <img src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png" />
                </div>
              </Col>
              <Col xs="10">
                <div className="numbers">
                  <CardTitle tag="h4">
                    <Link
                      to="#"
                      onClick={() => {
                        activateView(employee);
                      }}
                      className="module-link"
                    >
                      {employee.name}{" "}
                    </Link>
                  </CardTitle>
                  <p className="card-category">{employee.email}</p>
                </div>
              </Col>
            </Row>
          </CardBody>
          <CardFooter className="text-right">
            <hr />
            <div className="stats text-secondary">{employee.jobTitle}</div>
          </CardFooter>
        </Card>
      </Col>
      <Modal title="Expense reports">
        <Wallet />
      </Modal>
    </>
  );
};

export default ManageIndividualEmployee;
