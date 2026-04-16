const express = require("express");
const router = express.Router();
const eventsController = require("../../controllers/eventsController");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");

router
  .route("/:id")
  .get(verifyRoles(ROLES_LIST.User), eventsController.getEvent);

router
  .route("/room/:id")
  .get(verifyRoles(ROLES_LIST.User), eventsController.getEventByRoom);

module.exports = router;
