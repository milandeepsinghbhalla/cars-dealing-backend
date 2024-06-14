const Review = require("../Models/Review")


const reviewsController = {

    postReview : async (req,res,next)=>{

        try {

            console.log('user:- ',req.user);
            let lastReview = await Review.find({
                carId: req.body.carId,
                userId: req.user._id
            })
            if(lastReview.length >0){
                let newError = {
                    message: 'you have already added a review',
                    review: lastReview[0],
                    status: 401
                }
                throw newError;
            }
            let newReview = new Review();
            newReview.carId = req.body.carId
            newReview.reviewdBy = req.user._id
            newReview.rating = req.body.rating
            newReview.reviewText = req.body.reviewText
            newReview.createdAt = Date.now()
            let savedReview = await newReview.save()
            if(!savedReview){
                let newError = {
                    message: 'some technichal error',
                    review: lastReview[0],
                    status: 500
                }
                throw newError;
            }

            return res.status(201).json({
                message: 'review posted',
                reviewData: savedReview
            })
        }
        catch(err){
            console.log('error while creating review',err);
            let status = err.status || 500
            return res.status(status).json({
                message: 'server error',
                err: err
            })
        }
    }
}