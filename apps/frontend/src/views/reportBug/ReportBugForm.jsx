import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import useUsers from "@/hooks/useUsers";
import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import { imsLogger } from "@/services/loggerService";
import { reportBug } from "@/services/reportABugServices";
import IVal from "@/validations/validator";
import { ImsButtonGroup } from "@/views/shared/ImsFormElements/Index";
import { ImsInputSelect, ImsInputText } from "@ims-systems-00/ims-ui-kit";

const ReportBugForm = ({ processing, setProcessing }) => {
  let { users, lazyLoadUsers } = useUsers();
  const dataSet = {
    data: {
      title: "",
      description: "",
      category: {
        value: null,
        label: "Select a category",
      },
    },
    errors: {},
  };
  const schema = {
    title: IVal.string().required().min(8).label("Title"),
    description: IVal.string().required().label("Description"),
    category: IVal.object().keys({
      value: IVal.string().required().label("Category"),
      label: IVal.label("Category"),
    }),
  };
  let notify = React.useContext(NotificationContext);
  const {
    dataModel,
    handleChange,
    handleSubmit,
    validate,
    handleFileChange,
    hasUnsavedData,
  } = useForm(dataSet, schema);

  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "create": {
          setProcessing({ action: "create", id: null });
          let { data } = await reportBug(dataModel.data);
          notify(
            "Your response has been recorded. One of the iMS systems administrator will contact you soon",
            "success"
          );
          imsLogger("IncidentForm", data.incident);
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      imsLogger(ex.response || ex);
      notify("Unknown server error occurred", "danger");
    }
    setProcessing({ action: null, id: null });
  };

  React.useEffect(() => {
    lazyLoadUsers();
  }, []);

  let { data, errors } = dataModel;

  return (
    <Form action="/" className="form-horizontal" method="get">
      <Row>
        <Col md="6">
          <ImsInputSelect
            label="Category"
            name="category"
            value={data.category}
            className="react-select default"
            classNamePrefix="react-select"
            onChange={handleChange}
            options={["Bug", "Feature request", "Enhancement", "Question"].map(
              (value) => ({
                value: value,
                label: value,
              })
            )}
          />
        </Col>
        <Col md="6">
          <ImsInputText
            label="Title"
            name="title"
            value={data.title}
            onChange={handleChange}
            error={errors.title}
            placeholder="Title"
          />
        </Col>
      </Row>

      <ImsInputText
        label="Description"
        placeholder="Description"
        type="textarea"
        rows="14"
        name="description"
        value={data.description}
        onChange={handleChange}
        error={errors.description}
        mentionSuggestions={users}
      />
      <ImsButtonGroup>
        <Button
          name="create"
          onClick={(e) => handleSubmit(e, doSubmit)}
          disabled={validate() ? true : processing.action === "create"}
          className="btn-fill"
          color="primary"
          type="button"
        >
          {processing.action === "create" ? "Processing" : "Create"}
        </Button>
      </ImsButtonGroup>
    </Form>
  );
};

export default ReportBugForm;
