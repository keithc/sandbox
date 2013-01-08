//Tree object
			//-----------
			function Tree (rootNode) { 
				this.rootNode = rootNode; 
			}
			
			//Traversal routines
			//------------------
			//Depth-first traversal
			//In-order is the default, but also included separate methods for pre & post order traversal at the cost of some duplicated code.
			//Since I wanted to render the tree in HTML, I needed rows. I added a shortcut property to calculate the depth as it recursed.
			Tree.prototype.traverseDepth = function(startNode, visit, order) { 
				var depth=0; // cheating for ease of rendering
				//pre-order processing
				function traversePreOrder(node) { 
					if (node) { 
						depth++;  
						if (visit) { 
							visit.call(this, node, depth); //could add depth & width to each node...
						}

						//left subtree
						if (node.left) { 
							traversePreOrder(node.left); 
						}

						//right subtree
						if (node.right) { 
							traversePreOrder(node.right);
						}
						depth--; 			
					}
				}
				//in-order processing
				function traverseInOrder(node) { 
					if (node) { 
						depth++;  
						//left subtree
						if (node.left) { 
							traverseInOrder(node.left); 
						}
						if (visit) { 
							visit.call(this, node, depth); 
						}
						//right subtree
						if (node.right) { 
							traverseInOrder(node.right);
						}
						depth--; 			
					}
				}
				//post-order processing
				function traversePostOrder(node) { 
					if (node) { 
						depth++;  

						//left subtree
						if (node.left) { 
							traversePostOrder(node.left); 
						}

						//right subtree
						if (node.right) { 
							traversePostOrder(node.right);
						}
						if (visit) { 
							visit.call(this, node, depth); 
						}
						depth--; 			
					}
				}
				//allow for a specific start node, else default to root
				if (!startNode) { 
					startNode = this.rootNode; 
				}
				//default to in-order node processing
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

			//Depth-first traversal
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

			//Other Tree methods
			//------------------
			//Insert a node, in proper sort order. 
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
			//TODO: finish me
			Tree.prototype.deleteNode = function(node) { 
				console.log("deleting node:" + node);
			}

			Tree.prototype.findNode = function(id, node) { 
				if (!node) { 
					node = this.rootNode; 
				}

				while (node){
					if (id > node.id) { 
						node = node.right;  
					}
					else if (id > node.id) { 
						node = node.left; 
					}
					else { 
						break ; //found it
					}
				}
				return node; 
			}
			//recursive - 80% slower 
			//http://jsperf.com/binary-search-tree-find-recursive-vs-non
			Tree.prototype.findNodeRecursiveButSlower = function(id, startNode) { 
				function traverseFind(id, node) { 
					if (!node) { 
						return node; //not in the tree
					}
					else if (id > node.id) { 
						return traverseFind(id, node.right);
					}
					else if (id < node.id) { 
						return traverseFind(id, node.left);
					}
					else {  
						return node; //found it 
					}
				}
				if (!startNode) { 
					startNode = this.rootNode; 
				}
				return traverseFind(id, startNode); 
			}

			
			// --- ---
			//credit to Nicholas Zakas for these
			Tree.prototype.toArray = function() { 
		        var result = [];
		        
		        this.traverseDepth(this.rootNode, function(node){
		            result.push(node.id);}, "in");
		        
		        return result;
			}


			Tree.prototype.toString = function() { 
				return this.toArray().toString(); 
			}

			Tree.prototype.size = function(startNode) { 
				var length=0; 
				this.traverseDepth(startNode, function(node) { 
					length++; 
				});
				return length;
			}
			// --- ---

			Tree.prototype.canvasRender = function(startNode) { 
				this.traverseDepth(startNode, canvasHelper.writeCanvasText);
			}
			
			//--- ---
			//https://gist.github.com/527683
			var ie = (function(){
 			    var undef,
        		v = 3,
       			div = document.createElement('div'),
        		all = div.getElementsByTagName('i');
    
    			while (
        			div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        			all[0]
    			);
    			
    			return v > 4 ? v : false;   
			}());
			if (/*@cc_on!@*/false && !ie) { ie = 10;}
			//--- ---

			//adapted from: http://www.gapjumper.com/research/lines.html
			function createLine(x1, y1, x2, y2)
			{
				//console.log(JSON.stringify(arguments));
				if (x2 < x1)
				{
					var temp = x1;
					x1 = x2;
					x2 = temp;
					temp = y1;
					y1 = y2;
					y2 = temp;
				}
				var line = document.createElement("div");
				line.className = "line";
				var length = Math.sqrt((x1-x2)*(x1-x2) + (y1-y2)*(y1-y2));
				line.style.width = length + "px";
				
				if (ie)
				{
					line.style.top = (y2 > y1) ? y1 + "px" : y2 + "px";
					line.style.left = x1 + "px";
					var nCos = (x2-x1)/length;
					var nSin = (y2-y1)/length;
					line.style.filter = "progid:DXImageTransform.Microsoft.Matrix(sizingMethod='auto expand', M11=" + nCos + ", M12=" + -1*nSin + ", M21=" + nSin + ", M22=" + nCos + ")";
				}
				else
				{
					var angle = Math.atan((y2-y1)/(x2-x1));
					line.style.top = y1 + 0.5*length*Math.sin(angle) + "px";
					line.style.left = x1 - 0.5*length*(1 - Math.cos(angle)) + "px";
					line.style.MozTransform = line.style.WebkitTransform = line.style.OTransform= "rotate(" + angle + "rad)";
				}
				var firstDiv = document.getElementsByTagName('div')[0];
				firstDiv.parentNode.insertBefore(line,firstDiv); 
				//var firstDiv = document.getElementById('htmlTree');
				//firstDiv.parentNode.insertBefore(line,firstDiv); 
			}


			//targetElement is a jquery element with the html tree inside
			//this won't be the fastest code ever, but drawing lines costs money
			function connectNodes(targetElement){
				$(targetElement).find("li").each(function(index,item) { 
					var $item = $(item), x1,x2,y1,y2;
					var myLeftNodeId = $item.data('left'),
						myRightNodeId = $item.data('right');

					//use strict here - 0 == "" is true
					if (myLeftNodeId !== "") {
						console.log("TOP: " + $item.offset().top + $item.height()); 
						var $myLeftEle = $("#tree-cell-" + myLeftNodeId);
						x1 = $item.offset().left; //my left edge x-coord
						x2 = $myLeftEle.offset().left + ($myLeftEle.outerWidth()/2); //my left child's center x-coord
						y1 = $item.offset().top + $item.outerHeight(); //findTopPos(item) + item.offsetHeight; //my bottom y-coord
						y2 = $myLeftEle.offset().top //.offsetTop; //my left child's top y-coord
						//console.log("connect ID: " + item.id + " to " + myLeftNodeId + " left: " + x1 + "," + y1 + ":" + x2 +","+y2);
						createLine(x1,y1,x2,y2); 
					}
					//var x1 = 
					if (myRightNodeId != "") {
						var $myRightEle = $("#tree-cell-" + myRightNodeId)
						x1 = $item.offset().left + $item.outerWidth(); //my right edge
						x2 = $myRightEle.offset().left + ($myRightEle.outerWidth()/2); //my right child's left edge
						y1 = $item.offset().top + $item.outerHeight(); //my bottom y-coord
						y2 = $myRightEle.offset().top; //my right child's top y-coord
						//console.log("connect ID: " + item.id + " to " + myRightNodeId + " right: " + x1 + "," + y1 + ":" + x2 +","+y2);
						createLine(x1,y1,x2,y2); 
					}
				});
			}

			Tree.prototype.htmlRender = function(startNode, targetElement) { 

				//traverse the tree, visit function (anonymous) builds the html for each node
				this.traverseDepth(startNode, function(node, depth){
						var myRow = $.data(targetElement, 'row'+ depth); //memoize the rows to avoid reselecting on each node or appending every child
						myRow = myRow ? myRow +node.htmlRender(true) : node.htmlRender(true);  // append if we already had something, otherwise insert
						$.data(targetElement, 'row'+ depth, myRow); //put back to the data				
		            }, "pre");
				
				//get the fully built rows out and append to the parent 
				var counter=1;  //depth starts at 1
				$targetElement = $(targetElement); 
				while (true) { 
					var row = $.data(targetElement, 'row' + counter) ; 
					if (!row) {
						break; 
					}
					row = "<ul class='tree-row' id='tree-row-" + counter + "'>" + row + "</ul>"; //build a ul with node li's inside
					$targetElement.append(row); //append to parent
					counter++
				}
				//draw lines!
				connectNodes($targetElement); 
			}

			// *** TreeNode object *** 
			function TreeNode(id) { 
				this.id = id;
				this.left = undefined; 
				this.right= undefined;
			}
			
			TreeNode.prototype.htmlRender = function(showChildren) { 
				function renderChildId(childId, css) {
					return ("<div class='" + css + "'>" + childId + "</div>");
				}

				var ele = "<li id='tree-cell-" + this.id 
							+ "' data-left='" + (this.left ? this.left.id : "") 
							+ "' data-right='" + (this.right ? this.right.id : "") 
							+ "'>" + this.id; 
				if (showChildren) { 
					if (this.left) { 
						ele += renderChildId(this.left.id, "node-left"); 
					}
					if (this.right) { 
						ele += renderChildId(this.right.id, "node-right"); 
					}
				}
				ele += "</li>"
				return ele; 
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

			//super slow compared to string concat http://jsperf.com/jquery-dom-create-vs-string
			TreeNode.prototype.htmlRenderjQuery = function(showChildren){  
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
					//	console.log("writing " +node.id+ " -- depth: " + depth + " width: " + width + " --to :" + xLoc + ":" + yLoc);
						//console.log("----------------------");
						context.fillText(node.id, xLoc, yLoc);

						if (!node.left) { yLoc -= yStep} //if we hit a stop, move back up
					}
				}
			})(); 

			$(document).ready(function() { 
				//HTML output
				outputHelper.DebugOutput(); 
				//Canvas output
				//myTree.canvasRender(); 
			})