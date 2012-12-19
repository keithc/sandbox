ko.bindingHandlers.highlightedText= { 
				update: function(element, valueAccessor) {
			        var options = valueAccessor();
			        var originalText = ko.utils.unwrapObservable(options.text);
			        var matches = ko.utils.unwrapObservable(options.matches);
			        var css = ko.utils.unwrapObservable(options.css);
			       // if (options.sanitize) {
			       //     value = $('<div/>').text(originalText).html(); //could do this or something similar to escape HTML before replacement, if there is a risk of HTML injection in this value
			       // }

			        if (matches && matches.length==0){
			        	element.innerHTML = originalText;  //return? 
			        }
			        else  
			        { 
			        	var highlightedString="", startPos=0, replacement=""; 
			        	for (var i=0; i < matches.length; i++){
			        		//translate the original text into a new string with the highlighted markup
			        		//figure out where the last loop iteration left off 
			        		startPos = matches[i-1] ? matches[i-1].index + matches[i-1].matchedText.length: 0; 
			        		//build the highlight
			        		replacement = '<span class="' + css + i%2 + '" title="Index: ' + matches[i].index + '">' + matches[i].matchedText + '</span>';
			        		var myString = originalText.substring(startPos, matches[i].index) + 
			        						replacement;
			        		highlightedString += myString; 
			        	}
			        	startPos = matches[matches.length-1].index + matches[matches.length-1].matchedText.length; 
			        	highlightedString += originalText.substring(startPos, originalText.length);
			        	element.innerHTML = highlightedString; 
			        }
				}    
			}	


			function ViewModel() {
				var self = this; 
				//input fields
				self.regexPattern = ko.observable("[a-z]at"); 
				self.stringToTest = ko.observable("This is a sentence about a cat and a bat. Cats appear in this sentence, too, but that first cat won't highlight until you click the 'i' checkbox above."); 
				
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

				self.okToRunRegex = function() { 
					if (!self.regexPattern() || !self.stringToTest()) {
						return false; 
					}
					return true; 
				}

				//output vars
				self.regexExecResult = ko.observableArray(); 

				self.processRegex = ko.computed(function() { 
					if (!self.okToRunRegex()) {
						return false; 
					}
					try { 
						var pattern = new RegExp(self.regexPattern().trim(), self.regexOptions());

						self.errorMsg(""); 

						var execMatch, matches=[]; 
						//self.regexExecResult([]); 
						while (execMatch = pattern.exec(self.stringToTest())){
							matches.push({matchedText: execMatch[0], index: execMatch.index});
						}
						self.regexExecResult(matches);
					}
					catch(err){ 
						self.errorMsg(err.message); 
					}
				});
					
			    self.hasCaptures = ko.computed(function() {
        			return self.regexExecResult() && self.regexExecResult().length> 0; 
	            }); 
			}
			ko.applyBindings(new ViewModel()); 
					