(
	function (window){
		var whBoard = window.whBoard;
		whBoard.utility = {
			
			/**
			 * This function does check that passed object is existing into 
			 * removeElements array or not
			 * @param obj expects the object which have to be checked against removeElements
			 * @returns that position if the object is existing into remove Elements 
			 */
			isObjExistRE : function (obj){
				if(whBoard.replay.removeElements.length>=0){
					var objPos = whBoard.vcan.ArrayIndexOf(whBoard.replay.removeElements, function (pobj){return pobj.id == obj.id});
					if(objPos >=0){
						return objPos;
					}
				}
			}, 
			
			
			/**
			 *  This function checks that particular object has property or not
			 *  @obj the object should be tested that object has property or not 
			 *  return true if the object is empty false otherwise
			 */	
			IsObjEmpty : function (obj){
			  for(var key in obj) {
			      if (obj.hasOwnProperty(key)) {
			         return false;
			      }
			   }
			   return true;
		   },
		   
		   
		    /**
			 *  This function converts string to number
			 *  @param expects pmdTime which has to be converted
			 *  returns that converted number
			 */
			 stringToNumber : function (pmdTime){
				if(pmdTime[pmdTime.length-1] == ' '){
					pmdTime = pmdTime.substring(0, pmdTime.length-1); //removing the space
				}
				
				pmdTime = Number(pmdTime); //converting string into number
				return pmdTime;
			 },
			 
			
			/***
			 * this function does check that the user 
			 * click at very first on canvas for draw the text
			 * or click outside the box for finalize the  written text  
			 * return true at second case false otherwise 
			 * at @param expects the number either it is odd or even
			 */
			
			clickOutSidebox : function(num){
				return (num % 2 != 1) ? true : false ; 
			},
			
			
			/**
			 * Through this function the selected object would be deleted
			 * when user press on delete button after selected particular object
			 * @param evt expects key down event
			 */
			keyOperation : function(evt){
				//this is used for removed the selected object	
				var currTime = new Date().getTime();
				if(evt.keyCode == 8){
					var vcan = whBoard.vcan;
					if(vcan.main.currObj != ""){
						whBoard.canvas.removeObject(vcan.main.currObj);
						var obj = vcan.main.currObj;
					    var tempObj =  vcan.extend({}, obj);
					    //tempObj = vcan.extend(tempObj, {mdTime:currTime, func:'remove', usrCurrAction : 'delete', lastElement :true});
					    tempObj = vcan.extend(tempObj, {mt:currTime, func:'remove', usrCurrAction : 'delete', lastElement :true});
					    vcan.main.replayObjs.push(tempObj);
						vcan.main.currObj = "";
					}
				}
			},
			
			
			/**
			 *  Through this function the event handlers attaching  
			 *  the canvas there are three kinds of event handlers
			 *  mouse down, up and move
			 */
			attachEventHandlers : function (){
				whBoard.canvas.bind('mousedown', whBoard.utility.ev_canvas);
				whBoard.canvas.bind('mousemove', whBoard.utility.ev_canvas);
				whBoard.canvas.bind('mouseup',   whBoard.utility.ev_canvas);
			},
			
			
			
			/**
			 * Call the function through which     
			 * the canvas would be clear
			 */
			t_clearallInit : function() {
				var delRpNode = true;
				whBoard.utility.clearAll(delRpNode);
				if(localStorage.repObjs){
					//localStorage.clear();
					//alert('suman bogati');
					//debugger;
				}
				
			},
			
			/**
			 * By this function  all drawn object over the canvas would be erased   
			 * which means the canvas would be cleared
			 * @param delRpNode
			 */
			clearAll : function(delRpNode, pkMode){
				var vcan = whBoard.vcan;
				while(vcan.main.children.length > 0){
					whBoard.canvas.removeObject(vcan.main.children[0]);
				}
				
				
				//removing all the elements from replayObjs
				if(delRpNode == true){
					/*****
					This would I have disbaled can be critical
					
					whBoard.repObj.replayObjs.splice(0, whBoard.repObj.replayObjs);
					*****/
					vcan.main.replayObjs.splice(0, vcan.main.replayObjs.length);
					
				}
				
				
				if(whBoard.replay != undefined){
					whBoard.replay.objNo = 0;
				}
				
				if(vcan.getStates('action') == 'move'){
					vcan.setValInMain('action', 'create');
				}
				
				var allDivs = document.getElementById('sendPackCont').getElementsByClassName('numbers');
				
				if(allDivs.length > 0){
					//allDivs[i].innerHTML = 0;
					for(var i=0; i<allDivs.length; i++){
						allDivs[i].innerHTML = 0; 
					}
				}
					
				if(typeof pkMode == 'undefined'){
					whBoard.sentPackets = 0;
					whBoard.receivedPackets = 0;
				}
				
				//for clear sent and received msg information
				document.getElementById('sentMsgInfo').innerHTML  = "";
				document.getElementById('rcvdMsgInfo').innerHTML  = "";
				
				
				
//				var vcan = whBoard.vcan;
//				//vcan.main.children = [];
//				
//				vcan.main.children.splice(0, vcan.main.children.length);
//				//vcan.main.replayObjs = [];
//				if(delRpNode == true){
//					/*****
//					This would I have disbaled can be critical
//					
//					whBoard.repObj.replayObjs.splice(0, whBoard.repObj.replayObjs);
//					*****/
//					vcan.main.replayObjs.splice(0, vcan.main.replayObjs.length);
//					
//				}
//				
//				var canElem = vcan.main.canvas;
//				var ctx = canElem.getContext('2d');
//		        ctx.clearRect(0, 0, canElem.width, canElem.height);
//				
//				if(whBoard.replay != undefined){
//					whBoard.replay.objNo = 0;
//				}
				
				
			},
			
			
			/**
			 * By this function there would de-activating all the objects
			 * which is stored into children array of vcan
			 * de-activating means the particular object would not be select able 
			 * @returns {Boolean}
		     */
		   deActiveFrmDragDrop : function(){
			    var vcan = whBoard.vcan;
				var allChildren = vcan.main.children;
				var currState  = vcan.getStates('action');
				if(currState == 'move'){
					vcan.setValInMain('action', 'create');
					for(var i=0; i<allChildren.length; i++){
						//allChildren[i].draggable = false;
						allChildren[i].dragDrop(false);
						allChildren[i].setActive(false);
					}
					return true;
				}
				return false;
			},
			
			/*
			 deactivateAll : function () {
		    	 var allObjects = vcan.main.children,
		           i = 0,
		           len = allObjects.length;
			       for ( ; i < len; i++) {
			      	 	allObjects[i].setActive(false);
			       	}
			      // return this;
		     }, */
			
			/**
			 *   This function just determines the mouse 
			 *   position relative to the canvas element. which means the mouse position(x, y)
			 *   would counted from there where the canvas is started on browser
			 *   @param evt expects the mouse event object
			 *   @returns the object which has x and y co-ordination
			 */
			getOffset : function(evt) {
				
				var el = evt.target, 
				x = y = 0;
					//getting the total mouse position from the relative element where the event is occurred
				while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
					x += el.offsetLeft - el.scrollLeft;
					y += el.offsetTop - el.scrollTop;
					el = el.offsetParent;
				}
				
				x = evt.clientX - x;
				y = evt.clientY - y;
				return { x: x, y: y };
			},
			
			
			/**
			 * Through this function the mouse event would called on the
			 * particular object eg:- mouse down over the rectangle object 
			 * which means the mouse is downed/created for create the rectangle
			 */
			ev_canvas : function(ev) {
				//NOTE:- this have been done during the unit testing
				//var posMous = whBoard.utility.getOffset(ev);
				var posMous =  whBoard.vcan.utility.getReltivePoint(ev);
				ev.currX= posMous.x;
				ev.currY= posMous.y;
				
				//here the particular function is calling according to mouse event 
				var func = whBoard.tool[ev.type];
				if (func) {
					func(ev);
					return this.ev_canvas;
				}
				
			},
			
			
			/**
			 * This function does active all the object which are 
			 * created on canvas, after active all the object
			 * they can be selectable, draggable, rotateable etc
			 */
			t_activeallInit : function () {
				var vcan = whBoard.vcan;
				// TODO I have to make the function to get the children 
				//var allChildren = vcan.main.children;
				var allChildren = vcan.getStates('children');
				if(allChildren.length >= 1){
					/* TODO this should not contain here */
					vcan.setValInMain('action', 'move');
					for(var i=0; i<allChildren.length; i++){
						allChildren[i].dragDrop(true);
					}
				}
			},
			
			drawArrowImg : function (img, obj){
				var ctx  = whBoard.vcan.main.canvas.getContext('2d');
				ctx.clearRect(0, 0, whBoard.vcan.main.canvas.width, whBoard.vcan.main.canvas.height);
				vcan.renderAll();
			    ctx.save();
			    ctx.beginPath();
	            ctx.translate(obj.mp.x, obj.mp.y);
	            ctx.drawImage(img, 0, 0, 10, 20);
	            ctx.closePath();
	            ctx.restore();
			},
			
			calcPsSentPackets : function (oldData){
				var pacPerSec = whBoard.sentPackets - oldData;
				//var oldData = whBoard.sentPackets;
				//this is handle when user click on clear button for clear
				//if we disable this there woould be replay the negative value
				if(pacPerSec < 0){
					pacPerSec = 0;
				}
				document.getElementById(whBoard.sentPackDivPS).innerHTML = pacPerSec;
				return whBoard.sentPackets;
			},
			
			calcPsRecvdPackets : function (oldData2){
				var pacPerSec = whBoard.receivedPackets - oldData2;
				if(pacPerSec < 0){
					pacPerSec = 0;
				}
				document.getElementById(whBoard.receivedPackDivPS).innerHTML = pacPerSec;
				return whBoard.receivedPackets;
			},
			
			//initialize transfred packets from local storage when
			// browser is reloaded
			initStoredPacketsNumbers : function (){
				if(localStorage.sentPackets){
					var totSentPackets = JSON.parse(localStorage.sentPackets);
					whBoard.sentPackets = totSentPackets;
					document.getElementById(whBoard.sentPackDiv).innerHTML = totSentPackets;
				}
				
				if(localStorage.receivedPackets){
					whBoard.receivedPackets = JSON.parse(localStorage.receivedPackets);
					document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
    			}
			}, 
			
			updateSentPackets : function (obj){
				whBoard.sentPackets = whBoard.sentPackets + JSON.stringify(obj).length;
				document.getElementById(whBoard.sentPackDiv).innerHTML = whBoard.sentPackets
			}
		};
	}
)(window);