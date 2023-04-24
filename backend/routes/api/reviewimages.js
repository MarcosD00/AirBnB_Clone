
const express = require('express'); //This file will hold the resources for the route paths beginning with /api/spots.
const router = express.Router();
const {Review, ReviewImage} = require('../../db/models');
const {restoreUser , requireAuth } = require('../../utils/auth');

/* DELETE REVIEW IMAGE BY IMAGE ID */
router.delete(
    '/:imageId',
    restoreUser, 
    requireAuth, 
    async (req, res, next) => {

    const { user } = req;

    const reviewImage = await ReviewImage.findByPk(req.params.imageId);
    const toBeDeleted = await Review.findOne({
        where: {
            id: reviewImage.reviewId
        }
    });

    if (!reviewImage) {
        return res.status(404).json({
            message: "Review Image couldn't be found",
            statusCode: 404
        })
    };


    if (user.id !== toBeDeleted.userId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    await reviewImage.destroy();
    res.status(200).json({
        message: "Successfully deleted",
        statusCode: res.statusCode
    })
});


module.exports = router;