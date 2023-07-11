const express = require('express');
const tourC = require('./../controler/tourControler');
const authColler =  require('./../controler/authController')




const router = express.Router()

// router.param('id', tourC.checkId);

router.route('/Top5cheap').get(tourC.aliasgetAllTours, tourC.getAlltour);
router.route('/tour-stats').get(tourC.getAllStats)
router.route('/monthly-plan/:year').get(tourC.getMonthlyPlan)

router
.route('/')
.get(tourC.getAlltour)
.post(tourC.createNewtour);

router
.route('/:id')
.get(tourC.findTour)
.patch(tourC.UpdateTour)
.delete(authColler.protect, authColler.restrictTo('admin', 'lead-guide'), tourC.DeleteTour);

module.exports = router

