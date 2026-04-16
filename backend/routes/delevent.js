const express = require("express");
const router = express.Router();
const deleteEventController = require("../controllers/deleteEventController");
const verifyRoles = require("../middleware/verifyRoles");
const ROLES_LIST = require("../config/roles_list");

router
  .route("/:id")
  .get(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    deleteEventController.handleDeleteEvent
  );

module.exports = router;
