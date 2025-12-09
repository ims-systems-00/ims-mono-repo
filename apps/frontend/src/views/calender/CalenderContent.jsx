import React from "react";
import { Calendar as BigCalendar } from "react-big-calendar";
import CreateEventModal from "./CreateEventModal";
import EditEventModal from "./EditEventModal";
import { useCalender } from "./store";
import Box from "@/components/Box/Index";

const CalenderContent = ({ children }) => {
  const {
    events,
    openEventModel,
    toggleOpenEventModel,
    openEditEventModel,
    toggleEditEventModal,
    setSlotInfo,
    selectedEvent,
    eventColors,
    localizer,
  } = useCalender();
  return (
    <Box height="100vh">
      <BigCalendar
        selectable
        localizer={localizer}
        events={events}
        defaultView="month"
        scrollToTime={new Date(1970, 1, 1, 6)}
        defaultDate={new Date()}
        onSelectEvent={(event) => {
          selectedEvent(event);
          toggleEditEventModal();
        }}
        on
        onSelectSlot={(slotInfo) => {
          setSlotInfo(slotInfo);
          toggleOpenEventModel();
        }}
        eventPropGetter={eventColors}
      />
      <CreateEventModal openEventModel={openEventModel} />
      <EditEventModal openEditEventModel={openEditEventModel} />
    </Box>
  );
};

export default CalenderContent;
