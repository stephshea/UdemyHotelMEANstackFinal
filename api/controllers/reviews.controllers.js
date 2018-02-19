var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

//GET all reviews for a hotel
module.exports.reviewsGetAll = function(req, res) {
        var hotelId = req.params.hotelId;
    console.log("GET hotelId", hotelId);
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(error, doc) {
        var response = {
            status: 200,
            message : []
        };
        if (error) {
            console.log("Error finding hotel");
            response.status = 500;
            response.message = error;
        } else if(!doc) {
            console.log("Hotel id not found in database", hotelId);
            response.status = 404;
            response.message = {
                "message" : "Hotel ID not found " + hotelId
            };
            } else {
                response.message = doc.reviews ? doc.reviews : [];
            }
            res
                .status(response.status)
                .json(response.message);
            });
        };
        
//GET single review for a hotel
module.exports.reviewsGetOne = function(req, res) {
      
      var hotelId = req.params.hotelId;
      var reviewId = req.params.reviewId; 
    console.log("GET reviewId" + reviewId + " for hotels" + hotelId);
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        .exec(function(error, hotel) {
            var response = {
                status: 200,
                message: {}
            };
            if (error) {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = error;
            } else if(!hotel) {
                console.log("Hotel id not found in database", hotelId);
                response.status = 404;
                response.message = {
                    "message" : "Hotel ID not found" + hotelId
                };
            }   else {
                //GET the review
                response.message = hotel.reviews.id(reviewId);
                //If the review doesn't exist Mongoose returns null
            if (!response.message) {
                    response.status = 404;
                    response.message = {
                        "message" : "Review ID not found" + reviewId
                    };
                }
            }
            
            res
                .status(response.status)
                .json( response.message );
        });
};

var _addReview = function(req, res, hotel) {
    //in mongoose subdocuments like reviews are held in an array - hotel is a model, mapped wheen exec runs in reviewsAddOne
    hotel.reviews.push({
        //sending the review object -- pushing to the array
        name: req.body.name,
        rating: parseInt(req.body.rating, 10),
        review: req.body.review
    });
    
    hotel.save(function(err, hotelUpdated) {
        //save runs on model instance, in this case model is 'hotel'
      if(err) {
          res
            .status(500)
            .json(err)
      } else {
          res
            .status(201)
            .json(hotelUpdated.reviews[hotelUpdated.reviews.length-1]);
            //getting the last review in the 'reviews' array
      }
        
    });
    
};

module.exports.reviewsAddOne = function(req, res) {
        var hotelId = req.params.hotelId;
        // var reviewId = req.params.reviewId; 
    console.log("POST review to hotelId", hotelId);
    
    Hotel
        .findById(hotelId)
        .select('reviews')
        
        .exec(function(err, doc) {
            //doc returns here
            var response = {
                status: 200,
                // message: doc,
                message: []
            };
            if (err) {
                console.log("Error finding hotel");
                response.status = 500;
                response.message = err;
            } else if(!doc) {
                console.log("Hotel id not found in database", hotelId);
                response.status = 404;
                response.message = {
                    "message" : "Hotel ID not found" + hotelId
                };
            }  
            if (doc) {
              //if document exists call below function to add new review
                _addReview(req,res,doc);
            } else {
                
            res
                .status(response.status)
                .json( response.message );
            }
        });
};

module.exports.reviewsUpdateOne = function(req, res) {
    
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    console.log('PUT reviewId ' + reviewId + ' for hotelId ' + hotelId);
    
    Hotel
        .findById(hotelId)
        .select("reviews")
        .exec(function(err, hotel) {
            var thisReview = {
                status : 201,
                message: {}
            };
            if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if(!hotel) {
        console.log("Hotel id not found in database", hotelId);
        response.status = 404;
        response.message = {
          "message" : "Hotel ID not found " + hotelId
        };
      } else {
        // Get the review
        this.review = hotel.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        thisReview.name = req.body.name;
        thisReview.rating = parseInt(req.body.rating, 10);
        thisReview.review = req.body.review;
        hotel.save(function(err, hotelUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });

};

module.exports.reviewsDeleteOne = function(req, res) {
    var hotelId = req.params.hotelId;
    var reviewId = req.params.reviewId;
    console.log('PUT reviewId ' + reviewId + ' for hotelId ' + hotelId);
    
    Hotel
        .findById(hotelId)
        .select("reviews")
        .exec(function(err, hotel) {
            var thisReview;
            var response = {
                status : 200,
                message: {}
            };
            if (err) {
        console.log("Error finding hotel");
        response.status = 500;
        response.message = err;
      } else if(!hotel) {
        console.log("Hotel id not found in database", hotelId);
        response.status = 404;
        response.message = {
          "message" : "Hotel ID not found " + hotelId
        };
      } else {
        // Get the review
        thisReview = hotel.reviews.id(reviewId);
        // If the review doesn't exist Mongoose returns null
        if (!thisReview) {
          response.status = 404;
          response.message = {
            "message" : "Review ID not found " + reviewId
          };
        }
      }
      if (response.status !== 200) {
        res
          .status(response.status)
          .json(response.message);
      } else {
        hotel.reviews.id(reviewId).remove();
        hotel.save(function(err, hotelUpdated) {
          if (err) {
            res
              .status(500)
              .json(err);
          } else {
            res
              .status(204)
              .json();
          }
        });
      }
    });
};