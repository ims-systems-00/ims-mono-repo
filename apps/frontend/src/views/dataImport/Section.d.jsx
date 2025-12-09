import DropZone from "@/components/CustomUpload/DropZone.v2";
import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import { useContext } from "react";
import { DetailsSectionHeader } from "@/views/shared/DetailsSectionHeader";
import { DataImportContext } from "./importerStore/Context";
import ImportForm from "./section.a/ImportForm";

export default function SectionA({}) {
  let { importerState, dispatchImporterState } = useContext(DataImportContext);
  return (
    <>
      <DetailsSectionHeader title={`1. Welcome to data import wizerd`} />
      <span className="text-secondary font-size-subtitle-2">
        Data import wizerd allows you to upload any spread sheet to import your
        data into any service of iMS Systems you are currently cosuming.{" "}
        <span className="text-success">
          Simply select the desired service, select your spread sheet and fill
          in the required form
        </span>
        , and we will take you through the next steps. It's simple and efficient
        to import data in to iMS
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
            hint="+ Select spreadsheet"
            onLoad={importerState.setSelectedFiles}
          />
        </Col>
      </Row>
    </>
  );
}
