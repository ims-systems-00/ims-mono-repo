import { Card, CardBody, Col, Row } from "@ims-systems-00/ims-ui-kit";
import Papa from "papaparse";
import { useContext, useEffect, useState } from "react";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import { IMPORTER_STATE_ACTIONS } from "../importerStore/actions";
import { DataImportContext } from "../importerStore/Context";
import MapSheet from "./MapSheet";
export default function SectionB({}) {
  let { importerState, dispatchImporterState } = useContext(DataImportContext);
  let [preparedSheets, setPreparedSheets] = useState([]);
  const handleParse = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      const csv = Papa.parse(target.result, {
        header: true,
        skipEmptyLines: "trailing",
      });
      const parsedData = csv?.data;
      const columns = Object.keys(parsedData[0]);
      let sheet = { name: file?.path, columns, dataMap: {}, data: parsedData };
      setPreparedSheets((preveSheets) => [...preveSheets, sheet]);
    };
    reader.readAsText(file);
  };
  useEffect(() => {
    setPreparedSheets([]);
    importerState.selectedFiles.map((file) => {
      handleParse(file);
    });
  }, [importerState.selectedFiles]);
  useEffect(() => {
    dispatchImporterState({
      type: IMPORTER_STATE_ACTIONS.UPDATE_SHEETS,
      payload: {
        sheets: preparedSheets,
      },
    });
  }, [preparedSheets]);
  return (
    <>
      {importerState.sheets?.length ? (
        <>
          <DetailsSectionHeader title={`2. Lets start to link your data`} />
          {importerState.sheets.map((sheet, sheetIndex) => (
            <Card key={sheet?.name}>
              <CardBody>
                <Row>
                  <Col md="4">
                    <span className="font-size-subtitle-2">
                      Sheet {sheetIndex + 1} :{" "}
                      <span className="text-warning">{sheet?.name}</span>
                    </span>
                  </Col>
                  <Col md="4">
                    <span className="font-size-subtitle-2">
                      Total Columns found :{" "}
                      <span className="text-secondary">
                        {sheet?.columns?.length}
                      </span>
                    </span>
                  </Col>
                  <Col md="4">
                    <span className="font-size-subtitle-2">
                      Total rows found :{" "}
                      <span className="text-secondary">
                        {sheet?.data?.length}
                      </span>
                    </span>
                  </Col>
                </Row>
                <hr></hr>
                {importerState.imsSchema?.length
                  ? importerState.imsSchema?.map((field) => (
                      <Row key={field?.path}>
                        <Col md="2">
                          <span className="p-2 font-size-subtitle-2">
                            {field?.alias}
                            {field.isRequired && (
                              <span className="text-danger">*</span>
                            )}
                          </span>
                        </Col>
                        <Col md="2" className="d-md-flex align-items-md-start ">
                          <span className="mt-md-2">→</span>
                        </Col>
                        <Col md="8">
                          <MapSheet
                            field={field}
                            sheet={sheet}
                            index={sheetIndex}
                          />
                        </Col>
                      </Row>
                    ))
                  : null}
              </CardBody>
            </Card>
          ))}
        </>
      ) : null}
    </>
  );
}
