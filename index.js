$.when(
		//$.getScript( "js/whiteboard.js" )
		/*$.getScript( "js/vcan.js" ),
		$.getScript( "js/script.js" ) */
		
 ).done(function(){
	$.uiBackCompat=false;
    $(document).ready(function(){
    	whBoard.system.setCanvasDimension();
		whBoard.utility.isSystemCompatible();
		
		if(window.whBoard.error.length > 2){
			window.whBoard.error = [];
			return;
		}
		
		whBoard.gObj.myrepObj = [];
    	whBoard.gObj.replayObjs = []; // this should contain either into whiteboard or into van object
    	whBoard.gObj.myArr = [];
    	
    	var orginalTeacherId = whBoard.utility.chkValueInLocalStorage('orginalTeacherId');
    	
    	if(whBoard.utility.chkValueInLocalStorage('reachedItemId')){
    		vcan.reachedItemId = parseInt(localStorage.reachedItemId);
    	}else{
    		vcan.reachedItemId = 0;
    	}
    	
    	whBoard.currId = id;
    	whBoard.currRole = role;
    	whBoard.utility.displayCanvas();
  
		window.addEventListener('click', function (){
    		whBoard.view.disappearBox('WebRtc')
    		whBoard.view.disappearBox('Canvas');
    		whBoard.view.disappearBox('drawArea');
    	});
    	
    	var storageHasReclaim = whBoard.utility.chkValueInLocalStorage('reclaim');
    	var storageHasTeacher = whBoard.utility.chkValueInLocalStorage('teacherId');
    	
    	whBoard.utility.setUserStatus(storageHasTeacher, storageHasReclaim);
    	whBoard.utility.removeOtherUserExist(role);
    	
    	if(storageHasReclaim){
    		var cmdToolsWrapper = document.getElementById(whBoard.commandToolsWrapperId);	
			while(cmdToolsWrapper.hasChildNodes()){
				cmdToolsWrapper.removeChild(cmdToolsWrapper.lastChild);
			}
    		whBoard.utility.createReclaimButton(cmdToolsWrapper);
    	}
    	
        var userobj={'userid':id,'name':name,'img':"http://static.vidyamantra.com/cdnmt/images/quality-support.png"};
        if(whBoard.system.webSocket){
         	vm_chat.init({
                'userid':id,
                'sid':sid,
                'rid': path,
                'authuser':auth_user,
                'authpass':auth_pass,
                'userobj': userobj,
                'fastchat_lasttime':'0',
                'fastchatroom_title':'fastchat',
                'fastchatroom_name':room});
        }
       	
        
        whBoard.utility.replayFromLocalStroage();
        
 		var oldData2 = whBoard.receivedPackets;
		setInterval(function (){
			if(document.getElementById(whBoard.receivedPackDivPS) != null){
				oldData2 = whBoard.utility.calcPsRecvdPackets(oldData2);
				document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
			}
			
		}, 1000);
    	
		myVideo = new window.whBoard.vcan.videoChat(); // this shold be contain into global object
		vcan.myvid = myVideo;
		vcan.renderedObjId = 0;
		
		$(document).on("user_logout", function(e){
			removedMemberId = e.fromUser.userid;
		});
		
//		function actionAfterRemovedUser(){
//			whBoard.utility.makeCanvasDisable();
//			whBoard.utility.setStyleUserConnetion('con', 'coff');
//
//			var vdiv = document.getElementById('virtualWindow');
//			if(vdiv != null){
//				vdiv.parentNode.removeChild(vdiv);
//			}
//			
//			whBoard.user.connected = false;
//			localStorage.removeItem('otherRole');
//			
//			if(typeof cthis != 'undefined'){
//				  tempIsInitiaor = true;
//				  if(cthis.isStarted){
//					  cthis.handleRemoteHangup();
//				  }
//			 }
//		}
		
		$(document).on("member_removed", function(e){
			whBoard.utility.userIds = [];
			if(e.message.length==1){
				whBoard.utility.actionAfterRemovedUser();
			}else{
				if(typeof removedMemberId != 'undefined'){
					for(var i=0; i<e.message.length; i++){
						if(e.message[i].userid == removedMemberId){
							whBoard.utility.actionAfterRemovedUser();
						}
					}
				}else{
					if(localStorage.getItem('orginalTeacherId') != null){
						alert("It seems that there is more than two user tried to connect");
					}
				}
			}
		});
		
		
		$(document).on("member_added", function(e){
//			document.getElementById('clientLength').innerHTML = e.message.length;
			whBoard.clientLen = e.message.length;
			vm_chat.send({'checkUser' : {'role':role, 'id' : id, 'e' : {'clientLen' :e.message.length, 'newUser' : e.newuser }}, 'joinId' : e.message[e.message.length-1].userid});
  		});
		
		
		whBoard.utility.crateCanvasDrawMesssage();
		
		vcan.tempArr = [];
		virtualWindow = false;
		var connectNum = 0;
		$(document).on("newmessage", function(e){
			if(e.message.hasOwnProperty('vidInit')){
	
//				if(e.fromUser.userid != id){
//					if(whBoard.videoAdd != true){
//						vm_chat.send({'foundVideo' : false});
//					}else{
//						vm_chat.send({'foundVideo' : true, 'fromUser' : e.fromUser.userid} );
//					}
//				}
				whBoard.response.videoInit(e.fromUser.userid, id);
				return;
			}else if(e.message.hasOwnProperty('foundVideo')){
				
//				if(e.message.foundVideo == false){
//					window.isVideoFound(false,  e.fromUser.userid);
//				}else{
//					window.isVideoFound(true,  e.fromUser.userid);
//				}
				
				whBoard.response.foundVideo(e.message.foundVideo,  e.fromUser.userid);
				return;
			}else if(e.message.hasOwnProperty('checkUser')){
//				var joinId = e.message.joinId;
//				whBoard.joinUserId = joinId;
//				connectNum++;
//				
//				var alreadyExist = whBoard.utility.existUserLikeMe(e);
//				if((e.fromUser.userid == id && e.fromUser.userid == joinId) ){
//					setTimeout(
//						function (){
//							alreadyExist = whBoard.utility.existUserLikeMe(e);
//							if(alreadyExist){
//								var canvasContainer = document.getElementById('containerWb');
//								canvasContainer.parentNode.removeChild(canvasContainer);
//								alert('Either Teacher Or Student is already existed, \nIt\'s also possible there other role is passing');
//								vm_chat.disconnect();
//			  					return;	
//							}else{
//								whBoard.utility.shareVideoInformation(e, myVideo, storageHasTeacher);
//								whBoard.utility.makeUserAvailable(e.message.checkUser.e.clientLen);
//								if(whBoard.user.connected && !whBoard.drawMode){
//									whBoard.utility.makeCanvasEnable();
//								}
//							}
//							
//						}, 1000  //time may increased according to server response
//					);
//				}else{
//					whBoard.utility.makeUserAvailable(e.message.checkUser.e.clientLen);
//				}
				
			 var disconnect = whBoard.response.checkUser(e, id, storageHasTeacher);
			 if(typeof disconnect != 'undefined'){
				 if(disconnect == 'diconnect'){
					 	return;
				 }
			 }
					
  			}else if(e.message.hasOwnProperty('virtualWindow')){
				whBoard.view.virtualWindow.manupulation(e);
  				return;
  			}else if(e.message.hasOwnProperty('createPeerObj')){
  				whBoard.response.createPeer(e.message.createPeerObj[0], e.message.createPeerObj[1], id);
  				
//  				myVideo.currBrowser =  e.message.createPeerObj[0];
//  				myVideo.peerBrowser =  e.message.createPeerObj[1];
//  				
//  				if(myVideo.currBrowser == id){
//  					if(typeof oneExecuted == 'undefined'){
//  						oneExecuted = true;
//  						vm_chat.send({'isChannelReady':true});
//  						vcan.myvid.init(true);
//  						myVideo.toUser = myVideo.peerBrowser;
//  					}
//  				}else{
//  					cthis.isStarted = false;
//  				}
//  				
  			}else if(e.message.hasOwnProperty('isChannelReady')){
  				e.message.isChannelReady = true; 
  				vcan.myvid.videoOnMsg(e.message, e.fromUser.userid);
    		}else if(e.message.hasOwnProperty('video')){
  				whBoard.response.video(e.fromUser.userid, id, e.message.video);
  				
//    			var video = vcan.myvid;
//        		if(typeof video != 'undefined'){
//        			if(e.message.video == 'bye'){
//        				if(e.fromUser.userid != id){
//        					vcan.myvid.videoOnMsg(e.message.video, e.fromUser.userid);
//        				}
//        			}else{
//        				vcan.myvid.videoOnMsg(e.message.video, e.fromUser.userid);
//        			}
//        		}
        	}else{
        		if(e.message.hasOwnProperty('reclaimRole')){
//        			if(e.fromUser.userid != id){
//        				whBoard.utility.removeToolBox();
//        				whBoard.utility.makeCanvasDisable();
//            			if(typeof localStorage.teacherId != 'undefined'){
//            				localStorage.removeItem('teacherId');
//            			}
//            			whBoard.utility.uniqueArrOfObjsToOther();
//            			whBoard.view.disappearBox('Canvas');
//                		whBoard.view.disappearBox('drawArea');
//                		
//                		var canvasWrapper = document.getElementById("vcanvas");
//						canvasWrapper.className = canvasWrapper.className.replace(/\bteacher\b/, ' ');
//						canvasWrapper.className = 'student'
//						localStorage.canvasDrwMsg = true;
//						
//						if(localStorage.getItem('orginialTeacherId') ==  null){
//							whBoard.utility.setCommandToolHeights(toolHeight, 'decrement');
//						}
//						
//						return;
//        			}else{
//        				if(localStorage.getItem('orginalTeacherId') !=  null){
//        					var toolHeight = localStorage.getItem('toolHeight');
//        					whBoard.utility.setCommandToolHeights(toolHeight, 'increment');
//						}	
//        				whBoard.utility.uniqueArrOfObjsToSelf();
//        				var canvasWrapper = document.getElementById("vcanvas");
//						canvasWrapper.className = canvasWrapper.className.replace(/\bstudent\b/, ' ');
//						canvasWrapper.className = 'teacher';
//						localStorage.canvasDrwMsg = true;
//						whBoard.utility.setStyleUserConnetion('coff', 'con');
//        				return;
//        			}
        			
        			whBoard.response.reclaimRole(e.fromUser.userid, id);
            		return;
        		}
        			
        		if(e.message.hasOwnProperty('assignRole')){
//        			var  toolHeight = e.message.toolHeight;
//        			if(e.fromUser.userid != id){
//        				
//        				whBoard.socketOn = parseInt(e.message.socket);
//        				whBoard.utility.setClass('vcanvas', 'socketon');
//        				whBoard.utility.assignRole(id);
//            			whBoard.utility.uniqueArrOfObjsToSelf();
//						if(typeof localStorage.canvasDrwMsg == 'undefined'){
//							window.whBoard.view.canvasDrawMsg('Canvas');
//							window.whBoard.view.drawLabel('drawArea');
//							localStorage.setItem('canvasDrwMsg', true);
//						}		
//						var canvasWrapper = document.getElementById("vcanvas");
//						canvasWrapper.className = canvasWrapper.className.replace(/\bstudent\b/, ' ');
//						canvasWrapper.className = 'teacher';
//						
//						whBoard.user.connected  = true;
//					
//						var toolHeight = localStorage.getItem('toolHeight');
//						whBoard.utility.setCommandToolHeights(toolHeight, 'increment');
//						whBoard.utility.setStyleUserConnetion('coff', 'con', 'fromAssign');
//            			return;
//        			}else{
//        				whBoard.utility.uniqueArrOfObjsToOther();
//        				if(!whBoard.utility.chkValueInLocalStorage('orginalTeacherId')){
//        					var canvasWrapper = document.getElementById("vcanvas");
//    						canvasWrapper.className = canvasWrapper.className.replace(/\bteacher\b/, ' ');
//    						canvasWrapper.className = 'student';
//        				}
//        				if(localStorage.getItem('orginialTeacherId') ==  null){
//        					whBoard.utility.setCommandToolHeights(toolHeight, 'decrement');
//        				}
//        				
//        				localStorage.setItem('localStorage.canvasDrwMsg', true);
//        				return;
//        			}
        			
//        			whBoard.utility.assignRole();
        			
        			whBoard.response.assignRole(e.fromUser.userid , id, e.message.socket, e.message.toolHeight);
        			return;
        		}
        		
        		whBoard.gObj.myrepObj = whBoard.vcan.getStates('replayObjs');
        		whBoard.gObj.chunk = [];
	    		
	    		if(e.message.hasOwnProperty('clearAll')){
	    			whBoard.response.clearAll(e.fromUser.userid , id, e.message, orginalTeacherId);
	    			
	    			
//    				if(e.fromUser.userid != id){
//				  		  whBoard.tool = new whBoard.tool_obj('t_clearall');
//						  whBoard.utility.t_clearallInit();
//						  whBoard.utility.makeDefaultValue();
//    				}
//
//					if(orginalTeacherId){
//						whBoard.utility.updateRcvdInformation(e.message);
//					}
//					return;
				}
	    		
	    		if(e.fromUser.userid != id){
	    			if(e.message.hasOwnProperty('repObj') && !e.message.hasOwnProperty('sentObj')){
	    				if(e.message.repObj[0].hasOwnProperty('uid')){
	    					//whBoard.uid = e.message.repObj[0].uid;
	    					//WARNING:- can be crtical 
	    					whBoard.uid = e.message.repObj[e.message.repObj.length-1].uid;
	    				}
	    				//if( vcan.renderedObjId > 0 && !e.message.hasOwnProperty('getMsPckt') && vcan.reachedItemId != 0){
	    				if( vcan.renderedObjId > 0 && !e.message.hasOwnProperty('getMsPckt') && !e.message.hasOwnProperty('chunk') && vcan.reachedItemId != 0){	  
	    					whBoard.bridge.makeQueue(e);
    		    		}
	        		}
	        		
	    		   if(e.message.hasOwnProperty('repObj')){
	    			   whBoard.response.repObjForMissedPkts(e.message.repObj); 
	    			   
//	    			   if(vcan.reachedItemId != 0 || (whBoard.uid > 0 && vcan.reachedItemId == 0)){ //for handle very starting stage
//	    					if((typeof e.message.repObj == 'object' ||  e.message.repObj instanceof Array)){
//	    						 if(e.message.repObj[0].hasOwnProperty('uid')){
//	    							 //request missed packets
//	    							 if((vcan.reachedItemId+1 != e.message.repObj[0].uid ) && (!e.message.hasOwnProperty('chunk')) ){
//	    								 if(Number(vcan.reachedItemId) < Number(e.message.repObj[0].uid)){
////	    									 console.log('Lid ' + vcan.reachedItemId + ' uid ' + e.message.repObj[0].uid);
//	    									 endPoint = e.message.repObj[0].uid;
//	    									 whBoard.bridge.requestPackets(e);
//	    								 }  
//									 }
//	    						 }
//	    					}
//	    				}
	    	    	}
	    		}
	    		
	    		if(e.fromUser.userid != id){
	    			if(e.message.hasOwnProperty('getMsPckt')){
	    				whBoard.bridge.sendPackets(e, whBoard.gObj.chunk);
	        		}
	    		}
	    	
	    		if(e.fromUser.userid != id){
		    		if(e.message.hasOwnProperty('createArrow')){
		    			
//		    			var imageElm = whBoard.arrImg;
//		    			var obj = {};
//		    			obj.mp = { x: e.message.x, y: e.message.y};
//		    			whBoard.utility.drawArrowImg(imageElm, obj);
//		    			if(orginalTeacherId){
//							whBoard.utility.updateRcvdInformation(e.message);
//						}
		    			
		    			whBoard.response.createArrow(e.message, orginalTeacherId);
		    		}else{
		    			if(!e.message.hasOwnProperty('replayAll') && !e.message.hasOwnProperty('getMsPckt') 
		    					&& !e.message.hasOwnProperty('checkUser') && !e.message.hasOwnProperty('videoInt')	
		    				){
	    						whBoard.utility.updateRcvdInformation(e.message.repObj[0]);
		    			}
		    		}
		    	}
	    		
	    		//initLoop = 0;
	    		if(!e.message.hasOwnProperty('clearAll') && !e.message.hasOwnProperty('replayAll')){
//	    			if(e.message.hasOwnProperty('repObj') && !e.message.hasOwnProperty('sentObj')){
	    			if(e.message.hasOwnProperty('repObj')){
	    				if(e.message.repObj.length > 1 && e.message.hasOwnProperty('chunk') && e.fromUser.userid == id){
	    					//TODO this have to be simpliefied.
	    				}else{
	    					if(vcan.reachedItemId+ 1 == e.message.repObj[0].uid) {
								for (var i=0; i<e.message.repObj.length; i++){
	    							 whBoard.gObj.replayObjs.push(e.message.repObj[i]);
	    						}
	    					}

    						if(typeof e.message.repObj[e.message.repObj.length-1] == 'object' ){
	        					if(e.message.repObj[e.message.repObj.length-1].hasOwnProperty('uid') && !e.message.hasOwnProperty('chunk')){
	        						vcan.reachedItemId = e.message.repObj[e.message.repObj.length-1].uid;
	        						localStorage.reachedItemId = vcan.reachedItemId; 
	            				}
	            				//missing one id
	        					if(vcan.tempArr.length > 0 && !e.message.hasOwnProperty('chunk')){
	        						vcan.reachedItemId = vcan.tempArr[vcan.tempArr.length-1].uid;
	        					}
	        				}
    						
    						if(e.fromUser.userid != id){
    							localStorage.repObjs = JSON.stringify(whBoard.gObj.replayObjs);
    						}else{
    							if(typeof vcan.reachedItemId != 'undefined'){
    								vcan.renderedObjId = vcan.reachedItemId 
    						    }
    						}
	    				}
	    				
	    				
//	    				if(e.message.repObj.length <= 1 && !e.message.hasOwnProperty('chunk') && e.fromUser.userid != id){
//	    					if(vcan.reachedItemId + 1 == e.message.repObj[0].uid) {
//								for (var i=0; i<e.message.repObj.length; i++){
//	    							 whBoard.gObj.replayObjs.push(e.message.repObj[i]);
//	    						}
//	    					}
//
//    						if(typeof e.message.repObj[e.message.repObj.length-1] == 'object' ){
//    							if(e.message.repObj[e.message.repObj.length-1].hasOwnProperty('uid') && !e.message.hasOwnProperty('chunk')){
//	        						vcan.reachedItemId = e.message.repObj[e.message.repObj.length-1].uid;
//	        						localStorage.setItem('reachedItemId', vcan.reachedItemId);
//
//	            				}
//	        					
//	            				if(vcan.tempArr.length > 0 && !e.message.hasOwnProperty('chunk')){
//	        						vcan.reachedItemId = vcan.tempArr[vcan.tempArr.length-1].uid;
//	        					}
//	        				}
//    						
//    						if(e.fromUser.userid != id){
//    							localStorage.repObjs = JSON.stringify(whBoard.gObj.replayObjs);
//    						}else{
//    							if(typeof vcan.reachedItemId != 'undefined'){
//    								vcan.renderedObjId = vcan.reachedItemId 
//    						    }
//    						}
//	    					
//	    				}
	    				
	    				if(e.message.hasOwnProperty('chunk') && e.fromUser.userid != id){
	    					whBoard.response.chunk(e.fromUser.userid, id,  e.message.repObj);
	    					
	    					
//	    					if(whBoard.gObj.myArr.length > 0){
//								if(e.message.repObj[e.message.repObj.length-1].uid == whBoard.gObj.myArr[0].uid){
//									for(var i=0; i< whBoard.gObj.myArr.length; i++){
//										console.log('mArr ' + whBoard.gObj.myArr[i].uid);
//									}
//									if(!whBoard.gObj.myArr[0].hasOwnProperty('cmd')){
//										whBoard.gObj.myArr.shift();
//									}
//								//	whBoard.gObj.myArr.shift(); //remove object if double id found
//								//	//alert("hi how are you");
//								}
//								e.message.repObj = e.message.repObj.concat(whBoard.gObj.myArr);
//								whBoard.gObj.myArr = [];
//							}
//	    					
//							whBoard.gObj.replayObjs = whBoard.gObj.replayObjs.concat(e.message.repObj);
//	    				
//	    					//TODO this should be removed later and above code should be enabled
//							// right now its doing sorting but above code should be enabled and object 
//							// should be stotred in sorted format
//	    					whBoard.gObj.replayObjs = whBoard.gObj.replayObjs.sort(function(a, b){
//	    					    return a.uid - b.uid;
//	    					});
//	    					
//	    					if(e.fromUser.userid != id){
//    							localStorage.repObjs = JSON.stringify(whBoard.gObj.replayObjs);
//    						}
//	    					
//	    					if(e.fromUser.userid != id && (vcan.renderedObjId + 1 != e.message.repObj[0].uid)){
//								if(vcan.tempArr.length > 0){
//									if(e.message.repObj[e.message.repObj.length-1].uid == vcan.tempArr[0].uid){
//		    							var fArr = e.message.repObj;
//		    							vcan.tempArr = fArr.concat(vcan.tempArr);
//									}
//								}
//	    					}
	    					
	    				}
	    			}
	    			
	    			if(orginalTeacherId){
	    				if(e.fromUser.userid != id ){
							if(e.message.hasOwnProperty('createArrow')){
								whBoard.receivedPackets = whBoard.receivedPackets + (JSON.stringify(e.message).length);
							}else if(!e.message.hasOwnProperty('getMsPckt') && !e.message.hasOwnProperty('checkUser') && !e.message.hasOwnProperty('videoInt')){
								whBoard.receivedPackets = whBoard.receivedPackets + (JSON.stringify(e.message.repObj).length);
							} 
							document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
						}
	    				if(typeof whBoard.receivedPackets != 'undefined'){
	    					localStorage.receivedPackets = whBoard.receivedPackets;
	    				}
	    			}
	    		}
	    		

	    		if(e.fromUser.userid != id){
//	    			if(e.message.hasOwnProperty('repObj') && !e.message.hasOwnProperty('sentObj')){
	    			if(e.message.hasOwnProperty('repObj')){
	    				whBoard.response.replayObj(e.message.repObj);
	    				
//	    				window.whBoard.vcan.main.replayObjs = [];
//	    				if(e.message.repObj.length > 0){ 
//	    					 if(vcan.renderedObjId + 1 == e.message.repObj[0].uid){
//								 window.whBoard.vcan.main.replayObjs = e.message.repObj;
//		       					 whBoard.toolInit('t_replay', 'fromBrowser', true, whBoard.utility.packetQueue);
//	    					 }
//	        			}
	    				
	    			}
	    		}

	    		
	    		if(e.message.hasOwnProperty('replayAll')){
	    			whBoard.response.replayAll();
	    			
//					window.whBoard.vcan.main.replayObjs =  whBoard.gObj.replayObjs;
//					whBoard.utility.clearAll(false);
//					whBoard.toolInit('t_replay', 'fromFile');
				}
    		}
    	});
   });
});

