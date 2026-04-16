const { db } = require("../config/dbConn");

const handleDeleteEvent = async (req, res) => {
  console.log("Request received to delete event with id: " + req.params.id);
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    console.log("ITT AKADT EL");
    return res.status(400).json({ message: `ID is not number` });
  }

  try {
    await new Promise((resolve) => {
      db.query("DELETE FROM events WHERE event_id = ?", [id], (err, result) => {
        if (err) console.log(err.message);
        console.log("deleted " + result.affectedRows + " rows");
        resolve(result);
      });
    });
    res.status(204).json({ message: `Event successfully deleted!` });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { handleDeleteEvent };
