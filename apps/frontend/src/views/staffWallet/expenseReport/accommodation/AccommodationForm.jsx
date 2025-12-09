import useForm from "@/hooks/useForm";
import {
  Button,
  Col,
  ImsInputDate,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import { mapToAccommodationModel } from "@/services/wallet/expenseReportServices";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputDropZone,
  ImsLocationPicker,
} from "@/views/shared/ImsFormElements/Index";
import USER_ACTIONS from "../actions";
import { useExpenseReport } from "../store";

const AccommodationForm = ({
  accommodation,
  toggleEditMode,
  drawerView = false,
}) => {
  const dataSet = accommodation
    ? mapToAccommodationModel(accommodation)
    : {
        data: {
          type: "",
          cost: 0,
          notes: "",
          checkin: "",
          checkout: "",
          location: "",
          attachments: [],
        },
        errors: {},
      };
  const schema = {
    type: IVal.string().required().label("Type"),
    checkin: IVal.string().required().label("Check in"),
    checkout: IVal.string().required().label("Check out"),
    location: IVal.string().required().label("Location"),
    notes: IVal.string().required().label("Notes"),
    cost: IVal.number().required().label("Cost"),
    attachments: IVal.label("Attachments"),
  };
  const { dataModel, handleChange, handleSubmit, validate, handleFileChange } =
    useForm(dataSet, schema);
  let { data, errors } = dataModel;
  let { processing, addAccommodation, updateAccommodation } =
    useExpenseReport();
  return (
    <div className="form-horizontal mb-3">
      <ImsInputText
        label="Type"
        placeholder="Accommodation type"
        name="type"
        mandatory={true}
        value={data.type}
        onChange={handleChange}
        error={errors.type}
      />
      <ImsLocationPicker
        label="Location"
        placeholder="Select location"
        name="location"
        inputCol={"10"}
        mandatory={true}
        value={data.location}
        onChange={handleChange}
        error={errors.location}
      />
      <Row>
        <Col md={drawerView ? "12" : "6"} xs="12">
          <ImsInputDate
            label="Check in"
            name="checkin"
            mandatory={true}
            value={data.checkin}
            onChange={handleChange}
            error={errors.checkin}
          />
        </Col>
        <Col md={drawerView ? "12" : "6"} xs="12">
          <ImsInputDate
            label="Check out"
            name="checkout"
            mandatory={true}
            value={data.checkout}
            onChange={handleChange}
            error={errors.checkout}
          />
        </Col>
      </Row>
      <ImsInputText
        label="Notes"
        placeholder="Notes"
        name="notes"
        mandatory={true}
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
        mandatory={true}
        type="number"
        value={data.cost}
        onChange={handleChange}
        error={errors.cost}
      />
      {/* name need to be changed */}
      <ImsInputDropZone
        label="Attachments"
        clearAll={!data.attachments.length}
        name="staffwallet"
        onLoad={(files) => handleFileChange(files, "attachments")}
      />
      <ImsButtonGroup>
        {accommodation && accommodation._id ? (
          <>
            <Button
              size="sm"
              className="border border-0"
              outline
              color="danger"
              disabled={
                validate()
                  ? true
                  : processing[USER_ACTIONS.AMEND_ACCOMMODATION].status
              }
              onClick={(e) => {
                handleSubmit(
                  e,
                  () => updateAccommodation(accommodation._id, dataModel.data),
                  false
                );
              }}
            >
              {processing[USER_ACTIONS.AMEND_ACCOMMODATION].status &&
              processing[USER_ACTIONS.AMEND_ACCOMMODATION].status.id ===
                accommodation._id
                ? "Saving..."
                : "Update accommodation"}
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
              validate()
                ? true
                : processing[USER_ACTIONS.INCLUDE_ACCOMMODATION].status
            }
            onClick={(e) => handleSubmit(e, addAccommodation(dataModel.data))}
          >
            {processing[USER_ACTIONS.INCLUDE_ACCOMMODATION].status
              ? "Saving..."
              : "Add accommodation"}
          </Button>
        )}
      </ImsButtonGroup>
    </div>
  );
};

export default AccommodationForm;
