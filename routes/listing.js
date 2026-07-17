const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {
    isLoggedIn,
    isOwner,
    validateListing,
} = require("../middlewaer.js");

const ListingController = require("../controller/listing.js");

// Index
router.get("/", wrapAsync(ListingController.index));

// New
router.get("/new",
    isLoggedIn,
    wrapAsync(ListingController.renderNewForm)
);

// Show
router.get("/:id",
    wrapAsync(ListingController.showListing)
);

// Create
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(ListingController.createListing)
);

// Edit
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(ListingController.renderEditForm)
);

// Update
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(ListingController.updateListing)
);

// Delete
router.delete("/:id",
    isLoggedIn,
    isOwner,
    wrapAsync(ListingController.destroyListing)
);

module.exports = router;