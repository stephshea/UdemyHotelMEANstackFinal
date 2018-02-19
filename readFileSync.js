var fs = require('fs');
console.log("Going to get a file");
var file = fs.readFile('readFileSync.js');
console.log("Got the file");

console.log("App continues...");