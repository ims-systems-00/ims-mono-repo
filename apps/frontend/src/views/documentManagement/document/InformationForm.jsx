import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { Button, Form, ImsInputSelect } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import IVal from "@/validations/validator";
import { applicableModulesOptions } from "@/views/utils/constants";

const InformationForm = ({ node, toolKits, onSubmit = function () {} }) => {
  const { users, lazyLoadUsers } = useUsers();
  const dataSet = {
    data: {
      purpose: {
        value: node?.documentData?.purpose || null,
        label: node?.documentData?.purpose || "Select purpose of the document",
      },
      applicableModules: applicableModulesOptions.filter((m) => {
        return node?.documentData?.applicableModules?.includes(m.value);
      }),
      complianceTools: node?.documentData?.complianceTools
        .filter((attendee) => attendee)
        .map((attendee) => ({ value: attendee, label: attendee })),
      owners: node?.documentData?.owners
        .filter((owner) => owner)
        .map((owner) => ({ value: owner._id, label: owner.name })),
    },
    errors: {},
  };
  const schema = {
    purpose: IVal.object().keys({
      value: IVal.string().required().label("Purpose"),
      label: IVal.label("Purpose"),
    }),
    applicableModules: IVal.array()
      .items(
        IVal.object().keys({
          value: IVal.string().required().label("Purpose"),
          label: IVal.label("Purpose"),
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
  };
  const { dataModel, isBusy, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  React.useEffect(() => {
    lazyLoadUsers();
  }, []);
  let { data, errors } = dataModel;
  return (
    <React.Fragment>
      {node && <h5 className="text-center mt-2 mb-2">Document information</h5>}

      <Form style={{ minHeight: "280px" }}>
        <React.Fragment>
          <ImsInputSelect
            label="Purpose"
            name="purpose"
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
          <ImsInputSelect
            isMulti
            label="Select owner(s)"
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
        <Button
          size="sm"
          className="btn btn-simple"
          color="primary"
          disabled={validate() ? true : isBusy}
          onClick={(e) => {
            handleSubmit(e, () => onSubmit({ ...data }), false);
          }}
          block
        >
          {isBusy ? "... ..." : "Update"}
        </Button>
      </Form>
    </React.Fragment>
  );
};

export default InformationForm;
