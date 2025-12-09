import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useAlerts from "@/hooks/useAlerts";
import { Button, Col, Row, Spinner } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React, { useContext, useState } from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { getCurrentSessionData } from "@/services/authService";
import { deleteKpiObjective } from "@/services/kpiObjectiveServices";
import { imsLogger } from "@/services/loggerService";
import { KpiObjectiveActionsContext } from "./contexts/KpiObjectiveActionsContext";
import KpiObjectiveFrom from "./KpiObjectiveForm";
import Can from "@/components/Can/Can";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";

const KpiObjective = ({ kpiObjective }) => {
  let [editMode, setEditMode] = useState(false);
  let { alert, warningWithConfirmMessage, successAlert } = useAlerts();
  let toggleEditMode = () => setEditMode((currentMode) => !currentMode);
  let { processing, setProcessing, deleteFromList } = useContext(
    KpiObjectiveActionsContext
  );
  let notify = useContext(NotificationContext);
  let { authUser } = useAccess();
  let handleDeleteKpiObjective = async (e, KpiData) => {
    try {
      setProcessing({ action: "delete-kpiObjective", id: KpiData._id });
      let { data } = await deleteKpiObjective(KpiData._id);
      notify("Kpi objective deleted successfully ", "success");
      successAlert("Kpi objective deleted successfully");
      deleteFromList(data.kpiObjective);
    } catch (ex) {
      imsLogger("KpiObjective", ex.response || ex);
      notify("Kpi delete failed.Unknown server error occurred.", "danger");
    }
    setProcessing({ action: null, id: null });
  };
  return editMode ? (
    <KpiObjectiveFrom
      kpiObjective={kpiObjective}
      toggleEditMode={toggleEditMode}
      processing={processing}
      setProcessing={setProcessing}
    />
  ) : (
    <>
      {alert}
      <Row className="mt-4">
        <Col md="12">
          <div className="d-flex justify-content-between border-bottom rounded-3 p-3 shadow-sm">
            <div>
              <p className="mb-2">
                <ImageNameWrapper
                  img={kpiObjective.created?.by?.name?.profileImageSrc}
                  name={kpiObjective.created?.by.name}
                />{" "}
                on {moment(kpiObjective.createdAt).format("DD/MM/YYYY")}
              </p>
              <p className=" text-wrap text-break">
                <i className="ims-icons-20 icon-icon-target-24" />{" "}
                {`KPI-${kpiObjective.ID}`} {kpiObjective.value}
              </p>
            </div>
            <div>
              {kpiObjective.created.by &&
                kpiObjective.created.by._id ===
                  getCurrentSessionData().user?._id && (
                  <React.Fragment>
                    <Can
                      policy={{
                        service: IMS_SERVICES.KPI_OBJECTIVE,
                        action: ACTIONS.UPDATE,
                      }}
                    >
                      <Button
                        name="delete"
                        size="sm"
                        id="delete"
                        outline
                        className="border-0 "
                        onClick={() => toggleEditMode()}
                      >
                        <i className="ims-icons-20 icon-icon-pencil-24" />
                      </Button>
                    </Can>
                    <Can
                      policy={{
                        service: IMS_SERVICES.KPI_OBJECTIVE,
                        action: ACTIONS.DELETE,
                      }}
                    >
                      <Button
                        disabled={
                          processing.action === "delete-kpiObjective" &&
                          processing.id === kpiObjective._id
                        }
                        name="delete"
                        size="sm"
                        id="delete"
                        color="link"
                        className="btn-link-danger border border-0"
                        onClick={(e) => {
                          warningWithConfirmMessage(
                            "This Kpi objective will be deleted",
                            () => {
                              handleDeleteKpiObjective(e, kpiObjective);
                            }
                          );
                        }}
                      >
                        {processing.action === "delete-kpiObjective" &&
                        processing.id === kpiObjective._id ? (
                          <Spinner size="sm" />
                        ) : (
                          <i className="ims-icons-20 icon-icon-trash-24" />
                        )}
                      </Button>
                    </Can>
                  </React.Fragment>
                )}
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default KpiObjective;
