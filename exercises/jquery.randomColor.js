(function($)  {
	var methods, _o, _privates; 

	_privates = {}; 
	methods = { 
		init: function(options) { 
			_o = $.extend($.fn.randomColor.defaults, options) ;
		},
		destroy: function(){},
		setMyColor: function(format) { 
			var lowColor = 0, 
				highColor = 255;  
			switch (format) { 
				case "hex" : console.log("hex"); break; //TODO
				case "rgb" :  //fall through to default
				default : console.log("default"); 
			}
			var myNums = []; 
			myNums.push(Math.floor(Math.random()*highColor)); 
			myNums.push(Math.floor(Math.random()*highColor));
			myNums.push(Math.floor(Math.random()*highColor));

			//return rgb value
			return this.css("background-color", "rgb(" + myNums.join(",") + ")"); 
			
		}
	};
	$.fn.randomColor = function(options) { 
		 if (methods[options]) {
		            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
		        } else {
		            if (typeof options === "object" || !options) {
		                return methods.init.apply(this, arguments);
		            } else {
		                console.log("Method " + options + " does not exist on jQuery.hpInkFinder");
		            }
		        }				
	}
	$.fn.randomColor.defaults = {};
})(jQuery); 