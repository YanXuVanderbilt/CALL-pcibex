// external links
// 1) the github repo I use to put my utils and testing code
// https://github.com/YanXuVanderbilt/CALL-pcibex

// DEV LOG (for anything older than two weeks, scroll down to buttom)
// Sept 12th, 2020 ->
// Sept 11th, 2020 -> debugged serialize_2d() and deserialize_2d() (copied utils to my local editor to faciliate testing)]
//                 -> tommorrow: figure out how to test javascript code, get stub_methods in for LetterComparison
// Sept 10th, 2020 -> added more to serialize() and deserialize()
// Sept 9th, 2020 -> thought of the idea of making an complete serialization method to serialize and deserialize data structures,
//                   this is a very interesting coding problem, needs a lot of testing.
// Sept 8th, 2020 -> making barebones of LetterComparison, added some utils
// Sept 7th, 2020 -> working on lspan, figured out how to play a audio with .print(), need to figure out how to play it with .play()
//                -> TODO: explore loading from a server, identify core functions and templates









































//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////                                           WHAT IS BEING DEVELOPED RIGHT NOW                                                        /////
/////   CURRENTLY TRYING TO IMPLEMENT ALL 15 TASKS IN INDIVIDUALDIFFERENCES, TRYING TO FIND COMMONALITY AMONG THEM TO BETTER             /////
/////   FACTOR THE PROGRAM. EXPLORING AUDIO FUNCTIONALITY NOW BY DOING LSPAN.                                                                                                           /////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

PennController.ResetPrefix(null); // Shorten command names (keep this line here)

_AddStandardCommands(function(PennEngine){
    this.actions = {
        duration: function(resolve, duration){
            const nduration = Number(duration);
            if (isNaN(nduration) || nduration < 0)
                PennEngine.debug.error("Invalid duration for timer "+this.id+" (&quot;"+duration+"&quot;)");
            else
                this.duration = nduration;
            resolve();
        }
    };
});

var showProgressBar = false;

/*

function get_timer(time) {
    return [newTimer("timer1", time)
            .callback(getVar("time").test.is(0)
                                         .success(newText().text("TIME UP!").settings.center().print(), newKey(" ").wait())
                                         //.failure(...get_timer(time))
                     )
            .start().wait(),
            newText().text(getVar("time")).settings.center().print(),
            getVar("time").set(v=>v-time)
           ];
}

/*
newTrial("timer_dev",
         newFunction("get_timer", function () { return newTimer("timer", 1000).start().wait(); }),
         getFunction("get_timer").call(),
         newText().text("here comes the text").settings.center().print(),
         newKey(" ").wait());

*/

///////////
// utils //
///////////

///// data structure utils /////

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
    var str = "[";
    str += structure.toString();
    str += "]";
    return str;
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
    for (var i = 0; i < str.length; ++i) {
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


///// output utils /////

let font_type = "Arial";
let text_size = 24;
let font_size = text_size.toString(10); // "1.5vw";
let color4neg = "red";
let color4pos = "green";

function newText_css(blurb, color="") {
    var text = newText().text(blurb).css("font-type", font_type).css("font-size", font_size);
    if (color !== "") {
        text = text.color(color);
    }
    return text;
}

function write_single_line(blurb, left=null, top=null, color="", linespacing=1) {
    if (left === null && top === null) {
        return newText_css(blurb, color).print();
    }
    if (typeof left == "number") {
        left = left.toString(10);
    }
    if (typeof top == "number") {
        top = top.toString(10);
    }
    var left_command= "left at " + left;
    var top_command = "top at " + top;
    return newText_css(blurb, color).print(left_command, top_command);
}

function writeline_old(blurb, x=30, y=30, color="", linespacing=2) {
    var result = [];
    var paragraphs = blurb.split("|");
    var left = x;
    var top = y;
    for (i = 0; i < paragraphs.length; ++i) {
        var paragraph = paragraphs[i];
        var e = write_single_line(paragraph, left, top, color, linespacing);
        result.push(e);
        top += text_size * (1+linespacing);
    }
    return result;
}

function writeline(blurb, color="", linespacing=2) {
    var result = [];
    var paragraphs = blurb.split("|");
    for (i = 0; i < paragraphs.length; ++i) {
        var paragraph = paragraphs[i];
        var e = newText_css(paragraph, color).print();
        result.push(e);
    }
    return result;
}

var dev_blurb = "OK, did you get the hang of it?|" +
    "The next phase of the task will be a little bit different.  After you judge each answer as right or wrong, you will see a " +
    "letter displayed on the screen before the next equation comes up.  Your job is to <b>remember these letters</b> " +
    "in addition to solving the equations.|" +
    "After a few equations, we will ask you to <b>type in the letters you just saw, in the order you saw them</b> .|" +
    "On the next screen, we will show you an example display.";

function repeat(c, n) {
    var r = "";
    for (i = 0; i < n; ++i) {
        r += c;
    }
    return r;
}

/*
newTrial("dev",
         //write_single_line(repeat("A", 120)),
         ...writeline(dev_blurb),
         ...writeline(dev_blurb),
         newKey(" ").wait()
);
*/

//function test_writeline() {
//    var blurb = "a | b";
//    var x = 30;
//    var y = 30;
//    return newTrial("writeline_test",
//                    ...writeline(blurb, x, y),
//                    newKey().wait());
//}

//test_writeline();

function writecentered(blurb, color="") {
    return [newText_css(blurb, color).print("center at 50%", "middle at 50%")];
}

function InstructionsScreen_old(blurb) {
    let linespacing = 1.25;
    let time_unit = 1000;
    var result_1 = writeline(blurb, 30, 2 * text_size);
    var paragraphs = blurb.split("|");
    var num_paragraphs = paragraphs.length;
    result_1.push(newTimer("timer", time_unit * num_paragraphs).start().wait());
    var prompt = "Press a key to continue.";
    var result_2 = writeline(prompt, 30, 30 + (num_paragraphs + 2) * linespacing * text_size);
    var result = result_1.concat(result_2);
    result.push(newKey("").wait());
    return result;
}

function InstructionsScreen(blurb) {

    /*
    if (blurb === "") {
        return [];
    }
    var result = [];
    var paragraphs = blurb.split("|");
    result.push(write_single_line(paragraphs[0], left=0, top=30));
    for (i = 1; i < paragraphs.length; ++i) {
        result.push(write_single_line(paragraphs[i]));
    }
    return result;
    */
    return [newText().text(blurb).settings.center().print()];
}

/*

newTrial("InstructionsScreen_test",
        ...InstructionsScreen(dev_blurb),
        newKey(" ").wait());

*/

////////////////
// ALGORITHMS //
////////////////

/*
Returns a random number between 0 and 1
*/
function rand() {
    return Math.random();
}


function get_identity(i) {
    return i - 1;
}

// implements the Fisher-Yates algorithm
function sampleFromList(arr, n) {
    var result = new Array(n),
        len = arr.length,
        taken = new Array(len);
    if (n > len)
        throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
        var x = Math.floor(Math.random() * len);
        result[n] = arr[x in taken ? taken[x] : x];
        taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
}

function randorder(arr) {
    return sampleFromList(arr, arr.length);
}

function sum_arr(arr) {
    var sum = arr.reduce(function(a, b) { return a + b; }, 0);
    return sum;
}


//////////////////////////////
////// GLOBAL VARIABLES //////
//////////////////////////////

// key indices
let letterT = "D";
let letterF = "K";

// Timing:
let rspan_TBRtime = 0.8; // 800 ms

// Text colors:
let negfeedback = [255, 0, 0]; // red
let posfeedback = [0, 255, 0]; // green



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////
///// BELOW IS A DEV AREA /////
///////////////////////////////

////////////////////////////
///// LETTERCOMPARISON /////
////////////////////////////

let timelimit = 20;

/*

let instructions = 'In this task, you will see 2 sets of letters on each screen.  ' +
    'Your job is to judge whether the two sets are the <b>same</b>.|' +
    'Press the <b>D</b> key if, yes, the sets <b>ARE</b> exactly the same.|' +
    'Press the <b>K</b> key if, no, the sets are <b>NOT</b> exactly the same.|' +
    "We'll show you some examples to get you started.";

let instruction4screen = 'Please keep your fingers on the D and K keys so you can respond quickly.|' +
    'There will be six groups of trials in this experiment.  After ' + timelimit.toString(10) +
    ' seconds, the program will automatically advance to the next group of trials,' +
    " even if you hadn't responded to the final trial in the previous set yet.|" +
    'In each group of trials, there will be a different number of letters per set.|' +
    'We know that you might make some mistakes--everyone does!  But, please try to go as fast as you can while still being accurate.|' +
    'If you have any questions, please ask the experimenter now';

newTrial("lc",
         ...writecentered(instructions),
         newKey(" ").wait(),
         clear(),
         ...writecentered('BHQ<br>BHQ'),
         newKey(" ").wait(),
         clear(),
         ...writecentered('These ARE exactly the same, so press D for YES.'),
         newKey("D").wait(),
         clear(),
         ...writecentered('CVN<br>CRN'),
         newKey(" ").wait(),
         clear(),
         ...writecentered('These are NOT the same, so press K for NO.'),
         newKey("K").wait(),
         clear(),
         ...InstructionsScreen(instruction4screen),
         newKey(" ").wait()
        );

*/

/*
1) rand > 0.5 to determine same or NOT
2) if same, set[1][i] = set[2][i] = consonants[ceil*(rand*consonants.length)]
3) if different, set[1][i] != set[2][i]

returns: [same, lst]
same: a bool
lst: a 2d array of size (2, setsize)
*/
function LetterSetCreate(consonants, setsize) {
    var same = rand() > 0.5 ? true : false;

}

// sample block

var setsize = 6;
newTrial("sample_block",
    ...writecentered("In the next period, there will be" + setsize.toString(10) + "letters in each set."),
    newKey(" ").wait(),
    clear(), // TODO: Fix this, there should not be a clear() here
    ...writecentered("Press a key to begin"),
    newKey(" ").wait()
)



/////////////////
///// LSPAN /////
/////////////////

let targetletters = "fhjklnpqrsty";
let TBRtime = .4; // 400 ms
// Recall Instructions
let recallInstruction = "Type in the letters you saw, IN ORDER.  (Dont worry about capitalization.)  " +
    "Press Enter after each letter.  If you cannot remember a letter, its fine to guess.";
let blocksizes = [15, 2, 2, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6];


newTrial("audio test",
    newAudio("test", "Haydn_Adagio.mp3").print(),
    getAudio("test").wait("first"),
    //print().wait(), //play("loop"),
    newText().text("text").print(),
    newKey(" ").wait()
);


/*

//////////////////////////////////////////////////////////////////////

////////////////////
// BELOW IS RSPAN //
////////////////////

// -- Functions for rspan --


// -- HARD CODED PROPERTIES --

let rspan_key_stroke_max = 6; // more than 6 consecutive same key input is considered excessive

// key indices
var letterT = "D"; // letterT = KbName('D');  % for TRUE probes
var letterF = "K"; // letterF = KbName('K');  % for FALSE probes

// Targets:
let rspan_targetletters = "FHJKLNPQRSTY"; // possible letters to see as TBR stimuli

// Timing:
let rspan_TBRtime = 0.8; // 800 ms

// Text colors:
// let negfeedback = [255, 0, 0]; // red
// let posfeedback = [0, 255, 0]; // green

// Instructions:
let rspan_recallinstructions =  ["Type in the letters you saw, IN ORDER.  (Don''t worry about capitalization.)  " +
                           "Press Enter after each letter.  If you cannot remember a letter, it's fine to guess."];

// -- DATA FILES --

let rspan_blocksizes = [15,2,2,2,2,3,3,4,4,5,5,6,6]; // 15 for calibration, 2 x 2 practice, then test items
let rspan_numblocks = rspan_blocksizes.length;

// put the blocks in a random order, with the constraint that the first three blocks
// (calibration, practice, practice) are always in the same order
// blockorder = [1 2 3 randorder(4:numblocks)];

// -- SHOW INITIAL INSTRUCTIONS --

function rspan_get_init() {
    return newTrial("rspan_init",
                    newVar("rspan_is_calibration").global().set(false),
                    newVar("rspan_key_stroke").global().set(letterT+",0"),
                    newVar("rspan_max_time").global().set(999));
}

function rspan_get_initial_instructions() {
    var blurb1 = "In this task, you will be asked to determine whether or not sentences are true statements.|" +
                "First, you will see a sentence on the screen, like below.|" +
                "Read the sentence <b>OUT LOUD</b>.  As you are reading, decide whether or not the sentence is true.|" +
                "Press a key as soon as you are done reading.";
    var blurb2 = "One type of reading material found in libraries is called a book.";
    var blurb3 = "After you read each sentence, you will then be asked if the sentence was true.|" +
                 "Press <b>D for YES</b> if the sentence <b>IS</b> true.|" +
                 "Press <b>K for NO</b> if the sentence is <b>NOT</b> true.|";
    var blurb4 = "Is this true?";
    var success_blurb1 = "That's right. A book is often found in libraries, so the sentence was true.";
    var failure_blurb1 = "In this case, you should have pressed D for YES.  A book is often found in libraries, so the sentence is true.";
    var additional_blurb = "| Does that make sense?  Let's try one more.|" +
                           "Don't forget to <b>read the sentence out loud</b> and to press a key <b>as soon</b> as you are done reading.";
    var blurb5 = "One four-footed animal that can quickly climb trees is a cow.";
    var success_blurb2 = "That's right. A cow cannot quickly climb trees, so the sentence is NOT true.";
    var failure_blurb2 = "In this case, you should have pressed K for NO.  A cow cannot quickly climb trees, so the sentence is NOT true.";
    var blurb6 = "The overall procedure will work like this:|" +
                 "(1) You read the sentence out loud.|" +
                 "(2) As soon as you finish reading the sentence out loud, press a key.|" +
                 '(3) "Is this true?" appears.|' +
                 "(4) You press D for YES or K for NO.|" +
                 "(5) The next trial starts automatically.|" +
                 "Does that make sense?  Please ask the experimenter if you are confused.";
    var blurb7 = "In the next section, you will be asked to read more sentences.|" +
                 "It is important that you answer correctly, but try to go as quickly as you can while still " +
                 "being accurate.|" +
                 "Don''t forget that you must read the sentences <b>OUT LOUD</b>.|" +
                 "Ask the experimenter now if you have any questions.";
    return newTrial("rspan_initial_instructions",
                    ...writeline(blurb1, 30, 30),
                    newKey(" ").wait(), // TODO: Do we clear screen here?
                    clear(),
                    ...writecentered(blurb2),
                    newKey(" ").wait(),
                    clear(),
                    ...writeline(blurb3, 30, 30),
                    newKey(" ").wait(),
                    clear(),
                    ...writecentered(blurb4),
                    newKey("response1", letterT + letterF).wait(),
                    getKey("response1").test.pressed(letterT)
                                           .success(clear(), ...InstructionsScreen(success_blurb1 + additional_blurb))
                                           .failure(clear(), ...InstructionsScreen(failure_blurb1 + additional_blurb)),
                    clear(),
                    ...writeline(blurb5),
                    newKey(" ").wait(),
                    clear(),
                    ...writecentered(blurb4),
                    newKey("response2", letterT + letterF).wait(),
                    getKey("response2").test.pressed(letterT)
                                            .success(clear(), ...InstructionsScreen(success_blurb2))
                                            .failure(clear(), ...InstructionsScreen(failure_blurb2)),
                    clear(),
                    ...InstructionsScreen(blurb6),
                    clear(),
                    ...InstructionsScreen(blurb7)
                    );
}

function rspan_get_sequence() {
    var sequence = [];
    var task_name = "rspan";
    for (i = 0; i < sum_arr(rspan_blocksizes); ++i) {
        var f = task_name + "_" + i.toString(10);
        sequence.push(f);
    }
    return sequence;
}

function rspan_update_key_stroke_helper(key_stroke, key_pressed) {
    key_stroke = str2strlist(key_stroke);
    if (key_stroke[0] != key_pressed) {
        key_stroke = [key_pressed, "1"];
    } else {
        var times = key_stroke[1];
        times = parseFloat(times);
        times += 1;
        times = times.toString(10);
        key_stroke = [key_stroke[0], times];
    }
    return key_stroke.toString();
}

function rspan_update_key_stroke(key_pressed) {
    return getVar("rspan_key_stroke").set(v=>rspan_update_key_stroke_helper(v, key_pressed));
}

function rspan_is_excessive_key_stroke(key_stroke) {
    key_stroke = str2strlist(key_stroke);
    var times = key_stroke[1];
    times = parseFloat(times);
    return times > rspan_key_stroke_max;
}

function rspan_get_timer(name, duration) {
    return newTimer(name, duration);
}

function rspan_get_trial(order, statement, truth) {
    var trial_name = "rspan_" + (order - 1).toString(10);
    var key = (truth == 1) ? letterT : letterF;
    var wrong_key = (truth == 0) ? letterT : letterF;
    var calibration_blurb1 = "OK, did you get the hang of it?|" +
                             "The next phase of the task will be a little bit different.  After you judge each sentence as right or wrong, you will see a " +
                             "letter displayed on the screen before the next sentence comes up.  Your job is to <b>remember these letters</b> " +
                             "in addition to judging the sentences.|" +
                             "After a few sentences, we will ask you to <b>type in the letters you just saw, in the order you saw them</b> .|" +
                             "On the next screen, we will show you an example display.";
    return newTrial(trial_name,
                    newFunction("rspan_get_current_time", function() { return Date.now(); }),
                    //newTimer("timer", 1000).start().callback(...writeline("TIME OUT!", 100, 100, color4neg), newTimer("timer2", 1000).start().wait(), newKey(" ").wait()).wait(),
                    ...writeline(statement, 30, 30),
                    newVar("rspan_start_time").set(getFunction("rspan_get_current_time").call()),
                    newText().text(getVar("rspan_start_time")).settings.center().print(),
                    newKey(" ").wait(),
                    //newVar("rspan_time_elapsed").set(getFunction("rspan_get_current_time").call()).set(v=>v-getVar("rspan_start_time").value),
                    //newVar("rspan_is_timeout").set(v=>getVar("rspan_time_elapsed").value > getVar("rspan_max_time").value),
                    //getVar("rspan_is_timeout").test.is(true).success(...writeline("TOO SLOW!", 100, 100, color4neg),
                    //                                                 newKey(" ").wait())
                    //.failure(
                        ...writecentered("Is this true?"),
                        newKey("response1", letterT + letterF).wait(),


                     getKey("response1").test.pressed(key)
                                             .success(...writecentered("GOOD!"),
                                                      rspan_update_key_stroke(key)
                                                     )
                                             .failure(...writecentered("NO!"),
                                                      rspan_update_key_stroke(wrong_key)),
                     getVar("rspan_key_stroke").test.is(v=>rspan_is_excessive_key_stroke(v))
                                                    .success(newText().text("EXCESSIVE").settings.center().print())
                                                    .failure(newText().text("NOT EXCESSIVE").settings.center().print()),
                     newText().text(getVar("rspan_key_stroke")).settings.center().print(),
                     newKey(" ").wait(),
                     getVar("rspan_is_calibration").test.is(false)
                                                        .success(...writeline(calibration_blurb1)),
                     newKey(" ").wait(),
                     newText().text(getVar("rspan_time_elapsed")).settings.center().print(),
                     newKey(" ").wait(),
                     getVar("rspan_is_timeout").test.is(true)
                             .success(getVar("rspan_is_calibration").test.is(false)
                                                                         .success(clear(),
                                                                                  ...writecentered("too slow"),
                                                                                  newKey(" ").wait())
                                                                         .failure(clear(),
                                                                                  ...writecentered("too slow"),
                                                                                  newKey(" ").wait())
                                     )
                             .failure(getVar("rspan_is_calibration").test.is(true)
                                                                         .success(clear(),
                                                                                  ...writecentered("not too slow"),
                                                                                  newKey(" ").wait())
                                                                         .failure(clear(),
                                                                                  ...writecentered("not too slow"),
                                                                                  newKey(" ").wait()
                                                                                 )
                                     )

                     //)
                    )
}

Sequence("rspan_init", "rspan_initial_instructions", ...rspan_get_sequence());

//Sequence(...["ospan_init"], "ospan_initial_instructions", ...get_ospan_sequence(), "ospan_wrap_up");

Template(GetTable("rspantrials.csv"),
            row => rspan_get_trial(row.ORDER, row.STATEMENT, row.TRUTH)
);

rspan_get_init();

rspan_get_initial_instructions();
*/

/*

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////
// BELOW IS OSPAN //
////////////////////


// global variables (those should be put at beginning of file)
var ospan_keyForTrue = "D";
var ospan_keyForFalse = "K";
var ospan_legalKeys = ospan_keyForTrue + ospan_keyForFalse;

function sum_str(arr) {
    arr = str2list(arr);
    var sum = arr.reduce(function(a, b){
        return a + b;
    }, 0);
    return sum;
}

function getEquation2(term1, sym1, term2) {
    var term1String = term1.toString(10);
    var term2String = term2.toString(10);
    var equation = term1String + sym1 + term2String;
    return equation;
}

function getEquation3(term1, sym1, term2, sym2, term3) {
  var term3String = term3.toString(10);
  var equation = "(" + getEquation2(term1, sym1, term2) + ")" + sym2 + term3String;
  return equation;
}

function getRightAnswer(equation) {
    return eval(equation);
}

// if eval(term1, sym1, term2) - 99 <= 0, generate a random term3, otherwise return -99
function getTerm3(term1, sym1, term2) {
    answer = getRightAnswer(getEquation2(term1, sym1, term2));
    if (answer > 99) {
        return -9;
    } else {
        // generate a random number between -9 and 9
        var signs = [1, -1];
        var signIndex = Math.floor(Math.random() * 2);
        var sign = signs[signIndex];
        var abs = Math.floor(Math.random() * 9) + 1;
        if (answer <= 9) {
            abs = Math.floor(Math.random() * answer) + 1;
        }
        return abs * sign;
    }
}

function get_OPERATION2_DIGIT3(DIGIT1, OPERATION1, DIGIT2) {
    var OPERATION2 = "+";
    var DIGIT3 = getTerm3(DIGIT1, OPERATION1, DIGIT2);
    if (DIGIT3 < 0) {
        OPERATION2 = "-";
        DIGIT3 = -DIGIT3;
    }
    return [OPERATION2, DIGIT3];
}

// return a random interger in [0, upper)
function getRandomAnswer(rightanswer, upper) {
    result = rightanswer;
    while (result == rightanswer) {
        result = Math.floor(Math.random() * upper);
    }
    return result;
}

function getEquationWithAnswer(equation) {
    var answer = getRightAnswer(equation);
    return equation + "=" + answer;
}

function getTextForKey(equation, answer, isRightAnswer, isRightKey) {
    var equationWithAnswer = getEquationWithAnswer(equation);
    if (isRightAnswer && isRightKey) {
        return newText("success",
                       "<p>That's right. " + equationWithAnswer + ", so " + answer.toString(10) + " is the true answer.</p><p>Press the spacebar to continue.</p>");
    } else if (!isRightAnswer && isRightKey) {
        return newText("success",
                       "<p>That's right. " + equationWithAnswer + ", so " + answer.toString(10) + " is NOT the true answer.</p><p>Press the spacebar to continue.</p>");
    } else if (isRightAnswer && !isRightKey) {
        return newText("failure",
                       "<p>In this case, you should have pressed " + ospan_keyForTrue + " for YES. " + equationWithAnswer + ".</p><p>Press the spacebar to continue.</p>");
    } else {
        return newText("failure",
                       "<p>In this case, you should have pressed " + ospan_keyForFalse + " for NO. " + equationWithAnswer + ", not " + answer.toString(10) + ".</p><p>Press the spacebar to continue.</p>");
    }
}

function getTime() {
    var d = new Date();
    return d.getSeconds();
}

// state variables
var accuracy = 0;
var totalNumberOfEquationsShown = 0; // how many equations we have shown to the user
var numberOfEquationsCorrectlyAnswered = 0; // how many equations the participant gave right answers to

function update_global_test() {
    return getVar("test_var").set(v=>"66,"+v);
}

function identity_test() {
    return getVar("test_var").value-1;
}

function advance_trial_helper(trial, order) {
    trial = str2list(trial);
    order = str2list(order);
    trial[2] += 1; // updaet trial_num
    if (trial[1] == order[trial[0]] - 1) {
        trial[0] += 1;
        trial[1] = 0;
    } else {
        trial[1] += 1;
    }
    return trial.toString();
}

function advance_trial() {
    return getVar("current_trial").set(v=>advance_trial_helper(getVar("current_trial").value, getVar("block_order").value));
}

function update_is_calibration_helper(trial) {
    trial = str2list(trial);
    return trial[0] === 0;
}

function update_is_calibration() {
    return getVar("is_calibration").set(v=>update_is_calibration_helper(getVar("current_trial").value));
}

function record_time_elapsed_helper(list, element) {
    list = str2list(list);
    list.push(element);
    list = list.toString();
    return list;
}

function get_mean(list) {
    if (list.length === 0) {
        return 0;
    } else {
        let sum = list.reduce((previous, current) => current += previous);
        let avg = sum / list.length;
        return avg;
    }
}

function std(list) {
    if (list.length === 0) {
        return 0;
    }
    let mean = get_mean(list);
    var squareDiffs = list.map(function(value){
        var diff = value - mean;
        var sqr = diff * diff;
        return sqr;
        });
    var avgSquareDiff = get_mean(squareDiffs);
    return Math.sqrt(avgSquareDiff);
}

function update_max_time_helper(max_time, times_elapsed) {
    times_elapsed = str2list(times_elapsed);
    max_time = get_mean(times_elapsed) + 2.5 * std(times_elapsed);
    return max_time;
}

function is_last_calibration_trial(trial, order) {
    trial = str2list(trial);
    order = str2list(order);
    return trial[2] == order[0] - 1;
}

function get_lines_helper(block, trial) {
    block = str2list(block);
    return block[trial];
}

function update_letters_to_remember_helper(trial, order, orig_val, target_letters) {
    trial = str2list(trial);
    order = str2list(order);
    if (order[trial[0]] >= (str2strlist(target_letters)).length) {
        // we are in calibration
        // change this
        return orig_val;
    }
    if (trial[1] === 0) {
        target_letters = str2strlist(target_letters);
        return sampleFromList(target_letters, order[trial[0]]).toString();
    } else {
        return orig_val;
    }
}

function get_letter_to_remember_helper(trial, letters) {
    trial = str2list(trial);
    letters = str2strlist(letters);
    return letters[trial[1]];
}

function get_text_input_name(id, num) {
    return id.toString(10) + "_" + num.toString(10);
}

function display_text_input(id, num) {
    result = [];
    for (i = 0; i < num; ++i) {
        var name = get_text_input_name(id, i);
        result.push(newTextInput(name, "").length(1).print());
    }
    return result;
}

function shuffle_fisher_yates(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function custom_randomize(list) {
    return shuffle_fisher_yates(item);
}

function get_trial_name(task_name, trial_num) {
    return task_name + "_" + trial_num.toString(10);
}


////////////////////////////////////////////////////////


function get_ospan_feedbacks_get_new_vars(block_num, block_size) {
    var result = [];
    result.push(newVar("inputs").set(""));
    result.push(newVar("i").set(-1));
    for (i = 0; i < block_size; ++i) {
        result.push(getVar("i").set(getTextInput(get_text_input_name(block_num, i))));
        result.push(getVar("inputs").set(v=>v+getVar("i").value));
    }
    return result;
}

function get_ospan_feedbacks_var_transfer_test(block_num, block_size) {
    var result = [];
    for (i = 0; i < block_size; ++i) {
        var name = "input_" + get_text_input_name(block_num, i);
        var newName = name + "_test";
        //result.push(newVar(newName).set(getTextInput(get_text_input_name(block_num, i))));
        //result.push(newVar(newName).set(getTextInput(get_text_input_name(block_num, i))));
        //result.push(newVar(newName).set(getTextInput(get_text_input_name(block_num, i))));
        result.push(newVar(newName).set(getVar(name)));
        //result.push(newText().text(getVar(name+"_test")).settings.center().print());
        //result.push(getVar("inputs").set(v=>v));
        //result.push(newText().text(getVar("inputs")).settings.center().print());
    }
    return result;
}

function get_ospan_feedbacks_set_vars(block_num, block_size) {
    var result = [];
    for (i = 0; i < block_size; ++i) {
        var text_input_name = get_text_input_name(block_num, i);
        var name = "input_" + text_input_name + "_test";
        result.push(newText(name,"").text(getVar(name)).settings.center().print());
        //result.push(getVar("inputs").set(v=>getVar(name).value));
        //result.push(newText().text(getVar("inputs")).settings.center().print());
        //result.push(getTextInput(text_input_name).setVar(name));
    }
    return result;
}

function update_local_score_helper(score, item_num, block_size, letters_to_remember, key) {
    letters_to_remember = str2strlist(letters_to_remember);
    var hit = (key == letters_to_remember[item_num]) ? 1 : 0;
    score += hit / block_size + item_num;
    return score;
}

function test_helper(letters, i) {
    letters = str2strlist(letters);
    return letters[i];
}

function get_ospan_feedbacks_update_local_score(block_num, block_size) {
    var result = []
    result.push(newVar("letters_to_remember_local").set(getVar("letters_to_remember")));
    result.push(getVar("local_score").set(10));
    for (i = 0; i < block_size; ++i) {
        var name = "input_" + get_text_input_name(block_num, i);
        var function_name = "test_0";
        var f = () => str2strlist(getVar("letters_to_remember_local").value)[i];
        var j = parseFloat(get_text_input_name(block_num, i)[2]);
        //var g = (v, block_size, ltr, name) => update_local_score_helper(v, i, block_size, ltr, name);
        //result.push(getVar("local_score").set(v=>update_local_score_helper(v, j, block_size, getVar("letters_to_remember").value, getVar(name).value)));
        //result.push(newText().text(update_local_score_helper(0, j, block_size, getVar("letters_to_remember_local").value, getVar(name).value)).settings.center().print());
        //result.push(newFunction(function_name, () => str2strlist(getVar("letters_to_remember_local").value)[1]));
        result.push(newText().text(name).settings.center().print());
        //result.push(newText().text(j.toString(10)).settings.center().print());
        //result.push(newText().text(getVar("inputs")).settings.center().print());
        //result.push(newText().text(getVar(name)).settings.center().print());
        //result.push(newText().text(getVar("letters_to_remember_local")).settings.center().print());
        //var letter = test_helper(getVar("letters_to_remember_local").value, i);
        //result.push(newText().text(i.toString(10)).settings.center().print());
        //result.push(newText().text(v=>getFunction(function_name).call()).settings.center().print());
        //result.push(newText().text(getVar("letters_to_remember_local")).settings.center().print());
        result.push(newKey(" ").wait());
    }
    return result;
}

// returns "hits, total"
function get_ospan_result_helper(answer, letters) {
    letters = str2strlist(letters);
    var hits = 0;
    for (i = 0; i < letters.length; ++i) {
        if (answer[i] == letters[i]) {
            hits += 1;
        }
    }
    return hits.toString(10) + "," + letters.length.toString(10);
}

function get_blurb1_2(val) {
    val = str2strlist(val);
    return val[0] + "</b> and <b>" + val[1] + "</b>.<br>";
}

function get_ospan_after_second_block_instructions() {
    var blurb1_1 = "In this section, the letters you saw between the equations were <b>";
    //"A" + "</b> and <b>" + "B" + "</b> .<br>" +
    var blurb1_3 = "So, that is what you should have typed in.<br>" +
            "Does that make sense?  Please ask the experimenter if you have any questions.<br>" +
            "Let's do <b>one more practice</b>.";
    return newTrial("after_second_block",
                    newVar("blurb1").set(v=>blurb1_1 + get_blurb1_2(getVar("letters_to_remember").value) + blurb1_3),
                    newText().text(getVar("blurb1")).settings.center().print(),
                    newKey(" ").wait());
}

function get_ospan_after_third_block_instructions() {
    var blurb1 = "OK, got the hang of it?<br>" +
                 "That section had 3 letters to remember.<br>" +
                 "For the rest of experiment, there will be <b>3 to 7 letters</b> in each section.<br>" +
                 "Dont forget to answer the math problems accurately.<br>" +
                 "We need you to keep your accuracy on the problems at 85% or above.<br>" +
                 "If you have any questions, please ask the experimenter now.";
    return newTrial("after_third_block",
                    newText().text(blurb1).settings.center().print(),
                    newKey(" ").wait());
}

function get_ospan_feedbacks() {
    var result = [];
    var i = 0;
    var block = str2list(block_order);
    for (i = 1; i < block.length; ++i) {
        var text_input = display_text_input(i, block[i]);
        var vars = get_ospan_feedbacks_get_new_vars(i, block[i]);
        var vars_transfer_test = get_ospan_feedbacks_var_transfer_test(i, block[i]);
        var set_vars = get_ospan_feedbacks_set_vars(i, block[i]);
        var update_local_score = get_ospan_feedbacks_update_local_score(i, block[i]);
        trial = newTrial("ospan_feedback_" + i.toString(10),
                        newText().text(getVar("letters_to_remember")).settings.center().print(),
                        newVar("local_score").set(0),
                        ...text_input,
                        newKey("[").wait(),
                        ...vars,
                        //...vars_transfer_test,
                        ...set_vars,
                        //...update_local_score,
                        //newText().text(getVar("inputs")).settings.center().print(),
                        newText().text(v=>get_ospan_result_helper(getVar("inputs").value, getVar("letters_to_remember").value)).settings.center().print(),
                        newKey(" ").wait(),
                        clear(),
                        newVar("percentage").set(v=>str2list(getVar("accuracy").value)[2]),
                        newText().text(v=>"So far, your TOTAL accuracy on the equations is: " + (getVar("percentage").value).toString(10)).settings.center().print(),
                        getVar("percentage").test.is(v=>v>0.85)
                                .success(newText("Keep up the good work!").settings.center().print())
                                .failure(newText("Please try to work more carefully on the equations.").settings.center().print()),
                        newText().text("Press a key to continue.").settings.center().print(),
                        newKey(" ").wait()
                        );
        result.push(trial);
    }
    return result;
}

function get_ospan_wrap_up() {
    var blurb1 = "Good work!  This task is complete!" +
                 "We know that this was an especially difficult task.  But, it is those difficulties " +
                 "that we are researching.  We definitely don''t expect that anyone will remember all the " +
                 "letters!";
    return newTrial("ospan_wrap_up",
                    newText().text(blurb1).settings.center().print(),
                    newKey(" ").wait()
                   )
}

function update_accuracy_helper(accuracy, is_right_answer) {
    accuracy = str2list(accuracy);
    if (is_right_answer) {
        accuracy[0] += 1;
    }
    accuracy[1] += 1;
    accuracy[2] = accuracy[0] / accuracy[1];
    return accuracy.toString();
}

function update_accuracy(is_right_answer) {
    return getVar("accuracy").set(v=>update_accuracy_helper(v, is_right_answer));
}

function update_key_stroke_helper(keyStrokes, key, key4true, key4false) {
    key = (key == key4true) ? 1 : 0;
    keyStrokes = str2list(keyStrokes);
    if (key == keyStrokes[0]) {
        keyStrokes[1] += 1;
    } else {
        keyStrokes[0] = key;
        keyStrokes[1] = 1;
    }
    return keyStrokes.toString();
}

function update_key_stroke(key) {
    return getVar("keyStrokes").set(v=>update_key_stroke_helper(v, key, getVar("ospan_keyForTrue").value, getVar("ospan_keyForFalse").value));
}

function is_repetitive_keystroke(keyStrokes) {
    keyStrokes = str2list(keyStrokes);
    return keyStrokes[1] > 6;
}

///////////////////////////////////////////////////////////

let TBRTime = 0.8;
let block_order = "15,2,3,6,4,3,5,7,5,4,3,6,7,6,5,3,7,4";

function get_ospan_sequence() {
    var block = str2list(block_order);
    var sum = block.reduce(function(a, b) { return a + b; }, 0);
    var result = [];
    var current_trial = 0;
    for (i = 0; i < block.length; ++i) {
        for (j = 0; j < block[i]; ++j) {
            var e = "ospan_" + current_trial.toString(10);
            result.push(e);
            current_trial += 1;
        }
        if (i != 0) {
            var f = "ospan_feedback_" + i.toString(10);
            result.push(f);
        } else {
            var f = "after_calibration";
            result.push(f);
        }
        if (i == 1) {
            var f = "after_second_block";
            result.push(f);
        }
        if (i == 2) {
            var f = "after_third_block";
            result.push(f);
        }
    }
    return result;
}

function get_display_for_not_timeout(rightKey, wrongKey, equation, answer, isRightAnswer) {
    return [
            getKey("user_key_input").test.pressed(rightKey)
                                         .success(
                                            clear(),
                                            //getTextForKey(equation, answer, isRightAnswer, true).print(),
                                            ...writecentered("GOOD!", color4pos),
                                            update_accuracy(true),
                                            update_key_stroke(rightKey),
                                                 )
                                         .failure(
                                            clear(),
                                            //getTextForKey(equation, answer, isRightAnswer, false).print(),
                                            ...writecentered("NO!", color4neg),
                                            update_accuracy(false),
                                            update_key_stroke(wrongKey)
                                                 ),
            getVar("keyStrokes").test.is(v=>is_repetitive_keystroke(v))
                .success(clear(), ...writecentered("Are you pressing the same key over and over?<br>You must decide if each number IS or IS NOT the correct answer to the equation.")),
            //newText().text(getVar("keyStrokes")).settings.center().print(),
            newKey(" ").wait(),
            //clear(),
            //newText().text(getVar("is_calibration")).settings.center().print(),
            //newText().text(getVar("letter_to_remember")).settings.center().print(),
            //newKey(" ").wait()
           ]
}

function get_ospan_init_helper() {
    return newTrial("ospan_init",
                    newVar("max_time").global().set(2000),
                    newVar("ospan_keyForTrue").global().set("D"),
                    newVar("ospan_keyForFalse").global().set("K"),
                    newVar("ospan_valid_keys").global().set("DK"),
                    newVar("target_letters").global().set("F,H,J,K,L,N,P,Q,R,S,T,Y"),
                    newVar("block_order").global().set(block_order),
                    newVar("letters_to_remember").global().set("A,B,C,D,E,F,G,H,I,J,K,L,M,N,O"),
                    newVar("is_calibration").global().set(true),
                    newVar("current_trial").global().set("0,0,0"), // "block_num, item_num, trial_num"
                    newVar("test_var").global().set("33,44,55"),
                    newVar("times_elapsed").global().set(""), // e.g. "500,200,300"
                    newVar("keyStrokes").global().set(""), // "1, 7" where 1 stands for ospan_keyForTrue, and 0 ospan_keyForFalse, 7 means that key is pressed 7 consecutive times
                    newVar("accuracy").global().set("0,0,0"), // "num_of_correct_answer, num_of_answers, divide first two"
                    newVar("score").global().set(0) // score = num_hits / num_letters
                    );
}

let ospan_font_type = "Arial";
let ospan_font_size = "1vw";
let ospan_color4neg = "red";
let ospan_color4pos = "green";

function ospan_newText_css(blurb, color="") {
    var text = newText().text(blurb).css("font-type", ospan_font_type).css("font-size", ospan_font_size);
    if (color != "") {
        text = text.color(color);
    }
    return text;
}

function ospan_writeline(blurb, x, y, color="") {
    var left_command= "left at " + x.toString(10);
    var top_command = "top at " + x.toString(10);
    return ospan_newText_css(blurb, color).print(left_command, top_command);
}

function ospan_writecentered(blurb) {
    return ospan_newText_css(blurb).print("center at 50%", "middle at 50%");
}

function get_ospan_initial_instructions_helper() {
    var blurb1 = "In this task, you will be asked to determine the answer to equations.|" +
                    "First, you will see an equation on the screen, like below.|" +
                    "Take a moment to figure out the answer to the equation.  Press a key once you have the answer in mind.";
    var blurb2 = "After each equation, you will then see a possible answer to the equation.|" +
                    "Press <b>D for YES</b> if this <b>IS</b> the answer to the equation you just saw.|" +
                    "Press <b>K for NO</b> if this is <b>NOT</b> the correct answer.|";
    var success_blurb = "That's right. (6 X 4) - 2 = 22, so 22 was the true answer.";
    var failure_blurb = "In this case, you should have pressed D for YES. (6 X 4) - 2 = 22, so 22 was indeed the correct answer.";
    var additional_blurb = "|Does that make sense? Let's try one more.";
    var blurb3 = "The overall procedure will work like this:|" +
                    "(1) You see the equation.|" +
                    "(2) Once you have the answer in your head, press a key.|" +
                    "(3) A possible answer appears.|" +
                    "(4) You press D for YES or K for NO.|" +
                    "(5) The next trial starts automatically.|" +
                    "Does that make sense?  Please ask the experimenter if you are confused.";
    var blurb4 = "In the next section, you will be asked to solve more equations.|" +
                    "It is important that you answer correctly, but try to go as quickly as you can while still " +
                    "being accurate.|Ask the experimenter now if you have any questions.";
    var equation = "(6 X 4) - 2 = ?";
    var equation2 = "(2 / 1) + 8 = ?";
    return newTrial("ospan_initial_instructions",
                    writeline(blurb1, 30, 30),
                    writecentered(equation),
                    newKey("", "").wait(),
                    clear(),
                    writeline(blurb2),
                    writecentered("22"),
                    newKey("user_input", "DK").wait(),
                    getKey("user_input").test.pressed("D")
                        .success(clear(), ...InstructionsScreen(success_blurb + additional_blurb))
                        .failure(clear(), ...InstructionsScreen(failure_blurb + additional_blurb)),
                    clear(),
                    writecentered(equation2),
                    newKey(" ").wait(),
                    clear(),
                    writecentered("7"),
                    newKey("user_input2", "DK").wait(),
                    getKey("user_input2").test.pressed("K")
                        .success(clear(), ...InstructionsScreen("That's right.  (2 / 1) + 8 = 10, so 7 is NOT the answer."))
                        .failure(clear(), ...InstructionsScreen("In this case, you should have pressed K for NO.  (2 / 1) + 8 = 10, so 7 is NOT the answer.")),
                    clear(),
                    ...InstructionsScreen(blurb3),
                    clear(),
                    ...InstructionsScreen(blurb4),
                    clear()
                    );
}

function get_ospan_after_calibration_instruction() {
    var blurb1 = "OK, did you get the hang of it?|" +
                    "The next phase of the task will be a little bit different. After you judge each answer as right or wrong, you will see a " +
                    "letter displayed on the screen before the next equation comes up.  Your job is to <b>remember these letters</b> " +
                    "in addition to solving the equations.|" +
                    "After a few equations, we will ask you to <b>type in the letters you just saw, in the order you saw them</b> .|" +
                    "On the next screen, we will show you an example display.";
    var blurb2 = "In this case, you would be trying to remember the letter Y.|" +
                    "You will see a <b>DIFFERENT</b> letter after <b>EVERY</b> equation and your job is to remember them <b>in order</b>.";
    var blurb3 = "The next part of the experiment will also give you less time to figure out the equations.|" +
                    "If you take a long time on an equation, the computer will display a message saying you were too slow, " +
                    "and we will count that trial.|" +
                    //"and we will count that trial as an error.|" +
                    "So, try to solve the equations quickly.";
    var blurb4 = "Even though you are trying to remember the letters, please still try to solve the equations quickly and accurately.|" +
                    "Your <b>goal is to be at least 85% accurate with the equations</b>.|" +
                    "We won't show you feedback after each equation any more, but after each memory test, we will tell you how you are doing.|" +
                    "On the next screen, we will practice the new version of the task.|" +
                    "We know that you probably won't remember everything, but just do the best you can.";
    return newTrial("after_calibration",
                        ...InstructionsScreen(blurb1),
                        clear(),
                        ...writecentered("Y"),
                        newKey(" ").wait(),
                        clear(),
                        ...InstructionsScreen(blurb2),
                        clear(),
                        ...InstructionsScreen(blurb3),
                        clear(),
                        ...InstructionsScreen(blurb4)
                   );
}

function getTrial(DIGIT1, OPERATION1, DIGIT2, trial_num) {
    var terms = get_OPERATION2_DIGIT3(DIGIT1, OPERATION1, DIGIT2);
    var OPERATION2 = terms[0];
    var DIGIT3 = terms[1];
    var equation = getEquation3(DIGIT1, OPERATION1, DIGIT2, OPERATION2, DIGIT3);
    var isRightAnswer = (Math.random() > 0.5);
    var answer = isRightAnswer ? getRightAnswer(equation) : getRandomAnswer(getRightAnswer(equation), 60);
    var rightKey = isRightAnswer ? ospan_keyForTrue : ospan_keyForFalse;
    var wrongKey = isRightAnswer ? ospan_keyForFalse : ospan_keyForTrue;
    var equationWithAnswer = getEquationWithAnswer(equation);
    return newTrial(get_trial_name("ospan", trial_num),
                    getVar("is_calibration").test.is(true)
                        .success(newText().text("calibrating").settings.center().print(), newKey(" ").wait())
                        .failure(newText().text("not calibrating").settings.center().print(), newKey(" ").wait())
           );
    /*
    return newTrial(get_trial_name("ospan", trial_num),
                    getVar("letters_to_remember").set(v=>update_letters_to_remember_helper(getVar("current_trial").value, getVar("block_order").value, v, getVar("target_letters").value)),
                    newVar("letter_to_remember").set(v=>get_letter_to_remember_helper(getVar("current_trial").value, getVar("letters_to_remember").value)),
                    //newText().text(getVar("letters_to_remember")).settings.center().print(),
                    newVar("current_trial_local").set(getVar("current_trial")),
                    newVar("is_calibration_local").set(getVar("is_calibration")),
                    newVar("max_time_local").set(getVar("max_time")),
                    newVar("accuracy_local").set(getVar("accuracy")),
                    newVar("lines").set(v=>get_lines_helper(getVar("block_order").value, getVar("current_trial").value)),
                    //newVar("letter_to_remember").set(get_letter_to_remember_helper(getVar("current_trial").value, getVar(""))),
                    newFunction("get_current_time", function() { return Date.now(); }),
                    //newText().text(getVar("current_trial_local")).print(),
                    //newText().text(getVar("accuracy_local")).settings.center().print(),
                    ...writecentered(equation),
                    newTimer("timer",1).duration( getVar("max_time") )
                                       .callback(clear(),
                                                 ...writecentered("TOO SLOW!", color4neg),
                                                 newTimer("1stimer", 1000).start().wait(),
                                                 end()
                                                )
                                        .start(),

                    newKey(" ").wait(),
                    clear(),
                    getTimer("timer").test.ended().failure(
                        ...writecentered(answer.toString(10)),
                        newKey("user_key_input", ospan_legalKeys).callback(
                            getTimer("timer").test.ended().failure(
                                ...writecentered("key_pressed")
                            ),
                            getTimer("timer").stop()
                        ),
                        newTimer("timer2", 9999).start().wait()
                    ),
                    //newVar("start_time").set(getFunction("get_current_time").call()),
                    //newText().text(getVar("start_time")).settings.center().print(),
                    //newVar("time_elapsed").set(getFunction("get_current_time").call()).set(v=>v-getVar("start_time").value),
                    //newText().text(getVar("time_elapsed")).settings.center().print(),
                    getVar("is_calibration_local").test.is(true).success(getVar("times_elapsed").set(v=>record_time_elapsed_helper(v, getVar("time_elapsed").value))),
                    //getVar("times_elapsed_local").set(getVar("times_elapsed")),
                    //newText().text(getVar("times_elapsed_local")).settings.center().print(),
                    //newText().text(getVar("max_time_local")).settings.center().print(),
                    //newVar("is_timeout").set(v=>getVar("time_elapsed").value > getVar("max_time").value),
                    /*
                    getVar("is_timeout").test.is(true)
                            .success(getVar("is_calibration_local").test.is(false)
                                                                        .success(ospan_writecentered("too slow"),
                                                                                 newKey(" ").wait())
                                                                        .failure(...get_display_for_not_timeout(rightKey, wrongKey, equation, answer, isRightAnswer))
                                    )
                            .failure(getVar("is_calibration_local").test.is(true)
                                                                        .success(...get_display_for_not_timeout(rightKey, wrongKey, equation, answer, isRightAnswer))
                                                                        .failure(clear(),
                                                                                 newText().text(getVar("letter_to_remember")).settings.center().print(),
                                                                                 newKey(" ").wait()
                                                                                )
                                    ),
                    //
                    getVar("current_trial_local").test.is(v=>is_last_calibration_trial(v, getVar("block_order").value))
                                        .success(getVar("max_time").set(v=>update_max_time_helper(v, getVar("times_elapsed").value))),
                    advance_trial(),
                    update_is_calibration(),
                   );

}



///////////////////////////////////////////////////////////////

Sequence(...["ospan_init"],
        //"ospan_initial_instructions",
        ...get_ospan_sequence(),
        "ospan_wrap_up"
        );

get_ospan_init_helper();

//get_ospan_initial_instructions_helper();

get_ospan_after_calibration_instruction();

get_ospan_after_second_block_instructions();

get_ospan_after_third_block_instructions();

get_ospan_feedbacks();

get_ospan_wrap_up();



Template(GetTable("ospan_operation1.csv")
            .filter(row=>row.ORDER < sum_str(block_order)),
            row => getTrial(row.DIGIT1, row.OPERATION, row.DIGIT2, row.ORDER-1)
);
























/*
// Show the 'intro' trial first, then all the 'experiment' trials in a random order
// then send the results and finally show the trial labeled 'bye'
Sequence( "intro", "volume adjustment", "instructions", "equations instructions", "equations instructions 2", "equations trial 2", "equations trial 22", "equations instructions 3", randomize("experiment") , SendResults() , "bye" )


// What is in Header happens at the beginning of every single trial
Header(
    // We will use this global Var element later to store the participant's name
    newVar("ParticipantName")
        .global()
    ,
    // Delay of 250ms before every trial
    newTimer(250)
        .start()
        .wait()
)
.log( "Name" , getVar("ParticipantName") )
// This log command adds a column reporting the participant's name to every line saved to the results

newTrial( "intro" ,
    newImage("pcibex-logo.png")
        .size( 150 , 200 )      // Resize the image to 150x250px
        .print()
    ,
    newText("<p>Welcome to the experiment!</p><p>On the next screen, we'll adjust the computer volume to make sure it's comfortable before we get started.</p><p>Please enter Mechanical Turk ID</p>")
        .print()
    ,
    newTextInput()
       .print()
       .wait()                 // The next command won't be executed until Enter is pressed
      .setVar( "ParticipantName" )
        // This setVar command stores the value from the TextInput element into the Var element
    )

newTrial("volume adjustment",
    newText("<p>Please adjust the volume until you are comfortable and the sound is easy for you to hear.</p>")
        .print()
    ,
    newTimer(3000)
        .start()
        .wait()
    ,
    newText("<p>Press the spacebar when you are done adjusting the volume.</p>")
        .print()
    ,
    newKey(" ")
        .wait()
    )

newTrial("instructions",
    newText("<p>We are going to ask you to complete a set of short mini-experiments on the computer.</p><p>There are a number of them, but each one is fairly short.</p><p>You are welcome to take a short break between each task if you're getting tired.</p><p>But, during the tasks, it is important that you not take breaks until the experiment tells you that it's OK.</p><p>We'll keep track of your progress for you as you go.</p>")
        .print()
    ,
    newTimer(5000)
        .start()
        .wait()
    ,
    newText("<p>Press the spacebar to continue.</p>")
        .print()
    ,
    newKey(" ")
        .wait()
    )

newTrial("equations instructions",
    newText("<p>In this task, you will be asked to determine the answer to equations.</p><p>First, you will see an equation on the screen, like below.</p><p>Take a moment to figure out the answer to the equation.</p><p>Press the spacebar once you have the answer in mind.</p>")
        .print()
    ,
    newText("<p>(6x4)-2=?</p>")
       .settings.center()
        .print()
    ,
    newKey(" ")
        .wait()
    )

newTrial("equations instructions 2",
    newText("<p>After each equation, you will then see a possible answer to the equation.</p><p>Press <strong>D for YES</strong> if this <strong>IS</strong> the answer to the equation you just saw</p><p>Press <strong>K for NO</strong> if this is <strong>NOT</strong> the correct answer.</p>")
        .print()
    ,
    newText("<p>22</p>")
        .settings.center()
        .print()
    ,
    newKey("answer", "DK")
        .wait()
    ,
    getKey("answer")
        .test.pressed("D")
        .success(newText("success", "<p>That's right.(6x4)-2=22, so 22 was the true answer.</p><p>Does that make sense? Let's try one more.</p><p>Press the spacebar to continue.</p>") .print() )
        .failure(newText("failure","<p>You should have pressed D because 22 was the true answer.</p><p>Does that make sense? Let's try one more.</p><p>Press the spacebar to continue.</p>") .print() )
    ,
    newKey(" ")
    .wait()
)

newTrial("equations trial 2",
    newText("<p>(2/1)+8=?</p>")
        .settings.center()
        .print()
    ,
    newKey(" ")
    .wait()
    )

newTrial("equations trial 22",
    newText("<p>7</p>")
        .settings.center()
        .print()
    ,
    newKey("answer", "DK")
        .wait()
    ,
    getKey("answer")
        .test.pressed("K")
        .success(newText("success","<p>That's right. (2/1)+8=10, so 7 is NOT the true answer.</p><p>Press the spacebar to continue.</p>") .print() )
        .failure(newText("failure","<p>In this case, you should have pressed K for NO. (2/1)+8=10, not 7.</p><p>Press the spacebar to continue.</p>") .print() )
    ,
    newKey(" ")
    .wait()
    )

newTrial("equations instructions 3",
    newText("<p>The overall procedure will work like this:</p><p>(1) You see the equation.</p><p>(2) Once you have the answer in your head, press a key.</p><p>(3) A possible answer appears.</p><p>(4) You press D for YES or K for NO.</p><p>(5) The next trial starts automatically.</p><p>Does that make sense?  Please ask the experimenter if you are confused.</p>")
    .print()
   ,
   newText("<p>In the next section, you will be asked to solve more equations.</p><p>It is important that you answer correctly, but try to go as quickly as you can while still being accurate. Ask the experimenter now if you have any questions.</p>")
    .print()
  ,
    newTimer(8000)
        .start()
        .wait()
    ,
    newText("<p>Press the spacebar to continue.</p>")
        .print()
    ,
    newKey(" ")
        .wait()

    )

*/

//newTrial()
//newTrial("readingtask instructions",
//  newText("<p>In this task, you will be asked to determine whether or not sentences are true statements.</p><p>First, you will see a sentence on the screen, like below.</p><p>Read the sentence <strong>OUT LOUD</strong>. As you are reading, decide whether or not the sentence is true.</p><p>Press the spacebar as soon as you are done reading.</p>")
//    .print()
// ,
// newText("<p>One type of reading material found in libraries is called a book.</p>")
//    .settings.center()
//    .print()
//  ,
//  newKey(" ")
//       .wait()
// )
// newTrial("readingtask instructions 2",
//   newText("<p>After you read each sentence, you will then be asked if the sentence was true.</p><p>Press <strong>D for YES</strong> if the sentence <strong>IS</strong> true.</p><p>Press <strong>K for NO</strong> if the sentence is <strong>NOT</strong> true.")
//        .print()
//    ,
//    newText("<p>Is this true?</p>")
//   .print()
//    ,
//   newKey("answer","DK")
//      .wait()
//   )


/*
// This Template command generates as many trials as there are rows in myTable.csv
Template( "myTable.csv" ,
    // Row will iteratively point to every row in myTable.csv
    row => newTrial( "experiment" ,
        // The trials are minimal: choose a pronoun from a DropDown list
        newDropDown("pronoun", "...")
            .before( newText(row.Sentence) )    // Print the sentence to the left of the list
            .add( row.Pronoun1 )
            .add( row.Pronoun2 )
            .shuffle()                          // Randomly order the options in the list (Pronoun1 and Pronoun2)
            .once()                             // Disable the list after the first selection
            .print()
            .wait()
            .log()                              // Make sure to log the participant's selection
        ,
        newButton("Next")
            .print()
            .wait()
    )
    .log( "Sentence" , row.Sentence )
    .log( "Pronoun1" , row.Pronoun1 )
    .log( "Pronoun2" , row.Pronoun2 )
    // Add these three columns to the results lines of these Template-based trials
)


// Spaces and linebreaks don't matter to the script: we've only been using them for the sake of readability
newTrial( "bye" ,
    newText("Thank you for your participation!").print(),
    newButton().wait()  // Wait for a click on a non-displayed button = wait here forever
)
.setOption( "countsForProgressBar" , false )
// Make sure the progress bar is full upon reaching this last (non-)trial

*/

// dev log archived (anything older than 2 weeks shows up here)
//
