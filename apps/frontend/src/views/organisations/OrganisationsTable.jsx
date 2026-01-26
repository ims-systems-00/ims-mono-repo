import React from "react";
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Box from "@/components/Box/Index";
import Loading from "@/components/Loader/Loading";
import SearchInput from "@/components/SearchInput/search-input";
import { Pagination } from "@/components/Pagination/pagination";
import { DataTable, DrawerRight, useDrawer } from "@ims-systems-00/ims-ui-kit";

import useOrganisation from "./store/useOrganisation";
import OrganisationDrawerDetail from "./OrganisationDrawerDetail";
import { OrganisationRowActions } from "./RowActions";
import CreateOrgButton from "./CreateOrganisation";
import OrganisationForm from "./OrganisationForm";

const OrganisationTable = () => {
  const { organisations, processing, OrgQueryTools, createOrg, updateOrg } =
    useOrganisation();

  const { openDrawer, closeDrawer } = useDrawer();

  const [selectedOrg, setSelectedOrg] = React.useState(null);

  const [orgToUpdate, setOrgToUpdate] = React.useState(null);

  const handleUpdate = (rowOriginal) => {
    setOrgToUpdate(rowOriginal);
    openDrawer("organisation-update");
  };

  const onRowClick = ({ original }) => {
    setSelectedOrg(original);
    openDrawer("organisation-detail");
  };

  const columns = [
    {
      accessorKey: "name",
      header: () => <p>Name</p>,
      size: 300,
    },
    {
      accessorKey: "officeEmail",
      header: () => <p>Email</p>,
      size: 300,
      cell: ({ row }) => row.original.officeEmail || "N/A",
    },
    {
      accessorKey: "contactNumber",
      header: () => <p>Contact</p>,
      size: 250,
      cell: ({ row }) => row.original.contactNumber || "N/A",
    },
    {
      accessorKey: "industry",
      header: () => <p>Industry</p>,
      size: 300,
      cell: ({ row }) =>
        row.original.industry?.label || row.original.industry || "N/A",
    },
    {
      accessorKey: "status",
      header: () => <p>Status</p>,
      size: 175,
      cell: ({ row }) => {
        const status = row.original.status || "UNKNOWN";
        const isActive = status === "ACTIVE";

        return (
          <span
            className={isActive ? "badge bg-success" : "badge bg-secondary"}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => <p>Created</p>,
      size: 175,
      cell: ({ row }) =>
        row.original.createdAt
          ? new Date(row.original.createdAt).toLocaleDateString()
          : "N/A",
    },
    {
      id: "actions",
      header: () => <p className="dt-row-actions">Actions</p>,
      size: 90,
      cell: ({ row }) => (
        <OrganisationRowActions
          row={row}
          onUpdate={() => handleUpdate(row.original)}
        />
      ),
    },
  ];

  return (
    <ContentWrapper>
      <Box>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">Organisations</h4>
        </div>

        <div className="row align-items-center mb-3">
          <div className="col-md-6">
            <div className="row g-2 align-items-center">
              <div className="col-md-8">
                <SearchInput queryHandlers={OrgQueryTools} />
              </div>
            </div>
          </div>

          <div className="col-md-6 text-end">
            <CreateOrgButton />
          </div>
        </div>

        {processing?.LOAD_ORGANISATIONS?.status ? (
          <Loading height={600} />
        ) : (
          <>
            <DataTable
              data={organisations || []}
              columns={columns}
              disableMultiSelection
              disableColumnResize={false}
              defaultSize={350}
              minSize={80}
              onRowClick={onRowClick}
            />

            <Pagination
              containerClassName="pull-right my-3"
              totalResults={OrgQueryTools?.toolState?.pagination?.totalResults}
              currentPage={
                OrgQueryTools?.toolState?.pagination?.currentPage || 1
              }
              onPageChange={(page) => {
                OrgQueryTools?.handlePagination({ page });
              }}
              size={OrgQueryTools?.toolState?.pagination?.size || 10}
            />
          </>
        )}

        <DrawerRight
          drawerId="organisation-detail"
          onDrawerClose={() => setSelectedOrg(null)}
        >
          {selectedOrg && (
            <OrganisationDrawerDetail organisation={selectedOrg} />
          )}
        </DrawerRight>

        <DrawerRight drawerId="organisation-create">
          <OrganisationForm
            visitingOrganisation={null}
            onSubmit={async (data) => {
              let payload = {
                name: data.name,
                officeEmail: data.officeEmail,
                addressCity: data.addressCity,
                addressStreet: data.addressStreet,
                addressBuilding: data.addressBuilding,
                addressPostCode: data.addressPostCode,
                addressStateProvince: data.addressStateProvince,
                countryName: data.countryName,
                countryAbbr: data.countryAbbr.value,
                countryCurrency: data.countryCurrency.value,
                countryPhonecode: Number(data.countryPhonecode.value),
                logometadata: data.logometadata || null,
                vatNumber: data.vatNumber,
                contactNumber: data.contactNumber || "",
                sizeOfOrg: Number(data.sizeOfOrg),
                industry: data.industry,
                referralSource: data.referralSource,
              };
              await createOrg(payload);
              closeDrawer("organisation-create");
            }}
          />
        </DrawerRight>

        <DrawerRight drawerId="organisation-update">
          {orgToUpdate && (
            <OrganisationForm
              key={orgToUpdate._id}
              visitingOrganisation={orgToUpdate}
              onSubmit={async (data) => {
                let payload = {
                  name: data.name,
                  officeEmail: data.officeEmail,
                  addressCity: data.addressCity,
                  addressStreet: data.addressStreet,
                  addressBuilding: data.addressBuilding,
                  addressPostCode: data.addressPostCode,
                  addressStateProvince: data.addressStateProvince,
                  country:
                    data.countryName?.value ??
                    (typeof data.countryName === "string"
                      ? data.countryName
                      : ""),
                  countryAbbr: data.countryAbbr.value,
                  countryCurrency: data.countryCurrency.value,
                  countryPhonecode: Number(data.countryPhonecode.value),
                  logometadata: data.logometadata || null,
                  vatNumber: data.vatNumber,
                  contactName: data.contactName,
                  contactPosition: data.contactPosition,

                  companyNumber: Number(data.companyNumber),
                  typeOfBusiness: data.typeOfBusiness,

                  bankName: data.bankName,
                  accountNumber: data.accountNumber,
                  sortCode: data.sortCode,

                  amount: Number(data.amount),
                  currency: data.currency,
                };
                await updateOrg(orgToUpdate._id, payload);
                closeDrawer("organisation-update");
              }}
            />
          )}
        </DrawerRight>
      </Box>
    </ContentWrapper>
  );
};

export default OrganisationTable;
