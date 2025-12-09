import React from "react";
// @ims-systems-00/ims-ui-kit components
import Loading from "@/components/Loader/Loading";
import { Panel } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import useAccess from "@/hooks/useAccess";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import AgendaButtons from "../AgendaButtons";
import MinutesButtons from "../MinutesButtons";
import ReviewOverview from "../ReviewOverview";
import ReviewStatus from "../ReviewStatus";
import { useSchedule } from "../store";
import ReviewFormContainer from "./ReviewFormContainer";
import USER_ACTIONS from "../actions";
import ReviewActions from "../ReviewActions";
import TaskManagement from "@/views/taskManagement/TaskManagement";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";

const ReviewDetails = (props) => {
  let {
    visitingReview: managementReview,
    processing,
    isCompletedManagementReview,
  } = useSchedule();

  let { authUser } = useAccess();

  return (
    <div className="content">
      <h4 className="mb-3 text-primary fw-bold">Management Review details</h4>
      <Panel panelId="Details">
        <ErrorHandlerComponent
          hasError={processing[USER_ACTIONS.LOAD_REVIEW].error}
          errorMessage="This management review has been deleted or removed"
        >
          {processing[USER_ACTIONS.LOAD_REVIEW].status ? (
            <Loading />
          ) : (
            managementReview && (
              <Row>
                <Col xl="5" md="5" sm="12">
                  <DetailsSidebar
                    title="Details"
                    iconClass="ims-icons-20 icon-document-regular"
                    label={`Raised on ${moment(
                      managementReview?.created?.on
                    ).format("DD/MM/YYYY")}`}
                  >
                    <ReviewActions />
                    <ReviewOverview />
                    <ReviewStatus />
                  </DetailsSidebar>
                </Col>
                <Col xl="7" md="7" sm="12">
                  <SwitchableView
                    viewTitle={managementReview.title}
                    canSwitch={
                      !isCompletedManagementReview() &&
                      authUser({
                        service: IMS_SERVICES.MANAGEMENT_REVIEW,
                        action: ACTIONS.CREATE,
                        effect: EFFECTS.ALLOW,
                      })
                    }
                  >
                    <SecondaryWrapperChild>
                      <ReviewFormContainer />
                    </SecondaryWrapperChild>
                    <PrimaryWrapperChild>
                      <DetailsSectionHeader title={`Attendees:`} />
                      <Row>
                        <Col md="12" className="mb-4">
                          {managementReview.attendees.map((attendee) => (
                            <p>{attendee.name}</p>
                          ))}
                        </Col>
                        <DetailsSectionHeader title={`Agenda:`} />
                        <Col md="12" className="mb-4">
                          <Attachments s3Information={managementReview.agenda}>
                            <AgendaButtons />
                          </Attachments>
                        </Col>
                        <DetailsSectionHeader title={`Minutes:`} />
                        <Col md="12">
                          <Attachments s3Information={managementReview.minutes}>
                            <MinutesButtons />
                          </Attachments>
                        </Col>

                        <Col md="12">
                          <TaskManagement
                            module={managementReview._id}
                            moduleType="managementreviews"
                          />
                        </Col>
                      </Row>
                    </PrimaryWrapperChild>
                  </SwitchableView>
                </Col>
              </Row>
            )
          )}
        </ErrorHandlerComponent>
      </Panel>
    </div>
  );
};

export default ReviewDetails;
