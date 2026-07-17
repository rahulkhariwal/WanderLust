const express = require("express");
const router = express.Router();

const passport = require("passport");
const { saveRedirectUrl } = require("../middlewaer.js");
const wrapAsync = require("../utils/wrapAsync.js");

const userController = require("../controller/user.js");

// Signup
router
    .route("/signup")
    .get(userController.renderSignupForm)
    .post(wrapAsync(userController.signup));

// Login
router
    .route("/login")
    .get(userController.renderLoginForm)
    .post(
        saveRedirectUrl,
        passport.authenticate("local", {
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.login
    );

// Logout
router.get("/logout", userController.logout);

module.exports = router;