import FormattedContents from "@/components/Editors/TextEditor/FormattedContents";
import Loading from "@/components/Loader/Loading";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsSectionFormattedTextWrapper from "@/views/shared/DetailsSectionFormattedTextWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import Timeline from "@/views/shared/Timeline/Timeline";
import LeaveOverview from "../LeaveOverview";
import USER_ACTIONS from "../actions";
import { useLeave } from "../store";
import LeaveFormContainer from "./LeaveFormContainer";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
const LeaveDetail = () => {
  let { visitingLeave: leave, processing, getSubmissionStatus } = useLeave();
  return (
    <React.Fragment>
      <div className="content">
        <h4 className="mb-3 text-primary fw-bold">Leave details</h4>
        <ErrorHandlerComponent
          hasError={processing[USER_ACTIONS.LOAD_LEAVE].error}
          errorMessage="This leave request has been deleted or removed"
        >
          {processing[USER_ACTIONS.LOAD_LEAVE].status ? (
            <Loading />
          ) : (
            leave && (
              <Row>
                <Col xl="4" sm="12">
                  <DetailsSidebar
                    title="Details"
                    iconClass="ims-icons-20 icon-document-regular"
                    label={`Raised on ${moment(leave?.created?.on).format(
                      "DD/MM/YYYY"
                    )}`}
                  >
                    <LeaveOverview data={leave} />
                  </DetailsSidebar>
                </Col>
                <Col xl="8" sm="12" className="mb-3">
                  <SwitchableView
                    viewTitle={leave.type}
                    canSwitch={
                      getSubmissionStatus(leave) !== "Approved" &&
                      getSubmissionStatus(leave) !== "Rejected"
                    }
                  >
                    <SecondaryWrapperChild>
                      <LeaveFormContainer />
                    </SecondaryWrapperChild>
                    <PrimaryWrapperChild>
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
                      <br></br>
                      <DetailsSectionHeader title="Comments" />
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
                    </PrimaryWrapperChild>
                  </SwitchableView>
                </Col>
              </Row>
            )
          )}
        </ErrorHandlerComponent>
      </div>
    </React.Fragment>
  );
};

export default LeaveDetail;
