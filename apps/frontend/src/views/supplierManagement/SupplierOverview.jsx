import {Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";
import { useSupplier } from "./store";

const SupplierOverview = () => {
  let { visitingSupplier: data } = useSupplier();
  return (
    <Table borderless responsive className="table-sm">
      {data && (
        <tbody>
          <tr>
            <td className="text-dark">Reference</td>
            <td>
              <span className="text-info">{data?.reference}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Business unit</td>
            <td className="text-info">
              <span className="text-info">{data?.group?.name}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Account manager</td>
            <td>
              <span>{data?.accountManager}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Email</td>
            <td className="text-left ">
              <span>{data?.email}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Buyer</td>
            <td>
              <ImageNameWrapper
                img={data?.buyer?.profileImageSrc}
                name={data?.buyer?.name}
              />
            </td>
          </tr>
          <tr>
            <td className="text-dark">Contract value</td>
            <td>
              <span>£{data.contractValue}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Account number</td>
            <td>
              <span>{data.accountNumber}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Created by</td>
            <td>
              <ImageNameWrapper
                img={data.created?.by?.profileImageSrc}
                name={data.created?.by?.name}
              />
            </td>
          </tr>
          <tr>
            <td className="text-dark">Compliant</td>
            <td>
              <span>{data.isCompliant ? "Yes" : "No"}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Contract start date</td>
            <td>
              <span>
                {moment(data.contractStartDate).format("DD/MM/YY HH:mm")}
              </span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Contract end date</td>
            <td>
              <span>
                {moment(data.contractEndDate).format("DD/MM/YY HH:mm")}
              </span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Review date</td>
            <td>
              <span>{moment(data.reviewDate).format("DD/MM/YY HH:mm")}</span>
            </td>
          </tr>
        </tbody>
      )}
    </Table>
  );
};

export default SupplierOverview;
