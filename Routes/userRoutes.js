const express = require('express');
const userController = require("../Controllers/userController.js");

const userRouter = express.Router();

userRouter.post("/add-admin", userController.addAdmin);
userRouter.post("/signup-customer", userController.signupUser);
userRouter.post("/login-customer", userController.loginUser);

// userRouter.post('/login',userController.login)
//userRouter.post("/login", userController.login);

// edited router

module.exports = userRouter;