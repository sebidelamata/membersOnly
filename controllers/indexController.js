const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const passport = require("passport");
const User = require("../models/user")
const bcrypt = require("bcryptjs")

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
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      
      const user = new User({
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        username: req.body.username,
        password: hashedPassword,
        admin: false
      });
      const result = await user.save();
      res.redirect("/login");
    }) 
  }catch(err) {
    return next(err);
  };
})

exports.user_join_club_get = asyncHandler(async (req, res, next) => {
  res.render("join_club")
});

exports.user_join_club_post = [
  body("passcode", "Passcode must be at least 1 character")
  .trim()
  .isLength({ min: 1 })
  .escape()
  .equals('password'),

  asyncHandler(async(req, res, next) => {
      const errors = validationResult(req)
console.log(req)
      let currentUser = await User.findById(res.locals.currentUser._id) 
      currentUser.membership = true
      if(!errors.isEmpty()){
        res.redirect("/")
        return
      } else {
        let updatedUser = await User.findByIdAndUpdate(currentUser._id, currentUser, {})
        res.redirect('/messages')
      }
  })
]