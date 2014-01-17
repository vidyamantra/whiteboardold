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
	  //repObjQue = []
	 //mysuman = false;
	 $.uiBackCompat=false;
	////alert('suman bogati');
    //place your code here, the scripts are all loaded
//    var userobj={'userid':id,'name':name,'img':"http://static.vidyamantra.com/cdnmt/images/quality-support.png"};
//    	vm_chat.init({
//            'userid':id,
//            'sid':'212',
//            'rid': path,
//            'authuser':auth_user,
//            'authpass':auth_pass,
//            'userobj': userobj,
//            'fastchat_lasttime':'0',
//            'fastchatroom_title':'fastchat',
//            'fastchatroom_name':'room1'});
        //ToDo:room name contain licencekey,couse id and activity id   
        
	$(document).ready(function(){
//		whBoard.utility.updateRcvdInformation =  function (msg){
//			var receivedMsg = document.getElementById('rcvdMsgInfo');
//			if(receivedMsg != null){
//				var compMsg = "";
//				for(var key in msg){
//					compMsg += key +" : " + msg[key] + " <br />";
//				}
//				receivedMsg.innerHTML = compMsg;
//			}
//		}
	
  		whBoard.utility.chkValueInLocalStorage = function (property){
			if(typeof localStorage[property] != 'undefined'){
				return localStorage[property]; 
			}else{
				return false;
			}
		}
  		
		if(window.whBoard.error.length > 0){
			for(var i=0; i<window.whBoard.error.length; i++){
				var error = window.whBoard.error[i];
				if(error.hasOwnProperty('msg')){
					whBoard.view.displayMessage(error.msg, error.id, error.className);
				}
			}
			window.whBoard.error = [];
		}
		
		whBoard.globalObj.myrepObj = [];
    	replayObjs = []; // this should contain either into whiteboard or into van object
    	whBoard.globalObj.myArr = [];
    	
    	
    	if(localStorage.hasOwnProperty('reachedItemId')){
    		vcan.reachedItemId = parseInt(localStorage.reachedItemId);
    	}else{
    		vcan.reachedItemId = 0;
    	}
    	
    	var orginalTeacherId = whBoard.utility.chkValueInLocalStorage('orginalTeacherId');

    	window.whBoard.attachToolFunction(vcan.cmdWrapperDiv);
    	window.whBoard.init();
    	
    	window.addEventListener('click', function (){
    		whBoard.view.disappearBox('WebRtc')
    		whBoard.view.disappearBox('Canvas');
    		whBoard.view.disappearBox('drawArea');
    	}); //assinging the handler for all student
    	
//    	whBoard.utility.removeToolBox = function(){
//  			var cmdWrapper =  document.getElementById(vcan.cmdWrapperDiv);
//			cmdWrapper.parentNode.removeChild(cmdWrapper);
//  		}
    	
//    	whBoard.utility.createReclaimButton = function (cmdToolsWrapper){
//			whBoard.createDiv('t_reclaim', 'reclaim', cmdToolsWrapper);
//			var aTags = document.getElementById('t_reclaim').getElementsByTagName('a');
//			aTags[0].addEventListener('click', whBoard.objInit);
//		}
    	
    	if(typeof localStorage.teacherId == 'undefined' && typeof localStorage.reclaim == 'undefined'){
    		whBoard.utility.removeToolBox(); 
		}
    	
    	if(typeof localStorage.reclaim != 'undefined'){
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
                'sid':'212',
                'rid': path,
                'authuser':auth_user,
                'authpass':auth_pass,
                'userobj': userobj,
                'fastchat_lasttime':'0',
                'fastchatroom_title':'fastchat',
                'fastchatroom_name':'room1'});
        }
       	
    	
//		whBoard.utility.packetQueue = function (result){
//			if(vcan.tempArr.length > 0){
//				window.whBoard.vcan.main.replayObjs = vcan.tempArr;
//				vcan.tempArr = [];
//				whBoard.toolInit('t_replay', 'fromBrowser', true, whBoard.utility.packetQueue);
//			}else{
//				return;
//			}
//		}
    		
    	if(typeof(Storage)!=="undefined"){
			if(localStorage.repObjs){
				var allRepObjs = JSON.parse(localStorage.repObjs);
				whBoard.vcan.main.replayObjs = allRepObjs;
				whBoard.utility.clearAll(false, 'dontClear');
				
				// TODO this should not be run should do improvement
//				for(i=0; i<allRepObjs.length; i++){
//					replayObjs.push(allRepObjs[i]);
//				}
				replayObjs = replayObjs.concat(allRepObjs);
				if(allRepObjs.length > 0){
					whBoard.uid = allRepObjs[allRepObjs.length-1].uid;
					vcan.reachedItemId = whBoard.uid;
					whBoard.toolInit('t_replay', 'fromBrowser', true, whBoard.utility.packetQueue);
				}
			}
		}
    	
 		var oldData2 = whBoard.receivedPackets;
		setInterval(function (){
			if(document.getElementById(whBoard.receivedPackDivPS) != null){
				oldData2 = whBoard.utility.calcPsRecvdPackets(oldData2);
				document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
			}
			
		}, 1000);
    	
		
		//var prvPacket = "";
		//var currElement = "";
		//whBoard.sentReq = false;
		//bcount = 0;
		var myVideo = new window.whBoard.vcan.videoChat();
		vcan.myvid = myVideo;
		vcan.renderedObjId = 0;
		vcan.chkAlreadyConnected = function(){
			if(typeof cthis != 'undefined'){
				if(cthis.pc[0].hasOwnProperty('iceConnectionState') || typeof cthis.pc[0].iceConnectionState != 'undefined'){
					return true;
				}
			}
			return false;
		}
		
		vcan.videoInit = function (e){
			var clientNum = e.message.length;
			  if(clientNum == 1){
					if(!vcan.chkAlreadyConnected()){
						vcan.vid = myVideo.init();
						vcan.teacher = true;
						if(typeof localStorage.teacherId == 'undefined'){
							window.whBoard.attachToolFunction(vcan.cmdWrapperDiv, true);
							localStorage.teacherId = e.message[0].userid;
							window.whBoard.view.canvasDrawMsg('Canvas');
							localStorage.canvasDrwMsg = true;
							whBoard.createPacketContainer();
							whBoard.createPacketInfoContainer();
							whBoard.utility.initStoredPacketsNumbers();
							localStorage.orginalTeacherId = e.message[0].userid;
							
						}
						
						myVideo.isInitiator = true;
						vcan.oneExecuted = false;
						
					}
				//browser B
				}else if(clientNum == 2 && e.newuser == null){
					if(!vcan.chkAlreadyConnected()){
						vcan.studentId = id;
						localStorage.studentId = id;
						vm_chat.send({'isChannelReady':true});
						vcan.oneExecuted = false;
	  					vcan.vid = myVideo.init(); //this(webRtc) is not supported by safari
	  					
	  					
					}
				//browser C and More	
	  			}else if(clientNum > 2){
	  				if(!vcan.chkAlreadyConnected()){
		  				var currBrowser =  e.message[e.message.length-1].userid; 
		  				var peerBrowser =  e.message[0].userid;
		  				vm_chat.send({'createPeerObj': [currBrowser, peerBrowser]});
	  				}
	  			}
				
		}
		
		//this function works when teacher assign the  teacher role to student
		whBoard.uniqueArrOfObjsToOther = function (){
			var tempRepObjs = "";
			replayObjs = [];
			for(var i=0; i<vcan.main.replayObjs.length; i++){
				tempRepObjs = vcan.extend({}, vcan.main.replayObjs[i]);
				replayObjs.push(tempRepObjs);
			}
		}
		
		//this function works when teacher assign the  teacher role to student
		whBoard.uniqueArrOfObjsToSelf = function (){
			vcan.main.replayObjs = [];
			var tempRepObjs = "";
			for(var i=0; i<replayObjs.length; i++){
				tempRepObjs = vcan.extend({}, replayObjs[i]);
				vcan.main.replayObjs.push(tempRepObjs);
			}
		}
		
	
		$(document).on("member_added", function(e){
				myVideo.id = id;
				myVideo.browserLen = e.message.length;
				vcan.videoInit(e);
			
				if(typeof vcan.teacher == 'undefined' && typeof localStorage.teacherId == 'undefined'){
	  				whBoard.utility.makeCanvasDisable();
				}
	  		});
		
		
		if(typeof localStorage.teacherId != 'undefined'){
			if(typeof localStorage.canvasDrwMsg == 'undefined'){
				window.whBoard.view.canvasDrawMsg('Canvas');
				window.whBoard.view.drawLabel('drawArea');
				localStorage.canvasDrwMsg = true;
			}
			
    	}
		vcan.tempArr = [];
  		$(document).on("newmessage", function(e){
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
        		if(e.message.hasOwnProperty('reclaimRole')){
        			if(e.fromUser.userid != id){
        				whBoard.utility.removeToolBox();
        				whBoard.utility.makeCanvasDisable();
            			if(typeof localStorage.teacherId != 'undefined'){
            				localStorage.removeItem('teacherId');
            			}
            			whBoard.uniqueArrOfObjsToOther();
            			whBoard.view.disappearBox('Canvas');
                		whBoard.view.disappearBox('drawArea');
            			return;
        			}else{
        				whBoard.uniqueArrOfObjsToSelf();
        				return;
        			}
        		}
        		
        		if(e.message.hasOwnProperty('assignRole')){
        			if(e.fromUser.userid != id){
        				whBoard.utility.assignRole(id);
            			whBoard.uniqueArrOfObjsToSelf();
						if(typeof localStorage.canvasDrwMsg == 'undefined'){
							window.whBoard.view.canvasDrawMsg('Canvas');
							window.whBoard.view.drawLabel('drawArea');
							localStorage.canvasDrwMsg = true;
						}		
            		
            			return;
        			}else{
        				whBoard.uniqueArrOfObjsToOther();
        				return;
        			}
        		}
        		
        		whBoard.globalObj.myrepObj = whBoard.vcan.getStates('replayObjs');
	    		chunk = [];
	    		
	    		if(e.message.hasOwnProperty('clearAll')){
						whBoard.tool = new whBoard.tool_obj('t_clearall');
						whBoard.utility.t_clearallInit();
						vcan.makeDefaultValue();
						//var orginalTeacherId = vcan.chkValueInLocalStorage('orginalTeacherId');
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
	    					makeQueue(e);
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
	    									 requestPackets(e);
	    									 
	    								 }  
									}
	    						 }
	    					}
	    				}
	    	    	}
	    		}
	    		
	    		if(e.fromUser.userid != id){
	    			if(e.message.hasOwnProperty('getMsPckt')){
	    				sendPackets(e);
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
		    			//whBoard.utility.updateRcvdInformation(e.message);
		    		}else{
		    			if(!e.message.hasOwnProperty('replayAll') && !e.message.hasOwnProperty('getMsPckt')){
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
	    							 replayObjs.push(e.message.repObj[i]);
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
    							localStorage.repObjs = JSON.stringify(replayObjs);
    						}else{
    							if(typeof vcan.reachedItemId != 'undefined'){
    								vcan.renderedObjId = vcan.reachedItemId 
    						    }
    						}
	    					
	        			}
	    				
	    				if(e.message.hasOwnProperty('chunk') && e.fromUser.userid != id){
	    					

////// below sorting is achvieved by these commented out code	    					
//	    					for(var k=0; k<replayObjs.length; k++){
//	    						if(replayObjs[k].uid == e.message.repObj[0].uid-1){
//	    							findIndex = true
//	    							break;
//	    						}
//	    					}
//	    					
//	    					
//	    					var fPart = replayObjs.slice(0, k+1);
//	    					var secPart = e.message.repObj;
//	    					var tPart = replayObjs.slice(k+1, replayObjs.length);
//	    					
//	    					if(fPart[fPart.length-1].uid+1 != secPart[0].uid){
//	    						//alert('break');
//	    						debugger;
//	    					}
//	    					
//	    					if(secPart[secPart.length-1].uid+1 != tPart[0].uid){
//	    						//alert('break');
//	    						debugger;
//	    					}
//	    					
//	    					replayObjs = fPart.concat(secPart, tPart);
//////////////////////////////////////////////////////////////////////
	    					
//	    					for(var i=0; i< e.message.repObj.length; i++){
//	    						replayObjs.push(e.message.repObj[i]);
//	    					}
	    					
	    					
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
	    					
							replayObjs = replayObjs.concat(e.message.repObj);
	    				
	    					//TODO this should be removed later and above code should be enabled
							// right now its doing sorting but above code should be enabled and object 
							// should be stotred in sorted format
	    					replayObjs = replayObjs.sort(function(a, b){
	    					    return a.uid - b.uid;
	    					});
	    					
	    					if(e.fromUser.userid != id){
    							localStorage.repObjs = JSON.stringify(replayObjs);
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
							}else if(!e.message.hasOwnProperty('getMsPckt')){
								whBoard.receivedPackets = whBoard.receivedPackets + (JSON.stringify(e.message.repObj).length);
							} 
							document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
						}
						localStorage.receivedPackets = whBoard.receivedPackets;
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
					window.whBoard.vcan.main.replayObjs =  replayObjs;
					whBoard.utility.clearAll(false);
					whBoard.toolInit('t_replay', 'fromFile');
				}
    		}
    	});
  		
  		vcan.makeDefaultValue = function (){
  			whBoard.globalObj.myrepObj = [];
			replayObjs = [];
			
			var teacherId = whBoard.utility.chkValueInLocalStorage('teacherId');
			var orginalTeacherId = whBoard.utility.chkValueInLocalStorage('orginalTeacherId');
			var wbrtcMsg = whBoard.utility.chkValueInLocalStorage('wbrtcMsg');
			var canvasDrwMsg = whBoard.utility.chkValueInLocalStorage('canvasDrwMsg');

  			
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
  		}
  		
  		//name of this function should be  change
//  		whBoard.utility.makeCanvasDisable = function(){
//  				// TODO this could be tricky as it's best way to do
//				// is remove the attached handler
//				var canvasElement = vcan.main.canvas;
//				canvasElement.style.position = 'relative';
//				canvasElement.style.zIndex = "-1000";  
//		}
//  		
//  		whBoard.utility.makeCanvasEnable = function(){
//  			var canvasElement = vcan.main.canvas;
//  			canvasElement.style.position = 'none';
//			canvasElement.style.zIndex = "0";
//  		}
  		
  		
  		
  		function requestPackets (e){
			//more than one packets comes after connection on
			if(e.message.repObj.length > 1){
					////alert("suman bogati ggg");
					whBoard.globalObj.myArr = e.message.repObj;
			}
  			whBoard.sentReq = true;
			var sp = vcan.reachedItemId;
			var ep = e.message.repObj[0].uid;
				console.log('sp ' + sp + ' ' + ' ep ' + ep);
				vm_chat.send({'getMsPckt' : [sp, ep]}); //will have to request to teacher
				return;
  		}
  		
  		function makeQueue(e){
			if(vcan.reachedItemId != vcan.renderedObjId){
				for(var i=0; i<e.message.repObj.length; i++){
					vcan.tempArr.push(e.message.repObj[i]);
				}
			}
		}
  		
  		function sendPackets(e){
			if(e.message.getMsPckt[0] == 0){
				var i = -1;
			}else{
				var fs = e.message.getMsPckt[0].uid;
				for(var i=0; i<whBoard.globalObj.myrepObj.length; i++){
    				if(e.message.getMsPckt[0] == whBoard.globalObj.myrepObj[i].uid){
    					fs =  e.message.getMsPckt[0];
    					break;
    				}
				}
			}
			
			for(var j=i+1; j<e.message.getMsPckt[1]; j++){
				chunk.push(whBoard.globalObj.myrepObj[j]);
			}
			console.log('fid' + chunk[0].uid + ' eid' + chunk[chunk.length-1].uid);
			vm_chat.send({'repObj' : chunk, 'chunk' : true});
			return;
  		}
  		
    	//TODO  this should be contain into text file
//  		vcan.removeTextNode = function(){
//  			var allTextContainer = document.getElementsByClassName('textBoxContainer');
//  			for(var i=0; i<allTextContainer.length; i++){
//  				allTextContainer[i].parentNode.removeChild(allTextContainer[i]);
//  			}
//  		}
  		
   });
});

