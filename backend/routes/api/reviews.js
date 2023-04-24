const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, SpotImages, Review, ReviewImage, Booking, sequelize, User, Sequelize } = require('../../db/models');
const router = express.Router();

router.get('/current',
    requireAuth,
    async (req, res) => {
        const{user} = req;
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


          if (review.Spot.SpotImages.length !== 0) {

            const preview = review.Spot.SpotImages.filter(i => i.preview === true);

            if (!preview.length) {
              review.Spot.previewImage = preview[0].url
            } else review.Spot.previewImage = "No Preview Image Available";
          }
          else {
            review.Spot.previewImage = "No Preview Image Available";
          }
        }

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

      const review = await Review.findByPk(reviewId, {
        include: [{ model: ReviewImage }]
      });
          
      const newRevImages = await ReviewImage.create({
        reviewId,
        url
     });

      const revList = await ReviewImage.findAll({
          where: { reviewId }
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

      res.json({id: newRevImages.id, url: newRevImages.url});
    });

router.put('/:reviewId', 
    requireAuth,
    async(req, res) => {
        const userId = req.user.id;
        const reviewId = (req.params.reviewId);

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

        const updatedReviewList = await reviewList.update({
            review,
            stars
        });
    res.status(200).json(updatedReviewList);
});

router.delete(
    '/:reviewId',
    requireAuth,
    async (req, res, next) => {
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