import { Button, Col, Form, Row } from "@ims-systems-00/ims-ui-kit";
import React from "react";
import IVal from "@/validations/validator";

import NotificationContext from "@/contexts/notificationContext";
import useForm from "@/hooks/useForm";
import { sendCqcNotice } from "@/services/cqcServices";
import { imsLogger } from "@/services/loggerService";
import { ImsInputSelect, ImsInputText } from "@ims-systems-00/ims-ui-kit";
import ACTIONS from "./actions";

const CQCNotice = ({
  overview,
  addToCqcNoticeTable,
  processing,
  dispatch,
  ...props
}) => {
  let notify = React.useContext(NotificationContext);
  const dataSet = {
    data: {
      title: "",
      audience: {
        value: "All users",
        label: "All users",
      },
      message: "",
    },
    errors: {},
  };
  const schema = {
    title: IVal.string().required().label("Title"),
    message: IVal.string().required().max(150).label("Message"),
    audience: IVal.object().keys({
      value: IVal.string().required().label("Audience"),
      label: IVal.string().required().label("Audience"),
    }),
  };
  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    try {
      switch (submissionType) {
        case "confirm": {
          dispatch({
            [ACTIONS.ADD_COMMUNICATE]: { status: true, error: false, id: null },
          });
          let { data } = await sendCqcNotice(dataModel.data, {
            query: `group=${props.match.params.groupId}&id=${props.match.params.id}`,
          });
          addToCqcNoticeTable && addToCqcNoticeTable(data.notification);
          notify(
            `Communication sent to ${overview.group.name} successfully`,
            "success"
          );
          dispatch({
            [ACTIONS.ADD_COMMUNICATE]: {
              status: false,
              error: false,
              id: null,
            },
          });
          break;
        }
      }
    } catch (ex) {
      dispatch({
        [ACTIONS.ADD_COMMUNICATE]: { status: false, error: true, id: null },
      });
      imsLogger("CQCNotice", ex.response || ex);
      notify("Notification send failed", "danger");
    }
    dispatch({ action: null, id: null });
  };
  const { dataModel, handleChange, handleSubmit, validate } = useForm(
    dataSet,
    schema
  );
  let { data, errors } = dataModel;
  return (
    <div>
      <Form action="/" className="form-horizontal" onSubmit={handleSubmit}>
        <Row>
          <Col md="6">
            <ImsInputText
              label="Title"
              name="title"
              placeholder="Title"
              value={data.title}
              onChange={handleChange}
              error={errors.title}
            />
          </Col>
          <Col md="6">
            <ImsInputSelect
              placeholder="Selelect audience"
              name="audience"
              label="Audience"
              icon="icon-app"
              className="react-select default"
              classNamePrefix="react-select"
              error={errors.audience}
              value={data.audience}
              onChange={handleChange}
              options={["All users", "Head of services"].map((item) => ({
                value: item,
                label: item,
              }))}
            />
          </Col>
        </Row>

        <ImsInputText
          label="Message"
          name="message"
          placeholder="Message"
          type="textarea"
          rows="5"
          value={data.message}
          onChange={handleChange}
          error={errors.message}
        />

        <Row>
          <Col sm="2"></Col>
          <Col sm="7">
            <Button
              name="confirm"
              onClick={(e) => handleSubmit(e, doSubmit)}
              disabled={
                validate() ? true : processing[ACTIONS.ADD_COMMUNICATE].status
              }
              className="btn-fill"
              color="primary"
              type="button"
            >
              {processing[ACTIONS.ADD_COMMUNICATE].status
                ? "Processing"
                : "Send"}
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default CQCNotice;
