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
				self.lastMatchedString = ko.observable(""); 

				//output array
				self.regexCaptures = ko.computed(function() { 
					self.lastMatchedString("");
					if (!self.regexPattern() || !self.stringToTest()) {
						return []; 
					}
					try { 
						var pattern = 
							new RegExp(self.regexPattern().trim(), self.regexOptions());
						var match = pattern.exec(self.stringToTest());
						
						self.errorMsg(""); 

						//match: [0]=last matched string, [1..n]=capture matches
						if (match && match.length > 0)
						{
							self.lastMatchedString(match[0]);
							return match.length > 1 ? match.slice(1,match.length) : [];
						}
						return []; 
					}
					catch(err){ 
						self.errorMsg(err.message); 
					}
				}, self) ; 
				

			    self.hasCaptures = ko.computed(function() {
        			return self.regexCaptures() && self.regexCaptures().length> 0; 
	            }); 
			}
			ko.applyBindings(new ViewModel()); 