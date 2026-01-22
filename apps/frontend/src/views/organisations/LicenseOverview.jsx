import React from "react";
import { Table } from "@ims-systems-00/ims-ui-kit";

const OrganisationOverview = ({ licenses }) => {
  const getActiveModules = () => {
    if (!licenses) return "N/A";

    const modules = [
      licenses.carbocalc && "Carbocalc",
      licenses.imsforms && "IMS Forms",
      licenses.go2ero && "Go2ero",
      licenses.projectims && "Project IMS",
      ...(licenses.complianceTools || []),
      ...(licenses.additionalModules || []),
    ].filter(Boolean);

    return modules.length > 0 ? modules.join(", ") : "None";
  };

  return (
    <>
      <p className="mb-3 px-1 fs-6">License Information</p>
      <Table borderless responsive className="table-sm">
        {licenses && (
          <tbody>
            {licenses && (
              <>
                <tr>
                  <td className="text-dark">Users (Used / Allocated)</td>
                  <td>
                    {licenses.users?.used ?? 0} /{" "}
                    {licenses.users?.allocated ?? 0}
                  </td>
                </tr>
                <tr>
                  <td className="text-dark">Super Users (Used / Allocated)</td>
                  <td>
                    {licenses.superUser?.used ?? 0} /{" "}
                    {licenses.superUser?.allocated ?? 0}
                  </td>
                </tr>
                <tr>
                  <td className="text-dark">Groups (Used / Allocated)</td>
                  <td>
                    {licenses.groups?.used ?? 0} /{" "}
                    {licenses.groups?.allocated ?? 0}
                  </td>
                </tr>
                <tr>
                  <td className="text-dark">Active Modules</td>
                  <td>{getActiveModules()}</td>
                </tr>
              </>
            )}
          </tbody>
        )}
      </Table>
    </>
  );
};

export default OrganisationOverview;
