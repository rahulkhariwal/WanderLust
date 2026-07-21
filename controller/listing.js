const Listings = require("../models/listing.js");

const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Index Route
module.exports.index = async (req, res) => {
    const allListings = await Listings.find({});
    res.render("listings/index.ejs", { allListings });
};

// Render New Form
module.exports.renderNewForm = async (req, res) => {
    res.render("listings/new.ejs");
};

// Show Listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listings.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing for which you requested does not exist!");
        res.render("listings/show.ejs", {
            listing,
            mapToken: process.env.MAP_TOKEN,
        });
    }

    res.render("listings/show.ejs", { listing , mapToken: process.env.MAP_TOKEN});
};

// Create Listing
module.exports.createListing = async (req, res) => {
        const response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listings(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url , filename};
    newListing.geometry = response.body.features[0].geometry;
    let saveListing = await newListing.save();
    console.log(saveListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

// Render Edit Form
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;

    const listing = await Listings.findById(id);

    if (!listing) {
        req.flash("error", "Listing for which you requested does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
};

// Update Listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listings.findByIdAndUpdate(id, req.body.listing, {
        new: true,
    });
    if (req.file) {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {
            url,
            filename,
        };
        await listing.save();
    }
    req.flash("success", "Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
};

// Delete Listing
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;

    await Listings.findByIdAndDelete(id);

    req.flash("success", "Listing Deleted Successfully!");
    res.redirect("/listings");
};


module.exports.index = async (req, res) => {

    let allListings;

    if(req.query.search){

        const search = req.query.search;

        allListings = await Listings.find({
            $or: [
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
                { title: { $regex: search, $options: "i" } }
            ]
        });

    }else{

        allListings = await Listings.find({});

    }

    res.render("listings/index.ejs",{allListings});

};