const Review = require('../models/review');
const Listing = require('../models/listing');

module.exports.createReview = async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    listing.review.push(review);
    await review.save();
    await listing.save();
    req.flash("success","Review posted");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ExpressError(404, "Listing not found");
    }
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } }); // Corrected field name
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
};

