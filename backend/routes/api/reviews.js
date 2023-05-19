const express = require('express');
const { check } = require('express-validator');
const { handleErrorsForSpots } = require('../../utils/validation');

const {requireAuth,  restoreUser } = require('../../utils/auth');
const { Spot, SpotImages, Review, ReviewImage, User, } = require('../../db/models');
const router = express.Router();

// router.get('/current', requireAuth, async (req, res) => {

//   let reviews = await Review.findAll({
//       where: {userId: req.user.id}
//   })
//   let reviewAnswer = []
//   for (let review of reviews) {
//       let reviewPayload = {}
//       let spot = await Spot.findOne({
//           where: {id: review.spotId},
//           attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
//       })
//       let preview = await SpotImages.findOne({
//           where: {spotId: spot.id},
//           attributes: ['url']
//       })
//       let reviewImages = await ReviewImage.findAll({
//           where: {reviewId: review.id},
//           attributes: ['id', 'url']
//       })
//       for(let key in review.dataValues) reviewPayload[key] = review[key]
//       let spotPOJO = {}
//       for (let key in spot.dataValues) spotPOJO[key] = spot[key]
//       spotPOJO.previewImage = preview ? JSON.stringify(preview.url).split('"')[1]
//       : 'No preview available'
//       let {id, firstName, lastName} = req.user
//       reviewPayload.User = {id, firstName, lastName}
//       reviewPayload.Spot = spotPOJO
//       reviewPayload.ReviewImages = reviewImages
//       reviewAnswer.push(reviewPayload)
//   }
//   if (!reviews.length) {
//       res.status(404).json({
//           message: 'No reviews found',
//           statusCode: 404
//       })
//   }
//   res.status(200).json({Review: reviewAnswer})
// })
router.get('/current',
    requireAuth,
    async (req, res) => {
        const where = {}
        const reviews = await Review.findAll(
        {
            where: {userId: req.user.id},

            include: [
                {
                    model: Spot,
                    attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
                    include: [{model: SpotImages}]
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                },
                {
                    model: User,
                    attibutes: ['id', 'firstName', 'lastName']
                },
            ]
        });

        const revList = [];
        if (reviews.length) {
          reviews.forEach( i => revList.push( i.toJSON()))
        } else if (!reviews.length) revList.push(reviews);
    
        for (let review of revList) {
          if (Object.keys(review).length === 0) break;


          // if (review.Spot.length !== 0) {
          if (review.Spot.SpotImages.length !== 0) {
            // const preview = review.Spot.filter(i => i.preview === true);
            const preview = review.Spot.SpotImages.find(i => i.preview === true);

            
            if (preview) {
              review.Spot.previewImage = preview.url;

              delete review.Spot.SpotImages
            } else review.Spot.previewImage = "No Preview Image Available";
            
          }
          else {
            review.Spot.previewImage = "No Preview Image Available";
          };
        };

        res.status(200).json(
            { 
                Reviews: revList
            });
    
    })

router.post(
    '/:reviewId/images',
    requireAuth,
    async (req, res) => {

      const userId = req.user.id
      const reviewId = (req.params.reviewId)
      const { url } = req.body

      const revList = await ReviewImage.findAll({
        where: { reviewId }
      });

      const review = await Review.findByPk(reviewId, {
        include: [{ model: ReviewImage }]
      });

      if (revList.length >= 10) res.status(403).json({
        "message": "Maximum number of images for this resource was reached",
        "statusCode": 403
      });
      
      if (!review) res.status(404).json({
          message: "Review couldn't be found",
          "statusCode": 404
        });
  
      if (userId !== review.userId) res.status(403).json({
          message: "Forbidden",
          statusCode: "403"
        });
        
      const newRevImages = await ReviewImage.create({
        reviewId,
        url
     });

      res.json({id: newRevImages.id, url: newRevImages.url});
    });

const validateEditReview = [
    check('review')
        .exists({ checkFalsy: true })
        .withMessage('Review text is required'),
    check('stars')
        .isInt({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
        handleErrorsForSpots,
    ];

router.put('/:reviewId', 
    requireAuth,
    async(req, res) => {
        const userId = req.user.id;

        const reviewList = await Review.findByPk(req.params.reviewId);

        if (!reviewList) res.status(404).json({
            message: "Review couldn't be found",
            "statusCode": 404
          });
    
        if (userId !== reviewList.userId) res.status(403).json({
            message: "Forbidden",
            statusCode: "403"
          });

        const { review, stars } = req.body;
        let err = {};

        if ( stars > 5 ||!stars || stars < 1){
             err.stars = 'Stars must be an integer from 1 to 5';
            };
        if (!review) {
            err.review = "Review text is required";
            };
        if (err.review || err.stars) {
            res.status(400).json({
                "message": "Validation error",
                "statusCode": 400,
                err
            });
        };

        const updatedReviewList = await reviewList.update({
            review,
            stars
        });
    res.status(200).json(updatedReviewList);
});

router.delete(
    '/:reviewId',
    restoreUser,
    requireAuth,
    async (req, res, _next) => {
        const userId = req.user.id
        const reviewId = req.params.reviewId
        const review = await Review.findByPk(reviewId)
    
        if (!review) res.status(404).json({
            statusCode: 404,
            message: "Review couldn't be found",
        })

        if (review.userId !== userId) res.status(403).json({
            statusCode:403,
            message:'Info not found'
        })
    
    
        await review.destroy();

        res.status(200).json({
            statusCode: 200,
            message: 'Successfully deleted'
        })
    });
    


module.exports = router;