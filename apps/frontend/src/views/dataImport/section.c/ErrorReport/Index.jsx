import { Col, Row } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { DataImportContext } from "../../importerStore/Context";
import DownloadReport from "./DownloadReport";
import FieldErrors from "./FieldErrors";
export default function ErrorReport({}) {
  let { importerState } = useContext(DataImportContext);
  return (
    <>
      {Object.keys(importerState?.validations).length ? (
        Object.keys(importerState?.validations).map((sheet, index) => {
          return (
            <React.Fragment key={sheet}>
              <span className="font-size-subtitle-1">
                Sheet {index + 1} :{" "}
                <span className="text-warning">{sheet}</span>
                {!importerState.validationSuccess && (
                  <DownloadReport sheet={sheet} />
                )}
              </span>
              <Row>
                {importerState?.validations[sheet]?.result?.map(
                  (field, index) => (
                    <Col md="6" key={field?.name}>
                      <p className="font-size-subtitle-2">{field?.name}</p>
                      <FieldErrors errors={field?.errors} />
                    </Col>
                  )
                )}
              </Row>
            </React.Fragment>
          );
        })
      ) : (
        <span className="text-secondary font-size-subtitle-2">
          {" "}
          iMS needs to scan and validate all your dataset so they can be
          imported safely into the system. Validation may take a while, you can
          download validation report in case any changes are required in your
          CSV.
        </span>
      )}
    </>
  );
}
