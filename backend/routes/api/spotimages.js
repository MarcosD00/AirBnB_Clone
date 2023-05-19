
const express = require('express'); //This file will hold the resources for the route paths beginning with /api/spots.
const router = express.Router();
const { Spot, SpotImages} = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth');


router.delete(
    '/:imageId',
    requireAuth, 
    async (req, res, next) => {

    const spotImg = await SpotImages.findByPk(req.params.imageId)
    
    if (!spotImg) {
        return res.status(404).json({
            message: "Spot Image couldn't be found",
            statusCode: 404
        })
    };
    const spotImgToDestroy = await Spot.findOne({where : {id: spotImg.spotId, ownerId: req.user.id}})
    
    if (!spotImgToDestroy) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    }

    await spotImg.destroy();
    return res.status(200).json({
        message: "Successfully deleted",
        statusCode: res.statusCode
    })
});


module.exports = router;