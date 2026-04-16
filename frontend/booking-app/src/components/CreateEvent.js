import React from "react";
import { useRef, useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const ADDEVENT_URL = "/addevent";

const CreateEvent = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const roomOptions = [
    { label: "A-206", value: "A-206" },
    { label: "A-104", value: "A-104" },
    { label: "B-102", value: "B-102" },
  ];

  const titleRef = useRef();
  const errRef = useRef();

  const [title, setTitle] = useState("");
  const [titleFocus, setTitleFocus] = useState(false);

  const [room, setRoom] = useState("");

  const [startDateTime, setStartDateTime] = useState("");

  const [endDateTime, setEndDateTime] = useState("");

  const [description, setDescription] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    titleRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosPrivate.post(
        ADDEVENT_URL,
        JSON.stringify({
          title,
          room,
          starts: startDateTime,
          ends: endDateTime,
          desc: description,
        })
      );
      setSuccess(true);
      navigate(`/event/${JSON.stringify(response.data.newID)}`, {
        replace: true,
      });
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
          "Sikertelen teremfoglalás: " +
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
      <h1>Új teremfoglalás létrehozása</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="event-title">Esemény címe:</label>
        <input
          type="text"
          id="event-title"
          ref={titleRef}
          autoComplete="off"
          onChange={(e) => setTitle(e.target.value)}
          required
          maxLength="100"
          aria-describedby="uidnote"
          onFocus={() => setTitleFocus(true)}
          onBlur={() => setTitleFocus(false)}
        />

        <label htmlFor="event-room">Terem:</label>
        <select
          id="event-room"
          required
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        >
          <option hidden disabled value="">
            {" "}
            -- Válassz egy opciót --{" "}
          </option>
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
          required
          onChange={(e) => setStartDateTime(e.target.value)}
        ></input>

        <label htmlFor="event-end-datetime">Befejezés időpontja:</label>
        <input
          type="datetime-local"
          id="event-end-datetime"
          required
          onChange={(e) => setEndDateTime(e.target.value)}
        ></input>

        <label htmlFor="event-description">Bővebb leírás:</label>
        <textarea
          id="event-description"
          autoComplete="off"
          onChange={(e) => setDescription(e.target.value)}
          required
          maxLength="4096"
          aria-describedby="uidnote"
        />

        <button>Létrehozás</button>
      </form>
      {success ? <h1>Új teremfoglalás sikeresen létrehozva</h1> : <></>}
    </section>
  );
};

export default CreateEvent;
