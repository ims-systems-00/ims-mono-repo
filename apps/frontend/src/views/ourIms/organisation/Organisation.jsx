import PhotoUpload from "@/components/ImageEditor/Index";
import classNames from "classnames";
import Loading from "@/components/Loader/Loading";
import useAccess from "@/hooks/useAccess";
import {
  Button,
  Card,
  CardBody,
  Col,
  DrawerOpener,
  DrawerRight,
  Modal,
  Row,
  useDrawer,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { useApplication } from "@/stores/applicationStore";
import useMemberships from "../../../hooks/useMemberships";
import CreateANewOrganisationPromo from "./CreateANewOrganisationPromo";
import OrganisationForm from "./OrganisationForm";
import { useOrganisation } from "./store";
import ResolutionForm from "./ResolutionForm";
import SystemDateForm from "./SystemDateForm";
import SubscriptionTable from "./SubscriptionTable";
import SubscriptionForm from "./SubscriptionForm";
import LicenseForm from "./LicenseForm";
import OrgRefreshButton from "./OrgRefreshButton";
import useAlerts from "@/hooks/useAlerts";
import Can from "@/components/Can/Can";
import useForm from "@/hooks/useForm";
import IVal from "@/validations/validator";
import { ImageDropZone } from "@/components/ImageUpload";

const Organisation = () => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [uploading, setUploading] = React.useState({
    status: false,
    progress: 0,
  });
  const [uploadType, setUploadType] = React.useState(null); // 'logo' or 'banner'

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  const {
    currentUserData,
    tokenPair,
    redirectToCheckout,
    retrivingCheckoutSession,
    redirectToBilling,
    retrivingBillingSession,
    switchIntoOrganisation,
    membershipData,
  } = useApplication();
  const user = currentUserData;
  const {
    authUser,
    authCarboCalcLicense,
    authGo2eroLicense,
    authProjectiMSLicense,
    entityAccessControl,
  } = useAccess();
  const { memberships } = useMemberships();
  const { alert, warningWithConfirmMessage } = useAlerts();
  const history = useHistory();
  const {
    organisation,
    amendOrganisation,
    amendIncidentResolution,
    amendSystemDates,
    addSubscriber,
    requestLicense,
    changeLogo,
    changeOrgLogo,
    changeOrgBanner,
  } = useOrganisation();
  let { closeDrawer } = useDrawer();

  const [file, setFile] = React.useState(null);

  const dataSet = {
    data: {
      logometadata: null,
    },
    errors: {},
  };
  const schema = {
    logometadata: IVal.array().min(1).label("Profile image"),
  };

  const { dataModel, handleSubmit, handleFileChange, validate, isBusy } =
    useForm(dataSet, schema);

  const handleUploadProgress = (progress) => {
    setUploading({ status: true, progress });
  };

  const handleLogoUpload = async (file) => {
    setUploadType("logo");
    const success = await changeOrgLogo(file.file, handleUploadProgress);
    if (success) {
      setUploading({ status: false, progress: 0 });
      setUploadType(null);
    }
  };

  const handleBannerUpload = async (file) => {
    setUploadType("banner");
    const success = await changeOrgBanner(file.file, handleUploadProgress);
    if (success) {
      setUploading({ status: false, progress: 0 });
      setUploadType(null);
    }
  };

  return (
    <React.Fragment>
      {alert}
      <div className="content">
        {!organisation ? (
          <Loading />
        ) : (
          <div>
            <Row>
              <Col md="4" lg="4">
                <Card className="rounded-3 py-3 px-0 shadow-sm border">
                  <div className="d-flex justify-content-center align-items-center gap-4 mb-3">
                    <div className="text-center">
                      <h6 className="mb-2">Logo</h6>
                      {uploading.status && uploadType === "logo" && (
                        <div className="mb-2">
                          <div className="progress" style={{ height: "5px" }}>
                            <div
                              className="progress-bar progress-bar-striped progress-bar-animated"
                              role="progressbar"
                              style={{ width: `${uploading.progress}%` }}
                              aria-valuenow={uploading.progress}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            />
                          </div>
                          <small className="text-muted">
                            Uploading {uploading.progress}%
                          </small>
                        </div>
                      )}
                      <ImageDropZone
                        width={120}
                        height={120}
                        onChange={handleLogoUpload}
                        url={organisation?.logo?.src}
                        disabled={uploading.status}
                      />
                    </div>
                    <div className="text-center">
                      <h6 className="mb-2">Banner</h6>
                      {uploading.status && uploadType === "banner" && (
                        <div className="mb-2">
                          <div className="progress" style={{ height: "5px" }}>
                            <div
                              className="progress-bar progress-bar-striped progress-bar-animated"
                              role="progressbar"
                              style={{ width: `${uploading.progress}%` }}
                              aria-valuenow={uploading.progress}
                              aria-valuemin="0"
                              aria-valuemax="100"
                            />
                          </div>
                          <small className="text-muted">
                            Uploading {uploading.progress}%
                          </small>
                        </div>
                      )}
                      <ImageDropZone
                        width={250}
                        height={120}
                        onChange={handleBannerUpload}
                        hint="Select or drop image"
                        url={organisation?.logoRectangleSrc}
                        disabled={uploading.status}
                      />
                    </div>
                  </div>

                  <h4 className="text-dark text-center font-weight-bold p-1">
                    {organisation.name}
                  </h4>
                  <p className="text-primary text-center mb-3">
                    {tokenPair?.accessTokenData?.user?.role || "Outsider"}
                  </p>
                  {memberships.map((m) => (
                    <div
                      key={m._id}
                      className={classNames("border-top p-3 d-flex", {
                        "":
                          m.organization?._id ===
                          tokenPair.accessTokenData.user.organizationId,
                      })}
                    >
                      <img
                        alt="..."
                        className="avatar"
                        src={m.organization?.logo?.src}
                      />{" "}
                      <div className="ms-2 flex-grow-1 d-flex justify-content-between align-items-center">
                        <div className="">
                          <p>{m.organization.name}</p>
                          <small>{m.role}</small>
                        </div>
                        {m.organization?._id !==
                        tokenPair.accessTokenData.user.organizationId ? (
                          <Button
                            size="sm"
                            color="primary"
                            outline
                            className="border-0 pull-right"
                            onClick={(e) => {
                              warningWithConfirmMessage(
                                `You are about to check-in  to ${m.organization.name}'s iMS`,
                                async () => {
                                  await switchIntoOrganisation(
                                    m.organization?._id
                                  );
                                  if (m?.organization?.isCustomer) {
                                    return history.push("/");
                                  }
                                  if (m?.organization?.isPartner) {
                                    return history.push(
                                      "/partner/partnership-dashboard"
                                    );
                                  }
                                }
                              );
                            }}
                          >
                            <i className="ims-icons-20 icon-icon-repeat-24" />
                          </Button>
                        ) : (
                          <span className={"text-primary pull-right px-3"}>
                            ⦿
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <CreateANewOrganisationPromo />
                </Card>
              </Col>
              <Col md="8">
                <Row>
                  <Col md="12" className="p-2 d-flex justify-content-between">
                    <div>
                      <h3 className="font-weight-bold">{user?.name}</h3>
                      <p>{user?.email}</p>
                    </div>
                    {(authUser({
                      service: IMS_SERVICES.USERS,
                      action: ACTIONS.CREATE,
                      effect: EFFECTS.ALLOW,
                    }) ||
                      user?._id === currentUserData?._id) && (
                      <div className="pull-right">
                        <Button
                          color="primary"
                          size="md"
                          className="shadow-sm--hover"
                          onClick={() =>
                            history.push(`/admin/users/${currentUserData._id}`)
                          }
                        >
                          <i className="ims-icons-20 icon-icon-user-24" /> My
                          profile
                        </Button>
                        <Can
                          policy={{
                            service: IMS_SERVICES.PARTNERSHIPS,
                            action: ACTIONS.MANAGE,
                          }}
                        >
                          <Button
                            color="primary"
                            outline
                            size="md"
                            className="shadow-sm--hover"
                            onClick={() =>
                              membershipData.organization?.isPartner
                                ? history.push("/partner/partnership-dashboard")
                                : history.push("/auth/onboard/partner")
                            }
                          >
                            <i className="ims-icons-20 icon-icon-handshake-24" />{" "}
                            Partnership
                          </Button>
                        </Can>
                      </div>
                    )}
                  </Col>
                  <Col md="12">
                    <Card className="rounded-3 shadow-sm border">
                      <CardBody>
                        <h4 className="font-weight-bold">
                          Basic Information <OrgRefreshButton />
                          <Can
                            policy={{
                              service: IMS_SERVICES.ORGANISATION,
                              action: ACTIONS.MANAGE,
                            }}
                          >
                            <div className="d-inline pull-right">
                              <DrawerOpener drawerId="edit-organizaion-form">
                                <Button
                                  color="secondary"
                                  outline
                                  size="md"
                                  className="shadow-sm--hover"
                                >
                                  <i className="ims-icons-20 icon-icon-pencil-24" />{" "}
                                  Edit
                                </Button>
                              </DrawerOpener>
                            </div>
                          </Can>
                        </h4>
                        <Row className="mt-2 p-3">
                          <Col md="6" className="p-1">
                            <p className="font-weight-bold">Name</p>
                            <p className="text-dark">{organisation?.name}</p>
                          </Col>
                          <Col md="6" className="p-1">
                            <p className="font-weight-bold">Industry</p>
                            <p className="text-dark">{organisation.industry}</p>
                          </Col>
                          <Col md="6" className="p-1">
                            <p className="font-weight-bold">Work email</p>
                            <p className="text-dark">
                              {organisation.officeEmail || "N/A"}
                            </p>
                          </Col>
                          <Col md="6" className="p-1">
                            <p className="font-weight-bold">Contact number</p>
                            <p className="text-dark">
                              {organisation.contactNumber || "N/A"}
                            </p>
                          </Col>
                          <Col md="6" className="p-1">
                            <p className="font-weight-bold">Company number</p>
                            <p className="text-dark">
                              {organisation.companyNumber || "N/A"}
                            </p>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                    <Card className="rounded-3 shadow-sm border">
                      <CardBody>
                        <h4 className="font-weight-bold">
                          Address <OrgRefreshButton />
                        </h4>
                        <Row className="mt-2 p-3">
                          <Col md="6" className="p-1">
                            <p className="font-weight-bold">Building</p>
                            <p className="text-dark">
                              {organisation.addressBuilding || "N/A"}
                            </p>
                          </Col>
                          <Col md="6" className="p-1">
                            <p className="font-weight-bold">Street</p>
                            <p className="text-dark">
                              {organisation.addressStreet || "N/A"}
                            </p>
                          </Col>
                          <Col md="6" className="p-1">
                            <p className="font-weight-bold">City</p>
                            <p className="text-dark">
                              {organisation.addressCity || "N/A"}
                            </p>
                          </Col>
                          <Col md="6" className="p-1">
                            <p className="font-weight-bold">Post code</p>
                            <p className="text-dark">
                              {organisation.addressPostCode}
                            </p>
                          </Col>
                          <Col md="6" className="p-1">
                            <p className="font-weight-bold">State/province</p>
                            <p className="text-dark">
                              {organisation?.addressStateProvince || "N/A"}
                            </p>
                          </Col>
                          <Col md="6" className="p-1">
                            <p className="font-weight-bold">Country</p>
                            <p className="text-dark">
                              {organisation.countryName || "N/A"}
                            </p>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                    {organisation.isCustomer && (
                      <React.Fragment>
                        <Card className="rounded-3 shadow-sm border">
                          <CardBody>
                            <h4 className="font-weight-bold">
                              Licenses <OrgRefreshButton />
                              <Can
                                policy={{
                                  service: IMS_SERVICES.LICENSE_MANAGEMENT,
                                  action: ACTIONS.MANAGE,
                                }}
                              >
                                <DrawerOpener
                                  className="pull-right "
                                  drawerId="request-license-form"
                                >
                                  <Button
                                    color="secondary"
                                    outline
                                    size="md"
                                    className="shadow-sm--hover"
                                  >
                                    <i className="ims-icons-20 icon-icon-gear-24" />{" "}
                                    Request license
                                  </Button>
                                </DrawerOpener>
                                {
                                  // if they are not subscribed with card prompt them to pay with card
                                  // regardless of their payment method.
                                  !organisation?.paymentSystem?.information
                                    ?.stripeSubscriptionId ? (
                                    <Button
                                      color="primary"
                                      disabled={retrivingCheckoutSession}
                                      className="me-2 pull-right"
                                      onClick={() =>
                                        redirectToCheckout(organisation._id)
                                      }
                                    >
                                      <i className="ims-icons-20 icon-icon-coin-24" />{" "}
                                      {retrivingCheckoutSession
                                        ? "Creating session..."
                                        : "Card payment"}
                                    </Button>
                                  ) : (
                                    <Button
                                      color="primary"
                                      className="me-2 pull-right"
                                      disabled={retrivingBillingSession}
                                      onClick={() =>
                                        redirectToBilling(organisation._id)
                                      }
                                    >
                                      <i className="ims-icons-20 icon-icon-money-24" />{" "}
                                      {retrivingBillingSession
                                        ? "Creating session..."
                                        : "Manage billing"}
                                    </Button>
                                  )
                                }
                              </Can>
                            </h4>
                            <Row className="mt-2 p-3">
                              <Col md="6" className="p-1">
                                <p className="font-weight-bold">Super user</p>
                                <p className="text-dark">
                                  {organisation.licenses.superUser.used}/
                                  {organisation.licenses.superUser.allocated}
                                </p>
                              </Col>
                              <Col md="6" className="p-1">
                                <p className="font-weight-bold">User</p>
                                <p className="text-dark">
                                  {organisation.licenses.users.used}/
                                  {organisation.licenses.users.allocated}
                                </p>
                              </Col>
                              <Col md="6" className="p-1">
                                <p className="font-weight-bold">
                                  Business unit
                                </p>
                                <p className="text-dark">
                                  {organisation.licenses.groups.used}/
                                  {organisation.licenses.groups.allocated}
                                </p>
                              </Col>
                              <Col md="6" className="p-1">
                                <p className="font-weight-bold">
                                  Compliance Toolkits
                                </p>
                                <p className="text-dark">
                                  {organisation.licenses.complianceTools
                                    .map((t) => t)
                                    .join(" ") || "N/A"}
                                </p>
                              </Col>
                              <Col md="6" className="p-1">
                                <p className="font-weight-bold">
                                  Additional modules
                                </p>
                                <p className="text-dark">
                                  {authCarboCalcLicense() && "CarboCalc, "}
                                  {authProjectiMSLicense() && "Project iMS "}
                                  {organisation.licenses.additionalModules
                                    .map((t) => t)
                                    .join(" ")}
                                </p>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                        <Card className="rounded-3 shadow-sm border">
                          <CardBody>
                            <h4 className="font-weight-bold">
                              Incident resolution time <OrgRefreshButton />
                              <Can
                                policy={{
                                  service: IMS_SERVICES.ORGANISATION,
                                  action: ACTIONS.MANAGE,
                                }}
                              >
                                <DrawerOpener
                                  className="pull-right "
                                  drawerId="edit-resolution-form"
                                >
                                  <Button
                                    color="secondary"
                                    outline
                                    size="md"
                                    className="shadow-sm--hover"
                                  >
                                    <i className="ims-icons-20 icon-icon-pencil-24" />{" "}
                                    Edit
                                  </Button>
                                </DrawerOpener>
                              </Can>
                            </h4>
                            <Row className="mt-2 p-3">
                              <Col md="3" className="p-1">
                                <p className="font-weight-bold">P1 time</p>
                                <p className="text-dark">
                                  {organisation.p1incidentResolutionTime} hr
                                </p>
                              </Col>
                              <Col md="3" className="p-1">
                                <p className="font-weight-bold">P2 time</p>
                                <p className="text-dark">
                                  {organisation.p2incidentResolutionTime} hr
                                </p>
                              </Col>
                              <Col md="3" className="p-1">
                                <p className="font-weight-bold">P3 time</p>
                                <p className="text-dark">
                                  {organisation.p3incidentResolutionTime} hr
                                </p>
                              </Col>
                              <Col md="3" className="p-1">
                                <p className="font-weight-bold">P4 time</p>
                                <p className="text-dark">
                                  {organisation.p4incidentResolutionTime} hr
                                </p>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                        <Card className="rounded-3 shadow-sm border">
                          <CardBody>
                            <h4 className="font-weight-bold">
                              System dates <OrgRefreshButton />
                              <Can
                                policy={{
                                  service: IMS_SERVICES.ORGANISATION,
                                  action: ACTIONS.MANAGE,
                                }}
                              >
                                <DrawerOpener
                                  className="pull-right "
                                  drawerId="edit-system-dates"
                                >
                                  <Button
                                    color="secondary"
                                    outline
                                    size="md"
                                    className="shadow-sm--hover"
                                  >
                                    <i className="ims-icons-20 icon-icon-pencil-24" />{" "}
                                    Edit
                                  </Button>
                                </DrawerOpener>
                              </Can>
                            </h4>
                            <Row className="mt-2 p-3">
                              <Col md="6" className="p-1">
                                <p className="font-weight-bold">
                                  System start date
                                </p>
                                <p className="text-dark">
                                  {moment(organisation.systemDate.start).format(
                                    "DD/MM/YYYY"
                                  )}
                                </p>
                              </Col>
                              <Col md="6" className="p-1">
                                <p className="font-weight-bold">
                                  System end date
                                </p>
                                <p className="text-dark">
                                  {moment(organisation.systemDate.end).format(
                                    "DD/MM/YYYY"
                                  )}
                                </p>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                        <Can
                          policy={{
                            service: IMS_SERVICES.ORGANISATION,
                            action: ACTIONS.MANAGE,
                          }}
                        >
                          <Card className="rounded-3 shadow-sm border">
                            <CardBody>
                              <h4 className="font-weight-bold">
                                Report intervals <OrgRefreshButton />
                                <DrawerOpener
                                  className="pull-right "
                                  drawerId="add-subscriber"
                                >
                                  <Button
                                    color="secondary"
                                    outline
                                    size="md"
                                    className="shadow-sm--hover"
                                  >
                                    <i class="ims-icons-20 icon-icon-userplus-24 me-1 p-0" />
                                    Add subscriber
                                  </Button>
                                </DrawerOpener>
                              </h4>
                              <Row className="mt-2 p-3">
                                <Col md="12" className="p-1">
                                  <SubscriptionTable />
                                </Col>
                              </Row>
                            </CardBody>
                          </Card>
                        </Can>
                      </React.Fragment>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <DrawerRight drawerId="edit-organizaion-form">
              {organisation && (
                <OrganisationForm
                  organisation={organisation}
                  onSubmit={async (data) => {
                    await amendOrganisation(data);
                    closeDrawer("edit-organizaion-form");
                  }}
                />
              )}
            </DrawerRight>
            <DrawerRight drawerId="edit-resolution-form">
              {organisation && (
                <ResolutionForm
                  organisation={organisation}
                  onSubmit={async (data) => {
                    await amendIncidentResolution(data);
                    closeDrawer("edit-resolution-form");
                  }}
                />
              )}
            </DrawerRight>
            <DrawerRight drawerId="edit-system-dates">
              {organisation && (
                <SystemDateForm
                  organisation={organisation}
                  onSubmit={async (data) => {
                    await amendSystemDates(data);
                    closeDrawer("edit-system-dates");
                  }}
                />
              )}
            </DrawerRight>
            <DrawerRight drawerId="add-subscriber">
              <SubscriptionForm
                onSubmit={async (data) => {
                  await addSubscriber(data);
                  closeDrawer("add-subscriber");
                }}
              />
            </DrawerRight>
            <DrawerRight drawerId="request-license-form">
              <LicenseForm
                existingLicense={organisation.licenses}
                onSubmit={async (data) => {
                  await requestLicense(data);
                  closeDrawer("request-license-form");
                }}
              />
            </DrawerRight>
          </div>
        )}
        <Modal title="Profile photo"></Modal>
      </div>
      <PhotoUpload
        modalOpen={modalOpen}
        toggleModal={toggleModal}
        photoUrl={organisation?.logo?.src}
        // processing={processing}
        validate={validate}
        onUpload={(files) => handleFileChange(files, "logometadata")}
        handleUpload={(e) => {
          handleSubmit(e, () => {
            console.log("photo uploaded", e);
            changeLogo({
              logometadata: dataModel.data.logometadata[0],
            });
            console.log(
              "photo uploaded",
              dataModel,
              dataModel.data.logometadata[0]
            );
          });
        }}
        file={file}
        name="profile"
        setFile={setFile}
      />
    </React.Fragment>
  );
};

export default Organisation;
