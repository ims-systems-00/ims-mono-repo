// contexts ...
import { Button, Form } from "@ims-systems-00/ims-ui-kit";
import { useContext } from "react";
import { validate } from "@/services/dataImportService";
import { imsLogger } from "@/services/loggerService";
import {
  ImsButtonGroup,
  ImsFormSectionDevider,
} from "@/views/shared/CustomFormElements";
import { IMPORTER_STATE_ACTIONS, USER_ACTIONS } from "../importerStore/actions";
import { DataImportContext } from "../importerStore/Context";

const ValidationForm = ({}) => {
  let {
    importerState,
    processing,
    dispatchProcessing,
    dispatchImporterState,
    validationDataTransferProgress,
  } = useContext(DataImportContext);
  async function validateDataSet() {
    try {
      dispatchProcessing({
        [USER_ACTIONS.VALIDATION]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let validationResult = await Promise.all(
        importerState.sheets.map((sheet) =>
          validate(
            {
              module: importerState?.config?.module,
              format: importerState?.config?.format,
              dateFormat: importerState?.config?.dateFormat,
              dataMap: sheet.dataMap,
              dataSet: sheet.data,
            },
            {
              onUploadProgress: validationDataTransferProgress,
            }
          )
        )
      );
      let validations = {};
      importerState.sheets.forEach((sheet, index) => {
        validations[sheet.name] = validationResult[index]?.data?.validation;
      });
      dispatchImporterState({
        type: IMPORTER_STATE_ACTIONS.UPDATE_VALIDATIONS,
        payload: {
          validations,
        },
      });
      dispatchProcessing({
        [USER_ACTIONS.VALIDATION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatchProcessing({
        [USER_ACTIONS.VALIDATION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger(ex, ex.response);
    }
  }
  function requiredChecks() {
    let invalidCount = importerState.sheets
      .map((sheet) => {
        return importerState.imsSchema.reduce((totalAbsent, currentField) => {
          if (currentField.isRequired) {
            return sheet.dataMap[currentField.path]
              ? totalAbsent
              : (totalAbsent += 1);
          }
          return totalAbsent;
        }, 0);
      })
      .reduce((totalAbsent, current) => (totalAbsent += current), 0);
    return invalidCount ? true : false;
  }
  return (
    <Form className="form-horizontal">
      <ImsFormSectionDevider
        label={"Validation"}
        deviderText={
          "Make sure you validate all the data properly before we can migrate them safely."
        }
      />
      <ImsButtonGroup>
        <Button
          disabled={
            processing[USER_ACTIONS.VALIDATION].status || requiredChecks()
          }
          className={`btn btn-info`}
          onClick={(e) => {
            validateDataSet();
          }}
        >
          {processing[USER_ACTIONS.VALIDATION].status
            ? "Validating data"
            : "Validate dataset"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};
export default ValidationForm;
