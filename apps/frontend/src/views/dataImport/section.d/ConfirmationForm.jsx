import useForm from "@/hooks/useForm";
import { Button } from "@ims-systems-00/ims-ui-kit";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/CustomFormElements";
// contexts ...
import { useContext } from "react";
import { startImport } from "@/services/dataImportService";
import { imsLogger } from "@/services/loggerService";
import {
  ImsFormSectionDevider,
  ImsInputText,
} from "@/views/shared/CustomFormElements";
import { IMPORTER_STATE_ACTIONS, USER_ACTIONS } from "../importerStore/actions";
import { DataImportContext } from "../importerStore/Context";
const ConfirmationForm = ({}) => {
  let dataSet = {
    data: {
      aggrement: "",
    },
    errors: {},
  };
  // Validation rules ....
  const schema = {
    aggrement: IVal.string().required().valid("migrate").label("Confirmation"),
  };
  let {
    importerState,
    processing,
    dispatchProcessing,
    importDataTransferProgress,
    dispatchImporterState,
  } = useContext(DataImportContext);
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  async function _startImport() {
    try {
      dispatchProcessing({
        [USER_ACTIONS.IMPORT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let importResult = await Promise.all(
        importerState.sheets.map((sheet) =>
          startImport(
            {
              module: importerState?.config?.module,
              format: importerState?.config.format,
              dateFormat: importerState?.config?.dateFormat,
              dataMap: sheet.dataMap,
              dataSet: sheet.data,
            },
            {
              onUploadProgress: importDataTransferProgress,
            }
          )
        )
      );
      dispatchProcessing({
        [USER_ACTIONS.IMPORT]: {
          status: false,
          error: false,
          id: null,
        },
      });
      dispatchImporterState({
        type: IMPORTER_STATE_ACTIONS.SUBMISSION_SUCCESS,
      });
      imsLogger(importResult);
    } catch (ex) {
      dispatchProcessing({
        [USER_ACTIONS.IMPORT]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex, ex.response);
    }
  }
  let { data, errors } = dataModel;
  return (
    <>
      <div className="form-horizontal">
        <ImsFormSectionDevider
          label={"Confirmation"}
          deviderText={
            "Please type 'migrate' in the following box for confirmation and start the import process."
          }
        />
        <ImsInputText
          label={""}
          name="aggrement"
          value={data.aggrement}
          placeholder="please type 'migrate'"
          onChange={handleChange}
          error={errors.aggrement}
        />
        <ImsButtonGroup>
          <Button
            disabled={
              validate() ? true : processing[USER_ACTIONS.IMPORT].status
            }
            onClick={(e) => {
              handleSubmit(e, _startImport, true);
            }}
            className="btn-fill"
            color="info"
            type="button"
          >
            {processing[USER_ACTIONS.IMPORT].status
              ? "Processing"
              : "Start Migration"}
          </Button>
        </ImsButtonGroup>
      </div>
    </>
  );
};
export default ConfirmationForm;
