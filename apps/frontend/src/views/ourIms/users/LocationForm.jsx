import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import useProcessingControl from "@/hooks/useProcessingControl";
import { Button, Col, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { imsLogger } from "@/services/loggerService";
import {
  addWorkingLocation,
  refreshProfileCache,
} from "@/services/userServices";
import IVal from "@/validations/validator";
import {
  ImsInputCheck,
  ImsLocationPicker,
} from "@/views/shared/ImsFormElements/Index";
import USER_ACTIONS from "./actions";

const LocationForm = ({ userId, refreshUser }) => {
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.ADD_LOCATION },
  ]);
  const dataSet = {
    data: {
      address: "",
      isRemote: false,
    },
    errors: {},
  };
  const schema = {
    address: IVal.string().required().label("Address"),
    isRemote: IVal.boolean().label("Remote"),
  };
  const { dataModel, handleChange, validate } = useForm(dataSet, schema);
  const notify = React.useContext(NotificationContext);
  let handleAddAddress = async (e) => {
    try {
      dispatch({
        [USER_ACTIONS.ADD_LOCATION]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await addWorkingLocation(userId, dataModel.data);
      notify("Address added successfully ", "success");
      refreshUser && refreshUser(data.user);
      refreshProfileCache(data.user);
      dispatch({
        [USER_ACTIONS.ADD_LOCATION]: {
          status: false,
          error: false,
          id: null,
        },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.ADD_LOCATION]: {
          status: false,
          error: true,
          id: null,
        },
      });
      imsLogger("LocationForm", ex.response || ex);
      notify("Address addition failed.Unknown server error occurred", "danger");
    }
  };
  let { data, errors } = dataModel;
  return (
    <div className="content">
      <Row>
        <ImsLocationPicker
          label="Address"
          placeholder="Select address"
          name="address"
          lableCol={"12"}
          inputCol={"4"}
          value={data.address}
          onChange={handleChange}
          error={errors.address}
        />
        <ImsInputCheck
          label="Remote"
          name="isRemote"
          value={data.isRemote}
          checked={data.isRemote}
          onChange={handleChange}
          error={errors.isRemote}
        />
        <Col md="3">
          <Button
            onClick={() => handleAddAddress()}
            color="success"
            size="sm"
            disabled={
              validate() ? true : processing[USER_ACTIONS.ADD_LOCATION].status
            }
            className=" mb-2"
          >
            {processing[USER_ACTIONS.ADD_LOCATION].status
              ? "Saving..."
              : "Add address"}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default LocationForm;
