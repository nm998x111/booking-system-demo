const { db } = require("../config/dbConn");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  console.log(
    "REFRESH TOKEN ENDPOINT REACHED\nACCESS TOKEN REPLACEMENT STARTED"
  );
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log("ITT ROSSZ 345");
    return res.sendStatus(401);
  }
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  // revisit later, copy from logout NVM
  const queryResults = await new Promise((resolve) => {
    db.query(
      "SELECT users.username, password, role_id, token FROM users " +
        "INNER JOIN users_roles on users.user_id = users_roles.user_id " +
        "INNER JOIN tokens ON users.username = tokens.username " +
        "WHERE users.username = (" +
        "SELECT users.username FROM users " +
        "INNER JOIN tokens ON tokens.username = users.username " +
        `WHERE token = ?)`,
      [refreshToken],
      (err, results) => {
        if (err) console.log(err.message);
        resolve(results);
      }
    );
  });
  // THIS IS THE EQUIVALENT OF (!foundUser), detected refresh token reuse
  if (queryResults[0] === undefined) {
    console.log("TOKEN REUSE DETECTED");

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.sendStatus(403);
        console.log("attempted refresh token reuse");
        const query2Results = await new Promise((resolve) => {
          // this could be simplified to SELECT token FROM tokens WHERE token  = refreshtoken
          db.query(
            `SELECT users.username, password, role_id, token FROM users INNER JOIN users_roles on users.user_id = users_roles.user_id INNER JOIN tokens ON tokens.username = users.username WHERE users.username = ?`,
            [decoded.username],
            (err, results) => {
              if (err) console.log(err.message);
              if (results.length !== 0) {
                db.query(`DELETE FROM tokens WHERE username = ?`, [
                  decoded.username,
                ]);
              } else {
                return res.sendStatus(403);
              }
              resolve(results);
            }
          );
        });
      }
    );
    return res.sendStatus(403);
  } else {
    const foundTokens = [...new Set(queryResults.map((entry) => entry.token))];
    console.log(foundTokens);
    const foundRoles = [...new Set(queryResults.map((entry) => entry.role_id))];

    const foundUser = {
      username: queryResults[0].username,
      password: queryResults[0].password,
      roles: foundRoles,
      tokens: foundTokens,
    };

    const newRefreshTokenArray = foundTokens.filter(
      (rt) => rt !== refreshToken
    );
    console.log(newRefreshTokenArray);

    // evaluate jwt
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        // if we found an expired token
        if (err) {
          console.log("expired refresh token");
          foundUser.tokens = [...newRefreshTokenArray];
          db.query(
            `DELETE FROM tokens WHERE token = ?`,
            [refreshToken],
            (err) => {
              if (err) console.log(err.message);
            }
          );
        }
        if (err || foundUser.username !== decoded.username)
          return res.sendStatus(403);

        // REFRESH TOKEN WAS STILL VALID
        const accessToken = jwt.sign(
          {
            UserInfo: {
              username: decoded.username,
              roles: foundUser.roles,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "10m" }
        );

        const newRefreshToken = jwt.sign(
          { username: foundUser.username },
          process.env.REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        // Saving refreshToken with current user

        db.query(
          `INSERT INTO tokens VALUES (?, ?); DELETE FROM tokens WHERE token = ?`,
          [foundUser.username, newRefreshToken, refreshToken],
          (err) => {
            if (err) console.log(err.message);
          }
        );

        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true, //TURN THIS BACK ON LATER
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ user: foundUser.username, accessToken });
      }
    );
  }
};

module.exports = { handleRefreshToken };
