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
		
		whBoard.globalObj.myrepObj = [];
    	whBoard.globalObj.replayObjs = []; // this should contain either into whiteboard or into van object
    	whBoard.globalObj.myArr = [];
    	
    	var orginalTeacherId = whBoard.utility.chkValueInLocalStorage('orginalTeacherId');
    	
    	//this could be converted into ternary operator
    	if(whBoard.utility.chkValueInLocalStorage('reachedItemId')){
    		vcan.reachedItemId = parseInt(localStorage.reachedItemId);
    	}else{
    		vcan.reachedItemId = 0;
    	}
    	
    	whBoard.currId = id;
    	whBoard.currRole = role;
    	
//    	window.whBoard.attachToolFunction(vcan.cmdWrapperDiv);
//    	window.whBoard.init();
//    	whBoard.utility.makeCanvasDisable();
    	
    	whBoard.utility.displayCanvas();
  
		window.addEventListener('click', function (){
    		whBoard.view.disappearBox('WebRtc')
    		whBoard.view.disappearBox('Canvas');
    		whBoard.view.disappearBox('drawArea');
    	});
    	
    	var storageHasReclaim = whBoard.utility.chkValueInLocalStorage('reclaim');
    	var storageHasTeacher = whBoard.utility.chkValueInLocalStorage('teacherId');
    	
    	whBoard.utility.setUserStatus(storageHasTeacher, storageHasReclaim);
    	
//    	if(!storageHasTeacher && !storageHasReclaim){
//    		whBoard.utility.removeToolBox();
//    		whBoard.utility.setClass('vcanvas', 'student');
//		}else{
//			whBoard.utility.setClass('vcanvas', 'teacher');
//		}
    	
//	  if(role == 't'){
//		if(localStorage.getItem('studentId') != null){
//			localStorage.removeItem('studentId');
//			}
//	  }else if(role == 's'){
//          if(localStorage.getItem('orginalTeacherId') != null){
//			localStorage.removeItem('orginalTeacherId');
//			if(localStorage.getItem('teacherId') != null){
//				localStorage.removeItem('teacherId');
//				}
//			}
//	  }
    	
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
        
//    	if(typeof(Storage)!=="undefined"){
//			if(localStorage.repObjs){
//				var allRepObjs = JSON.parse(localStorage.repObjs);
//				whBoard.vcan.main.replayObjs = allRepObjs;
//				whBoard.utility.clearAll(false, 'dontClear');
//				
//				whBoard.globalObj.replayObjs = whBoard.globalObj.replayObjs.concat(allRepObjs);
//				if(allRepObjs.length > 0){
//					whBoard.uid = allRepObjs[allRepObjs.length-1].uid;
//					vcan.reachedItemId = whBoard.uid;
//				    whBoard.utility.makeCanvasDisable();
//                    whBoard.utility.toolWrapperDisable();
//					whBoard.toolInit('t_replay', 'fromBrowser', true, whBoard.utility.packetQueue);
//				}
//			}
//		}
    	
 		var oldData2 = whBoard.receivedPackets;
		setInterval(function (){
			if(document.getElementById(whBoard.receivedPackDivPS) != null){
				oldData2 = whBoard.utility.calcPsRecvdPackets(oldData2);
				document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
			}
			
		}, 1000);
    	
		var myVideo = new window.whBoard.vcan.videoChat();
		vcan.myvid = myVideo;
		vcan.renderedObjId = 0;
		
		$(document).on("member_removed", function(e){
			
			if(e.message.length==1){
				whBoard.utility.makeCanvasDisable();
				whBoard.utility.setStyleUserConnetion('con', 'coff');

				var vdiv = document.getElementById('virtualWindow');
				if(vdiv != null){
					vdiv.parentNode.removeChild(vdiv);
				}
				
				whBoard.user.connected = false;
				localStorage.removeItem('otherRole');
				
				//for control the video
				//when user is disconnected from internet
				  tempIsInitiaor = true;
				  if(cthis.isStarted){
					  cthis.handleRemoteHangup();
				  }
//				cthis.handleRemoteHangup();
//				cthis.pc = false;
			}else{
				if(localStorage.getItem('orginalTeacherId') != null){
					alert("It seems that there is more than two user tried to connect");
				}
			}
		});
		

		
//		function bootStrapCanvas(e) {
//			whBoard.utility.isUserConnected(e.message.length);
//			if(whBoard.user.connected){
//				whBoard.utility.setStyleUserConnetion('coff', 'con');
//			}
//			
//			if(typeof vcan.teacher == 'undefined' && !storageHasTeacher){
//				whBoard.utility.makeCanvasDisable();
//			}
//			
//			whBoard.utility.initDefaultInfo(e,  myVideo, role);
//			var res = whBoard.system.measureResoultion({'width' : window.outerWidth, 'height' : window.innerHeight });
//			
//			var toolHeight = whBoard.utility.getWideValueAppliedByCss('commandToolsWrapper');
//			if(toolHeight != false){
//				vm_chat.send({'virtualWindow' : {'shareBrowserWidth':true, 'browserRes' : res, 'toolHeight' : toolHeight}});
//			}else{
//				vm_chat.send({'virtualWindow' : {'shareBrowserWidth':true, 'browserRes': res}});
//			}
//		}
		
		$(document).on("member_added", function(e){
//			alert("nothing happend");
//			document.getElementById('clientLength').innerHTML = e.message.length;
			whBoard.clientLen = e.message.length;
			vm_chat.send({'checkUser' : {'role':role, 'e' : {'clientLen' :e.message.length, 'newUser' : e.newuser }}, 'joinId' : e.message[e.message.length-1].userid});
  		});
		
		
		whBoard.utility.crateCanvasDrawMesssage();
		
//		if(typeof localStorage.teacherId != 'undefined'){
//			if(typeof localStorage.canvasDrwMsg == 'undefined'){
//				window.whBoard.view.canvasDrawMsg('Canvas');
//				window.whBoard.view.drawLabel('drawArea');
//				localStorage.canvasDrwMsg = true;
//			}
//    	}
		
		vcan.tempArr = [];
		virtualWindow = false;
		var connectNum = 0;
		$(document).on("newmessage", function(e){
			if(e.message.hasOwnProperty('vidInit')){
				if(e.fromUser.userid != id){
					if(whBoard.videoAdd != true){
//						cthis.isInitiator = true;
						vm_chat.send({'foundVideo' : false});
					}else{
						vm_chat.send({'foundVideo' : true, 'fromUser' : e.fromUser.userid} );
					}
				}
				return;
			}else if(e.message.hasOwnProperty('foundVideo')){
				
				if(e.message.foundVideo == false){
//					alert(vcan.myvid);
					window.isVideoFound(false,  e.fromUser.userid);
//					vcan.myvid.isVideoFound(false,  e.fromUser.userid);
				}else{
//					alert(vcan.myvid);
					window.isVideoFound(true,  e.fromUser.userid);
//					vcan.myvid.isVideoFound(true,  e.fromUser.userid);
				}
				return;
			}else if(e.message.hasOwnProperty('checkUser')){
				var joinId = e.message.joinId;
				whBoard.joinUserId = joinId;
				connectNum++;
				var alreadyExist = whBoard.utility.existUserLikeMe(e);
				console.log('form Id' +  e.fromUser.userid);
					if((e.fromUser.userid == id && e.fromUser.userid == joinId) ){
						setTimeout(
							function (){
								alreadyExist = whBoard.utility.existUserLikeMe(e);
								if(alreadyExist){
									var canvasContainer = document.getElementById('containerWb');
									canvasContainer.parentNode.removeChild(canvasContainer);
									alert('Either Teacher Or Student is already existed, \nIt\'s also possible there other role is passing');
									vm_chat.disconnect();
				  					return;	
								}else{
//									bootStrapCanvas(e);
									whBoard.utility.shareVideoInformation(e, myVideo, storageHasTeacher);
									whBoard.utility.makeUserAvailable(e.message.checkUser.e.clientLen);
								}
								
							}, 1000  //time may increased according to server response
						);
				}else{
					whBoard.utility.makeUserAvailable(e.message.checkUser.e.clientLen);
				}
  			}else if(e.message.hasOwnProperty('virtualWindow')){
				whBoard.view.virtualWindow.manupulation(e);
  				return;
  			}else if(e.message.hasOwnProperty('createPeerObj')){
  				myVideo.currBrowser =  e.message.createPeerObj[0];
  				myVideo.peerBrowser =  e.message.createPeerObj[1];
  				if(myVideo.currBrowser == id){
  					if(typeof oneExecuted == 'undefined'){
  						oneExecuted = true;
  						vm_chat.send({'isChannelReady':true});
  						vcan.myvid.init(true);
  						myVideo.toUser = myVideo.peerBrowser;
  					}
  				}else{
  					cthis.isStarted = false;
  				}
  			}else if(e.message.hasOwnProperty('isChannelReady')){
  				
//  				if(e.message.hasOwnProperty('memberAdded')){
//  					alert('suma bogati');
//  					if(localStorage.getItem('teacherId') != null){
//  						whBoard.utility.makeCanvasEnable();
//  						whBoard.utility.setClass('connectInfo', 'con');
//  					
//  					}
//  				}
  				
  				e.message.isChannelReady = true; 
  				
//  				vcan.myvid.videoOnMsg(e.message);
  				vcan.myvid.videoOnMsg(e.message, e.fromUser.userid);
    		}else if(e.message.hasOwnProperty('video')){
    			var video = vcan.myvid;
        		if(typeof video != 'undefined'){
        			if(e.message.video == 'bye'){
        				if(e.fromUser.userid != id){
//        					vcan.myvid.videoOnMsg(e.message.video);
        					vcan.myvid.videoOnMsg(e.message.video, e.fromUser.userid);
        				}
        			}else{
//        				vcan.myvid.videoOnMsg(e.message.video);
        				vcan.myvid.videoOnMsg(e.message.video, e.fromUser.userid);
        			}
        		}
        	}else{
        		if(e.message.hasOwnProperty('reclaimRole')){
        			if(e.fromUser.userid != id){
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
						localStorage.canvasDrwMsg = true;
						
						if(localStorage.getItem('orginialTeacherId') ==  null){
							whBoard.utility.setCommandToolHeights(toolHeight, 'decrement');
						}
						
						return;
        			}else{
        				if(localStorage.getItem('orginalTeacherId') !=  null){
        					var toolHeight = localStorage.getItem('toolHeight');
        					whBoard.utility.setCommandToolHeights(toolHeight, 'increment');
						}	
        				whBoard.utility.uniqueArrOfObjsToSelf();
        				var canvasWrapper = document.getElementById("vcanvas");
						canvasWrapper.className = canvasWrapper.className.replace(/\bstudent\b/, ' ');
						canvasWrapper.className = 'teacher';
						localStorage.canvasDrwMsg = true;

						whBoard.utility.setStyleUserConnetion('coff', 'con');
						//whBoard.utility.makeCanvasEnable();
						
						//document.getElementsByClassName('coff')[0].className = 'con controlCmd';
        				return;
        			}
        		}
        		
        		if(e.message.hasOwnProperty('assignRole')){
        			var  toolHeight = e.message.toolHeight;
        			if(e.fromUser.userid != id){
        				
        				whBoard.socketOn = parseInt(e.message.socket);
        				whBoard.utility.setClass('vcanvas', 'socketon');
        				whBoard.utility.assignRole(id);
            			whBoard.utility.uniqueArrOfObjsToSelf();
						if(typeof localStorage.canvasDrwMsg == 'undefined'){
							window.whBoard.view.canvasDrawMsg('Canvas');
							window.whBoard.view.drawLabel('drawArea');
							//localStorage.canvasDrwMsg = true;
							localStorage.setItem('canvasDrwMsg', true);
						//	var toolHeight = localStorage.getItem('toolHeight')
							
							
						}		
						var canvasWrapper = document.getElementById("vcanvas");
						canvasWrapper.className = canvasWrapper.className.replace(/\bstudent\b/, ' ');
						canvasWrapper.className = 'teacher';
						
						whBoard.user.connected  = true;
					
						var toolHeight = localStorage.getItem('toolHeight');
						whBoard.utility.setCommandToolHeights(toolHeight, 'increment');
						whBoard.utility.setStyleUserConnetion('coff', 'con', 'fromAssign');

					//	document.getElementsByClassName('coff')[0].className = 'con controlCmd';
            			return;
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
        				return;
        			}
        		}
        		
        		whBoard.globalObj.myrepObj = whBoard.vcan.getStates('replayObjs');
        		whBoard.globalObj.chunk = [];
	    		
	    		if(e.message.hasOwnProperty('clearAll')){
	    				if(e.fromUser.userid != id){
					  		  whBoard.tool = new whBoard.tool_obj('t_clearall');
							  whBoard.utility.t_clearallInit();
							  whBoard.utility.makeDefaultValue();
	    				}

						if(orginalTeacherId){
							whBoard.utility.updateRcvdInformation(e.message);
						}
						
						return;
				
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
	    	//		if(e.message.hasOwnProperty('repObj') && e.fromUser.userid != id){
	    				if(vcan.reachedItemId != 0 || (whBoard.uid > 0 && vcan.reachedItemId == 0)){ //for handle very starting stage
	    					if((typeof e.message.repObj == 'object' ||  e.message.repObj instanceof Array)){
	    						 if(e.message.repObj[0].hasOwnProperty('uid')){
	    							 //request missed packets
	    							 
	    							 if((vcan.reachedItemId+1 != e.message.repObj[0].uid ) && (!e.message.hasOwnProperty('chunk')) ){
	    								 if(Number(vcan.reachedItemId) < Number(e.message.repObj[0].uid)){
	    									 console.log('Lid ' + vcan.reachedItemId + ' uid ' + e.message.repObj[0].uid);
	    									 endPoint = e.message.repObj[0].uid;
	    									 whBoard.bridge.requestPackets(e);
	    									 
	    								 }  
									 }
	    						 }
	    					}
	    				}
	    	    	}
	    		}
	    		
	    		if(e.fromUser.userid != id){
	    			if(e.message.hasOwnProperty('getMsPckt')){
	    				whBoard.bridge.sendPackets(e, whBoard.globalObj.chunk);
	        		}
	    		}
	    	
	    		if(e.fromUser.userid != id){
		    		if(e.message.hasOwnProperty('createArrow')){
		    			var imageElm = whBoard.arrImg;
		    			var obj = {};
		    			obj.mp = { x: e.message.x, y: e.message.y};
		    			whBoard.utility.drawArrowImg(imageElm, obj);
		    			
		    			if(orginalTeacherId){
							whBoard.utility.updateRcvdInformation(e.message);
						}
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
	    			if(e.message.hasOwnProperty('repObj') && !e.message.hasOwnProperty('sentObj')){
	    				if(e.message.repObj.length > 1 && e.message.hasOwnProperty('chunk') && e.fromUser.userid == id){
	    					//TODO this have to be simpliefied.
	    				}else{
							if(vcan.reachedItemId+ 1 == e.message.repObj[0].uid) {
								for (var i=0; i<e.message.repObj.length; i++){
	    							 whBoard.globalObj.replayObjs.push(e.message.repObj[i]);
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
    							localStorage.repObjs = JSON.stringify(whBoard.globalObj.replayObjs);
    						}else{
    							if(typeof vcan.reachedItemId != 'undefined'){
    								vcan.renderedObjId = vcan.reachedItemId 
    						    }
    						}
	    					
	        			}
	    				
	    				if(e.message.hasOwnProperty('chunk') && e.fromUser.userid != id){
	    					if(whBoard.globalObj.myArr.length > 0){
								if(e.message.repObj[e.message.repObj.length-1].uid == whBoard.globalObj.myArr[0].uid){
									for(var i=0; i< whBoard.globalObj.myArr.length; i++){
										console.log('mArr ' + whBoard.globalObj.myArr[i].uid);
									}
									if(!whBoard.globalObj.myArr[0].hasOwnProperty('cmd')){
										whBoard.globalObj.myArr.shift();
									}
								//	whBoard.globalObj.myArr.shift(); //remove object if double id found
								//	//alert("hi how are you");
								}
								e.message.repObj = e.message.repObj.concat(whBoard.globalObj.myArr);
								whBoard.globalObj.myArr = [];
							}
	    					
							whBoard.globalObj.replayObjs = whBoard.globalObj.replayObjs.concat(e.message.repObj);
	    				
	    					//TODO this should be removed later and above code should be enabled
							// right now its doing sorting but above code should be enabled and object 
							// should be stotred in sorted format
	    					whBoard.globalObj.replayObjs = whBoard.globalObj.replayObjs.sort(function(a, b){
	    					    return a.uid - b.uid;
	    					});
	    					
	    					if(e.fromUser.userid != id){
    							localStorage.repObjs = JSON.stringify(whBoard.globalObj.replayObjs);
    						}
	    					
	    					if(e.fromUser.userid != id && (vcan.renderedObjId + 1 != e.message.repObj[0].uid)){
								if(vcan.tempArr.length > 0){
									if(e.message.repObj[e.message.repObj.length-1].uid == vcan.tempArr[0].uid){
	    							//e.message.repObj.pop();
	    							var fArr = e.message.repObj;
	    							//vcan.tempArr.unshift();
	    							vcan.tempArr = fArr.concat(vcan.tempArr);
									}else if(e.message.repObj[e.message.repObj.length-1].uid == vcan.tempArr[0].uid){
										//alert('suman bogati');
									}
								}
	    					}
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
	    			if(e.message.hasOwnProperty('repObj') && !e.message.hasOwnProperty('sentObj')){
	    				window.whBoard.vcan.main.replayObjs = [];
	    				if(e.message.repObj.length > 0){ 
	    					 if(vcan.renderedObjId + 1 == e.message.repObj[0].uid){
								 window.whBoard.vcan.main.replayObjs = e.message.repObj;
		       					 whBoard.toolInit('t_replay', 'fromBrowser', true, whBoard.utility.packetQueue);
	    					 }
	        			}
	    			}
	    		}

	    		if(e.message.hasOwnProperty('replayAll')){
					window.whBoard.vcan.main.replayObjs =  whBoard.globalObj.replayObjs;
					whBoard.utility.clearAll(false);
					whBoard.toolInit('t_replay', 'fromFile');
				}
    		}
    	});
   });
});

