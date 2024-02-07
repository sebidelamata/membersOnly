const express = require('express');
const router = express.Router();

const passport = require("passport");
// Require controller modules.
const index_controller = require("../controllers/indexController");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Members Only', login_user: req.user});
});

router.get('/signup', index_controller.user_signup_get);
router.post('/signup', index_controller.user_signup_post);

router.get('/login', index_controller.user_login_get);
router.post('/login', index_controller.user_login_post);

router.get("/log-out", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
