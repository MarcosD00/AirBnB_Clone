const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, SpotImages, Review, ReviewImage, Booking, sequelize, User, Sequelize } = require('../../db/models');
const router = express.Router();

//GET all spots
router.get(
    '/', 
    async (req,res, next) => {
        const where = {}
        const spots = await Spot.findAll({
        where,
        include: [
            {
            model: SpotImages,
            attributes: ['url', 'preview']
            }
        ],
        // limit: query.limit,
        // offset: query.offset
    });

    const spotObj = [];
    spots.length ?
    spots.forEach(spot => spotObj.push(spot.toJSON()))
    : spotObj.push(spots);

    for(let spot of spotObj){
        if(!Object.keys(spot).length) break;
        const review = await Review.findOne({
            where: {
                spotId: spot.id
            },
            attibutes: [
                [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
            ]
        })
        if (review) {
            spot.avgRating = Number(review.toJSON().avgRating).toFixed(1);
        } else {
            spot.avgRating = " No Review exist for this spot"
        }

        if(spot.SpotImages.length) {
            const filterTrue = spot.SpotImages.filter(image => image.preview === true);
            filterTrue.length ? spot.previewImage = filterTrue[0].url : spot.previewImage = "No Preview Image Available"
        } else {
            spot.previewImage = "No Preview Image Available";
        }
        delete spot.SpotImages;
    };
    res.status(200);
    res.json({
        Spots: spotObj
    })
});

//get all spots from current
router.get(
    '/current',
    requireAuth,
    async  (req, res) => {
        const{user} = req;
        const where = {}
        const spots = await Spot.findAll({
            where: {ownerId: user.id},
            include: [
                {
                model: SpotImages,
                attributes: ['url', 'preview']
                }
            ],
            // limit: query.limit,
            // offset: query.offset
        });
    
        const spotObj = [];
        spots.length ?
        spots.forEach(spot => spotObj.push(spot.toJSON()))
        : spotObj.push(spots);
    
        for(let spot of spotObj){
            if(!Object.keys(spot).length) break;
            const review = await Review.findOne({
                where: {
                    spotId: spot.id
                },
                attibutes: [
                    [sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']
                ]
            })
            if (review) {
                spot.avgRating = Number(review.toJSON().avgRating).toFixed(1);
            } else {
                spot.avgRating = " No Review exist for this spot"
            }
    
            if(spot.SpotImages.length) {
                const filterTrue = spot.SpotImages.filter(image => image.preview === true);
                filterTrue.length ? spot.previewImage = filterTrue[0].url : spot.previewImage = "No Preview Image Available"
            } else {
                spot.previewImage = "No Preview Image Available";
            }
            delete spot.SpotImages;
        };
        res.status(200);
        res.json({
            Spots: spotObj
        })
    });

const SpotValidator = [
  check('address')
    .notEmpty()
    .withMessage('Street address is required'),
  check('city')
    .notEmpty()
    .withMessage('City is required'),
  check('state')
    .notEmpty()
    .withMessage('State is required'),
  check('country')
    .notEmpty()
    .withMessage('Country is required'),
  check('lat')
    .notEmpty()
    .isNumeric()
    .withMessage('Latitude is not valid'),
  check('lng')
    .notEmpty()
    .isNumeric()
    .withMessage('Longitude is not valid'),
  check('name')
    .notEmpty()
    .isLength({ max: 50 })
    .withMessage('Name must be less than 50 characters'),
  check('description')
    .notEmpty()
    .withMessage('Description is required'),
  check('description')
    .notEmpty()
    .withMessage('Price per day is required'),
    handleValidationErrors
];

//POST Create a new spot
router.post(
    '/',
    SpotValidator,
    requireAuth,
    async (req,res, next) => {
      const { user } = req;
      const { address, city, state, country, lat, lng, name, description, price } = req.body;
  
    if (!user) {
      const err = new Error('Login to create a spot');
       err.status = 401;
       err.title = 'Login failed';
       err.errors = { credential: 'The provided credentials were invalid.' };
           return next(err);
        }

const newSpots = await Spot.create({ownerId: user.id, address, city, state, country, lat, lng, name, description, price});


    const safeUser = {
          ownerId: user.id,
          address: address,
          city: city,
          state: state,
          country: country,
          lat: lat,
          lng: lng,
          name: name,
          description: description,
          price: price
        };  

    await setTokenCookie(res, safeUser);

    res.statusCode = 201;
    res.json({
      newSpots: safeUser  
    })
    
  }
);

router.get(
    '/:spotId',
    requireAuth,
    async (req, res, next) => {
        const { spotId } = req.params;
        const spotInfo = await Spot.findOne({where: { id: spotId }});

        if(!spotInfo)res.status(404).json({
            statusCode: 404,
            message: "Spot couldn't be found",
        })

        const spot = await Spot.findOne({
            where: 
            {
                Id: spotId
            },
            attibutes: [
                [sequelize.fn('AVG', sequelize.col('Review.stars')), 'avgRating'],
                [sequelize.fn('COUNT', sequelize.col('Review.stars')), 'numReviews']
            ],
            include: [
                {
                    model: User, 
                    attributes: ['id', 'firstName', 'lastName'],
                    as: 'Owner'
                },
                {
                    model: SpotImages,
                    attributes: ['id', 'url', 'preview'],
                }
                ]
            })

        res.status(200);
        res.json({spot})
    });

// Edit spots by Id
router.put(
    '/:spotId',
    requireAuth,
    async (req, res, next) => {
        
        const { user } = req;
        const { spotId } = req.params;
        const spotInfo = await Spot.findOne({where: { id: spotId }});

        if(spotInfo.ownerId !== user.id)res.status(403).json({
            statusCode:403,
            message:"Info not found"
        })

        if(!spotInfo)res.status(404).json({
            statusCode: 404,
            message: "Spot couldn't be found",
        })

        const { address, city, state, country, 
                lat, lng, name, description, price } = req.body;

            spotInfo.set({
                address: address,
                city: city,
                state: state,
                country: country,
                lat: lat,
                lng: lng,
                name: name,
                description: description,
                price: price
            })
        await spotInfo.save()

        res.status(200).json(spotInfo)
    });

router.post(
    '/:spotId/images', 
    requireAuth,
    async (req, res) => {

        const { url, preview } = req.body
        const { user } = req;
        const { spotId } = req.params;

        const spot = await Spot.findOne({where: { id: spotId }});
        const image = await SpotImages.create({
            spotId , url, preview
        });

        if(spot.ownerId !== user.id)res.status(403).json({
            statusCode:403,
            message:"Info not found"
        });

        if(!spot)res.status(404).json({
            statusCode: 404,
            message: "Spot couldn't be found",
        });

        const imageSpot = {
            id: image.id,
            url: url,
            preview: preview
        };
        res.status(200).json(imageSpot)
    });

router.delete(
    '/:spotId',
    requireAuth,
    async (req, res, next) => {
            
        const { user } = req;
        const { spotId } = req.params;
        const spotInfo = await Spot.findOne({where: { id: spotId }});
    
        if(spotInfo.ownerId !== user.id)res.status(403).json({
            statusCode:403,
            message:'Info not found'
        })
    
        if(!spotInfo)res.status(404).json({
            statusCode: 404,
            message: "Spot couldn't be found",
        })
    
        await spotInfo.destroy({where: { id: spotId }});

        res.status(200).json({
            statusCode: 200,
            message: 'Successfully deleted'
        })
        });
    
module.exports = router;