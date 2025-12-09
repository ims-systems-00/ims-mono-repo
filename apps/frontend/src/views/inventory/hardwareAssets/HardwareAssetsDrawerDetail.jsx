import Loading from "@/components/Loader/Loading";
import { PanelTab, PanelTabs, PanelWindow } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import DetailsWrapper from "@/views/shared/DetailComponents/DetailsWrapper";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
import USER_ACTIONS from "./actions";
import { useHardwareAssets } from "./store";
import HardwareOverview from "./HardwareOverview";
import NavigationTabs from "@/components/NavigationTabs";

const HardwareAssetDrawerDetail = (props) => {
  let { processing, hardware } = useHardwareAssets();

  return (
    <React.Fragment>
      <ErrorHandlerComponent
        hasError={processing[USER_ACTIONS.LOAD_HARDWARE]?.error}
        errorMessage="This hardware has been deleted or removed"
      >
        {processing[USER_ACTIONS.LOAD_HARDWARE]?.status ? (
          <Loading />
        ) : (
          hardware && (
            <React.Fragment>
              <DetailsDrawerHeader data={hardware} />
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
                    component: <HardwareOverview data={hardware} />,
                  },
                  {
                    id: "details",
                    text: "Details",
                    icon: (
                      <i className="ims-icons-20 icon-icon-list-24 me-1"></i>
                    ),
                    component: (
                      <div className="px-2 pt-1">
                        <DetailsWrapper label={`Asset lifecycle:`} />
                        <DetailsSectionContent
                          label={"Assigned date:"}
                          value={
                            hardware.assignedDate
                              ? moment(hardware.assignedDate).format(
                                  "DD/MM/YYYY"
                                )
                              : ""
                          }
                        />
                        <DetailsSectionContent
                          label={"Returned date:"}
                          value={
                            hardware.returnDate
                              ? moment(hardware.returnDate).format("DD/MM/YYYY")
                              : ""
                          }
                        />
                        <DetailsSectionContent
                          label={"Destruction date:"}
                          value={
                            hardware.destructionDate
                              ? moment(hardware.destructionDate).format(
                                  "DD/MM/YYYY"
                                )
                              : ""
                          }
                        />
                        {hardware?.tagsAndCategories && (
                          <DetailsWrapper
                            label={"Additional Information:"}
                            iconClass={"tim-icons icon-pencil"}
                            value={`Category: ${hardware?.tagsAndCategories?.name}`}
                            labelClass={"pr-2"}
                          />
                        )}
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

export default HardwareAssetDrawerDetail;
