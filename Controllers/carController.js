const Car = require("../Models/Car");
const User = require("../Models/User");



const carController = {
    // addCar: (req,res,next)=>{
    //     // create new car instance
    //     try {
    //         let user = User.find({email:'milansinghdav@gmail.com'})
    //         if(user.length == 0){
    //             return res.status(401).json({message: 'unauthorized'})
    //         }
    //         let adminid = user[0]._id;

    //         let newCar = new Car();
    //         let { name, carType, year,price,brand,engine,suspension,transmission,fuelType,mileage,seatingCapacity,color} = req.body;
    //         newCar.adminId = adminid;
    //         newCar.name = name;
    //         newCar.carType = carType;
    //         newCar.year  = year;
    //         newCar.price = price;
    //         newCar.brand = brand;
    //         newCar.engine = engine;
    //         newCar.mileage = mileage;
    //         newCar.suspension = suspension;
    //         newCar.transmission = transmission;
    //         newCar.fuelType = fuelType;
    //         newCar.seatingCapacity = seatingCapacity;
    //         newCar.color = color;
            
    //         let savedCar = newCar.save();
    //         if(!savedCar._id){
    //             let newError = {
    //                 status : 401,
    //                 message: 'error while adding car in server'
    //             }
    //             throw newError;
    //         }
    //         req.body.carId = savedCar._id;
    //         next();

    //     }
    //     catch(err){
    //         console.log('car adding errors:- ',err)
    //         return res.status(401).json({
    //             message: 'error while adding car in server'
    //         })
    //     }

    //     // add data to instance
    //     // save car instance

    // }

    getNewCars: async (req,res,next)=>{

        let page = req.body.page;
        let itemsPerPage = 6;

        let cars = await Car.find({
            oldOrNew: 'New'
        }).skip(itemsPerPage * (page - 1)).limit(itemsPerPage)
        console.log('All new cars:- ',cars);
        res.status(200).json({
            message: 'All new Cars',
            cars: cars
        })

    },
    getUsedCars: async (req,res,next)=>{

        let cars = await Car.find({
            oldOrNew: 'Used'
        })
        console.log('All Used cars:- ',cars);
        res.status(200).json({
            message: 'All Used Cars',
            cars: cars
        })

    },
    getCar: async (req,res,next)=>{
        console.log('request reached...!!!');
        try{
            console.log('carId',req.body.carId)
            let car = await Car.findById(req.body.carId);
            console.log('car:-',car)
            if(!car){
                let newError = {
                    message: 'Car not found...!!!',
                    status: 404
                }
                throw newError
            }
            return res.status(200).json({
                message: 'car got successfully',
                car:car
            })

        }
        catch(err){
            console.log('error while getting car,:-',err);
            return res.status(500).json({message: 'error while adding car..!!!'})
        }
    }
}

module.exports = carController;