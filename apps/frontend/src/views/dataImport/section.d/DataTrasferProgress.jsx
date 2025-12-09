// contexts ...
import { Col, Progress, Row } from "@ims-systems-00/ims-ui-kit";
import { useContext } from "react";
import { USER_ACTIONS } from "../importerStore/actions";
import { DataImportContext } from "../importerStore/Context";
const DataTrasferProgress = ({}) => {
  let { processing, importerState } = useContext(DataImportContext);
  return (
    <>
      {processing[USER_ACTIONS.IMPORT].status && (
        <Row>
          <Col md="5">
            <span>
              Sending your datasets to{" "}
              <span className="text-warning">Alice</span>
            </span>
          </Col>
          <Col md="5">
            <span className="mb-2">
              {importerState?.importDataTransferProgress} %
            </span>
            <Progress value={importerState?.importDataTransferProgress} />
          </Col>
        </Row>
      )}
    </>
  );
};
export default DataTrasferProgress;
