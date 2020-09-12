///////////
// utils //
///////////

///// data structure utils /////

// debug util
function get_unrecognized_DS_error_string() {
    return "UNRECOGNIZED_DATA_STRUCTURE";
}

/*
returns a 2d list of size (dim1, dim2) and initialized to be filled with e
*/
function array2d(dim1, dim2, e=0) {
    var lst = [];
    for (i = 0; i < dim1; ++i) {
        var temp = [];
        for (j = 0; j < dim2; ++j) {
            temp.push(e);
        }
        lst.push(temp);
    }
    return lst;
}

/*
get_data_structure, returns the data structure of the input, or unrecognized
assume input is a 1d array
*/
function get_DS(e) {
    if (Array.isArray(e)) {
        return "array";
    }
}

/*
input: 1_d array of numbers such as [1.1,2,3,4]
return: "[1.1,2,3,4]"
*/
function serialize_1d(structure) {
    if (structure.length === 0) {
        return "";
    }
    var type = typeof structure[0];
    if (type === "number") {
        var str = "[";
        str += structure.toString();
        str += "]";
        return str;
    }
    if (type === "string") {

    }
    return get_unrecognized_DS_error_string();
}

// helper functions for serialize
function serialize_2d(structure) {
    var str = "[";
    for (i = 0; i < structure.length; ++i) {
        str += serialize_1d(structure[i]);
        if (i != structure.length - 1) {
            // if not last array in the 2_d array
            // add a "," after the element we just inserted
            str += ",";
        }
    }
    str += "]";
    return str;
}

/*
experimental function
serializes any given data structure into a string (to be stored in newVar())

* NOTE: 09/10/20 current takes a 2d array of numbers
*/
function serialize(structure, type=null) {
    if (type !== null) {
        type = get_DS(structure);
    }
    switch (type) {
        case "array":
            return structure.toString();
        case "array_2d":
            return serialize_2d(structure);
        default:
            return "ERROR: UNRECOGNIZED DATA STRUCTURE";
    }
}

// helpers for deserialize

function str2strlist(input) {
    if (input === "") {
        input = [];
    } else {
        input = input.split(",");
    }
    return input;
}

function str2list(input) {
    input = str2strlist(input);
    for (i = 0; i < input.length; ++i) {
        input[i] = parseFloat(input[i]);
    }
    return input;
}

function deserialize_1d(str) {
    str = str.substring(1, str.length-1);
    return str2list(str);
}

function deserialize_2d(str) {
    str = str.substring(1, str.length-1);
    var start_idx = [];
    var end_idx = [];
    for (i = 0; i < str.length; ++i) {
        if (str[i] === '[') {
            start_idx.push(i);
        }
        if (str[i] === ']') {
            end_idx.push(i+1);
        }
    }
    var sub_strs = [];
    for (var i = 0; i < start_idx.length; ++i) {
        sub_strs.push(str.substring(start_idx[i], end_idx[i]));
    }
    var lst = [];
    for (var i = 0; i < sub_strs.length; ++i) {
        lst.push(deserialize_1d(sub_strs[i]));
    }
    return lst;
}

/*
deserialize what's been serialized by serialize()
*/
function deserialize(str, type=null) {
    if (type !== null) {
        type = get_DS(structure);
    }
    switch (type) {
        case "array":
            return structure.toString();
        case "array_2d":
            return serialize_2d(structure);
        default:
            return "ERROR: UNRECOGNIZED DATA STRUCTURE";
    }
}

// tests

var lst = [[1,2,3,4],[5,6,7,8]];
var de_lst = serialize_2d(lst);
var re_lst = deserialize_2d(de_lst);

de_lst = serialize(lst);
re_lst = deserialize(de_lst);

console.log(typeof 42);
// expected output: "number"

console.log(typeof 'b');
// expected output: "string"

console.log(lst);
console.log(de_lst);
console.log(re_lst);
