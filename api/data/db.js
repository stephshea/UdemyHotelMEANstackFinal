var mongoose = require('mongoose');
var dburl = 'mongodb://'+ process.env.IP + ':27017/meanhotel';
var retry = null;
mongoose.connect(dburl);

mongoose.connection.on('connected', function(){
    console.log('Mongoose connected to ' + dburl);
});

mongoose.connection.on('disconnected', function(){
    console.log('Mongoose disconnected');
});
mongoose.connection.on('error', function(err){
    console.log('Mongoose connected error ' + err);
});

process.on('SIGINT', function() {
    mongoose.connection.close(function() {
    console.log('Mongoose disconnected thru app termination (SIGINT)'); 
    process.exit(0);
    });
});

process.on('SIGTERM', function() {
    mongoose.connection.close(function() {
    console.log('Mongoose disconnected thru app termination (SIGTERM)');
    process.exit(0);
    });
});

process.on('SIGUSR2M', function() {
    mongoose.connection.close(function() {
    console.log('Mongoose disconnected thru app termination (SIGUSR2M)');
    process.kill(process.pid, 'SIGUSR2');
    });
});

//bring in schemas and models
require('./hotels.model');
require('./users.model');
