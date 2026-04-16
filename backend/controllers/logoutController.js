const { db } = require("../config/dbConn");

const handleLogout = async (req, res) => {
  // On client also delete the access token

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    console.log("BUG HERE THANKS TO secure: true");
    return res.sendStatus(204);
  }
  const refreshToken = cookies.jwt;

  // Is refreshToken in DB?
  const queryResults = await new Promise((resolve) => {
    db.query(
      `SELECT token FROM tokens WHERE token = ?`,
      [refreshToken],
      (err, results) => {
        if (err) console.log(err.message);
        resolve(results);
      }
    );
  });
  console.log(queryResults);

  //const existingTokens = queryResults.map(res => res.token);
  //console.log(existingTokens);
  // foundUser az egész usert tárolta a változás előtt
  //const foundUser = existingTokens.find(token => token === refreshToken);
  //console.log(foundUser);
  if (!queryResults[0]) {
    console.log("refresh token NOT FOUND in db");
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  // delete the refresh token in the database
  console.log("refresh token found: " + refreshToken);
  db.query(`DELETE FROM tokens WHERE token = ?`, [refreshToken]);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true }); //IN PRODUCTION add flag: secure: true, makes it only serve on https
  res.sendStatus(204);
};

module.exports = { handleLogout };
