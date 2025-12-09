import useForm from "@/hooks/useForm";
import useDataProcessing from "@/hooks/useProcessing";
import useTime from "@/hooks/useTimeStops";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
  Row,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React from "react";
import { createEvent } from "@/services/calenderServices";
import { imsLogger } from "@/services/loggerService";
import { handleUpload, linkGenerator } from "@/utils/formatLinkGenerator";
import IVal from "@/validations/validator";
import { ImsTextEditor } from "@/views/shared/ImsFormElements/Index";
import NotificationContext from "../../contexts/notificationContext";
import { useCalender } from "./store";

const EventModal = ({ openEventModel }) => {
  let notify = React.useContext(NotificationContext);
  let { getTimeStops } = useTime();
  let { processing, setProcessing, btnProcessing } = useDataProcessing(false);
  let { toggleOpenEventModel, slotInfo, setEvents } = useCalender();

  // defination of dataSet ...
  let dataSet = {
    data: {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
    },
    errors: {},
  };
  // Validation rules ....
  const schema = {
    title: IVal.string().required().label("Name"),
    description: IVal.label("Message"),
    startTime: IVal.label("time"),
    endTime: IVal.label("time"),
  };

  // submission logic to sever goes here ...
  let doSubmit = async () => {
    let { data } = dataModel;
    let event = {
      title: data.title,
      resource: {
        description: data.description,
      },
      start: new Date(
        `${moment(slotInfo.start).format("M/D/Y")} ${data.startTime}`
      ),
      end: new Date(`${moment(slotInfo.end).format("M/D/Y")} ${data.endTime}`),
    };
    try {
      setProcessing(true);
      let createdEvent = (
        await createEvent({ ...event, description: data.description })
      ).data;
      event.resource._id = createdEvent.calenderEvent._id;
      toggleOpenEventModel();
      setEvents((events) => [...events, event]);
      setDataModel(dataSet);
      notify("Event added successfully ", "success");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        imsLogger("CreateEventModal", ex, ex.response);
        notify("Could not add the event", "danger");
      } else {
        notify("Could not add the report", "danger");
      }
      toggleOpenEventModel();
    }
    setProcessing(false);
  };
  const { dataModel, handleChange, handleSubmit, validate, setDataModel } =
    useForm(dataSet, schema);
  let { data, errors } = dataModel;

  // **** Need to handle with useForm hook. For high priority keeping it as before ***
  return (
    <>
      <Modal isOpen={openEventModel} toggle={toggleOpenEventModel}>
        <ModalHeader toggle={toggleOpenEventModel}>Create event</ModalHeader>
        <ModalBody>
          <Form>
            <FormGroup>
              <Label
                style={{
                  fontSize: "16px",
                }}
                className="text-dark"
              >
                Event title
              </Label>
              <Input
                placeholder="Event title"
                type="text"
                onChange={handleChange}
                value={data.title}
                name="title"
              />
            </FormGroup>
            <Row>
              <Col sm="6">
                <FormGroup>
                  <Label
                    style={{
                      fontSize: "16px",
                    }}
                    className="text-dark"
                  >
                    Start time
                  </Label>
                  <Input
                    placeholder="Select time..."
                    type="select"
                    onChange={handleChange}
                    value={data.startTime}
                    name="startTime"
                  >
                    <option key={"Start"} value={""}>
                      {"Start"}
                    </option>
                    {getTimeStops("00:00", "24:00").map((option) => (
                      <option key={option + "s"} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label
                    style={{
                      fontSize: "16px",
                    }}
                    className="text-dark"
                  >
                    End time
                  </Label>
                  <Input
                    placeholder="Select time..."
                    type="select"
                    onChange={handleChange}
                    value={data.endTime}
                    name="endTime"
                  >
                    <option key={"End"} value={""}>
                      {"End"}
                    </option>
                    {getTimeStops("00:00", "24:00").map((option) => (
                      <option key={option + "e"} value={option}>
                        {option}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            <ImsTextEditor
              label="Description"
              name="description"
              placeholder={"Add a description."}
              mediaLinkGeneratorFn={linkGenerator}
              onEachFileSelection={handleUpload}
              value={data?.description}
              onChange={handleChange}
              error={errors.description}
            />

            <Button
              color="primary"
              type="button"
              onClick={(e) => {
                handleSubmit(e, doSubmit);
              }}
              disabled={validate() ? true : false}
            >
              {processing ? btnProcessing() : "Create"}
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default EventModal;
