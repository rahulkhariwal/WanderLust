const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const {
    isLoggedIn,
    isReviewAuthor,
    validateReview,
} = require("../middlewaer.js");

const ReviewController = require("../controller/review.js");

// Create Review
router.route("/")
    .post(
        isLoggedIn,
        validateReview,
        wrapAsync(ReviewController.createReview)
    );

// Delete Review
router.route("/:reviewId")
    .delete(
        isLoggedIn,
        isReviewAuthor,
        wrapAsync(ReviewController.destroyReview)
    );

module.exports = router;