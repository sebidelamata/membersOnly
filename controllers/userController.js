const User = require("../models/user");
const Message = require("../models/message")
const asyncHandler = require("express-async-handler");

// Display list of all Users.
exports.user_list = asyncHandler(async (req, res, next) => {
  const allUsers = await User.find({})
    .sort({ last_name: 1 })
    .exec()

  res.render("user_list", { 
    user_list: allUsers
    })
});

// Display detail page for a specific User.
exports.user_detail = asyncHandler(async (req, res, next) => {
  const [user, posts] = await Promise.all([
    User.findById(req.params.id).exec(),
    Message.find({ user_id: req.params.id }).exec()
  ])
  
  if (user === null) {
    // No results.
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  }

  res.render("user_detail", {
    user: user,
    posts: posts
  })
});

// Display User create form on GET.
exports.user_create_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User create GET");
});

// Handle User create on POST.
exports.user_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User create POST");
});

// Display User delete form on GET.
exports.user_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User delete GET");
});

// Handle User delete on POST.
exports.user_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User delete POST");
});

// Display User update form on GET.
exports.user_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User update GET");
});

// Handle User update on POST.
exports.user_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: User update POST");
});
