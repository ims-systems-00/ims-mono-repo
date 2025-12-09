import Box from "@/components/Box/Index";
import Loading from "@/components/Loader/Loading";
import NavigationTabs from "@/components/NavigationTabs";
import { Col } from "@ims-systems-00/ims-ui-kit";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import Timeline from "@/views/shared/Timeline/Timeline";
import USER_ACTIONS from "../actions";
import { useIncident } from "../store";
import TaskManagement from "@/views/taskManagement/TaskManagement";
import IncidentDescription from "./IncidentDescription";

const IncidentDetailsNew = () => {
  const {
    visitingIncident: incident,
    processing,
    isResolvedIncident,
  } = useIncident();

  if (processing[USER_ACTIONS.LOAD_INCIDENT].status) {
    return <Loading />;
  }

  if (!incident) {
    return (
      <ErrorHandlerComponent errorMessage="This incident has been deleted or removed" />
    );
  }

  return (
    <>
      <NavigationTabs
        activeTab="activity"
        navigations={[
          {
            id: "description",
            text: "Description",
            icon: <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>,
            component: <IncidentDescription />,
          },
          {
            id: "activity",
            text: "Activity",
            icon: <i className="ims-icons-20 icon-icon-activity-24 me-1"></i>,
            component: (
              <div className="content">
                <Col md="6" className="mx-auto">
                  <Box>
                    <h4>Activities</h4>
                    {isResolvedIncident() ? (
                      <Timeline
                        readOnly={true}
                        horizontalSpacing={false}
                        containerClass="mx-auto sm-12"
                        moduleType="incidents"
                        moduleId={incident?._id}
                        module={incident}
                      />
                    ) : (
                      <Timeline
                        editLabel="Comment"
                        editPlaceholder="New comment"
                        horizontalSpacing={true}
                        containerClass="mx-auto sm-12"
                        moduleType="incidents"
                        moduleId={incident?._id}
                        isHorizontal={false}
                        module={incident}
                      />
                    )}
                  </Box>
                </Col>
              </div>
            ),
          },
          {
            id: "task",
            text: "Task",
            icon: <i className="ims-icons-20 icon-icon-notepad-24 me-1"></i>,
            component: (
              <div className="content">
                <TaskManagement moduleType="incidents" module={incident?._id} />
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

export default IncidentDetailsNew;
