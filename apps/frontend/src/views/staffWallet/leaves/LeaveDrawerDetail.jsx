import Loading from "@/components/Loader/Loading";
import {
  Col,
  PanelTab,
  PanelTabs,
  PanelWindow,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import Timeline from "@/views/shared/Timeline/Timeline";
import Holidays from "./Holidays";
import LeaveOverview from "./LeaveOverview";
import USER_ACTIONS from "./actions";
import { useLeave } from "./store";

const LeaveDrawerDetail = () => {
  let {
    processing,
    visitingLeave: leave,
    profile,
    getSubmissionStatus,
  } = useLeave();
  return (
    <React.Fragment>
      <ErrorHandlerComponent
        hasError={processing[USER_ACTIONS.LOAD_LEAVE_DRAWER]?.error}
        errorMessage="This ofi has been deleted or removed"
      >
        {processing[USER_ACTIONS.LOAD_LEAVE_DRAWER]?.status ? (
          <Loading />
        ) : (
          leave && (
            <React.Fragment>
              <DetailsDrawerHeader data={leave} />
              <React.Fragment>
                <PanelTabs variant="outline" activeTab={0}>
                  <PanelTab>
                    <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                    Overview
                  </PanelTab>
                  <PanelTab>
                    <i className="ims-icons-20 icon-icon-list-24 me-1"></i>
                    Details
                  </PanelTab>
                  <PanelTab>
                    <i
                      className="ims-icons-20 icon-icon-activity-24 me-1
                        "
                    ></i>
                    Activity
                  </PanelTab>

                  <PanelTab>
                    <i className="ims-icons-20 icon-icon-calendar-24 me-1"></i>
                    Public holidays
                  </PanelTab>
                  <PanelWindow tabId={0}>
                    <LeaveOverview />
                  </PanelWindow>
                  <PanelWindow tabId={1}>
                    <Row>
                      <Col md="12">
                        <DetailsWrapper
                          label={"Description:"}
                          iconClass={"tim-icons icon-pencil"}
                          value={leave?.description}
                          labelClass={"pr-2"}
                        />
                      </Col>
                    </Row>
                  </PanelWindow>
                  <PanelWindow tabId={2}>
                    <Row>
                      <Col md="12">
                        {getSubmissionStatus(leave) === "Approved" ||
                        getSubmissionStatus(leave) === "Rejected" ? (
                          <Timeline
                            readOnly={true}
                            horizontalSpacing={false}
                            containerClass="mx-auto sm-10"
                            moduleType="leaves"
                            moduleId={leave._id}
                          />
                        ) : (
                          <Timeline
                            editLabel="comment"
                            editPlaceholder="Comment"
                            horizontalSpacing={false}
                            containerClass="mx-auto sm-10"
                            moduleType="leaves"
                            moduleId={leave._id}
                          />
                        )}
                      </Col>
                    </Row>
                  </PanelWindow>
                  <PanelWindow tabId={3}>
                    {profile ? (
                      <Holidays countryCode={profile.country?.code} />
                    ) : (
                      <Loading />
                    )}
                  </PanelWindow>
                </PanelTabs>
              </React.Fragment>
            </React.Fragment>
          )
        )}
      </ErrorHandlerComponent>
    </React.Fragment>
  );
};

export default LeaveDrawerDetail;
