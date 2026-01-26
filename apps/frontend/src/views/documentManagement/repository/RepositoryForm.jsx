import { TourStep } from "@/components/Tour";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { mapToRepositoryModel } from "@/services/documentManagement/index";
import { filterUsersByGroup } from "@/utils/filters";
import { handleUpload, linkGenerator } from "@/utils/formatLinkGenerator";
import IVal from "@/validations/validator";
import ImsInputSelect from "@/views/shared/ImsFormElements/ImsInputSelect";
import {
  ImsInputText,
  ImsTextEditor,
} from "@/views/shared/ImsFormElements/Index";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React, { useContext } from "react";

const RepositoryForm = ({ repository, onSubmit = () => {} }) => {
  const dataSet = repository
    ? mapToRepositoryModel(repository)
    : {
        data: {
          name: "",
          description: "",
          group: {
            value: null,
            label: "Select Business unit",
          },
          owners: [],
          privacy: {
            value: "Business unit",
            label: "Business unit",
          },
          reviewInterval: {
            value: "Yearly",
            label: "Yearly",
          },
          sharedWith: [],
        },
        errors: {},
      };
  // Validation rules ....
  const schema = {
    group: IVal.when("privacy", {
      is: IVal.object().keys({
        value: IVal.label("policy name"),
        label: IVal.valid("Business unit").label("Privacy"),
      }),
      then: IVal.object().keys({
        value: IVal.string().required().label("Business unit"),
        label: IVal.string().required().label("Business unit"),
      }),
    }),
    name: IVal.string().required().label("Name"),
    description: IVal.label("Description"),
    owners: IVal.when("privacy", {
      is: IVal.object().keys({
        value: IVal.string().label("policy name"),
        label: IVal.valid("Organisational", "Business unit").label("Privacy"),
      }),
      then: IVal.array()
        .min(1)
        .max(3)
        .items(
          IVal.object().keys({
            value: IVal.string().required().label("Owner"),
            label: IVal.label("Owner"),
          }),
        )
        .label("Owners"),
    }),
    privacy: IVal.object().keys({
      value: IVal.string().required().label("Privacy"),
      label: IVal.label("Privacy"),
    }),
    reviewInterval: IVal.object().keys({
      value: IVal.string().required().label("Review interval"),
      label: IVal.label("Review interval"),
    }),
    sharedWith: IVal.label("Audience"),
  };
  const { groups } = useContext(SuperGlobalContext);
  let { entityAccessControl } = useAccess();
  let { users, lazyLoadUsers } = useUsers();
  const { dataModel, isBusy, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema,
  );

  React.useEffect(() => {
    lazyLoadUsers();
  }, []);
  let { data, errors } = dataModel;
  return (
    <Form action="/" className="form-horizontal" method="get">
      <TourStep stepId="create-repository-name">
        <ImsInputText
          label="Name"
          name="name"
          value={data.name}
          mandatory={true}
          onChange={handleChange}
          error={errors.name}
          placeholder="Name"
        />
        <ImsTextEditor
          label="Description"
          placeholder={"Add a description."}
          name="description"
          mediaLinkGeneratorFn={linkGenerator}
          onEachFileSelection={handleUpload}
          value={data.description}
          onChange={handleChange}
          error={errors.description}
        />
      </TourStep>

      <Row>
        <TourStep stepId="repository-form-privacy">
          <Row>
            <Col md={repository ? "12" : "6"}>
              <ImsInputSelect
                placeholder="Privacy"
                label="Privacy"
                name="privacy"
                mandatory={true}
                value={data.privacy}
                className="react-select default"
                classNamePrefix="react-select"
                onChange={handleChange}
                options={[
                  "Organisational",
                  "Business unit",
                  "Only me",
                  "Custom",
                ].map((item) => ({
                  value: item,
                  label: item,
                }))}
              />
            </Col>

            {dataModel?.data?.privacy?.value === "Business unit" && (
              <Col md={repository ? "12" : "6"}>
                <ImsInputSelect
                  label={"Business unit"}
                  name="group"
                  value={data.group}
                  className="react-select default"
                  classNamePrefix="react-select"
                  onChange={handleChange}
                  options={groups?.map((group) => ({
                    value: group._id,
                    label: group.name,
                  }))}
                />
              </Col>
            )}
            {dataModel.data.privacy.value === "Custom" && (
              <Col md={repository ? "12" : "6"}>
                <ImsInputSelect
                  isMulti
                  label="Select audience"
                  name="sharedWith"
                  value={data.sharedWith}
                  className="react-select default"
                  classNamePrefix="react-select"
                  onChange={handleChange}
                  options={users.map((user) => ({
                    value: user._id,
                    label: user.name,
                  }))}
                />
              </Col>
            )}
          </Row>
        </TourStep>
        {dataModel.data.privacy.value !== "Only me" && (
          <Col md={repository ? "12" : "6"}>
            <TourStep stepId="repository-form-owners">
              <ImsInputSelect
                label="Owner(s) (Max. 3 inclusive)"
                name="owners"
                isMulti
                value={data.owners}
                className="react-select default"
                classNamePrefix="react-select"
                onChange={handleChange}
                options={users
                  .filter((user) =>
                    filterUsersByGroup(user.membership, data.group?.value),
                  )
                  .map((user) => ({
                    value: user._id,
                    label: user.name,
                  }))}
              />
            </TourStep>
          </Col>
        )}
        <Col md={repository ? "12" : "6"}>
          <TourStep stepId="repository-form-review-interval">
            <ImsInputSelect
              placeholder="Review interval"
              label="Review interval"
              name="reviewInterval"
              mandatory={true}
              value={data.reviewInterval}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={["Quarterly", "Half yearly", "Yearly"].map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </TourStep>
        </Col>
      </Row>
      {repository ? (
        <Button
          name="update"
          onClick={(e) => {
            handleSubmit(e, () => onSubmit(dataModel.data), false);
          }}
          disabled={validate() ? true : isBusy}
          className=""
          color="primary"
          type="button"
        >
          {isBusy ? "Processing" : "Update"}
        </Button>
      ) : (
        <TourStep stepId="repository-form-button">
          <Button
            name="create"
            onClick={(e) => handleSubmit(e, () => onSubmit(dataModel.data))}
            disabled={validate() ? true : isBusy}
            className=""
            color="primary"
            type="button"
          >
            {isBusy ? "Processing" : "Create repository"}
          </Button>
        </TourStep>
      )}
    </Form>
  );
};

export default RepositoryForm;
