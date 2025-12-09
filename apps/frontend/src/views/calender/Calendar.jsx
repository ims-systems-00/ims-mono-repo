import React from "react";
import CalenderContent from "./CalenderContent";
import { CalenderContextProvider } from "./store";
const Calendar = () => {
  // Need to change the whole calendar soon
  return (
    <CalenderContextProvider>
      <div className="content">
        <CalenderContent />
      </div>
    </CalenderContextProvider>
  );
};

export default Calendar;
