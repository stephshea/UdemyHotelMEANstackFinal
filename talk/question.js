var answer = "Now that's a good question!";

module.exports.ask = function(question) {
    //chained to module.exports
  console.log(question);
  return answer;
};