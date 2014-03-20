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
				whBoard.response.videoInit(e.fromUser.userid, id);
				return;
			}else if(e.message.hasOwnProperty('foundVideo')){
				whBoard.response.foundVideo(e.message.foundVideo,  e.fromUser.userid);
				return;
			}else if(e.message.hasOwnProperty('checkUser')){
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
  			}else if(e.message.hasOwnProperty('isChannelReady')){
  				e.message.isChannelReady = true; 
  				vcan.myvid.videoOnMsg(e.message, e.fromUser.userid);
    		}else if(e.message.hasOwnProperty('video')){
  				whBoard.response.video(e.fromUser.userid, id, e.message.video);
        	}else{
        		if(e.message.hasOwnProperty('reclaimRole')){
        			whBoard.response.reclaimRole(e.fromUser.userid, id);
            		return;
        		}
        			
        		if(e.message.hasOwnProperty('assignRole')){
        			whBoard.response.assignRole(e.fromUser.userid , id, e.message.socket, e.message.toolHeight);
        			return;
        		}
        		
        		whBoard.gObj.myrepObj = whBoard.vcan.getStates('replayObjs');
        		whBoard.gObj.chunk = [];
	    		
	    		if(e.message.hasOwnProperty('clearAll')){
	    			whBoard.response.clearAll(e.fromUser.userid , id, e.message, orginalTeacherId);
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
	    	    	}
	    		}
	    		
	    		if(e.fromUser.userid != id){
	    			if(e.message.hasOwnProperty('getMsPckt')){
	    				whBoard.bridge.sendPackets(e, whBoard.gObj.chunk);
	        		}
	    		}
	    	
	    		if(e.fromUser.userid != id){
		    		if(e.message.hasOwnProperty('createArrow')){
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
	    				
		    			if(e.message.hasOwnProperty('chunk') && e.fromUser.userid != id){
		    					whBoard.response.chunk(e.fromUser.userid, id,  e.message.repObj);
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
	    			if(e.message.hasOwnProperty('repObj')){
	    				whBoard.response.replayObj(e.message.repObj);
	    			}
	    		}

	    		if(e.message.hasOwnProperty('replayAll')){
	    			whBoard.response.replayAll();
				}
    		}
    	});
   });
});

