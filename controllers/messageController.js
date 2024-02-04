const Message = require("../models/message");
const asyncHandler = require("express-async-handler");

// Display list of all Messages.
exports.message_list = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find({})
    .sort({ publish_date: 1 })
    .populate("user_id")
    .exec()

  res.render("message_list", { 
    message_list: allMessages
    })
});

// Display detail page for a specific Message.
exports.message_detail = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id)
  .populate("user_id")
  .exec()
  
  if (message === null) {
    // No results.
    const err = new Error("Message not found");
    err.status = 404;
    return next(err);
  }

  res.render("message_detail", {
    message: message
  })
});

// Display Message create form on GET.
exports.message_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message create GET");
});

// Handle Message create on POST.
exports.message_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message create POST");
});

// Display Message delete form on GET.
exports.message_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message delete GET");
});

// Handle Message delete on POST.
exports.message_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message delete POST");
});

// Display Message update form on GET.
exports.message_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message update GET");
});

// Handle Message update on POST.
exports.message_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Message update POST");
});
