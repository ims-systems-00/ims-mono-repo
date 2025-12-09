import format from "date-fns/format";
import getDay from "date-fns/getDay";
import enGb from "date-fns/locale/en-GB";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import React from "react";
import { dateFnsLocalizer } from "react-big-calendar";
import { getEvents, mapToCalenderFormat } from "@/services/calenderServices";
import { imsLogger } from "@/services/loggerService";

export default function useCalenderStore(config) {
  // const localizer = momentLocalizer(moment);
  const locales = {
    "en-GB": enGb,
  };
  const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
  });
  const [events, setEvents] = React.useState([]);
  const [openEventModel, setOpenEventModal] = React.useState(false);
  const [openEditEventModel, setEditEventModal] = React.useState(false);
  const [slotInfo, setSlotInfo] = React.useState({});
  const [event, setEvent] = React.useState(null);
  const selectedEvent = (event) => setEvent(event);
  React.useEffect(() => {
    async function fetchData() {
      try {
        let { data } = await getEvents();
        setEvents(data.calenderEvents.map((e) => mapToCalenderFormat(e)));
      } catch (ex) {
        imsLogger("Calendar", ex, ex.response);
      }
    }
    fetchData();
  }, []);
  const toggleEditEventModal = () => setEditEventModal(!openEditEventModel);
  const toggleOpenEventModel = () => setOpenEventModal(!openEventModel);
  const eventColors = (event, start, end, isSelected) => {
    var backgroundColor = "event-";
    event.color
      ? (backgroundColor = backgroundColor + event.color)
      : (backgroundColor = backgroundColor + "default");
    return {
      className:
        event.color === "default" || !event.color
          ? "bg-secondary"
          : backgroundColor,
    };
  };
  return {
    events,
    setEvents,
    openEventModel,
    toggleOpenEventModel,
    openEditEventModel,
    toggleEditEventModal,
    slotInfo,
    setSlotInfo,
    event,
    setEvent,
    selectedEvent,
    eventColors,
    localizer,
  };
}
