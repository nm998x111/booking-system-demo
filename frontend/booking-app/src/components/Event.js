import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { faPencil, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { ROLES } from "../config/Roles";
import useAuth from "../hooks/useAuth";
import moment from "moment";
import "moment/locale/hu";
import { jwtDecode } from "jwt-decode";
moment.locale("hu");

const Event = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const decoded = auth?.accessToken ? jwtDecode(auth.accessToken) : undefined;
  const roles = decoded?.UserInfo?.roles || [];
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const EVENT_URL = `/events/${eventId}`;
  const EVENT_DELETE_URL = `/delevent/${eventId}`;
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axiosPrivate.get(EVENT_URL);
        setEvent(response.data);
      } catch (error) {}
    };

    fetchEvent();

    return () => {};
  }, [eventId]);

  const deleteEvent = async () => {
    try {
      const response = await axiosPrivate.get(EVENT_DELETE_URL);

      navigate("/events", { replace: true });
    } catch (error) {}
  };

  const handleDeleteConfirmation = () => {
    if (
      window.confirm("Biztos, hogy törölni szeretnéd ezt a teremfoglalást?")
    ) {
      deleteEvent();
    }
  };

  return (
    <section className="event-section">
      <section className="event-section">
        {event ? (
          <div className="event-div">
            <div>
              <h1 className="event-title">
                {event.title}
                {roles.includes(ROLES.Admin) || roles.includes(ROLES.Editor) ? (
                  <div className="event-icons">
                    <Link to={`/editevent/${eventId}`}>
                      <FontAwesomeIcon
                        className="event-edit-icon"
                        icon={faPencil}
                      />
                    </Link>
                    {"  "}
                    <FontAwesomeIcon
                      className="event-delete-icon"
                      icon={faTrashCan}
                      onClick={handleDeleteConfirmation}
                    />
                  </div>
                ) : (
                  <></>
                )}
              </h1>

              <br />
              <p>Terem: {event.room}</p>
              <p>
                Ettől:{" "}
                {moment.utc(event.startDateTime).format("YYYY. MMM Do, HH:mm")}
              </p>
              <p>
                Eddig:{" "}
                {moment.utc(event.endDateTime).format("YYYY. MMM Do, HH:mm")}
              </p>
              <br />
              <p>
                Bővebb leírás:
                <br /> {event.description}
              </p>
              <br />
            </div>
            <p className="event-footer">Létrehozta: {event.createdBy}</p>
          </div>
        ) : (
          <p>Betöltés...</p>
        )}
      </section>
      <div className="flexGrow">
        <Link to="/">Vissza</Link>
      </div>
    </section>
  );
};

export default Event;
