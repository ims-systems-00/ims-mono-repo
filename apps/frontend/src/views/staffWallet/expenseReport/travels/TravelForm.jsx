import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useForm from "@/hooks/useForm";
import {
  Button,
  ImsInputSelect,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import { useContext } from "react";
import { mapToTravelModel } from "@/services/wallet/expenseReportServices";
import { calculateCost } from "@/utils/calculateCost";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsDirectionPicker,
  ImsInputCheck,
  ImsInputDropZone,
  ImsLocationPicker,
} from "@/views/shared/ImsFormElements/Index";
import USER_ACTIONS from "../actions";
import { useExpenseReport } from "../store";

const directionPickerMap = new Map();
directionPickerMap.set("from", "origin");
directionPickerMap.set("to", "destination");
directionPickerMap.set("distance", "distance.value");
directionPickerMap.set("cost", "cost");

const travelModes = new Map();
travelModes.set("Car", "driving");
travelModes.set("Air", "driving");
travelModes.set("Public transport", "transit");

const TravelForm = ({ travel, toggleEditMode }) => {
  let { organisation } = useContext(SuperGlobalContext);
  const dataSet = travel
    ? mapToTravelModel(travel)
    : {
        data: {
          type: {
            value: "One way",
            label: "One way",
          },
          transport: {
            value: "Car",
            label: "Car",
          },
          distance: 0,
          cost: 0,
          from: "",
          to: "",
          notes: "",
          attachments: [],
          manualInput: false,
        },
        errors: {},
      };
  const schema = {
    type: IVal.object().keys({
      value: IVal.string().required().label("Type"),
      label: IVal.label("Type"),
    }),
    transport: IVal.object().keys({
      value: IVal.string().required().label("Transport"),
      label: IVal.label("Transport"),
    }),
    distance: IVal.number().min(0).label("Distance"),
    from: IVal.string().required().label("From"),
    to: IVal.string().required().label("To"),
    notes: IVal.label("Notes"),
    cost: IVal.number().required().label("Cost"),
    attachments: IVal.label("Attachments"),
    manualInput: IVal.label("Manual Input"),
  };
  const {
    dataModel,
    handleChange,
    handleSubmit,
    validate,
    handleFileChange,
    handleDirectionChange,
  } = useForm(dataSet, schema);
  let { data, errors } = dataModel;
  let { processing, handleAddTravel, handleUpdateTravel } = useExpenseReport();

  return (
    <div className="form-horizontal mb-3">
      <ImsInputSelect
        label="Type"
        name="type"
        value={data.type}
        className="react-select default"
        classNamePrefix="react-select"
        onChange={handleChange}
        options={["One way", "Round trip"].map((type) => ({
          value: type,
          label: type,
        }))}
      />
      <ImsInputSelect
        label="Transport"
        name="transport"
        value={data.transport}
        className="react-select default"
        classNamePrefix="react-select"
        onChange={handleChange}
        options={["Car", "Air", "Public transport"].map((transport) => ({
          value: transport,
          label: transport,
        }))}
      />
      <ImsInputText
        label="Notes"
        placeholder="Notes"
        name="notes"
        type="textarea"
        rows="3"
        value={data.notes}
        onChange={handleChange}
        error={errors.notes}
      />
      <ImsInputText
        label="Cost"
        placeholder="Cost"
        name="cost"
        type="number"
        disabled={!data.manualInput}
        value={data.cost}
        onChange={handleChange}
        error={errors.cost}
      />
      {data.transport.value !== "Air" && (
        <ImsInputCheck
          checked={data.manualInput}
          label="Fill manually"
          name="manualInput"
          value={data.manualInput}
          onChange={handleChange}
          error={errors.manualInput}
        />
      )}
      {(data.manualInput || data.transport.value === "Air") && (
        <Row>
          <ImsLocationPicker
            label="From"
            placeholder="From"
            name="from"
            value={data.from}
            onChange={handleChange}
            error={errors.from}
          />
          <ImsLocationPicker
            label="To"
            placeholder="to"
            name="to"
            value={data.to}
            onChange={handleChange}
            error={errors.to}
          />
        </Row>
      )}

      {!data.manualInput && data.transport.value !== "Air" && (
        <ImsDirectionPicker
          label="Pick address"
          onChange={(changes) => {
            let cost = calculateCost(
              changes.distance.value,
              organisation?.millageCostForUsers?.amount,
              "mph",
              data.type
            );
            changes = { ...changes, cost };
            handleDirectionChange({
              directions: changes,
              dataMap: directionPickerMap,
            });
          }}
          travelMode={travelModes.get(data.transport.value)}
          error={null}
        />
      )}
      <ImsInputDropZone
        label="Attachments"
        clearAll={!data.attachments.length}
        name="staffwallet"
        onLoad={(files) => handleFileChange(files, "attachments")}
      />
      <ImsButtonGroup>
        {travel && travel._id ? (
          <>
            <Button
              size="sm"
              className="border border-0"
              outline
              color="danger"
              disabled={
                validate() ? true : processing[USER_ACTIONS.AMEND_TRAVEL].status
              }
              onClick={(e) => {
                handleSubmit(
                  e,
                  handleUpdateTravel(travel._id, dataModel.data),
                  false
                );
              }}
            >
              {processing[USER_ACTIONS.AMEND_TRAVEL].status &&
              processing[USER_ACTIONS.AMEND_TRAVEL].status.id === travel._id
                ? "Saving..."
                : "Update trip"}
            </Button>
            <Button
              size="sm"
              className="border border-0"
              outline
              color="danger"
              type="button"
              onClick={() => toggleEditMode && toggleEditMode()}
            >
              cancel
            </Button>
          </>
        ) : (
          <Button
            size="sm"
            className="btn-simple btn-primary"
            color="primary"
            type="button"
            disabled={
              validate() ? true : processing[USER_ACTIONS.INCLUDE_TRAVEL].status
            }
            onClick={(e) => handleSubmit(e, handleAddTravel(dataModel.data))}
          >
            {processing[USER_ACTIONS.INCLUDE_TRAVEL].status
              ? "Saving..."
              : "Add trip"}
          </Button>
        )}
      </ImsButtonGroup>
    </div>
  );
};

export default TravelForm;
