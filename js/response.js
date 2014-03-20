(
function (window){
	var connectNum = 0; //this would be delete 
	
	whBoard.response = {
		reclaimRole : function (formUserId, id){
			if(formUserId != id){
				whBoard.utility.removeToolBox();
				whBoard.utility.makeCanvasDisable();
    			if(typeof localStorage.teacherId != 'undefined'){
    				localStorage.removeItem('teacherId');
    			}
    			
    			whBoard.utility.uniqueArrOfObjsToOther();
    			whBoard.view.disappearBox('Canvas');
        		whBoard.view.disappearBox('drawArea');
        		
        		var canvasWrapper = document.getElementById("vcanvas");
				canvasWrapper.className = canvasWrapper.className.replace(/\bteacher\b/, ' ');
				canvasWrapper.className = 'student'
				localStorage.setItem('canvasDrwMsg', true);
//					localStorage.canvasDrwMsg = true;
				
				if(!whBoard.utility.chkValueInLocalStorage('orginialTeacherId')){
					whBoard.utility.setCommandToolHeights(toolHeight, 'decrement');
				}
			}else{
				if(whBoard.utility.chkValueInLocalStorage('orginialTeacherId')){
					var toolHeight = localStorage.getItem('toolHeight');
					whBoard.utility.setCommandToolHeights(toolHeight, 'increment');
				}	
				
				whBoard.utility.uniqueArrOfObjsToSelf();
				var canvasWrapper = document.getElementById("vcanvas");
				canvasWrapper.className = canvasWrapper.className.replace(/\bstudent\b/, ' ');
				canvasWrapper.className = 'teacher';
				localStorage.canvasDrwMsg = true;
				whBoard.utility.setStyleUserConnetion('coff', 'con');
			}
		}, 
		
		assignRole : function (fromUserId, id, socket, toolHeight){
			if(fromUserId != id){
				whBoard.socketOn = parseInt(socket);
				whBoard.utility.setClass('vcanvas', 'socketon');
				whBoard.utility.assignRole(id);
    			whBoard.utility.uniqueArrOfObjsToSelf();
    			
//					if(typeof localStorage.canvasDrwMsg == 'undefined'){
    			if(!whBoard.utility.chkValueInLocalStorage('canvasDrwMsg')){
    				window.whBoard.view.canvasDrawMsg('Canvas');
					window.whBoard.view.drawLabel('drawArea');
					localStorage.setItem('canvasDrwMsg', true);
				}		
    			
				var canvasWrapper = document.getElementById("vcanvas");
				canvasWrapper.className = canvasWrapper.className.replace(/\bstudent\b/, ' ');
				canvasWrapper.className = 'teacher';
				
				whBoard.user.connected  = true;
			
				var toolHeight = localStorage.getItem('toolHeight');
				whBoard.utility.setCommandToolHeights(toolHeight, 'increment');
				whBoard.utility.setStyleUserConnetion('coff', 'con', 'fromAssign');
				
			}else{
				whBoard.utility.uniqueArrOfObjsToOther();
				if(!whBoard.utility.chkValueInLocalStorage('orginalTeacherId')){
					var canvasWrapper = document.getElementById("vcanvas");
					canvasWrapper.className = canvasWrapper.className.replace(/\bteacher\b/, ' ');
					canvasWrapper.className = 'student';
				}
				if(localStorage.getItem('orginialTeacherId') ==  null){
					whBoard.utility.setCommandToolHeights(toolHeight, 'decrement');
				}
				
				localStorage.setItem('localStorage.canvasDrwMsg', true);
			}
		},
		
		videoInit : function (fromUserId, id){
			if(fromUserId != id){
				if(whBoard.videoAdd != true){
					vm_chat.send({'foundVideo' : false});
				}else{
					vm_chat.send({'foundVideo' : true, 'fromUser' : fromUserId});
				}
			}
		}, 
		
		foundVideo : function (foundVideo, formUserId){
			(!foundVideo) ? window.isVideoFound(false,  formUserId) : window.isVideoFound(true,  formUserId) ;
		},
		
		checkUser : function (e, id, storageHasTeacher){
			var joinId = e.message.joinId;
			whBoard.joinUserId = joinId;
			connectNum++; //TODO check this variable is need or not
			
			var alreadyExist = whBoard.utility.existUserLikeMe(e);
			if((e.fromUser.userid == id && e.fromUser.userid == joinId) ){
				setTimeout(
					function (){
						alreadyExist = whBoard.utility.existUserLikeMe(e);
						if(alreadyExist){
							var canvasContainer = document.getElementById('containerWb');
							canvasContainer.parentNode.removeChild(canvasContainer);
							alert('Either Teacher Or Student is already existed, \nIt\'s also possible there other role is passing');
							vm_chat.disconnect();
		  					return 'disconnect';	
						}else{
							
							whBoard.utility.shareVideoInformation(e, myVideo, storageHasTeacher);
							whBoard.utility.makeUserAvailable(e.message.checkUser.e.clientLen);
							if(whBoard.user.connected && !whBoard.drawMode){
								whBoard.utility.makeCanvasEnable();
							}
						}
						
					}, 1000  //time may increased according to server response
				);
			}else{
				whBoard.utility.makeUserAvailable(e.message.checkUser.e.clientLen);
			}
		}, 
		
		createPeer : function (currObj, peerObj, id){
			
			myVideo.currBrowser =  currObj;
			myVideo.peerBrowser =  peerObj;
			
			if(myVideo.currBrowser == id){
				if(typeof oneExecuted == 'undefined'){
					oneExecuted = true; //TODO this should be wrapper with some object
					vm_chat.send({'isChannelReady':true});
					vcan.myvid.init(true);
					myVideo.toUser = myVideo.peerBrowser;
				}
			}else{
				cthis.isStarted = false;
			}
 
		},
		
		video : function (formUserId, id, msgVideo){
			var video = vcan.myvid;
    		if(typeof video != 'undefined'){
    			if(msgVideo == 'bye'){
    				if(formUserId != id){
    					vcan.myvid.videoOnMsg(msgVideo, formUserId);
    				}
    			}else{
    				vcan.myvid.videoOnMsg(msgVideo, formUserId);
    			}
    		}
		},
		
		clearAll : function (formUserId, id, eMessage, orginalTeacherId){
			if(formUserId != id){
		  		  whBoard.tool = new whBoard.tool_obj('t_clearall');
				  whBoard.utility.t_clearallInit();
				  whBoard.utility.makeDefaultValue();
			}

			if(orginalTeacherId){
				whBoard.utility.updateRcvdInformation(eMessage);
			}
		},
		
		replayAll : function (){
			window.whBoard.vcan.main.replayObjs =  whBoard.gObj.replayObjs;
			whBoard.utility.clearAll(false);
			whBoard.toolInit('t_replay', 'fromFile');
		},
		
		createArrow : function (eMessage, orginalTeacherId){
			var imageElm = whBoard.arrImg;
			var obj = {};
			obj.mp = { x: eMessage.x, y: eMessage.y};
			whBoard.utility.drawArrowImg(imageElm, obj);
			if(orginalTeacherId){
				whBoard.utility.updateRcvdInformation(eMessage);
			}
		},
		
		replayObj : function (repObj){
			window.whBoard.vcan.main.replayObjs = [];
			if(repObj.length > 0){
				 if(vcan.renderedObjId + 1 == repObj[0].uid){
					 window.whBoard.vcan.main.replayObjs = repObj;
   					 whBoard.toolInit('t_replay', 'fromBrowser', true, whBoard.utility.packetQueue);
				 }
			}
		},
		
		chunk : function (fromUser,  id, repObj){
			whBoard.bridge.handleMissedPackets(fromUser, id, repObj);
		},
		
		//vcan.reachedItemId should be define into 
		//whBoard.reachedItemId
		repObjForMissedPkts : function (msgRepObj){
			if(vcan.reachedItemId != 0 || (whBoard.uid > 0 && vcan.reachedItemId == 0)){ //for handle very starting stage
				if((typeof msgRepObj == 'object' ||  msgRepObj instanceof Array)){
					 if(msgRepObj[0].hasOwnProperty('uid')){
						 if((vcan.reachedItemId+1 != msgRepObj[0].uid ) && (!msgRepObj.hasOwnProperty('chunk')) ){
							 if(Number(vcan.reachedItemId) < Number(msgRepObj[0].uid)){
								 endPoint = msgRepObj[0].uid; //this should be store into global object
								 whBoard.bridge.requestPackets(msgRepObj);
							 }  
						 }
					 }
				}
			}
		}
		
	};
}
)(window);
