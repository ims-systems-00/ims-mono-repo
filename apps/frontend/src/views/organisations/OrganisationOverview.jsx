import React from "react";
import { Table } from "@ims-systems-00/ims-ui-kit";

const OrganisationOverview = ({ organisation }) => {
  if (organisation) {
    console.log("MY ORG:", organisation);
  }
  return (
    <Table borderless responsive className="table-sm">
      {organisation && (
        <tbody>
          <tr>
            <td className="text-dark">Organisation Name</td>
            <td>
              <span>{organisation?.name || "N/A"}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Industry</td>
            <td>{organisation?.industry || "N/A"}</td>
          </tr>
          <tr>
            <td className="text-dark">Country</td>
            <td>{organisation?.countryName || "N/A"}</td>
          </tr>
          <tr>
            <td className="text-dark">Size</td>
            <td>{organisation?.sizeOfOrg || "N/A"}</td>
          </tr>

          {organisation?.subscription && (
            <>
              <tr>
                <td className="text-dark">Subscription Plan</td>
                <td>{organisation.subscription.plan || "N/A"}</td>
              </tr>
              <tr>
                <td className="text-dark">Status</td>
                <td>
                  <span
                    className={
                      organisation.subscription.status === "Active"
                        ? "text-success"
                        : "text-warning"
                    }
                  >
                    {organisation.subscription.status || "N/A"}
                  </span>
                </td>
              </tr>
              <tr>
                <td className="text-dark">Renewal Date</td>
                <td>{organisation.subscription.renewalDate || "N/A"}</td>
              </tr>
            </>
          )}

          {organisation?.stats && (
            <>
              <tr>
                <td className="text-dark">Active Users</td>
                <td>{organisation.stats.users ?? 0}</td>
              </tr>
              <tr>
                <td className="text-dark">Projects</td>
                <td>{organisation.stats.projects ?? 0}</td>
              </tr>
              <tr>
                <td className="text-dark">Storage Used</td>
                <td>{organisation.stats.storage || "0 GB"}</td>
              </tr>
            </>
          )}

          <tr>
            <td className="text-dark">Created At</td>
            <td>
              {new Date(organisation?.createdAt).toLocaleString() || "N/A"}
            </td>
          </tr>
          <tr>
            <td className="text-dark">Last Updated</td>
            <td>
              {new Date(organisation?.updatedAt).toLocaleString() || "N/A"}
            </td>
          </tr>
        </tbody>
      )}
    </Table>
  );
};

export default OrganisationOverview;
