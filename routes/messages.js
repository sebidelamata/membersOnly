const express = require("express");
const router = express.Router();

// Require controller modules.
const message_controller = require("../controllers/messageController");

/// MESSAGE ROUTES ///

// GET request for creating a message. NOTE This must come before routes that display Book (uses id).
router.get("/message/create", message_controller.message_create_get);

// POST request for creating message.
router.post("/message/create", message_controller.message_create_post);

// GET request to delete message.
router.get("/message/:id/delete", message_controller.message_delete_get);

// POST request to delete message.
router.post("/message/:id/delete", message_controller.message_delete_post);

// GET request to update message.
router.get("/message/:id/update", message_controller.message_update_get);

// POST request to update message.
router.post("/message/:id/update", message_controller.message_update_post);

// GET request for one message.
router.get("/message/:id", message_controller.message_detail);

// GET request for list of all message items.
router.get("/", message_controller.message_list);

module.exports = router;
