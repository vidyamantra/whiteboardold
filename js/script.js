/**
 * 
 */
(function (window,document){
		var vm_chat = window.vm_chat;
		var i=0;
		var dummyNum = 0;
		/**
		 * This is the main object which has properties and methods
		 * Through this properties and methods all the front stuff is happening
		 * eg:- creating, storing and replaying the objects 
		 */
		var whBoard = {
			tool : '',
			obj : {},
			prvObj : '',
			replayTime : 0, 
			sentPackets : 0,
			sentPackDiv : 'sentPacket',
			sentPackDivPS : 'sentPacketPS',
			receivedPackets : 0,
			receivedPackDiv : 'receivedNumber',
			receivedPackDivPS : 'receivedNumberPS',
			
			
			
			/**
			 * This function basically does create the canvas on which 
			 * the user draws the various object
			 * @param window the function gets the window object as parameter
			 *    
			 */
			init : function (){
				whBoard.vcan = window.vcan; //this would be done because of possibility of conflict
				var vcan = whBoard.vcan;
				whBoard.canvas = vcan.create('#canvas');
				var canvasObj = vcan.main.canvas;
				canvasObj.setAttribute('tabindex','0');  //this does for set chrome
				canvasObj.focus();
				
				//IMPORTANT  this is changed during the UNIT testing
				//onkeydown event is working into all browser 
				//canvasObj.addEventListener("keydown", whBoard.utility.keyOperation, true);
				canvasObj.onkeydown = whBoard.utility.keyOperation;
				
				//window.addEventListener('resize', whBoard.resizeCanvas, false);
				whBoard.resizeCanvas();
				
				
				if(typeof(Storage)!=="undefined"){
					if(localStorage.repObjs){
						var replayObjs = JSON.parse(localStorage.repObjs);
						if(replayObjs.length > 0){
							//vcan.main.replayObjs = replayObjs;
							//whBoard.toolInit('t_replay');
						}
					}
					
					if(localStorage.sentPackets){
						var totSentPackets = JSON.parse(localStorage.sentPackets);
						//alert(totSentPackets);
						whBoard.sentPackets = totSentPackets;
						document.getElementById(whBoard.sentPackDiv).innerHTML = totSentPackets;
					}
					
					
				}
				
				this.arrowInit();
				var oldData = whBoard.sentPackets;
				setInterval(function (){
					oldData = whBoard.utility.calculatePSPacket(oldData);
					document.getElementById(whBoard.sentPackDiv).innerHTML = whBoard.sentPackets;
				}, 1000);
				
			},
			
			arrowInit : function(){
				this.arrImg = new Image();
				this.arrImg.src = 'arrow.png';
				this.arrImgDraw = false; 
				var wb = this;
			    this.arrImg.onload = function() {
			    	wb.arrImgDraw = true;
			    };
			},
			
			createCommand : function (){
				var cmdToolsWrapper  = document.createElement('div');
					cmdToolsWrapper.id = 'commandToolsWrapper';
					whBoard.createDiv('t_line', 'Line', cmdToolsWrapper);
					whBoard.createDiv('t_rectangle', 'Rectangle', cmdToolsWrapper);
					whBoard.createDiv('t_freeDrawing', 'Free Drawing', cmdToolsWrapper);
					whBoard.createDiv('t_oval', 'Oval', cmdToolsWrapper);
					whBoard.createDiv('t_triangle', 'Triangle', cmdToolsWrapper);
					whBoard.createDiv('t_text', 'Text', cmdToolsWrapper);
					whBoard.createDiv('t_replay', 'Replay', cmdToolsWrapper);
					whBoard.createDiv('t_activeall', 'Active All', cmdToolsWrapper);
					whBoard.createDiv('t_clearall', 'Clear All', cmdToolsWrapper);
					
			},
			
			createDiv : function (toolId, text, cmdToolsWrapper){
					var ancTag = document.createElement('a');
					ancTag.href = '#';
				
					var lDiv = document.createElement('div');
					lDiv.id = toolId;
					ancTag.innerHTML = text;
					lDiv.appendChild(ancTag);
					
					cmdToolsWrapper.appendChild(lDiv);
					document.getElementById('containerWb').appendChild(cmdToolsWrapper);
			},
			
			createCanvas : function (){
				var cmdToolsWrapper  = document.createElement('div');
				cmdToolsWrapper.id = 'canvasWrapper';
				
				var canvas = document.createElement('canvas');
					canvas.id = 'canvas';
					canvas.innerHTML = 'Canvas is missing in your browsers. Please update the latest version of your browser';
					cmdToolsWrapper.appendChild(canvas);
					document.getElementById('containerWb').appendChild(cmdToolsWrapper);
			},
			
			
			crtPakCont : function (){
				var packCont  = document.createElement('div');
					packCont.id = 'sendPackCont';
				
					document.getElementById('canvasWrapper').appendChild(packCont);
					
					//creating div for sending packet per second
					var sendPacketPS =  document.createElement('div');
					sendPacketPS.id = 'sendPackPsCont'; 
				    packCont.appendChild(sendPacketPS);
					
					label = document.createElement('label'); 
					label.innerHTML = "Per second sent packets";
					sendPacketPS.appendChild(label);
					
					counterDiv = document.createElement('div');
					counterDiv.id = whBoard.sentPackDivPS;
					counterDiv.className = 'numbers';
					counterDiv.innerHTML = 0;
					sendPacketPS.appendChild(counterDiv);
					
					
					//creating div for send total packet per second
					var totSendPacket =  document.createElement('div');
				    totSendPacket.id = 'totSendPackCont'; 
				    packCont.appendChild(totSendPacket);
				    
					
					var label = document.createElement('label'); 
						label.innerHTML = "Total Sent Packets";
						totSendPacket.appendChild(label);
						
						var counterDiv = document.createElement('div');
						counterDiv.id = whBoard.sentPackDiv;
						counterDiv.className = 'numbers';
						counterDiv.innerHTML = 0;
						totSendPacket.appendChild(counterDiv);
						
						
						
					
					
//					//TODO below and above statement can be achieved by single funciton
//					packCont  = document.createElement('div');
//					packCont.id = 'receivePackCont';
//					packCont.innerHTML = "Total Received Packets";
//					document.getElementById('canvasWrapper').appendChild(packCont);
//					
//					counterDiv = document.createElement('div');
//					counterDiv.id = 'receivedNumber';
//					counterDiv.className = 'numbers';
//					counterDiv.innerHTML = 0;
//					packCont.appendChild(counterDiv);
					
					
					//hello
					 packCont  = document.createElement('div');
					packCont.id = 'receivePackCont';
				
					document.getElementById('canvasWrapper').appendChild(packCont);
					
					//creating div for sending packet per second
					var receivePacketPS =  document.createElement('div');
					receivePacketPS.id = 'receivePackPsCont'; 
				    packCont.appendChild(receivePacketPS);
					
					label = document.createElement('label'); 
					label.innerHTML = "Per second received packets";
					receivePacketPS.appendChild(label);
					
					counterDiv = document.createElement('div');
					counterDiv.id = whBoard.receivedPackDivPS;
					counterDiv.className = 'numbers';
					counterDiv.innerHTML = 0;
					receivePacketPS.appendChild(counterDiv);
					
					
					//creating div for send total packet per second
					var totReceivedPack =  document.createElement('div');
						totReceivedPack.id = 'totReceivedPackCont'; 
						packCont.appendChild(totReceivedPack);
				    
					
					var label = document.createElement('label'); 
						label.innerHTML = "Total Received Packets";
						totReceivedPack.appendChild(label);
						
						counterDiv = document.createElement('div');
						counterDiv.id = whBoard.receivedPackDiv;
						counterDiv.className = 'numbers';
						counterDiv.innerHTML = 0;
						totReceivedPack.appendChild(counterDiv);
					
					
					
			},
			
			
			resizeCanvas : function() {
				//canvas.width = (window.innerWidth * 80) /100;
				//canvas.height = (window.innerHeight * 80) /100;
				//window.vcan.renderAll();
				
				canvas.width = 900;
				canvas.height = 700;
			},
			
			
			/**
			 * this does call the initializer function for particular object    
			 * @param expects the mouse down event.
			 */
			objInit : function (evt){
				var anchorNode = evt.originalTarget;
				if(evt.originalTarget == undefined){
					anchorNode = evt.target; //for chrome and safari
				}
				
				if(anchorNode.parentNode.id == 't_replay'){
					whBoard.utility.clearAll(false);
					vm_chat.send({'replayAll' :  true});
				}else{
					whBoard.toolInit(anchorNode.parentNode.id);
				}
				
			},
			
			
			/**
			 * 
			 * This function does attach the handlers by click the particular object
			 * would be triggered eg:- if user click on rectangle link then rectangle
			 * object would triggered for create the rectangle object
			 * @param id expects the  id of container which contains all the commands of div
			 */
			attachToolFunction : function(id){
				whBoard.createCommand();
				whBoard.createCanvas();
				whBoard.crtPakCont()
				var allDivs = document.getElementById(id).getElementsByTagName('div');
				for(var i=0; i<allDivs.length; i++){
					
					//TODO this will have to be fixed as it always assigned t_clearall
					//whBoard.currComId = allDivs[i].id; 
					//allDivs[i].getElementsByTagName('a')[0].addEventListener('click', whBoard.objInit, true);
					//IMPORTANT this is changed during the UNIT testing
					allDivs[i].getElementsByTagName('a')[0].onclick = whBoard.objInit;
				}
			},
			
			/**
			 * By this method the particular function would be initialize
			 * eg: if the user click on replay button then  the 'replay' function would initialize   
			 * @param cmd expects the particular command from user
			 * 
			 */
			toolInit : function (cmd, repMode){
				if(typeof whBoard.obj.drawTextObj == 'object' && whBoard.obj.drawTextObj.wmode == true){
					var ctx = vcan.main.canvas.getContext('2d');
					whBoard.obj.drawTextObj.renderText(whBoard.obj.drawTextObj.currObject, whBoard.obj.drawTextObj.prvModTextObj, ctx);
					whBoard.obj.drawTextObj.wmode = false;
				}
				
				// all the objects would deactivated if there is exist any
				var allChilds = whBoard.vcan.getStates('children');
				
				//added after raised by bugs
				if(allChilds.length > 0 && cmd != 't_clearall'){
					whBoard.utility.deActiveFrmDragDrop();
					whBoard.vcan.renderAll();
				}
				if(!whBoard.utility.IsObjEmpty(whBoard.obj.freeDrawObj)){ whBoard.obj.freeDrawObj.freesvg = false;}
				
				whBoard.vcan.main.currUserCommand = cmd+'Init'; 
				
				if(cmd == 't_activeall'){
					whBoard.utility.t_activeallInit();
				}
				
				
				if(cmd == 't_replay'){
					vcan.setValInMain('id', 0);
					 whBoard.t_replayInit(repMode);
					 var repAllObjs = whBoard.vcan.getStates('replayObjs');
					 if(repAllObjs.length > 1){
						 var totRepTime = repAllObjs[repAllObjs.length-1].mdTime - repAllObjs[0].mdTime;
						 totRepTime = totRepTime + (repAllObjs[1].mdTime - repAllObjs[0].mdTime);
					 }else{
						 if(repAllObjs[0].type == 'freeDrawing'){
							 var stTime = whBoard.utility.stringToNumber(repAllObjs[0].path[0][3]); 
							 var totRepTime = repAllObjs[0].mdTime -  stTime;
						 }
						 //alert(repAllObjs[0].type);
					 }
					 
					 //this code is handle in case of 
					 //user want to do replay frequently time
					 //there can be the problem if replay does slow
					 /*setTimeout(function (){
						 whBoard.replay.rctx.restore();
					 }, totRepTime+100); */
				}
				
				if(cmd == 't_clearall'){
					whBoard.utility.t_clearallInit();
					//vm_chat.send({'clearAll': true});
				}
				if(cmd == 't_clearall'){
					vm_chat.send({'clearAll': true});
				}
				
				if(cmd != 't_activeall' || cmd != 't_replay' || cmd != 't_clearallInit'){
					whBoard.tool = new whBoard.tool_obj(cmd)
					whBoard.utility.attachEventHandlers();
				}
			},
			
			
			/**
			 * The object would be created at core level 
			 * rectangle object would created  in case of creating the rectangle
			 * @param the cmd expects one of the object that user can draw
			 * text and free draw are different case than other object
			 */
			tool_obj : function (cmd){
				//when other objecti 
				if(cmd != 't_freeDrawing'){
					whBoard.obj.freeDrawObj = "";
				}
				
				if(cmd != 't_text'){
					whBoard.obj.drawTextObj = "";
				}
				
				if(cmd == 't_freeDrawing'){
					//NOTE:- this is added during the UNIT testing
					var borderColor = "green";
					var linWidth = "3";
					whBoard.obj.freeDrawObj =  new whBoard.readyFreeHandObj(borderColor, linWidth);
					whBoard.obj.freeDrawObj.init();
					
					//below line is commented out during unit testing
					//whBoard.vcan.main.mcanvas = whBoard.canvas; //TODO this should be control because it is used inside the
					
				}else if(cmd == 't_text'){
					whBoard.obj.drawTextObj = new whBoard.cText();
					whBoard.obj.drawTextObj.init("canvasWrapper");
				}
				
				var mCmd = cmd.slice(2, cmd.length); 
				
				whBoard.draw_object(mCmd, whBoard.canvas, this)
			},
			
			
			/***
			 * This class is created for the contain various method
			 * which are used into the this application for various work
			 * 
			 */
			utility : {
				
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
						    tempObj = vcan.extend(tempObj, {mdTime:currTime, func:'remove', usrCurrAction : 'delete', lastElement :true});
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
				clearAll : function(delRpNode){
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
						allDivs[i].innerHTML = 0;
					}
					
					whBoard.sentPackets = 0;
					whBoard.receivedPackets = 0;
					
					
					
					
//					var vcan = whBoard.vcan;
//					//vcan.main.children = [];
//					
//					vcan.main.children.splice(0, vcan.main.children.length);
//					//vcan.main.replayObjs = [];
//					if(delRpNode == true){
//						/*****
//						This would I have disbaled can be critical
//						
//						whBoard.repObj.replayObjs.splice(0, whBoard.repObj.replayObjs);
//						*****/
//						vcan.main.replayObjs.splice(0, vcan.main.replayObjs.length);
//						
//					}
//					
//					var canElem = vcan.main.canvas;
//					var ctx = canElem.getContext('2d');
//			        ctx.clearRect(0, 0, canElem.width, canElem.height);
//					
//					if(whBoard.replay != undefined){
//						whBoard.replay.objNo = 0;
//					}
					
					
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
				
				calculatePSPacket : function (oldData){
					var pacPerSec = whBoard.sentPackets - oldData;
					console.log('send data ' + pacPerSec);
					//var oldData = whBoard.sentPackets;
					//this is handle when user click on clear button for clear
					//if we disable this there woould be replay the negative value
					if(pacPerSec < 0){
						pacPerSec = 0;
					}
					document.getElementById(whBoard.sentPackDivPS).innerHTML = pacPerSec;
					return whBoard.sentPackets;
				},
				
				calculateRecPacket : function (oldData2){
					var pacPerSec = whBoard.receivedPackets - oldData2;
					
					if(pacPerSec < 0){
						pacPerSec = 0;
					}
					document.getElementById(whBoard.receivedPackDivPS).innerHTML = pacPerSec;
					return whBoard.receivedPackets;
				}
				
			},
			
			/**
			 * This function does initiates replay function after click on replay button 
			 * it replays all the object the user would drawn 
			 */
			t_replayInit : function(repMode) {
				//vcan.setValInMain('id', 0); 
				//var vcan = whBoard.vcan;
				 //var delRpNode = false;
				 
				 //alert('suman bogati');
				 //debugger;
				 
				 //whBoard.vcan.jc++;
				 //whBoard.utility.clearAll(delRpNode);
				//whBoard.utility.clearAll(false);
				 
				 
				 // TODO this should be enable 
				 // renderObjText();
				 whBoard.replay = whBoard._replay();
				 
				
				 //alert(whBoard.replay);
				 //alert(whBoard.replay.mtransform);
				 whBoard.replay.init(repMode);
				 //alert(whBoard.replay.objNo);
				 whBoard.replay.renderObj();
				 
				 
			
				 //if(typeof whBoard.replay.rctx == 'object'){
					// whBoard.replay.rctx.restore();
				// }
				 
			},
			
			
			/**
			 * This object has methods through which  
			 * the replay of drawn of object would
			 * happen over the canvas
			 * 
			 */
			_replay : function (){
				return {
					
					/**
					 * this function does initialize the default value
					 * which are needs to replay the objects which are drawn by user
					 * @returns
					 */
					init :function (repMode){
						var vcan = whBoard.vcan;
						this.objs = vcan.getStates('replayObjs');
						this.removeElements = [];
						this.objNo  = 0;
						
//						if(typeof this.rctx == 'object'){
//							alert('sasfasdf');
//							rctx.restore();
//						}
						//these lines are using for free drawing
						//this.rctx = vcan.main.canvas.getContext('2d');
						//vcan.myctx = this.rctx; //TODO this should be removed
						this.mtransform = true; 
						this.pn = 0; 
						this.prvchild = "";
						this.repMode =  repMode;
						
//						this.arrImg = new Image();
//						this.arrImg.src = 'arrow.png';
//						this.arrImgDraw = false; 
//						var repObj = this;
//					    this.arrImg.onload = function() {
//					    	repObj.arrImgDraw = true;
//					    };
					},
					
					
					/**
					 *  This is the one of the most important function for do 
					 *  replay the objects which were drawn by user 
					 */
					renderObj : function (){
							
							//alert(vcan.main.freeHandDrawing.contextTop);
							var vcan = whBoard.vcan;
							
							
							var wbRep = whBoard.replay;
							if(wbRep.objs.length <= 0 || typeof wbRep.objs[wbRep.objNo] != 'object' ) {
								return;
							}
							
							if(wbRep.objs[wbRep.objNo].hasOwnProperty('pt')){
								whBoard.canvas.removeObject((wbRep.objs[wbRep.objNo].pt));
							}
							
							
							
							
								
							var stime = new Date().getTime(wbRep.objs[wbRep.objNo].mdTime);
							var sdate = new Date(stime);
							var currObjType = wbRep.objs[wbRep.objNo].type;
							
							var currUsrAction = wbRep.objs[wbRep.objNo].usrCurrAction;
							if(currObjType != 'freeDrawing' || 
							  (currObjType == 'freeDrawing' && 
							  (currUsrAction == 'drag' || currUsrAction == 'delete' 
								  || (wbRep.objs[wbRep.objNo].lastElement == false && wbRep.objs[wbRep.objNo].multiuser == true) 
								  //||(wbRep.prvchild != ''  && wbRep.prvchild.lastElement != true && wbRep.prvchild.type == 'freeDrawing')
									))){
								
								//remove the previous object that has just created
								if(wbRep.prvchild != ''  && wbRep.prvchild.lastElement != true){
									  whBoard.canvas.removeObject(wbRep.prvchild);
						     	}
								
								if(wbRep.objs[wbRep.objNo].lastElement == false && wbRep.objs[wbRep.objNo].multiuser == true){
									  whBoard.canvas.removeObject(wbRep.objs[wbRep.objNo]);
						     	}
							
								//remove the deleted item into real world and remove the item which have to be finalized
								if(currUsrAction != undefined && (currUsrAction == 'drag' || currUsrAction == 'delete')){
									if(wbRep.removeElements.length >= 0){
										 wbRep.rmvObjFrmRE(wbRep, currUsrAction);
									}
								}
						     	
								//put the last object into removeElement array which should not have to be deleted during the replay
								//TODO this could be merged with below's statement
						     	if(wbRep.objs[wbRep.objNo].lastElement == true){
						     		wbRep.removeElements.push(wbRep.objs[wbRep.objNo]);
						     	}
						     	
						     	//add the object to canvas for acheiving the adding effect of replay
						     	if(wbRep.objNo < wbRep.objs.length && wbRep.objs[wbRep.objNo] != undefined){
						     		wbRep.addObjForRep(wbRep, currUsrAction, currObjType);
						     		
						     		/*
						     		if(wbRep.arrImgDraw == true){
						     			whBoard.utility.drawArrowImg(wbRep.arrImg, wbRep.objs[wbRep.objNo]);
						     		}
						     		*/
						     		
						     	}
                                
						   }else if(wbRep.objs[wbRep.objNo].lastElement == true && wbRep.objs[wbRep.objNo].multiuser == true){
							   wbRep.objNo++;
							   whBoard.replay.renderObj();
							   
						   }else{
					    	   wbRep.fdRender.fdReplay(wbRep);
					    	
							  // whBoard.canvas.removeObject(wbRep.prvchild);
						   }
					   },
					   
					   
					   /**
					    * This function does two task, delete the object from starting position from
					    * where the object was dragged, other task is delete the object which was done by
					    * user in real world(by press delete button), this all happened for replay  
					    * @param wbRep expects object which has 
					    * properties and methods for replay action 
					    * @param currUsrAction expect as string as 'delete' command
					    * @returns nothing
					    */
					   rmvObjFrmRE : function (wbRep, currUsrAction){
						   var rindex = whBoard.utility.isObjExistRE(wbRep.objs[wbRep.objNo]);
						   if(rindex >= 0 && wbRep.objs[wbRep.objNo].lastElement ==  true ){
								if(currUsrAction == 'delete'){
									wbRep.removeElements[rindex].active = true;
									var ctx = vcan.main.canvas.getContext('2d');
								}
								
								whBoard.canvas.removeObject(wbRep.removeElements[rindex]);
								wbRep.removeElements.splice(rindex, 1);
							}
					   },
					   
					   
					   /**
					    * This funciton add to the object to canvas to acheive replay effects
					    * @param wbRep param expects the obect which methods and properties 
					    * which are used to replay object eg: objs, objNo etc
					    * @param currUsrAction expects the stirng eg:- 'add', drag, delete
					    * @param currObjType eg:- rectangle, free draw  
					    * @returns nothing
					    */
					   addObjForRep : function (wbRep, currUsrAction, currObjType){
						   if(currObjType == 'freeDrawing' ){
			        			if(currUsrAction != 'delete'){
			        		        wbRep.prvchild = wbRep.objs[wbRep.objNo];
			        				wbRep.fdRender.dispDragPath(wbRep);
			        	        } 
                                if(wbRep.objs[wbRep.objNo+1] != undefined){
									 //replayTime =  wbRep.objs[wbRep.objNo+1].mdTime-wbRep.objs[wbRep.objNo].mdTime;
                                	 whBoard.replayTime = wbRep.objs[wbRep.objNo+1].mdTime-wbRep.objs[wbRep.objNo].mdTime;
								}
			        			wbRep.objNo++;
			        			
				        		if(typeof whBoard.replayTime == 'number' && whBoard.replayTime >= 0){
				        			if(wbRep.repMode == 'fromBrowser'){
				        				
				        				whBoard.replayTime = 0;
				        			}
			        				setTimeout(wbRep.renderObj, whBoard.replayTime);
			        			}
				    		}else{
			        			if(wbRep.objs[wbRep.objNo].func == 'add'){
                                   if(wbRep.objs[wbRep.objNo].hasOwnProperty('prvObj')){
                                	       
				        					//TODO this should be through the proper way
				        					//there should be chosen proper data structure
				        					//var stempid = wbRep.objs[wbRep.objNo].prvObj.prvObjId;
				        					for(var j=0; j<wbRep.objs.length; j++){
				        						// this is applied for text object only
				        						if((wbRep.objs[wbRep.objNo].prvObj.prvObjId == wbRep.objs[j].id && 
				        								wbRep.objs[wbRep.objNo].prvObj.x == wbRep.objs[j].x  &&  
				        								wbRep.objs[wbRep.objNo].prvObj.y == wbRep.objs[j].y)	
				        							){
				        							//alert('debugger');
				        							//debugger;
				        							whBoard.canvas.removeObject(wbRep.objs[j]);
				        							break;
				        						}
				        					}
				        					
				        				}
                                
			        			    var robj = whBoard.canvas.readyObject(wbRep.objs[wbRep.objNo], true);
								    whBoard.canvas.addObject(robj);
								    
								    if(whBoard.arrImgDraw == true){
								    	whBoard.utility.drawArrowImg(whBoard.arrImg, robj.coreObj);
						     		}
								    
								    
                                    if(wbRep.objs[wbRep.objNo+1] != undefined){
                                    	if(wbRep.objs[wbRep.objNo+1].type == 'freeDrawing'){
                                    		whBoard.replayTime =  whBoard.utility.stringToNumber(wbRep.objs[wbRep.objNo+1].path[0][3])-wbRep.objs[wbRep.objNo].mdTime;
                                    	}else{
                                    		whBoard.replayTime =  wbRep.objs[wbRep.objNo+1].mdTime-wbRep.objs[wbRep.objNo].mdTime;
                                    	}
                                    }
                                 
								 }
			        			 wbRep.prvchild = wbRep.objs[wbRep.objNo];
								 wbRep.objNo++;
								 
								 if(wbRep.repMode == 'fromBrowser'){
				        				whBoard.replayTime = 0;
			        			  }
								 setTimeout(wbRep.renderObj, whBoard.replayTime);
							}
			          },
					   
					   
					   /**
					    * Through this funciton the replay time of next object can be acheived
					    * @param allObjs expects array of object
					    * @param con expects current number of object 
					    * @returns replay time
					    * NOTE this function is not using right now
					    */
					   getRepTime : function (allObjs, con){
						   if(allObjs[con+1] != undefined){
							   whBoard.replayTime =  allObjs[con+1].mdTime-allObjs[con].mdTime;
								 return whBoard.replayTime; 
							}
					   },
					   
					   
					   /**
					    * This object has various methods thorugh which 
					    * The replay for free drawing is acheived
					    * This function don't have any properties but methods
					    */
					   fdRender : {
						   /**
						    * this function displays the each path that are used
						    * to create particular free hand drawing
						    * @param wbRep expects the whitebaord objects 
						    * @returns
						    */
						   fdReplay : function (wbRep){
							   
//							   if(wbRep.mtransform==true){
//							    	wbRep.rctx.beginPath();
//							    	 wbRep.rctx.save(); 
//							    	 vcan.transform(wbRep.rctx, wbRep.objs[wbRep.objNo]); //this should be called only once time
//							    	 wbRep.mtransform = false;
//							   }
							   
							      wbRep.fdObj = vcan.main.freeHandDrawing({borderColor: "green", lineWidth : 3});
							      wbRep.fdObj.init();
							       
							   if(wbRep.objNo < wbRep.objs.length && wbRep.objs[wbRep.objNo] != undefined){
								   if(wbRep.pn < wbRep.objs[wbRep.objNo].path.length){
										//wbRep.fdRender.dispSubPath(wbRep, wbRep.objNo, wbRep.pn);
									  // wbRep.ctx = whBoard.vcan.main.canvas.getContext('2d');
									   wbRep.fdRender.dispSubPath(); //NOTE this is changed during the unit testing
										
									}else{
										//wbRep.fdRender.getNextFreeDrawing(wbRep);
									}
							   }
						   },
						   
						   /***
						    * Free drawing has many path after created the free drawing
						    * When we want to display the that particular free drawing 
						    * we have to display all path that used to make free draw
						    * this function does the same work 
						    * @param wbRep expects which has properties and methods
						    * @param con expects current object number eg: 3/4/5
						    * @param pn expects current path(that give the contributes to make freedrawing) number eg: 2/3/4
						    * @returns nothing
						    */
						   dispSubPath : function (){
							   //alert('hi brother');
							   //alert('suman bogati ' + ++i);
							   var wbRep  = whBoard.replay;
							   var pn = wbRep.pn;
							   var con = wbRep.objNo;
							   
							   wbRep.ctx = whBoard.vcan.main.canvas.getContext('2d');
//							   var allObjs = wbRep.objs;
//							   current =  allObjs[con].path[pn];
//								l = -(allObjs[con].width / 2),
//						        t = -(allObjs[con].height / 2);
//								//allObjs[con].replay_render(ctx, current, l, t);
//						        
//						       
//						        allObjs[con].replay_render(wbRep.rctx, current, l, t);
						        
							  
							   
							   var allObjs = wbRep.objs;
							   current =  allObjs[con].path[pn];
								l = -(allObjs[con].width / 2),
						        t = -(allObjs[con].height / 2);
								
							   if(pn == 0){
								  // wbRep.ctx.save();
								   
								   wbRep.fdObj.fhdStart(wbRep.ctx, {'x':(current[1]+allObjs[con].minX), 'y' : (current[2]+allObjs[con].minY)});
								   //vcan.transform(wbRep.ctx]);
							   }else {
								   //alert('hello brother');
								   //debugger;
//								   console.log('x ' + current[0]);
//								   console.log('y ' + current[1]);
								   wbRep.fdObj.fhRendering({'x':(current[1]+allObjs[con].minX), 'y' : (current[2]+allObjs[con].minY)});
								   
								   
								 // allObjs[con].replay_render(ctx, current, l, t);
							   }
							   
							//   wbRep.ctx.restore();
							  // var obj = {};
							   //obj.mp = {x:current[1]+allObjs[con].minX, y:current[1]+allObjs[con].minY};
							   //whBoard.utility.drawArrowImg(whBoard.arrImg, obj);
							   
							   pmdTime = whBoard.utility.stringToNumber(allObjs[con].path[pn][3]);
								
								//console.log('subPath time ' + pmdTime);
								if(allObjs[con].path[pn+1] != undefined){
									pmdTimeNxt = whBoard.utility.stringToNumber(allObjs[con].path[pn+1][3]);
								}
								
								whBoard.replayTime = pmdTimeNxt - pmdTime;
								wbRep.pn++;
								//this is done during the unit testing
								if(whBoard.replayTime <= 0){
									//wbRep.ctx.closePath();
									//alert('hi brother');
									//debugger;
									//alert(vcan.main.id);
									var fid = wbRep.objs[wbRep.objNo].id;
									var fmdTime = wbRep.objs[wbRep.objNo].mdTime;
									
									whBoard.prvObj = wbRep.fdObj.finalizeDrawingPath(whBoard.canvas, wbRep.objs[wbRep.objNo]);
									
									
									whBoard.prvObj.id = fid;
									whBoard.prvObj.lastElement = true;
									whBoard.prvObj.mdTime =  fmdTime;
									//whBoard.prvObj.usrCurrAction = 'create';
									

									//whBoard.prvObj = "";
									
//									vcan.main.children.push(wbRep.objs[wbRep.objNo]);
//									alert('suman bogati');
//									debugger;
								//	vcan.main.children.push(wbRep.objs[wbRep.objNo]);
									//wbRep.ctx.restore();
									//get next free draw if there is into replayObjs stack
									
									/*
									 * 
									 * 	the structure for objAdd should be changed 
										var fdobj = new vcan.main.freeHandDrawing();
										fdobj.utility.objAdd(allObjs[con]);
										todo this should be removed from here
									*/
									//if(allObjs[con].usrCurrAction == 'create' && allObjs[con].lastElement == true){
									//	vcan.main.children.push(allObjs[con]);
									//}
									
//									alert('hi');
//									debugger;
									//vcan.main.children.push(wbRep.objs[wbRep.objNo]);
									//alert(typeof wbRep.objs[wbRep.objNo].setCoords);
									//wbRep.objs[wbRep.objNo].setCoords();
									
									//vcan.main.replayObjs[wbRep.objNo] = whBoard.prvObj;
									
									if(allObjs[con+1] != undefined){
										wbRep.fdRender.getNextFreeDrawing(wbRep);
									}
								}else{
									if(wbRep.repMode == 'fromBrowser'){
										
				        				whBoard.replayTime = 0;
				        			}
									setTimeout(function (){
										wbRep.fdRender.dispSubPath(wbRep);
									}, whBoard.replayTime);
								}
						   },
						   
						   
						   /**
						    * Through this funciton the next main free drawing is gettng 
						    * which have to replayed and get the time on which the object would display 
						    * @returns nothing
						    */
						   getNextFreeDrawing : function (wbRep){
							    wbRep.pn = 0 ;
								//vcan.main.children.push(wbRep.objs[wbRep.objNo]);
								
								if(wbRep.objs[wbRep.objNo].lastElement == true){
									wbRep.objs[wbRep.objNo].active = false;
							 		wbRep.removeElements.push(wbRep.objs[wbRep.objNo]);
							 	}
							
								wbRep.prvchild = wbRep.objs[wbRep.objNo];
								if(wbRep.objs[wbRep.objNo+1] != undefined){
									if(wbRep.objs[wbRep.objNo+1].type == 'freeDrawing'){
										
										whBoard.replayTime =  whBoard.utility.stringToNumber(wbRep.objs[wbRep.objNo+1].path[0][3]-wbRep.objs[wbRep.objNo].mdTime);
										
									}else{
										var pathObj = wbRep.objs[wbRep.objNo].path;
										whBoard.replayTime =  wbRep.objs[wbRep.objNo+1].mdTime - wbRep.objs[wbRep.objNo].mdTime;
									}
									wbRep.objNo++;
									
									if(wbRep.repMode == 'fromBrowser'){
										whBoard.replayTime = 0;
				        			}
									setTimeout(wbRep.renderObj, whBoard.replayTime);
								}
						   },
						   
						   /**
						    * By this funciton the drag affect of free drawing is achieved
						    * @param wbRep
						    * @returns
						    */
						   dispDragPath : function (wbRep){
							    wbRep.objs[wbRep.objNo].active = false;
							    var ctx = vcan.main.canvas.getContext('2d');
							//    wbRep.objs[wbRep.objNo].render(ctx);
							      //fdRender(ctx);
							      //fhdRender(ctx, wbRep.objs[wbRep.objNo]);
							      vcan.utility.fhdRender(ctx, wbRep.objs[wbRep.objNo]);
							   
							    // this whBoard.canvas.readyObject is called multi user only
							    // for single user this would not need
							    var tobj = whBoard.canvas.readyObject(wbRep.objs[wbRep.objNo]);
			        			vcan.main.children.push(tobj.coreObj);
			        			if(whBoard.arrImgDraw == true){
			        				whBoard.utility.drawArrowImg(whBoard.arrImg, tobj.coreObj);
					     		}
						   }
					   }
				  }
			}
		};
		
		
		/*
		 * This disabled feature can be used into future for replay for each action of each text and bulk of text 
		 * TODO this function should be merge with renderObj()
		 * will have to remove the variable as much as possible.
		 * 
		 
		var childTextNode =0; 
		var textCurrId = 0;
		var textNode = "";
		var prvTextNodeVal = "";
		var textNode ="";
		var addedText = [];
		
		function replayObjectText(){
			var ctx = vcan.main.canvas.getContext('2d');
			if(textCurrId == mainNode){
				ctx.fillStyle = "#ebf9fd";
				ctx.strokeStyle = "#09819f";
				
				var compObj = replayObjs[mainNode];
				
				ctx.rect(compObj.x, compObj.y, compObj.width, compObj.height);
				ctx.fill();
				ctx.stroke();
				
				textCurrId++;
				var divNode  = document.createElement('div');
				divNode.id = "box" + replayObjs[mainNode].id;
				
				divNode.style.position = 'absolute';
				//todo this should be enable
				//divNode.style.left = (vcan.main.offset.x+obj.x) + "px";
				//divNode.style.top =  (vcan.main.offset.y+obj.y) + "px";
				
				//console.log('x ' +compObj.x);
				//console.log('x ' +compObj.y);
				
				divNode.style.left = (vcan.main.offset.x+compObj.x) + "px";
				divNode.style.top =  (vcan.main.offset.y+compObj.y) + "px";
				
				
			    textNode = document.createElement('textarea');
				textNode.id = divNode.id+'textarea';
				textNode.rows = 14;
				textNode.cols = 37;
				
				divNode.appendChild(textNode);
				document.body.appendChild(divNode);
			}
			
			
			if(prevTextObj != " "){
				if(replayObjs[mainNode].textArr[childTextNode].func == 'create'){
				//	addedText.push(replayObjs[mainNode].textArr[childTextNode]);
					addedText.push(replayObjs[mainNode].textArr[childTextNode]);
					textNode.value = prvTextNodeVal+replayObjs[mainNode].textArr[childTextNode].value;
					prvTextNodeVal = textNode.value;
					
				}else if(replayObjs[mainNode].textArr[childTextNode].func == 'remove'){
					//debugger;
					
					for(var j=0; j<replayObjs[mainNode].textArr.length; j++){
						if(replayObjs[mainNode].textArr[j].id  == replayObjs[mainNode].textArr[childTextNode].id){
							for(k=0; k<addedText.length; k++){
								if(addedText[k].id == replayObjs[mainNode].textArr[j].id){
									addedText.splice(k, 1);
									//addedText[k].value = "";
									break;
								}
							}
							
							debugger;
							replayObjs[mainNode].textArr.splice(j, 1);
							//replayObjs[mainNode].textArr[j].push();
							
							
							
							//replayObjs[mainNode].textArr[j].value = "";
							//textNode.value = " " ; //delete the value when user want to remove the value
							//	childTextNode--;
							break;
						}
					}
					
					*/
					/*
					var afterRemove = ""
					for(var j=0; j<replayObjs[mainNode].textArr.length; j++){
						if(replayObjs[mainNode].textArr[j].func == 'create'){
							afterRemove += replayObjs[mainNode].textArr[j].value;
						}
					}
					
					textNode.value = afterRemove;*/
					/*
					var afterRemove = "";
					for(var i=0; i<addedText.length; i++){
						afterRemove += addedText[i].value;
					}
					
					textNode.value = afterRemove;
					
				}
			}
			
			
			//replayTime =
			var tempstuff = replayObjs[mainNode].textArr[childTextNode+1]; 
			
			if(replayObjs[mainNode].textArr[childTextNode+1] != undefined){
				  replayTime =  replayObjs[mainNode].textArr[childTextNode+1].mdTime-replayObjs[mainNode].textArr[childTextNode].mdTime;
			}
			
			
			prevTextObj =  replayObjs[mainNode];
			childTextNode++;
			
			
			if(childTextNode >= replayObjs[mainNode].textArr.length){
				//replayObjs[mainNode].text;
				var textPrvNode = document.getElementById('box' + replayObjs[mainNode].id);
					var sReplayNode = replayObjs[mainNode];
					textPrvNode.measure = {x:sReplayNode.x, y:sReplayNode.y, width:sReplayNode.width, height:sReplayNode.height};
				
					finalizeText(ctx, textPrvNode);	
					childTextNode = 0;
					//textCurrId++;
					mainNode++;
					prevTextObj = "";
					prvTextNodeVal ="";
					
			}
			setTimeout(replayObjectText, replayTime);
		}
		*/
		
		
		/**
		 * this class has methods by which the user can draw the particular object at different mouse event
		 * @param objType is the particular object type which has to be drawn
		 * @canvas canvas is the canvas element on which the object would be drawn 
		 * @thisobj is current tool object 
		 */
		whBoard.draw_object  = function(objType, canvas, thisobj){
			var tool = thisobj;
			thisobj.started = false;

			var startPosX;
			var startPosY;
			var endPosX;
			var endPosY;
			var chunkObj = [];
			
			
			/**
			 * This function sets up the situation for draw the particular object
			 * This function called when user selected particular tool eg:- rectangle, line and clicked over the canvas
			 * 
			 */
			tool.mousedown = function (ev) {
				var vcan = whBoard.vcan;
				if(typeof(Storage)!=="undefined"){
					//localStorage.repObjs = "";
				}
				
				startPosX = ev.currX;
				startPosY = ev.currY;
				
				var currState  = vcan.getStates('action');
				if(currState == 'create'){
					if(objType == 'text'){
						whBoard.obj.drawTextObj.textUtility(startPosX, startPosY);
					}
					if(objType != 'text'){
						var currTransformState = vcan.getStates('currentTransform');				
						if(currTransformState == ""  || currTransformState == null){
							tool.started = true;
						}
					}
				}
				
				if(objType == 'freeDrawing' && whBoard.obj.freeDrawObj.freesvg == true){
					whBoard.obj.freeDrawObj.drawStart(ev);
				}
			};
			
			
			//  This function is called every time you move the mouse. Obviously, it only 
			//  draws if the tool.started state is set to true (when you are holding down the mouse button).
			
			/**
			 * This function does create the particular object when user has already been
			 * started to draw, at the same time the function made the information eg: creation time about parituclar
			 * object and stored drawn object into replayObjs array   
			 * @param expects mousemove event
			 */
			tool.mousemove = function (ev) {
//			  var sumanbog = "suman";
			  if (tool.started) {
				  	if(whBoard.obj.freeDrawObj != undefined && whBoard.obj.freeDrawObj.freesvg == true){
					  	  if (whBoard.obj.freeDrawObj.fdObj.isCurrentlyDrawing) {
					  			whBoard.obj.freeDrawObj.wb_draw(ev);
					            return;
					      }
					 }else{
						    endPosX = ev.currX;
						  	endPosY = ev.currY;
						  	 if(whBoard.prvObj != ''){
						  		whBoard.canvas.removeObject(whBoard.prvObj);
						  	 }
						  	 
						  	 //var  currObject = whBoard.makeobj(whBoard.prvObj, startPosX, startPosY, endPosX, endPosY, objType);
						  	var  currObject = whBoard.makeobj(startPosX, startPosY, endPosX, endPosY, objType);
						  	 
						  	 var  currTime= new Date().getTime();
						  	 vcan.extend(currObject, {mdTime:currTime, func:'add'});
						  	 
						  	 var rCurrObject = whBoard.canvas.readyObject(currObject);
						  	 whBoard.canvas.addObject(rCurrObject);

						   //  currObject.usrCurrAction = 'create'; //IMPORTANT changed during UNIT TESTING
						  	rCurrObject.coreObj.usrCurrAction = 'create';

						  	vcan.main.replayObjs.push(rCurrObject.coreObj); //IMPORTANT changed during UNIT TESTING
						  	vm_chat.send({'repObj': [rCurrObject.coreObj]});
						  	
						  	if(vcan.main.replayObjs.length > 0){
						  		//localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);

						  		
//						  		localStorage.repObjs.push(JSON.stringify(rCurrObject.coreObj));
						  	}
						     
						     /**** 
					  		 *
					  		 * This would I have disbaled can be critical
					  		 * whBoard.replay.replayObjs.push(currObject);
					  		 *
					  		 ****/
						     //whBoard.repObj.replayObjs.push(currObject);
						     
						     //whBoard.prvObj = currObject; //IMPORTANT changed during UNIT TESTING
						  	   whBoard.prvObj = rCurrObject.coreObj;
						     
					 }
			   }else{
				   if(whBoard.vcan.main.action !=  'move' || ((vcan.main.currentTransform =="" || vcan.main.currentTransform ==null) && whBoard.vcan.main.action == "move")){
					   vm_chat.send({'createArrow': true, x:ev.currX, y: ev.currY});
				   } 
				   
//				   if(obj.currentTransform.target.downObj == false){
//					   vm_chat.send({'createArrow': whBoard.arrImg, x:ev.currX, y: ev.currY});
//				   }
			   }
		};

		

			/**
			 *  This function does finalize the object 
			 *  with last made object very specail
			 */
			tool.mouseup = function (ev) {
				if (tool.started && objType != 'text') {
					//this is used for free hand drawing
					tool.mousemove(ev);
					//if(vcan.main.freesvg == true ){
					if((whBoard.obj.freeDrawObj != undefined &&  whBoard.obj.freeDrawObj.freesvg == true )){
						// if (freeDrawObj.isDrawingMode && vcan.main.freeDraw.isCurrentlyDrawing) {
						 if (whBoard.obj.freeDrawObj.fdObj.isCurrentlyDrawing) {
							 whBoard.obj.freeDrawObj.finalizeDraw(ev);
						  }
					 }
					
					 if(whBoard.prvObj != ''){
						 //TODO for set the value to property of object need to proper function from frame work 
						 whBoard.prvObj.lastElement = true; 
						// whBoard.prvObj = ""; //this should be into proper way
					 }
					 
					var replayObjs = vcan.getStates('replayObjs');
					//todo this should be enable when white board used for multi user
					// alert('suman bogati');
					 //debugger;
					
					//alert(whBoard.prvObj);
					//debugger;
					 
					 if(whBoard.prvObj.type == 'freeDrawing'){
						 //alert('sss');
						 vm_chat.send({'repObj': [whBoard.prvObj]});
					 }
					 
					 if(whBoard.sentPackets > 0) {
						 //document.getElementById(whBoard.sentPackDiv).innerHTML = whBoard.sentPackets;
					 }
					 
					 whBoard.prvObj = "";
					 
					 
					// vm_chat.send({'repObj': [whBoard.prvObj]});
					
					//for display chunk of object to multi user
					//it's started and when the object is creatd and empty when 
					//the mouse is up
					chunkObj = []; 
					tool.started = false;
			  }
				
			  if(whBoard.vcan.wb.sentPack == true) {
				  if(whBoard.sentPackets > 0) {
						 document.getElementById(whBoard.sentPackDiv).innerHTML = whBoard.sentPackets;
				 }
				 whBoard.vcan.wb.sentPack = false;
			  }
		  };
	}

		/**
		 * this class initializes the functions 
		 * thorugh which the free hand object is drawn
		 */
		//NOTE:- have changed during the unit testing
		whBoard.readyFreeHandObj = function (borderColor, lineWidth){
			return {
				
				/**
				 * this function does intialize the value which is required for drawing the object 
				 * @returns nothing
				 */
				
				init : function (){
					this.freesvg = true;
					this.fdObj = {}; 
					this.borderColor = borderColor;
					this.freeDrawingLineWidth = lineWidth;
				},
				
				
				/**
				 * this function does setup the drawing object fdObj for free drawing 
				 * it is called when user click on canvas
				 * It expects mouse down event
				 * @returns nothing
				 */
				
				drawStart : function (ev){
					var vcan = whBoard.vcan;
						//if(vcan.main.freesvg == true){
					   if(whBoard.obj.freeDrawObj.freesvg == true){
							  var ctx = vcan.main.canvas.getContext('2d');
						  	//  borderColor = "red";
							  //this.fdObj = vcan.main.freeHandDrawing(ev, {borderColor: borderColor});
						  	  this.fdObj = vcan.main.freeHandDrawing({borderColor: this.borderColor, lineWidth : this.freeDrawingLineWidth});
						  	  this.fdObj.init();
							  pointer = vcan.utility.getReltivePoint(ev);
							  
							  this.fdObj.fhdStart(ctx, pointer);
							  return;
					     //}
					}
				},
				
				
				/**
				 * this function calls the function through 
				 * which the free hand draw object is drawn as user move the mouse 
				 * @param ev expects the mouse move event
				 * @returns nothing
				 */
				wb_draw : function (ev){
					//whBoard.prvObj = this.fdObj.fhRendering(ev);
					var pointer = vcan.utility.getReltivePoint(ev);
					//important have done during the UNIT TESTING
					//whBoard.prvObj = this.fdObj.fhRendering(pointer);
					
					this.fdObj.fhRendering(pointer);
					
				},
				
				finalizeDraw : function (ev){
					//alert('sumanbogati');
					//debugger;
					//alert('mukesh khanna');
					//alert('suman bogati');
					var vcan = whBoard.vcan;
					//TODO this(finalizeDrawingPath) should be called over the object 
					//prvObj =  vcan.main.freeDraw.finalizeDrawingPath();
					
//					var ptr = vcan.utility.getReltivePoint(ev);
//					this.mp = {};
//					this.mp.x = ptr.x;
//					this.mp.y = ptr.y;

					
					whBoard.prvObj =  this.fdObj.finalizeDrawingPath(whBoard.canvas);

					
					//alert('suman bogati');
					//debugger
					
					//var currTime = whBoard.utility.stringToNumber(whBoard.prvObj.path[0][3]);
					
					var currTime = whBoard.utility.stringToNumber(whBoard.prvObj.path[whBoard.prvObj.path.length-1][3]);
					var tempObj =  vcan.extend({}, whBoard.prvObj);
					
					whBoard.prvObj = vcan.extend(tempObj, {mdTime:currTime, func:'add', usrCurrAction : 'create'});
					//alert("khanna");
					//debugger;
//					whBoard.prvObj.mp = {};
//					whBoard.prvObj.mp.x = tempObj.x;
//					whBoard.prvObj.mp.y = tempObj.y;
					
					var lastChild = vcan.main.children[vcan.main.children.length-1];
					
					lastChild.mdTime =  whBoard.utility.stringToNumber(whBoard.prvObj.path[whBoard.prvObj.path.length-1][3]);
					vcan.main.replayObjs.push(whBoard.prvObj);
					
					//localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
					
					//todo this should be enable when white board used for multi user
					//var myres = [whBoard.prvObj];
					//alert('suman');
					//debugger;
					
					//console.log('fdId ' + whBoard.prvObj.id);
					//vm_chat.send({'repObj': [whBoard.prvObj]});
			  		
			  		/**** 
			  		 *
			  		 * This would I have disbaled can be critical
			  		 * whBoard.repObj.replayObjs.push(whBoard.prvObj);
			  		 *
			  		 ****/
			  		
				}
			};
		}
		
		
		/**
		 * this function makes the properties for particular object like start and end point for line, width,height,x,y made for rectangle
		 *	@param startPosX for starts horizontal position for start point
		 *  @param startPosY for starts vertical position for start point
		 *  @param endPosX for starts horizontal position for end point
		 *  @param endtPosY for starts vertical position for end point
		 *  @param objType particular ocanvas object type eg:- rectangle, oval etc
		 *  returns the object wrapped along with the properties  
		 */
		whBoard.makeobj = function(startPosX, startPosY, endPosX, endPosY, objType){
			//console.log('startPos ' + startPosX + ' ' + startPosY  + '/' + 'endPos ' + endPosX + ' ' + endPosY);
			//console.log('endPos ' + endPosX + ' ' + endPosY);
			var obj = {};
			 obj.mp = {};
			 obj.mp.x = endPosX;
			 obj.mp.y = endPosY;
			//below code have been daibled during the unit testing
			//if(whBoard.prvObj != " "){
			//	if(typeof whBoard.prvObj == "object"){
				if(startPosX > endPosX ){
					//this is not using for oval
					//TODO will have to look for other object that is it need or not
					var temp_endPosX = endPosX;
					var temp_endPosY = endPosY;
					 endPosX = startPosX;
					 endPosY = startPosY;
					 startPosX =  temp_endPosX;
					 startPosY =  temp_endPosY;
					 obj.dRoad = 'b2t';
				}else{
					obj.dRoad = 't2b';
				}
	//		}
			
			obj.type = objType;
			
			if(objType == 'rectangle' || objType == 'triangle'){
				obj.sx = startPosX;
				obj.sy = startPosY;
				obj.ex = endPosX;
				obj.ey = endPosY;
			}
			
			if (objType == 'line'){	
				obj.lineColor = "navy";
				obj.lineWidth = 3;
				obj.start = {x:startPosX, y:startPosY};
				obj.end = {x:endPosX, y:endPosY};
				
			}else if(objType == 'rectangle'){
				obj.width = endPosX-startPosX;
				obj.height =  endPosY-startPosY;
				
				obj.borderColor = 'green';
				obj.fillColor = "#ddd";
				obj.lineWidth = 3;
				
			}else if(objType == 'oval'){
				obj.lineWidth = 3;
				obj.borderColor = 'red';
				
				obj.width =   endPosX-startPosX;
				obj.height =  endPosY-startPosY;
				
				obj.x =  endPosX - (obj.width / 2);
				obj.y = endPosY - (obj.height / 2);
				
				obj.rx = (obj.width/2);
				obj.ry = (obj.height/2);
			   
			}else if(objType == 'triangle'){
				obj.lineWidth = 3;
				obj.borderColor = 'blue';
			}else if(objType == 'text'){
				return;
			}
			return obj;
		}
		
		/***
		 * 	
		 * This class is all about creating text in the canvas
		 *  it creates the wrapper(textarea) for containg the text as user clicked on canvas
		 *  it creates the text as user typed into the textarea and click outside that text
		 */
		whBoard.cText = function(){
			return {
					init : function (boxCont){
						//this.textId =  0;
						this.prevTextObj = "";
						this.currTextObjWrapper = "";
						this.keyTyped = []; //the key typed by user this is used into finalizeText()
						this.currObject = {};
						this.prvModTextObj = {};
						this.prvCurrTransform = {};
						this.textWriteMode = 0;
						this.totalBox = 0;
						this.boxContainer = boxCont;
					},
					
					
					/**
					 * 
					 * This function handles all the functionality of text object
					 * Eg: created the text wrapper for creating text, create text, create the text with older one
					 * @param startPosX points out the x co-ordination of canvas after clicked by user
					 * @param startPosY points out the y co-ordination of canvas after clicked by user
					 * @returns nothing
					 */
					textUtility : function (startPosX, startPosY){
						var vcan = whBoard.vcan;
						var ctx = vcan.main.canvas.getContext('2d');
						var obj = {};
						this.textWriteMode++;
						this.wmode = true;
						
						if(vcan.main.currentTransform != undefined && vcan.main.currentTransform != ''){
								 this.currObject = vcan.main.currentTransform.target;
							     if(this.currObject != undefined && this.currObject.type == 'text'){
										obj = {width:300, height: 100 , x: this.currObject['oCoords'].tl.x, y: this.currObject['oCoords'].tl.y, text:this.currObject.text};
										if(!whBoard.utility.clickOutSidebox(this.textWriteMode)){
											//whBoard.obj.drawTextObj.drawTextBoxWrapper(ctx, obj,  this.currObject.id);
											whBoard.obj.drawTextObj.drawTextBoxWrapper(obj,  this.currObject.id);
										}
										vcan.main.currentTransform = "";
							     }
							
					     		if(whBoard.utility.clickOutSidebox(this.textWriteMode)){
					     			whBoard.obj.drawTextObj.renderText(this.prvCurrTransform, this.prvModTextObj, ctx);
								}
									
								if(this.currObject != undefined && this.currObject.type == 'text'){
									
									//the height and width shoudl be dyanamic
									obj = {width:300, height: 100 , x: this.currObject['oCoords'].tl.x, y: this.currObject['oCoords'].tl.y, text:this.currObject.text};
										this.prvModTextObj = {prvObjId : this.currObject.id, prvText : this.currObject.text, x : this.currObject.x,  y:this.currObject.y};
										this.prvTextObj = this.currObject;
								}	
								this.prvCurrTransform = this.currObject;

						}else{
							if (whBoard.utility.clickOutSidebox(this.textWriteMode)){
									//alert('suman bogati khan');
									whBoard.obj.drawTextObj.renderText(this.currObject, this.prvModTextObj, ctx);
								}else{
									this.totalBox++;
									var obj = {x:startPosX,  y:startPosY, width:300, height : 100};
									//whBoard.obj.drawTextObj.drawTextBoxWrapper(ctx, obj,  this.totalBox);
									whBoard.obj.drawTextObj.drawTextBoxWrapper(obj,  this.totalBox);
							}
		
						}
						
					},
					
					
					
					/**
					 * It draws the textarea wrapper for draw the text inside it
					 * @param ctx the canvas's context on which the box is being drawn
					 * @param obj contains the information about contianer for example x, y, 
					 * width and height, the object contains the text also if it available
					 * @param boxNumber the number of box till now created
					 * @returns nothing
					 */
					
					//drawTextBoxWrapper : function (ctx, obj, boxNumber){
					drawTextBoxWrapper : function (obj, boxNumber){
						var vcan = whBoard.vcan;
						var divNode  = document.createElement('div');
						divNode.id = "box" + boxNumber;
						
						divNode.style.position = 'absolute';
						divNode.style.left = (vcan.main.offset.x+obj.x) + "px";
						divNode.style.top =  (vcan.main.offset.y+obj.y) + "px";
						
						var textNode = document.createElement('textarea');
						textNode.id = divNode.id+'textarea';
						textNode.rows = 8;
						textNode.cols = 41;
						if(obj.text != undefined && obj.text != ''){
							textNode.value = obj.text; 
						}
						
						divNode.appendChild(textNode);
						
						//document.body.appendChild(divNode);
						//TODO canvas
						document.getElementById(this.boxContainer).appendChild(divNode);
						
						this.prevTextObj = divNode;
						this.currTextObjWrapper =  obj;
					//	this.prevTextObj.measure = {};
						this.prevTextObj.measure = obj
					},
				
					
					
					/**
					 * The function renders the text after typed by user into textarea
					 * It removes the older text object on which user would clicked for udate the text
					 * @param currObject is the object which is ready to be printed
					 * @param prvModTextObj
					 * @param ctx is the current canvas context
					 * @returns nothing
					 */
					renderText : function (currObject, prvModTextObj, ctx){
						var vcan = whBoard.vcan;
						if(this.prevTextObj != '' ){
							
						//	var myVal = isObjEmpty(currObject);
							if(!whBoard.utility.IsObjEmpty(currObject)){
								for(var i=0; i<vcan.main.children.length; i++){
									if(currObject.id == vcan.main.children[i].id){
										vcan.main.children.splice(i, 1);
										this.currObject = "";
										break;
									}
								}
							}
							
							if(!whBoard.utility.IsObjEmpty(currObject)){
								this.finalizeText(ctx, this.prevTextObj,  prvModTextObj);
							}else{
								this.finalizeText(ctx, this.prevTextObj);
							}
							
							whBoard.obj.drawTextObj.wmode = false;
						}
					},
					
					
					/**
					 * This function actually draws the text of passed wrapper for textarea
					 * @param ctx the conext on which the text is drawing
					 * @param txtWrapper The text wrapper which has text and it's wrapper to be drawn 
					 * @param prvModObj if text wrapper has previous text eg 'vidya' new one is vidymantra 
					 * then prvModObj contains the vidya other info x, y 
					 * @returns nothing
					 */
					finalizeText : function (ctx, txtWrapper, prvModObj){
							var vcan = whBoard.vcan;
							var prvNode = document.getElementById(txtWrapper.id); 
							var userText = "";
							var textarea = prvNode.getElementsByTagName('textarea');
							for(var i =0; i< textarea.length; i++){
								if(textarea[i].id == prvNode.id+'textarea'){
									 userText =textarea[i].value;
									break;
								}
							}
							
							var fontSize = 20;
							ctx.font = fontSize +'px Times New Roman';
							var maxWidth = 0;
							var tempUserTextArr =  userText.split(/\r?\n/);
							maxWidth = ctx.measureText(tempUserTextArr[0]).width;
							var extHeight = 15; //TODO this should be changed according to font size by selected user
							for(var i=1; i<tempUserTextArr.length; i++){
								extHeight += 15;
								var tempMaxWidth = ctx.measureText(tempUserTextArr[i]).width;
								if(tempMaxWidth > maxWidth){
									maxWidth = tempMaxWidth;
								}
							}
							
							var textHalfWidth = maxWidth/2;
							
							//textObj.mp = {}; //this is used for contains mouse pointer
							
							var textObj = {
									type : 'text',
									text : userText, 
									x : txtWrapper.measure.x+textHalfWidth,
									y : txtWrapper.measure.y+extHeight,
									fontSize:fontSize,
									fontWidth : ctx.measureText(userText).width,
									textArr : this.keyTyped, //this should add after called the function canvas.addObject(text)
									mp : {x : txtWrapper.measure.x, y:txtWrapper.measure.y}
							};
							
						   var text = whBoard.canvas.readyObject(textObj);
						   var tempObj = text.coreObj;
						  
						   whBoard.canvas.addObject(text);
						   tempObj = vcan.extend({}, tempObj);
						   text = vcan.extend(tempObj, {textArr : this.keyTyped});
						   
						   	var  currTime= new Date().getTime();
						   
						   	text = vcan.extend(tempObj, {textArr : this.keyTyped, mdTime:currTime, func:'add', usrCurrAction : 'create', lastElement:true });
						   	
						   	//TODO prvModObj that should be check through hasOwnProperty method
						   	
					  		if(prvModObj != undefined){
								if(prvModObj != ''){
									text = vcan.extend(tempObj, {textArr : this.keyTyped, mdTime:currTime, func:'add', usrCurrAction : 'create', lastElement:true, 
										prvObj : prvModObj, pt : whBoard.obj.drawTextObj.prvTextObj});
									
								}
								
							}
					  		
					  		var tarr = [];
//					  		if(whBoard.obj.drawTextObj.prvTextObj != undefined){
//					  			whBoard.obj.drawTextObj.prvTextObj.pt = true;
//					  			tarr.push(whBoard.obj.drawTextObj.prvTextObj);
//					  		}
				  			
					  		
					  		
					  		var lastTxtObj = vcan.main.children[vcan.main.children.length-1];
					  		lastTxtObj.mdTime = currTime;
						    vcan.main.replayObjs.push(text); //TODO this should be done with secure way
						    
						    //localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
						  	
							this.keyTyped = [];  
							prvNode.parentNode.removeChild(txtWrapper);
							
							vcan.renderAll();
							tarr.push(text);
							
							//vm_chat.send({'repObj': tarr});
							vm_chat.send({'repObj': tarr});
							
							//TODO this statement is using at 3 place 
							// this should be achieve thorugh one function
							if(whBoard.sentPackets > 0) {
								 document.getElementById(whBoard.sentPackDiv).innerHTML = whBoard.sentPackets;
							}
							
					}
			  }
		}
		
		 function functionReplacer (key, value) {
	        if (typeof(value) === 'function') {
	            return value.toString();
	        }
	        return value;
	    } 
	    
	     function functionReviver(key, value) {
			  if (value && typeof value === "string" && value.substr(0,8) == "function") {
		            var startBody = value.indexOf('{') + 1;
		            var endBody = value.lastIndexOf('}');
		            var startArgs = value.indexOf('(') + 1;
		            var endArgs = value.indexOf(')');
		
		           return new Function(value.substring(startArgs, endArgs) , value.substring(startBody, endBody));
		           
		         //  return eval(myfunc);
		
		     }
		
		     return value;
	    }
		window.whBoard = whBoard;
})(window, document);
