// var dbconn = require('../data/dbconnection.js');
// var ObjectId = require('mongodb').ObjectID;
// var hotelData = require('../data/hotel-data.json');
//native driver

var mongoose = require('mongoose');
var Hotel = mongoose.model('Hotel');

var runGeoQuery = function(req, res) {
    
        var lng = parseFloat(req.query.lng);
        var lat = parseFloat(req.query.lat);
        
        if (isNaN(lng) || isNaN(lat)) {
        res
        .status(400)
        .json( {
            "message" : "if supplied in querystring, lng and lat must both be number"
            
        });
        return;
    }
        
        //A geoJson point
        var point = {
            type: "Point",
            coordinates: [lng, lat]
        };
        
        // var geoOptions = {
        //   spherical: true,
        //   maxDistance :  2000,
        //   //meters
        //   num : 5
        //   //num of records
        // };
             
       Hotel
       .aggregate([
      { 
            "$geoNear": {
                "near": point,
                "distanceField": "distance",
                 "maxDistance": 2000,
                 "spherical": true,
                 "num": 5 
            }
              }
],
            //geoNear(point, geoOptions, function(error, results, stats) {
             function(error, results, stats) {
             console.log('Geo results', results);
            //   console.log('Geo stats', stats);
              if(error) {
                  console.log("error finding hotels");
                  res
                  .status(500)
                  .json(error)
              } else {
                 
              res
                .status(200)
                .json(results);
                
              }
            });
    };

module.exports.hotelsGetAll = function(req, res) {
    // var db = dbconn.get();
    // var collection = db.collection('hotels');
    console.log('GET the hotels');
    console.log(req.query);
    
    var offset = 0;
    var count = 5;
    var maxCount = 50;
    
    if (req.query && req.query.lat && req.query.lng) {
        runGeoQuery(req, res);
        return;
    }
    
    if(req.query && req.query.offset){
        offset = parseInt(req.query.offset, 10);
        //because queries come in a string, have to use parseInt
    }
    
    if(req.query && req.query.count){
        count = parseInt(req.query.count, 10);
        //because queries come in a string, have to use parseInt
    } 
    
    if (isNaN(offset) || isNaN(count)) {
        res
        .status(400)
        .json( {
            "message" : "if supplied in querystring, count and offset should be numbers"
            
        });
        return;
    }
    
    if (count > maxCount) {
        res
            .status(400)
            .json({
                "message" : "Count limit of " + maxCount + " exceeded"
            });
            return;
    }
    
    Hotel
    .find()
    .skip(offset)
    .limit(count)
    .exec(function(error, hotels){
        if(error) {
            console.log("Error finding hotels");
            res
                .status(500)
                .json(error);
        } else {
            
       console.log("Found hotels", hotels.length);
       res
        .json(hotels);
        }
    });
};      

module.exports.hotelsGetOne = function(request, res) {
    // var db = dbconn.get();
    // var collection = db.collection('hotels');
    
    var hotelId = request.params.hotelId;
    console.log('GET hotelId', hotelId);
    // var thisHotel = hotelData[hotelId];

    Hotel
        .findById(hotelId)
        .exec(function(error, doc) {
            var response = {
                status : 200,
                message: doc
            };
            if(error) {
            console.log("Error finding hotel");
            response.status = 500;
            response.message = error;
                
            } else if(!doc) {
                response.status = 404;
                response.message = {
                        "message" : "Hotel ID not found"
                };
            }            
            res
                .status(response.status)
                .json(response.message);
            
        });
};  

//if array has more than one item, split it array, space at ; if no items. return empty array
var _splitArray = function(input) {
    var output;
    if(input && input.length > 0) {
        output = input.split(";");
    } else {
        output =[];
    }
    return output;
    };


module.exports.hotelsAddOne = function(req, res) {
    console.log("POST new hotel");
    Hotel
        .create({
            name: req.body.name,
            description: req.body.description,
            stars: parseInt(req.body.stars, 10),
            services: _splitArray(req.body.services),
            photos: _splitArray(req.body.photos),
            currency: req.body.currency,
            location: {
                address: req.body.address,
                coordinates: [
                    parseFloat(req.body.lng), parseFloat(req.body.lat)]
            }
     
        }, function(error, hotel) {
           if(error) {
               console.log("Error creating hotel");
               res
                .status(400)
                .json(error)
           }  else {
               console.log("Hotel created", hotel);
               res  
                .status(201)
                .json(hotel);
           }
        });
};

module.exports.hotelsUpdateOne = function(req, res) {
    
    var hotelId = req.params.hotelId;
    console.log('GET hotelId', hotelId);
    //var thisHotel = hotelData[hotelId];

    Hotel
        .findById(hotelId)
        .select("-reviews -rooms")
        .exec(function(error, doc) {
            var response = {
                status : 200,
                message: doc
            };
            if(error) {
            console.log("Error finding hotel");
            response.status = 500;
            response.message = error;
                
            } else if(!doc) {
                response.status = 404;
                response.message = {
                        "message" : "Hotel ID not found"
                };
            }     
            if (response.status !==200) {
                res
                    .status(response.status)
                    .json(response.message);
            } else {
                doc.name = req.body.name; 
                doc.description = req.body.description;
                doc.stars = parseInt(req.body.stars, 10);
                doc.services = _splitArray(req.body.services);
                doc.photos = _splitArray(req.body.photos);
                doc.currency = req.body.currency;
                doc.location = {
                    address : req.body.address,
                    coordinates : 
                    [parseFloat(req.body.lng), parseFloat(req.body.lat)]
                    
                };
                
                doc
                .save(function(err, hotelUpdated) {
                    if(err) {
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

module.exports.hotelsDeleteOne = function(req, res) {
    var hotelId = req.params.hotelId;
    
    Hotel
        .findByIdAndRemove(hotelId)
        .exec(function(err, hotel) {
           if(err) {
               res
                .status(404)
                .json(err)
           } else {
               console.log("Hotel deleted, id:", hotelId);
               res
                .status(204)
                .json();
           }
        });
};
