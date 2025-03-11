const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const { renderSignUp, createNewUser, LoginUser, renderResetPassword, changePassword, renderLogin, logout, renderChangePassword, resetPassword } = require("../controllers/user.js");
const {generateOtp} = require("../middleware.js");

// Signup route
router.route("/signup")
    .get(renderSignUp)
    .post(wrapAsync(createNewUser));

// Login route
router.route("/login")
    .get(renderLogin)
    .post(saveRedirectUrl, LoginUser);

// Forget password route
router.route("/forgetPassword")
    .get(renderChangePassword)
    .post(generateOtp,renderResetPassword);

// Change password route
router.route("/resetPassword")
    .post(wrapAsync(resetPassword));

// Logout route
router.get("/logout", logout);

module.exports = router;