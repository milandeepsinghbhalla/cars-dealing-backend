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
            newReview.rating = req.body.carRating
            newReview.reviewText = req.body.carReviewText
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
    },
    getReviews: async (req,res,next)=>{
        let page = req.body.page
        console.log('page:- ',page)
        let itemsPerPage = 5
        let count  = await Review.find({
            carId: req.body.carId
        }).countDocuments()
        let reviews = await Review.find({
            carId: req.body.carId
        })
        .skip(itemsPerPage * (page - 1))
        .limit(itemsPerPage)
        .populate({ path: 'reviewdBy', select: 'firstName lastName' })
        if(reviews){
            console.log('reviews',reviews);
            return res.status(200).json({
                message: 'reviews fetched successfully.',
                reviews: reviews,
                count: count
            })

        }
        return res.status(500).json({
            message: 'some server error.'
        })
    },
    getReviewBarData: async(req,res,next)=>{
        try{

            let oneStarReviews = await Review.find({
                carId: req.body.carId,
                rating: 1
            }).countDocuments()
            let twoStarReviews = await Review.find({
                carId: req.body.carId,
                rating: 2
            }).countDocuments()
            let threeStarReviews = await Review.find({
                carId: req.body.carId,
                rating: 3
            }).countDocuments()
            let fourStarReviews = await Review.find({
                carId: req.body.carId,
                rating: 4
            }).countDocuments()
            let fiveStarReviews = await Review.find({
                carId: req.body.carId,
                rating: 5
            }).countDocuments()
            let allReviews = {
                1: oneStarReviews,
                2: twoStarReviews,
                3: threeStarReviews,
                4: fourStarReviews,
                5: fiveStarReviews
            }
            return res.status(200).json({
                message: 'reviews retreived successfully.',
                allReviews
            })
        }
        catch(err){
            return res.status(500).json({
                message: 'some server error occured.',
                err: err.message
               
            })
        }
    }
        
    
}

module.exports = reviewsController;