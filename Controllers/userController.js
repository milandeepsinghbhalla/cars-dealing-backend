const User = require("../Models/User");
const bcryptjs = require("bcryptjs");
var salt = bcryptjs.genSaltSync(10);
const jwt = require("jsonwebtoken");
const secret = process.env.JWT_SECRET;

const userController = {
  addAdmin: async (req, res, next) => {
    try {
      let user = await User.find({
        email: req.body.email,
      });
      if (user.length != 0) {
        let newError = {
          status: 401,
          message: "user already exist",
        };
        throw newError;
      }
      let newUser = new User();
      newUser.email = req.body.email;
      newUser.firstName = req.body.firstName;
      newUser.lastName = req.body.lastName;

      let hash = bcryptjs.hashSync(req.body.password, salt);
      newUser.password = hash;
      newUser.role = "admin";
      newUser.save();
      return res.status(201).json({
        message: "added succefully..!!",
      });
    } catch (err) {
      console.log("error while seting up admin", err);
      return res.status(401).json({
        message: err.message,
      });
    }
  },
  loginAdmin: (req, res, next) => {
    try {
      let user = User.find({
        email: "milansinghdav@gmail.com",
      });
      if (user.length == 0) {
        let newError = {
          status: 404,
          message: "user not found",
        };
      }
      //check password
      if (bcryptjs.compareSync(req.body.password, user.password)) {
        return res.status(201).json({
          message: "Sign In successfull...!!!",
        });
      }
      return res.status(401).json({
        message: "wrong password...!!!",
      });
      // true
    } catch (err) {
      console.log("error while sign up:- ", err);
    }
  },
  signupUser: async (req, res, next) => {
    try {
      let userResult = await User.find({
        email: req.body.email,
      });
      if (userResult.length > 0) {
        let newError = {
          status: 401,
          message: "User with that email already exist",
        };
       
        throw newError;
      }
      let newUser = new User();
      let { firstName, lastName, email, password } = req.body;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.email = email;
      let hash = bcryptjs.hashSync(req.body.password, salt);
      newUser.password = hash;

      newUser.role = "customer";
      let savedUser = await newUser.save();
      return res.status(201).json({ message: "user Added successfully..!" });
    } catch (err) {
      console.log("error while signing up..!!", err);
      return res.status(401).json({ message: err.message });
    }
  },
  loginUser: async (req, res, next) => {
    try {
      let userResult = await User.find({
        email: req.body.email,
      });
      if (userResult.length == 0) {
        return res.status(401).json({
          message: "Wrong email or password.",
        });
      }
      console.log("userResult:- ", userResult);
      let hashedPassword = userResult[0].password;
      if (!bcryptjs.compareSync(req.body.password, hashedPassword)) {
        return res.status(401).json({
          message: "Wrong email or password.",
        });
      }
      let data = {...(userResult[0]._doc)};
      delete data.password;
      console.log('data:- ',data);
      const payload = data;
      const token = jwt.sign(payload, secret, { expiresIn: "2h" });
      return res.status(200).json({
        message: "Logged In succeessfully.",
        userData: {
          userToken: token,

          firstName: data.firstName,
          role: data.role,
        },
      });
    } catch (err) {
      console.log("error while signing up..!!", err);
      return res.status(401).json({ message: err.message });
    }
  },
  signUpGoogle: async (req,res,next)=>{
    const {firstName, lastName, email, role } = req.body;
    
    let user = await User.find({
      email: email
    });
    console.log('user data:-',user)
    if(user.length>0){

      if((user[0].role).toLowerCase() == 'admin'){
        return res.status(401).json({
          message: "scince you are a admin so use password to login."
        })
      }
    }
    let token = ""
    if(user.length> 0){
      const payload = user[0]._doc;
      token = jwt.sign(payload, secret, { expiresIn: "2h" });
    }
    else{
      user = new User();
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.role = role
      user = await user.save();
      const payload = user
      token = jwt.sign(payload, secret, { expiresIn: "2h" });
      
    }

    return res.status(200).json({
      message: "Logged In succeessfully.",
      userData: {
        userToken: token,

        firstName: firstName,
        role: role,
      },
    });


    // let savedUser = await user.save()



  },
  checkAdmin: (req,res,next)=>{
    console.log('user: ',req.user)
    if((req.user.role).toLowerCase() == 'admin'){
      return res.status(200).json({
        isAdmin: true
      })
    }
    else{
      return res.status(401).json({
        message: 'you are not authorized',
        isAdmin: false
      })
    }
  }
};

module.exports = userController;
