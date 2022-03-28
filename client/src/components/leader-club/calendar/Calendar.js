import React, { useState, useContext, useEffect } from "react";
import "./Calendar.css";
import { getMonth } from "../../../util";
import CalendarHeader from "../calendar/CalendarHeader";
import Sidebar from "../calendar/Sidebar";
import Month from "../calendar/Month";
import GlobalContext from "../../../context/GlobalContext";
import EventModal from "../calendar/EventModal";
function Calendar() {
  const [currenMonth, setCurrentMonth] = useState(getMonth());
  const { monthIndex, showEventModal } = useContext(GlobalContext);

  useEffect(() => {
    setCurrentMonth(getMonth(monthIndex));
  }, [monthIndex]);

  return (
    <div className="body-calendar">
    <React.Fragment>
      {showEventModal && <EventModal />}

      <div className="h-screen flex flex-col">
        <CalendarHeader />
        <div className="flex flex-1">
          <Sidebar />
          <Month month={currenMonth} />
        </div>
      </div>
    </React.Fragment>
    </div>
  );
}

export default Calendar;
