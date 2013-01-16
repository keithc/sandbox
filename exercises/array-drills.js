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
var arr = []; //[1,2,3,5,6,7,8,10,11,12,13,14,16,17,22]; 
for (var i=0; i<1000; i++) { 
	arr.push(i); 
}
arr.shuffle(); 

//direct find
var arr2 = arr.slice(0,arr.length),
    count = 0; 
for (var i=0; i<arr.length; i++) { 
   var target = x-arr[i]; 
   if (target < 0) { continue; }
   if (arr2.indexOf(target) != -1) {
            count++;
             console.log ( "T1: " + arr[i] + " plus " + target + " = " + x); 
            continue; 
        } 
}
console.log("test1: " + count); 

//semi-fake associative array
var arrObj = {}, 
    count=0; 
for (var i=0; i<arr.length; i++) { 
        arrObj[arr[i]]=arr[i]; 
}
for (var i=0; i<arr.length; i++) { 
        var target = x-arr[i]; 
        if (target < 0) { continue; }
        if (arrObj[target]) { 
            count++;
             console.log ( "T2: " + arr[i] + " plus " + target  + " = " + x); 
            continue; 
        }
}
console.log("test2: " + count); 

//jsperf says the object easily wins when the count gets decent: http://jsperf.com/finding-numbers-array-search-vs-associative-object
