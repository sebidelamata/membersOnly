const User = require("../models/user");
const Message = require("../models/message")
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

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
  res.render("user_form", {
    title: "Create User",
    user: null,
    errors: null
  })
});

// Handle User create on POST.
exports.user_create_post = [
  body("first_name", "First Name must be at least 1 character")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  body("last_name", "Last Name must be at least 1 character")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  body("username", "Username must be an email address")
  .trim()
  .isEmail()
  .escape(),

  body("password", "Password must be at least 1 character")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  body("password_confirm", "Passwords must match")
  .trim()
  .custom((value, {req}) => {
    return value === req.body.password
  }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
      membership: false,
      admin: false
    })

    if(!errors.isEmpty()){
      res.render("user_form", {
        title: "Create User",
        user: user,
        errors: errors.array()
      })
      return
    } else {
      await user.save()
      res.redirect("/users")
    }

    res.send("NOT IMPLEMENTED: Message create POST");
  }),

]

// Display User delete form on GET.
exports.user_delete_get = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec()

  if(user === null){
    res.redirect("/users")
  }

  res.render("user_delete", {
    user: user
  })
});

// Handle User delete on POST.
exports.user_delete_post = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.body.user_id)
  res.redirect("/users")
});

// Display User update form on GET.
exports.user_update_get = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
  .exec()

  if(user === null){
    const err = new Error("User not found")
    err.status = 404
    return next(err)
  }

  res.render("user_form", {
    title: "Update User",
    user: user,
    errors: null,
  })
});

// Handle User update on POST.
exports.user_update_post = [
  body("first_name", "First Name must be at least 1 character")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  body("last_name", "Last Name must be at least 1 character")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  body("username", "Username must be an email address")
  .trim()
  .isEmail()
  .escape(),

  body("password", "Password must be at least 1 character")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  body("password_confirm", "Passwords must match")
  .trim()
  .custom((value, {req}) => {
    return value === req.body.password
  }),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req)

    const user = new User({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      username: req.body.username,
      password: req.body.password,
      membership: false,
      admin: false,
      _id: req.body._id
    })

    if(!errors.isEmpty()){
      res.render("user_form", {
        title: "Update User",
        user: user,
        errors: errors.array()
      })
      return
    } else {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, user, {})
      res.redirect(updatedUser.url)
    }
  })

]
