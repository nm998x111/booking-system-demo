const express = require("express");
const router = express.Router();
const addEventController = require("../controllers/addEventController");
const ROLES_LIST = require("../config/roles_list");
const verifyRoles = require("../middleware/verifyRoles");

router.post(
  "/",
  verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor),
  addEventController.handleCreateNewEvent
);
/*.delete(verifyRoles(ROLES_LIST.Admin), usersController.deleteUser)*/

/*router
  .route("/:id")
  .get(verifyRoles(ROLES_LIST.Admin), usersController.getUser);*/

module.exports = router;
