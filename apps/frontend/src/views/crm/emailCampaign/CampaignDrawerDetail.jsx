import Loading from "@/components/Loader/Loading";
import {Table } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { Attachments } from "@/views/shared/Attachments/Index";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import CampaignOverview from "./CampaignOverview";
import Recipients from "./Recipients";
import USER_ACTIONS from "./actions";
import { useCampaign } from "./store";
import NavigationTabs from "@/components/NavigationTabs";

const CampaignDrawerDetail = () => {
  let {
    processing,
    visitingCampaign: campaign,
    lists,
    toolState,
    loadRecipients,
  } = useCampaign();
  return (
    <React.Fragment>
      <ErrorHandlerComponent
        hasError={processing[USER_ACTIONS.LOAD_EMAIL].error}
        errorMessage="This campaign has been deleted or removed"
      >
        {processing[USER_ACTIONS.LOAD_EMAIL].status ? (
          <Loading />
        ) : (
          campaign && (
            <React.Fragment>
              <DetailsDrawerHeader data={campaign} />
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
                        <div className="border rounded-3 p-3 mb-3">
                          <CampaignOverview />
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: "details",
                    text: "Details",
                    icon: (
                      <i className="ims-icons-20 icon-icon-list-24 me-1"></i>
                    ),
                    component: (
                      <div className="px-2 pt-3">
                        <div className="border rounded-3 p-3 mb-3">
                          {campaign.customAudience.lenght > 0 ? (
                            <div>
                              <DetailsSectionHeader
                                title={`Additional audience`}
                              />

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
                                  {campaign.customAudience.map((customer) => (
                                    <tr>
                                      <th>{customer.reference}</th>
                                      <th className="text-secondary text-right">
                                        {customer.name}
                                      </th>
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            </div>
                          ) : null}

                          <DetailsWrapper
                            label={"Subject:"}
                            value={campaign.subject}
                          />

                          <DetailsWrapper
                            label={"Message:"}
                            value={campaign.body}
                          />

                          <br></br>
                          <DetailsSectionHeader title={`Attachments`} />

                          <Attachments s3Information={campaign.attachments} />
                        </div>
                      </div>
                    ),
                  },
                  {
                    id: "recipients",
                    text: "Recipients",
                    icon: <i className="fa-solid fa-comment me-1"></i>,
                    component: (
                      <div className="pt-1">
                        {processing[USER_ACTIONS.LOAD_RECIPIENTS].status && (
                          <Loading />
                        )}
                        <Recipients
                          lists={lists}
                          processing={processing}
                          toolState={toolState}
                          loadRecipients={loadRecipients}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            </React.Fragment>
          )
        )}
      </ErrorHandlerComponent>
    </React.Fragment>
  );
};

export default CampaignDrawerDetail;
