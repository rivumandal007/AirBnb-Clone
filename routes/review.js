const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");
const { createReview } = require("../controllers/review.js");
const reviewController = require("../controllers/review.js");


//Review Route

router.post("/", validateReview, isLoggedIn, wrapAsync (reviewController.createReview));

//delete review 

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));
module.exports = router;