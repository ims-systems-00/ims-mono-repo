import DropZone from "@/components/CustomUpload/DropZone.v2";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import { useContext } from "react";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import { IMPORTER_STATE_ACTIONS } from "../importerStore/actions";
import { DataImportContext } from "../importerStore/Context";
import ImportForm from "./ImportForm";

export default function SectionA({}) {
  let { importerState, dispatchImporterState } = useContext(DataImportContext);
  return (
    <>
      <DetailsSectionHeader title={`1. Welcome to data import wizard`} />
      <span className="text-secondary font-size-subtitle-2">
        Data import wizard allows you to upload any spread sheet to import your
        data into any module of iMS Systems.{" "}
        <span className="text-success">
          Simply upload your spreadsheet and link them to the system data-sets
          by selecting your desired module.
        </span>{" "}
        We will take you through the steps, we have made it very simple and
        efficient to put you in total control.
      </span>
      <Row>
        <Col md="6">
          <DetailsSectionHeader
            title={`Service and business unit`}
            className="text-warning"
          />
          <ImportForm />
        </Col>
        <Col md="6">
          <DetailsSectionHeader
            title={`Upload any CSV or Excel sheet.`}
            className="text-warning"
          />
          <DropZone
            acceptedFileTypes=".csv"
            hint="+ Select spreadsheet"
            onLoad={(files) => {
              dispatchImporterState({
                type: IMPORTER_STATE_ACTIONS.UPDATE_SELECTED_FILES,
                payload: {
                  files,
                },
              });
            }}
          />
        </Col>
      </Row>
    </>
  );
}
