import useForm from "@/hooks/useForm";
import IVal from "@/validations/validator";
import React, { useEffect } from "react";
import { Form } from "@ims-systems-00/ims-ui-kit";
import { ImsInputSelect } from "@ims-systems-00/ims-ui-kit";
// contexts ...
import { useContext } from "react";
import { DataImportContext } from "../importerStore/Context";
import { IMPORTER_STATE_ACTIONS } from "../importerStore/actions";
import { imsLogger } from "@/services/loggerService";
import { getSchema } from "@/services/dataImportService";
import { modules } from "./modules";
const ImportForm = ({}) => {
  let dataSet = {
    data: {
      format: {
        value: ".csv",
        label: "CSV",
      },
      module: {
        value: null,
        label: "Select a module",
      },
      dateFormat: {
        value: "DD/MM/YYYY",
        label: "DD/MM/YYYY (United Kingdom)",
      },
    },
    errors: {},
  };
  // Validation rules ....
  const schema = {
    format: IVal.object().keys({
      value: IVal.string().required().label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    module: IVal.object().keys({
      value: IVal.string().required().label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    dateFormat: IVal.object().keys({
      value: IVal.string().required().label("Business unit"),
      label: IVal.label("Business unit"),
    }),
  };
  let { dispatchImporterState } = useContext(DataImportContext);
  const { dataModel, handleChange, confirmation } = useForm(dataSet, schema);
  useEffect(() => {
    async function fetchSchema() {
      try {
        let { data } = await getSchema(dataModel.data?.module?.value);
        dispatchImporterState({
          type: IMPORTER_STATE_ACTIONS.UPDATE_IMS_SCHEMA,
          payload: {
            imsSchema: data.schema,
          },
        });
      } catch (ex) {
        imsLogger(ex);
      }
    }
    fetchSchema();
  }, [dataModel.data.module]);

  useEffect(() => {
    dispatchImporterState({
      type: IMPORTER_STATE_ACTIONS.UPDATE_CONFIG,
      payload: {
        config: {
          module: dataModel.data?.module?.value,
          format: dataModel.data?.format?.value,
          dateFormat: dataModel.data?.dateFormat?.value,
        },
      },
    });
  }, [dataModel.data]);

  let { data, errors } = dataModel;
  return (
    <>
      {confirmation}
      <Form action="/" className="form-horizontal" method="get">
        <ImsInputSelect
          label={"Module"}
          name="module"
          value={data.module}
          className="react-select default"
          classNamePrefix="react-select"
          onChange={handleChange}
          options={modules}
        />
        <ImsInputSelect
          label={"Format"}
          name="format"
          value={data.format}
          className="react-select default"
          classNamePrefix="react-select"
          onChange={handleChange}
          options={[
            {
              label: "CSV",
              value: ".csv",
            },
          ]}
        />
        <ImsInputSelect
          label={"Date format"}
          name="dateFormat"
          value={data.dateFormat}
          className="react-select default"
          classNamePrefix="react-select"
          onChange={handleChange}
          options={[
            {
              value: "DD/MM/YYYY",
              label: "DD/MM/YYYY (United Kingdom)",
            },
          ]}
        />
      </Form>
    </>
  );
};
export default ImportForm;
