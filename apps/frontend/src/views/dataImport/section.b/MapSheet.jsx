import useForm from "@/hooks/useForm";
import IVal from "@/validations/validator";
import { useContext } from "react";
import { DataImportContext } from "../importerStore/Context";
import {
  ImsInputCheck,
  ImsInputSelect,
} from "@/views/shared/ImsFormElements/Index";
import { Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import { IMPORTER_STATE_ACTIONS } from "../importerStore/actions";
import { useEffect } from "react";
export default function MapSheet({ field, sheet, index }) {
  let dataSet = {
    data: {
      column: {
        value: null,
        label: "Select a column",
      },
      migrate: field?.isRequired ? true : false,
    },
    errors: {},
  };
  // Validation rules ....
  const schema = {
    column: IVal.object().keys({
      value: IVal.string().required().label("Select column"),
      label: IVal.label("Select column"),
    }),
    migrate: IVal.boolean().label("Migrate"),
  };
  let { importerState, systemMapableDataSet, dispatchImporterState } =
    useContext(DataImportContext);
  const { dataModel, handleChange, validate } = useForm(dataSet, schema);
  let { data } = dataModel;
  useEffect(() => {
    function updateMap() {
      dispatchImporterState({
        type: data.migrate
          ? IMPORTER_STATE_ACTIONS.ADD_DATA_MAP
          : IMPORTER_STATE_ACTIONS.REMOVE_DATA_MAP,
        payload: {
          sheetIndex: index,
          map: {
            key: field.path,
            value: data.column.value,
          },
        },
      });
    }
    updateMap();
  }, [dataModel.data]);
  function retriveOptions() {
    if (field.isOwnerShipControler) return systemMapableDataSet.users;
    if (field.isBusinessUnitController) return systemMapableDataSet.groups;
    return sheet?.columns?.map((col) => ({ value: col, label: col })) || [];
  }
  return (
    <>
      {importerState.selectedFiles?.length ? (
        <Form>
          <Row>
            <Col md="9">
              <ImsInputSelect
                name="column"
                value={data.column}
                className="react-select default"
                classNamePrefix="react-select"
                options={retriveOptions()}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </Col>
            <Col md="3" className="d-md-flex align-items-md-end ">
              <div className="mb-md-2">
                <ImsInputCheck
                  label={`migrate`}
                  name="migrate"
                  value={data.migrate}
                  checked={data.migrate}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
              </div>
            </Col>
          </Row>
        </Form>
      ) : null}
    </>
  );
}
