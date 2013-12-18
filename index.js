/*var cssId = 'myCss';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'css/styles.css'; 
    link.media = 'all';
    head.appendChild(link);
}

var cssId = 'myCss1';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId)){
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';

    link.media = 'all';
    head.appendChild(link);
}*/
$.when(
		//$.getScript( "js/whiteboard.js" )
		/*$.getScript( "js/vcan.js" ),
		$.getScript( "js/script.js" ) */
		
 ).done(function(){
	  repObjQue = []
	 //mysuman = false;
	 $.uiBackCompat=false;
    //place your code here, the scripts are all loaded
    var userobj={'userid':id,'name':name,'img':"http://static.vidyamantra.com/cdnmt/images/quality-support.png"};
    	vm_chat.init({
            'userid':id,
            'sid':'212',
            'rid': path,
            'authuser':auth_user,
            'authpass':auth_pass,
            'userobj': userobj,
            'fastchat_lasttime':'0',
            'fastchatroom_title':'fastchat',
            'fastchatroom_name':'room1'});
        //ToDo:room name contain licencekey,couse id and activity id   
        
	$(document).ready(function(){
		myrepObj = [];
    	replayObjs = []; // this should contain either into whiteboard or into van object
    	
    	if(localStorage.hasOwnProperty('lastId')){
    		vcan.lastId = parseInt(localStorage.lastId);
    	}else{
    		vcan.lastId = 0;
    	}
    	
    	
    	window.whBoard.attachToolFunction('commandToolsWrapper');
    	window.whBoard.init();
    	if(typeof(Storage)!=="undefined"){
			if(localStorage.repObjs){
				//alert('hello guys');
				var allRepObjs = JSON.parse(localStorage.repObjs);
				whBoard.vcan.main.replayObjs = allRepObjs;
				whBoard.utility.clearAll(false, 'dontClear');
				whBoard.toolInit('t_replay', 'fromBrowser');
				for(i=0; i<allRepObjs.length; i++){
					replayObjs.push(allRepObjs[i]);
				}
			}
		}
    	
 		var oldData2 = whBoard.receivedPackets;
		setInterval(function (){
			oldData2 = whBoard.utility.calcPsRecvdPackets(oldData2);
			document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
		}, 1000);
    	
		
		var prvPacket = "";
		var currElement = "";
		whBoard.sentReq = false;
		bcount = 0;
		var myVideo = new window.whBoard.vcan.videoChat();
		vcan.myvid = myVideo;
		
		vcan.renderedObjId = 0;
		function chkAlreadyConnected(){
			if(typeof cthis != 'undefined'){
				//0 should be inxex as user increased
				//the second condition is set for for firefox as the first is not applying in Chrome browser
				if(cthis.pc[0].hasOwnProperty('iceConnectionState') || typeof cthis.pc[0].iceConnectionState != 'undefined'){
					return true;
				}
			}
			return false
		}
		
		
		$(document).on("member_removed", function(e){
//			if(typeof myVideo != 'undefined'){
//				//alert("suman bogati");
//				//debugger;
//				myVideo.hangup();
//			}
		});
		
		
		$(document).on("member_added", function(e){
				
			//vm_chat.send({'suman': '27'}, 23);
			myVideo.id = id;
			myVideo.browserLen = e.message.length;
			
			//This one is video part
			var clientNum = e.message.length;
				//browser A
				if(clientNum == 1){
					if(!chkAlreadyConnected()){
						//alert("this is not performing");
						myVideo.isInitiator = true;
						vcan.oneExecuted = false;
						vcan.vid = myVideo.init();
					}
				//browser B
				}else if(clientNum == 2 && e.newuser == null){
					if(!chkAlreadyConnected()){
						vm_chat.send({'isChannelReady':true});
						vcan.oneExecuted = false;
	  					vcan.vid = myVideo.init();
					}
				//browser C and More	
	  			}else if(clientNum > 2){
	  				if(!chkAlreadyConnected()){
		  				var currBrowser =  e.message[e.message.length-1].userid; 
		  				var peerBrowser =  e.message[0].userid;
		  				
		  				/* in actual this statement would executed
		  				for(var i=0; i<e.message.length; i++){
		  					vm_chat.send({'createPeerObj': [currBrowser, e.message[i].userid]});
		  				} */
		  				vm_chat.send({'createPeerObj': [currBrowser, peerBrowser]});
	  				}
	  			}
			});
		
		tempArr = [];
  		$(document).on("newmessage", function(e){
  			//video part
  			if(e.message.hasOwnProperty('createPeerObj')){
  				myVideo.currBrowser =  e.message.createPeerObj[0];
  				myVideo.peerBrowser =  e.message.createPeerObj[1];
  				if(myVideo.currBrowser == id){
  					if(typeof oneExecuted == 'undefined'){
  						oneExecuted = true;
  						vm_chat.send({'isChannelReady':true});
  						vcan.myvid.init(true);
  						//toUse 
  						myVideo.toUser = myVideo.peerBrowser;
  					}
  				}else{
  					cthis.isStarted = false;
  				}
  				
  			}else if(e.message.hasOwnProperty('isChannelReady')){
  				e.message.isChannelReady = true; 
  				vcan.myvid.videoOnMsg(e.message);
    		}else if(e.message.hasOwnProperty('video')){
    			var video = vcan.myvid;
        		if(typeof video != 'undefined'){
        			if(e.message.video == 'bye'){
        				if(e.fromUser.userid != id){
        					vcan.myvid.videoOnMsg(e.message.video);
        				}
        			}else{
        				vcan.myvid.videoOnMsg(e.message.video);
        			}
        		}
        	}else{
        		
    			if(e.message.hasOwnProperty('repObj') && e.message.hasOwnProperty('sentObj')){
					whBoard.sentReq = false;
				}
	    		
	    		myrepObj = whBoard.vcan.getStates('replayObjs');
	    		chunk = [];
	    		if(e.fromUser.userid != id){
	    			if(e.message.hasOwnProperty('repObj')){
	    				if(e.message.repObj[0].hasOwnProperty('uid')){
	    				//if(e.message.repObj.length > 0 && e.message.repObj[0].hasOwnProperty('uid')){
	    					whBoard.uid = e.message.repObj[0].uid;
	    				}
	    				//if( vcan.renderedObjId > 0 && !e.message.hasOwnProperty('getMsPckt') && vcan.lastId != 0){
	    				if( vcan.renderedObjId > 0 && !e.message.hasOwnProperty('getMsPckt') && !e.message.hasOwnProperty('chunk') && vcan.lastId != 0){	    				
    						if(vcan.lastId != vcan.renderedObjId){
    							if(vcan.lastId != vcan.renderedObjId){
        							//tempArr.push(e.message.repObj[0]);
    								for(var i=0; i<e.message.repObj.length; i++){
    									tempArr.push(e.message.repObj[i]);
    								}
        						}
    						}
    		    		}	
	        		}
	    			
	    			if(e.message.hasOwnProperty('repObj')){
	    				if(e.message.repObj.length > 0 && e.message.repObj[0].hasOwnProperty('uid')){
	    					console.log('uid ' + e.message.repObj[0].uid);
	    				}
	        		}
	    			
	    			if(e.message.hasOwnProperty('repObj') && whBoard.sentReq == false){
	    				if(vcan.lastId != 0 || (whBoard.uid > 0 && vcan.lastId == 0)){ //for handle very starting stage
	    					if((typeof e.message.repObj == 'object' || typeof e.message.repObj instanceof Array)){
	    						 if(e.message.repObj[0].hasOwnProperty('uid')){
	    							 //request missed packets
	    							 if(vcan.lastId+1 != e.message.repObj[0].uid){
	    								 requestPackets(e);
//	    								whBoard.sentReq = true;
//	    								var sp = vcan.lastId;
//		        	    				var ep = e.message.repObj[0].uid;
//		        	    				if(vcan.lastId == vcan.renderedObjId){
//		        	    					vm_chat.send({'getMsPckt' : [sp, ep]}); //will have to request to teacher
//			        	    				return;
//		        	    				}
			
	    							}
	    				 		 }
	    					}
	    				}
	    	    	}
	    		}
	    		
	    		
	    		
	    		if(e.fromUser.userid != id){
	    			//alert('suman bgoa');
	    			if(e.message.hasOwnProperty('getMsPckt')){
	    				//send requested packets
	    				sendPackets(e);
	    				
//	    				if(e.message.getMsPckt[0] == 0){
//	    					var i = -1;
//	    				}else{
//	    					var fs = e.message.getMsPckt[0].uid;
//		    				for(var i=0; i<myrepObj.length; i++){
//		        				if(e.message.getMsPckt[0] == myrepObj[i].uid){
//		        					fs =  e.message.getMsPckt[0];
//		        					break;
//		        				}
//		    				}
//	    				}
//	    	
//	    				for(var j=i+1; j<myrepObj.length; j++){
//	    					chunk.push(myrepObj[j]);
//	    				}
//	    				vm_chat.send({'repObj' : chunk, 'chunk' : true});
//	    				return;
	        		}
	    		}
	    		
	    		
	    		
	    		var	updateRcvdInformation =  function (msg){
	    			var compMsg = "";
	    			for(var key in msg){
	    				compMsg += key +" : " + msg[key] + " <br />";
	    			}
	    			document.getElementById('rcvdMsgInfo').innerHTML = compMsg;
	    		}
	    	
	    		if(e.fromUser.userid != id){
		    		if(e.message.hasOwnProperty('createArrow')){
		    			var imageElm = whBoard.arrImg;
		    			var obj = {};
		    			obj.mp = { x: e.message.x, y: e.message.y};
		    			whBoard.utility.drawArrowImg(imageElm, obj);
		    			updateRcvdInformation(e.message);
		    		}else if(e.message.hasOwnProperty('clearAll')){
		    			//vcan.lastId = 0;
		    			updateRcvdInformation(e.message);
		    		}else{
		    			if(!e.message.hasOwnProperty('replayAll') && !e.message.hasOwnProperty('getMsPckt')){
		    				updateRcvdInformation(e.message.repObj[0]);
		    			}
		    		}
		    	}
	    		
	    		initLoop = 0;
	    		if(!e.message.hasOwnProperty('clearAll') && !e.message.hasOwnProperty('replayAll')){
	    			if(e.message.hasOwnProperty('repObj') && !e.message.hasOwnProperty('sentReq')){
	    				if(e.message.repObj.length > 1 && e.message.hasOwnProperty('chunk') && e.fromUser.userid == id){
	    					
	    				}else{
    						for (var i=0; i<e.message.repObj.length; i++){
    							if(vcan.renderedObjId + 1 == e.message.repObj[0].uid) {
    								replayObjs.push(e.message.repObj[i]);
    							}
    						}

    						if(typeof e.message.repObj[e.message.repObj.length-1] == 'object' ){
	        					if(e.message.repObj[e.message.repObj.length-1].hasOwnProperty('uid')){
	        						vcan.lastId = e.message.repObj[e.message.repObj.length-1].uid;
	        						localStorage.lastId = vcan.lastId; 
	            				}
	        				}
    						if(e.fromUser.userid != id){
    							localStorage.repObjs = JSON.stringify(replayObjs);
    						}
	    					
	        			}
	    			}
	    			
	    			
					if(e.fromUser.userid != id ){
						if(e.message.hasOwnProperty('createArrow')){
							whBoard.receivedPackets = whBoard.receivedPackets + (JSON.stringify(e.message).length);
						}else if(!e.message.hasOwnProperty('getMsPckt')){
							whBoard.receivedPackets = whBoard.receivedPackets + (JSON.stringify(e.message.repObj).length);
						} 
						document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
					}
					localStorage.receivedPackets = whBoard.receivedPackets; 
				}
	    		

	    		if(e.fromUser.userid != id){
	    			if(e.message.hasOwnProperty('repObj') && !e.message.hasOwnProperty('sentReq')){
	    				window.whBoard.vcan.main.replayObjs = [];
	    				if(e.message.repObj.length > 0){ 
	    					 if(vcan.renderedObjId + 1 == e.message.repObj[0].uid){
	    						 //alert('suman');
	    						 window.whBoard.vcan.main.replayObjs = e.message.repObj;
		       					 whBoard.toolInit('t_replay', 'fromBrowser', true, function (val){ 
		       						 	if(tempArr.length > 0){
//			       						 	if(e.fromUser.userid != id){
//			        							replayObjs = replayObjs.join(replayObjs, tempArr);
//			        							localStorage.repObjs = JSON.stringify(replayObjs);
//			        						}
											window.whBoard.vcan.main.replayObjs = tempArr;
											tempArr = [];
											whBoard.toolInit('t_replay', 'fromBrowser', true);
											
										}
		       						 
		       					 });
	    					 }
	    					
//	    					 window.whBoard.vcan.main.replayObjs = e.message.repObj;
//	       					 whBoard.toolInit('t_replay', 'fromBrowser', true);
	    					 
//	    					setTimeout(
//	 								function (){
//	 									if(e.message.repObj[e.message.repObj.length-1].uid == vcan.renderedObjId){
//	 										if(tempArr.length > 0){
//	 											window.whBoard.vcan.main.replayObjs = tempArr;
//	 											whBoard.toolInit('t_replay', 'fromBrowser', true);
//	 											tempArr = [];
//	 										}
//	 									}
//	 								},
//	 								1000
//	 						);
	    					 
	  	    			}
	    			}
	    		}

	    		if(e.message.hasOwnProperty('clearAll')){
	    			myrepObj = [];
	    			replayObjs = [];
	 				whBoard.utility.t_clearallInit();
	 				localStorage.clear();
	 				vcan.lastId = 0;
	 				vcan.renderedObjId = 0;
	 				removeTextNode();
	 			}
	    		
	    		if(e.message.hasOwnProperty('replayAll')){
					window.whBoard.vcan.main.replayObjs =  replayObjs;
					whBoard.utility.clearAll(false);
					whBoard.toolInit('t_replay', 'fromFile');
				}
    		}
    	});
    	
  		
  		function requestPackets (e){
  			whBoard.sentReq = true;
			var sp = vcan.lastId;
			var ep = e.message.repObj[0].uid;
			//if(vcan.lastId == vcan.renderedObjId){
				vm_chat.send({'getMsPckt' : [sp, ep]}); //will have to request to teacher
				return;
			//}
  		}
  		
  		function sendPackets(e){
			if(e.message.getMsPckt[0] == 0){
				var i = -1;
			}else{
				var fs = e.message.getMsPckt[0].uid;
				for(var i=0; i<myrepObj.length; i++){
    				if(e.message.getMsPckt[0] == myrepObj[i].uid){
    					fs =  e.message.getMsPckt[0];
    					break;
    				}
				}
			}

			for(var j=i+1; j<myrepObj.length; j++){
				chunk.push(myrepObj[j]);
			}
			
			vm_chat.send({'repObj' : chunk, 'chunk' : true});
			return;

  		}
    	//TODO  this should be contain into text file
  		function removeTextNode(){
  			var allTextContainer = document.getElementsByClassName('textBoxContainer');
  			for(var i=0; i<allTextContainer.length; i++){
  				allTextContainer[i].parentNode.removeChild(allTextContainer[i]);
  			}
  		}
   });
});

