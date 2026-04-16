const { db } = require("../config/dbConn");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleLogin = async (req, res) => {
  const cookies = req.cookies;
  // TESTING PURPOSES
  console.log(`cookie available at login: ${JSON.stringify(cookies)}`);

  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const queryResults = await new Promise((resolve) => {
    db.query(
      `SELECT users.username, password, role_id, token FROM users INNER JOIN users_roles on users.user_id = users_roles.user_id LEFT JOIN tokens ON tokens.username = users.username WHERE users.username = ?`,
      [user],
      (err, results) => {
        if (err) console.log(err.message);
        resolve(results);
      }
    );
  });
  if (queryResults[0] === undefined) {
    console.log("username not found");
    res.sendStatus(401);
  } else {
    const foundTokens = [...new Set(queryResults.map((entry) => entry.token))];
    const foundRoles = [...new Set(queryResults.map((entry) => entry.role_id))];
    const foundUser = {
      username: queryResults[0].username,
      password: queryResults[0].password,
      roles: foundRoles,
      tokens: foundTokens,
    };
    //
    console.log(
      "Username: " +
        foundUser.username +
        "\nPassword: " +
        foundUser.password +
        "\nRole IDs: " +
        foundUser.roles +
        "\nTOKENS: " +
        foundUser.tokens
    );

    //const foundUser = matchingUser.find((person) => person.username === user);
    if (!foundUser) return res.sendStatus(401);
    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
      console.log("matching password found");

      //const roles = Object.values(foundUser.roles).filter(Boolean);

      // create JWTs
      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );
      console.log("Access token generated: " + accessToken);
      const newRefreshToken = jwt.sign(
        { username: foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      // UNIMPORTANT, NEED TO  DELETE LATER
      /* const newRefreshTokenArray = !cookies?.jwt
        ? foundTokens
        : foundTokens.filter((rt) => rt !== refreshToken); */

      if (cookies?.jwt) {
        //console.log("About to delete token from database: " + cookies.jwt);
        //  + DELETE refreshToken from db
        db.query(
          `DELETE FROM tokens WHERE token = ?`,
          [cookies.jwt],
          (err, result) => {
            if (err) console.log(err.message);
            console.log("Number of records deleted: " + result.affectedRows);
          }
        );

        /*const refreshToken = cookies.jwt;
        const tokenQueryResults = await new Promise((resolve) => {
          db.query(
            `SELECT token FROM tokens WHERE token = '${refreshToken}'`,
            (err, results) => {
              if (err) console.log(err.message);
              if (results.length !== 0) {
                console.log("attempted refresh token reuse at login");
              }

              //THROWS CRASH
              resolve(results);
            }
          );
        });
        if (tokenQueryResults === undefined) {
          console.log("RETURNED UNDEFINED");
        } else {
          db.query(
            `DELETE FROM tokens WHERE username = (SELECT username FROM tokens WHERE token = ? )`,
            [refreshToken],
            (err, result) => {
              if (err) console.log(err.message);
              console.log("Number of records deleted: " + result.affectedRows);
            }
          );
        }*/

        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
      }

      // Saving refreshToken with current user
      db.query(
        `INSERT INTO tokens VALUES (?, ?)`,
        [foundUser.username, newRefreshToken],
        (err) => {
          if (err) console.log(err.message);
        }
      );

      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true, //TURN THIS BACK ON LATER FOR BROWSER, FOR THUNDERCLIENT KEEP FALSE
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ accessToken });
    } else {
      console.log("match not found");
      res.sendStatus(401);
    }
  }
};

module.exports = { handleLogin };
