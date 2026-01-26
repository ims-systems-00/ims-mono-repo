import Loading from "@/components/Loader/Loading";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { useHistory } from "react-router-dom";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import TimeDateComponent from "@/views/shared/TimeDateComponent";
import OrganizationalOverview from "../licenseManagement/OrganizaionalOverview";
import CreateUser from "./CreateUser";
import InvitationForm from "./InvitationForm";
import DeleteProcess from "./deleteProcess/Index";
import { USER_ACTIONS, useUserManager } from "./store";
import { useApplication } from "@/stores/applicationStore";
import Box from "@/components/Box/Index";
import { RowActions } from "./row-actions";
import { Pagination } from "@/components/Pagination/pagination";
import SearchInput from "@/components/SearchInput/search-input";
import useAlerts from "@/hooks/useAlerts";
import { TourStep } from "@/components/Tour";

const defaultdata = [];

const UserTable = ({ ...props }) => {
  let {
    inviteUser,
    users: dataTable,
    processing,
    toolState,
    queryHandlers,
    setUsers,
  } = useUserManager();
  const { tokenPair } = useApplication();
  dataTable = dataTable ? dataTable : defaultdata;
  let { alert } = useAlerts();

  let history = useHistory();
  let { closeDrawer } = useDrawer();

  // Transform data to work with DataTable
  const transformedData = React.useMemo(() => {
    return (dataTable || [])?.map((data) => {
      return {
        id: data._id,
        name: data.name,
        email: data.email,
        jobTitle: data.membership?.find(
          (m) =>
            m.organization === tokenPair?.accessTokenData?.user?.organizationId,
        )?.jobTitle,
        status: data.systemAccess?.status,
        data: data,
        userType: data.membership.find(
          (m) =>
            m.organization === tokenPair?.accessTokenData?.user?.organizationId,
        )?.role,
        lastLoggedIn: data.loggedIn?.on ?? "Never logged in",
      };
    });
  }, [dataTable, tokenPair]);

  // Define columns using the modern format
  const columnsForUsers = [
    {
      accessorKey: "name",
      header: () => <p>Name</p>,
      size: 300,
    },
    {
      accessorKey: "email",
      header: () => <p>Email</p>,
      size: 350,
    },
    {
      accessorKey: "jobTitle",
      header: () => <p>Job Title</p>,
      size: 250,
    },
    {
      accessorKey: "userType",
      header: () => <p>User Type</p>,
      size: 200,
    },
    {
      accessorKey: "status",
      header: () => <p>Status</p>,
      cell: ({ row }) => <BadgeStatus status={row.original.status} />,
      size: 150,
    },
    {
      accessorKey: "lastLoggedIn",
      header: () => <p>Last Logged In</p>,
      cell: ({ row }) => <TimeDateComponent date={row.original.lastLoggedIn} />,
      size: 250,
    },
    {
      id: "actions",
      header: () => <p className="dt-row-actions">Actions</p>,
      cell: ({ row }) => <RowActions row={row} />,
      size: 100,
    },
  ];

  return (
    <ContentWrapper>
      <TourStep stepId="users-table">
        <Box>
          {alert}
          <div className="row align-items-center mb-3">
            <div className="col-md-6">
              <div className="row g-2 align-items-center">
                <div className="col-md-8">
                  <SearchInput queryHandlers={queryHandlers} />
                </div>
              </div>
            </div>

            <div className="col-md-6 text-end">
              <CreateUser />
            </div>
          </div>

          {processing[USER_ACTIONS.LOAD_USERS].status ? (
            <Loading height={600} />
          ) : (
            <>
              <div>
                <DataTable
                  data={transformedData}
                  columns={columnsForUsers}
                  disableMultiSelection={true}
                  disableColumnResize={false}
                  defaultSize={375}
                  minSize={80}
                  onRowClick={({ original }) => {
                    history.push(`/admin/users/${original.data._id}`);
                  }}
                  columnVisibility={{}}
                />
              </div>
              <Pagination
                containerClassName="pull-right my-2"
                totalResults={toolState?.pagination?.totalResults}
                currentPage={toolState?.pagination?.currentPage || 1}
                onPageChange={(page) => {
                  queryHandlers?.handlePagination({ page });
                }}
                size={toolState?.pagination?.size || 10}
              />
            </>
          )}

          <DrawerRight drawerId="create-user">
            <React.Fragment>
              <OrganizationalOverview
                groups={false}
                tools={false}
                className="mb-3"
              />
              <InvitationForm
                drawerView={true}
                onSubmit={async (data) => {
                  await inviteUser(data);
                  closeDrawer("create-user");
                }}
              />
            </React.Fragment>
          </DrawerRight>
          <DrawerRight drawerId="transfer-drawer">
            <DeleteProcess
              onDelete={(user) =>
                setUsers((prevUsers) =>
                  prevUsers.filter((u) => u?._id !== user?._id),
                )
              }
            />
          </DrawerRight>
        </Box>
      </TourStep>
    </ContentWrapper>
  );
};

export default UserTable;
