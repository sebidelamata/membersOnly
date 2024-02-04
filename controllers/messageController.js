const Message = require("../models/message")
const User = require("../models/user")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

// Display list of all Messages.
exports.message_list = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find({})
    .sort({ publish_date: -1 })
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

  res.render("message_form", {
    title: "Create Message",
    message: null,
    errors: null
  })
});

// Handle Message create on POST.
exports.message_create_post = [
  body("message", "Message must be at least 1 character")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const testUser = await User.findOne().exec()

    const message = new Message({
      message: req.body.message,
      user_id: testUser._id,
      publish_date: new Date()
    })

    if(!errors.isEmpty()){
      res.render("message_form", {
        message: message,
        errors: errors.array()
      })
      return
    } else {
      await message.save()
      res.redirect("/messages")
    }

    res.send("NOT IMPLEMENTED: Message create POST");
  }),

]

// Display Message delete form on GET.
exports.message_delete_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).exec()

  if(message === null){
    res.redirect('/messages')
  }
  res.render("message_delete", {
    message: message
  })
});

// Handle Message delete on POST.
exports.message_delete_post = asyncHandler(async (req, res, next) => {
  await Message.findByIdAndDelete(req.body.message_id)
  res.redirect("/messages")
});

// Display Message update form on GET.
exports.message_update_get = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id)
  .populate("user_id")
  .exec()

  if(message === null){
    const err = new Error("Message not found")
    err.status = 404
    return next(err)
  }

  res.render("message_form", {
    title: "Update Message",
    message: message,
    errors: null,
  })
});

// Handle Message update on POST.
exports.message_update_post = [
  body('message', 'Message must be at least 1 character.')
  .trim()
  .isLength({ min: 1 })
  .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const message = new Message({
      message: req.body.message,
      publish_date: new Date(),
      user_id: req.body.user_id,
      _id: req.body._id
    })

    if(!errors.isEmpty()){
      res.render("message_form", {
        title: "Update Message",
        message: message,
        errors: errors.array()
      })
      return
    } else {
      const updatedMessage = await Message.findByIdAndUpdate(req.params.id, message, {})
      res.redirect(updatedMessage.url)
    }
  })

]
