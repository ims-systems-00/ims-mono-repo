import React, { useContext } from "react";
import { Button } from "@ims-systems-00/ims-ui-kit";
import { DataImportContext } from "../importerStore/Context";
export default function Congratulations({}) {
  let { importerState, resetImporter } = useContext(DataImportContext);
  return (
    <div className="text-center w-75 mx-auto">
      <h3 className="text-success">Congratulations</h3>
      <p>
        All done now!!
        <br></br>
        Your data migration process has started, you can now sit back and relax
        whilst <span className="text-warning">Alice</span> the bot migrates all
        you data into {importerState?.config?.module} module. We will send you a
        notification once it has been completed.
      </p>
      <Button className="btn " color="primary" onClick={resetImporter}>
        Import more data <i className="fas fa-long-arrow-alt-right"></i>
      </Button>
    </div>
  );
}
