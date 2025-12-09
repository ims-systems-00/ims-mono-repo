import FormattedContents from "@/components/Editors/TextEditor/FormattedContents";
import Loading from "@/components/Loader/Loading";
import { Panel, Panels } from "@/components/Panel/HorizontalPanel";
import NotificationContext from "@/contexts/notificationContext";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { getLicensesRequest } from "@/services/licensemanagementServices";
import { imsLogger } from "@/services/loggerService";
import { linkGenerator } from "@/utils/formatLinkGenerator";
import DetailsSectionContent from "@/views/shared/DetailsSectionContent";
import DetailsSectionFormattedTextWrapper from "@/views/shared/DetailsSectionFormattedTextWrapper";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import ErrorHandlerComponent from "@/views/shared/ErrorHandlerComponent";
const LicenseDetail = (props) => {
  const { isModalOpen = false } = props;
  let notify = React.useContext(NotificationContext);
  let [license, setLicense] = React.useState(null);
  let [processing, setProcessing] = React.useState({
    action: "load-license",
    id: null,
    error: false,
  });

  const refreshLicense = (license) => {
    setLicense(license);
    props.onUpdate && props.onUpdate(license);
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        let id =
          (props.match && props.match.params.id) ||
          (props.view && props.view._id);
        let { data } = await getLicensesRequest(id);
        setLicense(data.request);
      } catch (ex) {
        imsLogger("LicenseDetail", ex, ex.response);
        notify("Error occurred while fetching data", "danger");
      }
      setProcessing({ action: null, id: null });
    }
    fetchData();
  }, []);
  return (
    <div className="content">
      <Panels
        isModalOpen={isModalOpen}
        defaultPanel={"Details"}
        navLinks={["Details"]}
      >
        <Panel panelId="Details">
          <ErrorHandlerComponent
            hasError={processing.error}
            errorMessage="This request has been deleted or removed"
          >
            {processing.action === "load-license" ? (
              <Loading />
            ) : (
              license && (
                <div className="details-container">
                  <div className="m-3">
                    <Row>
                      <Col>
                        <DetailsSectionHeader title="Licence detail" />
                      </Col>
                      <Col md="12">
                        <DetailsSectionContent
                          label={"Reference:"}
                          value={license.reference}
                        />
                      </Col>

                      {license.type === "Organisational" && (
                        <Col md="12">
                          <DetailsSectionContent
                            label={"Business units:"}
                            value={license.groups.requested}
                          />
                        </Col>
                      )}
                      <Col md="12">
                        <DetailsSectionContent
                          label={"Users:"}
                          value={license.users.requested}
                        />
                      </Col>
                      <Col md="12">
                        <DetailsSectionContent
                          label={"Compliance tools:"}
                          value={license.complianceTools.map((item) => (
                            <p key={item}>{item}</p>
                          ))}
                        />
                      </Col>
                      <Col md="12">
                        <DetailsSectionContent
                          label={"Requested :"}
                          value={`${license?.created?.by?.name} on ${moment(
                            license.created.on
                          ).format("DD/MM/YYYY")}`}
                        />
                      </Col>
                      <Col md="12">
                        <DetailsSectionContent
                          label={"Status :"}
                          value={license.granted.status}
                        />
                      </Col>
                      {license.granted.status === "Granted" && (
                        <Col md="12">
                          <DetailsSectionContent
                            label={"License granted on:"}
                            value={moment(license.granted.on).format(
                              "DD/MM/YYYY"
                            )}
                          />
                        </Col>
                      )}
                      {license.granted.status === "Declined" && (
                        <Col md="12">
                          <DetailsSectionContent
                            label={"Request declined on:"}
                            value={moment(license.granted.on).format(
                              "DD/MM/YYYY"
                            )}
                          />
                        </Col>
                      )}
                      <Col md="12">
                        <DetailsSectionFormattedTextWrapper label={"Message:"}>
                          <FormattedContents
                            value={license.message}
                            mediaLinkGeneratorFn={linkGenerator}
                          />
                        </DetailsSectionFormattedTextWrapper>
                      </Col>
                    </Row>
                  </div>
                </div>
              )
            )}
          </ErrorHandlerComponent>
        </Panel>
      </Panels>
    </div>
  );
};

export default LicenseDetail;
