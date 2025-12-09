import { ViewContext } from "@/components/SwitchableView/contexts/ViewContext";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import NotificationContext from "@/contexts/notificationContext";
import useAccess from "@/hooks/useAccess";
import useCustomers from "@/hooks/useCustomers";
import useDebounce from "@/hooks/useDebounce";
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
import { mapToCampaignModel } from "@/services/emailCampaignServices";
import IVal from "@/validations/validator";
import {
  ImsButtonGroup,
  ImsInputDropZone,
} from "@/views/shared/ImsFormElements/Index";

const targets = [
  { value: "Prospect", label: "Prospect" },
  { value: "Warm lead", label: "Warm lead" },
  { value: "Qualified", label: "Qualified" },
  { value: "Proposal", label: "Proposal" },
  { value: "Live", label: "Live" },
];

const CampaignForm = ({
  visitingCampaign: currentData,
  drawView,
  onSubmit = () => {},
  onCreateAndSend = () => {},
  onUpdateAndSend = () => {},
  onCloseCampaign = () => {},
}) => {
  let [searchString, setSearchString] = React.useState("");
  const debouncedSearchString = useDebounce(searchString, 500);
  let { authGlobalAccess } = useAccess();
  const dataSet = currentData
    ? mapToCampaignModel(currentData)
    : {
        data: {
          group: {
            value: null,
            label: "Select Business unit",
          },
          customAudience: [],
          target: [],
          name: "",
          bundle: null,
          subject: "",
          body: "",
          attachments: [],
        },
        errors: {},
      };

  const schema = {
    group: IVal.object().keys({
      value: IVal.label("Business unit"),
      label: IVal.label("Business unit"),
    }),
    customAudience: IVal.array().label("Attendees"),
    name: IVal.string().required().label("name"),
    bundle: IVal.label("Bundle"),
    target: IVal.array().label("Attendees"),
    subject: IVal.string().required().label("Subject"),
    body: IVal.string().required().label("Body"),
    attachments: IVal.label("Attachments"),
  };

  let notify = useContext(NotificationContext);
  const { groups } = useContext(SuperGlobalContext);
  const viewContextData = useContext(ViewContext);
  const history = useHistory();
  const {
    dataModel,
    handleChange,
    handleSubmit,
    validate,
    confirmation,
    handleFileChange,
    isBusy,
  } = useForm(dataSet, schema);

  let { data, errors } = dataModel;

  let { customers, loadCustomers } = useCustomers();

  let { users, lazyLoadUsers } = useUsers();
  React.useEffect(() => {
    lazyLoadUsers();
  }, []);

  React.useEffect(() => {
    /**
     * Please do not use any dependency in this effect. This should only
     * work as a component did mount function. Otherwise will misbehave.
     */
    if (debouncedSearchString)
      loadCustomers({ clientSearch: debouncedSearchString });
  }, [debouncedSearchString]);

  return (
    <>
      {confirmation}
      <Form action="/" className="form-horizontal" method="get">
        <Row>
          <Col md="6">
            <ImsInputText
              label="Campaign name"
              placeholder="Name"
              name="name"
              disabled={currentData}
              value={data.name}
              onChange={handleChange}
              error={errors.name}
            />
          </Col>
          <Col md="6">
            <ImsInputSelect
              label={authGlobalAccess() ? "Business unit" : "Business unit"}
              name="group"
              value={data.group}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={groups.map((group) => ({
                value: group._id,
                label: group.name,
              }))}
            />
          </Col>
          <Col md="6">
            <ImsInputSelect
              isMulti
              placeholder="Target audience"
              label="Target audience"
              name="target"
              value={data.target}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              options={targets.map((target) => ({
                value: target.value,
                label: target.label,
              }))}
            />
          </Col>
          <Col md="6">
            <ImsInputSelect
              isMulti
              placeholder="Additional audience"
              label="Additional audience"
              name="customAudience"
              value={data.customAudience}
              className="react-select default"
              classNamePrefix="react-select"
              onChange={handleChange}
              onInputChange={setSearchString}
              options={customers.map((customer) => ({
                value: customer._id,
                label: `${customer.reference} ${customer.name}`,
              }))}
            />
          </Col>
        </Row>

        <ImsInputText
          label="Subject"
          placeholder="Subject"
          name="subject"
          value={data.subject}
          onChange={handleChange}
          error={errors.subject}
        />
        <ImsInputText
          label="Dear [primary/secondary contact],"
          name="body"
          placeholder="i.e. I hope this message finds you well. I am writing to inform you about..."
          value={data.body}
          onChange={handleChange}
          error={errors.body}
          type="textarea"
          rows="10"
          mentionSuggestions={users}
        />

        <ImsInputDropZone
          label="Attachments"
          clearAll={!data.attachments.length}
          name="tasks"
          onLoad={(files) => handleFileChange(files, "attachments")}
        />
        <ImsButtonGroup>
          {currentData ? (
            <>
              <Button
                name="updateAndSend"
                onClick={(e) => {
                  handleSubmit(
                    e,
                    () => onUpdateAndSend(dataModel.data),
                    false,
                    {
                      confirmation: true,
                      confirmationMessage:
                        currentData.status === "Draft"
                          ? "This campaign will be launched."
                          : "A new instance of current campaign will be launched with a different reference",
                    }
                  );
                }}
                disabled={
                  validate()
                    ? true
                    : dataModel.data.target.length === 0 &&
                      dataModel.data.customAudience.length === 0
                    ? true
                    : isBusy
                }
                className="btn-fill"
                color="primary"
                type="button"
              >
                {isBusy ? "Processing" : "Launch modified campaign"}
              </Button>
            </>
          ) : (
            <Button
              name="createAndSend"
              onClick={(e) => {
                handleSubmit(e, () => onCreateAndSend(dataModel.data), true, {
                  confirmation: true,
                  confirmationMessage: "A campaign will be launched",
                });
              }}
              disabled={
                validate()
                  ? true
                  : dataModel.data.target.length === 0 &&
                    dataModel.data.customAudience.length === 0
                  ? true
                  : isBusy
              }
              className="btn-fill"
              color="primary"
              type="button"
            >
              {isBusy ? "Processing" : "Launch campaign"}
            </Button>
          )}
          {currentData ? (
            <>
              <Button
                name="update"
                onClick={(e) => {
                  handleSubmit(e, () => onSubmit(dataModel.data), false, {
                    confirmation: true,
                    confirmationMessage:
                      "A new instance of current campaign will be saved with a different reference",
                  });
                }}
                disabled={
                  validate()
                    ? true
                    : dataModel.data.target.length === 0 &&
                      dataModel.data.customAudience.length === 0
                    ? true
                    : isBusy
                }
                className="btn-fill"
                color="info"
                type="button"
              >
                {isBusy ? "Processing" : "Save modified campaign"}
              </Button>
              <Button
                name="close"
                onClick={(e) => {
                  handleSubmit(
                    e,
                    () => onCloseCampaign(dataModel.data),
                    false,
                    {
                      confirmation: true,
                      confirmationMessage: "This campaign will be closed",
                    }
                  );
                }}
                disabled={
                  validate()
                    ? true
                    : dataModel.data.target.length === 0 &&
                      dataModel.data.customAudience.length === 0
                    ? true
                    : isBusy
                }
                className="btn-fill"
                color="primary"
                type="button"
              >
                {isBusy ? "Processing" : "Close campaign"}
              </Button>
            </>
          ) : (
            <Button
              name="save"
              onClick={(e) => {
                handleSubmit(e, () => onSubmit(dataModel.data));
              }}
              disabled={
                validate()
                  ? true
                  : /**
                   * When validation is added properly remove this logic of diable.
                   */
                  dataModel.data.target.length === 0 &&
                    dataModel.data.customAudience.length === 0
                  ? true
                  : isBusy
              }
              className="btn-fill"
              color="primary"
              type="button"
            >
              {isBusy ? "Processing" : "Save"}
            </Button>
          )}
        </ImsButtonGroup>
      </Form>
    </>
  );
};

export default CampaignForm;
