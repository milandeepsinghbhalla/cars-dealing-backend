require('dotenv').config({ path: '.env' });
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');

const app = express();
var cors = require('cors');
const userRouter = require('./Routes/userRoutes');
const User = require('./Models/User');
const Car = require('./Models/Car');
const carRouter = require('./Routes/carRoutes');
const path = require('path');
const Contact = require('./Models/Contact');
const sendEmail = require('./mailer');
const reviewRouter = require('./Routes/reviewRoutes');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(carRouter);
app.use(reviewRouter);
const staticPath = path.join(__dirname, 'uploads');
app.use(express.static(staticPath));

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'uploads'); // Set the destination directory for uploads
    },
    filename: function (req, file, callback) {
      callback(null, Date.now() + '-' + file.originalname); // Set the filename with timestamp
    }
  });
  
  const upload = multer({ storage: storage });

//   let arr = [{
//     name: 'carImg-0',
//     maxCount: 1
//   },
//   {
//     name: 'carImg-1',
//     maxCount: 1
//   },
//   {
//     name: 'carImg-2',
//     maxCount: 1
//   },
//   {
//     name: 'carImg-3',
//     maxCount: 1
//   }
// ]

// let arr = []


  app.post('/add-car', upload.array('images[]',7), async (req, res) => { // Limit to 10 files
    if (!req.files) {
      return res.status(400).json({message:'No images uploaded.'});
      console.log('image adding error');
    }
    try {
        let user = await User.findOne({email:req.body.email})
        console.log('user:- ',user)
        if(user.role!='admin'){
            return res.status(401).json({message: 'unauthorized'})
        }
        console.log('user:-',user);
        let adminid = user._id;

        let newCar = new Car();
        let { name, oldOrNew, carType, year,price,brand,engine,suspension,transmission,fuelType,mileage,seatingCapacity,color} = req.body;
        newCar.adminId = adminid;
        newCar.name = name;
        newCar.oldOrNew = oldOrNew;
        newCar.carType = carType;
        newCar.year  = year;
        newCar.price = price;
        newCar.brand = brand;
        newCar.engine = engine;
        newCar.mileage = mileage;
        newCar.suspension = suspension;
        newCar.transmission = transmission;
        newCar.fuelType = fuelType;
        newCar.seatingCapacity = seatingCapacity;
        newCar.color = color;
        let images = [] 
        // arr.map((obj)=>{
        //     let p = (req.files[obj.name][0]).path;
        //     images.push(p);
        // })
        console.log('files:- ',req.files);
        req.files.map((file)=>{
          console.log('file:- ',file);
            let path = file.filename ;
            images.push(path);
        })
        newCar.images = images;
        let savedCar = await newCar.save();
        if(!savedCar._id){
            let newError = {
                status : 401,
                message: 'error while adding car in server'
            }
            throw newError;
        }
        return res.status(201).json({message: 'added succefully...!!'})
        // req.body.carId = savedCar._id;
    // const uploadedImages = req.files.map(file => ({
    //   path: file.path, // Path to the uploaded file
      
    //   filename: file.originalname, // Original filename 
    // }));
  
    // Save image paths to your database or perform other operations
  
    // res.status(200).json({ message: 'Images uploaded successfully!', images: uploadedImages });
  }
  catch(err){
    console.log('error while adding car', err)
    return res.status(401).json({
        message: 'error while adding car'
    })
  }
}
);

app.post('/contact-us',async (req,res,next)=>{
  let newContact = new Contact()
  newContact.name = req.body.name;
  newContact.email = req.body.email;
  newContact.message = req.body.message;
  await newContact.save();
  return res.status(201).json({
    message: 'Your message have been received will be responded shortly.'
  })
})

app.post('/send-email', async (req, res) => {
  const { to } = req.body; // Get email details from request body
  try {
    await sendEmail(to, 'Welcome Subscribed to Japan Direct Autos Newsletter...!!!', 'You will be notified whenever a new car is added.');
    res.json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending email' });
  }
});

mongoose.connect(process.env.DATABASE_URL)
  .then(() => {
    console.log("Connection established...🔗");
    app.listen(process.env.PORT, () => {
      console.log(`Server running at port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("❌❌ Error connecting to server ❌❌", err));