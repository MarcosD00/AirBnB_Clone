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



module.exports = router;