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
			uid : 0,
			lt : '',
			commandToolsWrapperId : 'commandToolsWrapper',
			//these are top level object
			error : [],
			view : {}, // For display important message to user
			lang : {},
			system: {},
			
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
					
//					if(localStorage.sentPackets){
//						var totSentPackets = JSON.parse(localStorage.sentPackets);
//						whBoard.sentPackets = totSentPackets;
//						document.getElementById(whBoard.sentPackDiv).innerHTML = totSentPackets;
//					}
//					
//					if(localStorage.receivedPackets){
//						whBoard.receivedPackets = JSON.parse(localStorage.receivedPackets);
//						document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
//	    			}
					
					//whBoard.utility.initStoredPacketsNumbers();
					window.whBoard = whBoard;
				}
				//init the video
//				var myVideo = new vcan.videoChat();
//				myVideo.init();
				this.arrowInit();
				var oldData = whBoard.sentPackets;
				setInterval(function (){
					if(document.getElementById(whBoard.sentPackDivPS) != null){
						oldData = whBoard.utility.calcPsSentPackets(oldData);
						document.getElementById(whBoard.sentPackDiv).innerHTML = whBoard.sentPackets;  //update total packets
					}
					
					
				}, 1000);
				
			},
			
			/**
			 * this function called the image function
			 * for initialize the arrow
			 */
			arrowInit : function(){
				this.arrImg = new Image();
				this.arrImg.src = 'arrow.png';
				this.arrImgDraw = false; 
				var wb = this;
			    this.arrImg.onload = function() {
			    	wb.arrImgDraw = true;
			    };
			},
			
			/**
			 * this function does create the command interface  
			 */
			createCommand : function (){
				var cmdToolsWrapper  = document.createElement('div');
					//cmdToolsWrapper.id = 'commandToolsWrapper';
					cmdToolsWrapper.id	=  whBoard.commandToolsWrapperId;
					
					var canvasElem = document.getElementById(vcan.canvasWrapperId);
				
					if (canvasElem != null) {
						document.getElementById('containerWb').insertBefore(cmdToolsWrapper, canvasElem);
					}else{
						document.getElementById('containerWb').appendChild(cmdToolsWrapper);
					}
				//	document.getElementById('containerWb').appendChild(cmdToolsWrapper);
					
					whBoard.createDiv('t_line', 'line', cmdToolsWrapper);
					whBoard.createDiv('t_rectangle', 'rectangle', cmdToolsWrapper);
					whBoard.createDiv('t_freeDrawing', 'freeDrawing', cmdToolsWrapper);
					whBoard.createDiv('t_oval', 'oval', cmdToolsWrapper);
					whBoard.createDiv('t_triangle', 'triangle', cmdToolsWrapper);
					whBoard.createDiv('t_text', 'text', cmdToolsWrapper);
					whBoard.createDiv('t_replay', 'replay', cmdToolsWrapper);
					whBoard.createDiv('t_activeall', 'activeAll', cmdToolsWrapper);
					whBoard.createDiv('t_clearall', 'clearAll', cmdToolsWrapper);
					
					
					//var	cmdToolsWrapper2  = document.createElement('div');
					//cmdToolsWrapper.id = 'commandToolsWrapper2';
					
					whBoard.createDiv('t_assign', 'assign', cmdToolsWrapper, 'controlCmd');
					
					whBoard.createDiv('t_connectionoff', 'connectionOff', cmdToolsWrapper, 'controlCmd');
					whBoard.createDiv('t_connectionon', 'connectionOn', cmdToolsWrapper, 'controlCmd');
//					var parentWrapper = document.createElement('div');
//					vcan.wrapperPar.id = 'cmdParent';
//					parentWrapper.appendChild(cmdToolsWrapper);
			},
			
			/**
			 * this function does create the div
			 * toolId expect id for command
			 * text expects the text used for particular command
			 */
			createDiv : function (toolId, text, cmdToolsWrapper, cmdClass){
					var ancTag = document.createElement('a');
					ancTag.href = '#';
				
					var lDiv = document.createElement('div');
					lDiv.id = toolId;
					if(typeof cmdClass != 'undefined'){
						lDiv.className = cmdClass;
					}
					
					
					var imgTag = document.createElement('img');
					imgTag.alt = whBoard.lang.getString(text);
					imgTag.title = whBoard.lang.getString(text);
					imgTag.src = 'images/'+text+".png";
					
					ancTag.appendChild(imgTag); 
					//ancTag.innerHTML = text;
//					ancTag.title = text;
//					ancTag.innerHTML = text;
					
					lDiv.appendChild(ancTag);
					
					cmdToolsWrapper.appendChild(lDiv);
					//debugger;
					var canvasElem = document.getElementById(vcan.canvasWrapperId);
					//canvasElem = null;
//					if (canvasElem != null) {
//						document.getElementById('containerWb').inerstBefore(cmdToolsWrapper, canvasElem);
//					}else{
//						document.getElementById('containerWb').appendChild(cmdToolsWrapper);
//					}
					
				
					
			},
			
			/**
			 * this funciton does create the canvas
			 */
			createCanvas : function (){
				var cmdToolsWrapper  = document.createElement('div');
				//cmdToolsWrapper.id = 'canvasWrapper';
				cmdToolsWrapper.id =  vcan.canvasWrapperId;
				vcan.canvasWrapperId = cmdToolsWrapper.id; 
				var canvas = document.createElement('canvas');
					canvas.id = 'canvas';
					canvas.innerHTML = 'Canvas is missing in your browsers. Please update the latest version of your browser';
					cmdToolsWrapper.appendChild(canvas);
					document.getElementById('containerWb').appendChild(cmdToolsWrapper);
			},
			
			
//			crtPakCont : function (){
//				var packCont  = document.createElement('div');
//					packCont.id = 'sendPackCont';
//				
//					document.getElementById('canvasWrapper').appendChild(packCont);
//					
//					//creating div for sending packet per second
//					var sendPacketPS =  document.createElement('div');
//					sendPacketPS.id = 'sendPackPsCont'; 
//				    packCont.appendChild(sendPacketPS);
//					
//					label = document.createElement('label'); 
//					label.innerHTML = "Per second sent packets";
//					sendPacketPS.appendChild(label);
//					
//					counterDiv = document.createElement('div');
//					counterDiv.id = whBoard.sentPackDivPS;
//					counterDiv.className = 'numbers';
//					counterDiv.innerHTML = 0;
//					sendPacketPS.appendChild(counterDiv);
//					
//					
//					//creating div for send total packet per second
//					var totSendPacket =  document.createElement('div');
//				    totSendPacket.id = 'totSendPackCont'; 
//				    packCont.appendChild(totSendPacket);
//				    
//					
//					var label = document.createElement('label'); 
//						label.innerHTML = "Total Sent Packets";
//						totSendPacket.appendChild(label);
//						
//						var counterDiv = document.createElement('div');
//						counterDiv.id = whBoard.sentPackDiv;
//						counterDiv.className = 'numbers';
//						counterDiv.innerHTML = 0;
//						totSendPacket.appendChild(counterDiv);
//					
//					
////					//TODO below and above statement can be achieved by single funciton
////					packCont  = document.createElement('div');
////					packCont.id = 'receivePackCont';
////					packCont.innerHTML = "Total Received Packets";
////					document.getElementById('canvasWrapper').appendChild(packCont);
////					
////					counterDiv = document.createElement('div');
////					counterDiv.id = 'receivedNumber';
////					counterDiv.className = 'numbers';
////					counterDiv.innerHTML = 0;
////					packCont.appendChild(counterDiv);
//					
//					
//					//hello
//					 packCont  = document.createElement('div');
//					packCont.id = 'receivePackCont';
//				
//					document.getElementById('canvasWrapper').appendChild(packCont);
//					
//					//creating div for sending packet per second
//					var receivePacketPS =  document.createElement('div');
//					receivePacketPS.id = 'receivePackPsCont'; 
//				    packCont.appendChild(receivePacketPS);
//					
//					label = document.createElement('label'); 
//					label.innerHTML = "Per second received packets";
//					receivePacketPS.appendChild(label);
//					
//					counterDiv = document.createElement('div');
//					counterDiv.id = whBoard.receivedPackDivPS;
//					counterDiv.className = 'numbers';
//					counterDiv.innerHTML = 0;
//					receivePacketPS.appendChild(counterDiv);
//					
//					
//					//creating div for send total packet per second
//					var totReceivedPack =  document.createElement('div');
//						totReceivedPack.id = 'totReceivedPackCont'; 
//						packCont.appendChild(totReceivedPack);
//				    
//					
//					var label = document.createElement('label'); 
//						label.innerHTML = "Total Received Packets";
//						totReceivedPack.appendChild(label);
//						
//						counterDiv = document.createElement('div');
//						counterDiv.id = whBoard.receivedPackDiv;
//						counterDiv.className = 'numbers';
//						counterDiv.innerHTML = 0;
//						totReceivedPack.appendChild(counterDiv);
//					
//			},
			
			
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
				
				/*
				var anchorNode = evt.originalTarget;
				if(evt.originalTarget == undefined){
					anchorNode = evt.target; //for chrome and safari
				} 
				* after input the image tag
				* */
				
				var anchorNode = this;
				
				/**important **/
				
				if(anchorNode.parentNode.id == 't_replay'){
					whBoard.utility.clearAll(false);
					vm_chat.send({'replayAll' :  true});
				}else{
					whBoard.toolInit(anchorNode.parentNode.id);
				}
				
//				if(anchorNode.parentNode.id == 't_replay'){
//					whBoard.utility.clearAll(false);
//					
//				}	
				//multiuser handle to id of created object
				// this function expexted three paramters
				//whBoard.toolInit(anchorNode.parentNode.id, 'multiuser');
				//whBoard.toolInit(anchorNode.parentNode.id);
				
//				if(anchorNode.parentNode.id != 't_replay' && anchorNode.parentNode.id  != 't_clearall' 
//					  && anchorNode.parentNode.id != 't_reclaim' && anchorNode.parentNode.id != 't_assign'){
			
				if(anchorNode.parentNode.id != 't_replay' && anchorNode.parentNode.id  != 't_clearall' 
					  && anchorNode.parentNode.id != 't_reclaim' && anchorNode.parentNode.id != 't_assign' 
						  && anchorNode.parentNode.id != 't_connectionoff' && anchorNode.parentNode.id != 't_connectionon'){
			
					var currTime = new Date().getTime();
					//var obj = {'cmd':anchorNode.parentNode.id, mdTime : currTime};
					whBoard.lt = anchorNode.parentNode.id;
					var obj = {'cmd':anchorNode.parentNode.id, mt : currTime};
					whBoard.uid++;
					console.log('uid ' + ' ' + whBoard.uid);
					obj.uid =whBoard.uid; 
					vcan.main.replayObjs.push(obj);
					vm_chat.send({'repObj': [obj]}); //after optimized
				}
					
			},
			
			
			/**
			 * 
			 * This function does attach the handlers by click the particular object
			 * would be triggered eg:- if user click on rectangle link then rectangle
			 * object would triggered for create the rectangle object
			 * @param id expects the  id of container which contains all the commands of div
			 */
			attachToolFunction : function(id, alreadyCreated){
				//console.log('suman bogati my name');
				vcan.canvasWrapperId = 'canvasWrapper';
				whBoard.createCommand(alreadyCreated);
				if(typeof alreadyCreated == 'undefined'){
					whBoard.createCanvas();
					//	whBoard.createPacketContainer();
					// whBoard.createPacketInfoContainer();
					var orginalTeacherId = vcan.chkValueInLocalStorage('orginalTeacherId');
			    	if(orginalTeacherId){
			    		whBoard.createPacketContainer();
						whBoard.createPacketInfoContainer();
						whBoard.utility.initStoredPacketsNumbers();
			    	}
				}
				
				
				var allDivs = document.getElementById(id).getElementsByTagName('div');
				for(var i=0; i<allDivs.length; i++){
					
					//TODO this will have to be fixed as it always assigned t_clearall
					//whBoard.currComId = allDivs[i].id; 
					//allDivs[i].getElementsByTagName('a')[0].addEventListener('click', whBoard.objInit, true);
					//IMPORTANT this is changed during the UNIT testing
					
					//allDivs[i].getElementsByTagName('a')[0].onclick = whBoard.objInit;
					allDivs[i].getElementsByTagName('a')[0].addEventListener('click', whBoard.objInit);
					//allDivs[i].getElementsByTagName('a')[0].addEventListener('mouseover', whBoard.view.dispToolTip);

				}
			},
			
			/**
			 * By this method the particular function would be initialize
			 * eg: if the user click on replay button then  the 'replay' function would initialize   
			 * @param cmd expects the particular command from user
			 * 
			 */
			toolInit : function (cmd, repMode, multiuser, myfunc){
				if(typeof whBoard.obj.drawTextObj == 'object' && whBoard.obj.drawTextObj.wmode == true){
					var ctx = vcan.main.canvas.getContext('2d');
					//disable of this code can be crtical
//					whBoard.obj.drawTextObj.renderText(whBoard.obj.drawTextObj.currObject, whBoard.obj.drawTextObj.prvModTextObj, ctx);
//					whBoard.obj.drawTextObj.wmode = false;
				}
				

				var allChilds = whBoard.vcan.getStates('children');
				
				//added after raised by bugs
				if(allChilds.length > 0 && cmd != 't_clearall'){
				//	if(typeof multiuser == 'undefined' || cmd != 't_replay'){
					if(typeof multiuser == 'undefined' || cmd != 't_replay'){
						whBoard.utility.deActiveFrmDragDrop(); //after optimization NOTE:- this should have to be enable
					}
					if(multiuser != true && cmd != 't_replay'){
						whBoard.vcan.renderAll();
					}
					//whBoard.vcan.renderAll();
				}
				if(!whBoard.utility.IsObjEmpty(whBoard.obj.freeDrawObj && multiuser == false)){
					whBoard.obj.freeDrawObj.freesvg = false;
				}
				
				whBoard.vcan.main.currUserCommand = cmd+'Init'; 
				
				if(cmd == 't_activeall'){
					whBoard.utility.t_activeallInit();
				}
				
				
				if(cmd == 't_replay'){
					if(typeof multiuser == 'undefined'){
						vcan.setValInMain('id', 0);
					}
					if(typeof myfunc !=  'undefined'){
						whBoard.t_replayInit(repMode, myfunc);
					}else{
						whBoard.t_replayInit(repMode);
					}
					
					/* disable of this code can be critical
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
 					 }*/
				}
				
				
				if(cmd == 't_clearall'){
					//whBoard.utility.t_clearallInit();
					
				}
				if(cmd == 't_clearall'){
						whBoard.utility.t_clearallInit();
						/*
						if(typeof localStorage.teacherId != 'undefined'){
							var tempTeacherHolder = localStorage.teacherId;
						}
			  			
			  			if(typeof localStorage.orginalTeacherId != 'undefined'){
							var temporginalTeacherHolder = localStorage.orginalTeacherId;
						}
			  			
						localStorage.clear();
						if(typeof tempTeacherHolder != 'undefined'){
							localStorage.teacherId =  tempTeacherHolder;
						}
						
						if(typeof temporginalTeacherHolder != 'undefined'){
							localStorage.orginalTeacherId = temporginalTeacherHolder;
						}
						*/
						
						var teacherId = vcan.chkValueInLocalStorage('teacherId');
						var orginalTeacherId = vcan.chkValueInLocalStorage('orginalTeacherId');
						var wbrtcMsg = vcan.chkValueInLocalStorage('wbrtcMsg');
						var canvasDrwMsg = vcan.chkValueInLocalStorage('canvasDrwMsg');

						
						localStorage.clear();
						if(teacherId){
							localStorage.teacherId =  teacherId;
						}
						
						if(orginalTeacherId){
							localStorage.orginalTeacherId = orginalTeacherId;
						}
						
						if(wbrtcMsg){
							localStorage.wbrtcMsg = wbrtcMsg;
						}
						
						if(canvasDrwMsg){
							localStorage.canvasDrwMsg = canvasDrwMsg;
						}
						
						//localStorage.clear();
						vcan.lastId = 0;
						vcan.renderedObjId = 0;
						vcan.tempArr = [];
						whBoard.uid = 0;
						vcan.removeTextNode();
						//vcan.updateRcvdInformation(e.message);
						if(typeof vcan.main.currentTransform != 'undefined'){
							vcan.main.currentTransform = "";
						}
						vm_chat.send({'clearAll': true});
				}
				
				if(cmd == 't_assign'){
					whBoard.utility.assignRole();
					vm_chat.send({'assignRole': true});
				}
				
				if(cmd == 't_reclaim'){
					//alert('ss');
					whBoard.utility.reclaimRole();
				}
				
				if(cmd == 't_connectionoff'){
					whBoard.utility.connectionOff();
				}
				
				if(cmd == 't_connectionon'){
					whBoard.utility.connectionOn();
				}
				
				//alert(cmd);
				//if(cmd != 't_activeall' && cmd != 't_replay' && cmd != 't_clearallInit'){
				if(cmd != 't_activeall' && cmd != 't_replay' && cmd != 't_clearallInit' && cmd != 't_assign' 
					&& cmd != 't_reclaim' && cmd != 't_connectionoff' && cmd != 't_connectionon'){
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
				this.cmd = cmd;
				//when other objecti 
				if(cmd != 't_freeDrawing'){
					whBoard.obj.freeDrawObj = "";
				}
				
				if(cmd != 't_text'){
					whBoard.obj.drawTextObj = "";
				}
				
				if(cmd == 't_freeDrawing'){
					//NOTE:- this is added during the UNIT testing
					var borderColor = "#00000";
					var linWidth = "3";
					whBoard.obj.freeDrawObj =  new whBoard.readyFreeHandObj(borderColor, linWidth);
					whBoard.obj.freeDrawObj.init();
					
					//below line is commented out during unit testing
					//whBoard.vcan.main.mcanvas = whBoard.canvas; //TODO this should be control because it is used inside the
					
				}else if(cmd == 't_text'){
					whBoard.obj.drawTextObj = new whBoard.readyTextObj();
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
//			utility : {
//				
//				/**
//				 * This function does check that passed object is existing into 
//				 * removeElements array or not
//				 * @param obj expects the object which have to be checked against removeElements
//				 * @returns that position if the object is existing into remove Elements 
//				 */
//				isObjExistRE : function (obj){
//					if(whBoard.replay.removeElements.length>=0){
//						var objPos = whBoard.vcan.ArrayIndexOf(whBoard.replay.removeElements, function (pobj){return pobj.id == obj.id});
//						if(objPos >=0){
//							return objPos;
//						}
//					}
//				}, 
//				
//				
//				/**
//				 *  This function checks that particular object has property or not
//				 *  @obj the object should be tested that object has property or not 
//				 *  return true if the object is empty false otherwise
//				 */	
//				IsObjEmpty : function (obj){
//				  for(var key in obj) {
//				      if (obj.hasOwnProperty(key)) {
//				         return false;
//				      }
//				   }
//				   return true;
//			   },
//			   
//			   
//			    /**
//				 *  This function converts string to number
//				 *  @param expects pmdTime which has to be converted
//				 *  returns that converted number
//				 */
//				 stringToNumber : function (pmdTime){
//					if(pmdTime[pmdTime.length-1] == ' '){
//						pmdTime = pmdTime.substring(0, pmdTime.length-1); //removing the space
//					}
//					
//					pmdTime = Number(pmdTime); //converting string into number
//					return pmdTime;
//				 },
//				 
//				
//				/***
//				 * this function does check that the user 
//				 * click at very first on canvas for draw the text
//				 * or click outside the box for finalize the  written text  
//				 * return true at second case false otherwise 
//				 * at @param expects the number either it is odd or even
//				 */
//				
//				clickOutSidebox : function(num){
//					return (num % 2 != 1) ? true : false ; 
//				},
//				
//				
//				/**
//				 * Through this function the selected object would be deleted
//				 * when user press on delete button after selected particular object
//				 * @param evt expects key down event
//				 */
//				keyOperation : function(evt){
//					//this is used for removed the selected object	
//					var currTime = new Date().getTime();
//					if(evt.keyCode == 8){
//						var vcan = whBoard.vcan;
//						if(vcan.main.currObj != ""){
//							whBoard.canvas.removeObject(vcan.main.currObj);
//							var obj = vcan.main.currObj;
//						    var tempObj =  vcan.extend({}, obj);
//						    tempObj = vcan.extend(tempObj, {mdTime:currTime, func:'remove', usrCurrAction : 'delete', lastElement :true});
//						    vcan.main.replayObjs.push(tempObj);
//							vcan.main.currObj = "";
//						}
//					}
//				},
//				
//				
//				/**
//				 *  Through this function the event handlers attaching  
//				 *  the canvas there are three kinds of event handlers
//				 *  mouse down, up and move
//				 */
//				attachEventHandlers : function (){
//					whBoard.canvas.bind('mousedown', whBoard.utility.ev_canvas);
//					whBoard.canvas.bind('mousemove', whBoard.utility.ev_canvas);
//					whBoard.canvas.bind('mouseup',   whBoard.utility.ev_canvas);
//				},
//				
//				
//				
//				/**
//				 * Call the function through which     
//				 * the canvas would be clear
//				 */
//				t_clearallInit : function() {
//					var delRpNode = true;
//					whBoard.utility.clearAll(delRpNode);
//					if(localStorage.repObjs){
//						//localStorage.clear();
//						//alert('suman bogati');
//						//debugger;
//					}
//					
//				},
//				
//				/**
//				 * By this function  all drawn object over the canvas would be erased   
//				 * which means the canvas would be cleared
//				 * @param delRpNode
//				 */
//				clearAll : function(delRpNode, pkMode){
//					var vcan = whBoard.vcan;
//					while(vcan.main.children.length > 0){
//						whBoard.canvas.removeObject(vcan.main.children[0]);
//					}
//					
//					
//					//removing all the elements from replayObjs
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
//					
//					if(whBoard.replay != undefined){
//						whBoard.replay.objNo = 0;
//					}
//					
//					if(vcan.getStates('action') == 'move'){
//						vcan.setValInMain('action', 'create');
//					}
//					
//					var allDivs = document.getElementById('sendPackCont').getElementsByClassName('numbers');
//					
//					if(allDivs.length > 0){
//						allDivs[i].innerHTML = 0;
//					}
//						
//					if(typeof pkMode == 'undefined'){
//						whBoard.sentPackets = 0;
//						whBoard.receivedPackets = 0;
//					}
//					
//					//for clear sent and received msg information
//					document.getElementById('sentMsgInfo').innerHTML  = "";
//					document.getElementById('rcvdMsgInfo').innerHTML  = "";
//					
//					
//					
////					var vcan = whBoard.vcan;
////					//vcan.main.children = [];
////					
////					vcan.main.children.splice(0, vcan.main.children.length);
////					//vcan.main.replayObjs = [];
////					if(delRpNode == true){
////						/*****
////						This would I have disbaled can be critical
////						
////						whBoard.repObj.replayObjs.splice(0, whBoard.repObj.replayObjs);
////						*****/
////						vcan.main.replayObjs.splice(0, vcan.main.replayObjs.length);
////						
////					}
////					
////					var canElem = vcan.main.canvas;
////					var ctx = canElem.getContext('2d');
////			        ctx.clearRect(0, 0, canElem.width, canElem.height);
////					
////					if(whBoard.replay != undefined){
////						whBoard.replay.objNo = 0;
////					}
//					
//					
//				},
//				
//				
//				/**
//				 * By this function there would de-activating all the objects
//				 * which is stored into children array of vcan
//				 * de-activating means the particular object would not be select able 
//				 * @returns {Boolean}
//			     */
//			   deActiveFrmDragDrop : function(){
//				    var vcan = whBoard.vcan;
//					var allChildren = vcan.main.children;
//					var currState  = vcan.getStates('action');
//					if(currState == 'move'){
//						vcan.setValInMain('action', 'create');
//						for(var i=0; i<allChildren.length; i++){
//							//allChildren[i].draggable = false;
//							allChildren[i].dragDrop(false);
//							allChildren[i].setActive(false);
//						}
//						return true;
//					}
//					return false;
//				},
//				
//				/*
//				 deactivateAll : function () {
//			    	 var allObjects = vcan.main.children,
//			           i = 0,
//			           len = allObjects.length;
//				       for ( ; i < len; i++) {
//				      	 	allObjects[i].setActive(false);
//				       	}
//				      // return this;
//			     }, */
//				
//				/**
//				 *   This function just determines the mouse 
//				 *   position relative to the canvas element. which means the mouse position(x, y)
//				 *   would counted from there where the canvas is started on browser
//				 *   @param evt expects the mouse event object
//				 *   @returns the object which has x and y co-ordination
//				 */
//				getOffset : function(evt) {
//					
//					var el = evt.target, 
//					x = y = 0;
//						//getting the total mouse position from the relative element where the event is occurred
//					while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
//						x += el.offsetLeft - el.scrollLeft;
//						y += el.offsetTop - el.scrollTop;
//						el = el.offsetParent;
//					}
//					
//					x = evt.clientX - x;
//					y = evt.clientY - y;
//					return { x: x, y: y };
//				},
//				
//				
//				/**
//				 * Through this function the mouse event would called on the
//				 * particular object eg:- mouse down over the rectangle object 
//				 * which means the mouse is downed/created for create the rectangle
//				 */
//				ev_canvas : function(ev) {
//					//NOTE:- this have been done during the unit testing
//					//var posMous = whBoard.utility.getOffset(ev);
//					var posMous =  whBoard.vcan.utility.getReltivePoint(ev);
//					ev.currX= posMous.x;
//					ev.currY= posMous.y;
//					
//					//here the particular function is calling according to mouse event 
//					var func = whBoard.tool[ev.type];
//					if (func) {
//						func(ev);
//						return this.ev_canvas;
//					}
//					
//				},
//				
//				
//				/**
//				 * This function does active all the object which are 
//				 * created on canvas, after active all the object
//				 * they can be selectable, draggable, rotateable etc
//				 */
//				t_activeallInit : function () {
//					var vcan = whBoard.vcan;
//					// TODO I have to make the function to get the children 
//					//var allChildren = vcan.main.children;
//					var allChildren = vcan.getStates('children');
//					if(allChildren.length >= 1){
//						/* TODO this should not contain here */
//						vcan.setValInMain('action', 'move');
//						for(var i=0; i<allChildren.length; i++){
//							allChildren[i].dragDrop(true);
//						}
//					}
//				},
//				
//				drawArrowImg : function (img, obj){
//					var ctx  = whBoard.vcan.main.canvas.getContext('2d');
//					ctx.clearRect(0, 0, whBoard.vcan.main.canvas.width, whBoard.vcan.main.canvas.height);
//					vcan.renderAll();
//				    ctx.save();
//				    ctx.beginPath();
//		            ctx.translate(obj.mp.x, obj.mp.y);
//		            ctx.drawImage(img, 0, 0, 10, 20);
//		            ctx.closePath();
//		            ctx.restore();
//				},
//				
//				calcPsSentPackets : function (oldData){
//					var pacPerSec = whBoard.sentPackets - oldData;
//					//var oldData = whBoard.sentPackets;
//					//this is handle when user click on clear button for clear
//					//if we disable this there woould be replay the negative value
//					if(pacPerSec < 0){
//						pacPerSec = 0;
//					}
//					document.getElementById(whBoard.sentPackDivPS).innerHTML = pacPerSec;
//					return whBoard.sentPackets;
//				},
//				
//				calcPsRecvdPackets : function (oldData2){
//					var pacPerSec = whBoard.receivedPackets - oldData2;
//					if(pacPerSec < 0){
//						pacPerSec = 0;
//					}
//					document.getElementById(whBoard.receivedPackDivPS).innerHTML = pacPerSec;
//					return whBoard.receivedPackets;
//				},
//				
//				//initialize transfred packets from local storage when
//				// browser is reloaded
//				initStoredPacketsNumbers : function (){
//					if(localStorage.sentPackets){
//						var totSentPackets = JSON.parse(localStorage.sentPackets);
//						whBoard.sentPackets = totSentPackets;
//						document.getElementById(whBoard.sentPackDiv).innerHTML = totSentPackets;
//					}
//					
//					if(localStorage.receivedPackets){
//						whBoard.receivedPackets = JSON.parse(localStorage.receivedPackets);
//						document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
//	    			}
//				}, 
//				
//				updateSentPackets : function (obj){
//					whBoard.sentPackets = whBoard.sentPackets + JSON.stringify(obj).length;
//					document.getElementById(whBoard.sentPackDiv).innerHTML = whBoard.sentPackets
//				}
//			},
			
			/**
			 * This function does initiates replay function after click on replay button 
			 * it replays all the object the user would drawn 
			 */
			t_replayInit : function(repMode, myfunc) {
				
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
				 whBoard.replay.init(repMode);
				 
				 if(typeof myfunc != 'undefined'){
					 whBoard.replay.renderObj(myfunc);
				 }else{
					 whBoard.replay.renderObj();
				 }
				 
			
				 //if(typeof whBoard.replay.rctx == 'object'){
					// whBoard.replay.rctx.restore();
				// }
				 
			}
			
//			_replay : function (){
//				return {
//					init : function (repMode){
//						var vcan = whBoard.vcan;
//						this.objs = vcan.getStates('replayObjs');
//						this.objNo  = 0;
//						this.repMode = repMode;
//					},
//					
//					renderObj : function (){
//						wbRep = whBoard.replay;
//						if(wbRep.objs[wbRep.objNo].hasOwnProperty('cmd')){
//							
//							//whBoard.toolInit(wbRep.objs[wbRep.objNo].cmd, 'fromFile', true);
//							whBoard.toolInit(wbRep.objs[wbRep.objNo].cmd, 'fromFile', true);
//						}else{
//							var event = "";
//							if(wbRep.objs[wbRep.objNo].ac == 'd'){
//								event = 'mousedown';
//							}else if((wbRep.objs[wbRep.objNo].ac == 'm')){
//								event = 'mousemove';
//							}else if(wbRep.objs[wbRep.objNo].ac == 'u'){
//								event = 'mouseup';
//							}
//							
//							var currObj = wbRep.objs[wbRep.objNo];
//						
//							if(currObj.hasOwnProperty('mtext')){
//								var eventObj = {detail : {cevent : {x:currObj.x, y:currObj.y, mtext:currObj.mtext}}};
//							}else{
//								var eventObj = {detail : {cevent : {x:currObj.x, y:currObj.y}}};
//							}
//							
//                            
//                            var eventConstruct = new CustomEvent(event, eventObj); //this is not supported for ie9 and older ie browsers
//                            vcan.main.canvas.dispatchEvent(eventConstruct);
//
//						}
//						
//						if(typeof wbRep.objs[wbRep.objNo+1] == 'object'){
//							
//							whBoard.replayTime = wbRep.objs[wbRep.objNo+1].mt - wbRep.objs[wbRep.objNo].mt;
//							wbRep.objNo++;
//							
//							if(typeof wbRep.repMode != 'undefined' && wbRep.repMode == 'fromBrowser'){
//								whBoard.replayTime = 0;
//							}
//							setTimeout(wbRep.renderObj, whBoard.replayTime);
//						}
//						
//						//if(whBoard.replayTime >= 0){
//							//setTimeout(wbRep.renderObj, whBoard.replayTime);
//						//}
//						return ;
//						
//					}
//				}
//			},
			
			
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
				
				////console.log('x ' +compObj.x);
				////console.log('x ' +compObj.y);
				
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
		
		
//		/**
//		 * this class has methods by which the user can draw the particular object at different mouse event
//		 * @param objType is the particular object type which has to be drawn
//		 * @canvas canvas is the canvas element on which the object would be drawn 
//		 * @thisobj is current tool object 
//		 */
//		whBoard.draw_object  = function(objType, canvas, thisobj){
//			var tool = thisobj;
//			thisobj.started = false;
//
//			var startPosX;
//			var startPosY;
//			var endPosX;
//			var endPosY;
//			var dataChunk = [];
//			
//			
//			/**
//			 * This function sets up the situation for draw the particular object
//			 * This function called when user selected particular tool eg:- rectangle, line and clicked over the canvas
//			 * 
//			 */
//			tool.mousedown = function (ev, cobj) {
//				//alert('raj');
//				//debugger;
//				if(ev.detail.hasOwnProperty('cevent')){
//					ev.clientX = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
//					ev.clientY = ev.detail.cevent.y + (whBoard.vcan.main.offset.y);
//					ev.x = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
//					ev.y = ev.detail.cevent.x + (whBoard.vcan.main.offset.y);
//					ev.pageX = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
//					ev.pageY = ev.detail.cevent.y + (whBoard.vcan.main.offset.y);
//					ev.currX = ev.detail.cevent.x;
//					ev.currY = ev.detail.cevent.y;
//				}
//				
//				var vcan = whBoard.vcan;
//
//				lastmousemovetime = null;
//				if(typeof(Storage)!=="undefined"){
//					//localStorage.repObjs = "";
//				}
//				tool.startPosX = ev.currX;
//				tool.startPosY = ev.currY;
//				
//
//				
//				
//				var currState  = vcan.getStates('action');
//				if(currState == 'create'){
//					var currTime = new Date().getTime();
//					
//					if(objType != 'text'){
//						var currTransformState = vcan.getStates('currentTransform');				
//						if(currTransformState == ""  || currTransformState == null){
//						//	if(!ev.detail.hasOwnProperty('cevent') && objType != 'freeDrawing'){
//							if(!ev.detail.hasOwnProperty('cevent')){
//								//var currTime = new Date().getTime();
//								var obj = vcan.makeStackObj(currTime, 'd', tool.startPosX, tool.startPosY);
//								vcan.main.replayObjs.push(obj);
//								localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
//								vm_chat.send({'repObj': [obj]}); 
//								whBoard.utility.updateSentPackets(obj);
//							}
//							tool.started = true;
//						}
//					}else{
//						whBoard.obj.drawTextObj.muser = false;
//						if(!ev.detail.hasOwnProperty('cevent')){
//							if(whBoard.utility.clickOutSidebox(whBoard.obj.drawTextObj.textWriteMode)){
//								var obj = vcan.makeStackObj(currTime, 'd', tool.startPosX, tool.startPosY);
//								vcan.main.replayObjs.push(obj);
//								localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
//								vm_chat.send({'repObj': [obj]}); 
//								whBoard.utility.updateSentPackets(obj);
//							}
//						}else{
//							whBoard.obj.drawTextObj.muser = true;
//						}
//						
//						
//						if(ev.detail.hasOwnProperty('cevent')){
//							if(ev.detail.cevent.hasOwnProperty('mtext')){
//								whBoard.obj.drawTextObj.textUtility(tool.startPosX, tool.startPosY, ev.detail.cevent.mtext);
//							}else{
//								whBoard.obj.drawTextObj.textUtility(tool.startPosX, tool.startPosY);
//							}
//						}else{
//							whBoard.obj.drawTextObj.textUtility(tool.startPosX, tool.startPosY);
//						}
//						
//					}
//				}
//				
//				if(objType == 'freeDrawing' && whBoard.obj.freeDrawObj.freesvg == true){
//					whBoard.obj.freeDrawObj.drawStart(ev);
//				}
//			};
//			
//			
//			//  This function is called every time you move the mouse. Obviously, it only 
//			//  draws if the tool.started state is set to true (when you are holding down the mouse button).
//			
//			/**
//			 * This function does create the particular object when user has already been
//			 * started to draw, at the same time the function made the information eg: creation time about parituclar
//			 * object and stored drawn object into replayObjs array   
//			 * @param expects mousemove event
//			 */
//			tool.mousemove = function (ev, mouseup) {
//				if(ev.detail.hasOwnProperty('cevent')){
//					ev.clientX = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
//					ev.clientY = ev.detail.cevent.y + (whBoard.vcan.main.offset.y);
//					ev.x = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
//					ev.y = ev.detail.cevent.x + (whBoard.vcan.main.offset.y);
//					ev.pageX = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
//					ev.pageY = ev.detail.cevent.y + (whBoard.vcan.main.offset.y);
//					ev.currX = ev.detail.cevent.x;
//					ev.currY = ev.detail.cevent.y;
//				}
//			  if (tool.started) {
//				  	if(whBoard.obj.freeDrawObj != undefined && whBoard.obj.freeDrawObj.freesvg == true){
//					  	  if (whBoard.obj.freeDrawObj.fdObj.isCurrentlyDrawing) {
//					  			whBoard.obj.freeDrawObj.wb_draw(ev);
//					  			
//					  			if(!ev.detail.hasOwnProperty('cevent')){
//					  				if(typeof mouseup == 'undefined'){
//					  					if(((typeof  lastmousemovetime == 'undefined') || (lastmousemovetime == null))) {
//								        	lastmousemovetime = new Date().getTime();
//								              var obj = vcan.makeStackObj(lastmousemovetime, 'm', ev.currX, ev.currY);
//												vcan.main.replayObjs.push(obj);
//												vm_chat.send({'repObj': [obj]});  //after optimized
//												localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
//												whBoard.utility.updateSentPackets(obj);
//								       }
//					  				}  
//						  			  
//								     
//						  			var currTime= new Date().getTime(); 
//						  			var obj = vcan.makeStackObj(currTime, 'm', ev.currX, ev.currY);
//									//vcan.main.replayObjs.push(obj);
//									dataChunk.push(obj);
//									
//									//localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
//									
//									if(typeof mouseup == 'undefined'){
//										presentmousemovetime = new Date().getTime();
//										if((presentmousemovetime-lastmousemovetime)>=2000) {	 // Optimized
//												vm_chat.send({'repObj': dataChunk});
//												whBoard.utility.updateSentPackets(dataChunk);
//												for(var i=0; i<dataChunk.length; i++){
//													vcan.main.replayObjs.push(dataChunk[i]);
//												}
//												localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
//												dataChunk = [];
//												lastmousemovetime = new Date().getTime();
//										}
//									}
//										
//					  			}	
//					  			
//					            return;
//					      }
//					 }else{
//						 	endPosX = ev.currX;
//						  	endPosY = ev.currY;
//						  	
//						  	 if(whBoard.prvObj != ''){
//						  		whBoard.canvas.removeObject(whBoard.prvObj);
//						  	 }
//						  	 
//						  	 //var  currObject = whBoard.makeobj(whBoard.prvObj, startPosX, startPosY, endPosX, endPosY, objType);
//						  	 var  currObject = whBoard.makeobj(tool.startPosX, tool.startPosY, endPosX, endPosY, objType);
//						  	 var rCurrObject = whBoard.canvas.readyObject(currObject);
//						  	 whBoard.canvas.addObject(rCurrObject);
//						  	 rCurrObject.coreObj.usrCurrAction = 'create';
//						  	 var  currTime= new Date().getTime();
//						  	if ((typeof  lastmousemovetime == 'undefined') || (lastmousemovetime == null)) {
//						  		lastmousemovetime = new Date().getTime();
//						  		if(!ev.detail.hasOwnProperty('cevent') && objType != 'text'){
//									var obj = vcan.makeStackObj(currTime, 'm', endPosX, endPosY);
//									vcan.main.replayObjs.push(obj);
//									vm_chat.send({'repObj': [obj]}); //after optimized
//									localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
//									whBoard.utility.updateSentPackets(obj);
//								}
//								 
//							}
//							presentmousemovetime = new Date().getTime();
//							
//							if ((presentmousemovetime-lastmousemovetime)>=d) { // Optimized
//								if(!ev.detail.hasOwnProperty('cevent') && objType != 'text'){
//									var obj = vcan.makeStackObj(currTime, 'm', endPosX, endPosY);
//									vcan.main.replayObjs.push(obj);
//									vm_chat.send({'repObj': [obj]}); //after optimized
//									localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
//									whBoard.utility.updateSentPackets(obj);
//								}
//								 
//								lastmousemovetime = new Date().getTime();
//							}
//							
//						     /**** 
//					  		 *
//					  		 * This would I have disbaled can be critical
//					  		 * whBoard.replay.replayObjs.push(currObject);
//					  		 *
//					  		 ****/
//						    
//							
//						  	 whBoard.prvObj = rCurrObject.coreObj;
//
//					 }
//			   }else{
//				   if(whBoard.vcan.main.action !=  'move' || ((vcan.main.currentTransform =="" || vcan.main.currentTransform ==null) && whBoard.vcan.main.action == "move")){
//					   vm_chat.send({'createArrow': true, x:ev.currX, y: ev.currY});
//				   } 
//				   
//			   }
//		};
//
//		
//
//			/**
//			 *  This function does finalize the object 
//			 *  with last made object very specail
//			 */
//			tool.mouseup = function (ev, cobj) {
//				
//				if(ev.detail.hasOwnProperty('cevent')){
//					ev.clientX = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
//					ev.clientY = ev.detail.cevent.y + (whBoard.vcan.main.offset.y);
//					ev.x = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
//					ev.y = ev.detail.cevent.x + (whBoard.vcan.main.offset.y);
//					ev.pageX = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
//					ev.pageY = ev.detail.cevent.y + (whBoard.vcan.main.offset.y);
//					
//					ev.currX = ev.detail.cevent.x;
//					ev.currY = ev.detail.cevent.y;
//				}
//				
//				
//				endPosX = ev.currX;
//				endPosY = ev.currY;
//				
//				
//				lastmousemovetime = null;
//				if (tool.started && objType != 'text') {
//					tool.mousemove(ev, 'up');
//					
//					if(!ev.detail.hasOwnProperty('cevent') && objType != 'freeDrawing'){
//						 var currTime = new Date().getTime();
//						 var obj = vcan.makeStackObj(currTime, 'u', endPosX, endPosY);
//						 vcan.main.replayObjs.push(obj);
//						 vm_chat.send({'repObj': [obj]}); //after optimized
//						 localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
//						 whBoard.utility.updateSentPackets(obj);
//					 }
//					
//					//if(vcan.main.freesvg == true ){
//					
//					if((whBoard.obj.freeDrawObj != undefined &&  whBoard.obj.freeDrawObj.freesvg == true )){
//						  if (whBoard.obj.freeDrawObj.fdObj.isCurrentlyDrawing) {
//							 whBoard.obj.freeDrawObj.finalizeDraw(ev);
//						  }
//						 
//						  if(!ev.detail.hasOwnProperty('cevent')) {
//							  if(dataChunk.length > 0){
//								  	 var currTime = new Date().getTime();
//									 var obj = vcan.makeStackObj(currTime, 'u', endPosX, endPosY);
//									 //vcan.main.replayObjs.push(obj);
//									 dataChunk.push(obj);
//									 for(var i=0; i<dataChunk.length; i++){
//										 vcan.main.replayObjs.push(dataChunk[i]);
//									 }
//								    
//									vm_chat.send({'repObj': dataChunk}); 
//									localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
//									whBoard.utility.updateSentPackets(dataChunk);
//									dataChunk = [];
//							  }
//						  }
//					 }
//					
//					 if(whBoard.prvObj != ''){
//						 whBoard.prvObj = ""; //this should be into proper way
//					 }
//					
//					whBoard.prvObj = "";
//					tool.started = false;
//			  }
//				
//			  if(whBoard.vcan.wb.sentPack == true) {
//				 whBoard.vcan.wb.sentPack = false;
//			  }
//		   };
//	   }

//		/**
//		 * this class initializes the functions 
//		 * thorugh which the free hand object is drawn
//		 */
//		//NOTE:- have changed during the unit testing
//		whBoard.readyFreeHandObj = function (borderColor, lineWidth){
//			return {
//				
//				/**
//				 * this function does intialize the value which is required for drawing the object 
//				 * @returns nothing
//				 */
//				
//				init : function (){
//					this.freesvg = true;
//					this.fdObj = {}; 
//					this.borderColor = borderColor;
//					this.freeDrawingLineWidth = lineWidth;
//				},
//				
//				
//				/**
//				 * this function does setup the drawing object fdObj for free drawing 
//				 * it is called when user click on canvas
//				 * It expects mouse down event
//				 * @returns nothing
//				 */
//				
//				drawStart : function (ev){
//					var vcan = whBoard.vcan;
//						//if(vcan.main.freesvg == true){
//					   if(whBoard.obj.freeDrawObj.freesvg == true){
//						   	
//							  var ctx = vcan.main.canvas.getContext('2d');
//						  	//  borderColor = "red";
//							  //this.fdObj = vcan.main.freeHandDrawing(ev, {borderColor: borderColor});
//						  	  this.fdObj = vcan.main.freeHandDrawing({borderColor: this.borderColor, lineWidth : this.freeDrawingLineWidth});
//						  	  this.fdObj.init();
//	
//						  	  pointer = vcan.utility.getReltivePoint(ev);
//						  	  this.fdObj.fhdStart(ctx, pointer);  
//							  return;
//					     //}
//					}
//				},
//				
//				
//				/**
//				 * this function calls the function through 
//				 * which the free hand draw object is drawn as user move the mouse 
//				 * @param ev expects the mouse move event
//				 * @returns nothing
//				 */
//				wb_draw : function (ev){
//					var pointer = vcan.utility.getReltivePoint(ev);
//					this.fdObj.fhRendering(pointer);
//				},
//				
//				finalizeDraw : function (ev){
//
//					var vcan = whBoard.vcan;
//					//TODO this(finalizeDrawingPath) should be called over the object 
//					//prvObj =  vcan.main.freeDraw.finalizeDrawingPath();
//					
//					whBoard.prvObj =  this.fdObj.finalizeDrawingPath(whBoard.canvas);
//					
//					var currTime = whBoard.utility.stringToNumber(whBoard.prvObj.path[whBoard.prvObj.path.length-1][3]);
//					var tempObj =  vcan.extend({}, whBoard.prvObj);
//					
//					whBoard.prvObj = vcan.extend(tempObj, {mdTime:currTime, func:'add', usrCurrAction : 'create'});
//
//					
//					var lastChild = vcan.main.children[vcan.main.children.length-1];
//					
//					lastChild.mdTime =  whBoard.utility.stringToNumber(whBoard.prvObj.path[whBoard.prvObj.path.length-1][3]);
//					//vcan.main.replayObjs.push(whBoard.prvObj);
//					
//					//localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
//					
//					//todo this should be enable when white board used for multi user
//					//var myres = [whBoard.prvObj];
//					//alert('suman');
//					//debugger;
//					
//					////console.log('fdId ' + whBoard.prvObj.id);
//					//vm_chat.send({'repObj': [whBoard.prvObj]});
//			  		
//			  		/**** 
//			  		 *
//			  		 * This would I have disbaled can be critical
//			  		 * whBoard.repObj.replayObjs.push(whBoard.prvObj);
//			  		 *
//			  		 ****/
//			  		
//				}
//			};
//		}
		
		
//		/**
//		 * this function makes the properties for particular object like start and end point for line, width,height,x,y made for rectangle
//		 *	@param startPosX for starts horizontal position for start point
//		 *  @param startPosY for starts vertical position for start point
//		 *  @param endPosX for starts horizontal position for end point
//		 *  @param endtPosY for starts vertical position for end point
//		 *  @param objType particular ocanvas object type eg:- rectangle, oval etc
//		 *  returns the object wrapped along with the properties  
//		 */
//		whBoard.makeobj = function(startPosX, startPosY, endPosX, endPosY, objType){
//			////console.log('startPos ' + startPosX + ' ' + startPosY  + '/' + 'endPos ' + endPosX + ' ' + endPosY);
//			////console.log('endPos ' + endPosX + ' ' + endPosY);
//			var obj = {};
//			 obj.mp = {};
//			 obj.mp.x = endPosX;
//			 obj.mp.y = endPosY;
//			//below code have been daibled during the unit testing
//			//if(whBoard.prvObj != " "){
//			//	if(typeof whBoard.prvObj == "object"){
//				if(startPosX > endPosX ){
//					//this is not using for oval
//					//TODO will have to look for other object that is it need or not
//					var temp_endPosX = endPosX;
//					var temp_endPosY = endPosY;
//					 endPosX = startPosX;
//					 endPosY = startPosY;
//					 startPosX =  temp_endPosX;
//					 startPosY =  temp_endPosY;
//					 obj.dRoad = 'b2t';
//				}else{
//					obj.dRoad = 't2b';
//				}
//	//		}
//			
//			obj.type = objType;
//			
//			if(objType == 'rectangle' || objType == 'triangle'){
//				obj.sx = startPosX;
//				obj.sy = startPosY;
//				obj.ex = endPosX;
//				obj.ey = endPosY;
//			}
//			
//			if (objType == 'line'){	
//				obj.lineColor = "navy";
//				obj.lineWidth = 3;
//				obj.start = {x:startPosX, y:startPosY};
//				obj.end = {x:endPosX, y:endPosY};
//				
//			}else if(objType == 'rectangle'){
//				obj.width = endPosX-startPosX;
//				obj.height =  endPosY-startPosY;
//				
//				obj.borderColor = 'green';
//				obj.fillColor = "#ddd";
//				obj.lineWidth = 3;
//				
//			}else if(objType == 'oval'){
//				obj.lineWidth = 3;
//				obj.borderColor = 'red';
//				
//				obj.width =   endPosX-startPosX;
//				obj.height =  endPosY-startPosY;
//				
//				obj.x =  endPosX - (obj.width / 2);
//				obj.y = endPosY - (obj.height / 2);
//				
//				obj.rx = (obj.width/2);
//				obj.ry = (obj.height/2);
//			   
//			}else if(objType == 'triangle'){
//				obj.lineWidth = 3;
//				obj.borderColor = 'blue';
//			}else if(objType == 'text'){
//				return;
//			}
//			return obj;
//		}
		
//		/***
//		 * 	
//		 * This class is all about creating text in the canvas
//		 *  it creates the wrapper(textarea) for containg the text as user clicked on canvas
//		 *  it creates the text as user typed into the textarea and click outside that text
//		 */
//		whBoard.readyTextObj = function(){
//			return {
//					init : function (boxCont){
//						//this.textId =  0;
//						this.prevTextObj = "";
//						this.currTextObjWrapper = "";
//						this.keyTyped = []; //the key typed by user this is used into finalizeText()
//						this.currObject = {};
//						this.prvModTextObj = {};
//						this.prvCurrTransform = {};
//						this.textWriteMode = 0;
//						this.totalBox = 0;
//						this.boxContainer = boxCont;
//						this.muser = false;
//					},
//					
//					
//					/**
//					 * 
//					 * This function handles all the functionality of text object
//					 * Eg: created the text wrapper for creating text, create text, create the text with older one
//					 * @param startPosX points out the x co-ordination of canvas after clicked by user
//					 * @param startPosY points out the y co-ordination of canvas after clicked by user
//					 * @returns nothing
//					 */
//					textUtility : function (startPosX, startPosY, mtext){
//						this.startPosX = startPosX;
//						this.startPosY = startPosY;
//						//alert('is there anything for you');
//						var vcan = whBoard.vcan;
//						var ctx = vcan.main.canvas.getContext('2d');
//						var obj = {};
//						this.textWriteMode++;
//						this.wmode = true;
//						
//						
//						if(vcan.main.currentTransform != undefined && vcan.main.currentTransform != ''){
//								 this.currObject = vcan.main.currentTransform.target;
//							     if(this.currObject != undefined && this.currObject.type == 'text'){
//										obj = {width:300, height: 100 , x: this.currObject['oCoords'].tl.x, y: this.currObject['oCoords'].tl.y, text:this.currObject.text};
//										if(!whBoard.utility.clickOutSidebox(this.textWriteMode)){
//											//whBoard.obj.drawTextObj.drawTextBoxWrapper(ctx, obj,  this.currObject.id);
//											whBoard.obj.drawTextObj.drawTextBoxWrapper(obj,  this.currObject.id);
//										}
//										vcan.main.currentTransform = "";
//							     }
//							     
//							    	if(whBoard.utility.clickOutSidebox(this.textWriteMode)){
//					     			whBoard.obj.drawTextObj.renderText(this.prvCurrTransform, this.prvModTextObj, ctx);
//								}
//									
//								if(this.currObject != undefined && this.currObject.type == 'text'){
//									
//									//the height and width shoudl be dyanamic
//									obj = {width:300, height: 100 , x: this.currObject['oCoords'].tl.x, y: this.currObject['oCoords'].tl.y, text:this.currObject.text};
//										this.prvModTextObj = {prvObjId : this.currObject.id, prvText : this.currObject.text, x : this.currObject.x,  y:this.currObject.y};
//										this.prvTextObj = this.currObject;
//								}	
//								this.prvCurrTransform = this.currObject;
//
//						}else{
//							
//							if (whBoard.utility.clickOutSidebox(this.textWriteMode)){
//									//alert('suman bogati khan');
//								    if(typeof mtext != 'undefined'){
//								    	whBoard.obj.drawTextObj.renderText(this.currObject, this.prvModTextObj, ctx, mtext);
//								    }else{
//								    	whBoard.obj.drawTextObj.renderText(this.currObject, this.prvModTextObj, ctx);
//								    }
//									
//								}else{
//									this.totalBox++;
//									var obj = {x:startPosX,  y:startPosY, width:300, height : 100};
//									//whBoard.obj.drawTextObj.drawTextBoxWrapper(ctx, obj,  this.totalBox);
//									if(typeof mtext == 'undefined'){
//										whBoard.obj.drawTextObj.drawTextBoxWrapper(obj,  this.totalBox);
//									}else{
//										whBoard.obj.drawTextObj.drawTextBoxWrapper(obj,  this.totalBox, mtext);
//								}
//									
//							}
//		
//						}
//						
//					},
//					
//					
//					
//					/**
//					 * It draws the textarea wrapper for draw the text inside it
//					 * @param ctx the canvas's context on which the box is being drawn
//					 * @param obj contains the information about contianer for example x, y, 
//					 * width and height, the object contains the text also if it available
//					 * @param boxNumber the number of box till now created
//					 * @returns nothing
//					 */
//					
//					//drawTextBoxWrapper : function (ctx, obj, boxNumber){
//					drawTextBoxWrapper : function (obj, boxNumber, mtext){
//						var vcan = whBoard.vcan;
//						var divNode  = document.createElement('div');
//						divNode.id = "box" + boxNumber;
//						
//						divNode.style.position = 'absolute';
//
//						divNode.style.left = (vcan.main.offset.x+obj.x) + "px";
//						divNode.style.top =  (vcan.main.offset.y+obj.y) + "px";
////						divNode.style.left = (whBoard.vcan.main.offset.x+obj.x) + "px";
//	//					divNode.style.top =  (whBoard.vcan.main.offset.y+obj.y) + "px";
//						
//						var textNode = document.createElement('textarea');
//						textNode.id = divNode.id+'textarea';
//						textNode.rows = 8;
//						textNode.cols = 41;
//						if(obj.text != undefined && obj.text != ''){
//							textNode.value = obj.text; 
//						}
//						
//						divNode.appendChild(textNode);
//						document.getElementById(this.boxContainer).appendChild(divNode);
//						
//						if(typeof mtext != 'undefined'){
//						//	alert('suman bogati');
//							//divNode.style.display = 'none'
//						}
//						
//						this.prevTextObj = divNode;
//						this.currTextObjWrapper =  obj;
//					//	this.prevTextObj.measure = {};
//						this.prevTextObj.measure = obj
//					},
//				
//					
//					
//					/**
//					 * The function renders the text after typed by user into textarea
//					 * It removes the older text object on which user would clicked for udate the text
//					 * @param currObject is the object which is ready to be printed
//					 * @param prvModTextObj
//					 * @param ctx is the current canvas context
//					 * @returns nothing
//					 */
//					renderText : function (currObject, prvModTextObj, ctx, mtext){
//						var vcan = whBoard.vcan;
//						if(this.prevTextObj != '' ){
//							
//						//	var myVal = isObjEmpty(currObject);
//							if(!whBoard.utility.IsObjEmpty(currObject)){
//								for(var i=0; i<vcan.main.children.length; i++){
//									if(currObject.id == vcan.main.children[i].id){
//										vcan.main.children.splice(i, 1);
//										this.currObject = "";
//										break;
//									}
//								}
//							}
//							
//							if(!whBoard.utility.IsObjEmpty(currObject)){
//								if(typeof mtext != 'undefined'){
//									this.finalizeText(ctx, this.prevTextObj,  prvModTextObj, mtext);
//								}else{
//									this.finalizeText(ctx, this.prevTextObj,  prvModTextObj);
//								}
//								
//								
//							}else{
//								if(typeof mtext != 'undefined'){
//									this.finalizeText(ctx, this.prevTextObj, undefined, mtext);
//								}else{
//									this.finalizeText(ctx, this.prevTextObj);
//								}
//							}
//							
//							whBoard.obj.drawTextObj.wmode = false;
//						}
//					},
//					
//					
//					/**
//					 * This function actually draws the text of passed wrapper for textarea
//					 * @param ctx the conext on which the text is drawing
//					 * @param txtWrapper The text wrapper which has text and it's wrapper to be drawn 
//					 * @param prvModObj if text wrapper has previous text eg 'vidya' new one is vidymantra 
//					 * then prvModObj contains the vidya other info x, y 
//					 * @returns nothing
//					 */
//					finalizeText : function (ctx, txtWrapper, prvModObj, mtext){
//						    
//							var vcan = whBoard.vcan;
//							var prvNode = document.getElementById(txtWrapper.id); 
//							var userText = "";
//							if(typeof mtext == 'undefined'){
//								var textarea = prvNode.getElementsByTagName('textarea');
//								for(var i =0; i< textarea.length; i++){
//									if(textarea[i].id == prvNode.id+'textarea'){
//										 userText =textarea[i].value;
//										break;
//									}
//								}
//							}else {
//								userText = mtext;
//							}
//							
//							
//							
//							var fontSize = 20;
//							ctx.font = fontSize +'px Times New Roman';
//							var maxWidth = 0;
//							var tempUserTextArr =  userText.split(/\r?\n/);
//							maxWidth = ctx.measureText(tempUserTextArr[0]).width;
//							var extHeight = 15; //TODO this should be changed according to font size by selected user
//							for(var i=1; i<tempUserTextArr.length; i++){
//								extHeight += 15;
//								var tempMaxWidth = ctx.measureText(tempUserTextArr[i]).width;
//								if(tempMaxWidth > maxWidth){
//									maxWidth = tempMaxWidth;
//								}
//							}
//							
//							var textHalfWidth = maxWidth/2;
//							
//							var  currTime= new Date().getTime();
//							var textObj = {
//									type : 'text',
//									text : userText, 
//									x : txtWrapper.measure.x+textHalfWidth,
//									y : txtWrapper.measure.y+extHeight,
//									fontSize:fontSize,
//									fontWidth : ctx.measureText(userText).width,
//									textArr : this.keyTyped, //this should add after called the function canvas.addObject(text)
//									mp : {x : txtWrapper.measure.x, y:txtWrapper.measure.y}
//							};
//							
//							if(whBoard.obj.drawTextObj.muser == false){
//								var obj = {'mt' :currTime, 'ac':'d', 'x' : this.startPosX, 'y' : this.startPosY,  'mtext' : textObj.text};
//								vcan.main.replayObjs.push(obj);
//								localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
//								vm_chat.send({'repObj': [obj]});
//								whBoard.utility.updateSentPackets(obj);
//						   }
//						   
//						   
//							
//						   var text = whBoard.canvas.readyObject(textObj);
//						   var tempObj = text.coreObj;
//						  
//						   whBoard.canvas.addObject(text);
//						   tempObj = vcan.extend({}, tempObj);
//						   text = vcan.extend(tempObj, {textArr : this.keyTyped});
//						   
//						   	text = vcan.extend(tempObj, {textArr : this.keyTyped, mdTime:currTime, func:'add', usrCurrAction : 'create', lastElement:true });
//						   	
//						   	//TODO prvModObj that should be check through hasOwnProperty method
//						   	
//					  		if(prvModObj != undefined){
//								if(prvModObj != ''){
//									text = vcan.extend(tempObj, {textArr : this.keyTyped, mdTime:currTime, func:'add', usrCurrAction : 'create', lastElement:true, 
//										prvObj : prvModObj, pt : whBoard.obj.drawTextObj.prvTextObj});
//									
//								}
//								
//							}
//					  		
//					  		var tarr = [];
//					  		var lastTxtObj = vcan.main.children[vcan.main.children.length-1];
//					  		lastTxtObj.mdTime = currTime;
//							this.keyTyped = [];  
//							prvNode.parentNode.removeChild(txtWrapper);
//							vcan.renderAll();
//							if(whBoard.sentPackets > 0) {
//								 document.getElementById(whBoard.sentPackDiv).innerHTML = whBoard.sentPackets;
//							}
//							
//					}
//			  }
//		}
		window.whBoard = whBoard;
})(window, document);
