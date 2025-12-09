import { Col, Row, Table } from "@ims-systems-00/ims-ui-kit";
import { useRisk } from "./store";

const RiskScore = (props) => {
  let { visitingRisk: risk } = useRisk();
  return (
    <>
      <Row>
        <Col md="12">
          <Table borderless>
            <thead className="text-primary border-bottom border-primary">
              <tr>
                <th>Function</th>
                <th>Initial Score</th>
                <th>Current Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Likelihood</td>
                {risk.score.likelihood.initial < 3 ? (
                  <td className=" ">
                    <span className="text-success">
                      <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                      {risk.score.likelihood.initial}
                    </span>
                  </td>
                ) : risk.score.likelihood.initial === 3 ? (
                  <td className=" ">
                    <span className="text-warning">
                      <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                      {risk.score.likelihood.initial}
                    </span>
                  </td>
                ) : (
                  <td className="text-danger  ">
                    <span className="text-danger">
                      <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                      {risk.score.likelihood.initial}
                    </span>
                  </td>
                )}

                {risk.score.likelihood.current < 3 ? (
                  <td className=" ">
                    <span className="text-success">
                      <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                      {risk.score.likelihood.current}
                    </span>
                  </td>
                ) : risk.score.likelihood.current === 3 ? (
                  <td className=" ">
                    <span className="text-warning">
                      <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                      {risk.score.likelihood.current}
                    </span>
                  </td>
                ) : (
                  <td className=" ">
                    <span className="text-danger">
                      <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                      {risk.score.likelihood.current}
                    </span>
                  </td>
                )}
              </tr>
              <tr>
                <td>Consequence</td>
                {risk.score.consequence.initial < 3 ? (
                  <td className=" ">
                    <span className="text-success">
                      <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                      {risk.score.consequence.initial}
                    </span>
                  </td>
                ) : risk.score.consequence.initial === 3 ? (
                  <td className=" ">
                    <span className="text-warning">
                      <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                      {risk.score.consequence.initial}
                    </span>
                  </td>
                ) : (
                  <td className=" ">
                    <span className="text-danger">
                      <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                      {risk.score.consequence.initial}
                    </span>
                  </td>
                )}

                {risk.score.consequence.current < 3 ? (
                  <td className=" ">
                    <span className="text-success">
                      <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                      {risk.score.consequence.current}
                    </span>
                  </td>
                ) : risk.score.consequence.current === 3 ? (
                  <td className=" ">
                    <span className="text-warning">
                      <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                      {risk.score.consequence.current}
                    </span>
                  </td>
                ) : (
                  <td className=" ">
                    <span className="text-danger">
                      <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                      {risk.score.consequence.current}
                    </span>
                  </td>
                )}
              </tr>
              <tr>
                <th>Risk score</th>
                {risk.score.total.initial <= 10 ? (
                  <th className="text-success  ">
                    <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                    {risk.score.total.initial}
                  </th>
                ) : risk.score.total.initial > 10 &&
                  risk.score.total.initial <= 15 ? (
                  <th className="text-warning  ">
                    <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                    {risk.score.total.initial}
                  </th>
                ) : (
                  <th className="text-danger  ">
                    <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                    {risk.score.total.initial}
                  </th>
                )}

                {risk.score.total.current <= 10 ? (
                  <th className="text-success  ">
                    <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                    {risk.score.total.current}
                  </th>
                ) : risk.score.total.current > 10 &&
                  risk.score.total.current <= 15 ? (
                  <th className="text-warning  ">
                    <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                    {risk.score.total.current}
                  </th>
                ) : (
                  <th className="text-danger  ">
                    <i className="ims-icons-20 icon-icon-step-24"></i>{" "}
                    {risk.score.total.current}
                  </th>
                )}
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
};

export default RiskScore;
