const { db } = require("../config/dbConn");
const moment = require("moment");

const handleEditEvent = async (req, res) => {
  const { title, room, starts, ends, desc } = req.body;
  if (!title || !room || !starts || !ends || !desc) {
    return res.status(400).json({ message: "All fields are required." });
  }
  console.log("Request received to edit event with id: " + req.params.id);
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    console.log("ITT AKADT EL");
    return res.status(400).json({ message: `ID is not number` });
  }

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
    "OR ends > ?) OR (starts = ? AND ends = ?) OR (starts > ? AND ends = ?) OR (starts = ? AND ends < ?) OR (starts > ? AND ends < ?))" +
    "AND (event_id != ?)";
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
          id,
        ],
        (err, result) => {
          if (err) console.log(err.message);
          resolve(result);
        }
      );
    });

    if (isTimeslotOccupied[0] === undefined) {
    } else {
      return res.status(409).json({
        message: `A kiválasztott teremre már létezik foglalás az alábbi időben: `,
        starts: isTimeslotOccupied[0].starts,
        ends: isTimeslotOccupied[0].ends,
      });
    }

    const oldData = await new Promise((resolve) => {
      //CHANGE FOR SCHOOL PROJECT id > user_id
      db.query(
        `SELECT *, (SELECT user_id FROM users WHERE username = ?) as MODIFIER FROM events WHERE event_id = ?`,
        [req?.user, id],
        (err, result) => {
          if (err) console.log(err.message);
          resolve(result);
        }
      );
    });

    if (oldData[0] !== undefined) {
    } else {
      console.log("ITT AKADT EL");
      return res.status(400);
    }

    const sql_string =
      `INSERT INTO edit_history (event_id, time_of_modification, modifier_id, old_event_name, old_room, old_starts, old_ends, old_event_description) VALUES (` +
      `?,?,?,?,?,?,?,?);` +
      `UPDATE events SET event_name = ?, room = ?, starts = ?, ends = ?, event_description = ?, last_modified_by_id = ? WHERE event_id = ?;`;
    console.log(sql_string);
    //mysql stuff to get requested event data
    const returnedID = await new Promise((resolve) => {
      db.query(
        sql_string,
        [
          id,
          moment().format("YYYY-MM-DD HH:mm:ss"),
          oldData[0].MODIFIER,
          oldData[0].event_name,
          oldData[0].room,
          moment(oldData[0].starts).format("YYYY-MM-DD HH:mm"),
          moment(oldData[0].ends).format("YYYY-MM-DD HH:mm"),
          oldData[0].event_description,
          title,
          room,
          starts,
          ends,
          desc,
          oldData[0].MODIFIER,
          id,
        ],
        (err, results) => {
          if (err) console.log(err.message);
          resolve(results);
        }
      );
    });
    res.status(204).json({ success: `Event successfully edited!` });
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { handleEditEvent };
