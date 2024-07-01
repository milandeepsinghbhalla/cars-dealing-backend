const express = require('express');
const authentication = require('../Middlewares/authentication');
const EnquiryController = require('../Controllers/EnquiryController');

const EnquiryRouter = express.Router()

EnquiryRouter.post('/send-enquiry',authentication,EnquiryController.sendEnquiry)


module.exports = EnquiryRouter;
