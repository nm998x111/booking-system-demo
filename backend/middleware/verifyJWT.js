const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  //console.log("Whole authheader before split: " + authHeader);
  if (!authHeader?.startsWith("Bearer ")) {
    console.log("itt akadt el");
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];
  //console.log("Access token to compare to " + token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.error(err);
      return res.sendStatus(403);
    }
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;

    console.log("Ide eljutott, JWT auth befejezve");
    next();
  });
};

module.exports = verifyJWT;
