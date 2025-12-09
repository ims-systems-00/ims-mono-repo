import Loading from "@/components/Loader/Loading";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import TaskManagement from "@/views/taskManagement/TaskManagement";
import AgendaButtons from "./AgendaButtons";
import MinutesButtons from "./MinutesButtons";
import ReviewOverview from "./ReviewOverview";
import ReviewStatus from "./ReviewStatus";
import USER_ACTIONS from "./actions";
import { useSchedule } from "./store";
import NavigationTabs from "@/components/NavigationTabs";

const ReviewDrawerDetail = () => {
  let { processing, visitingReview: managementReview } = useSchedule();
  return (
    <React.Fragment>
      {processing[USER_ACTIONS.LOAD_REVIEW]?.status ? (
        <Loading />
      ) : (
        managementReview && (
          <React.Fragment>
            <DetailsDrawerHeader data={managementReview} />
            <NavigationTabs
              container={false}
              activeTab="overview"
              navigations={[
                {
                  id: "overview",
                  text: "Overview",
                  icon: (
                    <i className="ims-icons-20 icon-icon-notebook-24 me-1"></i>
                  ),
                  component: (
                    <div className="px-2 pt-3">
                      <div className="border rounded-3 p-3">
                        <ReviewOverview />
                      </div>

                      <div className="border rounded-3 p-3 mt-3">
                        <div className="mb-3">
                          <DetailsSectionHeader title={`Attendees:`} />
                          {managementReview.attendees.map((attendee) => (
                            <p>{attendee.name}</p>
                          ))}
                        </div>
                        <DetailsSectionHeader title={`Agenda:`} />
                        <div className="mb-3">
                          <Attachments s3Information={managementReview.agenda}>
                            <AgendaButtons />
                          </Attachments>
                        </div>
                        <DetailsSectionHeader title={`Minutes:`} />
                        <div>
                          <Attachments s3Information={managementReview.minutes}>
                            <MinutesButtons />
                          </Attachments>
                        </div>
                      </div>
                    </div>
                  ),
                },

                {
                  id: "lifeCycle",
                  text: "Life Cycle",
                  icon: (
                    <i className="ims-icons-20 icon-icon-clock-24 me-1"></i>
                  ),
                  component: <ReviewStatus />,
                },
                {
                  id: "tasks",
                  text: "Tasks",
                  icon: (
                    <i className="ims-icons-20 icon-icon-notepad-24 me-1"></i>
                  ),
                  component: (
                    <TaskManagement
                      moduleType="managementreviews"
                      module={managementReview._id}
                    />
                  ),
                },
              ]}
            />
          </React.Fragment>
        )
      )}
    </React.Fragment>
  );
};

export default ReviewDrawerDetail;
