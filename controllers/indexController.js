const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const User = require("../models/user")
// Display list of all Users.
exports.user_login_get = asyncHandler(async (req, res, next) => {
  res.render("login_form")
});

exports.user_login_post = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/signup"
  })

exports.user_signup_get = asyncHandler(async (req,res,next) => {
  res.render('signup_form')
})

exports.user_signup_post = asyncHandler(async (req,res,next) => {
  try {
    const user = new User({
      first_name: req.body.firstname,
      last_name: req.body.lastname,
      username: req.body.username,
      password: req.body.password,
      salt: 10,
      admin: false
    });
    const result = await user.save();
    res.redirect("/");
  } catch(err) {
    return next(err);
  };
})