var express = require('express');
var router = express.Router();

var ctrlHotels = require('../controllers/hotels.controllers.js');
var ctrlReviews = require('../controllers/reviews.controllers.js');
var ctrlUsers = require('../controllers/users.controllers.js');

router
  .route('/hotels')
  .get(ctrlHotels.hotelsGetAll)
  .post(ctrlHotels.hotelsAddOne);
    
router
    .route('/hotels/:hotelId')
    //creating a url route for data
    .get(ctrlHotels.hotelsGetOne)
    .put(ctrlHotels.hotelsUpdateOne)
    .delete(ctrlHotels.hotelsDeleteOne);

//Review routes
router
  .route('/hotels/:hotelId/reviews')
  .get(ctrlReviews.reviewsGetAll)
//must be logged in to post reviews
  .post(ctrlUsers.authenticate, ctrlReviews.reviewsAddOne);
  
router
    .route('/hotels/:hotelId/reviews/:reviewId')
    //creating a url route for data
    .get(ctrlReviews.reviewsGetOne)
    .put(ctrlReviews.reviewsUpdateOne)
    .delete(ctrlReviews.reviewsDeleteOne);
    
    //Authentication
router
  .route('/users/register')
  .post(ctrlUsers.register);
//ctrlUsers.authenticate

router
  .route('/users/login')
  .post(ctrlUsers.login);  

module.exports = router;