const express = require('express');
const subscriberController = require("../Controllers/subscriberController.js");

const subscriberRouter = express.Router();

subscriberRouter.post("/subscribe", subscriberController.sendProductAddedEmail);

module.exports = subscriberRouter;