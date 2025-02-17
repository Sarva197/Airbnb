const express = require("express");
const router =  express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");
const {isLoggedIn} = require("../middleware.js");

//joi validation middleware  for listings 
const validateListing = (req,res,next)=>{
    //joi server side schema validation 
    const {error} = listingSchema.validate(req.body);
    
    if(error){
        console.log(error.details)
        let err = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, err);
    }else{
        next();
    }

}

//index route
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index",{allListings});
}));

//create new route
router.get("/new",isLoggedIn ,(req,res)=>{
    res.render("listings/new")
});

//show route
//if we write /listings/new below /listings/:id we get error because /new will be treated as an :id therefore we've writtent it above
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id} = req.params;
    //here we are populating the listing document with review document so we can use them in show.ejs to show reviews
    const listing = await Listing.findById(id).populate("review").populate("owner");
    if(!listing){
        req.flash("error","The hotel you are trying to access dosent exist");
        res.redirect("/listings");
    }
    res.render("listings/show",{listing});
}));


//Below is the explaination about the mistake i was making and solution for it

// The issue with the image not displaying after editing arises because the updated image 
// field is not correctly handled in the PUT route. Specifically, when no new image is provided during the edit, 
// the code attempts to retain the original image but incorrectly processes the image field 
// as a simple string instead of an object containing url and filename

//below post request has three arguments , 1st is route ,2nd is the middlware function and third is the our normal wrapAsync funtion 
//which hs an async function inside it which does the job of requiring the info sent by the client , processes it , and saves it 
//onto our database

//create route
router.post("/",isLoggedIn , validateListing , wrapAsync(async (req, res, next) => {
    const { listings } = req.body;
    console.log(req.body.listings);

    // Create the image object
    const image = {
        url: listings.image,       // Assuming the form provides the URL as a string
        filename: ""               // Set a placeholder or generate a filename if needed
    };

    // Create a new listing with the image object
    
    const newListing = new Listing({
        ...listings,
        image
    });

    //saving the owner id who created the listing
    newListing.owner = req.user._id;
    await newListing.save();
    console.log(newListing);
    req.flash("success","New listing created");
    res.redirect("/listings");
}));

//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","The hotel you are trying to access dosent exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing})
}));

//update route

// The issue with the image field not being saved while creating a new listing is likely 
// because the image field is expected to be an object (e.g., { url, filename }), 
// but in your POST route, it is directly taking the value from the req.body.listings.image,
//  which might only be a string (the image URL).

// To fix this, you need to ensure the image field is correctly structured as an object when saving the new listing.

//below put request has three arguments , 1st is route ,2nd is the middlware function and third is the our normal wrapAsync funtion 
router.put("/:id",isLoggedIn ,validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updates = req.body.listings;

    const listing = await Listing.findById(id);

    // Retain the original image object if no new image data is provided
    if (!req.body.listings.image) {
        updates.image = listing.image; // Retain the original image object
    } else {
        // If a new image URL is provided, create a new image object
        updates.image = {
            url: req.body.listings.image,
            filename: listing.image.filename // Retain the original filename
        };
    }

    await Listing.findByIdAndUpdate(id, { ...updates });
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id",isLoggedIn ,wrapAsync(async(req,res)=>{
    let {id} = req.params;
    req.flash("success","The listing has been deleted");
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));


module.exports = router;