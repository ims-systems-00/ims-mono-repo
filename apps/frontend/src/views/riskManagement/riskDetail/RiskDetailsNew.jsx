import Box from "@/components/Box/Index";
import Loading from "@/components/Loader/Loading";
import NavigationTabs from "@/components/NavigationTabs";
import { Col } from "@ims-systems-00/ims-ui-kit";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import Timeline from "@/views/shared/Timeline/Timeline";
import Tasks from "@/views/taskManagement/Tasks";
import USER_ACTIONS from "../actions";
import { useRisk } from "../store";
import RiskDescription from "./RiskDescription";

const RiskDetailsNew = () => {
  const { visitingRisk, processing } = useRisk();
  const getSubmissionStatus = (risk) => {
    return risk.mitigated.status;
  };

  if (processing[USER_ACTIONS.LOAD_RISK].status) {
    return <Loading />;
  }

  if (!visitingRisk) {
    return (
      <ErrorHandlerComponent errorMessage="This risk has been deleted or removed" />
    );
  }

  return (
    <>
      <NavigationTabs
        activeTab="description"
        navigations={[
          {
            id: "description",
            text: "Description",
            icon: <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>,
            component: <RiskDescription />,
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
                    {getSubmissionStatus(visitingRisk) ? (
                      <Timeline
                        readOnly={true}
                        horizontalSpacing={false}
                        containerClass="mx-auto sm-12"
                        moduleType="risks"
                        moduleId={visitingRisk?._id}
                      />
                    ) : (
                      <Timeline
                        editLabel="Comment"
                        editPlaceholder="New comment"
                        horizontalSpacing={true}
                        containerClass="mx-auto sm-12"
                        moduleType="risks"
                        moduleId={visitingRisk?._id}
                        isHorizontal={false}
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
                <Tasks moduleType="risks" module={visitingRisk?._id} />
              </div>
            ),
          },
        ]}
      />
    </>
  );
};

export default RiskDetailsNew;
