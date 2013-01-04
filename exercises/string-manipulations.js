//regex callee
function reverseLetters(match){
	return match.split('').reverse().join(''); 
}

String.prototype.reverse=function() { return this.split('').reverse().join('');} ; 

var myString = "Here's a string of words."; 
var outString = myString.replace(/\S+/g, reverseLetters);

document.write("<p>Original string::</br>" + myString + "</p>");
document.write("<p>Letters reversed with regex::</br>" + outString + "</p>");

var arr = myString.split(' '); 
outString ="";
for (var i=0; i<arr.length; i++) { 
	outString += arr[i].reverse() + " " ; 
}
document.write("<p>Letters reversed with prototype::</br>" + outString + "</p>");

outString = myString.reverse();  
document.write("<p>Entire string reversed with prototype::</br>" + outString + "</p>");

outString = myString.split(" ").reverse().join(" "); 
document.write("<p>Words reversed with string.split(&quot; &quot;).reverse().join(&quot; &quot;)::</br>" + outString + "</p>");
