import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import {
  Button,
  Col,
  Form,
  ImsInputSelect,
  ImsInputText,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { mapToCIPModel } from "@/services/continualImprovementServices";
import { filterUsersByGroup } from "@/utils/filters";
import { handleUpload, linkGenerator } from "@/utils/formatLinkGenerator";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputDropZone,
  ImsTextEditor,
} from "@/views/shared/ImsFormElements/Index";
const CipForm = ({
  visitingCip: cip,
  onSubmit = () => {},
  onImplement = () => {},
  drawerView = false,
  ...props
}) => {
  let { authGlobalAccess } = useAccess();
  const dataSet = cip
    ? mapToCIPModel(cip)
    : {
        data: {
          group: {
            value: null,
            label: "Select Business unit",
          },
          owner: {
            value: null,
            label: "Select owner",
          },
          title: "",
          opportunityForImprovement: "",
          cost: 0,
          attachments: [],
        },
        errors: {},
      };
  const schema = {
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    owner: IVal.object().keys({
      value: IVal.string().required().label("Owner"),
      label: IVal.label("Owner"),
    }),
    title: IVal.string().required().label("Title"),
    opportunityForImprovement: IVal.string().required().label("OFI"),
    cost: IVal.number().integer().min(0).label("Cost"),
    attachments: IVal.label("Attachments"),
  };

  let { users, lazyLoadUsers } = useUsers();
  const { groups } = useContext(SuperGlobalContext);

  const {
    dataModel,
    isBusy,
    handleChange,
    handleSubmit,
    validate,
    handleFileChange,
  } = useForm(dataSet, schema);
  // function handleCancelClick() {
  //   viewContextData.switchView && viewContextData.switchView();
  // }
  React.useEffect(() => {
    /**
     * Please do not use any dependency in this effect. This should only
     * work as a component did mount function. Otherwise will misbehave.
     */
    lazyLoadUsers();
  }, []);
  let { data, errors } = dataModel;

  return (
    <Form action="/" className="form-horizontal" method="get">
      <Row>
        <Col md={drawerView ? "12" : "6"}>
          <ImsInputSelect
            label={authGlobalAccess() ? "Business unit" : "Business unit"}
            name="group"
            value={data.group}
            isDisabled={cip ? true : false}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={groups.map((group) => ({
              value: group._id,
              label: group.name,
            }))}
          />
        </Col>
        <Col md={drawerView ? "12" : "6"}>
          <ImsInputText
            label="Title"
            placeholder="Title"
            mandatory={true}
            name="title"
            disabled={cip?.source?.moduleType === "audits" ? true : false}
            value={data.title}
            onChange={handleChange}
            error={errors.title}
          />
        </Col>
      </Row>

      <Row>
        <Col md={drawerView ? "12" : "6"}>
          <ImsInputSelect
            label="Owner"
            mandatory={true}
            name="owner"
            value={data.owner}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={users
              .filter((user) =>
                filterUsersByGroup(user.membership, dataModel.data.group.value)
              )
              .map((user) => ({ value: user._id, label: user.name }))}
          />
        </Col>
        <Col md={drawerView ? "12" : "6"}>
          <ImsInputText
            type="number"
            label="Cost"
            name="cost"
            value={data.cost}
            onChange={handleChange}
            error={errors.cost}
          />
        </Col>
      </Row>
      <ImsTextEditor
        label="Opportunity for improvement"
        name="opportunityForImprovement"
        mandatory={true}
        placeholder={"Add a description."}
        mediaLinkGeneratorFn={linkGenerator}
        onEachFileSelection={handleUpload}
        disabled={cip?.source?.moduleType === "audits" ? true : false}
        value={cip?.opportunityForImprovement}
        onChange={handleChange}
        error={errors.opportunityForImprovement}
      />
      <ImsInputDropZone
        label="Attachments"
        clearAll={!data.attachments.length}
        name="cips"
        onLoad={(files) => handleFileChange(files, "attachments")}
      />
      <ImsButtonGroup>
        {cip ? (
          <>
            <Button
              name="update"
              onClick={(e) => {
                handleSubmit(e, () => onSubmit(dataModel.data), false);
              }}
              disabled={validate() ? true : isBusy}
              className="btn-fill"
              color="info"
              type="button"
            >
              {isBusy ? "Processing" : "Update"}
            </Button>
            <Button
              name="implement"
              onClick={(e) => {
                handleSubmit(e, () => onImplement(dataModel.data), false);
              }}
              disabled={validate() ? true : isBusy}
              className="btn-fill"
              color="success"
              type="button"
            >
              {isBusy ? "Processing" : "Implement"}
            </Button>
          </>
        ) : (
          <Button
            name="create"
            onClick={(e) => {
              handleSubmit(e, () => onSubmit(dataModel.data));
            }}
            disabled={validate() ? true : isBusy}
            className="btn-fill"
            color="primary"
            type="button"
          >
            {isBusy ? "Processing" : "Create"}
          </Button>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default CipForm;
