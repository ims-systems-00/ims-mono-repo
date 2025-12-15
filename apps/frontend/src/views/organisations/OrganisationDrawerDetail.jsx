import React from "react";
import Loading from "@/components/Loader/Loading";
import NavigationTabs from "@/components/NavigationTabs";
import DetailsDrawerHeader from "@/views/shared/DetailComponents/DetailsDrawerHeader";
import { Attachments } from "@/views/shared/Attachments/Index";
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Table, // Added Table import
} from "@ims-systems-00/ims-ui-kit";

import USER_ACTIONS from "./actions";
import useOrganisation from "./store/useOrganisation";
import OrganisationOverview from "./OrganisationOverview";

const OrganisationDrawerDetail = ({ organisation }) => {
  const {
    users,
    incidentResolution,
    systemDates,
    reportSubscribers,

    fetchOrganisationUsers,
    fetchIncidentResolution,
    fetchSystemDates,
    loadSubscribers,

    processing,
  } = useOrganisation({
    match: { params: { id: organisation?._id } },
  });

  React.useEffect(() => {
    if (organisation?._id) {
      fetchOrganisationUsers();
      fetchIncidentResolution();
      fetchSystemDates();
      loadSubscribers();
    }
  }, [organisation?._id]);

  const getAddressString = (org) => {
    return [
      org.addressStreet,
      org.addressBuilding,
      org.addressCity,
      org.addressStateProvince,
      org.countryName,
    ]
      .filter(Boolean)
      .join(", ");
  };

  if (!organisation) return <Loading />;

  return (
    <React.Fragment>
      <DetailsDrawerHeader data={organisation} />
      <React.Fragment>
        <NavigationTabs
          container={false}
          activeTab="details"
          navigations={[
            {
              id: "details",
              text: "Details",
              icon: <i className="ims-icons-20 icon-icon-list-24 me-1"></i>,
              component: (
                <div className="px-2 pt-3">
                  {/* Overview Section */}
                  <div className="border rounded-3 p-3 mb-3">
                    <OrganisationOverview organisation={organisation} />
                  </div>

                  {/* Contact & Address Section - Converted to Table */}
                  <div className="border rounded-3 p-3 mb-3">
                    <p className="mb-3 px-1 fs-6">Contact Information</p>
                    <Table borderless responsive className="table-sm mb-0">
                      <tbody>
                        <tr>
                          <td className="text-dark" style={{ width: "35%" }}>
                            Office Email
                          </td>
                          <td>
                            <p>{organisation.officeEmail || "N/A"}</p>
                          </td>
                        </tr>
                        <tr>
                          <td className="text-dark">Contact Number</td>
                          <td>{organisation.contactNumber || "N/A"}</td>
                        </tr>
                        <tr>
                          <td className="text-dark">Address</td>
                          <td>{getAddressString(organisation) || "N/A"}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>

                  {/* Attachments Section */}
                  {organisation.attachments?.length > 0 && (
                    <div className="border rounded-3 p-3">
                      <h6
                        className="mb-3 px-1 text-muted text-uppercase fs-6"
                        style={{ letterSpacing: "0.5px" }}
                      >
                        Attachments
                      </h6>
                      <Attachments s3Information={organisation.attachments} />
                    </div>
                  )}
                </div>
              ),
            },

            {
              id: "users",
              text: "Users",
              icon: <i className="ims-icons-20 icon-icon-user-24 me-1"></i>,
              component: (
                <div className="px-2 pt-3">
                  {processing[USER_ACTIONS.LOAD_USERS]?.status ? (
                    <Loading />
                  ) : users.length > 0 ? (
                    <div className="d-flex flex-column gap-2">
                      {users.map((u) => {
                        const initials = u.name
                          ? u.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .substring(0, 2)
                              .toUpperCase()
                          : "U";

                        return (
                          <div
                            key={u._id}
                            className="d-flex align-items-center p-3 border rounded-3 user-card-hover"
                            style={{
                              transition: "all 0.2s ease",
                              border: "1px solid #f0f0f0",
                            }}
                          >
                            <div
                              className="d-flex align-items-center justify-content-center rounded-circle text-white bg-secondary me-3"
                              style={{
                                width: "40px",
                                height: "40px",
                                fontSize: "14px",
                                fontWeight: "600",
                              }}
                            >
                              {initials}
                            </div>

                            <div className="flex-grow-1">
                              <p
                                className="mb-0 text-dark font-weight-bold"
                                style={{ fontSize: "0.95rem" }}
                              >
                                {u.name}
                              </p>
                              <small style={{ fontSize: "0.85rem" }}>
                                {u.email}
                              </small>
                            </div>

                            <div className="text-muted opacity-50">
                              <i
                                className="tim-icons icon-single-02"
                                style={{ fontSize: "1.2rem" }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div
                        className="bg-light rounded-circle d-inline-flex align-items-center justify-content-center mb-2"
                        style={{ width: "50px", height: "50px" }}
                      >
                        <i
                          className="tim-icons icon-single-02 text-secondary opacity-50"
                          style={{ fontSize: "20px" }}
                        ></i>
                      </div>
                      <p className="text-secondary small mb-0">
                        No users found.
                      </p>
                    </div>
                  )}
                </div>
              ),
            },

            {
              id: "incidentResolution",
              text: "Incident Resolution",
              icon: <i className="ims-icons-20 icon-icon-flag-24 me-1"></i>,
              component: (
                <div className="px-2 pt-3">
                  {processing[USER_ACTIONS.LOAD_INCIDENT]?.status ? (
                    <Loading />
                  ) : incidentResolution ? (
                    <div className="border rounded-3 p-3">
                      <Table borderless responsive className="table-sm mb-0">
                        <tbody>
                          <tr>
                            <td className="text-dark" style={{ width: "40%" }}>
                              Resolution Policy
                            </td>
                            <td>{incidentResolution.policy || "N/A"}</td>
                          </tr>
                          <tr>
                            <td className="text-dark">Default Response Time</td>
                            <td>{incidentResolution.responseTime || "N/A"}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-secondary text-center mt-3">
                      No incident resolution data available.
                    </p>
                  )}
                </div>
              ),
            },

            {
              id: "systemDates",
              text: "System Dates",
              icon: <i className="ims-icons-20 icon-icon-clock-24 me-1"></i>,
              component: (
                <div className="px-2 pt-3">
                  {processing[USER_ACTIONS.LOAD_DATES]?.status ? (
                    <Loading />
                  ) : systemDates ? (
                    <div className="border rounded-3 p-3">
                      <Table borderless responsive className="table-sm mb-0">
                        <tbody>
                          <tr>
                            <td className="text-dark" style={{ width: "40%" }}>
                              Start Date
                            </td>
                            <td>{systemDates.startDate || "Not set"}</td>
                          </tr>
                          <tr>
                            <td className="text-dark">End Date</td>
                            <td>{systemDates.endDate || "Not set"}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-secondary text-center mt-3">
                      No system dates found.
                    </p>
                  )}
                </div>
              ),
            },

            {
              id: "subscribers",
              text: "Subscribers",
              icon: <i className="ims-icons-20 icon-icon-users-24 me-1"></i>,
              component: (
                <div className="px-2 pt-3">
                  {processing[USER_ACTIONS.LOAD_SUBSCRIBERS]?.status ? (
                    <Loading />
                  ) : reportSubscribers.length > 0 ? (
                    reportSubscribers.map((s) => (
                      <div
                        key={s._id}
                        className="border rounded-3 p-2 mb-2 d-flex justify-content-between align-items-center"
                      >
                        <span className="text-dark">{s.email}</span>
                        <UncontrolledDropdown size="sm" direction="right">
                          <DropdownToggle
                            outline
                            className="border"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <i className="fa-solid fa-ellipsis-h" />
                          </DropdownToggle>
                          <DropdownMenu bottom>
                            <DropdownItem disabled>
                              Remove Subscriber
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                    ))
                  ) : (
                    <p className="text-secondary text-center mt-3">
                      No subscribers found.
                    </p>
                  )}
                </div>
              ),
            },
          ]}
        />
      </React.Fragment>
    </React.Fragment>
  );
};

export default OrganisationDrawerDetail;
