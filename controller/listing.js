const Listings = require("../models/listing.js");

// Index Route
module.exports.index = async (req, res) => {
    const allListings = await Listings.find({});
    res.render("listings/index.ejs", { allListings });
};

// Render New Form
module.exports.renderNewForm = (req, res) => {
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
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

// Create Listing
module.exports.createListing = async (req, res) => {
    const newListing = new Listings(req.body.listing);

    newListing.owner = req.user._id;

    await newListing.save();

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

    await Listings.findByIdAndUpdate(id, req.body.listing);

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