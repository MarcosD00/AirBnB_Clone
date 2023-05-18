
const express = require('express'); //This file will hold the resources for the route paths beginning with /api/spots.
const router = express.Router();
const { Spot, SpotImages, Review, ReviewImage, Booking, sequelize, User, Sequelize, Op} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

/* DELETE BOOKINGS BY BOOKING ID */
router.delete("/:bookingId",
    requireAuth,
    async (req, res) => {
        const userId = req.user.id;
        const today = new Date();

        const booking = await Booking.findByPk(req.params.bookingId)


        if (!booking) {
            return res.status(404).json({
                "message": "Booking couldn't be found",
                "statusCode": 404
            });
        }

        if (userId !== booking.userId) {
            return res.status(403).json({
                message: "Forbidden",
                statusCode: "403"
            });
        }

        if ( today >= booking.startDate ) return res.status(403).json({
                    message: "Bookings that have been started can't be deleted",
                    statusCode: 403
                });

        await booking.destroy({where: {id: booking, userId: userId}});
        res.status(200).json({
            "message": "Successfully deleted",
            "statusCode": 200
            });
    });

/*GET ALL THE BOOKINGS FROM CURRENT USER  */
router.get('/current', requireAuth, async (req, res) => {
    const bookings = await Booking.findAll({
        where: {userId: req.user.id}
    });

    const bookingList = []
    for (let i of bookings) {
        const spots = await Spot.findOne({
            where: {
                id: i.spotId
            },
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt']
            }
        });

        const dataForBook = {}
        for (let key in i.dataValues) dataForBook[key] = i[key]

        const dataForSpots = {}
        for (let key in spots.dataValues) dataForSpots[key] = spots[key]

        const image = await SpotImages.findOne({
            where: {spotId: spots["id"]},
            attributes: ['url']
        });

        dataForBook.Spot = dataForSpots
        dataForBook.Spot.previewImage = image || image.url
        bookingList.push(dataForBook)
    }
    res.status(200).json({Bookings: bookingList})
})


/* EDIT BOOKINGS BY ID */
router.put('/:bookingId',
    requireAuth,
    async (req, res, next) => {
        const { user } = req;
        let { startDate, endDate } = req.body;

        startDate = new Date(startDate);
        endDate = new Date(endDate);
        const currentDate = new Date();

        const bookings = await Booking.findByPk(req.params.bookingId);

        if (!bookings)
            return res.status(404).json({
                message: "Booking couldn't be found",
                statusCode: 404
            });

        if (bookings.userId !== user.id)
            return res.status(403).json({
                message: "Forbidden",
                statusCode: 403
            });

        const errorConflictResponse = {};
        const errorValidator = {};

        if (startDate < currentDate) errorValidator.startDate = "startDate cannot be before current date";
        if (endDate <= startDate) errorValidator.endDate = "endDate cannot be on or before startDate";

        if (Object.keys(errorValidator).length) 
            return res.status(400).json({
                message: "Validation error",
                statusCode: 400,
                errors: errorValidator,
            });

        if (bookings.endDate < currentDate) {
            const err = new Error("Past bookings can't be modified");
            err.status = 403;
            return next(err);
        };

        const bookingInExistence = await Booking.findAll({
            where: { spotId: bookings.spotId }
        });

        const listOfBookings = [];
        bookingInExistence.length ? bookingInExistence.forEach(booking => listOfBookings.push(booking.toJSON()))
            : listOfBookings.push(bookingInExistence);

            
        for (let book of listOfBookings) {
            if (book.id === parseInt(req.params.bookingId)) continue;

            if (!Object.keys(book).length) break;
            
            if (startDate >= book.startDate && endDate <= book.endDate) {
                errorConflictResponse.startDate = "Start date conflicts with an existing booking";
                errorConflictResponse.endDate = "End date conflicts with an existing booking";
            }
            else if (startDate.getTime() === book.startDate.getTime())
                errorConflictResponse.startDate = "Start date conflicts with an existing booking";
            else if (startDate < book.startDate && endDate > book.startDate)
                errorConflictResponse.endDate = "End date conflicts with an existing booking";
            else if (startDate > book.startDate && startDate < book.endDate) 
                errorConflictResponse.startDate = "Start date conflicts with an existing booking";
        };

        if (Object.keys(errorConflictResponse).length) {
            const err = Error("Sorry, this spot is already booked for the specified dates");
            err.errors = errorConflictResponse;
            err.status = 403;
            return next(err);
        };

        bookings.set({startDate, endDate});
        await bookings.save();
        res.status(200);
        res.json(bookings);
    });
module.exports = router;