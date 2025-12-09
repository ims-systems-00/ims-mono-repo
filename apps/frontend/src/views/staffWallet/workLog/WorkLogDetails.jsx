import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import TooltipLink from "@/components/Tooltip/TooltipLink";
import useAccess from "@/hooks/useAccess";
import useProcessingControl from "@/hooks/useProcessingControl";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { imsLogger } from "@/services/loggerService";
import { getWorkLog } from "@/services/wallet/worklogServices";
import msToTime from "@/utils/timeConverter";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import USER_ACTIONS from "../expenseReport/actions";
import { Card } from "@ims-systems-00/ims-ui-kit";

//clock in component
const WorkLogDetails = (props) => {
  const { isModalOpen = false } = props;
  let [workLog, setWorkLog] = React.useState(null);
  let { authUser } = useAccess();
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.LOAD_WORKLOG },
  ]);
  React.useEffect(() => {
    async function fetchWorkLog() {
      try {
        dispatch({
          [USER_ACTIONS.LOAD_WORKLOG]: {
            status: true,
            error: false,
            id: null,
          },
        });
        let id =
          (props.match && props.match.params.id) ||
          (props.view && props.view._id);
        let { data } = await getWorkLog(id);
        setWorkLog(data.worklog);
        dispatch({
          [USER_ACTIONS.LOAD_WORKLOG]: {
            status: false,
            error: false,
            id: null,
          },
        });
      } catch (ex) {
        dispatch({
          [USER_ACTIONS.LOAD_EXPENSEREPORT]: {
            status: false,
            error: true,
            id: null,
          },
        });
        imsLogger("WorklogDetails", ex, ex.response);
      }
    }
    fetchWorkLog();
  }, []);
  return (
    <div className="content">
      <Panels
        isModalOpen={isModalOpen}
        navLinks={
          authUser({
            service: IMS_SERVICES.INCIDENT_MANAGEMENT,
            action: ACTIONS.CREATE,
            effect: EFFECTS.ALLOW,
          }) && ["Details"]
        }
        backLinks={
          props.match && [
            {
              linkText: "Back",
              link: props.match.path.split("/:")[0],
            },
          ]
        }
        defaultPanel={"Details"}
      >
        <Panel panelId="Details">
          <Card>
            <ErrorHandlerComponent
              hasError={processing[USER_ACTIONS.LOAD_WORKLOG].error}
              errorMessage="This worklog has been deleted or removed"
            >
              {processing[USER_ACTIONS.LOAD_WORKLOG].status ? (
                <Loading />
              ) : (
                workLog && (
                  <Row>
                    <Col md="12">
                      <span className="text-primary">
                        Reference <span>{workLog.reference}</span>
                      </span>
                    </Col>
                    <Col md="3">
                      <span>
                        Clocked in at{" "}
                        <span className="text-secondary">
                          {moment(workLog.startTime).format("DD/MM/YYYY HH:mm")}
                        </span>
                      </span>
                      <span>
                        Clocked out at{" "}
                        <span className="text-secondary">
                          {moment(workLog.endTime).format("DD/MM/YYYY HH:mm")}
                        </span>
                      </span>
                    </Col>
                    <Col md="3">
                      <span>
                        Worked{" "}
                        <span className="text-secondary">{workLog.type}</span>
                      </span>
                      <span>
                        Location{" "}
                        <span className="text-secondary">
                          {workLog.location || "Location not shared"}
                        </span>
                      </span>
                    </Col>
                    <Col md="3">
                      <span>Total hours worked</span>
                      <span className="text-secondary">
                        {msToTime(workLog.totalWorkTimeMs).hours} hr{" "}
                        {msToTime(workLog.totalWorkTimeMs).minutes} min
                      </span>
                    </Col>
                    <Col md="3">
                      <span>Staff member</span>
                      <span className="text-secondary">
                        {workLog.created?.by?.name}
                      </span>
                    </Col>
                    <Col md="6">
                      <span>
                        Priorities <br></br>
                        <span className="text-secondary">
                          {workLog.priorities || "Nothing logged"}
                        </span>
                      </span>
                    </Col>
                    <Col md="6">
                      <span>
                        Achivements <br></br>
                        <span className="text-secondary">
                          {workLog.achievements || "Nothing logged"}
                        </span>
                      </span>
                    </Col>
                    <Col md="12">
                      <span className="text-primary">Time sheet</span>
                      {workLog.timesheet.map((timesheet) => (
                        <span key={timesheet.eventTime}>
                          {timesheet.event} at{" "}
                          <span className="text-secondary">
                            {moment(timesheet.eventTime).format("HH:mm")}
                          </span>
                        </span>
                      ))}
                    </Col>
                    <Col md="12">
                      <div className="text-center mt-2">
                        <p className="text-success">Action items</p>
                        <hr className="m-1"></hr>
                        <TooltipLink
                          id="view"
                          size="sm"
                          tooltip="Raise a risk"
                          to={`/admin/risk/organisational`}
                          className="btn-icon  like "
                        >
                          <i className="tim-icons icon-alert-circle-exc" />
                        </TooltipLink>{" "}
                        <TooltipLink
                          id="view"
                          size="sm"
                          tooltip="Raise an incident"
                          to={`/admin/incidentmanagement`}
                          // className="btn-icon  like btn-danger"
                          color="link"
                          outline
                          className="btn-link-danger border border-0"
                        >
                          <i className="fas fa-exclamation-circle" />
                        </TooltipLink>{" "}
                        <TooltipLink
                          id="view"
                          size="sm"
                          tooltip="Create a task"
                          to={`/admin/tasks`}
                          className="btn-icon  like btn-success"
                        >
                          <i className="tim-icons icon-molecule-40" />
                        </TooltipLink>
                      </div>
                    </Col>
                  </Row>
                )
              )}
            </ErrorHandlerComponent>{" "}
          </Card>
        </Panel>
      </Panels>
    </div>
  );
};

export default WorkLogDetails;
