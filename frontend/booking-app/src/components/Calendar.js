import React from "react";
import FullCalendar from "@fullcalendar/react";
import huLocale from "@fullcalendar/core/locales/hu";
import { useRef, useEffect } from "react";
import timeGridPlugin from "@fullcalendar/timegrid";
import moment from "moment";

const Calendar = ({ events, passEventClick }) => {
  const calendarRef = useRef(null);
  const scrollTime = moment().format("HH") + ":00:00";

  useEffect(() => {
    clearAllEvents();
    if (events !== null)
      events.forEach((event) => {
        const eventToSet = {
          id: event.id,
          title: event.title,
          start: moment
            .utc(event.startDateTime)
            .format("YYYY-MM-DDTHH:mm")
            .toString(),
          end: moment
            .utc(event.endDateTime)
            .format("YYYY-MM-DDTHH:mm")
            .toString(),
          navURL: `/event/${event.id}`,
        };
        onEventAdded(eventToSet);
      });
  }, [events]);

  const onEventAdded = (event) => {
    let calendarAPI = calendarRef.current.getApi();
    calendarAPI.addEvent(event);
  };

  const clearAllEvents = () => {
    let calendarAPI = calendarRef.current.getApi();
    calendarAPI.removeAllEvents();
  };

  const handleEventClick = (eventClickInfo) => {
    passEventClick(eventClickInfo);
  };

  return (
    <section className="calendar-section">
      <FullCalendar
        ref={calendarRef}
        plugins={[timeGridPlugin]}
        initialView="timeGridWeek"
        allDaySlot={false}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridWeek,timeGridDay",
        }}
        locale={huLocale}
        eventClick={handleEventClick}
        slotMinTime={"07:00:00"}
        slotMaxTime={"20:00:00"}
        contentHeight={440}
        nowIndicator={true}
        scrollTime={scrollTime}
      />
    </section>
  );
};

export default Calendar;
