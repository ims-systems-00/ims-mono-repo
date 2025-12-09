import { Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import { useCRM } from "./store";
import React from "react";

const CustomerStatus = () => {
  let { visitingCustomer: data } = useCRM();
  return (
    <Table borderless>
      {data && (
        <tbody>
          <tr>
            <td>Account manager</td>
            <td>
              <span className="text-info">{data?.accountManager?.name}</span>
            </td>
          </tr>
          <tr>
            <td>Account manager email</td>
            <td className="text-info">
              <span className="text-info">{data?.accountManager?.email}</span>
            </td>
          </tr>
          <tr>
            <td>Contract value</td>
            <td className="text-left text-info">
              <span> £{data?.contractValue}</span>
            </td>
          </tr>
          {data.stage === "Live" && (
            <React.Fragment>
              <tr>
                <td>Account number</td>
                <td className="text-left text-info">
                  <span> {data?.accountNumber}</span>
                </td>
              </tr>
              <tr>
                <td>Contract start</td>
                <td className="text-left text-info">
                  <span>
                    {" "}
                    {moment(data?.contractStartDate).format("DD/MM/YYYY")}
                  </span>
                </td>
              </tr>
              <tr>
                <td>Contract end</td>
                <td>
                  <span>
                    {" "}
                    {moment(data?.contractEndDate).format("DD/MM/YYYY")}
                  </span>
                </td>
              </tr>
            </React.Fragment>
          )}
        </tbody>
      )}
    </Table>
  );
};

export default CustomerStatus;
