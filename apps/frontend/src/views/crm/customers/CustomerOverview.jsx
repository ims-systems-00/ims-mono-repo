import { Card, CardBody, CardHeader, Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";
import { useCRM } from "./store";

const CustomerOverview = () => {
  let { visitingCustomer: data } = useCRM();
  return (
    <Table borderless>
      {/* Need code improvement in this portion in future */}
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
            <td className=" text-info">
              <span className="text-info">{data?.group?.name}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Raised by</td>
            <td>
              <ImageNameWrapper
                img={data?.created?.by?.profileImageSrc}
                name={data?.created?.by?.name}
              />
            </td>
          </tr>
          <tr>
            <td className="text-dark">Phone number</td>
            <td>
              <span>{data?.phoneNumber}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Current stage</td>
            <td>
              <span>{data.stage}</span>
            </td>
          </tr>
          <tr>
            <td className="text-dark">Medium of source</td>
            <td>
              <span>{data.source}</span>
            </td>
          </tr>
          {data.stage !== "Live" && (
            <tr>
              <td className="text-dark">Probability of conversion</td>
              <td>
                <span> {data.probability}%</span>
              </td>
            </tr>
          )}
          {data?.reviewDate && (
            <tr>
              <td className="text-dark">Review date</td>
              <td>
                <span>{moment(data?.reviewDate).format("DD/MM/YYYY")}</span>
              </td>
            </tr>
          )}
        </tbody>
      )}
    </Table>
  );
};

export default CustomerOverview;
