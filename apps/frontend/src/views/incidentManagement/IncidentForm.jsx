import React from "react";

//third party libraries ...
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import IVal from "@/validations/validator";

// custom components ...
import { ImsInputSelect, ImsInputText } from "@ims-systems-00/ims-ui-kit";
import {
  ImsButtonGroup,
  ImsInputCheck,
  ImsInputDropZone,
  ImsTextEditor,
} from "@/views/shared/ImsFormElements/Index";

// api consumer services ...
import { mapToIncidentModel } from "@/services/incidentManagenmentService";

// cotexts ...
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAccess from "@/hooks/useAccess";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { useContext } from "react";
import { filterUsersByGroup } from "@/utils/filters";
import { handleUpload, linkGenerator } from "@/utils/formatLinkGenerator";
import { useTagsAndCategories } from "@/views/tagsAndCategoriesManager/store";
import useDebounce from "@/hooks/useDebounce";
import AddCategory from "../tagsAndCategoriesManager/AddCategory";
import { TourStep } from "../../components/Tour";

const IncidentForm = ({
  visitingIncident: incident,
  drawerView,
  suppliers,
  onSubmit = () => {},
}) => {
  let { tagsAndCategories, searchTags } = useTagsAndCategories();
  let { authGlobalAccess } = useAccess();
  let { users, lazyLoadUsers } = useUsers();
  let [searchString, setSearchString] = React.useState("");
  const debouncedSearchString = useDebounce(searchString, 500);

  // default dataSet for the form fields ...

  const dataSet = incident
    ? mapToIncidentModel(incident)
    : {
        data: {
          title: "",
          description: "",
          group: {
            value: null,
            label: "Select Business unit",
          },
          methodOfNotification: "",
          privacy: false,
          priority: {
            value: "P1",
            label: "P1",
          },
          affectedService: "",
          resolution: "",
          resolveStatus: false,
          owner: {
            value: null,
            label: "Select owner",
          },
          attachments: [],
          tagsAndCategories: "",
        },
        errors: {},
      };

  // Validation rules ....

  const schema = {
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    title: IVal.string().required().min(8).label("Title"),
    description: IVal.string().required().label("Description"),
    methodOfNotification: IVal.label("Method of notification"),
    privacy: IVal.boolean().label("Privacy"),
    priority: IVal.object().keys({
      value: IVal.string().required().label("Priority"),
      label: IVal.label("Priority"),
    }),
    affectedService: IVal.label("Affected service"),
    owner: IVal.object().keys({
      value: IVal.string().required().label("Owner"),
      label: IVal.label("Owner"),
    }),
    resolution: IVal.label("Resolution"),
    resolveStatus: IVal.boolean().label("Resolve"),
    attachments: IVal.label("Attachments"),
    tagsAndCategories: IVal.label("Tag and Category"),
    supplierIncident: IVal.boolean().label("Supplier Incident"),
    supplier: IVal.when("supplierIncident", {
      is: IVal.boolean().valid(true),
      then: IVal.object().keys({
        value: IVal.string().required().label("Supplier"),
        label: IVal.label("Supplier"),
      }),
    }),
  };

  const { groups } = useContext(SuperGlobalContext);
  const {
    dataModel,
    handleChange,
    handleSubmit,
    validate,
    handleFileChange,
    isBusy,
  } = useForm(dataSet, schema);
  // submission logic to sever goes here ...

  React.useEffect(() => {
    lazyLoadUsers();
  }, []);

  let { data, errors } = dataModel;

  React.useEffect(() => {
    searchTags(searchString);
  }, [debouncedSearchString]);

  return (
    <Form action="/" className="form-horizontal" method="get">
      <Row>
        <Col md={drawerView ? "12" : "6"}>
          <ImsInputSelect
            label={authGlobalAccess() ? "Business unit" : "Business unit"}
            name="group"
            value={data.group}
            isDisabled={incident ? true : false}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={groups.map((group) => ({
              value: group._id,
              label: group.name,
            }))}
          />
        </Col>
        <TourStep data-tour-step="create-incident-form">
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Title"
              name="title"
              value={data.title}
              mandatory={true}
              disabled={
                incident?.source?.moduleType === "audits" ? true : false
              }
              onChange={handleChange}
              error={errors.title}
              placeholder="Title"
            />
          </Col>
          {/* <Col md={drawerView ? "12" : "6"}>
          <ImsInputCheck
            checked={data.supplierIncident}
            label="Is Supplier Incident"
            name="supplierIncident"
            value={data.supplierIncident}
            onChange={handleChange}
            error={errors.supplierIncident}
          />
        </Col> */}
          {dataModel.data.supplierIncident && (
            <Col md={drawerView ? "12" : "6"}>
              <ImsInputSelect
                label={"Supplier name"}
                name="supplier"
                value={data.supplier}
                isDisabled={incident ? true : false}
                className="react-select default"
                classNamePrefix="react-select"
                onChange={handleChange}
                options={suppliers.map((supplier) => ({
                  value: supplier._id,
                  label: supplier.name,
                }))}
              />
            </Col>
          )}
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Method of notification"
              name="methodOfNotification"
              value={data.methodOfNotification}
              onChange={handleChange}
              error={errors.methodOfNotification}
              placeholder="Method of notification"
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputText
              label="Affected service"
              name="affectedService"
              value={data.affectedService}
              onChange={handleChange}
              error={errors.affectedService}
              placeholder="Affected service"
            />
          </Col>
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputSelect
              label="Priority"
              name="priority"
              mandatory={true}
              value={data.priority}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={["P1", "P2", "P3", "P4"].map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Col>
        </TourStep>
        <TourStep data-tour-step="create-incident-owner">
          <Col md={drawerView ? "12" : "6"}>
            <ImsInputSelect
              label="Incident owner"
              name="owner"
              value={data.owner}
              mandatory={true}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={users
                .filter((user) =>
                  filterUsersByGroup(
                    user.membership,
                    dataModel.data.group.value
                  )
                )
                .map((user) => ({ value: user._id, label: user.name }))}
            />
          </Col>
        </TourStep>
        <Col xl={drawerView ? "12" : "6"} xs="12">
          <ImsInputSelect
            name="tagsAndCategories"
            value={data.tagsAndCategories}
            vertical={true}
            onChange={handleChange}
            onInputChange={setSearchString}
            options={[
              {
                value: null,
                label: "Not selected",
              },
              ...tagsAndCategories.map((tag) => ({
                value: tag._id,
                label: tag.name,
              })),
            ]}
            label={"Category"}
            sideBtn={<AddCategory />}
            className="react-select default"
            classNamePrefix="react-select"
          />
        </Col>
        {!incident && (
          <Col md="12">
            <ImsInputCheck
              checked={data.privacy}
              label="is organisational"
              name="privacy"
              value={data.privacy}
              onChange={handleChange}
              error={errors.privacy}
            />
          </Col>
        )}
        <Col md="12">
          <ImsTextEditor
            label="Description"
            name="description"
            mandatory={true}
            placeholder={"Add a description."}
            value={data.description}
            mediaLinkGeneratorFn={linkGenerator}
            onEachFileSelection={handleUpload}
            onChange={handleChange}
          />
        </Col>{" "}
      </Row>
      <ImsInputDropZone
        label="Attachments"
        clearAll={!data.attachments.length}
        name="incidents"
        onLoad={(files) => handleFileChange(files, "attachments")}
      />

      {incident && (
        <Row>
          {dataModel.data.resolveStatus && (
            <Col md="12">
              <ImsTextEditor
                label="Resolution"
                name="resolution"
                placeholder={"Add a resolution."}
                value={data.resolution}
                mediaLinkGeneratorFn={linkGenerator}
                onEachFileSelection={handleUpload}
                onChange={handleChange}
              />
            </Col>
          )}
          <ImsInputCheck
            checked={data.resolveStatus}
            label="Resolved"
            name="resolveStatus"
            value={data.resolveStatus}
            onChange={handleChange}
            error={errors.resolveStatus}
          />
        </Row>
      )}
      <ImsButtonGroup>
        {incident ? (
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
              {isBusy
                ? "Processing"
                : data.resolveStatus
                  ? "Resolve"
                  : "Update incident"}
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
            {isBusy ? "Processing" : "Raise incident"}
          </Button>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default IncidentForm;
