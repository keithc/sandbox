			function ViewModel() {
				var self = this; 
				//input fields
				self.regexPattern = ko.observable("(ab)(cd)"); 
				self.stringToTest = ko.observable("rrabcdrrAbcdrr"); 
				
				//options
				self.optionGlobal = ko.observable(true);
				self.optionCase = ko.observable(false); 
				self.optionLines = ko.observable(false); 
				//options helper
				self.regexOptions = ko.computed(function () { 
					return (self.optionGlobal() ? "g" : "") + 
							(self.optionCase() ? "i" : "") + 
							(self.optionLines() ? "m" : ""); 
				}); 

				self.errorMsg = ko.observable(); 

				//output array
				self.regexMatches = ko.computed(function() { 
					if (!self.regexPattern() || !self.stringToTest()) {
						return []; 
					}
					try { 
						var pattern = 
							new RegExp(self.regexPattern().trim(), self.regexOptions());
						var match = pattern.exec(self.stringToTest());
						
						self.errorMsg(""); 

						//match: [0]=last matched string, [1..n]=capture matches
						if (match)
							return (match.length === 1 ? match : match.slice(1,match.length));
						
						return []; 
					}
					catch(err){ 
						self.errorMsg(err.message); 
					}
				}, self) ; 
			    self.hasMatches = ko.computed(function() {
        			return self.regexMatches() ? self.regexMatches().length > 0 : false; 
	            }); 
			}
			ko.applyBindings(new ViewModel()); 
