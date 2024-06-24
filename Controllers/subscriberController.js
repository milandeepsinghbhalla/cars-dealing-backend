const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const Car = require("../Models/Car");
const subscriberController = {
  sendProductAddedEmail: async (req, res, next) => {
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //       type: 'OAuth2',
    //       user: secure_configuration.milansinghdav@gmail.com,
    //       pass: secure_configuration.Milansingh@1,
    //       clientId: secure_configuration.808418854320-gdljs4ete1786h97oa8at7ibhuhfi6pq.apps.googleusercontent.com,
    //       clientSecret: secure_configuration.CLIENT_SECRET,
    //       refreshToken: secure_configuration.REFRESH_TOKEN
    //     }
    //   });
    try {
      const carData = await Car.find({}).limit(3);

    //   const oauth2Client = new google.auth.OAuth2(
    //     "378521593401-9b7n8l6qtbfkc2ob28e6umqtj5ukacmc.apps.googleusercontent.com",
    //     "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",
    //     "https://developers.google.com/oauthplayground"
    //   );

    //   oauth2Client.setCredentials({
    //     refresh_token: "1//04ZhYQJ5_ygf3CgYIARAAGAQSNwF-L9Ir4FXp6efawGLvZ2hM2rwQYUlnRpI57ZIemAi_iWhiioxRNYWiowiC6le-D3I70S0CQrg",
    //   });

    //   const accessToken = await oauth2Client.getAccessToken();

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
        <h1>Latest Cars Added to Our Collection!</h1>
    <p>We're excited to announce the arrival of three new cars to our collection:</p>
    <div style="display: flex; flex-wrap: wrap; justify-content: space-around;">
      ${carData
        .map(
          (car) => `
        <div style="background-color: #f1f1f1; padding: 1rem; border-radius: 5px; margin: 1rem;">
          <img src="${car.images[0]}" alt="${
            car.name
          }" style="width: 100%; height: auto; display: block; object-fit: cover;">
          <h2>${car.name}</h2>
        
          <a href="${"http://localhost:5173/" + car._id}">View Details</a>
        </div>
      `
        )
        .join("")}
    </div>
    <p>Don't miss out on these beauties! Visit our website to explore our entire collection.</p>
    <p>Sincerely,</p>
    <p>The [Your Company Name] Team</p>
      `;
      const mailOptions = {
        from: "milansinghdav@gmail.com",
        to: req.body.to,
        subject:
          "Cruise into Excellence: Unveiling Our Latest Trio of Cutting-Edge Cars!",
        html: htmlContent,
      };

      // const mailConfigurations = {
      //     from: 'milan.bhalla.personal@gmail.com',
      //     to: req.body.email,
      //     subject: 'Cruise into Excellence: Unveiling Our Latest Trio of Cutting-Edge Cars!',
      //     html: htmlContent

      // }

      let result = await transport.sendMail(mailOptions);

      console.log("email - result", result);
      res.status(201).json({ message: "email sent successfully." });
    } catch (error) {
      console.log("email err:-", error);
    }
  },
};

module.exports = subscriberController;
