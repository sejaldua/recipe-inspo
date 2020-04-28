var path = 'allmeals.txt'
var autocorrect = require('autocorrect')({dictionary: path})
var input = prompt();
res = autocorrect(input);
console.log("Did you mean " + res);
