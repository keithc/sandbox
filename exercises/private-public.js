function myFunc(myParam) { 
	this.myPublicMember = myParam;
	var privateMember= "privateMember!";
	var privateFunc = function() { return ("inside privateFunc!")};
	function alsoPrivate() { return("also private!") } 
	this.privilegedFunc = function(secondParm) { 
  							console.log(" In privilegedFunc, passedParam: " + secondParm 
  										+ ", private: " + privateMember 
  										+ ", publicMember: " + this.myPublicMember 
  										+ ", privateFunc1: " + privateFunc()
  										+ ", privateFunc: " + alsoPrivate()) } ;
  }
  var mf = new myFunc("passed-parm"); 
  myFunc.prototype.publicMethod = function(parm) { 
  										console.log("I am a public method " + parm) } 

  console.log("public member: " + mf.myPublicMember); 
  console.log(mf.privilegedFunc("2nd"));

