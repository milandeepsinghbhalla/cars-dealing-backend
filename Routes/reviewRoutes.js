const express = require('express');
// const userController = require("../Controllers/userController.js");
const authentication = require('../Middlewares/authentication.js');
const reviewsController = require('../Controllers/reviewsController.js');

const reviewRouter = express.Router();

reviewRouter.post("/post-review",authentication, reviewsController.postReview);
reviewRouter.post("/get-reviews", reviewsController.getReviews);
reviewRouter.post('/get-reviewBarData',reviewsController.getReviewBarData);


module.exports = reviewRouter;