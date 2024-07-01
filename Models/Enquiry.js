const mongoose = require("mongoose");

const EnquirySchema = new mongoose.Schema({

    enquiredBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: false 
    },
    enquirySubject: String,
    enquiryText: String,
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Car",
        unique: false 
    },
    carLink: String,
    // status: String,
    completed: Boolean
})

const Enquiry = mongoose.model("Enquiry", EnquirySchema);

module.exports =  Enquiry

