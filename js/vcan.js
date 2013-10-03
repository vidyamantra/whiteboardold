/**
 * This is the framework of Canvas named vcan
 * Created by suman at VidyaMantra Edusystem Pvt.Ltd,
 * This can be used to create white board
 * @copyright 2013-2014
 */

(
	function (window, document){
		var vm_chat = window.vm_chat;
	
		/**
		 * This is core object on which
		 * all the  properties and methods  would initiated
		 * eg:- vcan.extend(), eg:- vcan.main.currentTransform
		 */
		var vcan = {
			/** extracts the canvas id 
			 * @param canvasId is canvas id
			 * @returns {vcan.main}
			 */	
			create : function (canvasId){
				if(canvasId.charAt(0) == '#'){
					var cid = canvasId.substring(1, canvasId.length);
					vcan.utility.canvasCalcOffset(cid);
					
					return new vcan.main(canvasId);
				}else{
					alert("there is a problem with canvas id");
				}
			}, 
			
			/**
			 *	initiates the various properties to vcan.main
			 *  call mouse.init() function
			 *  @param canvid is canvas's id
			 */
			main : function (canvid){
				vcan.main.children = []; //vcan.main should be converted into 'this' variable
				vcan.main.id = 0;
				vcan.main.canvas = document.querySelector(canvid);
				vcan.main.canid =  canvid.substring(1, canvid.length);
				vcan.main.currentTransform = "";
				//vcan.main.relatedTarget = "";
				
				/**
				 	NOTE:- this can be critical 
				 	it is disabled during the unit test  
					vcan.main.upperCanvasEl = {};
				**/
				vcan.main.replayObjs = [];
				vcan.main.dragMode = false;
				vcan.main.scaleMode = false;
				vcan.main.usrCurrAction = "";
				vcan.main.currObj = ""; // TODO this should be achieved  through the vcan.main.currentTransform; this one
				vcan.main.starter_obj_id = "";
				
				vcan.main.textObj = false;
				vcan.main.action = 'create';  //the vcan.main.action should be change into another name eg:- vcan.main.cMode or anything else
				vcan.wb = {}
				vcan.wb.sentPack = false;

				

				//the line of this code would be used into future.
				/**
				 	NOTE:- this can be critical 
				 	it is disabled during the unit test  
					vcan.main.upperCanvasEl.style = {'positon':'', 'width':'', 'height':'', 'left':'', 'top':'', 'browser-user-select':'', 'cursor':''};
				 **/
				
				/**
				 	NOTE:- this can be critical 
				 	it is disabled during the unit test 
			 	
					vcan.main.cursorMap = {
				        'tr': 'ne-resize',
				        'br': 'se-resize',
				        'bl': 'sw-resize',
				        'tl': 'nw-resize',
				        'ml': 'w-resize',
				        'mt': 'n-resize',
				        'mr': 'e-resize',
				        'mb': 's-resize'
				     };
				
					vcan.main.hoverCursor = 'move';
				**/
				//mouse().init();
				vcan.activMouse = new vcan.mouse();
				vcan.activMouse.init();
			},			
			/**
			 * The function merge the property of passed second object to passed first object 
			 * and return the first object. 
			 * @param fobj on which the other properties would be merged
			 * @param sobj the properties of object to be merged into fobj
			 * TODO inside this function we are not replacing the same name from sobj to fobj but it updates it's property name from sobj to fobj
			 * TODO this function should do optimization
			 */
			extend :  function (fobj, sobj){
				if((typeof fobj == 'object') && (typeof sobj == 'object')){
					for(var prop in sobj){
						fobj[prop] = sobj[prop];
					}
					return fobj;
				}else{
					alert("it seems that the arguments you passed are not object");
				}
			},
			
			/**
		     * 	 the particular obejct by rotating and scaling
		     * @param ctx specified context
		     * @param obj particular object
		     * TODO this function should contain into the object
		     */
		     transform : function(ctx, obj) {
		    	ctx.translate(obj.x, obj.y);
		        ctx.rotate(obj.theta);
		        ctx.scale(
		          obj.scaleX * (obj.flipX ? -1 : 1),
		          obj.scaleY * (obj.flipY ? -1 : 1)
		        );
		      },
			
			
			/**
			 * get the states of property of vcan.main 
			 * @param pname expects as a property name
			 * returns the states of property
			 */
			getStates:function (pname){
				return vcan.main[pname];
			},
			
			/**
			 * set the value of property to vcan.main 
			 * @param pname expects as a property name
			 * returns the states of property
			*/
			
			setValInMain : function (pname, value){
				return vcan.main[pname] = value;
			},
			
			/**
			 * get the position of object which is exist under the array
			 * @param a sets for array of object where
			 * @param fnc sets for comparison of properties of object
			 */ 
			ArrayIndexOf : function (a, fnc) {
				if (!fnc || typeof (fnc) != 'function') {
					return -1;
				}
				if (!a || !a.length || a.length < 1) return -1;
				for (var i = 0; i < a.length; i++) {
					if (fnc(a[i])) return i;
				}
				return -1;
			},
			
			 /**
			 * @method renderAll Renders all Object
			 * 
			 */
			 renderAll : function (ctx) {
				var length = vcan.main.children.length;
				
				//alert(typeof ctx + " suman");
				if(typeof ctx != 'object'){
					var ctx = vcan.main.canvas.getContext('2d');
				}
				
				
				var canelem = vcan.main.canvas;
			    vcan.clearContext(ctx);
			  
				  if(length) {
			    	for (var i = 0; i < length; ++i) {
				    	var vcanvas = vcan.main.canvas;
				    	//var ctx = vcanvas.getContext('2d');
				    	if(vcan.main.children[i].type == 'freeDrawing'){
				    		//vcan.main.children[i].render(ctx);
				    		vcan.utility.fhdRender(ctx, vcan.main.children[i]);
				    		
				    	}else {
				    		render(ctx, vcan.main.children[i]);
				    	}
				    	
				    		/*
				    		 * TODO will have to visi this code
				    		 * if(vcan.main.children[i].hasOwnProperty('children')){
			    				for(var j=0; j<vcan.main.children[i].children.length; j++){
			    					render(ctx, vcan.main.children[i].children[j]);
			    				}
			    			}*/
				    		
			    	}
			    }
			},
			
			/**
		     * Clears specified context of canvas element
		     * @method clearContext
		     * @param ctx  is specified context
		     * return canvas element
		     */
		     clearContext : function(ctx) {
		    	var canElem = vcan.main.canvas;
		        ctx.clearRect(0, 0, canElem.width, canElem.height);
		        return canElem;
		     },
		     
		     /**
		      * Deactivates all objects by calling their setActive(false)
		      * @method deactivateAll
		      */
		     deactivateAll : function () {
		    	 var allObjects = vcan.main.children,
		           i = 0,
		           len = allObjects.length;
			       for ( ; i < len; i++) {
			      	 	allObjects[i].setActive(false);
			       	}
			      // return this;
		     }, 
		     
		     
		     /**
		      * This object has different kind 
		      * of methods that are using for different pourpose 
		      * eg:- setVal(), setAngle() 
		      */
		     utility : {
		    	 	
		    	 	/**
		    	     * Calculates canvas element offset relative to the document
		    	     * @param cid is canvas's id
		    	     * @return {offset} calculated value value
		    	     */
		    	 
		    	   canvasCalcOffset : function (cid) {
		    		   /*alert('suman');
		    		   debugger; */
		    		    var  vcanMain = vcan.main;
		    	    	//TODO cid should be happened as in fabric
		    	    	var canvasEl = document.getElementById(cid);
		    	    	var offset = vcan.utility.getElementOffset(canvasEl);
		    	    	vcanMain.offset = offset; 
		    	    	return offset;
		    	    	
		    	    },
		    	    
		    	    
		    	    /**
		    	     * Returns offset for a given element
		    	     * @method getElementOffset
		    	     * @param {HTMLElement} element Element to get offset for
		    	     * @return {Object} Object with "left" and "top" properties
		    	     */
		    	    getElementOffset : function (element) {
		    	    	
		    			  // TODO (kangax): need to fix this method
		    			  var valueT = 0, valueL = 0;
		    			  do {
		    				    valueT += element.offsetTop  || 0;
		    				    valueL += element.offsetLeft || 0;
		    				    element = element.offsetParent;
		    			  } 
		    			  while (element);
		    			  return ({ x: valueL, y: valueT});
		    	     },
		    	    
		    	    
		    	    /**
		    	     * this function does set the value on property of passed object
		    	     * @param obj expect object on which the property of value should be stored 
		    	     * @param property expects the property name on which the value would be stored
		    	     * @param the value would be stored on property of object
		    	     * TODO this function should transfer to object method
		    	     */
		    	    setVal : function(obj, property, value) { 
		    			 var shouldConstrainValue = (property === 'scaleX' || property === 'scaleY') && value < obj.MIN_SCALE_LIMIT;
		    			 if (shouldConstrainValue) {
		    				 value = obj.MIN_SCALE_LIMIT;
		    			 }
		    			 if (typeof property == 'object') {
		    				   for (var prop in property) {
		    				     vcan.utility.setVal(obj, prop, property[prop]);
		    				   }
		    			 }
		    			 else {
		    				   if (property === 'angle') {
		    					  vcan.utility.setAngle(obj, value);
		    				   }
		    				   else {
		    					   obj[property] = value;
		    				   }
		    			 }
		    			
		    			 return obj;
		    	   },
		    	   
		    	   /**
		    	    *  This function returns the value with passed property from passed object
		    	    *  @param obj expects the object
		    	    *  @property expects the property name 
		    	    *  return the value
		    	    *  TODO this function should transfer to object method
		    	    */
		    	   getVal : function (obj, property){
		    		   return obj[property];
		    	   },
		    	   
		    	   /**
		    	    * Sets object's angle
		    	    * @param value {Number} angle value
		    	    * @return {Object} thisArg
		    	    */
		    	    setAngle : function(obj, value) {
		    			 obj.theta = value / 180 * Math.PI;
		    			 obj.angle = value;
		    			 return obj;
		    	    },
		    	   
		    	   
		    	   /**
	    	         * Gets the actual horizontal and vertical position
	    	         * expects as event object as parameter
	    	         * @param event is event object
	    	         * returns horizontal and vertical position
	    	         */
		    	    actualPointer : function(event) {
		    			// TODO this method needs fixing
		    		    return { x: vcan.utility.pointerX(event), y: vcan.utility.pointerY(event) };
		    	    }, 
		    	    
		    	    /**
	    	         * Gets the actual horizontal position
	    	         * expects as event object as parameter
	    	         * @param event is event object
	    	         * returns horizontal position
	    	         */
		    	    pointerX : function (event){
		    	    	
		    	    	/* TODO follow the standard as framework done */
	    	    		var docElement = document.documentElement,
	    	    	    body = document.body || { scrollLeft: 0 };
	    	    	    
	    	    	      // looks like in IE (<9) clientX at certain point (apparently when mouseup fires on VML element)
	    	    	    // is represented as COM object, with all the consequences, like "unknown" type and error on [[Get]]
	    	    	    // need to investigate later
	    	    	    return  event.pageX || ((typeof event.clientX != 'unknown' ? event.clientX : 0) +
	    	    		(docElement.scrollLeft || body.scrollLeft) -
	    	    	    (docElement.clientLeft || 0));
		    	        
		    	    },
		    	    
		    	    
		    	    /**
	    	         * Gets the actual vertical position
	    	         * expects as event object as parameter
	    	         * @param is an event object
	    	         * returns vertical position
	    	         */
		    	    pointerY : function (event){
		    	    	/*TODO follow the standard as framework done*/
	    	        	var docElement = document.documentElement,
	    	    		body = document.body || { scrollTop: 0 };
	    	            return  event.pageY || ((typeof event.clientY != 'unknown' ? event.clientY : 0) +
	    	             (docElement.scrollTop || body.scrollTop) -
	    	             (docElement.clientTop || 0));
		    	        
		    	    },
		    	    
		    	    /**
		    	     * Returns pointer coordinates relative to canvas.
		    	     * @method getReltivePoint
		    	     * @param e is ean event object
		    	     * @return {Object} object with "x" and "y" number values
		    	     */
		    	    
		    	     getReltivePoint: function (e) {
		    	    	var offset = vcan.main.offset;
		    	    	var pointer = vcan.utility.actualPointer(e);
		    	    	
		    	    	//alert(pointer.x - offset.x);
		    	    	//alert(pointer.y - offset.y);
		    	    	return {
		    		    	x: pointer.x - offset.x,
		    		    	y: pointer.y - offset.y
		    		    };
		    	    },
		    	    
		    	    /**
		    	     * Transforms degrees to radians.
		    	     * @static
		    	     * @method degreesToRadians
		    	     * @param {Number} degrees value in degrees
		    	     * @return {Number} value in radians
		    	     */
		    	     degreesToRadians : function(degrees) {
		    	    	 var PiBy180 = Math.PI / 180;
		    	    	 return degrees * PiBy180;
		    	     },
		    	     
		    	     
		    	     /**
		    	     * Sets given object as active object
		    	     * @method setActiveObject
		    	     * @param object is the object which have to be active
		    	     * @returns return particular that object
		    	     */
		    	    setActiveObject : function (object) {
		    	    	//var vcanMain = vcan.main;
		    	        if (vcan.main.activeObject) {
		    	        	vcan.main.activeObject.setActive(false);
		    	        }
		    	        vcan.main.activeObject = object;
		    	        object.setActive(true);
		    	        //renderAll();
		    	        
		    	        /**
		    	         * Note:- this is disabled after tested
		    	         * can cause the problem
		    	         */
		    	        //vcan.renderAll();
		    	        
		    	        return object;
		    	     },
		    	     
		    	      //TODO this funciton should be optimized in future
		    	     //TODO this function should be done properly 
		    	 	//TODO this is not good way to talk	it woulld be greater if we can ignore this function 
		    	   // this should be method of the object
		    	 	
		    	     updateObj : function(obj){
		    	 		var newObj = {};
		    	 		for(prop in obj){
		    	 			if(prop != 'oCoords'){
		    	 				newObj[prop] = obj[prop];
		    	 			}else{
		    	 				newObj.start = {};
		    	 				newObj.end = {};
		    	 				newObj.start.x = obj[prop].tl.x;
		    	 				newObj.start.y = obj[prop].tl.y;
		    	 				newObj.end.x = obj[prop].br.x;
		    	 				newObj.end.y = obj[prop].br.y;
		    	 			}
		    	 		}
		    	 		return newObj;
		    	 	},

		    	 	/*
		    	 	 * imporant right now this funciton is not using
		    	 	 */
		    	 	/**
		    	     * Sets the cursor depending on where the canvas is being hovered.
		    	     * Note: very buggy in Opera
		    	     * @method setCursorFromEvent
		    	     * @param e {Event} Event object
		    	     * @param target {Object} Object that the mouse is hovering, if so.
		    	     */
		    		
		    	 	setCursorFromEvent : function (vcanMain, e, target) {
		    			
		    	 		//var vcanMain = vcan.main;
		    		      var s = vcanMain.upperCanvasEl.style;
		    		      if (!target) {
		    					s.cursor = this.defaultCursor;
		    					return false;
		    		      }else {
		    			    	var corner = target.findTargetCorner(e);
		    			    	if (!corner) {
		    			    		s.cursor = vcanMain.hoverCursor;
		    			        }
		    			        else {
		    				          if (corner in vcanMain.cursorMap) {
		    				        	  s.cursor = vcanMain.cursorMap[corner];
		    				          } else if (corner === 'mtr' && target.hasRotatingPoint) {
		    				        	  s.cursor = vcanMain.rotationCursor;
		    				          } else {
		    				        	  s.cursor = this.defaulCursor;
		    				        	  return false;
		    				          }
		    			        }
		    		      }
		    		      return true;
		    		 },
		    		 
		    		 /**
		    		  * this function returns the number object
		    		  * those have created on canavas
		    		  * TODO this function should used
		    		  * instead of vcan.main.children
		    		  */
		    		 getChildren : function (){
		    			 return vcan.main.children;
		    		 },
		    		 
		    		 setMoveChunk : function (moveChunk, currAdTime){
	        			 var tempChunkTarget = vcan.main.currentTransform.target;
	        			 tempChunkTarget = vcan.extend({}, tempChunkTarget);
	        			 var chunkTarget = 	vcan.extend(tempChunkTarget, {mdTime:currAdTime, 'multiuser' : true, func : 'add',  currUsrAction : 'create', lastElement : false});
	        			 moveChunk.push(chunkTarget);
	        			 
	        			 tempChunkTarget = vcan.extend({}, vcan.main.currentTransform.target);
		        		 var chunkTarget = 	vcan.extend(tempChunkTarget, {mdTime:currAdTime, lastElement : true, func : 'add', currUsrAction : 'create', 'multiuser' : true});
	        			 moveChunk.push(chunkTarget);
	        			 return moveChunk;
					 },
					 
					 calcRecivedPacket : function (){
						 //var = 
					 }
		    	   
		     },
		     
		     
		     /**
		      * TODO this object has some methods
		      * through which the user can do interact with
		      * created object eg:- drag, rotate. 
		      */
		     interact : {
		    	 
		    	  	/**
		    		 * Rotates object by invoking its rotate method
		    		 * @method rotateObject
		    		 * @param x {Number} pointer's x coordinate
		    		 * @param y {Number} pointer's y coordinate
		    		 */
			    	rotateObject : function (x, y) {
			    		 var t = vcan.main.currentTransform,
						  //TODO we should get the offset through this o = this._offset;
						  
						 // o = calcOffset(vcan.main.canvas.id)
						  o = vcan.main.offset;
						  if (t.target.lockRotation) return;
						  var lastAngle = Math.atan2(t.ey - t.y - o.y, t.ex - t.x - o.x),
						      curAngle = Math.atan2(y - t.y - o.y, x - t.x - o.x);
						  vcan.utility.setVal(t.target, 'theta', (curAngle - lastAngle) + t.theta);
					},
					
					
					 /**
				     * Scales object by invoking its scaleX/scaleY methods
				     * @method scaleObject
				     * @param x {Number} pointer's x coordinate
				     * @param y {Number} pointer's y coordinate
				     * @param by {String} Either 'x' or 'y' - specifies dimension constraint by which to scale an object.
				     *                    When not provided, an object is scaled by both dimensions equally
				     */
				     scaleObject : function (x, y, by) {
						  var t = vcan.main.currentTransform,
						      //offset = vcanMain.offset,
						  offset = vcan.main.offset
						  target = t.target;
						  if (target.lockScalingX && target.lockScalingY) return;
						  var lastLen = Math.sqrt(Math.pow(t.ey - t.y - offset.y, 2) + Math.pow(t.ex - t.x - offset.x, 2)),
						  curLen = Math.sqrt(Math.pow(y - t.y - offset.y, 2) + Math.pow(x - t.x - offset.x, 2));
						
						  target.scaling = true;
						
						  if (!by) {
							    target.lockScalingX || vcan.utility.setVal(target, 'scaleX', t.scaleX * curLen/lastLen);
							    target.lockScalingY || vcan.utility.setVal(target, 'scaleY', t.scaleY * curLen/lastLen);
						  }
						  else if (by === 'x' && !target.lockUniScaling) {
							  target.lockScalingX || vcan.utility.setVal(target,'scaleX', t.scaleX * curLen/lastLen);
						  }
						  else if (by === 'y' && !target.lockUniScaling) {
							  target.lockScalingY || vcan.utility.setVal(target, 'scaleY', t.scaleY * curLen/lastLen);
						  }
				    },
				    
				    /**
				     * Translates object by "setting" its x/y
				     * @method translateObject
				     * @param x {Number} pointer's x coordinate
				     * @param y {Number} pointer's y coordinate
				     */
				    
				    translateObject : function (x, y) {
				    	 
					     var target = vcan.main.currentTransform.target;
					     target.lockMovementX || vcan.utility.setVal(target, 'x', x - vcan.main.currentTransform.offsetX);
						 target.lockMovementY || vcan.utility.setVal(target, 'y', y - vcan.main.currentTransform.offsetY);
						 return target;
				    }
			   },
			   
			   
			   /***
			    *  this object has various methods
			    *  which are used to against virtual box 
			    *  for particular object
			    */
			   virtual_box : {
					   /**
					     * Helper method to determine how many cross points are between the 4 image edges
					     * and the horizontal line determined by the position of our mouse when clicked on canvas
					     * @method findCrossPoints
					     * @param ex {Number} x coordinate of the mouse
					     * @param ey {Number} y coordinate of the mouse
					     * @param oCoords {Object} Coordinates of the image being evaluated
					*/
				   findCrossPoints : function(ex, ey, oCoords) {
						  var b1, b2, a1, a2, xi, yi,
					          xcount = 0,
					          iLine;

					      for (var lineKey in oCoords) {
					        iLine = oCoords[lineKey];
					        // optimisation 1: line below dot. no cross
					        if ((iLine.o.y < ey) && (iLine.d.y < ey)) {
					        	continue;
					        }
					        // optimisation 2: line above dot. no cross
					        if ((iLine.o.y >= ey) && (iLine.d.y >= ey)) {
					        	continue;
					        }
					        // optimisation 3: vertical line case
					        if ((iLine.o.x == iLine.d.x) && (iLine.o.x >= ex)) {
						          xi = iLine.o.x;
						          yi = ey;
					        }
					        
					        // calculate the intersection point
					        else {
						          b1 = 0;
						          b2 = (iLine.d.y-iLine.o.y)/(iLine.d.x-iLine.o.x);
						          a1 = ey-b1*ex;
						          a2 = iLine.o.y-b2*iLine.o.x;
				
						          xi = - (a1-a2)/(b1-b2);
						          yi = a1+b1*xi;
					        }
					        // dont count xi < ex cases
					        if (xi >= ex) {
					        	xcount += 1;
					        }
					        // optimisation 4: specific for square images
					        if (xcount == 2) {
					        	break;
					        }
					    }
					     return xcount;
					},
					
					  /**
				     * Method that returns an object with the 4 image lines in it given the coordinates of the corners
				     * @method getImageLines
				     * @param oCoords {Object} coordinates of the image corners
				     */
					 //TODO the i is not using here we can remove it
					 getImageLines : function(oCoords, i) {
						  return {
								topline: {	
									  o: oCoords.tl,
									  d: oCoords.tr
								},
								rightline: {
									  o: oCoords.tr,
									  d: oCoords.br
								},
								bottomline: {
									  o: oCoords.br,
									  d: oCoords.bl
								},
								leftline: {
									  o: oCoords.bl,
									  d: oCoords.tl
								}
						  }
					},
					
					/**
				     * Applies one implementation of 'point inside polygon' algorithm
				     * @method containsPoint
				     * @param e { Event } event object
				     * @param target { vcan.Object } object to test against
				     * @return {Boolean} true if point contains within area of given object
				     */
					
					  containsPoint : function (e, target) {
						  var pointer = vcan.utility.getReltivePoint(e);
						  var  x  = pointer.x,
						  y = pointer.y;
						
						  // http://www.geog.ubc.ca/courses/klink/gis.notes/ncgia/u32.html
						  // http://idav.ucdavis.edu/~okreylos/TAship/Spring2000/PointInPolygon.html
						
						  // we iterate through each object. If target found, return it.
						  var iLines = vcan.virtual_box.getImageLines(target.oCoords),
						  xpoints = vcan.virtual_box.findCrossPoints(x, y, iLines);
						
						  var canId = vcan.main.canvas.id;  
					 	  if ((xpoints && xpoints % 2 === 1) || target.findTargetCorner(e) ) {
							  return true;
						  }
						  return false;
					}
						
					
			   }
		};
		
		
		
		
		//vcan.jc = 0;
		
		/**
		 * through the prototype we are adding method on object which is created by new vcan.main(canvasId);
		 **/
		vcan.main.prototype = {
			
			/**
			 * draws the particular object and added the object into children of vcan.main object.
			 * @param obj the object on which operation would operated
			 * 
			 */
		    addObject : function (obj){
				if(typeof obj.coreObj == 'object'){
					if(obj.coreObj.type != 'freehand'){
						vcan.main.children.push(obj.coreObj); //containing all the objects into children array
					}
					var vcanvas = vcan.main.canvas;
					var ctx = vcanvas.getContext('2d');
						
						//obj.coreObj.ctx = ctx;
						render(ctx, obj.coreObj);
							
				}
			},
			
			/**
			 * remove the passed object 
			 * @param obj which have to be delete
			 */
			removeObject:function (obj){
				remove(obj);
			},
			
			
			/**
			 * TODO
			 * this function  is not used right now
			 * binding the event handler on canvas 
			 * @param type is event type
			 * @param handler is function which is executed on this event type
			 */
			
			bind : function (type, handler){
				 events().bind(vcan.main.canvas, type, handler);
			},
			
			
			/**
			 * 	initiates the other default value for particular object 
			 *  when this particular object is displaying
			 * 	@param obj applied the default value to that object
			 *  returns the object on which the co-ordinate initiated
			 * 
			 */
			readyObject : function (obj, replayObject){
				var obj = vcan.extend({}, obj);
				//TODO this should be done into proper way or proper format
				// I think it would be better if below condition would

				// obj.id == undefined is used for drawing free draw for 
				// multi user
				if(replayObject  != true && obj.id == undefined){
					//alert('khan');
					vcan.main.id++;
					//console.log('created Id ' + vcan.main.id++);
					obj.id = vcan.main.id; 
					//console.log('thi' + vcan.main.id);
				}
				
				obj.cornersize = 12;
				obj.rotatingPointOffset = 40; 
				obj.selectable = true; //TODO this could be removed not sure but draggable property already defined 
				obj.downObj = false;
				obj.active = false; //TODO that should be set through setActive() function
				obj.cornersize = 12;
				obj.padding = 0;
				obj.hasControls = true;
				obj.cornerColor='rgba(102,153,255,0.5)';
				
				//obj.borderColor = '#000'; Note: below three line code look like this
				if(obj.borderColor == undefined){
					obj.borderColor = '#000'; 
				}
				

				obj.flipX = false;
				obj.flipY = false;
				obj.draggable = false;
				obj.hasBorders = true;
				obj.hasRotatingPoint = false;
				//TODO this should be dynamic and should not be consider on here
				obj.hideCorners = false;
				obj.lockRotation = false;
				obj.MIN_SCALE_LIMIT = 0.1;
				obj.borderOpacityWhenMoving =  0.4;
				
				if(!obj.hasOwnProperty('theta')){
					obj.theta = 0;
				}
				
				if(!obj.hasOwnProperty('scaleX')){
					obj.scaleX  = 1;
				}
				
				if(!obj.hasOwnProperty('scaleY')){
					obj.scaleY = 1;
				}
				
				
				if(obj.type == 'line'){
					vcan.objLine = new vcan.line();
					vcan.objLine.init(obj);
				}else if (obj.type == 'rectangle'){
					vcan.objRect = new vcan.rectangle();
					vcan.objRect.init(obj);
				}else if(obj.type == 'oval'){
					vcan.objOval = new vcan.oval();
					vcan.objOval.init(obj);
				}else if(obj.type == 'triangle'){
					vcan.objTri = new vcan.triangle();
					vcan.objTri.init(obj);
				}else if(obj.type == 'text'){
					vcan.objTxt = new vcan.text();
					vcan.objTxt.init(obj);  
				}
				
				//TODO this function should not be inside the makeDispObject
				  /**
			     * @param obj function operated on it
			     * @return {Number} width value
			     */
				obj.getWidth = function() {
					return this.width * this.scaleX;
			    }
			 
			 	/**
			     * @param obj function operated on it
			     * @return {Number} height value
			     */
				obj.getHeight = function() {
			    	return this.height * this.scaleY;
			    }
			    
				
				 /**
				  * Sets the 9 co-ordinates for particular object
				  * tl, tr, bl, br, ml, mt, mr, mb, mtr	 
				  * return the object
				  */ 
				obj.setCoords = function() {
					 //alert("before objects");
					 //this should come dynamically
					 this.currentWidth = this.width * this.scaleX;
					 this.currentHeight = this.height * this.scaleY;
	
					 this.hypotenuse = Math.sqrt(
				        Math.pow(this.currentWidth / 2, 2) +
				        Math.pow(this.currentHeight / 2, 2));
					 this.angle = Math.atan(this.currentHeight / this.currentWidth);
				      	
					 this.theta = this.theta;
				      		
				      // offset added for rotate and scale actions
			      	  var offsetX = Math.cos(this.angle + this.theta) * this.hypotenuse,
			          offsetY = Math.sin(this.angle + this.theta) * this.hypotenuse,
			          theta = this.theta,
			          sinTh = Math.sin(theta),
			          cosTh = Math.cos(theta);
			      	 
			      	  
				      var tl = {
				    	   x: this.x - offsetX,
						   y: this.y - offsetY
				      };
				      
				      var tr = {
					        x: tl.x + (this.currentWidth * cosTh),
					        y: tl.y + (this.currentWidth * sinTh)
				      };
				      
				      var br = {
					        x: tr.x - (this.currentHeight * sinTh),
					        y: tr.y + (this.currentHeight * cosTh)
				      };
				      
				      var bl = {
					        x: tl.x - (this.currentHeight * sinTh),
					        y: tl.y + (this.currentHeight * cosTh)
				      };
				      var ml = {
					        x: tl.x - (this.currentHeight/2 * sinTh),
					        y: tl.y + (this.currentHeight/2 * cosTh)
					      };
				      var mt = {
					        x: tl.x + (this.currentWidth/2 * cosTh),
					        y: tl.y + (this.currentWidth/2 * sinTh)
				      };
				      var mr = {
					        x: tr.x - (this.currentHeight/2 * sinTh),
					        y: tr.y + (this.currentHeight/2 * cosTh)
					   };
				      var mb = {
					        x: bl.x + (this.currentWidth/2 * cosTh),
					        y: bl.y + (this.currentWidth/2 * sinTh)
					        
				      };
				      var mtr = {
					        x: tl.x + (this.currentWidth/2 * cosTh),
					        y: tl.y + (this.currentWidth/2 * sinTh)
				      };
	
	
				      // clockwise
				      this.oCoords = { tl: tl, tr: tr, br: br, bl: bl, ml: ml, mt: mt, mr: mr, mb: mb, mtr: mtr };
	
				      // set coordinates of the draggable boxes in the corners used to scale/rotate the image
				      //TODO in proper way
				      this.setCornerCoords();
				      
				      /**
				       * Determines which one of the four corners has been clicked of bounding box
				       * @method findTargetCorner
				       * @param e {Event} event object
				       * @return {String|Boolean} corner code (tl, tr, bl, br, etc.), or false if nothing is found
				       */
				      obj.findTargetCorner = function(e) {
				  		  var offset = vcan.main.offset; 
				  		  
				  		  if (!this.hasControls) return false;
				  		  
				  		  //	  var pointer = actualPointer(e),
				  		  	 var pointer = vcan.utility.actualPointer(e);					
				  		      var ex = pointer.x - offset.x,
				  		      ey = pointer.y - offset.y;
				  		       var xpoints,
				  		      lines;
				  		
				  		  //for (var i in this.oCoords) {  //should get through the this.oCoords
				  		  for (var i in this.oCoords) { 
				  				if (i === 'mtr' && !this.hasRotatingPoint) {
				  						return false;
				  				}
				  		
				  				lines = vcan.virtual_box.getImageLines(this.oCoords[i].corner, i);
				  				// debugging
				  				// canvas.contextTop.fillRect(lines.bottomline.d.x, lines.bottomline.d.y, 2, 2);
				  				//         canvas.contextTop.fillRect(lines.bottomline.o.x, lines.bottomline.o.y, 2, 2);
				  				//
				  				//         canvas.contextTop.fillRect(lines.leftline.d.x, lines.leftline.d.y, 2, 2);
				  				//         canvas.contextTop.fillRect(lines.leftline.o.x, lines.leftline.o.y, 2, 2);
				  				//
				  				//         canvas.contextTop.fillRect(lines.topline.d.x, lines.topline.d.y, 2, 2);
				  				//         canvas.contextTop.fillRect(lines.topline.o.x, lines.topline.o.y, 2, 2);
				  				//
				  				//         canvas.contextTop.fillRect(lines.rightline.d.x, lines.rightline.d.y, 2, 2);
				  				//         canvas.contextTop.fillRect(lines.rightline.o.x, lines.rightline.o.y, 2, 2);
				  				

				  				xpoints = vcan.virtual_box.findCrossPoints(ex, ey, lines);
				  			
				  				if (xpoints % 2 == 1 && xpoints != 0) {
				  			    	obj.corner = i;
				  			    	return i;
				  			    }
				  			}
				  		return false;
				      }
				      
				      
				      return this;
				    }
				
				
				
				/**
			     * Draws borders of an object's bounding box.
			     * Requires properties: width, height
			     * @param ctx context of canvas element
			     * @param obj the operation would operated on it
			     * @return {vcan.Object} thisArg
			     */
				//TOOD that function  should create through the contstructor of object
				obj.drawBorders= function(ctx){
				      
					 if (!this.hasBorders) return;

					  var padding = this.padding,
					      padding2 = padding * 2;
					
					  ctx.save();
					
					  ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
					  ctx.strokeStyle = this.borderColor;
					
					  var scaleX = 1 / (this.scaleX < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleX),
					      scaleY = 1 / (this.scaleY < this.MIN_SCALE_LIMIT ? this.MIN_SCALE_LIMIT : this.scaleY);
					
					  ctx.lineWidth = 1 / this.borderScaleFactor;
					  ctx.scale(scaleX, scaleY);
					
					  var w =  this.getWidth(),
					  	  h =  this.getHeight();
					  
					  ctx.strokeRect(
					    ~~(-(w / 2) - padding) + 0.5, // offset needed to make lines look sharper
					    ~~(-(h / 2) - padding) + 0.5,
					    ~~(w + padding2),
					    ~~(h + padding2)
					  );
					
					  if (this.hasRotatingPoint && !this.hideCorners && !this.lockRotation) {
						    var rotateHeight = (this.flipY ? h : -h) / 2;
						    var rotateWidth = (-w/2);
						
						    ctx.beginPath();
						    ctx.moveTo(0, rotateHeight);
						    ctx.lineTo(0, rotateHeight + (this.flipY ? this.rotatingPointOffset : -this.rotatingPointOffset));
						    ctx.closePath();
						    ctx.stroke();
					  }
					
					  ctx.restore();
					  return this;
				    
				}
				
				/**
				 * Draws corners of an object's bounding box.
				 * Requires  properties: width, height, scaleX, scaleY
				 * Requires public options: cornersize, padding
				 * @param ctx context of canvas element
				 * @param obj the operation would operated on it
				 * @return {vcan.Object} thisArg
				 */
				 obj.drawCorners = function(ctx) {
						
					  if (!this.hasControls) return;
					
					  var size = this.cornersize,
					      size2 = size / 2,
					      padding = this.padding,
					      left = -(this.width / 2),
					      top = -(this.height / 2),
					      _left,
					      _top,
					      sizeX = size / this.scaleX,
					      sizeY = size / this.scaleY,
					      scaleOffsetY = (padding + size2) / this.scaleY,
					      scaleOffsetX = (padding + size2) / this.scaleX,
					      scaleOffsetSizeX = (padding + size2 - size) / this.scaleX,
					      scaleOffsetSizeY = (padding + size2 - size) / this.scaleY,
					      height = this.height;
					
					  ctx.save();
					 // ctx.globalAlpha = this.isMoving ? this.borderOpacityWhenMoving : 1;
					  ctx.fillStyle = this.cornerColor;
					
					  // top-left
					  _left = left - scaleOffsetX;
					  _top = top - scaleOffsetY;
					  ctx.fillRect(_left, _top, sizeX, sizeY);
					
					  // top-right
					  _left = left + this.width - scaleOffsetX;
					  _top = top - scaleOffsetY;
					  ctx.fillRect(_left, _top, sizeX, sizeY);
					
					  // bottom-left
					  _left = left - scaleOffsetX;
					  _top = top + height + scaleOffsetSizeY;
					  ctx.fillRect(_left, _top, sizeX, sizeY);
					
					  // bottom-right
					  _left = left + this.width + scaleOffsetSizeX;
					  _top = top + height + scaleOffsetSizeY;
					  ctx.fillRect(_left, _top, sizeX, sizeY);
					
					  // middle-top
					  _left = left + this.width/2 - scaleOffsetX;
					  _top = top - scaleOffsetY;
					  ctx.fillRect(_left, _top, sizeX, sizeY);
					
					  // middle-bottom
					  _left = left + this.width/2 - scaleOffsetX;
					  _top = top + height + scaleOffsetSizeY;
					  ctx.fillRect(_left, _top, sizeX, sizeY);
					
					  // middle-right
					  _left = left + this.width + scaleOffsetSizeX;
					  _top = top + height/2 - scaleOffsetY;
					  ctx.fillRect(_left, _top, sizeX, sizeY);
					
					  // middle-left
					  _left = left - scaleOffsetX;
					  _top = top + height/2 - scaleOffsetY;
					  ctx.fillRect(_left, _top, sizeX, sizeY);
					
					  // middle-top-rotate
					  if (this.hasRotatingPoint) {
					    _left = left + this.width/2 - scaleOffsetX;
					    _top = this.flipY ?
					      (top + height + (this.rotatingPointOffset / this.scaleY) - sizeY/2)
					      : (top - (this.rotatingPointOffset / this.scaleY) - sizeY/2);
					
					    ctx.fillRect(_left, _top, sizeX, sizeY);
					  }
					
					  ctx.restore();
					
					  return this;
				  }	
				
				 
			 	/**
			     * Sets state of an object - `true` makes it active, `false` - inactive
			     * @param {Boolean} active
			     * @return {vcan.Object} thisArg
			     */
			     obj.setActive = function(active) {
					 this.active = !!active;
					 return this;
			     },
			     
			     /**
			      *  sets the particular value either draggable and vice-versa   
			      */
			     obj.dragDrop = function (boolVal){
					 if(boolVal != undefined){
						 this.draggable = boolVal;
					 }else{
						 this.draggable = false;
					 }
				 },
			     
			     /**
			      * Sets the coordinates of the draggable boxes in the corners of
			      * the image used to scale/rotate it.
			      * @method setCornerCoords
			      * @param obj the object of which sets the co-ordinates
			      */
			     //TODO use this instead of obj
			     obj.setCornerCoords = function() {
			     	//var coords = this.oCoords,
			     	var coords = this.oCoords,
			           theta = vcan.utility.degreesToRadians(45 - this.getAngle()),
			           cornerHypotenuse = Math.sqrt(2 * Math.pow(this.cornersize, 2)) / 2,
			           cosHalfOffset = cornerHypotenuse * Math.cos(theta),
			           sinHalfOffset = cornerHypotenuse * Math.sin(theta),
			           sinTh = Math.sin(this.theta),
			           cosTh = Math.cos(this.theta);

			       coords.tl.corner = {
			 			tl: {
			 				  x: coords.tl.x - sinHalfOffset,
			 				  y: coords.tl.y - cosHalfOffset
			 			},
			 			tr: {
			 				  x: coords.tl.x + cosHalfOffset,
			 				  y: coords.tl.y - sinHalfOffset
			 			},
			 			bl: {
			 				  x: coords.tl.x - cosHalfOffset,
			 				  y: coords.tl.y + sinHalfOffset
			 			},
			 			br: {
			 				  x: coords.tl.x + sinHalfOffset,
			 				  y: coords.tl.y + cosHalfOffset
			 			}
			       };

			       coords.tr.corner = {
			 			tl: {
			 				  x: coords.tr.x - sinHalfOffset,
			 				  y: coords.tr.y - cosHalfOffset
			 			},
			 			tr: {
			 				  x: coords.tr.x + cosHalfOffset,
			 				  y: coords.tr.y - sinHalfOffset
			 			},
			 			br: {
			 				  x: coords.tr.x + sinHalfOffset,
			 				  y: coords.tr.y + cosHalfOffset
			 			},
			 			bl: {
			 				  x: coords.tr.x - cosHalfOffset,
			 				  y: coords.tr.y + sinHalfOffset
			 			}
			       };

			       coords.bl.corner = {
			         tl: {
			 	          x: coords.bl.x - sinHalfOffset,
			 	          y: coords.bl.y - cosHalfOffset
			         },
			         bl: {
			 	          x: coords.bl.x - cosHalfOffset,
			 	          y: coords.bl.y + sinHalfOffset
			         },
			         br: {
			 	          x: coords.bl.x + sinHalfOffset,
			 	          y: coords.bl.y + cosHalfOffset
			         },
			         tr: {
			 	          x: coords.bl.x + cosHalfOffset,
			 	          y: coords.bl.y - sinHalfOffset
			         }
			       };

			       coords.br.corner = {
			         tr: {
			 	          x: coords.br.x + cosHalfOffset,
			 	          y: coords.br.y - sinHalfOffset
			         },
			         bl: {
			 	          x: coords.br.x - cosHalfOffset,
			 	          y: coords.br.y + sinHalfOffset
			         },
			         br: {
			 	          x: coords.br.x + sinHalfOffset,
			 	          y: coords.br.y + cosHalfOffset
			         },
			         tl: {
			 	          x: coords.br.x - sinHalfOffset,
			 	          y: coords.br.y - cosHalfOffset
			         }
			       };

			       coords.ml.corner = {
			         tl: {
			 	          x: coords.ml.x - sinHalfOffset,
			 	          y: coords.ml.y - cosHalfOffset
			         },
			         tr: {
			 	          x: coords.ml.x + cosHalfOffset,
			 	          y: coords.ml.y - sinHalfOffset
			         },
			         bl: {
			 	          x: coords.ml.x - cosHalfOffset,
			 	          y: coords.ml.y + sinHalfOffset
			         },
			         br: {
			 	          x: coords.ml.x + sinHalfOffset,
			 	          y: coords.ml.y + cosHalfOffset
			         }
			       };

			       coords.mt.corner = {
			 	        tl: {
			 		          x: coords.mt.x - sinHalfOffset,
			 		          y: coords.mt.y - cosHalfOffset
			 	        },
			 	        tr: {
			 		          x: coords.mt.x + cosHalfOffset,
			 		          y: coords.mt.y - sinHalfOffset
			 	        },
			 	        bl: {
			 		          x: coords.mt.x - cosHalfOffset,
			 		          y: coords.mt.y + sinHalfOffset
			 	        },
			 	        br: {
			 		          x: coords.mt.x + sinHalfOffset,
			 		          y: coords.mt.y + cosHalfOffset
			 	        }
			       };

			       coords.mr.corner = {
			 	        tl: {
			 		          x: coords.mr.x - sinHalfOffset,
			 		          y: coords.mr.y - cosHalfOffset
			 	        },
			 	        tr: {
			 		          x: coords.mr.x + cosHalfOffset,
			 		          y: coords.mr.y - sinHalfOffset
			 	        },
			 	        bl: {
			 		          x: coords.mr.x - cosHalfOffset,
			 		          y: coords.mr.y + sinHalfOffset
			 	        },
			 	        br: {
			 		          x: coords.mr.x + sinHalfOffset,
			 		          y: coords.mr.y + cosHalfOffset
			 	        }
			       };

			       coords.mb.corner = {
			 	        tl: {
			 		          x: coords.mb.x - sinHalfOffset,
			 		          y: coords.mb.y - cosHalfOffset
			 	        },
			 	        tr: {
			 		          x: coords.mb.x + cosHalfOffset,
			 		          y: coords.mb.y - sinHalfOffset
			 	        },
			 	        bl: {
			 		          x: coords.mb.x - cosHalfOffset,
			 		          y: coords.mb.y + sinHalfOffset
			 	        },
			 	        br: {
			 		          x: coords.mb.x + sinHalfOffset,
			 		          y: coords.mb.y + cosHalfOffset
			 	        }
			       };

			       coords.mtr.corner = {
			 	        tl: {
			 	        	//todo earlier there was obj instead of obj
			 	        	// x: coords.mtr.x - sinHalfOffset + (sinTh * obj.rotatingPointOffset),
			 	         
			 	        	
			 		          x: coords.mtr.x - sinHalfOffset + (sinTh * this.rotatingPointOffset),
			 		          y: coords.mtr.y - cosHalfOffset - (cosTh * this.rotatingPointOffset)
			 	        },
			 	        tr: {
			 		          x: coords.mtr.x + cosHalfOffset + (sinTh * this.rotatingPointOffset),
			 		          y: coords.mtr.y - sinHalfOffset - (cosTh * this.rotatingPointOffset)
			 	        },
			 	        bl: {
			 		          x: coords.mtr.x - cosHalfOffset + (sinTh * this.rotatingPointOffset),
			 		          y: coords.mtr.y + sinHalfOffset - (cosTh * this.rotatingPointOffset)
			 	        },
			 	        br: {
			 		          x: coords.mtr.x + sinHalfOffset + (sinTh * this.rotatingPointOffset),
			 		          y: coords.mtr.y + cosHalfOffset - (cosTh * this.rotatingPointOffset)
			 	        }
			 	     };
			       
			       
			     }
			     
			   	 
			    /**
			         * Returns object's angle value
			         * @method getAngle
			         * @obj the partiuclar object
			         * @return {Number} angle value
			    */
			     
			    obj.getAngle = function() {
			        return this.theta * 180 / Math.PI;
			    }
			    
			    /**
			     * This function does set the passed object in front of the all other objects
			     * @param the object should be into front 
			     * return true in success case
			     * return false  in failure case
			     */
			    obj.setZindex = function(){
			 	   for(var i=0; i<vcan.main.children.length; i++){
			 			 if(this.id == vcan.main.children[i].id){
			 				 var delObj = vcan.main.children[i];
			 				 vcan.main.children.splice(i, 1);
			 				 break;
			 			 }
			 		 }
			 		 
			 		 if(delObj != ' '){
			 			 vcan.main.children.push(delObj);
			 			 return true;
			 		 }
			 		 
			 	   return false;
			    },
			    
			    
			    /**
			     * This function sets up the current object for do various transform
			     * eg:- drag, rotate and scale 
			     * this function does expects event as parameter
			     */
			    obj.setupCurrentTransform = function (e) {
					   	 var obj = vcan.main;
					      var action = 'drag',
					          corner,
					          pointer = vcan.utility.actualPointer(e);
					
					      if (corner = this.findTargetCorner(e)){
					        action = (corner === 'ml' || corner === 'mr')
					          ? 'scaleX'
					          : (corner === 'mt' || corner === 'mb')
					            ? 'scaleY'
					            : corner === 'mtr'
					              ? 'rotate'
					              : (this.hasRotatingPoint)
					                ? 'scale'
					                : 'rotate';
					      }
					      console.log('JAI' +  corner);
					      obj.currentTransform = {
					        target: this,
					        action: action,
					        scaleX: this.scaleX,
					        scaleY: this.scaleY,
					        offsetX: pointer.x - this.x,
					        offsetY: pointer.y - this.y,
					        ex: pointer.x,
					        ey: pointer.y,
					        x: this.x,
					        y: this.y,
					        theta: this.theta,
					        width: this.width * this.scaleX
					      };
					
					      obj.currentTransform.original = {
					        x: this.x,
					        y: this.y
					      };
				    }
				    
				    /**
					 * Rotates object by invoking its rotate method
					 * @method rotateObject
					 * @param x {Number} pointer's x coordinate
					 * @param y {Number} pointer's y coordinate
					 */
			    
				if(obj.type != 'text'){
					obj.setCoords();
				}	
				
				var cor_cal = makeDispObject(obj);
				return cor_cal; 
			}
		}
		
		
		/**
		 * initializes the functions for displayed(rendered) object, 
		 * here the displayed object means the object has been displayed into browsers 
		 * eg:- dragDrop(), setCoords()
		 * @param object on which the operation would performed
		 */
		var makeDispObject = function (obj){
			 return {
					 coreObj:obj,
					 
					 //TODO this function should be removed
					 bind : function (evtype, handler){
						this.addEventListener('on'+evtype, handler);
					 }
			 	};
		}
		
		
		/**
		 * Removes the passed object from canvas
		 *  @param obj remvoe this object
		 *  TODO it can return the index of object which is deleted 
		 */
		var remove = function(obj){
			var vcanvas = vcan.main.canvas;
			/**
			  * multiuser is a flag used for removed the previous drawn data over the canvas 
			  * this chunk of data would display for multi user only not for self user
			 */
			//var rindex = vcan.ArrayIndexOf(vcan.main.children, function (pobj){return pobj.id == obj.id && (pobj.mdTime == obj.mdTime || obj.multiuser == true )});
			var rindex = vcan.ArrayIndexOf(vcan.main.children, function (pobj){return pobj.id == obj.id && (pobj.mt == obj.mt || obj.multiuser == true )});
			//var rindex = vcan.ArrayIndexOf(vcan.main.children, function (pobj){return pobj.id == obj.id});
			
			// if the object is  not found which have to be deleted 
			// then it does not do anything
			
			if(rindex >= 0){
				vcan.main.children.splice(rindex, 1);
			}
			
			var height = vcanvas.height;
			var width = vcanvas.width;
			
			//alert(vcan.main.canvas.ctx);
			var ctx = vcanvas.getContext('2d');
			
//			if(typeof vcan.myctx == 'object'){
//				var ctx2 =  vcan.myctx;
//				ctx2.restore();
//			}	
			
			ctx.beginPath();
			ctx.clearRect(0, 0, width, height);
			ctx.closePath();
			
			vcan.renderAll();
		}
		
		
		
		/**
		 *  draws object, transform object, draws border on object
		 * @param ctx context of canvas 
		 * @param obj all operation operated over this object
		 * @param noTransform is undefined value
		 */
		var render = function (ctx, obj, noTransform){
			ctx.beginPath(); //this added just now 25/9/13
			ctx.save();
			if(ctx.lineWidth !==  undefined){
				ctx.lineWidth = obj.lineWidth;
			}else{
				ctx.lineWidth = 2;
			}
			
			if(!noTransform){
				vcan.transform(ctx, obj);
			}
			
		
			if(obj.borderColor != undefined){
				ctx.strokeStyle = obj.borderColor;
			}else{
				ctx.strokeStyle = '#000000';
			}
			
			drawObject(ctx, obj, noTransform);
			
			if (obj.active && !noTransform) {
				obj.drawBorders(ctx);
		        obj.hideCorners || obj.drawCorners(ctx);
		     }
			ctx.closePath();
			ctx.restore();
			
		}
		
		
		/**
	     * this function draws the object
	     * itdentify the shich draw function should be called for particualr object
	     * @param ctx current context of canvas on which the object would drawn  
	     * @param obj the object would be drawn
	     * 
	     */
	    
		  var drawObject = function (ctx, obj, noTransform){
			if(obj.type  == 'rectangle'){
				vcan.objRect.draw(ctx, obj, noTransform);
			}else if (obj.type  == 'line'){
				vcan.objLine.draw(ctx, obj, noTransform);
			}else if(obj.type == 'oval'){
				vcan.objOval.draw(ctx, obj, noTransform);
			}else if(obj.type == 'triangle'){
				vcan.objTri.draw(ctx, obj, noTransform);
			}else if(obj.type == 'text'){
				vcan.objTxt.draw(ctx, obj, noTransform);
			} 
		}
		
		
		/**
		 * @Class defined rectangle for rectangle
		 *  methods initilized for creating rectangle object
		 *  in future there can be more properties than one
		 */
		 vcan.rectangle = function (){
			return  {
				type : 'rectangle',
				
				/**
				 * TOD0 we need to extend this function in future
				 * initiates the properties of object
				 * @param obj the properties would initates on it
				 */
				init : function (obj){
					 
					if(obj.x == undefined){
						var absx = obj.ex - (obj.width / 2);
						obj.x = absx;
					}
					
					if(obj.y == undefined){
						var absy = obj.ey - (obj.height / 2);
						obj.y = absy;
						
					}
					
					return obj;
				},
				
				 /**
				 * it draws the object according to information passed by object
				 * the funciton does not use the rect() funciton to create 
				 * rectangle object but uses the moveTo/lineTo object
				 * @param ctx current context
				 * @param obj would be drawn
				 */
				draw : function (ctx, obj, noTransform){
				
					//TODO
					// this funciton should be done through the proper process
				     var   x = -obj.width / 2,
			          y = -obj.height / 2,
			          w = obj.width,
			          h = obj.height;
						  

				      ctx.beginPath();
				      
				      ctx.strokeStyle = (obj.borderColor !=  undefined) ? '"' + obj.strokeColor + '"' : "#000";
				      
				      //alert(ctx.strokeStyle);
				      
				      ctx.moveTo(x, y);
				      ctx.stroke();
				    
				      ctx.lineTo(x+w, y);
				      ctx.stroke();
				    
				      ctx.lineTo(x+w, y+h);
				      ctx.stroke();
				    
				      ctx.lineTo(x,y+h);
				      ctx.stroke();
				     
				      ctx.lineTo(x,y);
				      ctx.fillStyle = (obj.fillColor !=  undefined) ? obj.fillColor : " " ;
				      
				      ctx.closePath();
				      ctx.stroke();
				      // todo this should be enable
				      if( obj.fillColor != undefined){
				    	  ctx.fillStyle = obj.fillColor;
				    	  ctx.fill();
				      }
				    
				}
			};
		}
		
		
		/**
		 * @Class defined class for line
		 *  methods initilized for creating line object
		 *  in future there can be more properties than now
		 */
		vcan.line = function (){
			return  {
				type : 'line',
				
				/**
				 * initiates the properties to object
				 * @param obj the properties would initates on it
				 */
				
				init : function (obj){
					var sx = obj.start.x;
					var sy = obj.start.y;
					var ex = obj.end.x;
					var ey = obj.end.y;
					
					if(obj.width == undefined){
						obj.width = (ex-sx);
						obj.height = (ey-sy);
					}
					
					obj.x = (sx+(ex-sx)/2);
					obj.y = (sy+(ey-sy)/2);
					return obj;
					
				},
				
				
				/**
				 * it draws the object line according to properties which can get thorugh
				 * the passed object 
				 * @param ctx current context
				 * @param obj would be drawn into the canvas
				 */
				draw : function (ctx, obj, noTransform){
					ctx.beginPath();
				    // move from center (of virtual box) to its left/top corner
					var sx = obj.width === 1 ? 0 : (-obj.width / 2);
					var sy = obj.height === 1 ? 0 : (-obj.height / 2);
					var ex = obj.width === 1 ? 0 : (obj.width / 2);
					var ey = obj.height === 1 ? 0 : (obj.height / 2);
					
					ctx.moveTo(sx, sy);
				    ctx.lineTo(ex, ey);
				    ctx.lineWidth = obj.lineWidth;
				    if(obj.lineColor != undefined){
						ctx.strokeStyle = obj.lineColor;
					}
					ctx.closePath();
					ctx.stroke();
				}
			};
		}
		
		
		/**
		 * @Class defined oval for drawing the object oval
		 *  methods initilized for creating oval object
		 *  the arc() function used to create the oval object
		 */
		vcan.oval = function (){
			return  {
				type : 'oval',
				
				/**
				 * initiates the properties to oval object
				 * @param obj the properties would initates on it
				 */
				init : function (obj){
					if(obj.width == undefined){
						obj.width = obj.rx * 2;
					}
					
					if(obj.height == undefined){
						obj.height = obj.ry * 2;
					}
					
					if(obj.borderColor == undefined){
						obj.borderColor = "#000000";
					}
					
					if(obj.fillColor != undefined){
						obj.fillStyle = obj.fillColor;
					}
					
					return obj;
				},
				
				
				/**
				 * it draws the oval object 
				 * @param ctx current context of canvas
				 * @param obj contains the information eg: x, y, rx, ry
				 */
				draw : function (ctx, obj, noTransform){
					//debugger;
					ctx.beginPath();
					ctx.save();
				    // move from center (of virtual box) to its left/top corner
					var startingPoint = 0;
					var endingPoint = 2 * Math.PI;
					var counterClockWise = false;
					
					ctx.lineWidth = obj.lineWidth;
					ctx.transform(1, 0, 0, obj.ry/obj.rx, 0, 0);
					ctx.arc(noTransform ? obj.x : 0, noTransform ? obj.y : 0, obj.rx, 0, endingPoint, counterClockWise);
					ctx.closePath();
					
					if(obj.fillStyle != undefined){
						ctx.fillStyle = obj.fillStyle;
						ctx.fill();
					}
					
					if(obj.borderColor != undefined){
						ctx.fillStyle = obj.borderColor;
						ctx.stroke();
					}
				
					ctx.restore();
				}
			};
		}
		
		
		
		/**
		 * @Class defined triangle for drawing triangle
		 *  methods initilized for creating triangle object
		 *  in future there can be more properties than now
		 */
		vcan.triangle = function (){
			return  {
				type : 'triangle',
				
				/**
				 * initiates the properties to object
				 * calcualte the width and height absolute x and absolute y for triangle object
				 * @param obj the properties would initates on it
				 */
				init : function (obj){
					obj.fillStyle = obj.fillColor;
					if(obj.dRoad == undefined){
						obj.dRoad = 'ltr';
					}
					
					if(obj.width == undefined){
						obj.width =   obj.ex-obj.sx;
					}
					
					if(obj.height == undefined){
						obj.height =  obj.ey-obj.sy;
					}
					
					if(obj.x == undefined){
						var absx = obj.ex - (obj.width / 2);
						obj.x = absx;
					}
					
					if(obj.y == undefined){
						var absy = obj.ey - (obj.height / 2);
						obj.y = absy;
					}
					
					return obj;
				},
				
				
				/**
				 * it draws the triangle object according to the properties of passed object  
				 * @param ctx current context
				 * @param obj would be drawn
				 */
				draw : function (ctx, obj, noTransform){
					ctx.beginPath();
					
					//if(obj.dRoad == 'ltr'){ //TODO this condtion should be re thinkable
					
					/*
					if(obj.sx < obj.sy){
						  var widthBy2 = -obj.width / 2,
					      heightBy2 = -obj.height / 2;
					 }else{
						//if user draw the object from right to left side
						 var widthBy2 = obj.width / 2,
					      heightBy2 = obj.height / 2;
					 }*/
					
					 if(obj.dRoad == 't2b'){  //TODO this condtion should be re thinkable
						var widthBy2 = obj.width / 2,
				          heightBy2 = obj.height / 2;
					 }else{
						//if user draw the object from right to left side
						var widthBy2 = -obj.width / 2,
				          heightBy2 = -obj.height / 2;
					 }
					
					  ctx.lineWidth = obj.lineWidth;
				      if(obj.borderColor != undefined){
				    	 ctx.strokeStyle =  obj.borderColor;
				      }
				      
				      ctx.moveTo(-widthBy2, heightBy2);
				      
				      //left vertical line in case of ltr
				      ctx.lineTo(0, -heightBy2);

  				      //right vertical line in case of rtl
				      ctx.lineTo(widthBy2, heightBy2);
				   
				      ctx.closePath();
				      
					if(obj.fillStyle != undefined){
						ctx.fillStyle = obj.fillStyle;
						ctx.fill();
					}
					
					ctx.stroke();
				}
			};
		}
		
		
		
		/**
		 * freeHandDrawing is defined for free hand drawing
		 * this class has methods through which the the /freend hand draw object is being drawn 
		 * this method of this class is called when the user click on canvas 
		 * this class is assigning as property vcan.main because, The object of this
		 * class can not create by addObject class, 
		 */
	    		
		   vcan.main.freeHandDrawing = function (obj){
				return {
					type : 'freeDrawing',
					
					/**
					 * initialize the various variable for free drawing 
					 *  return the current context
					 */
					init : function (){
						this.contextTop = {};
						this.isCurrentlyDrawing = false;
						this.freeDrawingXPoints = [];
						this.freeDrawingYPoints = [];
						this.mdTime = [];
						
						if(obj.borderColor ==  undefined){
							this.freeDrawingColor = "#000";
						}else{
							this.freeDrawingColor = obj.borderColor;
						}
						
						if(obj.lineWidth != undefined){
							this.freeDrawingLineWidth = obj.lineWidth;
						}else{
							this.freeDrawingLineWidth = "3";
						}
						
						//IMPORTANT:- this have done during the unit testing
						//this.freeDrawingLineWidth = "3"; //TODO this should be dyanamic
						return this; //IMPORTANT added after unit testing
					}, 
					
					
					/***
					 * This function does set up the situation for drawing the the free hand drawing object
					 * eg:- context begins, call the moveTo()
					 * this function is called when user click on canvas for draw the free hand draw
					 * @param ctx current context of canvas
					 * @returns
					 */
					fhdStart : function(ctx, pointer, crtMuser){
						
						var  currTime = new Date().getTime();
						var canvas = vcan.main.canvas;
						
						this.contextTop = ctx;
						this.isCurrentlyDrawing = true;
						
						this.freeDrawingXPoints.push(pointer.x);
						this.freeDrawingYPoints.push(pointer.y);
						this.contextTop.beginPath();
						this.contextTop.save();
						
						this.contextTop.moveTo(pointer.x, pointer.y);
						
						this.mdTime.push(currTime);
						this.contextTop.strokeStyle = this.freeDrawingColor;
						this.contextTop.lineWidth = this.freeDrawingLineWidth;
						this.contextTop.lineCap = this.contextTop.lineJoin = 'round';
						
						
					},
					
					
					/**
					 * through this funciton the application is creting the object(free hand draw) in indeed
					 * and storing the creating time in property named mdTime of current freew draw object 
					 * @param evt expects mouse move event as parameter
					 * @returns nothing
					 */
					
					//captureDrawingPath: function(evt) {
					//fhRendering: function(evt) {
					  fhRendering: function(pointer, crtMuser) {
						  var  currTime = new Date().getTime();
						  this.freeDrawingXPoints.push(pointer.x);
						  this.freeDrawingYPoints.push(pointer.y);
						  
						  this.contextTop.lineTo(pointer.x, pointer.y);
						  this.contextTop.stroke();
						  this.mdTime.push(currTime);
					 },
					 
					 
					 /** 
					  * By this function the system finalizes all the co-ordinate as user drawn the 
					  * free hand drawing object, It created the array by callIng Path class through
					  * which contains all the co-ordination of created free hand object
					  * Thorugh this function the drawn free hand object would be selectable
					  * this function is called when user done mouse up after draw the free hand 
					  * @returns nothing
					  * 
					  */
					 finalizeDrawingPath : function (mcanvas, crtMuser, pointer){
						     var currTime = new Date().getTime();
						 	  this.contextTop.closePath();
						      this.isCurrentlyDrawing = false;
						      
						      var minX = this.utility.min(this.freeDrawingXPoints),
						          minY = this.utility.min(this.freeDrawingYPoints),
						          maxX = this.utility.max(this.freeDrawingXPoints),
						          maxY = this.utility.max(this.freeDrawingYPoints),
						          ctx = this.contextTop,
						          path = [ ],
						          xPoint,
						          yPoint,
						          mdTime,
						          xPoints = this.freeDrawingXPoints,
						          yPoints = this.freeDrawingYPoints,
						      	  mdTimes = this.mdTime;
						      	  
						      	 	
						      path.push('M ', xPoints[0] - minX, ' ', yPoints[0] - minY, ' ', mdTimes[0], ' ');
						      for (var i = 1; xPoint = xPoints[i], yPoint = yPoints[i], mdTime = mdTimes[i]; i++) { //NOTE:- this have done during the unit testing
						    	  path.push('L ', xPoint - minX, ' ', yPoint - minY, ' ', mdTime, ' ');
						      }

						      // TODO (kangax): maybe remove Path creation from here, to decouple fabric.Canvas from fabric.Path,
						      // and instead fire something like "drawing:completed" event with path string

						      path = path.join('');

						      if (path === "M 0 0 L 0 0 ") {
						        // do not create 0 width/height paths, as they are rendered inconsistently across browsers
						        // Firefox 4, for example, renders a dot, whereas Chrome 10 renders nothing
						        return;
						      }
						      
						      
						      var xp =   this.freeDrawingXPoints[this.freeDrawingXPoints.length - 1];
						      var yp =   this.freeDrawingYPoints[this.freeDrawingYPoints.length - 1];
						      //   console.log('xp ' + xp);
						      // console.log('yp ' + yp);

						      var p = new vcan.Path(path, this);
						      	  p.mp = {};
						      	  p.mp.x = xp;
						      	  p.mp.y = yp;
						         
						          p.init(path);	
						          //below line is commented out during unit testing
						          //p = vcan.main.mcanvas.readyObject(p);	 //this should be done thorugh the script.js
						          p = mcanvas.readyObject(p);
						          p.coreObj.type = 'freeDrawing'; // this is need to make because we are finializing the path into freedrawing
						          p = p.coreObj;
						          
						          
						      	  p.fill = null;
						      
						      	  p.stroke = this.freeDrawingColor;
						      	  p.strokeWidth = this.freeDrawingLineWidth;
						      	  p.minX = minX;
						      	  p.minY = minY;
						      	  
						      	
						      
						      //TODO can be used in future
						      /*p.stroke = obj.freeDrawingColor;
						      p.strokeWidth = obj.freeDrawingLineWidth;
						      */
						      
						      
						      this.utility.objAdd(p);

						      var resP  =  vcan.utility.setVal(p, "x", minX + (maxX - minX) / 2);
						      resP =   vcan.utility.setVal(resP, "y", minY + (maxY - minY) / 2);
					          resP.setCoords();
					          
					          
					          if(typeof obj =='object'){
					        	  this.contextTop.restore();
					          }
					          
					          
					          //vcan.myctx = 
					          vcan.renderAll(this.contextTop);
					          
					          return resP;
					          
					          // this.fire('path:created', { path: p });
					 },
					 
					 utility : {
						 
						/**
						* Finds maximum value in array (not necessarily "first" one)
						* @method max
						* @param {Array} array Array to iterate over
						* @param {String} byProperty
						* critical I have removed the cloned function named max
						*/
						 max : function (array, byProperty){
							 if (!array || array.length === 0) return undefined;
							 var i = array.length - 1, 
							  	result = byProperty ? array[i][byProperty] : array[i];
							 if (byProperty) {
								   while (i--) {
								     if (array[i][byProperty] >= result) {
								       result = array[i][byProperty];
								     }
								   }
							 }
							 else {
								   while (i--) {
								     if (array[i] >= result) {
								       result = array[i];
								     }
								   }
							 }
							 return result;
						 },
						 
						 /**
						    * Finds minimum value in array (not necessarily "first" one)
						    * @method min
						    * @param {Array} array Array to iterate over
						    * @param {String} byProperty
						    */
						 min : function (array, byProperty){
						     if (!array || array.length === 0) return undefined;
							 var i = array.length - 1, 
							     result = byProperty ? array[i][byProperty] : array[i];
							 if(byProperty) {
							   while (i--) {
							     if (array[i][byProperty] < result) {
							       result = array[i][byProperty];
							     }
							   }
							 } else {
							   while (i--) {
							     if (array[i] < result) {
							       result = array[i];
							     }
							   }
							 }
							 return result;
						    
						 },
						 
					   objAdd : function (obj){
						   vcan.main.children.push(obj);
						   //can be critical
						   //vcan.renderAll(this.contextTop);
						   return this;
					   }
						 
					}
			   }
		 }
		
		 
		
		/**
		 * This class is used for create the path for each co-ordinate which is drawn by user
		 * The paticular path array has some element which have some proeprties 
		 * eg:- x, y cordinate, made time, and either it is moveTo Point or LineTo point
		 * This class has method for render the particular path either the path would came
		 * from user' drawn or replay object
		 * */
		 vcan.Path = function (path, fdObj) {
			return {
				
				/**
			     * @property
			     * @type String
			     */
				
				objectType : 'path',
				
			    /**
			     * Constructor
			     * @method initialize the function through which the co-ordinate would be parased 
			     * @param path would be array of string on which we can get the different informaiton
			     * eg:- x, y cordinate, timing
			     * @param {Object} [options] Options object
			     */
			    init : function(path, options) {
				      options = options || { };
				      
				      /*
				       * TODO this could be disable for now
				       * in future it may required
				       */
				      //this.setOptions(options);
				      
				      //this is the command is using fore create path
				      //for free hand object for now 
				      // only m and l is using
				      this.commandLengths = {
							    m: 2,
							    l: 2,
							    h: 1,
							    v: 1,
							    c: 6,
							    s: 4,
							    q: 4,
							    t: 2,
							    a: 7
						  }; 
				       
				      if (!path) {
				         throw Error('`path` argument is required');
				      }
				      
				      //Impportant
				      // the block of code is comment out during
				      // the unit testing
				      
				      //var fromArray = toString.call(path) === '[object Array]';
				
				      //    this.path = fromArray
				      //        ? path
				      //        : path.match && path.match(/[a-zA-Z][^a-zA-Z]*/g);
				      
				      this.path = path.match && path.match(/[a-zA-Z][^a-zA-Z]*/g);
				      if (!this.path) return;
				      this.initializeFromArray(options);
				      return this;
			    },
			    
			    
			
			    /**
			     * @method _initializeFromArray this function does call the 
			     * function thorugh which all the co-ordination would be parsed
			     * and store them into array and returned it
			     */
			    
			    initializeFromArray: function(options) {
			    	  var isWidthSet = 'width' in options,
				          isHeightSet = 'height' in options;
				
				      this.path = this._parsePath();
				
				      if (!isWidthSet || !isHeightSet) {
				    	  	this.utility.extend(this, this._parseDimensions());
				        if (isWidthSet) {
				        	this.width = options.width;
				        }
				        if (isHeightSet) {
				        	this.height = options.height;
				        }
				      }
			    },
			
			    
			    /**
			     * this method creats the path(free hand draw) as according to user have drawn free hand into the canvas.
			     * @param ctx this is the current conext of canvas.
			     * @returns nothing
			     * right now not using this function
			     */
			    _render: function(ctx) {
			      var current, // current instruction
			          x = 0, // current x
			          y = 0, // current y
			          controlX = 0, // current control point x
			          controlY = 0, // current control point y
			          tempX,
			          tempY,
			          l = -(this.width / 2),
			          t = -(this.height / 2);
			      			
			      for (var i = 0, len = this.path.length; i < len; ++i) {
						current = this.path[i];
						
						switch (current[0]) { // first letter
						  case 'L': // lineto, absolute
						    x = current[1];
						    y = current[2];
						    ctx.lineTo(x + l, y + t);
						    break;
						 
						
						  case 'M': // moveTo, absolute
						    x = current[1];
						    y = current[2];
						    ctx.moveTo(x + l, y + t);
						    break;
						
						    ctx.closePath();
						    break;
						}
			        
			        }
			    },
			    
			    
			    /**
			     * this funciton draws a point of free hand object
			     * @param ctx is the current context path for canvas
			     * @param current its an object on wchich different information would be stored eg: x,y cordinate
			     * @param l is the horizontal position which will be combined with the x  co-ordinate for line to
			     * @param t is the vertical position which will be combined with the y  co-ordinate for line to
			     * right now not using
			     * @returns nothing
			     */
			    replay_render : function (ctx, current, l, t){
			    	var x = y  = 0;
			    	switch (current[0]) { // first letter
						case 'L': // lineto, relative
						      x += current[1];
						      y += current[2];
						   
						      ctx.lineTo(x + l, y + t);
						      ctx.stroke();
						      break;
						 
						case 'M': // moveTo, relative
						    x += current[1];
						    y += current[2];
						    ctx.moveTo(x + l, y + t);
						    break;
					 }
			    	
			    },
			
			    /**
			     * Renders the free drawing object on a specified context
			     * @method renders this method is called on mouse up after created the  free hand object
			     * @param the currenct context of canvas
			     * @param {Boolean} noTransform When true, context is not transformed
			     * right now not using
			     */
			    render: function(ctx, noTransform) {
			    	
			     	  ctx.save();
					  var m = this.transformMatrix;
					  if (m) {
					    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
					  }
					  if (!noTransform) {
						  vcan.transform(ctx, this);
					  }
					  // ctx.globalCompositeOperation = this.fillRule;
					
					  if (this.overlayFill) {
					    ctx.fillStyle = this.overlayFill;
					  }
					  else if (this.fill) {
					    ctx.fillStyle = this.fill;
					  }
					
					  if (this.stroke) {
					    ctx.strokeStyle = this.stroke;
					  }
					  ctx.beginPath();
					
					  this._render(ctx);
					
					  if (this.fill) {
					    ctx.fill();
					  }
					  if (this.stroke) {
					    ctx.strokeStyle = this.stroke;
					    ctx.lineWidth = this.strokeWidth;
					    ctx.lineCap = ctx.lineJoin = 'round';
					    ctx.stroke();
					  }
					  if (!noTransform && this.active) {
						  //alert('hello guys');
					    this.drawBorders(ctx);
					    this.hideCorners || this.drawCorners(ctx);
					  }
					  ctx.restore();
			    },
			
			    /**
			     * Returns string representation of an instance
			     * @method toString
			     * @return {String} string representation of an instance
			     * IMPORTANT this is comment out during the unit testing
			     */
			    //toString: function() {
			    	//return '#<vcan.Path (' + this.complexity() +
			        //'): { "y": ' + this.y + ', "x": ' + this.x + ' }>';
			    //},
			
			
			    /**
			     * Returns number representation of an instance complexity
			     * @method complexity
			     * @return {Number} complexity
			     *  IMPORTANT this is comment out during the unit testing
			     */
			    //complexity: function() {
			      // return this.path.length;
			    //},
			
			    
			    /**
			     * This function does parse all the co-ordination(Path) and store them into array 
			     * 0: "M 0 38 1363777101579 ", this would be converted in element of array eg:- 
				 *    [0] => M,  [1] => 0,  [2] => 38,  [3] => 1363777101579,
			     * @method _parsePath
			     * returns the array  which contains the above informaiton   [0] => M,  [1] => 0,  [2] => 38,  [3] => 1363777101579
			     * 
			     */
			    _parsePath: function() {
			      var result = [ ],
			          currentPath,
			          chunks,
			          parsed;
			
						for (var i = 0, j, chunksParsed, len = this.path.length; i < len; i++) {
							var pattern = /\d+\s$/; //TODO the pattern could be more specific
							var mdTime = pattern.exec(this.path[i]);
							if(mdTime != null){
								var pos = this.path[i].indexOf(mdTime);
						    	this.path[i] = this.path[i].substring(0,  pos);
							}
							currentPath = this.path[i];
								
							chunks = currentPath.slice(1).trim().replace(/(\d)-/g, '$1###-').split(/\s|,|###/);
							chunksParsed = [ currentPath.charAt(0) ];
							
							for (var j = 0, jlen = chunks.length; j < jlen; j++) {
							  parsed = parseFloat(chunks[j]);
							  if (!isNaN(parsed)) {
							    chunksParsed.push(parsed);
							  }
							}
							
							var command = chunksParsed[0].toLowerCase(),
							    commandLength = this.commandLengths[command];
							
							if (chunksParsed.length - 1 > commandLength) {
								
							  for (var k = 1, klen = chunksParsed.length; k < klen; k += commandLength) {
								  if(mdTime == null){
									  result.push([ chunksParsed[0] ].concat(chunksParsed.slice(k, k + commandLength)));
								  }else{
									  result.push([ chunksParsed[0] ].concat(chunksParsed.slice(k, k + commandLength)));
									  chunksParsed.push(mdTime);
									  result.push(chunksParsed);
								  }
							   }
							}else{
								if(mdTime != null){
									//result.push(chunksParsed);
									chunksParsed.push(mdTime[0]);
									result.push(chunksParsed);
								}else{
									result.push(chunksParsed);
								}
							}
						}
				  
			      return result;
			   },
			
			    
			    /**
			     * @method _parseDimensions
			     * It parses the co-ordination and calculate the height and width for box for drawn object free hand
			     * This information would be used for select the object for drag and drop operation or other opertation
			     * return the object which contains the value of width, height, top, bottom of drawn free hand object
			     */
			    _parseDimensions: function() {
			      var aX = [],
			          aY = [],
			          previousX,
			          previousY,
			          isLowerCase = false,
			          x,
			          y;
			
			      this.path.forEach(function(item, i) {
			    	  	if(item[3] != " "){
			    	  		//splice(3) is represented making time	
			    	  		var mdTime = item.splice(3);
			    	  	}
			    		 
			    		if (item[0] !== 'H') {
					          previousX = (i === 0) ? this.utility.getX(item) : this.utility.getX(this.path[i-1]);
					        }
					        if (item[0] !== 'V') {
					          previousY = (i === 0) ? this.utility.getY(item) : this.utility.getY(this.path[i-1]);
					        }
					
					        // lowercased letter denotes relative position;
					        // transform to absolute
					        if (item[0] === item[0].toLowerCase()) {
					          isLowerCase = true;
					        }
					
					        // last 2 items in an array of coordinates are the actualy x/y (except H/V);
					        // collect them
					
					        // TODO (kangax): support relative h/v commands
					        x = isLowerCase
					          ? previousX + this.utility.getX(item)
					          : item[0] === 'V'
					            ? previousX
					            : this.utility.getX(item);
					
					        y = isLowerCase
					          ? previousY + this.utility.getY(item)
					          : item[0] === 'H'
					            ? previousY
					            : this.utility.getY(item);
					
					        var val = parseInt(x, 10);
					        if (!isNaN(val)) aX.push(val);
					
					        val = parseInt(y, 10);
					        if (!isNaN(val)) aY.push(val);
					        
					        //TODO this can be ticky
					        if(mdTime != undefined){
					        	if(mdTime.length >= 1){
						        	item.push(mdTime[0]);
						        }
					        }
					        
					        
			      }, this);
			
			      var minX = fdObj.utility.min(aX),
			          minY = fdObj.utility.min(aY),
			          deltaX = 0,
			          deltaY = 0;
			      
			      var o = {
					        y: minY - deltaY,
					        x: minX - deltaX,
					        bottom: fdObj.utility.max(aY) - deltaY,
					        right: fdObj.utility.max(aX) - deltaX
				      };
			      
				      o.width = o.right - o.x;
				      o.height = o.bottom - o.y;
				      return o;
			    },
			    
			    utility : {
			    	
			    	  /**
			    	    *  return the x co-ordinate of path
			    	    */
			    	   getX : function(item) {
			    			 if (item[0] === 'H') {
			    			   return item[1];
			    			 }
			    			 return item[item.length - 2];
			    	    },

			    	   /**
			    	    * return the y co-ordinate of path
			    	    */
			    	    getY : function (item) {
			    			 if (item[0] === 'V') {
			    				 return item[1];
			    			 }
			    			 return item[item.length - 1];
			    	   },
			    	   
			    	   /**
			    	    * Copies all enumerable properties of one object to another
			    	    * @method extend
			    	    * @param {Object} destination Where to copy to
			    	    * @param {Object} source Where to copy from
			    	    * TODO the extend of vcan can be use instead of blow function
			    	    */
			    	 	
			    	    extend : function (destination, source) {
			    	    	// JScript DontEnum bug is not taken care of
			    	 	   for (var property in source) {
			    	 		   destination[property] = source[property];
			    	 	   }
			    	 	   return destination;
			    	    }
			    	   
			    }
			};
		}
		
		
		/**
		 * @Class defined text for drawing text
		 *  methods initilized for creating line object
		 *  in future there can be more properties than now
		 */
		vcan.text = function (){
			return  {
				type : 'text',
				
				/**
				 * initiates the properties to object
				 * @param obj the properties would initates on it
				 */
				init : function (obj){
					/*
					obj.textLines = {}; //This is object we have created
					obj.textLines.length = 1;
					*/

					obj.lineHeight = 1.3 //earlier 1.3 it was
					
					if(obj.fontSize == undefined){
						obj.fontSize = 30;
					}
					//change during the unit testing
					obj.font = obj.fontSize + 'px Times New Roman';
					return obj;	
				},
				
				/**
				 * it draws the text object as passed parameter obj 
				 * @param ctx current context
				 * @param obj would be drawn
				 */
				draw : function (ctx, obj, noTransform){
					//ctx.fillStyle = "black";	
					ctx.font = obj.font;
					
					//TODO this should be done at init function of this class
					//obj.height = obj.fontSize * obj.textLines.length * obj.lineHeight;
					//obj.width = ctx.measureText(obj.text).width;
					
					var textLines = obj.text.split(/\r?\n/);
					//obj.height = obj.fontSize * obj.textLines.length * obj.lineHeight;
					
					obj.height = this.getTextHeight(ctx, textLines, obj);
					obj.width = this.getTextWidth(ctx, textLines);
					
					//obj.width = ctx.measureText(obj.text).width;
					//salert(obj.width);
					
					ctx.beginPath();
					for (var i = 0, len = textLines.length; i < len; i++) {
				      	var tempHeight = (-obj.height / 2) + (i * obj.fontSize * obj.lineHeight) + obj.fontSize;
				      	ctx.fillText(textLines[i], -obj.width/2, tempHeight)
				    }
					ctx.closePath();
					
					obj.setCoords();
				    
				},
				
				/***
				 * It gets the width of text which is passed by textLines
				 * @param ctx the context is current canvas context
				 * @param textLines this is the texts
				 * @returns returns width of text
				 */
				getTextWidth: function(ctx, textLines) {
				     var maxWidth = ctx.measureText(textLines[0]).width;

				      for (var i = 1, len = textLines.length; i < len; i++) {
					        var currentLineWidth = ctx.measureText(textLines[i]).width;
					        if (currentLineWidth > maxWidth) {
					        	maxWidth = currentLineWidth;
					        }
				      }
				      return maxWidth;
				 },
				 
				 
				 /***
					 * It gets the height of text which is passed by textLines
					 * @param ctx the context is current canvas context
					 * @param textLines this is the texts the heigth of which is calcualted
					 * @returns returns height
					 */
				 getTextHeight: function(ctx, textLines, obj) {
					  return obj.fontSize * textLines.length * obj.lineHeight;
				 }
			};
		}
		
		/**
		 *  @Class defined events
		 *  the class initialize various method
		 *  in future there can be more properties than now
		 *  TODO this function should be improvement
		 */
		var events = function (){
			return {
				bind : function (obj, type, handler){
					obj['on'+type] = handler;
				}, 
				
				/**
			     * Method that determines that which object we are clicking on
			     * @method findTarget
			     * @param {Event} e mouse event
			     * @pointer refers x and y co-ordinate relative to canvas
			     */
			    findTarget: function (e) {
				    var target;
				    // then check all of the objects on canvas
				     //TODO use this should be obj
				    
				      var objs = vcan.main.children;
				      for (var i=objs.length; i--; ) {
					        //if (objs[i] && vcan.virtual_box.containsPoint(e, objs[i], pointer)) {
				    	  if (objs[i] && vcan.virtual_box.containsPoint(e, objs[i])) {
					          target = objs[i];
					         // objs[i].relatedTarget = target;
					          break;
					        }
				      }
				      
				      if (target && target.selectable) {
				    	  return target;
				      }
			    }
			}
		}
		
		  /*
		   *  this function display the free draw object
		   *  it is the copy of render function
		   *  this function is created after store the objects into local storage
		   *  that we can not pass the function into JSON.strinfigy for multi user  
		   * */	
		  vcan.utility.fhdRender = function (ctx, obj, noTransform) {
		    	
	     	  ctx.save();
			  var m = obj.transformMatrix;
			  if (m) {
			    ctx.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
			  }
			  if (!noTransform) {
				  vcan.transform(ctx, obj);
			  }
			  // ctx.globalCompositeOperation = this.fillRule;
			
			  if (obj.overlayFill) {
			    ctx.fillStyle = obj.overlayFill;
			  }
			  else if (obj.fill) {
			    ctx.fillStyle = obj.fill;
			  }
			
			  if (obj.stroke) {
			    ctx.strokeStyle = obj.stroke;
			  }
			  ctx.beginPath();
			
			  //this._render(ctx);
			  fdMainRender(ctx, obj);
			  //alert('hey bro');
			  if (obj.fill) {
			    ctx.fill();
			  }
			  if (obj.stroke) {
			    ctx.strokeStyle = obj.stroke;
			    ctx.lineWidth = obj.strokeWidth;
			    ctx.lineCap = ctx.lineJoin = 'round';
			    ctx.stroke();
			  }
			  if (!noTransform && obj.active) {
				  //alert('hello guys');
				  obj.drawBorders(ctx);
				  obj.hideCorners || obj.drawCorners(ctx);
			  }
			  ctx.restore();
	    }
		 
		  /*
		   * this function display the co-ordinate for free draw
		   *  it is the copy of _render function
		   * */	
		 function  fdMainRender(ctx, obj) {
		      var current, // current instruction
		          x = 0, // current x
		          y = 0, // current y
		          controlX = 0, // current control point x
		          controlY = 0, // current control point y
		          tempX,
		          tempY,
		          l = -(obj.width / 2),
		          t = -(obj.height / 2);
		      			
		      for (var i = 0, len = obj.path.length; i < len; ++i) {
					current = obj.path[i];
					
					switch (current[0]) { // first letter
					  case 'L': // lineto, absolute
					    x = current[1];
					    y = current[2];
					    ctx.lineTo(x + l, y + t);
					    break;
					 
					
					  case 'M': // moveTo, absolute
					    x = current[1];
					    y = current[2];
					    ctx.moveTo(x + l, y + t);
					    break;
					
					    ctx.closePath();
					    break;
					}
					
					//alert('suman bogati');
		        
		        }
		    }
		 
		 	var doOptiMize_backup = function(e){
		 			var currTime= new Date().getTime();
		 	 		if(!e.detail.hasOwnProperty('cevent')){
						var obj = {'mdTime' :  currTime, 'action' : 'move', 'x' :  e.clientX, 'y' : e.clientY};
						vcan.main.replayObjs.push(obj);
						vm_chat.send({'repObj': [obj]});
					}
			 		
			 		localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
		 	  }
		 	
		 	var doOptiMize = function(e){
				 if (((typeof  lastmousemovetime == 'undefined') || (lastmousemovetime == null))) {
			        	lastmousemovetime = new Date().getTime();
			           if(!e.detail.hasOwnProperty('cevent')){
			        		//var obj = {'mdTime' :  lastmousemovetime, 'action' : 'move', 'x' :  e.clientX, 'y' : e.clientY};
			        	    var obj = vcan.makeStackObj(lastmousemovetime, 'm', e.clientX, e.clientY);
							vcan.main.replayObjs.push(obj);
							vm_chat.send({'repObj': [obj]});  //after optimized
							localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
							whBoard.utility.updateSentPackets(obj);
			        	}
			      	}
			        
					presentmousemovetime = new Date().getTime();
					if((presentmousemovetime-lastmousemovetime)>=2000) {	 // Optimized
						var currTime= new Date().getTime();
						if(!e.detail.hasOwnProperty('cevent')){
							
							//var obj = {'mdTime' :  currTime, 'action' : 'move', 'x' :  e.clientX, 'y' : e.clientY};
						var obj = vcan.makeStackObj(currTime, 'm', e.clientX, e.clientY);
							vcan.main.replayObjs.push(obj);
							vm_chat.send({'repObj': [obj]});
							localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
							whBoard.utility.updateSentPackets(obj);
						}

				  		lastmousemovetime = new Date().getTime();
					}
			  }
 		
		vcan.makeStackObj = function (time, action, x, y){
			var obj = {'mt' :  time, 'ac' : action, 'x' :  x, 'y' : y};
			return obj; 
		}
		//var starter_obj_id = ""; //TODO this should be contain at vcan.main
		/**
		 *  @Class defined mouse
		 *  the class initialize various method
		 *   
		 */
		vcan.mouse = function (){
			return {
				init : function (){
					this.bindHandlers();
					
				},
				
				/**
				 * Attach the various event handlers onto canvas
				 * eg: mousedown, mouseup
				 */
				bindHandlers : function (){
					canvasElement = vcan.main.canvas;
					
					
					//TODO the types should be store into main/core funtion
					// the place of this object should not be here
					  var  types = {
							  'mousedown' : 'mousedown',
							  'mousemove' : 'mousemove',
							  'mouseup' : 'mouseup'
						}
					  
					  
					  for(type in types){  
						  if(type == 'mousedown'){
							  canvasElement.addEventListener(type, this.mousedown, false);
						  }else if (type == 'mousemove'){
							  canvasElement.addEventListener(type, this.mousemove, false);
						  }else if(type == 'mouseup'){
							  canvasElement.addEventListener(type, this.mouseup, false);
						  }
						  
					  }
				}, 
				

				/**
				 * @Class mousedown 
				 * setupCurrentTransform,  setActiveObject, setZindex kind of methods are called from this funciton
				 * @param e is event object
				 */
				mousedown  : function (e, cobj){
					if(e.detail.hasOwnProperty('cevent')){
						e.clientX = e.detail.cevent.x;
						e.clientY = e.detail.cevent.y;
						e.x = e.detail.cevent.x;
						e.y = e.detail.cevent.y;
						e.pageX = e.detail.cevent.x;
						e.pageY = e.detail.cevent.y;
					}
					
					lastmousemovetime = null;
					this.moveChunk = []; //todo this should be remove
					
				
					// var foundTarget = events().findTarget(e, getPointer(e));
					//if user clicked on created object than clicked for crate a new object for moving object
					// we don't need to run these bunch of code when user is drawing particular object   
					if(vcan.main.action == 'move'){
						 var vcanmain = vcan.main;
						 if (vcanmain.currentTransform) return;
						 var foundTarget = events().findTarget(e),
						 
					     pointer = vcan.utility.getReltivePoint(e);
						 if(foundTarget){
							 if(vcan.main.children.length > 0){
								 foundTarget.setZindex();
							 }
							foundTarget.downObj = true;
							foundTarget.setupCurrentTransform(e);
							vcan.utility.setActiveObject(foundTarget);
							
							/** VERY IMPORTANT
							 * TODO 
							 * this is using at vcan.main.currObj, we should achive this thorugh 
							 * currentTransform at script.js and should be removed 
							 * from here
							 */
							vcan.main.currObj = foundTarget;
					  	 }else{
					  		 vcan.deactivateAll();
					  	 }
					  
					  	// we must renderAll so that active image is placed on the top canvas
					  	if(foundTarget != undefined){
					  		vcan.renderAll();
					  	}
					  	
					  	//after optimization
					  	if(!e.detail.hasOwnProperty('cevent')){
					  		var currTime = new Date().getTime();
							//var obj = {'mdTime' :  currTime, 'action' : 'd', 'x' :  e.clientX, 'y' : e.clientY};
					  		var obj = vcan.makeStackObj(currTime, 'd', e.clientX, e.clientY);
					  		
							vcan.main.replayObjs.push(obj);
							vm_chat.send({'repObj': [obj]});  //after optimized
							whBoard.utility.updateSentPackets(obj);
					  	}
					  	
					  //these code run when user is trying to create particular object	
					}else if(vcan.main.action == 'create'){
						if(e.detail.hasOwnProperty('cevent')){
							e.clientX = e.detail.cevent.x + (whBoard.vcan.main.offset.x);
							e.clientY = e.detail.cevent.y + (whBoard.vcan.main.offset.y);
							
							e.x = e.detail.cevent.x + (whBoard.vcan.main.offset.x);
							e.y = e.detail.cevent.x + (whBoard.vcan.main.offset.y);
							e.pageX = e.detail.cevent.x + (whBoard.vcan.main.offset.x);
							e.pageY = e.detail.cevent.y + (whBoard.vcan.main.offset.y);
							e.currX = e.detail.cevent.x;
							e.currY = e.detail.cevent.y;
						}
						
						var foundTarget = events().findTarget(e),
					    pointer = vcan.utility.getReltivePoint(e);
						
						if(foundTarget && foundTarget.type == 'text'){
							foundTarget.setupCurrentTransform(e);
						}
					}
					
					console.log('x' + e.clientX);
					console.log('x' + e.clientY);
				},
				
				
				/**
				 * performs operation like rotating, scaling, dragging, renderAll
				 * @param e is event object
				 * very important function for framework
				 */
				
				 mousemove : function (e) {
					 if(e.detail.hasOwnProperty('cevent')){
							e.clientX = e.detail.cevent.x;
							e.clientY = e.detail.cevent.y;
							e.x = e.detail.cevent.x;
							e.y = e.detail.cevent.y;
							e.pageX = e.detail.cevent.x;
							e.pageY = e.detail.cevent.y;
						}
					 
					// this condition is set because of performance reason
					// we don't want to execute below code when user is 
					// drawing the object
					 if(vcan.main.action == 'move'){
						 var tempObj; //IMPORTANT this is the added during the UNIT TESTING, can be critical
						 var obj = vcan.main;
					      if (!obj.currentTransform) {
				    	      var target = events().findTarget(e);
				    	     
				    	      //this.moveChunk.push(obj.currentTransform.target);
					      }else{
					    	  	 var pointer = vcan.utility.actualPointer(e),
						            x = pointer.x,
						            y = pointer.y;
						        
						    	 obj.currentTransform.target.isMoving = true;
						    	 
						        if (obj.currentTransform.action === 'rotate') {
							          // rotate object only if shift key is not pressed
							          //if (!e.shiftKey) {
							        	  vcan.interact.rotateObject(x, y);
							          //}
							          
							          if (!obj.currentTransform.target.hasRotatingPoint) {
							        	  vcan.interact.scaleObject(x, y);
							          }
							      	
							          if(!e.detail.hasOwnProperty('cevent')){
							        	  doOptiMize(e);
							          }
							          
						        } else if (obj.currentTransform.action === 'scale') {
						        	if(!e.detail.hasOwnProperty('cevent')){
							        	  doOptiMize(e);
							        }
						        	vcan.interact.scaleObject(x, y);
						        }
						        else if (obj.currentTransform.action === 'scaleX') {
						        	if(!e.detail.hasOwnProperty('cevent')){
							        	  doOptiMize(e);
							        }
						        	vcan.interact.scaleObject(x, y, 'x');
						        }
						        else if (obj.currentTransform.action === 'scaleY') {
						        	if(!e.detail.hasOwnProperty('cevent')){
							        	  doOptiMize(e);
							         }
						        	vcan.interact.scaleObject(x, y, 'y');
						        }
						        else {
						        	if(obj.currentTransform.target.draggable){
						        		
						        		 /*** 
						        		  *  NOTE disabled during the unit testing
						        		  * vcan.main.mode = 'drag'; 
						        		  * */
						        		 
						        		
						        		 //var  currRmTime = new Date().getTime();
						        		 var tempTarget =   vcan.extend({}, vcan.main.currentTransform.target);
						        		
						        		 var  currAdTime = new Date().getTime();
						        		 if(obj.currentTransform.target.downObj==true){
						        			 vcan.main.dragMode = true;
						        			
						        			 /**
						        			  * multiuser is a flag used for removed the previous drawn data over the canvas 
						        			  * this chunk of data would display for multi user only not for self user
						        			  * below block of code is handle to delete the object for multi user
						        			  */
						        			 
						        			 //this.moveChunk = vcan.utility.setMoveChunk(this.moveChunk, currAdTime);
						        			 vcan.main.starter_obj_id = obj.currentTransform.target.id;
						        			 obj.currentTransform.target.downObj = false;
						        			 
						        		 }
						        		 
						        		 var tempTarget = vcan.interact.translateObject(x, y);
						        		 if(!e.detail.hasOwnProperty('cevent')){
						        			 doOptiMize(e);
								         }
						        		 
						        		 tempTarget.setActive(true);
						        		 tempTarget.setCoords();
						        		 
						     		 }
						        }
						        
						        //push the object into replayObjs  
						        if(obj.currentTransform.action === 'scaleX' || obj.currentTransform.action === 'scaleY' ||  
						        		(obj.currentTransform.action === 'rotate' && !obj.currentTransform.target.hasRotatingPoint)){
								    vcan.main.scaleMode = true;
								    
							    	var  currAdTime = new Date().getTime();
									 if(obj.currentTransform.target.downObj==true){
										 this.moveChunk = vcan.utility.setMoveChunk(this.moveChunk, currAdTime);	
										 vcan.main.starter_obj_id = obj.currentTransform.target.id;
										 obj.currentTransform.target.downObj = false;
									 }
									 var tempTarget =   vcan.extend({}, vcan.main.currentTransform.target); 
						        	 tempTarget.setCoords();
						        	 
						        }
						        
//						        var ptr = vcan.utility.getReltivePoint(e);
//						        
//					        	var msPtr = vcan.extend({}, tempTarget.mp);
//					        	var updMsPtr = vcan.extend(msPtr, {x:ptr.x, y:ptr.y});
//					        	tempTarget = vcan.extend({}, tempTarget);
//					        	tempObj = vcan.extend(tempTarget, {mdTime:currAdTime, func:'add', usrCurrAction : 'drag', id : vcan.main.id++, mp : updMsPtr});
//						        
//						        
//						        // TODO this line should be removed from here
//						        if(typeof tempObj == 'object'){
//						        	if(tempObj.type == 'line'){ 
//							        	tempObj = vcan.utility.updateObj(tempObj);
//									}
//							        
//							        tempObj.lastElement = false;
//							        //this.moveChunk.push(tempObj);
//							        
////							        if (((typeof  lastmousemovetime == 'undefined') || (lastmousemovetime == null))) {
////							        	lastmousemovetime = new Date().getTime();
////							          	
////							        	if(!e.detail.hasOwnProperty('cevent')){
////							        		var obj = {'mdTime' :  lastmousemovetime, 'action' : 'move', 'x' :  e.clientX, 'y' : e.clientY};
////											vcan.main.replayObjs.push(obj);
////											vm_chat.send({'repObj': [obj]});  //after optimized
////							        	}
////							        	localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
////									}
////							        
////									presentmousemovetime = new Date().getTime();
////									if ((presentmousemovetime-lastmousemovetime)>=100) { // Optimized
////										//	console.log('raj bogati');
////										//alert('ssddsd');
////										var currTime= new Date().getTime();
////										if(!e.detail.hasOwnProperty('cevent')){
////											var obj = {'mdTime' :  currTime, 'action' : 'move', 'x' :  e.clientX, 'y' : e.clientY};
////											vcan.main.replayObjs.push(obj);
////											vm_chat.send({'repObj': [obj]});
////										}
////
//////										vm_chat.send({'repObj': [tempObj]});
////								  		lastmousemovetime = new Date().getTime();
////										localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
////									}
//									
//							        
//							      //  localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
//							        
//						        }
						       vcan.renderAll();
					      }
					 }else{
						 
					 }
				 },
				
						
				/**
				 * Sets co-ordination for particular object
				 * @param e event object 
				 *  it occures when the mouse rellease over the canvas
				 */
			 mouseup :  function (e) {
				 if(e.detail.hasOwnProperty('cevent')){
						e.clientX = e.detail.cevent.x;
						e.clientY = e.detail.cevent.y;
						e.x = e.detail.cevent.x;
						e.y = e.detail.cevent.y;
						e.pageX = e.detail.cevent.x;
						e.pageY = e.detail.cevent.y;
					}
				 lastmousemovetime = null;
				 if(vcan.main.action == 'move'){
					 //console.log('sss');
					 
//					 var currTime= new Date().getTime();
//					 var obj = vcan.makeStackObj(currTime, 'm', e.clientX, e.clientY);
//					 vcan.main.replayObjs.push(obj);
//					 vm_chat.send({'repObj': [obj]});
//					 var ms = vcan.mouse();
//					 ms.mousemove(e);
					 vcan.activMouse.mousemove(e);
					   var mainCan = vcan.main;
						   if (mainCan.currentTransform) {
						        var transform = mainCan.currentTransform,
						            target = transform.target;
						        if (target.scaling) {
						        	target.scaling = false;
						        }

						        // determine the new coords everytime the image changes its position
						        //after enabled this statement the drag, drop and rotate function have been smoothed 
						         var i = mainCan.children.length;
						         while (i--) {
						        	 mainCan.children[i].setCoords(); //todo should think about this statment
						        }
						    }
						      	
//							if(vcan.main.dragMode == true || vcan.main.scaleMode == true){
//								vcan.main.replayObjs[vcan.main.replayObjs.length-1].lastElement = true;
//								vcan.main.replayObjs[vcan.main.replayObjs.length-1].id = vcan.main.starter_obj_id;
//							}
							
							//TODO this object should not be but null but empty
							
						    mainCan.currentTransform = null;
					    	vcan.renderAll();
						
						    // every time(either the action in scale or drag mode) there would be checked that if the object is existing
						    //  which have to be deleted duplicate object 
						      if(vcan.main.dragMode == true || vcan.main.scaleMode == true){
						    	  	var pointer = vcan.utility.actualPointer(e);
						    	  	var currTime = new Date().getTime();
						    	  	if(!e.detail.hasOwnProperty('cevent')){
						    	  		//var obj = {'mdTime' :  currTime, 'action' : 'u', 'x' :  e.clientX, 'y' : e.clientY};
						    	  		var obj = {'mt' :  currTime, 'ac' : 'u', 'x' :  e.clientX, 'y' : e.clientY};
										vcan.main.replayObjs.push(obj);
										vm_chat.send({'repObj': [obj]});
										localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
						    	  	}
						    	  	
						    	  	if(vcan.main.dragMode == true){
						    	  		vcan.main.dragMode = false;
						    	  	}	
						    	  	
						    	  	if(vcan.main.scaleMode == true){
						    	  		vcan.main.scaleMode = false;
						    	  	}
						    	  	
						    	  	
									
						    	  
//						    	  	//TODO should think about total length of replay node
//						    	    var tRLength = vcan.main.replayObjs.length-1;
//						    	    //todo should re-think about this feature
//									  for(var j=0; j<vcan.main.replayObjs.length; j++){
//										  //removing the object either particular object is scaling or removing
//										  
//										  if(vcan.main.dragMode == true){
//										  		if((vcan.main.replayObjs[j].x == vcan.main.replayObjs[tRLength].x && 
//													  vcan.main.replayObjs[j].y == vcan.main.replayObjs[tRLength].y)
//													  &&
//													  (vcan.main.replayObjs[j].id == vcan.main.replayObjs[tRLength].id)) 
//												{
//										  	  	  if(j>0){ 
//											  		var tempObj =  vcan.extend({}, vcan.main.replayObjs[j]);
//											  		    tempObj =  vcan.extend(tempObj, {x: vcan.main.replayObjs[j-1].x, y: vcan.main.replayObjs[j-1].y});
//												  	    vcan.main.replayObjs[j] = tempObj;
//													    vcan.main.dragMode = false
//													    console.log('ux ' + tempObj.x);
//												//	    vm_chat.send({'repObj': [tempObj]});
//													    break; //this is added druing the unit testing
//													    
//											  	  }
//										  	  }
//										  }
//									  		
//									  	  if(vcan.main.scaleMode == true){
//										  		if(
//										  				(vcan.main.replayObjs[j].scaleX == vcan.main.replayObjs[tRLength].scaleX  ||
//										  				 vcan.main.replayObjs[j].scaleY == vcan.main.replayObjs[tRLength].scaleY )	
//										  				 && 
//										  				 vcan.main.replayObjs[j].id == vcan.main.replayObjs[tRLength].id 
//										  		){
//										  			if(j>0){ //NOTE for changed for freedrawing
//										  				
//										  				//alert("hello guys");
//											  			 var tempObj =  vcan.extend({}, vcan.main.replayObjs[j]);
//												    	  tempObj =  vcan.extend(tempObj, {
//												    		  	scaleX: vcan.main.replayObjs[j-1].scaleX, scaleY: vcan.main.replayObjs[j-1].scaleY,
//												    		  	theta : vcan.main.replayObjs[j-1].theta });
//												    	  vcan.main.replayObjs[j] = tempObj;
//												    	  vcan.main.scaleMode = false;
//												    	  console.log('ux ' + tempObj.x);
//												    	 // vm_chat.send({'repObj': [tempObj]});
//												    	  break; //this is added during the unit testing
//										  			} 
//										  		}
//										  }
//									  	  
//									 }
									// important
									  // vm_chat.send({'repObj': this.moveChunk});	   
							  }else{
								  if(!e.detail.hasOwnProperty('cevent')){
									  
						    	  		//e.x, e.y is not supported for firefox, need some good structure	
						    	  	//	var obj = {'mdTime' :  currTime, 'action' : 'up', 'x' :  e.clientX, 'y' : e.clientY};
									   var obj = {'mt' :  currTime, 'ac' : 'u', 'x' :  e.clientX, 'y' : e.clientY};
										vcan.main.replayObjs.push(obj);
										vm_chat.send({'repObj': [obj]});
										localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
						    	  	}
							  }
						     
						      vcan.wb.sentPack  = true;
						      
						}
				 }
			}
			
	  }
	
	
	window.vcan = vcan;
	
	}
)(window, document);