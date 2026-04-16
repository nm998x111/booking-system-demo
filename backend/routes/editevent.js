const express = require("express");
const router = express.Router();
const editEventController = require("../controllers/editEventController");
const verifyRoles = require("../middleware/verifyRoles");
const ROLES_LIST = require("../config/roles_list");

router
  .route("/:id")
  .post(
    verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
    editEventController.handleEditEvent
  );

module.exports = router;
