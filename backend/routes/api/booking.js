
const express = require('express'); //This file will hold the resources for the route paths beginning with /api/spots.
const router = express.Router();
const { Spot, SpotImages, Review, ReviewImage, Booking, sequelize, User, Sequelize } = require('../../db/models');
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
router.put(
    '/:bookingId',
    requireAuth,
    async (req, res, next) => {
        const { user } = req;
        const bookingId = req.params.bookingId;
        const { startDate, endDate } = req.body;

        const startDay = new Date(startDate);
        const endDay = new Date(endDate);
        const today = new Date();


        const booking = await Booking.findByPk(bookingId);
        
        if (!booking) {
            return res.status(404).json({
                message: "Booking couldn't be found",
                statusCode: 404
            })
        };

        if (booking.userId !== user.id) {
            return res.status(403).json({
                message: "Forbidden",
                statusCode: 403
            })
        };
        const dateErrors = {};
        
        if ( startDay >= endDay ) dateErrors.endDay = "endDate cannot be on or before startDate"
        if ( today > startDay ) {
            dateErrors.startDay = "startDate cannot be before current date"
        }
        if (Object.keys(dateErrors).length) return res.status(400).json({
                message: "Validation error",
                statusCode: 400,
                errors: dateErrors,
            });

        if (booking.endDay < today) {
            const err = new Error("Past bookings can't be modified");
            err.status = 403;
            return next(err);
        }

        const allBookings = await Booking.findAll({
            where: { spotId: booking.spotId }
        })
        const conflictErrors = {};
        const listOfBookings = [];
        if ( allBookings.length ) {

            allBookings.forEach(booking => listOfBookings.push(booking.toJSON()));
            listOfBookings.push(allBookings);

        };

        for ( book of listOfBookings ) {

            if (Object.keys(book).length === 0) break;
            if (book.id === parseInt(bookingId)) {
                continue;
            };
            if (startDay >= book.startDay && endDay <= book.endDay) {
                conflictErrors.startDay = "Start date conflicts with an existing booking";
                conflictErrors.endDay = "End date conflicts with an existing booking";
            };
            if (startDay.getTime() === book.startDay.getTime()) conflictErrors.startDay = "Start date conflicts with an existing booking";
            if (startDay < book.startDay && endDay > book.startDay) conflictErrors.endDay = "End date conflicts with an existing booking";
            if (startDay > book.startDay && startDay < book.endDay) conflictErrors.startDay = "Start date conflicts with an existing booking";
        };

        if (Object.keys(conflictErrors).length) {
            const err = Error("Sorry, this spot is already booked for the specified dates");
            err.errors = conflictErrors;
            err.status = 403;
            return next(err);
        };

        booking.set({startDay, endDay})
        await booking.save();
        res.status(200);
        res.json(booking);
    });

module.exports = router;