const express = require("express");
const router =  express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn, isRevOwner} = require("../middleware.js");
const { createReview, deleteReview } = require("../controllers/review.js");


//below is revies route 
//create review
router.post("/",isLoggedIn, validateReview, wrapAsync(createReview));

//deleting the review in perticular listing

router.delete("/:reviewId",isLoggedIn, isRevOwner, wrapAsync(deleteReview));

module.exports = router;