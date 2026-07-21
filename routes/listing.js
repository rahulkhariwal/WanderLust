const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {
    isLoggedIn,
    isOwner,
    validateListing,
} = require("../middlewaer.js");
const ListingController = require("../controller/listing.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage});

// Index & Create
router.route("/")
    .get(wrapAsync(ListingController.index))
    .post(
        isLoggedIn,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(ListingController.createListing)
    );
    

// New
router.route("/new")
    .get(
        isLoggedIn,
        wrapAsync(ListingController.renderNewForm)
    );

// Show, Update & Delete
router.route("/:id")
    .get(wrapAsync(ListingController.showListing))
    .put(
        isLoggedIn,
        isOwner,
        upload.single("listing[image]"),
        validateListing,
        wrapAsync(ListingController.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(ListingController.destroyListing)
    );

// Edit
router.route("/:id/edit")
    .get(
        isLoggedIn,
        isOwner,
        wrapAsync(ListingController.renderEditForm)
    );

module.exports = router;