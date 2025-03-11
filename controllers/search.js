const Listing = require("../models/listing");

module.exports.search = async (req, res) => {
    let { name } = req.query;
    console.log(name);
    const allListings = await Listing.find({ title: new RegExp(name, 'i') });
    res.render("listings/search", { allListings });
};