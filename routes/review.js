const express = require("express");
const router =  express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
// const { reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const { reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");

const validateReview = (req,res,next)=>{
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((e)=>e.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//below is revies route 


router.post("/", validateReview , wrapAsync( async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    const review = new Review(req.body.review);
    listing.review.push(review);
    await review.save();
    await listing.save();
    req.flash("success","Review posted");
    res.redirect(`/listings/${id}`);
}));

//deleting the review in perticular listing

router.delete("/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } }); // Corrected field name
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
}));

module.exports = router;