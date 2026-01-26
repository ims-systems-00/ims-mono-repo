import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import NotificationContext from "@/contexts/notificationContext";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useAlert from "@/hooks/useAlerts";
import useForm from "@/hooks/useForm";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { GROUP_TYPE } from "@/rolesAndPermissions";
import {
  createGroupPremise,
  mapToPremiseModel,
  updatePremise,
} from "@/services/iamGroupPremisesServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { ImsInputSelect, ImsInputText } from "@ims-systems-00/ims-ui-kit";
import { TourStep } from "../../../components/Tour";

const PremisesForm = ({
  premise,
  setProcessing,
  processing,
  addToTable,
  refreshPremise,
}) => {
  const dataSet = premise
    ? mapToPremiseModel(premise)
    : {
        data: {
          groups: [],
          name: "",
          location: "",
          address: "",
        },
        errors: {},
      };

  const schema = {
    groups: IVal.array().min(1).label("Business units"),
    name: IVal.string().required().label("Name"),
    location: IVal.string().required().label("Location"),
    address: IVal.string().required().label("Address"),
  };
  let notify = React.useContext(NotificationContext);
  let { alert, successAlert } = useAlert();
  let { groups } = useContext(SuperGlobalContext);
  let { authSuperUser } = useAccess();
  const viewContextData = useContext(ViewContext);
  let history = useHistory();
  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "create": {
          setProcessing({ action: "create", id: null });
          let { data } = await createGroupPremise(dataModel.data);
          imsLogger("Premise created", data);
          addToTable && addToTable(data.iamGroupPremise);
          notify("Premise created successfully", "success");
          history.push(`/admin/businesspremise/${data.iamGroupPremise._id}`);
          break;
        }
        case "update": {
          setProcessing({ action: "update", id: premise._id });
          let { data } = await updatePremise(premise._id, dataModel.data);
          refreshPremise(data.iamGroupPremise);
          notify("Premise updated successfully", "success");
          viewContextData.switchView && viewContextData.switchView();
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger("PremisesForm", ex.response || ex);
      notify("Operation failed", "danger");
    }
    setProcessing({ action: null, id: null });
  };
  function handleCancelClick() {
    viewContextData.switchView && viewContextData.switchView();
  }
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema,
  );
  let { data, errors } = dataModel;

  return (
    <div>
      <Form action="/" className="form-horizontal" method="get">
        {alert}
        <TourStep stepId="business-premises-form">
          <Row>
            <Col md="6">
              {premise && authSuperUser() ? (
                <ImsInputSelect
                  isMulti
                  placeholder="Business units using this premise"
                  label="Business units"
                  name="groups"
                  value={data.groups}
                  className="react-select default"
                  classNamePrefix="react-select"
                  onChange={handleChange}
                  options={groups
                    .filter((group) => group.type === GROUP_TYPE.INTERNAL_BU)
                    .map((group) => ({
                      value: group._id,
                      label: group.name,
                    }))}
                  error={errors.groups}
                />
              ) : (
                <ImsInputSelect
                  isMulti
                  placeholder="Business units using this premise"
                  label="Business units"
                  name="groups"
                  value={data.groups}
                  className="react-select default"
                  classNamePrefix="react-select"
                  onChange={handleChange}
                  options={groups
                    .filter((group) => group.type === GROUP_TYPE.INTERNAL_BU)
                    .map((group) => ({
                      value: group._id,
                      label: group.name,
                    }))}
                  error={errors.groups}
                />
              )}
            </Col>
            <Col md="6">
              {" "}
              <ImsInputText
                label="Name"
                name="name"
                mandatory={true}
                value={data.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Premise name"
              />
            </Col>
            <Col md="6">
              <ImsInputText
                label="Location"
                name="location"
                mandatory={true}
                value={data.location}
                onChange={handleChange}
                error={errors.location}
                placeholder="Location"
              />
            </Col>
            <Col md="6">
              <ImsInputText
                label="Address"
                name="address"
                mandatory={true}
                value={data.address}
                onChange={handleChange}
                error={errors.address}
                placeholder="Address"
              />
            </Col>
          </Row>
        </TourStep>
        <ImsButtonGroup>
          {premise ? (
            <>
              <Button
                name="cancel"
                className="btn-fill"
                color="danger"
                type="button"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button
                name="update"
                onClick={(e) => handleSubmit(e, doSubmit, false)}
                disabled={validate() ? true : processing.action === "update"}
                className="btn-fill"
                color="info"
                type="button"
              >
                {processing.action === "update" ? "Processing..." : "Update"}
              </Button>
            </>
          ) : (
            <TourStep stepId="business-premises-create">
              <Button
                name="create"
                onClick={(e) => handleSubmit(e, doSubmit)}
                disabled={validate() ? true : processing.action === "create"}
                className="btn-fill"
                color="primary"
                type="button"
              >
                {processing.action === "create" ? "Processing..." : "Create"}
              </Button>
            </TourStep>
          )}
        </ImsButtonGroup>
      </Form>
    </div>
  );
};

export default PremisesForm;
