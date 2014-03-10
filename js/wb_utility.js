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
				
				whBoard.uid  = 0; //this should be done with proper way
				whBoard.lt = "";
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
				
				var sentPacketCont = document.getElementById('sendPackCont');
				if(sentPacketCont != null){
					var allDivs = sentPacketCont.getElementsByClassName('numbers')
					if(allDivs.length > 0){
						//allDivs[i].innerHTML = 0;
						for(var i=0; i<allDivs.length; i++){
							allDivs[i].innerHTML = 0; 
						}
					}
				}
				//var allDivs = document.getElementById('sendPackCont').getElementsByClassName('numbers');
				
//				if(allDivs.length > 0){
//					//allDivs[i].innerHTML = 0;
//					for(var i=0; i<allDivs.length; i++){
//						allDivs[i].innerHTML = 0; 
//					}
//				}
					
				if(typeof pkMode == 'undefined'){
					whBoard.sentPackets = 0;
					whBoard.receivedPackets = 0;
				}
				
				//for clear sent and received msg information
				var sentMsgInfo = document.getElementById('sentMsgInfo');
				if(sentMsgInfo != null){
					//document.getElementById('sentMsgInfo').innerHTML  = "";
					sentMsgInfo.innerHTML  = "";
				}
				
				var receivedMsgInfo = document.getElementById('rcvdMsgInfo');
				if(receivedMsgInfo != null){
					//document.getElementById('rcvdMsgInfo').innerHTML  = "";
					receivedMsgInfo.innerHTML  = "";
				}
				
				var allTextBoxContainer = document.getElementsByClassName('textBoxContainer');
					for(var i=0; i<allTextBoxContainer.length; i++){
						allTextBoxContainer[i].parentNode.removeChild(allTextBoxContainer[i]);
					}
				
				
				
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
				if(whBoard.utility.chkValueInLocalStorage('orginalTeacherId')){
					var pacPerSec = whBoard.sentPackets - oldData;
					//var oldData = whBoard.sentPackets;
					//this is handle when user click on clear button for clear
					//if we disable this there woould be replay the negative value
					if(pacPerSec < 0){
						pacPerSec = 0;
					}
					document.getElementById(whBoard.sentPackDivPS).innerHTML = pacPerSec;
					return whBoard.sentPackets;
				}
				
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
				if(whBoard.utility.chkValueInLocalStorage('orginalTeacherId')){
					if(localStorage.sentPackets){
						var totSentPackets = JSON.parse(localStorage.sentPackets);
						whBoard.sentPackets = totSentPackets;
						document.getElementById(whBoard.sentPackDiv).innerHTML = totSentPackets;
					}
					
					if(localStorage.receivedPackets){
						whBoard.receivedPackets = JSON.parse(localStorage.receivedPackets);
						document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
	    			}
				}
				
			}, 
			
			updateSentPackets : function (obj){
				if(whBoard.dataInfo == 1){
					if(whBoard.utility.chkValueInLocalStorage('orginalTeacherId')){
						whBoard.sentPackets = whBoard.sentPackets + JSON.stringify(obj).length;
						document.getElementById(whBoard.sentPackDiv).innerHTML = whBoard.sentPackets;
					}
				}
			},
			 
			assignRole : function (studentId){
				if(typeof studentId != 'undefined'){
//					if(localStorage.hasOwnProperty('reclaim')){
					if(localStorage.getItem('reclaim') != null){
						var cmdToolsWrapper = document.getElementById(whBoard.commandToolsWrapperId);	
						cmdToolsWrapper.parentNode.removeChild(cmdToolsWrapper);
						localStorage.removeItem('reclaim');
					}	
					
					window.whBoard.attachToolFunction(vcan.cmdWrapperDiv, true);
					localStorage.teacherId = studentId;
					whBoard.utility.makeCanvasEnable();
					
				}else{
					var cmdToolsWrapper = document.getElementById(whBoard.commandToolsWrapperId);	
					while(cmdToolsWrapper.hasChildNodes()){
						cmdToolsWrapper.removeChild(cmdToolsWrapper.lastChild);
					}
			
					
//					var cmdToolsWrapper = document.getElementById(whBoard.commandToolsWrapperId);
//					cmdToolsWrapper.parentNode.removeChild(cmdToolsWrapper);
					whBoard.utility.makeCanvasDisable();
					
					if(typeof localStorage.orginalTeacherId != 'undefined'){
						whBoard.utility.createReclaimButton(cmdToolsWrapper);
						localStorage.reclaim = true;
					}else{
						if(cmdToolsWrapper != null){
							//This is for student to assign the role for teacher
							// in teacher case the reclaim button would be available
							cmdToolsWrapper.parentNode.removeChild(cmdToolsWrapper); 
						}
					}
					
					localStorage.removeItem('teacherId');
				}
				
				
//				if(typeof localStorage.orginalTeacherId != 'undefined'){
//					var cmdToolsWrapper = document.getElementById(whBoard.commandToolsWrapperId);	
//					while(cmdToolsWrapper.hasChildNodes()){
//						cmdToolsWrapper.removeChild(cmdToolsWrapper.lastChild);
//					}
//					whBoard.utility.makeCanvasDisable();
//					
//					whBoard.utility.createReclaimButton(cmdToolsWrapper);
//					localStorage.reclaim = true;
//					localStorage.removeItem('teacherId');
//				}else{
//					window.whBoard.attachToolFunction(vcan.cmdWrapperDiv, true);
//					localStorage.teacherId = vcan.studentId;
//					whBoard.utility.makeCanvasEnable();
//				}

			}, 
			
			reclaimRole : function (){
				whBoard.utility.removeToolBox();
				window.whBoard.attachToolFunction(vcan.cmdWrapperDiv, true);
				localStorage.teacherId = localStorage.orginalTeacherId;
				if(typeof localStorage.reclaim != 'undefined'){
					localStorage.removeItem('reclaim');
				}
				whBoard.utility.makeCanvasEnable();
				vm_chat.send({'reclaimRole': true});
			},
			
			connectionOff : function (){
				vm_chat.disconnect();
			},
			
			connectionOn : function (){
				vm_chat.wsconnect();
			},
			
			packetQueue : function (result){
				
				if((localStorage.getItem('teacherId') != null) || 
					(localStorage.getItem('orginalTeacherId') != null && whBoard.utility.chkValueInLocalStorage('reclaim'))){
						whBoard.utility.toolWrapperEnable();
				}
				
				
				if(localStorage.getItem('teacherId') != null){
					whBoard.utility.makeCanvasEnable();
				}
				
				console.log("should come first");
				if(vcan.tempArr.length > 0){
					window.whBoard.vcan.main.replayObjs = vcan.tempArr;
					vcan.tempArr = [];
					whBoard.toolInit('t_replay', 'fromBrowser', true, whBoard.utility.packetQueue);
				}else{
					return;
				}
			},
			
			 updateRcvdInformation : function (msg){
				var receivedMsg = document.getElementById('rcvdMsgInfo');
				if(receivedMsg != null){
					var compMsg = "";
					for(var key in msg){
						compMsg += key +" : " + msg[key] + " <br />";
					}
					receivedMsg.innerHTML = compMsg;
				}
			},
			
			makeCanvasDisable : function(){
				//debugger;
  				// TODO this could be tricky as it's best way to do
				// is remove the attached handler
				var canvasElement = vcan.main.canvas;
				canvasElement.style.position = 'relative';
				canvasElement.style.zIndex = "-1000";  
			},
			
			makeCanvasEnable : function(){
				if(localStorage.getItem('teacherId')  !=  null){
					var canvasElement = vcan.main.canvas;
					canvasElement.style.zIndex = "0";
					console.log("should come first");
				}
			},
	  		
	  		removeToolBox : function(){
	  			var cmdWrapper =  document.getElementById(vcan.cmdWrapperDiv);
				cmdWrapper.parentNode.removeChild(cmdWrapper);
	  		},
	  		
	  		createReclaimButton : function (cmdToolsWrapper){
				whBoard.createDiv('t_reclaim', 'reclaim', cmdToolsWrapper);
				var aTags = document.getElementById('t_reclaim').getElementsByTagName('a');
				aTags[0].addEventListener('click', whBoard.objInit);
			},
			
			chkValueInLocalStorage : function(property){
				if (localStorage.getItem(property) === null) {
					return false; 
				}else{
					return localStorage[property]; 
				}
				
				
//				if(typeof localStorage[property] != 'undefined'){
//					return localStorage[property]; 
//				}else{
//					return false;
//				}
			},
			
			uniqueArrOfObjsToOther : function (){
				var tempRepObjs = "";
				whBoard.globalObj.replayObjs = [];
				for(var i=0; i<vcan.main.replayObjs.length; i++){
					tempRepObjs = vcan.extend({}, vcan.main.replayObjs[i]);
					whBoard.globalObj.replayObjs.push(tempRepObjs);
				}
			},
			
			uniqueArrOfObjsToSelf : function (){
				vcan.main.replayObjs = [];
				var tempRepObjs = "";
				for(var i=0; i<whBoard.globalObj.replayObjs.length; i++){
					tempRepObjs = vcan.extend({}, whBoard.globalObj.replayObjs[i]);
					vcan.main.replayObjs.push(tempRepObjs);
				}
			},
			
			makeDefaultValue : function (){
	  			whBoard.globalObj.myrepObj = [];
				whBoard.globalObj.replayObjs = [];
				
				var teacherId = whBoard.utility.chkValueInLocalStorage('teacherId');
				var orginalTeacherId = whBoard.utility.chkValueInLocalStorage('orginalTeacherId');
				var wbrtcMsg = whBoard.utility.chkValueInLocalStorage('wbrtcMsg');
				var canvasDrwMsg = whBoard.utility.chkValueInLocalStorage('canvasDrwMsg');
				var toolHeight = whBoard.utility.chkValueInLocalStorage('toolHeight');

	  			localStorage.clear();
				if(teacherId){
					//localStorage.teacherId =  teacherId;
					localStorage.setItem('teacherId', teacherId);
				}
				
				if(orginalTeacherId){
					//localStorage.orginalTeacherId = orginalTeacherId;
					localStorage.setItem('orginalTeacherId', orginalTeacherId);
				}
				
				if(wbrtcMsg){
					//localStorage.wbrtcMsg = wbrtcMsg;
					localStorage.setItem('wbrtcMsg', wbrtcMsg);
				}
				
				if(canvasDrwMsg){
					//localStorage.canvasDrwMsg = canvasDrwMsg;
					localStorage.setItem('canvasDrwMsg', canvasDrwMsg);
				}
				
				if(toolHeight){
					localStorage.setItem('toolHeight', toolHeight);
				}
			
				vcan.reachedItemId = 0;
				vcan.renderedObjId = 0;
				vcan.tempArr = [];
				if(typeof vcan.objTxt != 'undefined'){
					vcan.objTxt.removeTextNode();
				}
				
				whBoard.uid  = 0;
				if(typeof vcan.main.currentTransform != 'undefined'){
					vcan.main.currentTransform = "";
				}
	  		}, 
	  		
	  		setOrginalTeacherContent : function (e){
	  			//window.whBoard.attachToolFunction(vcan.cmdWrapperDiv, true);
				
	  			//localStorage.teacherId = e.message[0].userid;
	  			localStorage.teacherId = whBoard.currId;
				window.whBoard.view.canvasDrawMsg('Canvas');
				localStorage.canvasDrwMsg = true;
				
				if(!whBoard.utility.alreadyExistPacketContainer()){
					whBoard.createPacketContainer();
					whBoard.createPacketInfoContainer();
					whBoard.utility.initStoredPacketsNumbers();
				}
//				whBoard.createPacketContainer();
//				whBoard.createPacketInfoContainer();
//				whBoard.utility.initStoredPacketsNumbers();
//				
				//localStorage.orginalTeacherId = e.message[0].userid;
				localStorage.orginalTeacherId = whBoard.currId;
	  		},
	  		
	  		isSystemCompatible : function (){
	  			if(window.whBoard.error.length > 0){
	  				for(var i=0; i<window.whBoard.error.length; i++){
	  					var error = window.whBoard.error[i];
	  					if(error.hasOwnProperty('msg')){
	  						whBoard.view.displayMessage(error.msg, error.id, error.className);
	  					}
	  				}
	  				
	  				//window.whBoard.error = [];
	  				
	  			}
	  		}, 
	  		
	  		initDefaultInfo : function (e, myVideo, role){
	  			  //var clientNum = e.message.length;
	  			  //var  clientNum= e.message.checkUser.clientNum;
	  			  //var newuser =   e.message.checkUser.newUser;
	  			    var  clientNum =  e.message.checkUser.e.clientLen;
	  			    var newuser =   e.message.checkUser.e.newUser;
	  			  if(role == 't'){
//	  				  alert("suman bogati is hello");
//	  				  debugger;
		  				if(localStorage.getItem('orginalTeacherId') == null){
							whBoard.utility.setOrginalTeacherContent(e);
							//this may be set two attach function 
							window.whBoard.attachToolFunction(vcan.cmdWrapperDiv, true);
						}
	  		//	  }else if(role == 's' && e.newuser == null){
	  			 }else if(role == 's' && newuser == null){
		  				vcan.studentId = id;
						//localStorage.studentId = id;
//		  				if(localStorage.getItem('orginalTeacherId') != null){
//		  					localStorage.removeItem('orginalTeacherId');
//		  				}
//		  				
//		  				if(localStorage.getItem('teacherId') != null){
//		  					localStorage.removeItem('teacherId');
//		  				}
		  				
		  				
		  				if(localStorage.getItem('studentId') ==  null){
		  					localStorage.setItem('studentId', id);
		  				}
	  			  }
	  			  
//	  			  alert('number ' +  clientNum);
	  			  
				  if(clientNum == 1){
						vcan.vid = myVideo.init();
						myVideo.isInitiator = true;
						vcan.oneExecuted = false;
				  }else if(clientNum >= 2 && newuser == null){
					  console.log("browser number " + clientNum);
					  	  if(clientNum > 2){
					  		  alert("there may be the problem because of user is more than 2");
					  	  }
					  	
					  	 vm_chat.send({'videoInt' : true});
					  	 vm_chat.send({'isChannelReady' : true, 'memberAdded' : true});
						 vcan.oneExecuted = false;
		  				 vcan.vid = myVideo.init(); //this(webRtc) is not supported by safari
		  			}
			},
			
			
			checkWebRtcConnected : function(){
				if(typeof cthis != 'undefined'){
					//critical
					if(cthis.pc[0].hasOwnProperty('iceConnectionState') || typeof cthis.pc[0].iceConnectionState != 'undefined'){
						return true;
					}
				}
				return false;
			},
			
			createVirtualWindow : function (resolution){
			    
				//alert(resolution.width);
				var div = document.createElement('div');
				
				 whBoard.utility.removeVirtualWindow('virtualWindow');
				 	var divId = 'virtualWindow';
					div.setAttribute('id', divId);
					var offset =  vcan.main.offset;
					var drawWhiteboard = resolution;
					
					div.style.width = drawWhiteboard.width + "px";
					
					if(typeof assignRoleAtStudent != 'undefined'){
						var toolHeight = 0;
					}else{
						var toolHeight = parseInt(localStorage.getItem('toolHeight'));
						toolHeight = toolHeight != null ? toolHeight : 0;
					}
					
					if(localStorage.getItem('orginalTeacherId') !=  null){
						div.style.height = (drawWhiteboard.height + toolHeight) + "px";

					}else{
						
						if(localStorage.getItem('teacherId') !=  null){
							div.style.height = (drawWhiteboard.height) + "px";
						}else{
							div.style.height = (drawWhiteboard.height - toolHeight) + "px";
						}
					}
					 		

					
					var containerWhiteBoard = document.getElementById('containerWb');
					containerWhiteBoard.insertBefore(div, containerWhiteBoard.firstChild);
			},
			
			removeVirtualWindow : function (id){
				var virtualWindow = document.getElementById(id);
				if(virtualWindow != null){
					virtualWindow.parentNode.removeChild(virtualWindow);
				} 
			},
			
			getWideValueAppliedByCss : function (id, attr){
				var element = document.getElementById(id);
				if(element != null){
				    var style = window.getComputedStyle(element);
				    
				    if(typeof style.marginTop != 'undefined'){
				    	var marginTop = parseInt(style.marginTop.match(/\d+/));
				    	if(marginTop == null){
				    		marginTop = 0;
				    	}
				    }

				    return (element.clientHeight + marginTop);
				}else{
					return false;
				}
			},
			
			isNumber : function (num){
				if(!isNaN(+num)){
					return +num;
				}
				return false;
			}, 
			
			setCommandToolHeights : function (toolHeight, operation){
				var virDiv = document.getElementById('virtualWindow');
				if(virDiv !=  null){
					var divHeight = parseInt(virDiv.style.height.match(/\d+/));
					if(operation == 'decrement'){
						virDiv.style.height = (divHeight - parseInt(toolHeight))  + "px";
					}else{
						virDiv.style.height = (divHeight + parseInt(toolHeight))  + "px";
					}
				}
			},
			
			setClass : function (elmentId, newClass){
				var elem = document.getElementById(elmentId);
				var allClasses = elem.classList;
				var classes ="";
				if(allClasses.length > 0){
					 if(classes.length < 2){
						 classes = allClasses[0] + " ";
					 }else{
						 classes = allClasses.join(" ") + " ";
					 }
				}
				
				var classes = classes + newClass;
				elem.setAttribute('class', classes);
			}, 
			
			isUserConnected : function (userLength){
				//debugger;
				//ocalStorage.getItem('orginalTeacherId') != null is inserted for reclaim button
			//	if(userLength > 1 && (localStorage.getItem('teacherId') != null || localStorage.getItem('orginalTeacherId') != null)
			//  TODO there is need to roboust validation for check that user is connected 
				//alert(userLength.);
//				if(userLength > 1 || (userLength > 1 && localStorage.getItem('teacherId') != null || localStorage.getItem('orginalTeacherId') != null)	){
//					whBoard.user.connected = true;
//				}
				
				//if(userLength > 1 || (userLength > 1 && (localStorage.getItem('teacherId') != null || localStorage.getItem('orginalTeacherId') != null))){
				//alert(localStorage.getItem('otherRole'));
				if(userLength > 1 && localStorage.getItem('otherRole')){
					whBoard.user.connected = true;
				}
			},
			
			isUserConnected_old : function (userLength){
				if(userLength > 1){
					whBoard.user.connected = true;
				}
			},
			
			setStyleUserConnetion : function (currClass, newClass, whoIs){
				var cdiv = document.getElementsByClassName(currClass)[0];
				if(cdiv != null)
					cdiv.setAttribute('class', newClass + ' controlCmd');
			},
			
//			existUserLikeMe_devloping : function (e){
//				//alert(e.fromUser.userid);
//			 	if(e.fromUser.userid != id){
//			 		if(e.message.checkUser.hasOwnProperty('role')){
//			 			var role = e.message.checkUser.role;
//			 			if(role){
//			 				
//			 				if(localStorage.getItem('otherRole') ==  null){
//			 					var roles  = [];
//		 						roles.push(role);
//		 						//for now only roles are storing, ids need to store later perhaps
//		 						localStorage.setItem('otherRole', JSON.stringify(roles));
//			 				}else{
//			 					roles = JSON.parse(localStorage.getItem('otherRole'));
//			 					roles.push(role);
//			 				}
//			 				
//			 				localStorage.setItem('otherRole', roles);
//				 			console.log("Other Browser " + role + ' ' + e.fromUser.userid);
//		  				}
//			 		}
//			 	}else{
//			 		//var otherRole = localStorage.getItem('otherRole');
//			 		
//			 		var otherRoles = JSON.parse(localStorage.getItem('otherRole'));
//			 		
//			 		//alert(otherRoles[0]);
//			 		if(otherRoles != null){
//			 			for(var i=0; i<otherRoles.length; i++){
//			 				if(whBoard.currRole == otherRoles[i]){
//			 					return true;
//			 				}
//			 			}
//			 			return false;
//			 		}
//			 		
//			 		
//			 		
//			 		
////			 		if(otherRole != null){
////			 			if(otherRole != null){
////				 			if(otherRole == whBoard.currRole){
////				 				return true;
////				 			}else{
////								if(whBoard.currRole == 't'){
////									if(otherRole == 't'){
////					 					return true;
////					 				}else{
////					 					return false;
////					 				}
////								}else if(whBoard.currRole == 's'){
////									if(otherRole == 's'){
////					 					return true;
////					 				}else{
////					 					return false;
////					 				}
////								}
////				 			}
////				 		}
////				 		return false;
////			 		}
//			 	}
//			},
			
			existUserLikeMe : function (e){
			 	if(e.fromUser.userid != id){
			 		if(e.message.checkUser.hasOwnProperty('role')){
			 			var role = e.message.checkUser.role;
			 			if(role){
			 				if(localStorage.getItem('otherRole') ==  null){
			 					var roles  = [];
		 						//roles.push(role);
		 						if(role != whBoard.currRole){
			 						roles.push(role);
			 						//alert('tt');
//			 						/debugger;
			 					}else{
			 						existUser = true;
			 						return true;
			 					}
		 						//roles.push(role);
		 						
		 						//alert('this performing');
		 						//debugger;
		 						
			 					//var roles  = [];
		 						//roles.push(role);
		 						//for now only roles are storing, ids need to store later perhaps
		 					//	localStorage.setItem('otherRole', JSON.stringify(roles));
			 				}else{
			 					roles = JSON.parse(localStorage.getItem('otherRole'));
			 					if(roles.indexOf(role) == -1){
			 						roles.push(role);
			 					}
			 				}
			 				
			 				if(typeof roles != 'undefined'){
			 					localStorage.setItem('otherRole', JSON.stringify(roles));
			 					console.log("Other Browser " + role + ' ' + e.fromUser.userid);
			 				}
			 				
				 			
		  				}
			 			//alert("2");
//			 				var joinId = e.message.joinId;
//			 				if(joinId != e.fromUser.userid){
//								alert('Either Teacher Or Student is already existed, \nIt\'s also possible there other role is passing');
//
//			 				}
//							return;
			 			return (whBoard.currRole == role) ? true : false;
			 		}
			 	}else{
			 		
			 		if(typeof existUser != 'undefined'){
			 			return true;
			 		}else{
			 			var otherRoles = JSON.parse(localStorage.getItem('otherRole'));
				 		//alert(otherRoles[0]);
				 		if(otherRoles != null){
				 			for(var i=0; i<otherRoles.length; i++){
				 				if(whBoard.currRole == otherRoles[i]){
				 					return true;
				 				}
				 			}
				 			return false;
				 		}
			 		}
			 		
			 	}
			},
			
			makeUserAvailable : function (browerLength){
				whBoard.utility.isUserConnected(browerLength);
//				alert(whBoard.user.connected);
//				whBoard.user.connected = true; //this should be removed
				if(whBoard.user.connected){
//					/whBoard.userAvailable = true;
					if(localStorage.getItem('repObjs') == null){
						
						/*
						if(document.getElementById('commandToolsWrapper') != null){
							document.getElementById('commandToolsWrapper').style.zIndex = "0";
						} */
						
						whBoard.utility.toolWrapperEnable();
						if(vcan.main.canvas != null){
							whBoard.utility.makeCanvasEnable();
						}
					}
					
					whBoard.utility.setStyleUserConnetion('coff', 'con');
				}
			},
			
	
			displayCanvas : function(){
	    		window.whBoard.attachToolFunction(vcan.cmdWrapperDiv);
	        	window.whBoard.init();
	        	whBoard.utility.makeCanvasDisable();
	    	}, 
	    	
	        initAll : function (e) {
				if(localStorage.getItem('teacherId') != null){
	  				whBoard.utility.makeCanvasDisable();
				}
			
				var res = whBoard.system.measureResoultion({'width' : window.outerWidth, 'height' : window.innerHeight });
				
				var toolHeight = whBoard.utility.getWideValueAppliedByCss('commandToolsWrapper');
				if(toolHeight != false){
					vm_chat.send({'virtualWindow' : {'shareBrowserWidth':true, 'browserRes' : res, 'toolHeight' : toolHeight, 'role' : role}});
				}else{
					vm_chat.send({'virtualWindow' : {'shareBrowserWidth':true, 'browserRes': res, 'role' : role}});
				}	
			},
			
			alreadyExistToolBar : function (){
				var rectDiv = document.getElementById('t_rectangle');
				if(rectDiv != null){
					var allToolDivs = rectDiv.parentNode.getElementsByClassName('tool');
					return (allToolDivs.length >= 8) ? true : false;
				} 
			},
			

			alreadyExistPacketContainer : function (){
				var packDiv = document.getElementById('packetContainer');
				var infoDiv = document.getElementById('informationCont');
				
				if(packDiv.getElementsByTagName('div').length >= 2 || infoDiv.getElementsByTagName('div').length >= 1){
					return true;
				}else{
					return false;
				}
				
			},
			
			toolWrapperDisable : function (){
				var commandToolWrapper = document.getElementById('commandToolsWrapper') ;
				if(commandToolWrapper != null){
					commandToolWrapper.style.position = "relative";
					commandToolWrapper.style.zIndex = "-1000";
				} 
			},
			
			toolWrapperEnable : function (){
				var commandToolWrapper = document.getElementById('commandToolsWrapper') ;
				if(commandToolWrapper != null){
					commandToolWrapper.style.position = "relative";
					commandToolWrapper.style.zIndex = "0";
				} 
			}
			
			
//			connectionOptimization : function (){
//				if (typeof  lastarrowtime == 'undefined') {
//					lastarrowtime = new Date().getTime();
//					whBoard.sentPackets = whBoard.sentPackets + jobj.length;
//
//					if(this.sock.readyState == 1){
//						this.sock.send(jobj);
//					}
//					
//					vm_chat.updateSentInformation(jobj, true);
//				}
//				
//				presentarrowtime = new Date().getTime();
//				if ((presentarrowtime-lastarrowtime)>=100) {
//					whBoard.sentPackets = whBoard.sentPackets + jobj.length;
//					//this.sock.send(jobj);
//					if(this.sock.readyState == 1){
//						this.sock.send(jobj);
//					}
//					vm_chat.updateSentInformation(jobj, true);
//					lastarrowtime = new Date().getTime();
//				}
//			}
		};
	}
)(window);
