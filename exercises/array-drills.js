Array.prototype.shuffle = function () { 
	var m = this.length, t, i;
	
	// While there remain elements to shuffle…
		while (m) {
	    // Pick a remaining element…
	    i = Math.floor(Math.random() * m--);

	    // And swap it with the current element.
	    t = this[m];
	    this[m] = this[i];
	    this[i] = t;
		}
};

//given a target x and an array, find any pairs of elements whose sum is x
var x = 18; 
var arr = [1,2,3,5,6,7,8,10,11,12,13,14,16,17,22]; 
arr.shuffle(); 

//direct find
var arr2 = arr.slice(0,arr.length); 
for (var i=0; i<arr.length; i++) { 
   var target = Math.abs(x-arr[i]); 
   if (arr2.indexOf(target) != -1) {
		console.log ( "::" + arr[i] + " plus " + target  + " = " + x); 
	    continue; 
	} 
}

//semi-fake associative array
var arrObj = {}; 
for (var i=0; i<arr.length; i++) { 
	arrObj[arr[i]]=arr[i]; 
}
for (var i=0; i<arr.length; i++) { 
	var target = Math.abs(x-arr[i]); 
	if (arrObj[target]) { 
		console.log ( " ** " + arr[i] + " plus " + target  + " = " + x); 
	    continue; 
	}
}

//jsperf says the indexOf wins when the count gets decent: http://jsperf.com/finding-numbers-array-search-vs-associative-object
