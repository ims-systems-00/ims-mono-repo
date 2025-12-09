import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import {
  Button,
  Form,
  ImsInputSelect,
  ImsInputText,
} from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { GROUP_TYPE } from "@/rolesAndPermissions";
import {
  createGroup,
  mapToIamGroupModel,
  updateGroupDescription,
} from "@/services/iamGroupServices";
import { imsLogger } from "@/services/loggerService";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import BusinessFunctionGroup from "./BusinessFunctionGroup";
import ComplianceBodyGroup from "./ComplianceBodyGroup";
import LOADERS from "./LoadingActions";
import useError from "@/hooks/error";
import OrganizationalOverview from "../licenseManagement/OrganizaionalOverview";
import Loading from "@/components/Loader/Loading";

const GroupForm = ({
  group,
  dispatch,
  processing,
  addToTable,
  refreshGroup,
}) => {
  let notify = React.useContext(NotificationContext);
  const viewContextData = useContext(ViewContext);
  let history = useHistory();
  const { handleError } = useError();

  const dataSet = group
    ? mapToIamGroupModel(group)
    : {
        data: {
          type: {
            value: null,
            label: "Select access type",
          },
          name: "",
          operatingLocation: "",
          responsibility: "",
          standards: "",
        },
        errors: {},
      };

  const schema = {
    type: IVal.object().keys({
      value: IVal.string().required().label("Access policy"),
      label: IVal.label("Access policy"),
    }),
    name: IVal.string().required().label("Name"),
    operatingLocation: IVal.when("type", {
      is: IVal.object().keys({
        value: IVal.string().label("operatingLocation"),
        label: IVal.valid(GROUP_TYPE.INTERNAL_BU, GROUP_TYPE.EXTERNAL_U).label(
          "operatingLocation"
        ),
      }),
      then: IVal.string().required().label("Operating location"),
    }),
    standards: IVal.when("type", {
      is: IVal.object().keys({
        value: IVal.string().label("standards"),
        label: IVal.valid(GROUP_TYPE.EXTERNAL_CU, GROUP_TYPE.INTERNAL_CU).label(
          "standards"
        ),
      }),
      then: IVal.string().required().label("Standards"),
    }),
    responsibility: IVal.string().required().label("Responsibility"),
  };
  let _createUnit = async (e) => {
    try {
      dispatch({
        [LOADERS.CREATE_GROUP]: { status: true, error: false, id: null },
      });
      let { data } = await createGroup(dataModel.data);
      notify("Business unit created successfully ", "success");
      imsLogger("GroupForm", data);
      addToTable && addToTable(data.iamGroup);
      history.push(`/admin/groups/${data.iamGroup._id}`);
      dispatch({
        [LOADERS.CREATE_GROUP]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADERS.CREATE_GROUP]: { status: false, error: true, id: null },
      });
      imsLogger("GroupForm", ex);
      handleError(ex);
    }
  };

  let _updateUnit = async (e) => {
    try {
      dispatch({
        [LOADERS.AMEND_GROUP]: { status: true, error: false, id: null },
      });
      let { data } = await updateGroupDescription(group._id, dataModel.data);
      refreshGroup && refreshGroup(data.iamGroup);
      notify("Business unit updated successfully ", "success");
      viewContextData.switchView && viewContextData.switchView();
      dispatch({
        [LOADERS.AMEND_GROUP]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [LOADERS.AMEND_GROUP]: { status: false, error: true, id: null },
      });
      imsLogger("GroupForm", ex);
      handleError(ex);
    }
  };

  function handleCancelClick() {
    viewContextData.switchView && viewContextData.switchView();
  }
  const { dataModel, handleChange, handleSubmit, validate } =
    useForm(dataSet, schema);

  let { data, errors } = dataModel;
  return (
    <>
      {processing[LOADERS.CREATE_GROUP].status === true ? (
        <Loading />
      ) : (
        <OrganizationalOverview users={false} tools={false} />
      )}
      <Form action="/" className="form-horizontal">
        <ImsInputSelect
          label="Access type"
          name="type"
          mandatory={true}
          value={data.type}
          isDisabled={group ? true : false}
          className="react-select default"
          classNamePrefix="react-select"
          onChange={handleChange}
          options={Object.values(GROUP_TYPE).map((item) => ({
            value: item,
            label: item,
          }))}
        />
        {data.type && data.type.value && (
          <>
            {data.type &&
              [GROUP_TYPE.INTERNAL_BU, GROUP_TYPE.EXTERNAL_U].includes(
                data.type.value
              ) && (
                <BusinessFunctionGroup
                  dataModel={dataModel}
                  handleChange={handleChange}
                />
              )}
            {data.type &&
              [GROUP_TYPE.INTERNAL_CU, GROUP_TYPE.EXTERNAL_CU].includes(
                data.type.value
              ) && (
                <ComplianceBodyGroup
                  dataModel={dataModel}
                  handleChange={handleChange}
                />
              )}
            <ImsInputText
              type="textarea"
              cols="80"
              rows="2"
              label="Responsibility"
              name="responsibility"
              value={data.responsibility}
              onChange={handleChange}
              error={errors.responsibility}
              placeholder="Responsibility"
            />
            <ImsButtonGroup>
              {group ? (
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
                    disabled={
                      validate() ? true : processing[LOADERS.AMEND_GROUP].status
                    }
                    className="btn-fill"
                    color="info"
                    type="button"
                    onClick={(e) => handleSubmit(e, _updateUnit, false)}
                  >
                    {processing[LOADERS.AMEND_GROUP].status
                      ? "Processing..."
                      : "Update"}
                  </Button>
                </>
              ) : (
                <Button
                  name="create"
                  disabled={
                    validate() ? true : processing[LOADERS.CREATE_GROUP].status
                  }
                  className="btn-fill"
                  color="primary"
                  type="button"
                  onClick={(e) => handleSubmit(e, _createUnit)}
                >
                  {processing[LOADERS.CREATE_GROUP].status
                    ? "Processing..."
                    : "Create"}
                </Button>
              )}
            </ImsButtonGroup>
          </>
        )}
      </Form>
    </>
  );
};

export default GroupForm;
