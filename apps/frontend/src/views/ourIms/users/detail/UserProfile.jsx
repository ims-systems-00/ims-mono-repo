import PhotoUpload from "@/components/ImageEditor/Index";
import Loading from "@/components/Loader/Loading";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import useModal from "@/hooks/useModal";
import {
  Badge,
  Button,
  Card,
  CardBody,
  Col,
  DrawerContextProvider,
  DrawerOpener,
  DrawerRight,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { ACTIONS, EFFECTS, IMS_SERVICES } from "@/rolesAndPermissions";
import { useApplication } from "@/stores/applicationStore";
import IVal from "@/validations/validator";
import AvatarUploadForm from "../AvatarUploadForm";
import Location from "../Location";
import LocationForm from "../LocationForm";
import { USER_ACTIONS, useUserManager } from "../store";
import BecomePartnerPromo from "./BecomePartnerPromo";
import GoLivePromo from "./GoLivePromo";
import MembershipFormContainer from "./MembershipFormContainer";
import UserFormContainer from "./UserFormContainer";
import ChangeRoleForm from "./ChangeRoleForm";
import Can from "@/components/Can/Can";

const UserProfile = (props) => {
  const { currentUserData, membershipData, tokenPair, switchIntoGroup } =
    useApplication();
  let {
    visitingUser: user,
    visitUser,
    processing,
    changeProfilePicture,
    cheangeRole,
  } = useUserManager();

  const { authUser, authSuperUser, entityAccessControl } = useAccess();
  const history = useHistory();
  //shifted from modals
  const [file, setFile] = React.useState(null);

  const dataSet = {
    data: {
      profileImageInfo: null,
    },
    errors: {},
  };
  const schema = {
    profileImageInfo: IVal.array().min(1).label("Profile image"),
  };

  const { dataModel, handleSubmit, handleFileChange, validate, isBusy } =
    useForm(dataSet, schema);

  const handleUpload = async (e) => {
    await handleSubmit(e, () => changeProfilePicture(dataModel.data)); //Handles file attachment to user profile
  };

  //Shifted from modals
  let { Modal } = useModal({});

  //Modal toggles and state
  const [modalOpen, setModalOpen] = React.useState(false);
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };
  function isMyProfile() {
    return tokenPair?.accessTokenData?.user?._id === user?._id;
  }
  return (
    <>
      <div className="content">
        {processing[USER_ACTIONS.LOAD_USER].status ? (
          <Loading />
        ) : (
          user && (
            <div>
              <Row>
                <Col md="4" lg="4" className="card-user text-center mb-4">
                  <div className="outer">
                    <div className="inner">
                      <img
                        alt="..."
                        className="avatar"
                        src={user?.profileImageSrc}
                      />
                      {entityAccessControl({
                        users: [user?._id],
                        effect: "Allow",
                      }) && (
                        <div>
                          <i
                            className="fas fa-camera-retro"
                            onClick={() => {
                              toggleModal();
                            }}
                          ></i>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
                <Col
                  md="8"
                  lg="8"
                  className="mt-5 p-2 d-flex justify-content-between"
                >
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
                    <div className="float-right">
                      <Button
                        color="primary"
                        size="md"
                        className="shadow-sm--hover"
                        onClick={() => history.push("/admin/organisation")}
                      >
                        <i className="ims-icons-20 icon-icon-users-24" />{" "}
                        Organisation(s)
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
                          onClick={() =>
                            membershipData.organization?.isPartner
                              ? history.push("/partner/partnership-dashboard")
                              : history.push("/auth/onboard/partner")
                          }
                          className="shadow-sm--hover"
                        >
                          <i className="ims-icons-20 icon-icon-handshake-24" />{" "}
                          Partnership
                        </Button>
                      </Can>
                    </div>
                  )}
                </Col>

                <Col
                  md="4"
                  lg="4"
                  className="rounded-3 p-3 shadow-sm border card"
                >
                  <h4 className="text-dark font-weight-bold p-1">
                    BU Information
                  </h4>
                  {user.membership.groups?.length ? (
                    user.membership.groups?.map((g) => (
                      <div key={g._id} className="border-top p-3 d-flex">
                        <div className="ms-2 flex-grow-1">
                          <p>{g.name}</p>
                          <small>{g.type}</small>
                          {isMyProfile() && (
                            <React.Fragment>
                              {g?._id !==
                              tokenPair.accessTokenData.user.groupId ? (
                                <Button
                                  size="sm"
                                  color="primary"
                                  outline
                                  className="border-0 float-right"
                                  onClick={async () => {
                                    await switchIntoGroup(g._id);
                                    window.location = "/";
                                  }}
                                >
                                  <i className="ims-icons-20 icon-icon-repeat-24" />
                                </Button>
                              ) : (
                                <span
                                  className={"text-primary float-right px-3"}
                                >
                                  <i className="ims-icons-20 icon-icon-checkcircle-24 rounded-5 border border-primary" />
                                </span>
                              )}
                            </React.Fragment>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <>No business unit found</>
                  )}
                  <Can
                    policy={{
                      service: IMS_SERVICES.ORGANISATION,
                      action: ACTIONS.MANAGE,
                    }}
                  >
                    {!membershipData?.organization?.isCustomer && (
                      <GoLivePromo />
                    )}
                  </Can>
                  <Can
                    policy={{
                      service: IMS_SERVICES.PARTNERSHIPS,
                      action: ACTIONS.MANAGE,
                    }}
                  >
                    {!membershipData?.organization?.isPartner && (
                      <BecomePartnerPromo />
                    )}
                  </Can>
                </Col>
                <Col md="8" lg="8">
                  <Card className="rounded-3 shadow-sm border">
                    <CardBody>
                      <h4 className="font-weight-bold">
                        Basic Information
                        {isMyProfile() && (
                          <div className="d-inline pull-right">
                            <DrawerOpener drawerId="edit-user-form">
                              <Button
                                color="secondary"
                                outline
                                size="md"
                                className="shadow-sm--hover"
                              >
                                <i className="ims-icons-20 icon-icon-pencil-24" />{" "}
                                Edit profile
                              </Button>
                            </DrawerOpener>
                          </div>
                        )}
                      </h4>
                      <Row className="mt-2 p-3">
                        <Col md="6" className="p-1">
                          <p className="font-weight-bold">First name</p>
                          <p className="text-dark">{user?.firstName}</p>
                        </Col>
                        <Col md="6" className="p-1">
                          <p className="font-weight-bold">Last name</p>
                          <p className="text-dark">{user?.lastName}</p>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  <Card className="rounded-3 shadow-sm border">
                    <CardBody>
                      <h4 className="font-weight-bold">
                        Employment details
                        {authSuperUser() && (
                          <div className="d-inline pull-right">
                            {user._id !==
                              tokenPair?.accessTokenData?.user?._id && (
                              <DrawerOpener drawerId="change-role-form">
                                <Button
                                  color="secondary"
                                  outline
                                  size="md"
                                  className="shadow-sm--hover me-2"
                                >
                                  <i className="ims-icons-20 icon-icon-gear-24" />{" "}
                                  Change role
                                </Button>
                              </DrawerOpener>
                            )}
                            <DrawerOpener drawerId="edit-membership-form">
                              <Button
                                color="secondary"
                                outline
                                size="md"
                                className="shadow-sm--hover"
                              >
                                <i className="ims-icons-20 icon-icon-pencil-24" />{" "}
                                Manage
                              </Button>
                            </DrawerOpener>
                          </div>
                        )}
                      </h4>
                      <Row className="mt-2 p-3">
                        <Col md="6" className="p-1">
                          <p className="font-weight-bold">Role</p>
                          <p className="text-dark">{user?.membership?.role}</p>
                        </Col>
                        <Col md="6" className="p-1">
                          <p className="font-weight-bold">Job type</p>
                          <p className="text-dark">
                            {user?.membership?.workLocationType}
                          </p>
                        </Col>
                        <Col md="6" className="p-1">
                          <p className="font-weight-bold">Job title</p>
                          <p className="text-dark">
                            {user?.membership?.jobTitle}
                          </p>
                        </Col>
                        <Col md="6" className="p-1">
                          <p className="font-weight-bold">Salary</p>
                          <p className="text-dark">
                            {user?.membership?.salary}
                          </p>
                        </Col>
                        <Col md="6" className="p-1">
                          <p className="font-weight-bold">Country</p>
                          <p className="text-dark">
                            {user?.membership?.country?.name}
                          </p>
                        </Col>
                        <Col md="6" className="p-1">
                          <p className="font-weight-bold">Leaves entitled to</p>
                          <p className="text-dark">
                            {user?.membership?.leaveDaysEntitledTo}
                          </p>
                        </Col>
                        <Col md="6" className="p-1">
                          <p className="font-weight-bold">Toil balance</p>
                          <p className="text-dark">
                            {user?.membership?.toilBalance}
                          </p>
                        </Col>
                        <Col md="6" className="p-1">
                          <p className="font-weight-bold">Line managers</p>
                          <p className="text-dark">
                            {user?.membership?.lineManagers.map(
                              (lineManager) => (
                                <Badge color="primary">
                                  {lineManager.name}
                                </Badge>
                              )
                            )}
                          </p>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                  {/* <Card className="rounded-3 shadow-sm border">
                    <CardBody>
                      <h4 className="font-weight-bold">Working Locations</h4>
                      <Row>
                        <Col md="12">
                          <LocationForm
                            userId={user?._id}
                            refreshUser={visitUser}
                          />
                          <div className="mb-5">
                            {user?.membership?.workLocations.map((location) => (
                              <Location
                                key={location._id}
                                userId={user._id}
                                location={location}
                                refreshUser={visitUser}
                              />
                            ))}
                          </div>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card> */}
                </Col>
              </Row>
              <DrawerRight drawerId="change-role-form">
                <ChangeRoleForm
                  membership={user?.membership}
                  onSubmit={async (d) => {
                    await cheangeRole(user?.membership?._id, d.role.value);
                  }}
                />
              </DrawerRight>
              <DrawerRight drawerId="edit-user-form">
                <UserFormContainer />
              </DrawerRight>
              <DrawerRight drawerId="edit-membership-form">
                <MembershipFormContainer />
              </DrawerRight>
            </div>
          )
        )}

        <Modal title="Profile photo">
          <AvatarUploadForm
            user={user}
            imageUrl={user?.profileImageSrc && user?.profileImageSrc}
            refreshUser={visitUser}
            processing={processing}
            // setProcessing={setProcessing}
          />
        </Modal>
      </div>
      <PhotoUpload
        modalOpen={modalOpen}
        toggleModal={toggleModal}
        photoUrl={user?.profileImageSrc && user?.profileImageSrc}
        processing={processing}
        validate={validate}
        onUpload={(files) => handleFileChange(files, "profileImageInfo")}
        handleUpload={handleUpload}
        file={file}
        name="profile"
        setFile={setFile}
      />
    </>
  );
};

export default UserProfile;
