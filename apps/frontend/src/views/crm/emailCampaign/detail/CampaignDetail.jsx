import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import SwitchableView from "@/components/SwitchableView/Index";
import PrimaryWrapperChild from "@/components/SwitchableView/PrimaryWrapperChild";
import SecondaryWrapperChild from "@/components/SwitchableView/SecondaryWrapperChild";
import useAccess from "@/hooks/useAccess";
import { Col, Card, Row, Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsSidebar from "@/views/shared/DetailComponents/DetailsSidebar";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import CampaignOverview from "../CampaignOverview";
import Recipients from "../Recipients";
import USER_ACTIONS from "../actions";
import { useCampaign } from "../store";
import CampaignFormContainer from "./CampaignFormContainer";

const CampaignDetail = () => {
  let {
    visitingCampaign: campaign,
    processing,
    lists,
    loadRecipients,
    toolState,
  } = useCampaign();
  let { authUser } = useAccess();
  const getTabs = () => {
    return authUser({
      service: IMS_SERVICES.CRM,
      action: ACTIONS.CREATE,
      effect: EFFECTS.ALLOW,
    }) &&
      campaign &&
      campaign.closed
      ? ["Details", "Recipients"]
      : ["Details", "Recipients"];
  };
  const getSubmissionStatus = (campaign) => {
    return campaign.closed;
  };
  return (
    <div className="content">
      <Panels navLinks={["Details", "Recipients"]} defaultPanel="Details">
        <h4 className="mb-3 text-primary fw-bold">Email Campaign details</h4>
        <Panel panelId="Details">
          <ErrorHandlerComponent
            hasError={processing[USER_ACTIONS.LOAD_EMAIL].error}
            errorMessage="This campaign has been deleted or removed"
          >
            {processing[USER_ACTIONS.LOAD_EMAIL].status ? (
              <Loading />
            ) : (
              campaign && (
                <React.Fragment>
                  <Row>
                    <Col xl="4" sm="12">
                      <DetailsSidebar
                        title="Details"
                        iconClass="ims-icons-20 icon-document-regular"
                        label={`Raised on ${moment(
                          campaign?.created?.on
                        ).format("DD/MM/YYYY")}`}
                      >
                        <CampaignOverview data={campaign} />
                      </DetailsSidebar>
                    </Col>
                    <Col xl="8" sm="12" className="mb-3">
                      <SwitchableView
                        viewTitle={campaign.name}
                        canSwitch={authUser({
                          service: IMS_SERVICES.CRM,
                          action: ACTIONS.CREATE,
                          effect: EFFECTS.ALLOW,
                        })}
                      >
                        <SecondaryWrapperChild>
                          <CampaignFormContainer />
                        </SecondaryWrapperChild>
                        <PrimaryWrapperChild>
                          {campaign.customAudience.lenght > 0 ? (
                            <div>
                              <DetailsSectionHeader
                                title={`Additional audience`}
                              />
                              <Row>
                                <Col md="12">
                                  <Table>
                                    <thead className="text-primary">
                                      <tr>
                                        <th>Reference</th>
                                        <th className="text-right">
                                          Customer name
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {campaign.customAudience.map(
                                        (customer) => (
                                          <tr>
                                            <th>{customer.reference}</th>
                                            <th className="text-secondary text-right">
                                              {customer.name}
                                            </th>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </Table>
                                </Col>
                                <Col md="12"></Col>
                              </Row>
                            </div>
                          ) : null}
                          <Row>
                            <Col md="12">
                              <DetailsWrapper
                                label={"Subject:"}
                                value={campaign.subject}
                              />
                            </Col>
                            <Col md="12">
                              <DetailsWrapper
                                label={"Message:"}
                                value={campaign.body}
                              />
                            </Col>
                          </Row>
                          <br></br>
                          <DetailsSectionHeader title={`Attachments`} />
                          <Row>
                            <Col md="12">
                              <Attachments
                                s3Information={campaign.attachments}
                              />
                            </Col>
                          </Row>
                        </PrimaryWrapperChild>
                      </SwitchableView>
                    </Col>
                  </Row>
                </React.Fragment>
              )
            )}
          </ErrorHandlerComponent>
        </Panel>
        <Panel panelId="Recipients">
          {lists && lists.length > 0 && (
            <Card>
              {processing[USER_ACTIONS.LOAD_RECIPIENTS].status && <Loading />}
              <Recipients
                lists={lists}
                processing={processing}
                toolState={toolState}
                loadRecipients={loadRecipients}
              />
            </Card>
          )}
        </Panel>
      </Panels>
    </div>
  );
};

export default CampaignDetail;
