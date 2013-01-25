//polyfill
if(typeof Object.create !== "function") {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

//single inheritance
function Shape() {
  this.x = 0;
  this.y = 0;
  console.log('Shape constructor called');
}

Shape.prototype = {
  move: function(x, y) {
    this.x += x;
    this.y += y;
  }
};

// Rectangle
function Rectangle() {
  console.log('Rectangle constructor called');
  this.x = 0;
  this.y = 0;
}

Rectangle.prototype = Object.create(Shape.prototype);

var rect = new Rectangle;
console.log(rect.move)

//Person - superclass
/*function Person(name, hometown, canWork) { 
	this.name = name ? name : ''; 
	this.hometown = hometown ? hometown : '';
	this.attributes = {}; 
	this.canWork = canWork ? canWork : false; 
}

Person.prototype.sayHello = function() { 
	console.log("Hi. My name is " + this.name + " and I'm from " + this.hometown + ".");
}

Person.prototype.doWork = function() { 
	if (this.canWork) { 
		console.log("I'm doing work.")
	}
	else { 
		console.log("I can't work"); 
	}
}

//
function Child() { 
	Person.call(this); //call super ctor
}

Child.prototype = Object.create(Person.prototype); //prototype to super

Child.prototype.play = function() { 
	console.log("I'm playing.");
}

function Adult() { 
	Person.call(this); 
}
Adult.prototype = Object.create(Person.prototype); //prototype to super

function Elderly() { 
	Person.call(this); 
}
Elderly.prototype = Object.create(Person.prototype); //prototype to super

//var child = new Child("Joe","Chicago"); 
var child = Object.create(Child, {name:{value:'Joe'}, hometown:{value:'Chicago'} });
console.log("Is child a Child? " + (child instanceof Child)); 
console.log("Is child a Person? " + (child instanceof Person)); 

console.log(child.sayHello()); //call super
console.log(child.play()); //call my method*/