import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { Button, Form } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import IVal from "@/validations/validator";
import { ImsInputSelect } from "@ims-systems-00/ims-ui-kit";
import {
  ImsInputDropZone,
  ImsInputCheck,
} from "@/views/shared/ImsFormElements/Index";
import { applicableModulesOptions } from "@/views/utils/constants";
import { imsLogger } from "@/services/loggerService";
import { getLicenses } from "@/services/organizationService";
import { useApplication } from "@/stores/applicationStore";

function prepareDatamodel(node) {
  return node
    ? {
        data: {
          purpose: {
            value: node?.documentData?.purpose,
            label: node?.documentData?.purpose,
          },
          shouldAuthorise: node?.documentData?.authorisation?.length
            ? true
            : false,
          authorisation: node?.documentData?.authorisation.map((a) => ({
            value: a.user?._id,
            label: a.user.name,
          })),
          owners: node?.documentData?.owners?.map((owner) => ({
            value: owner?._id,
            label: owner?.name,
          })),
          applicableModules: [],
          complianceTools: [],
          attachments: [],
        },
        errors: {},
      }
    : {
        data: {
          purpose: {
            value: null,
            label: "Select purpose of the document",
          },
          shouldAuthorise: false,
          applicableModules: [],
          owners: [],
          authorisation: [],
          complianceTools: [],
          attachments: [],
        },
        errors: {},
      };
}

const UploadFileForm = ({ node, noMultiple, onSubmit = () => {} }) => {
  const { users, lazyLoadUsers } = useUsers();
  const dataSet = prepareDatamodel(node);
  let [toolKits, setToolKits] = React.useState([]);
  let globalData = useApplication();
  const schema = {
    purpose: IVal.object().keys({
      value: IVal.string().required().label("Purpose"),
      label: IVal.label("Purpose"),
    }),
    applicableModules: IVal.array()
      .items(
        IVal.object().keys({
          value: IVal.string().required().label("Module"),
          label: IVal.label("Module"),
        })
      )
      .label("Applicable modules"),
    complianceTools: IVal.array()
      .items(
        IVal.object().keys({
          value: IVal.string().required().label("Toolkit"),
          label: IVal.label("Toolkit"),
        })
      )
      .label("Toolkit"),
    owners: IVal.array()
      .min(1)
      .items(
        IVal.object().keys({
          value: IVal.string().required().label("Owner"),
          label: IVal.label("Owner"),
        })
      )
      .label("Owners"),
    shouldAuthorise: IVal.label("Should Authorise"),
    authorisation: IVal.label("Authorisation"),
    attachments: IVal.array().min(1).max(20).label("Attachments"),
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await getLicenses(
          globalData?.tokenPair?.accessTokenData?.user?.organizationId
        );
        setToolKits(
          data.licenses.complianceTools.map((tool) => ({ name: tool }))
        );
      } catch (ex) {
        imsLogger("ManageLicense", ex.response);
      }
    }
    fetchData();
  }, []);

  const {
    dataModel,
    isBusy,
    handleChange,
    handleSubmit,
    validate,
    handleFileChange,
  } = useForm(dataSet, schema);
  React.useEffect(() => {
    lazyLoadUsers();
  }, []);
  let { data, errors } = dataModel;
  return (
    <React.Fragment>
      {node && <h5 className="text-center mt-2 mb-2">Upload new version</h5>}
      <Form>
        <ImsInputDropZone
          label="Document"
          name="general"
          mandatory={true}
          noMultiple={noMultiple || node}
          onLoad={(files) => {
            if (files.length) {
              handleFileChange(files, "attachments");
            }
          }}
        />
        {!node && (
          <React.Fragment>
            <ImsInputSelect
              label="Purpose"
              name="purpose"
              mandatory={true}
              value={data.purpose}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={[
                "Process",
                "Standard operating procedure",
                "Policy",
                "Document",
                "Legal",
                "Miscellaneous",
              ].map((item) => ({
                value: item,
                label: item,
              }))}
            />
            <ImsInputSelect
              label="Applicable modules"
              name="applicableModules"
              value={data.applicableModules}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={applicableModulesOptions}
              isMulti
            />

            {dataModel.data.applicableModules.some(
              (option) => option.value === "compliancecontrols"
            ) && (
              <ImsInputSelect
                label="Select toolkit"
                name="complianceTools"
                value={data.complianceTools}
                className="react-select default"
                classNamePrefix="react-select"
                onChange={handleChange}
                options={toolKits.map((toolKit) => ({
                  value: toolKit.name,
                  label: toolKit.name,
                }))}
                isMulti
              />
            )}
          </React.Fragment>
        )}
        <ImsInputSelect
          isMulti
          label="Select owners"
          name="owners"
          value={data.owners}
          className="react-select default"
          classNamePrefix="react-select"
          onChange={handleChange}
          options={users.map((user) => ({
            value: user._id,
            label: user.name,
          }))}
        />
        <ImsInputCheck
          checked={data.shouldAuthorise}
          label="Send this document for authorisation"
          name="shouldAuthorise"
          value={data.shouldAuthorise}
          onChange={handleChange}
          error={errors.shouldAuthorise}
        />
        {data.shouldAuthorise && (
          <ImsInputSelect
            isMulti
            label="Select authorisers"
            name="authorisation"
            value={data.authorisation}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={users.map((user) => ({
              value: user._id,
              label: user.name,
            }))}
          />
        )}
        <Button
          disabled={validate() ? true : isBusy}
          className="btn-block"
          color="primary"
          onClick={(e) => {
            handleSubmit(e, () => {
              onSubmit(data);
            });
          }}
        >
          {isBusy ? "... ..." : "Upload File"}
        </Button>
      </Form>
    </React.Fragment>
  );
};

export default UploadFileForm;
