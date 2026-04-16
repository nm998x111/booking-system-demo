const { db } = require("../config/dbConn");

const handleCreateNewEvent = async (req, res) => {
  const { title, room, starts, ends, desc } = req.body;
  if (!title || !room || !starts || !ends || !desc) {
    return res.status(400).json({ message: "All fields are required." });
  }
  //get all events and check for overlap, reject request if there's overlap

  if (starts >= ends) {
    if (starts === ends) {
      console.log("kezdés befejezés egyenlő dátum");
    } else {
      console.log("kezdés nagyobb mint befejezés");
    }
    return res.status(400).json({ message: `Nem megfelelő időintervallum` });
  }

  const collisionCheckQuery =
    "SELECT * FROM events WHERE room = ? AND ((starts < ? OR (? > starts AND ? < ends)) AND ((? > starts AND ? < ends)" +
    "OR ends > ?) OR (starts = ? AND ends = ?) OR (starts > ? AND ends = ?) OR (starts = ? AND ends < ?) OR (starts > ? AND ends < ?))";
  let createdEventID;

  try {
    const isTimeslotOccupied = await new Promise((resolve) => {
      //CHANGE FOR SCHOOL PROJECT id > user_id
      db.query(
        collisionCheckQuery,
        [
          room,
          starts,
          ends,
          ends,
          starts,
          starts,
          ends,
          starts,
          ends,
          starts,
          ends,
          starts,
          ends,
          starts,
          ends,
        ],
        (err, result) => {
          if (err) console.log(err.message);
          resolve(result);
        }
      );
    });

    //console.log("SQL data: " + isTimeslotOccupied[0].event_name);

    if (isTimeslotOccupied[0] === undefined) {
    } else {
      return res.status(409).json({
        message: `A kiválasztott teremre már létezik foglalás az alábbi időben: `,
        starts: isTimeslotOccupied[0].starts,
        ends: isTimeslotOccupied[0].ends,
      });
    }

    console.log(
      "BEFORE PARSING THE DATES\nStarts at: " + starts + "\nEnds at: " + ends
    );
    /*const startDate = new Date(Date.parse(starts));
    const endDate = new Date(Date.parse(ends));*/
    /*console.log(
      "AFTER PARSING THE DATES\nStarts at: " +
        startDate +
        "\nEnds at: " +
        endDate
    );*/

    //console.log("user who requested: " + req?.user);
    //get full name of user who created the event by username
    const returnedFullName = await new Promise((resolve) => {
      //CHANGE FOR SCHOOL PROJECT id > user_id
      db.query(
        `SELECT user_id FROM users WHERE username = ?`,
        [req?.user],
        (err, result) => {
          if (err) console.log(err.message);
          resolve(result);
        }
      );
    });

    if (returnedFullName[0] !== undefined) {
    } else {
      return res.status(400);
    }

    const newEvent = {
      eventTitle: title,
      selectedRoom: room,
      eventStart: starts,
      eventEnd: ends,
      eventDescription: desc,
      createdBy: returnedFullName[0].user_id,
    };

    const isInsertFinished = await new Promise((resolve) => {
      db.query(
        "INSERT INTO events (event_name, room, starts, ends, event_description, created_by_id) VALUES (" +
          `?, ?, ?, ?, ?, ?` +
          `)`,
        [
          newEvent.eventTitle,
          newEvent.selectedRoom,
          newEvent.eventStart,
          newEvent.eventEnd,
          newEvent.eventDescription,
          newEvent.createdBy,
        ],
        async (err, result) => {
          if (err) console.log(err.message);
          const returnedID = await new Promise((resolve) => {
            //CHANGE FOR SCHOOL PROJECT id > user_id
            db.query(
              `SELECT event_id FROM events WHERE event_name = ? AND starts = ? AND room = ?`,
              [newEvent.eventTitle, newEvent.eventStart, newEvent.selectedRoom],
              (err, result) => {
                if (err) console.log(err.message);
                resolve(result);
              }
            );
          });

          if (returnedID[0]) {
            //CHANGE FOR SCHOOL PROJECT id > user_id
            console.log(
              "returned id of the new event: " + returnedID[0].event_id
            );
            createdEventID = returnedID[0].event_id;
            //CHANGE FOR SCHOOL PROJECT id > user_id, 2001 > other thing
          } else {
            console.log("no returned id, error");
          }
          resolve(result);
        }
      );
    });

    res.status(201).json({
      success: `New event (${newEvent.eventTitle}) created!`,
      newID: createdEventID,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { handleCreateNewEvent };
