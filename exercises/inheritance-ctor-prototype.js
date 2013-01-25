//super
function Person(name) { 
	this.name = name; 
	this.hometown = "Oshkosh"; 
	this.speak = function(line) { 
		console.log(this.name + " says " + line);
	}
	this.sayHello = function() { 
		console.log("Hi, my name is " + this.name + " and I'm from " + this.hometown); 
	}
	console.log("Person constructor called.");
}
Person.prototype.toString = function() { 
	console.log("This is a toString override.");
}

//** instance of Person **
var person1 = new Person("Joe"); 
person1.speak(); //Hi, my name is Joe and I'm from Oshkosh; 
console.log(person1.constructor); //Person
//instanceof takes a constructor: object instanceof constructor
console.log(person1 instanceof Person); //true
//isPrototypeOf is a function on an object: object.isPrototypeOf(object)
console.log(Person.prototype.isPrototypeOf(person1)); //true

//** child/subclass of Person ** 
function Person2(name) { 
	//this.name = name; 
	console.log("Person2 constructor called"); 
	Person.call(this, name); //instead of implementing a copy of name
}

Person2.prototype = new Person() ; 
Person2.prototype.constructor = Person2; //parent constructor won't be called
var person2 = new Person2("Jane"); //instance

console.log(person2 instanceof Person); //true
console.log(Person.prototype.isPrototypeOf(person2)); //true

//getters go up the chain, setters stop
//new behavior
Person.prototype.dance = function (danceName) { 
	console.log(this.name + " is dancing the " + (danceName ? danceName : "twist"));
}

person1.dance(); //Joe is dancing the twist
person2.dance("samba"); //Jane is dancing the samba
person1.toString(); //This is a toString override

//override-ish the dance method with some lame string concatenation
Person2.prototype.dance = function(danceName, partner) { 
	var myDanceString = partner && partner.name ? (danceName + " with " + partner.name) : danceName; 
	Person.prototype.dance.call(this, myDanceString);
}
person2.dance("salsa"); //Jane is dancing the salsa
person2.dance("salsa",person1); //Jane is dancing the salsa with Joe