const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listings = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middlewaer.js");



router.get("/" , wrapAsync(async ( req ,res) => {
    const allListing = await Listings.find({}) ;
    res.render("listings/index.ejs" , {allListing});
}));

//Create Routes
router.get("/new" , isLoggedIn, wrapAsync(async(req, res) =>{
    res.render("listings/new.ejs" )
}));

//show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listings.findById(id).populate("reviews").populate("owner");
    console.log(listing.owner);
    if(!listing){
        req.flash("error", "Listing for which you requested does not exist!");
         return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

//create 
router.post("/" , isLoggedIn, validateListing, 
    wrapAsync(async(req, res) => {
    const newListing = new Listings(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing is Created!");
    res.redirect("/listings")
}
))

//Edit Route
router.get("/:id/edit" ,isLoggedIn, isOwner,
     wrapAsync(async (req ,res) => {
     let { id } = req.params;
    const listing = await Listings.findById(id);
    if(!listing){
        req.flash("error", "Listing for which you requested does not exist!");
         return res.redirect("/listings");
    }
    res.render("listings/edit.ejs" , {listing});
}))

//Update Route 
router.put("/:id",
    isLoggedIn,  
    isOwner,
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;

        await Listings.findByIdAndUpdate(id, req.body.listing);

        res.redirect("/listings");
    })
);

//Delete Route
router.delete("/:id",  isLoggedIn, isOwner,
    wrapAsync(async(req, res) =>{
    let{id} = req.params;
    let deleteListing = await Listings.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success" , "Listing Deleted!");
    res.redirect("/listings")
}));



module.exports = router;