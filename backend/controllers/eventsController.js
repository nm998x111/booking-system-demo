const { db } = require("../config/dbConn");

const getEvent = async (req, res) => {
  console.log("Request received to display event with id: " + req.params.id);
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ message: `ID is not number` });
  }

  try {
    const sql_string = `SELECT event_name, room, starts, ends, event_description, name FROM events INNER JOIN users ON users.user_id = events.created_by_id WHERE event_id = ?`;
    console.log(sql_string);
    //mysql stuff to get requested event data
    const requestedEvent = await new Promise((resolve) => {
      db.query(sql_string, [req?.params?.id], (err, results) => {
        if (err) console.log(err.message);
        resolve(results);
      });
    });

    if (requestedEvent !== undefined) {
      console.log(
        "Event name: " +
          requestedEvent[0].event_name +
          "\nRoom: " +
          requestedEvent[0].room +
          "\nStarts at: " +
          requestedEvent[0].starts +
          "\nEnds at: " +
          requestedEvent[0].ends +
          "\nDescription: " +
          requestedEvent[0].event_description +
          "\nCreated by: " +
          requestedEvent[0].name
      );
      //console.log(requestedEvent);
      const requestedEventObject = {
        title: requestedEvent[0].event_name,
        room: requestedEvent[0].room,
        startDateTime: requestedEvent[0].starts,
        endDateTime: requestedEvent[0].ends,
        description: requestedEvent[0].event_description,
        createdBy: requestedEvent[0].name,
      };
      res.json(requestedEventObject);
    } else {
      return res.status(204).json({ message: "No event found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getEventByRoom = async (req, res) => {
  const param = req.url.replace("/room/", "");
  console.log("1234213214 " + param);

  var eventList = [];

  const events = await new Promise((resolve) => {
    db.query(
      `SELECT event_id, event_name, room, starts, ends, event_description, name FROM events INNER JOIN users ON users.user_id = events.created_by_id WHERE room = ?`,
      [param],
      (err, results) => {
        if (err) console.log(err.message);
        resolve(results);
      }
    );
  });

  console.log(events);
  if (events === undefined) {
    return res.status(204).json({ message: "No events found" });
  } else {
    events.forEach((event) => {
      //console.log("USER FOUND:\n" + user);
      const eventToAdd = {
        id: event.event_id,
        title: event.event_name,
        room: event.room,
        startDateTime: event.starts,
        endDateTime: event.ends,
        description: event.event_description,
        createdBy: event.name,
      };

      eventList.push(eventToAdd);
    });

    console.log(eventList);
    res.json(eventList);
  }
};

module.exports = {
  getEvent,
  getEventByRoom,
};
