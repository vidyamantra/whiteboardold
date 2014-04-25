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
    	
    	if(whBoard.utility.chkValueInLocalStorage('rcvdPackId')){
    		whBoard.gObj.rcvdPackId = parseInt(localStorage.rcvdPackId);
    	}else{
    		whBoard.gObj.rcvdPackId = 0;
    	}
    	
    	whBoard.gObj.uid = wbUser.id;
    	whBoard.gObj.uRole = wbUser.role;
    	whBoard.utility.displayCanvas();
  
        window.addEventListener('click', function (){
            
            whBoard.view.disappearBox('WebRtc')
            whBoard.view.disappearBox('Canvas');
            whBoard.view.disappearBox('drawArea'); 
    	});
    	
    	var storageHasReclaim = whBoard.utility.chkValueInLocalStorage('reclaim');
    	var storageHasTeacher = whBoard.utility.chkValueInLocalStorage('teacherId');
    	
    	whBoard.utility.setUserStatus(storageHasTeacher, storageHasReclaim);
    	whBoard.utility.removeOtherUserExist(wbUser.role);
    	
    	if(storageHasReclaim){
    		var cmdToolsWrapper = document.getElementById(whBoard.commandToolsWrapperId);	
			while(cmdToolsWrapper.hasChildNodes()){
				cmdToolsWrapper.removeChild(cmdToolsWrapper.lastChild);
			}
    		whBoard.utility.createReclaimButton(cmdToolsWrapper);
    	}
    	
    	
        var userobj={'userid':wbUser.id,'name':wbUser.name,'img':"http://static.vidyamantra.com/cdnmt/images/quality-support.png"};
        if(whBoard.system.webSocket){
        	vm_chat.init({
	            'userid':wbUser.id,
	            'sid':wbUser.sid,
	            'rid': wbUser.path,
	            'authuser':wbUser.auth_user,
	            'authpass':wbUser.auth_pass,
	            'userobj': userobj,
	            'fastchat_lasttime':'0',
	            'fastchatroom_title':'fastchat',
	            'fastchatroom_name':wbUser.room
	            });
        }
       	
        whBoard.utility.replayFromLocalStroage();
        
 		var oldData2 = whBoard.receivedPackets;
		setInterval(function (){
			if(document.getElementById(whBoard.receivedPackDivPS) != null){
				oldData2 = whBoard.utility.calcPsRecvdPackets(oldData2);
				document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
			}
		}, 1000);
    	
	//	myVideo = new window.whBoard.vcan.videoChat(); // this shold be contain into global object
		whBoard.gObj.video = new window.whBoard.vcan.videoChat();
		whBoard.gObj.displayedObjId = 0;
		
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
			vm_chat.send({'checkUser' : {'role':wbUser.role, 'id' : wbUser.id, 'e' : {'clientLen' :e.message.length, 'newUser' : e.newuser }}, 'joinId' : e.message[e.message.length-1].userid});
  		});
		
		whBoard.utility.crateCanvasDrawMesssage();
		
		whBoard.gObj.packQueue = [];
		whBoard.gObj.virtualWindow = false;

        $(document).on("newmessage", function(e){
            //secnod browser
            if(e.message.hasOwnProperty('videoDefault')){
                if(e.fromUser.userid != wbUser.id){
                    
                    cthis.pc = [];
                    cthis.isInitiator = false;
                    cthis.isChannelReady = true;
                    cthis.isStarted = false;
                    cthis.sendMessage('got user media');

                    return;     
                }
            }
            
            if(typeof cthis == 'object' && cthis.hasOwnProperty('pc')){
                if(cthis.hasOwnProperty('pc') && typeof cthis.pc[0]  != 'undefined'){
                    if(cthis.pc[0].iceConnectionState == 'disconnected'){
                        //browser 1
                        cthis.pc = [];
                        cthis.isStarted = false;
                        cthis.isInitiator = true;
                        cthis.isChannelReady = true;
                        vm_chat.send({'videoDefault' : true});
                        //cthis.maybeStart(e.fromUser.userid);
                        return;
                    }
                }
            }
            
			if(e.message.hasOwnProperty('vidInit')){
				whBoard.response.videoInit(e.fromUser.userid, wbUser.id);
				return;
			}else if(e.message.hasOwnProperty('foundVideo')){
				whBoard.response.foundVideo(e.message.foundVideo,  e.fromUser.userid);
				return;
			}else if(e.message.hasOwnProperty('checkUser')){
				var disconnect = whBoard.response.checkUser(e, wbUser.id, storageHasTeacher);
				if(typeof disconnect != 'undefined'){
					 if(disconnect == 'diconnect'){
                        return;
					 }
				 }
			}else if(e.message.hasOwnProperty('virtualWindow')){
				whBoard.view.virtualWindow.manupulation(e);
  				return;
  			}else if(e.message.hasOwnProperty('createPeerObj')){
  				whBoard.response.createPeer(e.message.createPeerObj[0], e.message.createPeerObj[1], wbUser.id);
  			}else if(e.message.hasOwnProperty('isChannelReady')){
  				e.message.isChannelReady = true; 
  				whBoard.gObj.video.videoOnMsg(e.message, e.fromUser.userid);
    		}else if(e.message.hasOwnProperty('video')){
  				whBoard.response.video(e.fromUser.userid, wbUser.id, e.message.video);
        	}else{
        		if(e.message.hasOwnProperty('reclaimRole')){
        			whBoard.response.reclaimRole(e.fromUser.userid, wbUser.id);
            		return;
        		}
        			
        		if(e.message.hasOwnProperty('assignRole')){
        			whBoard.response.assignRole(e.fromUser.userid , wbUser.id, e.message.socket, e.message.toolHeight);
        			return;
        		}
        		
        		whBoard.gObj.myrepObj = whBoard.vcan.getStates('replayObjs');
//        		whBoard.gObj.chunk = [];
	    		
	    		if(e.message.hasOwnProperty('clearAll')){
	    			whBoard.response.clearAll(e.fromUser.userid , wbUser.id, e.message, orginalTeacherId);
				}
	    		
	    		if(e.fromUser.userid != wbUser.id){
	    			if(e.message.hasOwnProperty('repObj') && !e.message.hasOwnProperty('sentObj')){
	    				if(e.message.repObj[0].hasOwnProperty('uid')){
	    					//whBoard.uid = e.message.repObj[0].uid;
	    					//WARNING:- can be crtical 
	    					 whBoard.uid = e.message.repObj[e.message.repObj.length-1].uid;
	    				}
	    				
	    				//if( whBoard.gObj.displayedObjId > 0 && !e.message.hasOwnProperty('getMsPckt') && whBoard.gObj.rcvdPackId != 0){
	    				if(whBoard.gObj.displayedObjId > 0 && !e.message.hasOwnProperty('getMsPckt') && !e.message.hasOwnProperty('chunk') && whBoard.gObj.rcvdPackId != 0){	  
	    					 whBoard.bridge.makeQueue(e);
    		    		}
	        		}
	        		
	    		   if(e.message.hasOwnProperty('repObj')){
	    			   whBoard.response.repObjForMissedPkts(e.message.repObj); 
	    	       }
	    		}
	    		
	    		if(e.fromUser.userid != wbUser.id){
	    			if(e.message.hasOwnProperty('getMsPckt')){
	    				whBoard.gObj.chunk =  [];
	    				var chunk = whBoard.bridge.sendPackets(e, whBoard.gObj.chunk);
	    				vm_chat.send({'repObj' : chunk, 'chunk' : true});
	        		}
	    		}
	    	
	    		if(e.fromUser.userid != wbUser.id){
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
	    				if(e.message.repObj.length > 1 && e.message.hasOwnProperty('chunk') && e.fromUser.userid == wbUser.id){
	    					//TODO this have to be simpliefied.
	    				}else{
	    					if(whBoard.gObj.rcvdPackId+ 1 == e.message.repObj[0].uid) {
								for (var i=0; i<e.message.repObj.length; i++){
	    							 whBoard.gObj.replayObjs.push(e.message.repObj[i]);
	    						}
	    					}

    						if(typeof e.message.repObj[e.message.repObj.length-1] == 'object' ){
	        					if(e.message.repObj[e.message.repObj.length-1].hasOwnProperty('uid') && !e.message.hasOwnProperty('chunk')){
	        						whBoard.gObj.rcvdPackId = e.message.repObj[e.message.repObj.length-1].uid;
//	        						localStorage.rcvdPackId = whBoard.gObj.rcvdPackId; 
	        						localStorage.setItem('rcvdPackId', whBoard.gObj.rcvdPackId);
	            				}
	            				//missing one id
	        					if(whBoard.gObj.packQueue.length > 0 && !e.message.hasOwnProperty('chunk')){
	        						whBoard.gObj.rcvdPackId = whBoard.gObj.packQueue[whBoard.gObj.packQueue.length-1].uid;
	        					}
	        				}
    						
    						if(e.fromUser.userid != wbUser.id){
    							//localStorage.repObjs = JSON.stringify(whBoard.gObj.replayObjs);
    							localStorage.setItem('repObjs', JSON.stringify(whBoard.gObj.replayObjs));
    						}else{
    							if(typeof whBoard.gObj.rcvdPackId != 'undefined'){
    								whBoard.gObj.displayedObjId = whBoard.gObj.rcvdPackId; 
    						    }
    						}
	    				}
	    				
		    			if(e.message.hasOwnProperty('chunk') && e.fromUser.userid != wbUser.id){
		    					whBoard.response.chunk(e.fromUser.userid, wbUser.id,  e.message.repObj);
		    			}
	    			}
	    			
	    			if(orginalTeacherId){
	    				if(e.fromUser.userid != wbUser.id ){
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
	    		
	    		if(e.fromUser.userid != wbUser.id){
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

