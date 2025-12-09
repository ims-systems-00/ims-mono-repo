import ImsRadarChart from "@/components/charts/ImsRadarChart";
import { Col, Row, Table } from "@ims-systems-00/ims-ui-kit";
import { mapToDigitalMaturityModel } from "@/services/dashBoardServices";

const IndividualMatrix = ({ matrix }) => {
  let mapedData = mapToDigitalMaturityModel(matrix);
  return (
    <>
      <span>{mapedData.name}</span>
      {mapedData && (
        <Row className="mt-5">
          <Col
            md="7"
            className="d-flex align-items-center justify-content-center"
          >
            <ImsRadarChart
              data={mapedData.digitalMaturity.data}
              options={mapedData.digitalMaturity.options}
            />
          </Col>
          <Col md="5">
            <Table borderless>
              <thead className="text-primary">
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th className="">Progress</th>
                </tr>
              </thead>
              <tbody>
                {mapedData.digitalMaturityStatus.map((status) => (
                  <tr key={status.label}>
                    <td className="">{status.label}</td>
                    {status.point === 4 ? (
                      <td>
                        <span className="text-success">Optimised</span>
                      </td>
                    ) : status.point === 3 ? (
                      <td>
                        <span className="text-info">Active</span>
                      </td>
                    ) : status.point === 2 ? (
                      <td>
                        <span className="text-warning">Digital</span>
                      </td>
                    ) : (
                      <td>
                        <span className="text-danger">Manual</span>
                      </td>
                    )}
                    <td className="text-right">{status.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      )}
    </>
  );
};

export default IndividualMatrix;
