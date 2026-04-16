import { Link, useNavigate } from "react-router-dom";
import Calendar from "./Calendar";
import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useInput from "../hooks/useInput";

const EventViewer = () => {
  const navigate = useNavigate();
  const roomOptions = [
    { label: "A-206", value: "A-206" },
    { label: "A-104", value: "A-104" },
    { label: "B-102", value: "B-102" },
  ];
  /*const [roomFilter, setRoomFilter] = useState("A-206");*/
  const [roomFilter, resetRoomFilter, roomFilterAttribs] = useInput(
    "roomFilter",
    "A-206"
  );
  const [events, setEvents] = useState(null);
  const EVENTS_URL = `/events/room/${roomFilter}`;
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axiosPrivate.get(EVENTS_URL);
        setEvents(response.data);
      } catch (error) {}
    };

    fetchEvents();

    return () => {};
  }, [roomFilter]);

  const getEventClickInfo = (data) => {
    handleEventClick(data);
  };

  const handleEventClick = (eventClickInfo) => {
    const navURL = eventClickInfo.event.extendedProps.navURL;
    if (navURL) {
      navigate(navURL, { replace: true });
    }
  };

  return (
    <section className="calendar-section">
      <h1>Teremfoglalások</h1>
      <div>
        <label htmlFor="event-room-filter" className="roomfilter">
          Válassza ki a termet, amelyre meg szeretné tekinteni a foglalásokat:
        </label>
        {"  "}
        <select
          id="event-room-filter"
          required
          /*value={roomFilter}
          onChange={(e) => setRoomFilter(e.target.value)}*/
          {...roomFilterAttribs}
        >
          {roomOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <Calendar events={events} passEventClick={getEventClickInfo} />
      <div className="flexGrow">
        <Link to="/">Kezdőlap</Link>
      </div>
    </section>
  );
};

export default EventViewer;
