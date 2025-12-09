import { Button, Card, CardBody, Col, Row } from "@ims-systems-00/ims-ui-kit";
import KpiObejctiveForm from "./KpiObjectiveForm";
import USER_ACTIONS from "./actions";
import { useSupplier } from "./store";
const KpiObjective = ({ kpi }) => {
  let { editMode, toggleEditMode, processing, updateKpi, deleteKpi } =
    useSupplier();
  return editMode ? (
    <KpiObejctiveForm kpi={kpi} toggleEditMode={toggleEditMode} />
  ) : (
    <Row className="mt-4">
      {/* <Col md="2">
        <div className="card-img"> </div>
      </Col> */}
      <Col md="10">
        <Card>
          <CardBody>
            <Row>
              <Col md="12" className="mb-4">
                <p>{kpi.value}</p>
              </Col>
            </Row>
            <Button
              disabled={
                processing[USER_ACTIONS.DELETE_KPI].status &&
                processing[USER_ACTIONS.DELETE_KPI].id === kpi._id
              }
              size="sm"
              color="danger"
              outline
              className="border border-0"
              onClick={() => deleteKpi(kpi)}
            >
              {processing[USER_ACTIONS.DELETE_KPI].status &&
              processing[USER_ACTIONS.DELETE_KPI].id === kpi._id
                ? "Deleting..."
                : "Delete"}
            </Button>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default KpiObjective;
