var messageArea = $(getInstanceID("message-input"));
var alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var textArray = messageArea.val().split('\n');

// $(getInstanceID("message-input")).keyup(function (event) {
//     var keycode = (event.keyCode ? event.keyCode : event.which);

//     this.value = this.value.replace(".", "TTK");
//     this.value = this.value.replace(":", "TTK DUA");
// });

var nextArray = 0;
var nextChar = 0;
var nextcount = 0;
var nextNumber = 1;

function loadSecondArray(curArray, curChar) {
    nextArray = curArray + 1;
    nextChar = curChar+ 1;
    var line = textArray[curArray].toString().length;
    if (line >= 7) {
        textArray.push(alpha[curChar] + alpha[curChar] + alpha[curChar] + " TTK");
        messageArea.val(textArray.join("\n"));
    }
}
function loadNextArray(curArray, curChar) {
    nextArray = curArray + 1;
    nextChar = curChar+ 1;
    var line = textArray[curArray].toString().length;
    if (line >= 7) {
        textArray.push(alpha[curChar] + alpha[curChar] + alpha[curChar] + " TTK");
        messageArea.val(textArray.join("\n"));
    }
}

function UpdateNextArray(curArray, curCount) {
    nextcount = curCount + 1;
    var textLines = messageArea.val().substr(0, messageArea.selectionStart).split("\n");
    var currentColumnIndex = textLines[textLines.length-1].length;

    if(checkArray(textArray[curArray])==true){
        var currContext = messageArea.val().split('\n');
        var contextMsg = currContext[nextcount].substr(7, currentColumnIndex);
        updateArray(textArray[curArray], textArray[curArray] + contextMsg);
        messageArea.val(textArray.join("\n"));

        console.log(textArray);
    }
}

// $(getInstanceID("message-input")).keypress(function (event) {
//     var code = (event.keyCode ? event.keyCode : event.which);
//     if (code == 13) {
//         /* on enter still in current position */
//         event.preventDefault();

//         var textLines = messageArea.val().substr(0, messageArea.selectionStart).split("\n");
//         var currentLineNumber = textLines.length;
//         var currentColumnIndex = textLines[textLines.length-1].length;

//         var cur_line = $(getInstanceID("cur_line")).val();

//         if(cur_line == 1) {
//             if(checkArray(alpha[0] + alpha[0] + alpha[0] + " TTK")==true){
//                 var currContext = messageArea.val().split('\n');
//                 var contextMsg = currContext[0].substr(7, currentColumnIndex);

//                 updateArray(textArray[0], textArray[0] + contextMsg);
//                 messageArea.val(textArray.join("\n"));
//             }

//             if(textArray[0].toString().length >= 7){
//                 var currContext2 = messageArea.val().split('\n');
//                 var contextMsg2 = currContext2[0].substr(0, currentColumnIndex);

//                 var lastchar = loadLastChar(contextMsg2);
//                 if(lastchar=="TTK DUA"){
//                     if(checkArray(textArray[0] + contextMsg2)==true) {
//                         updateArray(textArray[0], textArray[0] + contextMsg2);
//                         messageArea.val(textArray.join("\n"));
//                     }
//                     loadNewParagraf(0, 1, nextNumber);
//                 }
//                 else {
//                     loadSecondArray(0, 1);
//                 }
//             }
//         }
//         else {
//             var currText = messageArea.val().split('\n');
//             var textMsg = currText[nextcount].substr(0, currentColumnIndex);

//             /*
//              var lastWord = loadLastChar(textMsg);
//              if(lastWord == "TTK DUA"){
//              loadNewParagraf(nextArray, cur_line, nextNumber);
//              }
//              */
//             var nextLine = textMsg.toString().length;
//             if (nextLine > 7) {
//                 UpdateNextArray(nextArray, nextcount);
//             }
//             loadNextArray(nextArray, nextChar, nextcount);
//         }
//     }
// });

function loadNewParagraf(curArray, curLine, curNumber) {
    var addIndent = "       ";
    nextNumber = curNumber + 1;
    nextArray = curArray + 1;
    textArray.push(addIndent + curNumber + " TTK");
    messageArea.val(textArray.join("\n"));
}

function loadLastChar(val) {
    var line1 = val.toString().length;
    var spline = line1-7;
    var char = val.substr(spline, line1);
    return char;
}

// $(getInstanceID("message-input")).click(function (event) {
//     if($(getInstanceID("char_count")).val()==0){
//         var firstmsg = alpha[0] + alpha[0] + alpha[0] + " TTK";
//         updateArray(textArray[0], firstmsg);
//         messageArea.val(textArray.join('\n'));
//     }
// });

function removeArray(array, itemToRemove) {
    var removeCounter = 0;
    for (var index = 0; index < array.length; index++) {
        if (array[index] === itemToRemove) {
            array.splice(index, 1);
            removeCounter++;
            index--;
        }
    }
    return removeCounter;
}

function updateArray(value, newValue) {
    for(var i=0;i<textArray.length;i++){
        if(textArray[i]==value){
            textArray[i]=newValue;
            break;
        }
    }
}

function checkArray(value) {
    for(var i=0;i<textArray.length;i++){
        if(textArray[i]==value){
            return true;
        }
    }
}