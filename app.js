require('./api/data/db.js');
//for mongoose connection
// require('./api/data/dbconnection.js').open(); -- for previous mongo connection

var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./api/routes');

app.set('port', process.env.PORT);
app.use(function(request, response, next) {
	console.log(request.method, request.url);
	next();
});
// Middleware lets the request go thru -- because middleware we call next to move on to next function
//order is important because middleware runs sequentially so has to be above static to process to run on all files
// app.use('/css', function(request, response, next){
//     console.log(request.method, request.url);
//     next();
// });

//specifying specific path to show only files in a specific path
app.use(express.static(path.join(__dirname, 'public')));
app.use('/node_modules', express.static(__dirname + '/node_modules'));

//will look for index.html of file name omitted
// app.get('/', function(request, response) {
//     console.log("Get the homepage");
//     response.status(200).sendFile(path.join(__dirname, 'public', 'index.html'));
// });
// app.use('/public', express.static(path.join(__dirname, 'public' )));
app.use('/fonts', express.static(__dirname + '/fonts'));
app.use(bodyParser.urlencoded({
	extended: false
	//placed here because doesn't need to run on static files
//setting extended to false means you only need strings and arrays vs other date types if you sent to true
}));
app.use(bodyParser.json());
//send as data rather than urlencoded

// app.use('/', routes);
//main folder so will look for any routes
app.use('/api', routes);
//use google postman to test routes
var server = app.listen(app.get('port'), function() {
	var port = server.address().port;
	console.log('listening ' + port);
});
// // console.log('Me first');
// //can use npm start to run as well as node app.js
// require('./instantHello');
// //best not to use file extensions
// //this required file runs immediately
// var goodbye = require('./talk/goodbye');
// var talk = require('./talk');
// //specifying folder makes app look for file
// var question = require('./talk/question');
// talk.intro();
// talk.hello("Abby");
// //method calls
// var answer = question.ask("What is the meaning of life?");
// console.log(answer);
// goodbye();