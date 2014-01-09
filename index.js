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
	//alert('suman bogati');
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
		//alert('brother');
		myrepObj = [];
    	replayObjs = []; // this should contain either into whiteboard or into van object
    	myArr = [];
    	
    	if(localStorage.hasOwnProperty('reachedItemId')){
    		vcan.reachedItemId = parseInt(localStorage.reachedItemId);
    	}else{
    		vcan.reachedItemId = 0;
    	}
    	
    	
    	//vcan.cmdWrapperDiv = 'commandToolsWrapper';
    	window.whBoard.attachToolFunction(vcan.cmdWrapperDiv);
    	window.whBoard.init();
    	
    	whBoard.removeToolBox = function(){
  			var cmdWrapper =  document.getElementById(vcan.cmdWrapperDiv);
			cmdWrapper.parentNode.removeChild(cmdWrapper);
  		}
    	
    	whBoard.createReclaimButton = function (cmdToolsWrapper){
			whBoard.createDiv('t_reclaim', 'Reclaim', cmdToolsWrapper);
			var aTags = document.getElementById('t_reclaim').getElementsByTagName('a');
			aTags[0].addEventListener('click', whBoard.objInit);
		}
    	
    	//alert(typeof localStorage.teacherId);
    	if(typeof localStorage.teacherId == 'undefined' && typeof localStorage.reclaim == 'undefined'){
    		//alert('suman bogati');
    		whBoard.removeToolBox();
//    		var child = document.getElementById(vcan.cmdWrapperDiv);
//			child.parentNode.removeChild(child);
		}
    	
    	if(typeof localStorage.reclaim != 'undefined'){
    		var cmdToolsWrapper = document.getElementById(whBoard.commandToolsWrapperId);	
			
			while(cmdToolsWrapper.hasChildNodes()){
				cmdToolsWrapper.removeChild(cmdToolsWrapper.lastChild);
			}
    		
    		whBoard.createReclaimButton(cmdToolsWrapper);
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
       	
    	
		vcan.queue = function (result){
			if(vcan.tempArr.length > 0){
				//alert("suman u there");
				//debugger;
				window.whBoard.vcan.main.replayObjs = vcan.tempArr;
				vcan.tempArr = [];
			//	console.log('suman');
				whBoard.toolInit('t_replay', 'fromBrowser', true, vcan.queue);
			}else{
				return;
			}
		}
    		
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
					whBoard.toolInit('t_replay', 'fromBrowser', true, vcan.queue);
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
		//whBoard.sentReq = false;
		bcount = 0;
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
			
//			alert('i am there for you');
//  			debugger;
			var clientNum = e.message.length;
			//alert(clientNum);
			  if(clientNum == 1){
					if(!vcan.chkAlreadyConnected()){
						vcan.vid = myVideo.init();
						vcan.teacher = true;
						if(typeof localStorage.teacherId == 'undefined'){
							window.whBoard.attachToolFunction(vcan.cmdWrapperDiv, true);
							localStorage.teacherId = e.message[0].userid;
							//vcan.teacherId = localStorage.teacherId;
							localStorage.orginalTeacherId = e.message[0].userid;
						}
						
						myVideo.isInitiator = true;
						vcan.oneExecuted = false;
						
					}
				//browser B
				}else if(clientNum == 2 && e.newuser == null){
					//localStorage.teacherId = e.message[0].userid;
					if(!vcan.chkAlreadyConnected()){
						//localStorage.orginalTeacherId
//						if(typeof localStorage.teacherId == 'undefined'){
//							localStorage.teacherId = e.message[0].userid;
//						}
						
//						if(typeof localStorage.teacherId == 'undefined'){
//							var child = document.getElementById(vcan.cmdWrapperDiv);
//							child.parentNode.removeChild(child);
//						}
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
				
				if(clientNum >= 2){
//					if(typeof localStorage.teacherId == 'undefined'){
//						alert("this is not pe");
//						var parNode = document.getElementById(vcan.cmdWrapperDiv).parentNode;
//						pareNode.removeChild(parNode);
//					}
				}
				
		}
		
		whBoard.uniqueArrOfObjsToOther = function (){
			var tempRepObjs = "";
			replayObjs = [];
			for(var i=0; i<vcan.main.replayObjs.length; i++){
				tempRepObjs = vcan.extend({}, vcan.main.replayObjs[i]);
				replayObjs.push(tempRepObjs);
			}
		}
		
		whBoard.uniqueArrOfObjsToSelf = function (){
			vcan.main.replayObjs = [];
			var tempRepObjs = "";
			for(var i=0; i<replayObjs.length; i++){
				tempRepObjs = vcan.extend({}, replayObjs[i]);
				vcan.main.replayObjs.push(tempRepObjs);
			}
		}
		
		$(document).on("connectionclose", function(e){
			//vm_chat.send()
			//vm_chat.send({'connecClose':true});
			//alert('suman bogati raj');
			//alert('connection closed');
			console.log('connection closed');
		});
		
		$(document).on("member_removed", function(e){
//			/alert('member_removed');
		});
		
		
		
		
		$(document).on("member_added", function(e){
				myVideo.id = id;
				myVideo.browserLen = e.message.length;
				vcan.videoInit(e);
	  			if(typeof vcan.teacher == 'undefined' && typeof localStorage.teacherId == 'undefined'){
	  				//removeAttachFunction();
	  				vcan.makeCanvasDisable();
				}
	  		});
		
		
		
		vcan.tempArr = [];
  		$(document).on("newmessage", function(e){
//  			if(e.message.hasOwnProperty('connecClose')){
//  				//alert('raju brother');
//  			}
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
//        		if(e.message.hasOwnProperty('assignRole')){
//        			if(id == typeof localStorage.studentId){
//        				whBoard.uniqueArrOfObjsToOther();
//            		}
//        		}
        		
        		
        		if(e.message.hasOwnProperty('reclaimRole')){
        			if(e.fromUser.userid != id){
        				whBoard.removeToolBox();
        				vcan.makeCanvasDisable();
            			if(typeof localStorage.teacherId != 'undefined'){
            				localStorage.removeItem('teacherId');
            			}
            			whBoard.uniqueArrOfObjsToOther();
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
            			return;
        			}else{
        				whBoard.uniqueArrOfObjsToOther();
        				return;
        			}
        		}
        		
//        		if(e.fromUser.userid != id){
//        			if(e.message.hasOwnProperty('reclaimRole')){
//        				whBoard.removeToolBox();
//        				vcan.makeCanvasDisable();
//            			if(typeof localStorage.teacherId != 'undefined'){
//            				localStorage.removeItem('teacherId');
//            			}
//            			
//            			whBoard.uniqueArrOfObjsToOther();
//            			
////            			var tempRepObjs = "";
////        				replayObjs = [];
////        				for(var i=0; i<vcan.main.replayObjs.length; i++){
////            				tempRepObjs = vcan.extend({}, vcan.main.replayObjs[i]);
////            				replayObjs.push(tempRepObjs);
////            			}
//            			return;
//            		} 
//        			
//        			if(e.message.hasOwnProperty('assignRole')){
//            			whBoard.utility.assignRole(id);
//            			
//            			
//            			whBoard.uniqueArrOfObjsToSelf();
//            			
//            			
//            		
//
////            			vcan.main.replayObjs = [];
////            			var tempRepObjs = "";
////            			for(var i=0; i<replayObjs.length; i++){
////            				tempRepObjs = vcan.extend({}, replayObjs[i]);
////            				vcan.main.replayObjs.push(tempRepObjs);
////            			}
//            			return;
//            		}
//        		}else{
//        			if(e.message.hasOwnProperty('reclaimRole')){
//        				whBoard.uniqueArrOfObjsToSelf();
////        				vcan.main.replayObjs = [];
////            			var tempRepObjs = "";
////            			for(var i=0; i<replayObjs.length; i++){
////            				tempRepObjs = vcan.extend({}, replayObjs[i]);
////            				vcan.main.replayObjs.push(tempRepObjs);
////            			}
//            			return;
//        			}
//        			
//        			if(e.message.hasOwnProperty('assignRole')){
////        				var tempRepObjs = "";
////        				replayObjs = [];
////        				for(var i=0; i<vcan.main.replayObjs.length; i++){
////            				tempRepObjs = vcan.extend({}, vcan.main.replayObjs[i]);
////            				replayObjs.push(tempRepObjs);
////            			}
//        				whBoard.uniqueArrOfObjsToOther();
//	       			    return;
//            		}
//        		}
        		
        		
        		
        		myrepObj = whBoard.vcan.getStates('replayObjs');
	    		chunk = [];
	    		
	    		if(e.message.hasOwnProperty('clearAll')){
						whBoard.tool = new whBoard.tool_obj('t_clearall');
				
						whBoard.utility.t_clearallInit();

						vcan.makeDefaultValue();
						vcan.updateRcvdInformation(e.message);
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
	    					if(vcan.tempArr.length < 1){
//	    						alert("suman bogati");
//	    						debugger;
	    					}
	    					makeQueue(e);
//	    					if(vcan.reachedItemId != vcan.renderedObjId){
//    							if(vcan.reachedItemId != vcan.renderedObjId){
//        							for(var i=0; i<e.message.repObj.length; i++){
//    									vcan.tempArr.push(e.message.repObj[i]);
//    								}
//        						}
//    						}
    		    		}
	        		}
	        		
					
//	    			
//	    			if(e.message.hasOwnProperty('repObj') &&  !e.message.hasOwnProperty('sentObj')){
//	    				if(e.message.repObj.length > 0 && e.message.repObj[0].hasOwnProperty('uid')){
//	    					//console.log('uid ' + e.message.repObj[0].uid);
//	    				}
//	        		}
	    			
	    		//	if(e.message.hasOwnProperty('repObj') && whBoard.sentReq == false){
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
		    			vcan.updateRcvdInformation(e.message);
		    		}else if(e.message.hasOwnProperty('clearAll')){
		    			//vcan.reachedItemId = 0;
		    			//updateRcvdInformation(e.message);
		    		}else{
		    			if(!e.message.hasOwnProperty('replayAll') && !e.message.hasOwnProperty('getMsPckt')){
		    				vcan.updateRcvdInformation(e.message.repObj[0]);
		    			}
		    		}
		    	}
	    		
	    		//initLoop = 0;
	    		if(!e.message.hasOwnProperty('clearAll') && !e.message.hasOwnProperty('replayAll')){
	    			if(e.message.hasOwnProperty('repObj') && !e.message.hasOwnProperty('sentObj')){
						if(typeof endPoint != 'undefined'){
							if(endPoint == e.message.repObj[e.message.repObj.length-1].uid){
							//	 alert('what is up babes');
								// debugger;
							}
						}
	    				//console.log('passedObjId ' + e.message.repObj[e.message.repObj.length-1].uid);
	    			
	    				if(e.message.repObj.length > 1 && e.message.hasOwnProperty('chunk') && e.fromUser.userid == id){
	    					//TODO this have to be simpliefied.
	    				}else{
							
							if(e.fromUser.userid != id && replayObjs.length > 1){
								if(e.message.repObj[0].uid > replayObjs[replayObjs.length-1].uid){
									if(e.message.repObj[0].uid - replayObjs[replayObjs.length-1].uid > 0){
										if(vcan.renderedObjId > replayObjs.length){
											//alert("hello guys");
											//debugger;
										}
										
									}
								}
							}
							
	    					
	    					if(vcan.reachedItemId+ 1 == e.message.repObj[0].uid) {
								if(replayObjs.length > 0 && e.message.repObj[0].uid - replayObjs[replayObjs.length-1].uid > 1){
									//alert("captured");
									//debugger;
								}
								
								
//								if(replayObjs.length > 0){
//									if(replayObjs[replayObjs.length-1].uid == e.message.repObj[0].uid){
//										//alert("hi guys ggg");
//									}
//								}
	    						for (var i=0; i<e.message.repObj.length; i++){
	    							 replayObjs.push(e.message.repObj[i]);
	    						}
	    					}else{
								if(vcan.tempArr.length > 0 && !e.message.hasOwnProperty('chunk')){
									//	alert('suman bogati');
										//debugger;
								}
							//	console.log()
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
//	    						alert('break');
//	    						debugger;
//	    					}
//	    					
//	    					if(secPart[secPart.length-1].uid+1 != tPart[0].uid){
//	    						alert('break');
//	    						debugger;
//	    					}
//	    					
//	    					replayObjs = fPart.concat(secPart, tPart);
//////////////////////////////////////////////////////////////////////
	    					
//	    					for(var i=0; i< e.message.repObj.length; i++){
//	    						replayObjs.push(e.message.repObj[i]);
//	    					}
	    					
	    					if(e.message.repObj.length > 0){
								if(e.message.repObj[e.message.repObj.length-1].uid - e.message.repObj[e.message.repObj.length-2].uid > 1){
									alert("good going");
								}
							}
							if(myArr.length > 0){
								if(e.message.repObj[e.message.repObj.length-1].uid == myArr[0].uid){
									for(var i=0; i< myArr.length; i++){
										console.log('mArr ' + myArr[i].uid);
									}
									if(!myArr[0].hasOwnProperty('cmd')){
										myArr.shift();
									}
								//	myArr.shift(); //remove object if double id found
								//	alert("hi how are you");
								}
								e.message.repObj = e.message.repObj.concat(myArr);
								myArr = [];
							}
	    					//replayObjs = replayObjs.concat(e.message.repObj);
	    					
//								if(replayObjs.length > 0){
//									if(replayObjs[replayObjs.length-1].uid == e.message.repObj[0].uid){
//										alert("hi guys");
//									}
//								}
	    					
							
							replayObjs = replayObjs.concat(e.message.repObj);
	    					/*for(var i=0; i<e.message.repObj.length; i++){
									if(){
										
									}
									replayObjs.push(e.message.repObj[i]);
										
							}*/
	    					
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
										alert('suman bogati');
									}
								}
	    					}else{
//	    						alert('khandan');
//	    						debugger;
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
	    			if(e.message.hasOwnProperty('repObj') && !e.message.hasOwnProperty('sentObj')){
	    				window.whBoard.vcan.main.replayObjs = [];
	    				if(e.message.repObj.length > 0){ 
	    					 if(vcan.renderedObjId + 1 == e.message.repObj[0].uid){
								 window.whBoard.vcan.main.replayObjs = e.message.repObj;
		       					 whBoard.toolInit('t_replay', 'fromBrowser', true, vcan.queue);
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
  		
  		vcan.updateRcvdInformation =  function (msg){
			var compMsg = "";
			for(var key in msg){
				compMsg += key +" : " + msg[key] + " <br />";
			}
			document.getElementById('rcvdMsgInfo').innerHTML = compMsg;
		}
	
  		
  		vcan.makeDefaultValue = function (){
  			myrepObj = [];
			replayObjs = [];
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
			
			vcan.reachedItemId = 0;
			vcan.renderedObjId = 0;
			vcan.tempArr = [];
			vcan.removeTextNode();
			whBoard.uid  = 0;
			if(typeof vcan.main.currentTransform != 'undefined'){
				vcan.main.currentTransform = "";
			}
  		}
  		
  		//name of this function should be  change
  		vcan.makeCanvasDisable = function(){
  			//	alert("suman bogati");
  			// this would not need if we remove the commands div completely
/*
  			var allDivs = document.getElementById(vcan.cmdWrapperDiv).getElementsByTagName('div');
				for(var i=0; i<allDivs.length; i++){
					
					//TODO this will have to be fixed as it always assigned t_clearall
					//whBoard.currComId = allDivs[i].id; 
					//allDivs[i].getElementsByTagName('a')[0].addEventListener('click', whBoard.objInit, true);
					//IMPORTANT this is changed during the UNIT testing
					
					//allDivs[i].getElementsByTagName('a')[0].onclick = whBoard.objInit;
					allDivs[i].getElementsByTagName('a')[0].removeEventListener('click', whBoard.objInit);

				}
*/				
				// TODO this could be tricky as it's best way to do
				// is remove the attached handler
				var canvasElement = vcan.main.canvas;
				canvasElement.style.position = 'relative';
				canvasElement.style.zIndex = "-1000";  
		}
  		
  		vcan.makeCanvasEnable = function(){
  			var canvasElement = vcan.main.canvas;
			//canvasElement.style.position = 'relative';
  			canvasElement.style.position = 'none';
			canvasElement.style.zIndex = "0";
  		}
  		
  		
  		
  		function requestPackets (e){
			//more than one packets comes after connection on
			if(e.message.repObj.length > 1){
					//alert("suman bogati ggg");
					myArr = e.message.repObj;
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
				for(var i=0; i<myrepObj.length; i++){
    				if(e.message.getMsPckt[0] == myrepObj[i].uid){
    					fs =  e.message.getMsPckt[0];
    					break;
    				}
				}
			}
			
			for(var j=i+1; j<e.message.getMsPckt[1]; j++){
				chunk.push(myrepObj[j]);
			}
			
			console.log('fid' + chunk[0].uid + ' eid' + chunk[chunk.length-1].uid);
			
			vm_chat.send({'repObj' : chunk, 'chunk' : true});
			return;
  		}
  		
    	//TODO  this should be contain into text file
  		vcan.removeTextNode = function(){
  			var allTextContainer = document.getElementsByClassName('textBoxContainer');
  			for(var i=0; i<allTextContainer.length; i++){
  				allTextContainer[i].parentNode.removeChild(allTextContainer[i]);
  			}
  		}
  		
   });
});

