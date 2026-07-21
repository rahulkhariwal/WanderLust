const Listings = require("../models/listing");
const Review = require("../models/review");

// Create Review
module.exports.createReview = async (req, res) => {
    const listing = await Listings.findById(req.params.id);

     console.log("Listing Geometry:", listing.geometry);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

// Delete Review
module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listings.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};