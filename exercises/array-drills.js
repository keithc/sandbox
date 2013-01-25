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

//given an array of numbers, find the equilibrium index i where the numbers preceding a[i] and the numbers following it
// have equal sums: a[0] + ... + a[i-1] = a[i+1] + a[i+2] + a[n-1]  where a has n elements
function findEquilibriumSlower(arr) { 
    //mildly offensive: two running sums, O(n^2)
    //get sum of elements before me and after me
    var sumUp, sumDown; 
    for (var i=0, len = arr.length; i < len; i++) { 
        sumUp =0;
        sumDown=0; 
        for (j=0; j<i; j++) { 
            sumUp += arr[j];
        }
        for (k=(arr.length-1); k>i; k--) { 
            sumDown += arr[k]; 
        }
        if (sumUp === sumDown) { 
            return i; 
        }    
    }
}

//a bit better: make one pass and compute the total sum
//then, iterate through, subtracting arr[i] from the sum until hitting an equal
//should be O(2n)
function findEquilibriumFaster(arr) { 
    var totalSum, sumUp=0; 
    //execute once for each element, execute the callback, passing the previous callback's value and the current element
    totalSum = arr.reduce(function (prev, cur) { return prev + cur })
    //execute once for each element
    for (var i=0; i<arr.length; i++) { 
        totalSum -= arr[i];
        if (sumUp === totalSum) { 
            return i;
        }
        sumUp += arr[i];
    }
    return undefined; 
}

var eqMe = [3,5,8,11,14,22,7,8,9,2,12,6,20,9,1,13,10,4,1,0];
//eqMe = [3,5,8,7,4,12,0];
console.log("EQ: " + findEquilibriumSlower(eqMe)); 
console.log("EQ2: " + findEquilibriumFaster(eqMe)); 
//http://jsperf.com/equilibrium-index

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
