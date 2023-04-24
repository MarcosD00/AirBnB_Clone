const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleErrorsForSpots } = require('../../utils/validation');


const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, SpotImages, Review, ReviewImage, Booking, sequelize, User, Sequelize } = require('../../db/models');
const booking = require('../../db/models/booking');
const { query } = require('express');
const router = express.Router();

const errorHandlerOfBookings = [
    check('startDate')
        .exists({ checkFalsy: true }),
    check('endDate')
        .exists({ checkFalsy: true })
        .custom((value, { req }) => {
            if (value <= req.body.startDate) {
                throw new Error('endDate cannot be on or before startDate');
            }
            return true
        }),
        handleErrorsForSpots
]

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
      handleErrorsForSpots
  ];

  

/*GET ALL SPOTS*/
router.get(
    '/', 
    async (req,res, next) => {
        const where = {}

        let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

        if (req.query.minLat && req.query.maxLat) where.lat = { [Op.gte]: Number(minLat), [Op.lte]: Number(maxLat) };

        if (req.query.minLat) where.lat = { [Op.gte]: Number(minLat) };

        if (req.query.maxLat) where.lat = { [Op.lte]: Number(maxLat) };

        if(req.query.minLng && req.query.maxLng) {where.lng = { [Op.gte]: Number(minLng), [Op.lte]: Number(maxLng) }};

        if (req.query.minLng) where.lng = { [Op.gte]: Number(minLng) };

        if (req.query.maxLng) where.lng = { [Op.lte]: Number(maxLng) };

        if (req.query.minPrice && req.query.maxPrice) {where.price = { [Op.gte]: Number(minPrice), [Op.lte]: Number(maxPrice) }};

        if (req.query.minPrice) where.price = { [Op.gte]: Number(minPrice) };

        if (req.query.maxPrice) where.price = { [Op.lte]: Number(maxPrice) };

        if (!page) page = 1;
        if (!size) size = 20;
    
        if (parseInt(page) > 10) page = 10;
        if (parseInt(size) > 20) size = 20;
    
        if (parseInt(page) && parseInt(size)) {
            query.limit = size;
            query.offset = size * (page - 1);
        };

        const spots = await Spot.findAll({
        where,
        include: [
            {
            model: SpotImages,
            attributes: ['url', 'preview']
            }
        ],
        limit: query.limit,
        offset: query.offset
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

//POST Create a new spot
router.post(
    '/',
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
        const err = {}
        if (!address) {
            err.address = "Street address is required";
        }
        if (!city) {
            err.city = 'City is required';
            };
        if (!state){
             err.state = 'State is required';
            };
        if (!country){
             err.country = 'Country is required';
            };
        if (!lat) {
            err.lat = 'Latitude is not valid';
            };
        if (!lng){
             err.lng = 'Longitude is not valid';
            };
        if (!name || name.length > 50){
             err.name = 'Name must be less than 50 characters';
            };
        if (!description) {
            err.description = 'Description is required';
            };
        if (!price) {
            err.price = 'Price per day is required';
            };
        if (Object.keys(err).length > 0) res.status(400).json({
                "message": "Validation Error",
                "statusCode": 400,
                err
            });

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

        if (!spotInfo) res.status(404).json({
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

        if (spotInfo.ownerId !== user.id) res.status(403).json({
            statusCode:403,
            message:"Info not found"
        })

        if (!spotInfo) res.status(404).json({
            statusCode: 404,
            message: "Spot couldn't be found",
        })
        

        const { address, city, state, country, 
                lat, lng, name, description, price } = req.body;

        const err = {}
        if (!address) {
            err.address = "Street address is required";
        }
        if (!city) {
            err.city = 'City is required';
            };
        if (!state){
                err.state = 'State is required';
            };
        if (!country){
                err.country = 'Country is required';
            };
        if (!lat) {
            err.lat = 'Latitude is not valid';
            };
        if (!lng){
                err.lng = 'Longitude is not valid';
            };
        if (!name || name.length > 50){
                err.name = 'Name must be less than 50 characters';
            };
        if (!description) {
            err.description = 'Description is required';
            };
        if (!price) {
            err.price = 'Price per day is required';
            };
        if (Object.keys(err).length > 0) res.status(400).json({
                "message": "Validation Error",
                "statusCode": 400,
                err
            });

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

        if (spot.ownerId !== user.id) res.status(403).json({
            statusCode:403,
            message:"Info not found"
        });

        if (!spot) res.status(404).json({
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
    restoreUser,
    async (req, res, next) => {
            
        const { user } = req;
        const { spotId } = req.params;
        const spotInfo = await Spot.findOne({where: { id: spotId }});
    
        if (!spotInfo) res.status(404).json({
            statusCode: 404,
            message: "Spot couldn't be found",
        });

        if (spotInfo.ownerId !== user.id) res.status(403).json({
            statusCode:403,
            message:'Info not found'
        })
    
    
        await spotInfo.destroy({where: { id: spotId }});

        res.status(200).json({
            statusCode: 200,
            message: 'Successfully deleted'
        })
    });

router.get(
    '/:spotId/reviews',
    async (req, res) => {
        const spotId = req.params.spotId;
        const spots = await Spot.findByPk(spotId);

        if (!spots) res.status(404).json({
                message: "Spot couldn't be found",
                statusCode: 404
            })

        const reviewsOfSpots = await Review.findAll({
            where: { spotId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                { 
                    model: ReviewImage,
                    attributes: ['id', 'url'] 
                },
            ]
        })
        res.status(200).json({
            Reviews: reviewsOfSpots 
        })
    });

router.post(
    '/:spotId/reviews',
    requireAuth,
    async (req, res) => {
        const { review, stars } = req.body;
        const spotId = req.params.spotId;
        const userId = req.user.id
        const spots = await Spot.findByPk(spotId);
        
        const reviewsOfSpots = await Review.findOne({
            where:{spotId: spotId, userId: userId}   
            });

        if (!spots) res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        });

        if (reviewsOfSpots) res.status(403).json({
            message: "User already has a review for this spot",
            statusCode: 403
        });


        const newReviewOfSpot = await Review.create({
            userId ,
            spotId,
            review,
            stars
        });
            
        res.status(201).json({newReviewOfSpot});
    });

router.post(
        "/:spotId/bookings",
        requireAuth,
        async (req, res) => {
            const spotId = req.params.spotId;
            const {user} = req;

            const {startDate , endDate} = req.body;
            const firstBookingDay = Date.parse(startDate);
            const lastBookingDay = Date.parse(endDate);
            const newDate = new Date();
            const today = Date.parse(newDate);

            const spots = await Spot.findByPk(spotId, { include: [{ model: Booking }]});
            
            if (!spots) res.status(404).json({
                message: "Spot couldn't be found",
                statusCode: 404
            });
    
            if (spots.ownerId === user.dataValues.id) res.status(403).json({
                    message: "This spot is owned by you",
                    statusCode: "403"
                });
            
            const spotObj = spots.toJSON();

            for(let spot of spotObj.Bookings) {
                const firstDay = Date.parse(spot.startDate);
                const lastDay = Date.parse(spot.endDay);

                if (today > endDate) res.status(403).json({
                        statusCode: 403,
                        message: "Past bookings can't be modified"
                    })

                if ((firstDay === lastBookingDay 
                || lastBookingDay === lastDay 
                || (lastBookingDay < lastDay 
                && lastBookingDay > lastDay)) 
                || (firstBookingDay === firstDay 
                || firstDay === firstBookingDay 
                || (firstDay < lastBookingDay 
                && firstDay > firstBookingDay))) res.status(403).json({
                    message: "Sorry, this spot is already booked for the specified dates",
                    statusCode: 403,
                    errors: {
                        startDate: "Start date conflicts with an existing booking",
                        endDate: "End date conflicts with an existing booking"
                    }
                })
            }
            const createBooking = await Booking.create({
                userId: user.dataValues.id,
                spotId: spotId,
                startDate,
                endDate
            })
            res.json(createBooking);
        });
    
        router.get('/:spotId/bookings',
        requireAuth,
        async (req, res) => {
            const userId = req.user.id;
            const spotId = req.params.spotId;
            const spot = await Spot.findByPk(req.params.spotId);
    

            if (!spot) {
                res.status(404).json({
                    message: "Spot couldn't be found",
                    statusCode: 404
                });
            }
    
            if (userId === spot.ownerId) {
                const bookings = await Booking.findAll({
                    where: {spotId: req.params.spotId},
                    include: [
                        {
                            model: User,
                            attributes: ['id', 'firstName', 'lastName']
                        }
                    ]
                })

                return res.status(200).json({ Booking: bookings })

            } 
                const bookings = await Booking.findAll({
                    where: {
                        spotId: spotId
                    },
                    attributes: ['spotId', 'startDate', 'endDate']
                })

                return res.status(200).json({ Booking: bookings })
            
        });
module.exports = router;