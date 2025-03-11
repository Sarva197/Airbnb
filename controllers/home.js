const Listing = require("../models/listing");

//index route
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
};
