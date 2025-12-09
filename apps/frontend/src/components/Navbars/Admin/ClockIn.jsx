import NotificationContext from "@/contexts/notificationContext";
import { SuperGlobalContext } from "@/contexts/SuperGlobalContext";
import useAlerts from "@/hooks/useAlerts";
import useForm from "@/hooks/useForm";
import useProcessingControl from "@/hooks/useProcessingControl";
import {
  Button,
  Form,
  Modal,
  ModalBody,
  ModalHeader,
} from "@ims-systems-00/ims-ui-kit";
import moment from "moment";
import React, { useContext } from "react";
import { getCurrentSessionData } from "@/services/authService";
import { imsLogger } from "@/services/loggerService";
import {
  getUserWithBasicInfo,
  refreshProfileCache,
} from "@/services/userServices";
import {
  clockIn,
  clockOut,
  toggleStatus,
} from "@/services/wallet/worklogServices";
import msToTime from "@/utils/timeConverter";
import IVal from "@/validations/validator";
import {
  ImsFormSectionDevider,
  ImsInputCheck,
} from "@/views/shared/ImsFormElements/Index";
import { ImsInputSelect, ImsInputText } from "@ims-systems-00/ims-ui-kit";
import USER_ACTIONS from "./actions";

const Clockin = ({ openClockIn, toggleModalClockIn }) => {
  let notify = useContext(NotificationContext);
  const dataSet = {
    data: {
      isRemote: false,
      location: {
        value: null,
        label: "Select your working location",
      },
      priorities: "",
      achievements: "",
    },
    errors: {},
  };
  const schema = {
    isRemote: IVal.boolean().label("Remote"),
    location: IVal.object().keys({
      value: IVal.label("Location"),
      label: IVal.label("Location"),
    }),
    priorities: IVal.string().required().label("Priority"),
    achievements: IVal.label("Achievements"),
  };
  const { dataModel, handleChange, handleSubmit } = useForm(dataSet, schema);
  const { workLog, profileInfo } = useContext(SuperGlobalContext);
  let { processing, dispatch } = useProcessingControl([
    { action: USER_ACTIONS.CLOCK_IN },
    { action: USER_ACTIONS.CLOCK_OUT },
    { action: USER_ACTIONS.PAUSE_UNPAUSE },
  ]);
  let { alert, successAlert, failedAlert } = useAlerts();
  let [currentLog, setCurrentLog] = React.useState(workLog);
  let [isClockedIn, setIsClockedIn] = React.useState(
    profileInfo?.shift?.status
  );
  async function fetchProfileInfo() {
    try {
      let { data } = await getUserWithBasicInfo(
        getCurrentSessionData()?.user?._id
      );
      refreshProfileCache(data.user);
      setIsClockedIn(data.user?.shift?.status);
    } catch (ex) {
      imsLogger(ex.response || ex);
    }
  }

  React.useEffect(() => {
    fetchProfileInfo();
  }, [profileInfo]);
  async function handleClockIn() {
    try {
      dispatch({
        [USER_ACTIONS.CLOCK_IN]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await clockIn(dataModel.data);
      setCurrentLog(data.worklog);
      setIsClockedIn("Clocked in");
      dispatch({
        [USER_ACTIONS.CLOCK_IN]: { status: false, error: false, id: null },
      });
      successAlert(
        `You have clocked in at ${moment(new Date()).format(
          "DD/MM/YYYY hh:mm"
        )}.`
      );
    } catch (ex) {
      // notify("");
      dispatch({
        [USER_ACTIONS.CLOCK_IN]: { status: false, error: true, id: null },
      });
      imsLogger(ex.response || ex);
    }
  }
  async function handleClockOut() {
    try {
      dispatch({
        [USER_ACTIONS.CLOCK_OUT]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await clockOut(dataModel.data);
      setCurrentLog(data.worklog);
      setIsClockedIn("Clocked out");
      dispatch({
        [USER_ACTIONS.CLOCK_OUT]: { status: false, error: false, id: null },
      });
      successAlert(
        `You have clocked out at ${moment(new Date()).format(
          "DD/MM/YYYY hh:mm"
        )}.`
      );
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.CLOCK_OUT]: { status: false, error: true, id: null },
      });
      imsLogger(ex.response || ex);
    }
  }
  async function handlePauseUnpause(status) {
    try {
      dispatch({
        [USER_ACTIONS.PAUSE_UNPAUSE]: {
          status: true,
          error: false,
          id: null,
        },
      });
      let { data } = await toggleStatus();
      setCurrentLog(data.worklog);
      setIsClockedIn(status);
      dispatch({
        [USER_ACTIONS.PAUSE_UNPAUSE]: { status: false, error: false, id: null },
      });
    } catch (ex) {
      dispatch({
        [USER_ACTIONS.PAUSE_UNPAUSE]: { status: false, error: true, id: null },
      });
      imsLogger(ex.response || ex);
    }
  }
  let { data, errors } = dataModel;
  let timeClockedIn = () => {
    let currentTimeStamp = new Date();
    let startingTimeStamp = new Date(currentLog && currentLog?.startTime);
    return msToTime(currentTimeStamp.getTime() - startingTimeStamp.getTime());
  };
  return (
    <>
      {alert}
      <Modal isOpen={openClockIn} toggle={toggleModalClockIn}>
        <ModalHeader toggle={toggleModalClockIn}>Work log</ModalHeader>
        <ModalBody>
          <Form>
            {isClockedIn === "Clocked out" ? (
              <>
                <span className="text-left pb-2 font-size-subtitle-2">
                  {getCurrentSessionData()?.user?.name}, would you like to clock
                  in to capture your work log?`
                </span>
                <ImsInputSelect
                  label="Location"
                  name="location"
                  value={data.location}
                  className="react-select default"
                  classNamePrefix="react-select"
                  onChange={handleChange}
                  options={
                    dataModel.data.isRemote
                      ? profileInfo?.locations
                          .filter((location) => location.type === "Remote")
                          .map((location) => ({
                            value: location.address,
                            label: location.address,
                          }))
                      : profileInfo?.locations
                          .filter((location) => location.type === "On-site")
                          .map((location) => ({
                            value: location.address,
                            label: location.address,
                          }))
                  }
                />
                <ImsInputText
                  label="Priority"
                  placeholder="Priority"
                  type="textarea"
                  rows="6"
                  name="priorities"
                  mandatory={true}
                  value={data.priorities}
                  onChange={handleChange}
                  error={errors.priorities}
                />

                <ImsInputCheck
                  label="Working remote"
                  name="isRemote"
                  value={data.isRemote}
                  checked={data.isRemote}
                  onChange={handleChange}
                  error={errors.isRemote}
                />
                <span className="text-left pb-2">
                  Line managers are allowed to review your worklogs from your
                  wallet.
                </span>
              </>
            ) : (
              isClockedIn === "Clocked in" && (
                <>
                  <span className="text-center">
                    {getCurrentSessionData()?.user?.name}, don't forget to log
                    your achievements for the day.{" "}
                  </span>
                  <ImsFormSectionDevider
                    label="Worklog"
                    deviderText={`You have been clocked in for ${
                      timeClockedIn().hours
                    } hr ${timeClockedIn().minutes} min`}
                  />
                  <ImsInputText
                    label="Achievements"
                    placeholder="Would you like to note today's achievements?"
                    type="textarea"
                    rows="6"
                    name="achievements"
                    value={data.achievements}
                    onChange={handleChange}
                    error={errors.achievements}
                  />
                </>
              )
            )}
            <div className="text-right mb-3">
              {isClockedIn === "Clocked out" ? (
                <Button
                  onClick={(e) => handleSubmit(e, handleClockIn)}
                  color="success"
                  size="sm"
                  className="btn-block "
                  disabled={processing[USER_ACTIONS.CLOCK_IN].status}
                >
                  {processing[USER_ACTIONS.CLOCK_IN].status ? (
                    "Processing"
                  ) : (
                    <>
                      <i className="tim-icons icon-triangle-right-17" /> Clock
                      in
                    </>
                  )}
                </Button>
              ) : (
                <>
                  {isClockedIn === "Resume" || isClockedIn === "Clocked in" ? (
                    <Button
                      onClick={() => handlePauseUnpause("Paused")}
                      size="sm"
                      className="btn-simple "
                      disabled={processing[USER_ACTIONS.PAUSE_UNPAUSE].status}
                    >
                      {processing[USER_ACTIONS.PAUSE_UNPAUSE].status ? (
                        "Processing"
                      ) : (
                        <>
                          <i className="tim-icons icon-button-pause" /> Pause
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handlePauseUnpause("Resume")}
                      size="sm"
                      className="btn-simple "
                      disabled={processing[USER_ACTIONS.PAUSE_UNPAUSE].status}
                    >
                      {processing[USER_ACTIONS.PAUSE_UNPAUSE].status ? (
                        "Processing"
                      ) : (
                        <>
                          <i className="tim-icons icon-triangle-right-17" />{" "}
                          Resume
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    onClick={(e) => handleClockOut()}
                    color="danger"
                    size="sm"
                    className="btn-simple "
                    disabled={processing[USER_ACTIONS.CLOCK_OUT].status}
                  >
                    {processing[USER_ACTIONS.CLOCK_OUT].status ? (
                      "Processing"
                    ) : (
                      <>
                        <i className="fas fa-solid fa-stop" /> Clock out
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Clockin;
