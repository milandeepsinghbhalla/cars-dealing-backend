const Enquiry = require("../Models/Enquiry");
const nodemailer = require("nodemailer");

const EnquiryController = {
  sendEnquiry: async (req, res, next) => {
    // get details from req

    try {
        let user = req.user;
        let enquiry = await Enquiry.find({
          enquiredBy: user._id,
          carId: req.body.carId,
          completed: false,
        });
        if (enquiry.length > 0) {
          // already enquired
          return res.status(200).json({
            message: "Your enquiry is already in process.",
          });
        }
        // fill in db
        enquiry = new Enquiry();
        enquiry.enquiredBy = user._id;
        enquiry.enquirySubject = req.body.enquirySubject;
        enquiry.enquiryText = req.body.enquiryText;
        enquiry.carId = req.body.carId;
        enquiry.carLink = req.body.carLink;
        enquiry.completed = false;
        let savedEnquiry = await enquiry.save();
        // send email to admin
        const transport = nodemailer.createTransport({
          service: "gmail",
          auth: {
            type: "OAuth2",
            user: "milansinghdav@gmail.com",
            password: process.env.EMAIL_PASS,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN,
            //   accessToken: accessToken,
          },
        });
    
        const htmlContent = ` 
                    <h1>You Have a new enquiry</h1>
                    <h3>User Data</h3>
                    <table style="margin:3em">
                        
      <thead>
        <tr>
          <th>Properties</th>
          <th>Values</th>
          </tr>
      </thead>
      <tbody>
        <tr>
          <td>Name </td>
          <td>${user.firstName} ${user.lastName}</td>
          </tr>
        <tr>
          <td>Email</td>
          <td>${user.email}</td>
          </tr>
      </tbody>
      </table>
                    <h3>Car Details Link </h3>
                    <p>${req.body.carLink}</p>
                    <h4>User subject: ${req.body.enquirySubject}</h4>
                    <p>Enquiry:- ${req.body.enquiryText}</p>
                    <h4>Enquiry Id:- ${savedEnquiry._id}</h4>
    
                `;
                const mailOptions = {
                    from: "milansinghdav@gmail.com",
                    to: "milansinghdav@gmail.com",
                    subject:
                      "Important: New Enquiry",
                    html: htmlContent,
                  };
                await transport.sendMail(mailOptions);
                return res.status(201).json({
                   message: 'Enquiry is sent to one of our representative. You will be contacted soon via email.' 
                })
    } catch (error) {
        console.log('error while sending Enquiry:-',error)
        return res.status(500).json({
            message: 'Some server error occured.'
        })
    }
   
  },
};

module.exports = EnquiryController
