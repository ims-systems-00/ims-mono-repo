import classNames from "classnames";
import { Card, CardBody, Table } from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import ImageNameWrapper from "@/views/shared/DetailComponents/ImageNameWrapper";
import BadgeStatus from "@/views/shared/StatusMapper/BadgeStatus";
import { useRisk } from "./store";

const RiskStatus = () => {
  let { visitingRisk: risk } = useRisk();
  return (
    <Card className="shadow-none border-0">
      <CardBody>
        <Table borderless responsive className="table-sm">
          <thead>
            <tr>
              <th className="text-left py-2 font-size-subtitle-2 fw-medium">
                Name
              </th>
              <th className="text-center py-2 font-size-subtitle-2 fw-medium">
                Score
              </th>
              <th className="py-2 font-size-subtitle-2 fw-medium">Date</th>
              <th className="text-end py-2 font-size-subtitle-2 fw-medium">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {risk?.mitigated.status && (
              <tr>
                <td className="text-nowrap">
                  <ImageNameWrapper
                    img={risk?.mitigated?.by?.profileImageSrc}
                    name={risk?.mitigated && risk?.mitigated?.by?.name}
                  />
                </td>
                <td className="text-center">
                  <span
                    className={classNames("", {
                      "text-success": risk?.score?.total?.current < 3,
                      "text-warning": risk?.score?.total?.current === 3,
                      "text-danger": risk?.score?.total?.current > 3,
                    })}
                  >
                    <i className="ims-icons-20 icon-icon-step-24 p-1" />
                    {risk?.score?.likelihood?.current}
                  </span>
                </td>
                <td className="">
                  {moment(risk?.mitigated?.on).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="text-right d-flex justify-content-end">
                  {risk?.mitigated?.status && (
                    <BadgeStatus status="Mitigated" />
                  )}
                </td>
              </tr>
            )}
            {risk?.accepted?.status && (
              <tr>
                <td className="text-nowrap">
                  <ImageNameWrapper
                    img={risk?.accepted?.by?.profileImageSrc}
                    name={risk?.accepted && risk?.accepted?.by?.name}
                  />
                </td>
                <td className="text-center">
                  <span
                    className={classNames("", {
                      "text-success": risk?.score?.total?.current < 3,
                      "text-warning": risk?.score?.total?.current === 3,
                      "text-danger": risk?.score?.total?.current > 3,
                    })}
                  >
                    <i className="ims-icons-20 icon-icon-step-24 p-1" />
                    {risk?.score?.total?.current}
                  </span>
                </td>
                <td className="">
                  {moment(risk?.accepted?.on).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="text-right d-flex justify-content-end">
                  {risk?.accepted?.status && <BadgeStatus status="Accepted" />}
                </td>
              </tr>
            )}
            {risk?.escalated?.status && (
              <tr>
                <td className="text-nowrap">
                  <ImageNameWrapper
                    img={risk?.escalated?.by?.profileImageSrc}
                    name={risk?.escalated && risk?.escalated?.by?.name}
                  />
                </td>
                {/* score */}
                <td className="text-center">
                  <span
                    className={classNames("", {
                      "text-success": risk?.score?.total?.current < 3,
                      "text-warning": risk?.score?.total?.current === 3,
                      "text-danger": risk?.score?.total?.current > 3,
                    })}
                  >
                    <i className="ims-icons-20 icon-icon-step-24 p-1" />
                    {risk?.score?.total?.current}
                  </span>
                </td>
                <td className="">
                  {moment(risk?.escalated?.on).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="text-right d-flex justify-content-end">
                  {risk?.escalated?.status && (
                    <BadgeStatus status="Escalated" />
                  )}
                </td>
              </tr>
            )}

            <tr>
              <td className="text-nowrap">
                <ImageNameWrapper
                  img={risk?.created?.by?.profileImageSrc}
                  name={risk?.created && risk?.created?.by?.name}
                />
              </td>
              <td className="text-center">
                <span
                  className={classNames("", {
                    "text-success": risk?.score?.total?.initial < 3,
                    "text-warning": risk?.score?.total?.initial === 3,
                    "text-danger": risk?.score?.total?.initial > 3,
                  })}
                >
                  <i className="ims-icons-20 icon-icon-step-24 p-1" />
                  {risk?.score?.total?.initial}
                </span>
              </td>
              <td className="">
                {moment(risk?.created?.on).format("DD/MM/YYYY HH:mm")}
              </td>
              <td className="text-right d-flex justify-content-end">
                {risk?.created?.on && <BadgeStatus status="Open" />}
              </td>
            </tr>
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default RiskStatus;
