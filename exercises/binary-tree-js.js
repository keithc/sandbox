			function Tree (rootNode) { 
				this.rootNode = rootNode; 
			}

			Tree.prototype.insertNode = function(node, parentNode) { 
				if (!parentNode) { 
					parentNode = this.rootNode; 
				}

				if (node.id < parentNode.id) { 
					if (!parentNode.left) {  
						parentNode.left = node; 
					}
					else{
						this.insertNode(node, parentNode.left); 
					}
				}
				else { 	
					if (!parentNode.right) { 
						parentNode.right = node; 
					}
					else{
						this.insertNode(node, parentNode.right); 
					}
				}
			}

			Tree.prototype.traverseDepth = function(startNode, visit, order) { 
				var depth=0, width=0; // cheating for ease of rendering
				function traversePreOrder(node) { 
					if (node) { 
						depth++;  
						if (visit) { 
							visit.call(this, node, depth, width); //could add depth & width to each node...
						}

						//left subtree
						if (node.left) { 
							width -= 15; 
							traversePreOrder(node.left); 
							width += 15; 
						}

						//right subtree
						if (node.right) { 
							width += 15; 
							traversePreOrder(node.right);
							width -=15;  
						}
						depth--; 			
					}
				}
				function traverseInOrder(node) { 
					if (node) { 
						depth++;  
						//left subtree
						if (node.left) { 
							width -= 15; 
							traverseInOrder(node.left); 
							width += 15; 
						}
						if (visit) { 
							visit.call(this, node, depth, width); //could add depth & width to each node...
						}
						//right subtree
						if (node.right) { 
							width += 15; 
							traverseInOrder(node.right);
							width -=15;  
						}
						depth--; 			
					}
				}
				function traversePostOrder(node) { 
					if (node) { 
						depth++;  

						//left subtree
						if (node.left) { 
							width -= 15; 
							traversePostOrder(node.left); 
							width += 15; 
						}

						//right subtree
						if (node.right) { 
							width += 15; 
							traversePostOrder(node.right);
							width -=15;  
						}
						if (visit) { 
							visit.call(this, node, depth, width); //could add depth & width to each node...
						}
						depth--; 			
					}
				}

				if (!startNode) { 
					startNode = this.rootNode; 
				}
				if (!order || order==="in") { 
					traverseInOrder(startNode);
				}
				else if (order ==="pre") { 
					traversePreOrder(startNode);
				}
				else if (order ==="post") { 
					traversePostOrder(startNode)
				}	 
			}

			Tree.prototype.traverseBreadth = function(startNode, visit) { 
				//process node, put node's children in a queue (left then right), dequeue node and recurse
				var myQueue = new queue();
				function traverseNode(node) {
					if (!node) { return; } //end of queue

					if (visit) { 
						visit.call(this,node); 
					} 
					if (node.left) { 
						myQueue(node.left); //enqueue
					} 
					if (node.right) { 
						myQueue(node.right); //enqueue
					}
					traverseNode(myQueue()); //dequeue & recurse
				}
				if (!startNode){ 
					startNode = this.rootNode; 
				}
				traverseNode(startNode); 
			}

			//TODO: 
			Tree.prototype.deleteNode = function(node) { 
				console.log("deleting node:" + node);
			}

			Tree.prototype.size = function(startNode) { 
				var length=0; 
				this.traverseDepth(startNode, function(node) { 
					length++; 
				});
				return length;
			}

			Tree.prototype.canvasRender = function(startNode) { 
				this.traverseDepth(startNode, canvasHelper.writeCanvasText);
			}

			Tree.prototype.htmlRender = function(startNode, targetElement) { 
				this.traverseDepth(startNode, writeHtmlNodes, "pre"); //postorder so the depths will come out in (reversed) order, then flip
				//TODO: pass in target element so it can get to the visit function
				var ele = $(targetElement); 
				var children = ele.children();//.get().reverse(); 
				ele.append(children); 
			}
			//todo: get the target element passed in
			function writeHtmlNodes(node, depth) { 
				var myRow = $("ul#tree-row-" + depth); //TODO: stop selecting the row on every node -memoize it - store it on the ul as a map? 
				if (myRow.length===0) { 
					myRow = $("<ul>", { 
								id: "tree-row-" + depth, 
								addClass: "tree-row",
							});	
					$("#htmlTree").append(myRow); 
				}
				
				//TODO: stop writing the row on every node
				var ele = node.htmlRender(); 
				//$("#htmlTree").append(myRow.append(node.htmlRender()));
				myRow.append(ele);

				console.log("myleft: " + ele[0].offsetLeft + " width: " + ele.outerWidth());
				//tell my children nodes where their left edges should be
				//would be cleaner inside the node render, but need to change that to have the DOM write happen there to get left/width
				if (node.left || node.right) { 
					var myLeft=ele[0].offsetLeft,
						myWidth=ele[0].offsetWidth; //or ele.outerWidth() + left
					if (node.left) { 
						node.left.rightEdge = myLeft - myWidth; 
					}
					if (node.right) { 
						node.right.leftEdge = myLeft + myWidth; 
					}
				}	
			}
			
			//boo to inline styles, but need to dynamically position
			//output of this can be used in a jquery css function call
			function getNodeCss(node) { 
				if (node.leftEdge) { 
					return {"left": node.leftEdge}
				}
				else if (node.rightEdge){ 
					return {"left": node.rightEdge}
				} 
				return undefined; 
			}
			//TreeNode object
			function TreeNode(id) { 
				this.id = id;
				this.name=id;
				this.left = undefined; 
				this.right= undefined;
				this.cssClass= undefined; 
			}

			TreeNode.prototype.htmlRender = function(showChildren){  
				if (!showChildren) { showChildren = true};
				var myCss = getNodeCss(this);
				var ele = $("<li>", {
							id: "tree-cell-" + this.id, 
							text: this.id,
							"data-left" : (this.left ? this.left.id : undefined), 
							"data-right" : (this.right ? this.right.id : undefined),
							css: myCss ? myCss : ""  
						}); 
				if (this.left && showChildren) { 
					ele.append($("<div>",{ 
									text: this.left.id,
									addClass : "node-left"
								}))
				}
				if (this.right && showChildren){ 			
					ele.append($("<div>", { 
									text: this.right.id,
									addClass : "node-right"
						})); 
				}
				return ele;
			}
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

			//queue implementation to avoid shift operation
			function queue() { 
				var first=0, last=-1, list=[], undefined; 
				return function(value){
					//enqueue
					if (value !== undefined) { 
						return list[++last] = value; 
					}
					//empty queue
					if (first > last) { 
						return undefined;
					}
					//called with no arg - dequeue
					value = list[first];
					delete list[first]; 
					first++; 
					return value; 
				}
			}


			//*** *** *** *** *** *** *** 
			//init & run like the wind
			var maxNodes=20;
			var sourceData = [];
			//array of numbers
			for (var i=0; i<maxNodes; i++) { 
				sourceData.push(i); 
			} 
			//randomize
			sourceData.shuffle(); 

			var	rootNode = new TreeNode(sourceData[0]); 
			var	myTree = new Tree(rootNode);

			for (var i=1; i<maxNodes; i++){
				var myNode = new TreeNode(sourceData[i]); 
				myTree.insertNode(myNode);
			}


			var outputHelper = (function() { 
				return { 

					DebugOutput : function() {
						//debug-ish output
						var ele = document.getElementById("rawData"); 
						if (ele) { 
							ele.innerHTML = sourceData.toString();
						}

						var tempArr = [];
						ele = document.getElementById("traverseDepthPre");
						if (ele) {
							myTree.traverseDepth(rootNode, function(node) {tempArr.push(node.id)}, "pre");
							ele.innerHTML = tempArr.toString(); 
						}
						tempArr=[];
						ele = document.getElementById("traverseDepthIn");
						if (ele) {
							//also myTree.toArray() or myTree.toString(); 
							myTree.traverseDepth(rootNode, function(node) {tempArr.push(node.id)}, "in");
							ele.innerHTML = tempArr.toString(); 
						}
						tempArr=[];
						ele = document.getElementById("traverseDepthPost");
						if (ele) {
							myTree.traverseDepth(rootNode, function(node) {tempArr.push(node.id)}, "post");
							ele.innerHTML = tempArr.toString(); 
						}
						tempArr=[];
						ele = document.getElementById("traverseBreadth");
						if (ele) {
							myTree.traverseBreadth(rootNode, function(node) {tempArr.push(node.id)});
							ele.innerHTML = tempArr.toString(); 
						}

						ele = document.getElementById("htmlTree"); 
						if (ele) { 
							myTree.htmlRender(rootNode, ele); 
						}

						//find a random number
						var idToFind = Math.floor(Math.random() * maxNodes); 
						console.log("FINDING: " + idToFind);
						console.log(myTree.findNode(idToFind)); 
					}
				}
			})();

			$(document).ready(function() { 
				outputHelper.DebugOutput(); 
			})
			//console.log(myTree); 

			var canvasHelper = (function(){ 
				//init canvas
				var canvas = document.getElementById('canvas');
				if (!canvas) { return false;}

				var context = canvas.getContext('2d'),
				canvasWidth = parseInt(canvas.getAttribute("width")), 
				canvasHeight = parseInt(canvas.getAttribute("height")),	 
				center = canvasWidth/2, 
				xLoc = canvasWidth/2,  
				yLoc = 10;

				//public 
				return { 
					writeCanvasText: function(node, depth, width) {
						var xLoc = center + width, 
							yStep=30,
							yLoc = depth*yStep;
			
						yLoc = depth*30;
						context.fillStyle = width < 0 ? "blue" : "red";
						context.font = "14px san-serif"; 
						console.log("writing " +node.id+ " -- depth: " + depth + " width: " + width + " --to :" + xLoc + ":" + yLoc);
						console.log("----------------------");
						context.fillText(node.id, xLoc, yLoc);

						if (!node.left) { yLoc -= yStep} //if we hit a stop, move back up
					}
				}
			})(); 
			//myTree.canvasRender(); 