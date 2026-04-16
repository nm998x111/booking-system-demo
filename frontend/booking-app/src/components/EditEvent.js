import React, { useRef, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import moment from "moment";
import "moment/locale/hu";
moment.locale("hu");

const EditEvent = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { eventId } = useParams();
  const EVENT_URL = `/events/${eventId}`;
  const EDITEVENT_URL = `/editevent/${eventId}`;

  const [title, setTitle] = useState("");

  const [room, setRoom] = useState("");

  const [startDateTime, setStartDateTime] = useState("");

  const [endDateTime, setEndDateTime] = useState("");

  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosPrivate.get(EVENT_URL);
        setTitle(response.data.title);
        setRoom(response.data.room);
        setStartDateTime(
          moment
            .utc(response.data.startDateTime)
            .format("YYYY-MM-DDTHH:mm")
            .toString()
        );

        setEndDateTime(
          moment
            .utc(response.data.endDateTime)
            .format("YYYY-MM-DDTHH:mm")
            .toString()
        );
        setDescription(response.data.description);
      } catch (error) {}
    };

    fetchEvent();

    return () => {};
  }, [eventId]);

  const roomOptions = [
    { label: "A-206", value: "A-206" },
    { label: "A-104", value: "A-104" },
    { label: "B-102", value: "B-102" },
  ];

  const errRef = useRef();

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        EDITEVENT_URL,
        JSON.stringify({
          eventId,
          title,
          room,
          starts: startDateTime,
          ends: endDateTime,
          desc: description,
        })
      );
      setSuccess(true);
      navigate(`/event/${eventId}`, { replace: true });
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response.status === 409) {
        let responseMsg = JSON.stringify(err.response.data.message);
        responseMsg = responseMsg.slice(1, -1);
        responseMsg = responseMsg.replace(/\\n/g, "\n");
        const startDate = moment
          .utc(JSON.stringify(err.response.data.starts).slice(1, -1))
          .format("YYYY-MM-DD HH:mm");
        const endDate = moment
          .utc(JSON.stringify(err.response.data.ends).slice(1, -1))
          .format("YYYY-MM-DD HH:mm");
        setErrMsg(responseMsg + startDate + "-tól " + endDate + "-ig");
      } else {
        setErrMsg(
          "Sikertelen módosítás: " +
            JSON.stringify(err.response.data.message).slice(1, -1)
        );
      }
      errRef.current.focus();
    }
  };

  return (
    <section>
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1>Teremfoglalás szerkesztése</h1>
      {title && room && startDateTime && endDateTime && description ? (
        <form onSubmit={handleSubmit}>
          <label htmlFor="event-title">Esemény címe:</label>
          <input
            type="text"
            id="event-title"
            autoFocus
            value={title}
            autoComplete="off"
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength="100"
            aria-describedby="uidnote"
          />

          <label htmlFor="event-room">Terem:</label>
          <select
            id="event-room"
            required
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          >
            {roomOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label htmlFor="event-start-datetime">Kezdés időpontja:</label>
          <input
            type="datetime-local"
            id="event-start-datetime"
            value={startDateTime}
            required
            onChange={(e) => setStartDateTime(e.target.value)}
          ></input>

          <label htmlFor="event-end-datetime">Befejezés időpontja:</label>
          <input
            type="datetime-local"
            id="event-end-datetime"
            value={endDateTime}
            required
            onChange={(e) => setEndDateTime(e.target.value)}
          ></input>

          <label htmlFor="event-description">Bővebb leírás:</label>
          <textarea
            id="event-description"
            value={description}
            autoComplete="off"
            onChange={(e) => setDescription(e.target.value)}
            required
            maxLength="4096"
            aria-describedby="uidnote"
          />

          <button>Mentés</button>
        </form>
      ) : (
        <p>Betöltés...</p>
      )}
      {success ? <h1>Változtatások sikeresen elmentve</h1> : <></>}
    </section>
  );
};

export default EditEvent;
