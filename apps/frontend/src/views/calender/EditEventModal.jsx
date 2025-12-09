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
import {
  deleteEvent,
  mapToCalenderEventModel,
  updateCalenderEvent,
} from "@/services/calenderServices";
import { imsLogger } from "@/services/loggerService";
import { handleUpload, linkGenerator } from "@/utils/formatLinkGenerator";
import IVal from "@/validations/validator";
import { ImsTextEditor } from "@/views/shared/ImsFormElements/Index";
import NotificationContext from "../../contexts/notificationContext";
import { useCalender } from "./store";

const EventModal = ({ openEditEventModel }) => {
  let { event, setEvent, setEvents, toggleEditEventModal } = useCalender();
  let notify = React.useContext(NotificationContext);
  let { getTimeStops } = useTime();
  let { processing, setProcessing, btnProcessing } = useDataProcessing(false);
  // defination of dataSet ...
  let dataSet = event
    ? mapToCalenderEventModel(event)
    : {
        data: {
          title: "",
          description: "",
          startTime: "",
          endTime: "",
        },
        errors: {},
      };

  // Validation rules ...
  const schema = {
    title: IVal.string().required().label("Name"),
    description: IVal.label("Message"),
    startTime: IVal.label("time"),
    endTime: IVal.label("time"),
  };

  // submission logic to sever goes here ...
  let doSubmit = async (e) => {
    let submissionType = e.target.name;
    let { data } = dataModel;
    let updateEvent = {
      title: data.title,
      resource: {
        _id: event.resource._id,
        description: data.description,
        systemEventId: event.resource.systemEventId,
      },
      color: event.color,
      start: new Date(
        `${moment(event.start).format("M/D/Y")} ${data.startTime}`
      ),
      end: new Date(`${moment(event.end).format("M/D/Y")} ${data.endTime}`),
    };
    try {
      switch (submissionType) {
        case "update": {
          setProcessing("update");
          await updateCalenderEvent(event.resource._id, {
            ...updateEvent,
            description: data.description,
          });
          toggleEditEventModal();
          setEvents((events) =>
            events.map((e) =>
              e.resource._id === event.resource._id ? updateEvent : e
            )
          );
          setDataModel(dataSet);
          notify("Event updated successfully ", "success");
          break;
        }
        case "delete": {
          setProcessing("delete");
          await deleteEvent(event.resource._id);
          toggleEditEventModal();
          setEvents((events) =>
            events.filter((e) => e.resource._id !== event.resource._id)
          );
          setDataModel(dataSet);
          notify("Event deleted successfully ", "success");
          break;
        }
        default:
          break;
      }
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        notify("Could not add the event", "danger");
      } else {
        notify("Could not add the event", "danger");
      }
      imsLogger("EditEventModal", ex, ex.response);
      toggleEditEventModal();
    }
    setProcessing(false);
    setEvent(null);
  };

  const { dataModel, handleChange, handleSubmit, validate, setDataModel } =
    useForm(dataSet, schema);
  let { data, errors } = dataModel;

  React.useLayoutEffect(
    () =>
      event
        ? setDataModel(mapToCalenderEventModel(event))
        : setDataModel(dataSet),
    [event]
  );
  return (
    <>
      <Modal
        modalClassName="modal-temp"
        isOpen={openEditEventModel}
        toggle={toggleEditEventModal}
      >
        <ModalHeader toggle={toggleEditEventModal}>Event details</ModalHeader>
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
                onChange={handleChange}
                value={data.title}
                name="title"
                disabled={event && event.resource.systemEventId ? true : false}
              />
            </FormGroup>
            {event && !event.resource.systemEventId && (
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
                      {getTimeStops("00:00", "24:00").map((option) => (
                        <option key={option + "e"} value={option}>
                          {option}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>
            )}
            <ImsTextEditor
              label="Description"
              name="description"
              placeholder={"Add a description."}
              readOnly={event && event.resource.systemEventId ? true : false}
              mediaLinkGeneratorFn={linkGenerator}
              onEachFileSelection={handleUpload}
              value={data?.description}
              onChange={handleChange}
              error={errors.description}
            />

            {event && !event.resource.systemEventId && (
              <React.Fragment>
                <Button
                  color="primary"
                  type="button"
                  onClick={(e) => {
                    handleSubmit(e, doSubmit);
                  }}
                  name="update"
                  disabled={validate() ? true : false}
                >
                  {processing === "update" ? btnProcessing() : "Update"}
                </Button>

                <Button
                  color="primary"
                  type="button"
                  onClick={(e) => {
                    handleSubmit(e, doSubmit);
                  }}
                  name="delete"
                  disabled={validate() ? true : false}
                >
                  {processing === "delete" ? btnProcessing() : "Delete"}
                </Button>
              </React.Fragment>
            )}
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default EventModal;
