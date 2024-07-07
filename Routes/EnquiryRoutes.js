const express = require('express');
const authentication = require('../Middlewares/authentication');
const EnquiryController = require('../Controllers/EnquiryController');

const EnquiryRouter = express.Router()

EnquiryRouter.post('/send-enquiry',authentication,EnquiryController.sendEnquiry)
EnquiryRouter.post('/get-five-enquiries',EnquiryController.getFiveEnquiries)
EnquiryRouter.post('/complete-enquiry',EnquiryController.completeEnquiry)
EnquiryRouter.post('/delete-enquiry',EnquiryController.deleteEnquiry)



module.exports = EnquiryRouter;
