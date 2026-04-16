require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const { db } = require("./config/dbConn");
const mysql = require("mysql");
const PORT = process.env.PORT || 3500;

//Connect to MySQL database
//connectDB();
// Custom middleware logger
app.use(logger);
//
app.use(credentials);
// CORS = Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

//middleware for cookies
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "public")));

app.use("/", require("./routes/root"));
//app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

app.use(verifyJWT);
//NEW
app.use("/users", require("./routes/api/users"));
app.use("/addevent", require("./routes/addevent"));
app.use("/events", require("./routes/api/events"));
app.use("/editevent", require("./routes/editevent"));
app.use("/delevent", require("./routes/delevent"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

//only start listening on port once connection ism active
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
