const express = require("express");
const router =  express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { index} = require("../controllers/home.js");


router.route("/")
.get(wrapAsync(index));