var MongoClient = require('mongodb').MongoClient;
/*var dburl = 'mongodb://careerdevs-sks2017-cloned-stephshea.c9users.io:27017/meanhotel';*/

// var dburl = 'mongodb://'+ process.env.IP + ':27017/meanhotel';
//28017

var dburl = 'mongodb://' + process.env.ip + ' :27017'

var _connection = null;

var open = function(){
    MongoClient.connect(dburl, function(err,client){
        if (err) {
            console.log("DB connection failed");
            return;
        }
        _connection = client.db("meanhotel");
        console.log("DB connection open", client);
    });
   //set _connection 
};

var get = function(){
    return _connection;
};

module.exports = {
    open : open,
    get : get
};