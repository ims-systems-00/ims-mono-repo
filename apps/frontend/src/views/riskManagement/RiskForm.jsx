import React from "react";

//third party libraries ...
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import IVal from "@/validations/validator";

//custom hooks ...

// custom components ...
import {
  ImsButtonGroup,
  ImsInputCheck,
  ImsInputDropZone,
  ImsTextEditor,
} from "@/views/shared/ImsFormElements/Index";

import { ImsInputSelect, ImsInputText } from "@ims-systems-00/ims-ui-kit";

// api consumer services ...
import {
  getHardwareAssets,
  getPeopleAssets,
  getPremiseAssets,
  getSoftwareAssets,
} from "@/services/inventoryServices";

import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { useContext } from "react";
import { imsLogger } from "@/services/loggerService";
import { filterUsersByGroup } from "@/utils/filters";
import { handleUpload, linkGenerator } from "@/utils/formatLinkGenerator";

import { mapToRiskModel } from "@/services/riskManagementServices";
import { useTagsAndCategories } from "@/views/tagsAndCategoriesManager/store";
import useDebounce from "@/hooks/useDebounce";
import riskTypes from "./riskTypes";
import AddCategory from "@/views/tagsAndCategoriesManager/AddCategory";
import { TourStep } from "../../components/Tour";
// default dataSet for the form fields ...

const RiskForm = ({
  visitingRisk,
  onSubmit = () => {},
  drawerView = false,
  ...props
}) => {
  let { tagsAndCategories, searchTags } = useTagsAndCategories();
  let [searchString, setSearchString] = React.useState("");
  const debouncedSearchString = useDebounce(searchString, 500);
  const dataSet = visitingRisk
    ? mapToRiskModel(visitingRisk)
    : {
        data: {
          type: "",
          group: {
            value: null,
            label: "Select Business unit",
          },
          asset: {
            value: null,
            label: "Select asset",
          },
          title: "",
          description: "",
          consequence: {
            value: 1,
            label: 1,
          },
          likelihood: {
            value: 1,
            label: 1,
          },

          owner: {
            value: null,
            label: "Select owner",
          },
          controlsAndMitigation: "",
          mitigationStatus: false,
          acceptanceRational: "",
          tagsAndCategories: "",
          decisionMaker: "",
          acceptanceStatus: false,
          attachments: [],
        },
        errors: {},
      };

  // Validation rules ....

  const schema = {
    type: IVal.object().keys({
      value: IVal.string().required().label("Type"),
      label: IVal.label("Type"),
    }),
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    asset: IVal.object().keys({
      value: IVal.label("Asset"),
      label: IVal.label("Asset"),
    }),
    title: IVal.string().required().label("Risk title"),
    description: IVal.string().required().label("Description"),
    consequence: IVal.object().keys({
      value: IVal.number().required().label("Consequence"),
      label: IVal.label("Consequence"),
    }),
    likelihood: IVal.object().keys({
      value: IVal.number().required().label("likelihood"),
      label: IVal.label("likelihood"),
    }),
    owner: IVal.object().keys({
      value: IVal.string().required().label("Owner"),
      label: IVal.label("Owner"),
    }),
    controlsAndMitigation: IVal.label("Controls and mitigation"),
    mitigationStatus: IVal.boolean().label("Mitigation Status"),
    acceptanceRational: IVal.label("Acceptance Rational"),
    decisionMaker: IVal.label("Decision maker"),
    acceptanceStatus: IVal.boolean().label("Acceptance Status"),
    attachments: IVal.label("Attachments"),
    tagsAndCategories: IVal.label("Tag and Category"),
  };

  let { groups } = useContext(SuperGlobalContext);
  let { users, lazyLoadUsers } = useUsers();
  let [assets, setAssets] = React.useState([]);
  const {
    dataModel,
    isBusy,
    handleChange,
    handleSubmit,
    validate,
    handleFileChange,
  } = useForm(dataSet, schema);

  React.useEffect(() => {
    /**
     * Please do not use any dependency in this effect. This should only
     * work as a component did mount function. Otherwise will misbehave.
     */
    lazyLoadUsers();
  }, []);

  React.useEffect(() => {
    searchTags(searchString);
  }, [debouncedSearchString]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        switch (data.type.value) {
          case "Hardware": {
            let { data } = await getHardwareAssets({ query: "" });
            setAssets(data.hardwareAssets);
            break;
          }
          case "Software": {
            let { data } = await getSoftwareAssets({ query: "" });
            setAssets(data.softwareAssets);
            break;
          }
          case "People": {
            let { data } = await getPeopleAssets({ query: "" });
            setAssets(data.peopleAssets);
            break;
          }
          case "Premise": {
            let { data } = await getPremiseAssets({ query: "" });
            setAssets(data.premiseAssets);
            break;
          }
          default:
            setAssets([]);
        }
      } catch (ex) {
        imsLogger("RiskForm", ex, ex.response);
      }
    }
    fetchData();
  }, [dataModel.data.group]);

  let { data, errors } = dataModel;

  return (
    <Form action="/" method="get">
      {alert}
      <Row>
        <TourStep data-tour-step="create-risk-form">
          <Col md={drawerView ? "12" : "6"} xs="12">
            <ImsInputText
              label="Risk title"
              name="title"
              mandatory={true}
              value={data.title}
              disabled={
                visitingRisk?.source?.moduleType === "audits" ? true : false
              }
              onChange={handleChange}
              error={errors.title}
              isHorizontal={false}
              placeholder="Risk title"
            />
          </Col>
          <Col xl={drawerView ? "12" : "6"} xs="12">
            <ImsInputSelect
              name="type"
              value={data.type}
              mandatory={true}
              vertical={true}
              onChange={handleChange}
              onInputChange={setSearchString}
              options={riskTypes.map((type) => ({
                value: type.value,
                label: type.label,
              }))}
              label={"Type"}
              className="react-select default"
              classNamePrefix="react-select"
            />
          </Col>
          <Col md={drawerView ? "12" : "6"} xs="12">
            <ImsInputSelect
              label="Business unit"
              name="group"
              isHorizontal={false}
              value={data.group}
              isDisabled={visitingRisk ? true : false}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={groups?.map((group) => ({
                value: group._id,
                label: group.name,
              }))}
            />
          </Col>
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
                ,
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
        </TourStep>
      </Row>
      <Row>
        <Col md={drawerView ? "12" : "6"} xs="12">
          <ImsInputSelect
            label="Risk owner"
            name="owner"
            mandatory={true}
            value={data.owner}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            isHorizontal={false}
            options={users
              .filter((user) =>
                filterUsersByGroup(user.membership, dataModel.data.group.value)
              )
              .map((user) => ({ value: user._id, label: user.name }))}
          />
        </Col>

        <Col md={drawerView ? "12" : "6"} xs="12">
          {data.type !== "Organisational" && (
            <ImsInputSelect
              label="Asset"
              name="asset"
              value={data.asset}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              isHorizontal={false}
              options={assets
                .filter((asset) => asset?.group?._id === data.group.value)
                .map((asset) => ({
                  value: asset._id,
                  label: asset.name,
                }))}
            />
          )}
        </Col>
      </Row>

      <ImsTextEditor
        label="Description"
        name="description"
        mandatory={true}
        placeholder={"Add a description."}
        mediaLinkGeneratorFn={linkGenerator}
        onEachFileSelection={handleUpload}
        disabled={visitingRisk?.source?.moduleType === "audits" ? true : false}
        onChange={handleChange}
        error={errors.description}
        value={data?.description}
      />
      <Row>
        <Col xl={drawerView ? "12" : "6"} xs="12">
          <ImsInputSelect
            label="Likelihood"
            name="likelihood"
            mandatory={true}
            value={data.likelihood}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            isHorizontal={false}
            error={errors.likelihood}
            options={[1, 2, 3, 4, 5].map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </Col>
        <Col xl={drawerView ? "12" : "6"} xs="12">
          <ImsInputSelect
            label="Consequence"
            name="consequence"
            mandatory={true}
            value={data.consequence}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            isHorizontal={false}
            error={errors.consequence}
            options={[1, 2, 3, 4, 5].map((item) => ({
              value: item,
              label: item,
            }))}
          />
        </Col>
      </Row>
      <ImsInputDropZone
        label="Attachments"
        clearAll={!data.attachments.length}
        name="risks"
        onLoad={(files) => handleFileChange(files, "attachments")}
        isHorizontal={false}
      />
      {visitingRisk && (
        <>
          <ImsTextEditor
            label="Mitigations"
            cols="80"
            placeholder="Mitigations"
            rows="2"
            type="textarea"
            name="controlsAndMitigation"
            mediaLinkGeneratorFn={linkGenerator}
            onEachFileSelection={handleUpload}
            onChange={handleChange}
            error={errors.controlsAndMitigation}
            isHorizontal={false}
            value={visitingRisk.controlsAndMitigation}
          />
          <ImsInputCheck
            checked={data.mitigationStatus}
            label="Mitigated"
            name="mitigationStatus"
            value={data.mitigationStatus}
            onChange={handleChange}
            error={errors.mitigationStatus}
            isHorizontal={false}
          />
          {
            <>
              <ImsTextEditor
                label="Acceptance rationale"
                placeholder="Acceptance rationale"
                cols="80"
                rows="2"
                type="textarea"
                name="acceptanceRational"
                mediaLinkGeneratorFn={linkGenerator}
                onEachFileSelection={handleUpload}
                onChange={handleChange}
                error={errors.acceptanceRational}
                isHorizontal={false}
                value={visitingRisk.acceptanceRational}
              />
              <ImsInputText
                label="Decision maker"
                placeholder="Decision maker"
                name="decisionMaker"
                value={data.decisionMaker}
                onChange={handleChange}
                error={errors.decisionMaker}
                isHorizontal={false}
              />
              <ImsInputCheck
                checked={data.acceptanceStatus}
                label="Accepted"
                name="acceptanceStatus"
                value={data.acceptanceStatus}
                onChange={handleChange}
                error={errors.acceptanceStatus}
                isHorizontal={false}
              />
            </>
          }
        </>
      )}
      <ImsButtonGroup>
        {/** Has this visitingRisk been miigated */}
        {visitingRisk ? (
          <>
            <Button
              name="update"
              onClick={(e) => {
                handleSubmit(e, () => onSubmit(dataModel.data), false);
              }}
              disabled={validate() ? true : isBusy}
              className="btn-fill mb-4"
              color="info"
              type="button"
            >
              {isBusy
                ? "Processing"
                : data.mitigationStatus
                  ? "Mitigated"
                  : data.acceptanceStatus
                    ? "Accepted"
                    : "Update risk"}
            </Button>
          </>
        ) : (
          <Button
            name="create"
            onClick={(e) => {
              handleSubmit(e, () => onSubmit(dataModel.data));
              // if (fromDrawer) {
              //   props.closeDrawer();
              // } else {
              //   viewContextData.switchView && viewContextData.switchView();
              // }
            }}
            disabled={validate() ? true : isBusy}
            className="btn-fill"
            color="primary"
            type="button"
          >
            {isBusy ? "Processing" : "Raise risk"}
          </Button>
        )}
      </ImsButtonGroup>
    </Form>
  );
};

export default RiskForm;
