import { Button } from "@ims-systems-00/ims-ui-kit";
import Papa from "papaparse";
import { useContext } from "react";
import { downloader } from "@/services/utils/downloader";
import { DataImportContext } from "../../importerStore/Context";
export default function DownloadReport({ sheet }) {
  let { importerState } = useContext(DataImportContext);
  function downloadValidationResult() {
    let data = [];
    importerState?.validations[sheet]?.result?.forEach((field, fieldIndex) =>
      field.errors?.forEach((error, errorIndex) => {
        if (data[errorIndex])
          data[errorIndex] = {
            ...data[errorIndex],
            [field.name]: error.message,
          };
        else data[errorIndex] = { [field.name]: error.message };
      })
    );
    let fields = importerState?.validations[sheet]?.result?.map(
      (field, index) => field.name
    );
    let csv = Papa.unparse({
      data,
      fields,
    });
    const splitedName = sheet.split(".");
    let fileName = splitedName.slice(0, splitedName.length - 1).join(".");
    fileName = fileName + "_error.csv";
    downloader(fileName, csv);
  }
  return (
    <Button
      size="sm"
      className="ms-3"
      color="danger"
      onClick={() => {
        downloadValidationResult();
      }}
    >
      Download report
    </Button>
  );
}
