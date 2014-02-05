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

    $(document).ready(function(){
    	
    	/*
		var outerWidth = window.outerWidth;
		var innerHeight = window.innerHeight;
		
		whBoard.ow = {};
		whBoard.oh = {};
		
		whBoard.ow = outerWidth-220;
		whBoard.oh = oh = innerHeight-210;
		var vcanvas = document.getElementById('vcanvas');
		vcanvas.style.width = whBoard.ow + 'px';
		
		*/
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
    	
    	window.whBoard.attachToolFunction(vcan.cmdWrapperDiv);
    	window.whBoard.init();
    	
    	window.addEventListener('click', function (){
    		whBoard.view.disappearBox('WebRtc')
    		whBoard.view.disappearBox('Canvas');
    		whBoard.view.disappearBox('drawArea');
    	});
    	
    	var storageHasReclaim = whBoard.utility.chkValueInLocalStorage('reclaim');
    	var storageHasTeacher = whBoard.utility.chkValueInLocalStorage('teacherId');
    	
    	if(!storageHasTeacher && !storageHasReclaim){
    		whBoard.utility.removeToolBox();
    		document.getElementById('vcanvas').className = 'student';
		}else{
    		document.getElementById('vcanvas').className = 'teacher';
		}
    	
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
                'sid':'212',
                'rid': path,
                'authuser':auth_user,
                'authpass':auth_pass,
                'userobj': userobj,
                'fastchat_lasttime':'0',
                'fastchatroom_title':'fastchat',
                'fastchatroom_name':'room1'});
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
				whBoard.globalObj.replayObjs = whBoard.globalObj.replayObjs.concat(allRepObjs);
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
    	
		var myVideo = new window.whBoard.vcan.videoChat();
		vcan.myvid = myVideo;
		vcan.renderedObjId = 0;
		
		$(document).on("member_added", function(e){
				whBoard.utility.initDefaultInfo(e,  myVideo);
				if(typeof vcan.teacher == 'undefined' && !storageHasTeacher){
	  				whBoard.utility.makeCanvasDisable();
				}
				
				//
				
				var res = whBoard.system.measureResoultion({'width' : window.outerWidth, 'height' : window.innerHeight });
			//	var res = whBoard.system.getResoultion(window.outerWidth);
				
				//vm_chat.send({'shareBrowserWidth':true, browserRes: res});
				
				vm_chat.send({'virtualWindow' : {'shareBrowserWidth':true, browserRes: res}});
				
//				for(var i=0; i<e.message.length; i++){
//					if(e.message[i].userid == id){
//						vm_chat.send({'shareBrowserWidth':true, browserRes: res});
//						break;
//					}
//				}
				
	  		});
		
		if(typeof localStorage.teacherId != 'undefined'){
			if(typeof localStorage.canvasDrwMsg == 'undefined'){
				window.whBoard.view.canvasDrawMsg('Canvas');
				window.whBoard.view.drawLabel('drawArea');
				localStorage.canvasDrwMsg = true;
			}
    	}
		vcan.tempArr = [];
		//num = 0;
		virtualWindow = false;
		//count = 0;
	    //var numb = 0;
  		$(document).on("newmessage", function(e){
  			//++numb;
  			//console.log("number " + numb);

  			if(e.message.hasOwnProperty('virtualWindow')){
				if(e.message.virtualWindow.hasOwnProperty('resizeWindow')){
  					//console.log('received packet ' + (++count));
  				}
  				
  				whBoard.view.virtualWindow.manupulation(e);
  				return;
  			}
  			

  				
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
            			whBoard.utility.uniqueArrOfObjsToOther();
            			whBoard.view.disappearBox('Canvas');
                		whBoard.view.disappearBox('drawArea');
                		
                		var canvasWrapper = document.getElementById("vcanvas");
						canvasWrapper.className = canvasWrapper.className.replace(/\bteacher\b/, ' ');
						canvasWrapper.className = 'student'
						localStorage.canvasDrwMsg = true;
						
						if(localStorage.getItem('orginialTeacherId') ==  null){
							//var toolHeight = localStorage.getItem('toolHeight');
							whBoard.utility.setCommandToolHeights(toolHeight, 'decrement');
						}	
						

						return;
        			}else{
        				if(localStorage.getItem('orginalTeacherId') !=  null){
							//var toolHeight = localStorage.getItem('toolHeight');
        					var toolHeight = localStorage.getItem('toolHeight');
        					whBoard.utility.setCommandToolHeights(toolHeight, 'increment');
						}	
        				whBoard.utility.uniqueArrOfObjsToSelf();
        				var canvasWrapper = document.getElementById("vcanvas");
						canvasWrapper.className = canvasWrapper.className.replace(/\bstudent\b/, ' ');
						canvasWrapper.className = 'teacher';
						localStorage.canvasDrwMsg = true;
						
						
        				return;
        			}
        		}
        		
        		if(e.message.hasOwnProperty('assignRole')){
        			var  toolHeight = e.message.toolHeight;
        			if(e.fromUser.userid != id){
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
						
					
						var toolHeight = localStorage.getItem('toolHeight');
						whBoard.utility.setCommandToolHeights(toolHeight, 'increment');
						
            			return;
        			}else{
        				whBoard.utility.uniqueArrOfObjsToOther();
        				if(!whBoard.utility.chkValueInLocalStorage('orginalTeacherId')){
        					var canvasWrapper = document.getElementById("vcanvas");
    						canvasWrapper.className = canvasWrapper.className.replace(/\bteacher\b/, ' ');
    						canvasWrapper.className = 'student'
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
					window.whBoard.vcan.main.replayObjs =  whBoard.globalObj.replayObjs;
					whBoard.utility.clearAll(false);
					whBoard.toolInit('t_replay', 'fromFile');
				}
    		}
    	});
  		
   });
});

