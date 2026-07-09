const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js"); 
const Listings = require("../models/listing.js");



//listing validation
const validateListing = (req , res , next) => {
    const {error} = listingSchema.validate(req.body);
    console.log(req.body); 
    if(error){
        console.log(error.details);
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400 , errMsg);
    }else{
        next();
    }
}


router.get("/" , wrapAsync(async ( req ,res) => {
    const allListing = await Listings.find({}) ;
    res.render("listings/index.ejs" , {allListing});
}));

//Create Routes
router.get("/new" , wrapAsync(async(req, res) =>{
    res.render("listings/new.ejs" )
}));

//show Route
router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listings.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//create 
router.post("/" , validateListing, 
    wrapAsync(async(req, res) => {
    const newListing = new Listings(req.body.listing);
    await newListing.save();
    res.redirect("/listings")
}
))

//Edit Route
router.get("/:id/edit" , wrapAsync(async (req ,res) => {
     let { id } = req.params;
    const listing = await Listings.findById(id);
    res.render("listings/edit.ejs" , {listing});
}))

//Update Route 
router.put("/:id", validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;

        await Listings.findByIdAndUpdate(id, req.body.listing);

        res.redirect("/listings");
    })
);

//Delete Route
router.delete("/:id",  wrapAsync(async(req, res) =>{
    let{id} = req.params;
    let deleteListing = await Listings.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings")
}));



module.exports = router;