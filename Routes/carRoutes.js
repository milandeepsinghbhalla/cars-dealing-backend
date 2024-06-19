const express = require('express');
const carController = require('../Controllers/carController');
// const userController = require("../Controllers/userController.js");

const carRouter = express.Router();

// userRouter.post("/profile-setup", userController.profileSetup);
// userRouter.post('/login',userController.login)
//userRouter.post("/login", userController.login);

carRouter.post('/get-new-cars',carController.getNewCars)
carRouter.get('/get-used-cars',carController.getUsedCars)
carRouter.post('/get-car',carController.getCar)


// edited router

module.exports = carRouter;