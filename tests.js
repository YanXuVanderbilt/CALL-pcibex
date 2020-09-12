import * as utils from './utils'

var lst = [[1,2,3,4],[5,6,7,8]];
var de_lst = utils.serialize_2d(lst);
var re_lst = utils.deserialize_2d(de_lst);

de_lst = utils.serialize(lst);
re_lst = utils.deserialize(de_lst);

console.log(typeof 42);
// expected output: "number"

console.log(typeof 'b');
// expected output: "string"

console.log(lst);
console.log(de_lst);
console.log(re_lst);