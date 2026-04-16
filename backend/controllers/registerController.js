const { db } = require("../config/dbConn");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, email, name, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const queryResults = await new Promise((resolve) => {
    db.query("SELECT username FROM users", (err, results) => {
      if (err) console.log(err.message);
      resolve(results);
    });
  });
  const existingUsernames = queryResults.map((res) => res.username);

  const duplicate = existingUsernames.find((name) => name === user);
  if (duplicate) {
    console.log("duplicate found");
    return res.sendStatus(409);
  } else {
    console.log("no duplicate");
  }
  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);

    const newUser = {
      username: user,
      email: email,
      name: name,
      password: hashedPwd,
    };
    db.query(
      "INSERT INTO users (username, email, name, password, active, created, modified) VALUES (" +
        `?, ?, ?, ?, 0, now(), now()` +
        `)`,
      [newUser.username, newUser.email, newUser.name, newUser.password],
      async (err) => {
        if (err) console.log(err.message);
        const returnedID = await new Promise((resolve) => {
          //CHANGE FOR SCHOOL PROJECT id > user_id
          db.query(
            `SELECT user_id FROM users WHERE username = ?`,
            [newUser.username],
            (err, result) => {
              if (err) console.log(err.message);
              resolve(result);
            }
          );
        });

        if (returnedID[0]) {
          //CHANGE FOR SCHOOL PROJECT id > user_id
          console.log("returned id of new user: " + returnedID[0].user_id);
          //CHANGE FOR SCHOOL PROJECT id > user_id, 2001 > other thing
          db.query(
            `INSERT INTO users_roles (user_id, role_id) VALUES (?, 2330)`,
            [returnedID[0].user_id],
            (err) => {
              if (err) console.log(err);
            }
          );
        } else {
          console.log("no returned id, error");
        }
      }
    );

    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
