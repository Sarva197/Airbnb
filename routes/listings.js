const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { validateListing } = require("../middleware.js");
const { isLoggedIn, isOwner } = require("../middleware.js");
const { index, newListing, showListing, createListing, showEditPage, updateListing, deleteListing } = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });

// Index route and create route
router.route("/")
    .get(wrapAsync(index))
    .post(isLoggedIn, upload.single("image"), validateListing, wrapAsync(createListing));

// Create new route
router.get("/new", isLoggedIn, newListing);

// Edit route
router.route("/:id/edit")
    .get(isLoggedIn, isOwner, wrapAsync(showEditPage));

// Update route, delete route, show route
// If we write /listings/new below /listings/:id we get error because /new will be treated as an :id therefore we've written it above
router.route("/:id")
    .get(wrapAsync(showListing))
    .put(isLoggedIn, isOwner, upload.single("image"), validateListing, wrapAsync(updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));

module.exports = router;