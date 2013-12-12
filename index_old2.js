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
		//suman BOGATI
//    	window.whBoard.attachToolFunction('commandToolsWrapper');
//    	window.whBoard.init();
    	replayObjs = []; // this should contain either into whiteboard or into van object
    	lastId = 0;
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
		
		$(document).on("member_added", function(e){
			myVideo.browserLen = e.message.length;
			
			var clientNum = e.message.length;
				//browser A
				if(clientNum == 1){
					myVideo.isInitiator = true;
					vcan.oneExecuted = false;
					vcan.vid = myVideo.init();
				
				//browser B
				}else if(clientNum == 2 && e.newuser == null){
					vm_chat.send({'isChannelReady':true});
					vcan.oneExecuted = false;
  					vcan.vid = myVideo.init();
  					peerBrowser2 = e.message[1].userid;
  					
  				//browser C and More	
	  			}else if(clientNum > 2){
	  				var currBrowser =  e.message[e.message.length-1].userid; 
	  				var peerBrowser =  e.message[0].userid;
	  				
	  				/* in actual this statement would executed
	  				for(var i=0; i<e.message.length; i++){
	  					vm_chat.send({'createPeerObj': [currBrowser, e.message[i].userid]});
	  				} */
	  				vm_chat.send({'createPeerObj': [currBrowser, peerBrowser, peerBrowser2]});
	  			}
			});
		
		
  		$(document).on("newmessage", function(e){
  			if(e.message.hasOwnProperty('createPeerObj')){
  				myVideo.currBrowser =  e.message.createPeerObj[0];
  				myVideo.peerBrowser =  e.message.createPeerObj[1];
  				myVideo.peerBrowser2 = e.message.createPeerObj[2];
  				
  				myVideo.id = id;
//  				if(id == peerBrowser){
//  					//bug this function being called multiple times to be fixed it.
//  					//vcan.oneExecuted = false;
//  					if(typeof oneExecuted == 'undefined'){
//  						oneExecuted = true;
//  						vcan.myvid.init(true);
//  					}
//  				}
  				//When browser C enter
  				if(myVideo.currBrowser == id){
  					if(typeof oneExecuted == 'undefined'){
  						oneExecuted = true;
  						vm_chat.send({'isChannelReady':true}); //call for browser A
  						vcan.myvid.init(true, myVideo.peerBrowser);
  					}
  					
//  					if(typeof oneExecuted2 == 'undefined'){
//  						myVideo.myBrowser = 'undefined';;
//  						oneExecuted2 = true;
//  						vm_chat.send({'isChannelReady':true}); //call for browser A
//  						vcan.myvid.init(true, myVideo.peerBrowser2);
//  					}
  					
  				}else{
  					cthis.isStarted = false;
  				}
  				
  				
  				
  			}else if(e.message.hasOwnProperty('isChannelReady')){
  				e.message.isChannelReady = true; 
    			//myVideo.videoOnMsg(e.message);
  				vcan.myvid.videoOnMsg(e.message);
    		}else if(e.message.hasOwnProperty('video')){
    			var video = vcan.myvid;
        		if(typeof video != 'undefined'){
        			//myVideo.videoOnMsg(e.message.video);
        			vcan.myvid.videoOnMsg(e.message.video);
        		}
        	}else{
    			if(e.message.hasOwnProperty('repObj') && e.message.hasOwnProperty('sentObj')){
					whBoard.sentReq = false;
				}
	    		
	    		myrepObj = whBoard.vcan.getStates('replayObjs');
	    		var chunk = [];
	    		if(e.fromUser.userid != id){
	    			if(e.message.hasOwnProperty('repObj')){
	    				if(e.message.repObj[0].hasOwnProperty('uid')){
	    					whBoard.uid = e.message.repObj[0].uid;
	    				}
	        		}
	    			
	    			if(e.message.hasOwnProperty('repObj')){
	    				if(e.message.repObj[0].hasOwnProperty('uid')){
	    					console.log('uid ' + e.message.repObj[0].uid);
	    				}
	        		}
	    			
	    			if(e.message.hasOwnProperty('repObj') && whBoard.sentReq == false){
	    				if(lastId != 0){
	    					if((typeof e.message.repObj == 'object' || typeof e.message.repObj instanceof Array)){
	    						 if(e.message.repObj[0].hasOwnProperty('uid')){
	    							if(lastId+1 != e.message.repObj[0].uid){
	    								whBoard.sentReq = true;
	    								var sp = lastId;
		        	    				var ep = e.message.repObj[0].uid;
		        	    				vm_chat.send({'getMsPckt' : [sp, ep]}); //will have to request to teacher
		        	    				return;
	    							}
	    				 		 }
	    					}
	    				}
	    	    	}
	    		}
	    		
	    		
	    		if(e.fromUser.userid != id){
	    			if(e.message.hasOwnProperty('getMsPckt')){
	    				var fs = e.message.getMsPckt[0].uid;
	    				for(var i=0; i<myrepObj.length; i++){
	        				if(e.message.getMsPckt[0] == myrepObj[i].uid){
	        					fs =  e.message.getMsPckt[0];
	        					break;
	        				}
	    				}
	    				
	    				//this loop should be improved
	    				for(var j=i+1; j<myrepObj.length; j++){
	    					chunk.push(myrepObj[j]);
	    				}
	    				
	    				vm_chat.send({'repObj' : chunk, 'chunk' : true});
	    				return;
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
	    				//console.log('repObj ' + e.message.repObj.length );
	//    				for (var i=0; i<e.message.repObj.length; i++){
	//    					replayObjs.push(e.message.repObj[i]);
	//    				}
	//    				
	//    				if(typeof e.message.repObj[e.message.repObj.length-1] == 'object' ){
	//    					if(e.message.repObj[e.message.repObj.length-1].hasOwnProperty('uid')){
	//        					lastId = e.message.repObj[e.message.repObj.length-1].uid;
	//        				}
	//    				}
	//    				localStorage.repObjs = JSON.stringify(replayObjs);
	    				
	    				if(e.message.repObj.length > 1 && e.message.hasOwnProperty('chunk') && e.fromUser.userid == id){
	    					
	    				}else{
	    					for (var i=0; i<e.message.repObj.length; i++){
	        					replayObjs.push(e.message.repObj[i]);
	        				}
	    					if(typeof e.message.repObj[e.message.repObj.length-1] == 'object' ){
	        					if(e.message.repObj[e.message.repObj.length-1].hasOwnProperty('uid')){
	            					lastId = e.message.repObj[e.message.repObj.length-1].uid;
	            				}
	        				}
	    					localStorage.repObjs = JSON.stringify(replayObjs);
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
	    					 window.whBoard.vcan.main.replayObjs = e.message.repObj;
	       					 whBoard.toolInit('t_replay', 'fromBrowser', true);
	       				}
	    			}
	    		}
	    		
	//    		if(e.fromUser.userid != id){
	//    			 window.whBoard.vcan.main.replayObjs = replayObjs;
	//    		}
	    		
	    		if(e.message.hasOwnProperty('clearAll')){
	    			myrepObj = [];
	    			replayObjs = [];
	 				whBoard.utility.t_clearallInit();
	 				localStorage.clear();
	 			}
	    		
	    		if(e.message.hasOwnProperty('replayAll')){
					window.whBoard.vcan.main.replayObjs =  replayObjs;
					whBoard.utility.clearAll(false);
					whBoard.toolInit('t_replay', 'fromFile');
				}
    		}
    	});
    	
    	
    	/*
    	function deliverPackets(e){
    		if(e.message.hasOwnProperty('getMsPckt')){
    			for(var i=e.message.getMsPckt[0]-1; i<e.message.getMsPckt[1]; i++){
    				chunk.push(myrepObj[i]);
    			}
				vm_chat.send({'repObj' : chunk});
    			return;
    		}
    	}
    	
    	function requestPacket(e){
    		if(e.message.repObj[0].hasOwnProperty('uid')){
				if(lastId+1 != e.message.repObj[0].uid){
					whBoard.sentReq = true;
    				var sp = lastId+1;
    				var ep = e.message.repObj[0].uid;
    				vm_chat.send({'getMsPckt' : [sp, ep]}); //will have to request to teacher
    			}
			 }
    	} */
   });
});

