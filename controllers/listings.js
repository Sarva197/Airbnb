const Listing = require("../models/listing");

//index route
module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
};

module.exports.newListing = (req,res)=>{
    res.render("listings/new")
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    //here we are populating the listing document with review document so we can use them in show.ejs to show reviews
    //here populate({path :"reviews ", populate : {path : "author"}}) this is nested populating , we are populating reviews for listing and for each review we are populating it with author
    const listing = await Listing.findById(id).populate({path :"review", populate : {path : "author"}}).populate("owner");
    if(!listing){
        req.flash("error","The hotel you are trying to access dosent exist");
        res.redirect("/listings");
    }
    res.render("listings/show",{listing});
};

//Below is the explaination about the mistake i was making and solution for it

// The issue with the image not displaying after editing arises because the updated image 
// field is not correctly handled in the PUT route. Specifically, when no new image is provided during the edit, 
// the code attempts to retain the original image but incorrectly processes the image field 
// as a simple string instead of an object containing url and filename

//below post request has three arguments , 1st is route ,2nd is the middlware function and third is the our normal wrapAsync funtion 
//which hs an async function inside it which does the job of requiring the info sent by the client , processes it , and saves it 
//onto our database

module.exports.createListing = async (req, res, next) => {
    try {
        const { listings } = req.body;
        const { path: url, filename } = req.file;

        // Create the image object
        const image = {
            url: url,       // Assuming the form provides the URL as a string
            filename: filename              // Set a placeholder or generate a filename if needed
        };

        // Create a new listing with the image object
        const newListing = new Listing({
            ...listings,
            image
        });

        // Saving the owner id who created the listing
        newListing.owner = req.user._id;
        await newListing.save();
        req.flash("success", "New listing created");
        res.redirect("/listings");
    } catch (error) {
        next(error);
    }
};
module.exports.showEditPage = async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","The hotel you are trying to access dosent exist");
        res.redirect("/listings");
    }

    let originalUrl = listing.image.url;
    originalUrl = originalUrl.replace("upload","upload/h_250,w_250");
    res.render("listings/edit.ejs",{listing, originalUrl})
};

// The issue with the image field not being saved while creating a new listing is likely 
// because the image field is expected to be an object (e.g., { url, filename }), 
// but in your POST route, it is directly taking the value from the req.body.listings.image,
//  which might only be a string (the image URL).

// To fix this, you need to ensure the image field is correctly structured as an object when saving the new listing.

//below put request has three arguments , 1st is route ,2nd is the middlware function and third is the our normal wrapAsync funtion

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const updates = req.body.listings;
    const listing = await Listing.findById(id);
    console.log(req.file);
    console.log(req.body.listings);
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url , filename};
        await listing.save();
    }
    await Listing.findByIdAndUpdate(id, { ...updates });
    req.flash("success","The listing has been updated");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","The listing has been deleted");
    res.redirect("/listings");
};
