const express = require("express");
const router =  express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { search} = require("../controllers/search.js") 

router.route("/")
.get(wrapAsync(search));

module.exports = router;