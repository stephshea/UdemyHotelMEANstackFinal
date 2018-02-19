var filename= "index.js";

var hello = function(name) {
    console.log("Hello " + name);
};

var intro = function() {
    console.log("I'm a node file callled " + filename);
};

module.exports = {
    hello:hello,
    intro:intro
};