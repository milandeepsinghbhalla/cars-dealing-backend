const express = require('express');
// const userController = require("../Controllers/userController.js");
const authentication = require('../Middlewares/authentication.js');
const reviewsController = require('../Controllers/reviewsController.js');

const reviewRouter = express.Router();

reviewRouter.post("/post-review",authentication, reviewsController.postReview);


module.exports = reviewRouter;