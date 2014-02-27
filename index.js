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
    	
    	if(localStorage.getItem('otherRole') != null){
		//	console.log("he guys");
			localStorage.removeItem('otherRole');	
		}
    	/**
    	 * This should be wrapped into object
    	 */
    	whBoard.currId = id;
    	whBoard.currRole = role;
    	
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
    	
    	//alert(vm_chat);
    	
//    	window.whBoard.attachToolFunction(vcan.cmdWrapperDiv);
//    	window.whBoard.init();
//    	whBoard.utility.makeCanvasDisable();
    	
//    	function displayCanvas(){
//			//alert("you there bro");
//			//debugger;
//    		window.whBoard.attachToolFunction(vcan.cmdWrapperDiv);
//        	window.whBoard.init();
//        	whBoard.utility.makeCanvasDisable();
//    	}
    	
    	window.addEventListener('click', function (){
    		whBoard.view.disappearBox('WebRtc')
    		whBoard.view.disappearBox('Canvas');
    		whBoard.view.disappearBox('drawArea');
    	});
    	
    	 
    	 if(role == 't'){
				if(localStorage.getItem('studentId') != null){
					localStorage.removeItem('studentId');
				}
		  }else if(role == 's'){
			    if(localStorage.getItem('orginalTeacherId') != null){
					localStorage.removeItem('orginalTeacherId');
					if(localStorage.getItem('teacherId') != null){
	  					localStorage.removeItem('teacherId');
	  				}
				}
		  }
			  
    	//var storageHasReclaim = whBoard.utility.chkValueInLocalStorage('reclaim');
    	//var storageHasTeacher = whBoard.utility.chkValueInLocalStorage('teacherId');
    	
//    	if(!storageHasTeacher && !storageHasReclaim){
//    		whBoard.utility.removeToolBox();
//    		whBoard.utility.setClass('vcanvas', 'student');
//		}else{
//    		whBoard.utility.setClass('vcanvas', 'teacher');
//		}
    	
//    	if(storageHasReclaim){
//    		var cmdToolsWrapper = document.getElementById(whBoard.commandToolsWrapperId);	
//			while(cmdToolsWrapper.hasChildNodes()){
//				cmdToolsWrapper.removeChild(cmdToolsWrapper.lastChild);
//			}
//    		whBoard.utility.createReclaimButton(cmdToolsWrapper);
//    	}
    	
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
       	
//    	if(typeof(Storage)!=="undefined"){
//			if(localStorage.repObjs){
//				var allRepObjs = JSON.parse(localStorage.repObjs);
//				whBoard.vcan.main.replayObjs = allRepObjs;
//				whBoard.utility.clearAll(false, 'dontClear');
//				
//				// TODO this should not be run should do improvement
////				for(i=0; i<allRepObjs.length; i++){
////					replayObjs.push(allRepObjs[i]);
////				}
//				whBoard.globalObj.replayObjs = whBoard.globalObj.replayObjs.concat(allRepObjs);
//				if(allRepObjs.length > 0){
//					whBoard.uid = allRepObjs[allRepObjs.length-1].uid;
//					vcan.reachedItemId = whBoard.uid;
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
    	
//		var myVideo = new window.whBoard.vcan.videoChat();
//		vcan.myvid = myVideo;
//		vcan.renderedObjId = 0;
		
		$(document).on("member_removed", function(e){
			whBoard.utility.makeCanvasDisable();
			whBoard.utility.setStyleUserConnetion('con', 'coff');

			var vdiv = document.getElementById('virtualWindow');
			if(vdiv != null){
				vdiv.parentNode.removeChild(vdiv);
			}
			
			//cthis.isStarted = false;
			whBoard.user.connected = false;
			localStorage.removeItem('otherRole');

			
//			document.getElementsByClassName('con')[0].className = 'coff controlCmd';
			
//			var vdiv = document.getElementById('virtualWindow');
//			if(vdiv != null){
//				vdiv.parentNode.removeChild(vdiv);
//			}
			
			
		});
		
//		function initAll(e){
//			//whBoard.utility.isUserConnected(e.message.length);
//////			whBoard.utility.isUserConnected(e.message.checkUser.e.clientLen);
////			
////			if(whBoard.user.connected){
////				whBoard.utility.makeCanvasEnable();
////				whBoard.utility.setStyleUserConnetion('coff', 'con');
////			}
//			
//			//if(typeof vcan.teacher == 'undefined' && !storageHasTeacher){
//			
//						
//
//			//if(!storageHasTeacher){
//			if(localStorage.getItem('teacherId') != null){
//  				whBoard.utility.makeCanvasDisable();
//			}
//			
//		//	whBoard.utility.initDefaultInfo(e,  myVideo, role);
//
//			var res = whBoard.system.measureResoultion({'width' : window.outerWidth, 'height' : window.innerHeight });
//			
//			var toolHeight = whBoard.utility.getWideValueAppliedByCss('commandToolsWrapper');
//			if(toolHeight != false){
//				vm_chat.send({'virtualWindow' : {'shareBrowserWidth':true, 'browserRes' : res, 'toolHeight' : toolHeight, 'role' : role}});
//			}else{
//				vm_chat.send({'virtualWindow' : {'shareBrowserWidth':true, 'browserRes': res, 'role' : role}});
//			}	
//		}
		
		$(document).on("member_added", function(e){
//			alert(e.message.length);
			vm_chat.send({'checkUser' : {'role':role, 'e' : {'clientLen' :e.message.length, 'newUser' : e.newuser }}, 'joinId' : e.message[e.message.length-1].userid});
			//vm_chat.send({'checkUser' : {'role':role, 'e' : e}});
		
//			whBoard.utility.isUserConnected(e.message.length);
//			if(whBoard.user.connected){
//				whBoard.utility.makeCanvasEnable();
//				whBoard.utility.setStyleUserConnetion('coff', 'con');
//			}
//			
//			if(typeof vcan.teacher == 'undefined' && !storageHasTeacher){
//  				whBoard.utility.makeCanvasDisable();
//			}
//			
//			whBoard.utility.initDefaultInfo(e,  myVideo, role);
//
//			var res = whBoard.system.measureResoultion({'width' : window.outerWidth, 'height' : window.innerHeight });
//			
//			var toolHeight = whBoard.utility.getWideValueAppliedByCss('commandToolsWrapper');
//			if(toolHeight != false){
//				vm_chat.send({'virtualWindow' : {'shareBrowserWidth':true, 'browserRes' : res, 'toolHeight' : toolHeight, 'role' : role}});
//			}else{
//				vm_chat.send({'virtualWindow' : {'shareBrowserWidth':true, 'browserRes': res, 'role' : role}});
//			}
				
  		});
		
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
		
//		function bootStrapCanvas(e){
//			console.log("created canvas");
//			//alert(e.message.checkUser.clientNum);
//		    //e.messag = {'length' : e.message.checkUser.clientNum}
//			e.messag = {'length' : e.message.checkUser.e.clientLen};
//			e.newuser = e.message.checkUser.newUser;
//			displayCanvas();
//			var myVideo = new window.whBoard.vcan.videoChat();
//			vcan.myvid = myVideo;
//			vcan.renderedObjId = 0;
//			if(whBoard.role == 't'){
//				vcan.teacher = true;
//			}
//			initAll(e);
//			whBoard.utility.initDefaultInfo(e,  myVideo, role);
//			var storageHasReclaim = whBoard.utility.chkValueInLocalStorage('reclaim');
//			var storageHasTeacher = whBoard.utility.chkValueInLocalStorage('teacherId');
//		
//			if(!storageHasTeacher && !storageHasReclaim){
//			whBoard.utility.removeToolBox();
//	    		whBoard.utility.setClass('vcanvas', 'student');
//			}else{
//	    		whBoard.utility.setClass('vcanvas', 'teacher');
//			}
//			
//			if(storageHasReclaim){
//	    		var cmdToolsWrapper = document.getElementById(whBoard.commandToolsWrapperId);	
//				while(cmdToolsWrapper.hasChildNodes()){
//					cmdToolsWrapper.removeChild(cmdToolsWrapper.lastChild);
//				}
//	    		whBoard.utility.createReclaimButton(cmdToolsWrapper);
//	    	}
//			
//			if(typeof(Storage)!=="undefined"){
//				if(localStorage.repObjs){
//					var allRepObjs = JSON.parse(localStorage.repObjs);
//					whBoard.vcan.main.replayObjs = allRepObjs;
//					whBoard.utility.clearAll(false, 'dontClear');
//				
//					whBoard.globalObj.replayObjs = whBoard.globalObj.replayObjs.concat(allRepObjs);
//					if(allRepObjs.length > 0){
//						whBoard.uid = allRepObjs[allRepObjs.length-1].uid;
//						vcan.reachedItemId = whBoard.uid;
//						whBoard.toolInit('t_replay', 'fromBrowser', true, whBoard.utility.packetQueue);
//					}
//				}
//			}
//			
//			if(typeof localStorage.teacherId != 'undefined'){
//				if(typeof localStorage.canvasDrwMsg == 'undefined'){
//					window.whBoard.view.canvasDrawMsg('Canvas');
//					window.whBoard.view.drawLabel('drawArea');
//					localStorage.canvasDrwMsg = true;
//				}
//	    	}
//
//			
//			whBoard.globalObj.myrepObj = whBoard.vcan.getStates('replayObjs');
//			whBoard.globalObj.chunk = [];
//  		
//  			whBoard.canvas.bind('keydown', whBoard.keyBoard.triggerActiveAll);
//			whBoard.canvas.bind('keyup', whBoard.keyBoard.triggerdeActiveAll);
//		}
		
		$(document).on("newmessage", function(e){
			if(e.message.hasOwnProperty('checkUser')){
				var joinId = e.message.joinId;
				connectNum++;
				//alert(connectNum + ' ' +  e.message.checkUser.e.clientLen);
				var alreadyExist = whBoard.utility.existUserLikeMe(e);
//				alert(alreadyExist);
				console.log('form Id' +  e.fromUser.userid);
				//bootStrapCanvas(e);

				//if(connectNum == parseInt(e.message.checkUser.e.clientLen, 10)){
					
				//if((e.fromUser.userid == id && e.fromUser.userid == joinId) ){
					//alert('hello guys'  + e.fromUser.userid);
			//	}
				//if(connectNum == parseInt(e.message.checkUser.e.clientLen, 10) || localStorage.getItem('otherRole') == null){
				//|| (id == joinId)
					if((e.fromUser.userid == id && e.fromUser.userid == joinId) ){
						// this whole code put inside the setTimeout function for server synchronious
						// there is no consitent response from server to browser.
						// So setTimeout let browser waits until all the respones come from browser.
						//TODO need to find out better solution
					//	bootStrapCanvas(e);
						setTimeout(
							function (){
								alreadyExist = whBoard.utility.existUserLikeMe(e);
								if(alreadyExist){
									alert('Either Teacher Or Student is already existed, \nIt\'s also possible there other role is passing');
				  					return;	
								}else{
									whBoard.utility.bootStrapCanvas(e);
								
//									console.log("created canvas");
//				  				    e.messag = {'length' : e.message.checkUser.clientNum}
//			  	  					e.newuser = e.message.checkUser.newUser;
//			  	  					displayCanvas();
//			  	  					var myVideo = new window.whBoard.vcan.videoChat();
//			  	  					vcan.myvid = myVideo;
//			  	  					vcan.renderedObjId = 0;
//			  	  					if(whBoard.role == 't'){
//			  	  						vcan.teacher = true;
//			  	  					}
//			  	  					initAll(e);
//			  	  					whBoard.utility.initDefaultInfo(e,  myVideo, role);
//			  	  					var storageHasReclaim = whBoard.utility.chkValueInLocalStorage('reclaim');
//									var storageHasTeacher = whBoard.utility.chkValueInLocalStorage('teacherId');
//									
//			  	  					if(!storageHasTeacher && !storageHasReclaim){
//										whBoard.utility.removeToolBox();
//			  	  			    		whBoard.utility.setClass('vcanvas', 'student');
//			  	  					}else{
//			  	  			    		whBoard.utility.setClass('vcanvas', 'teacher');
//			  	  					}
//			  	  					
//			  	  					if(storageHasReclaim){
//			  	  			    		var cmdToolsWrapper = document.getElementById(whBoard.commandToolsWrapperId);	
//			  	  						while(cmdToolsWrapper.hasChildNodes()){
//			  	  							cmdToolsWrapper.removeChild(cmdToolsWrapper.lastChild);
//			  	  						}
//			  	  			    		whBoard.utility.createReclaimButton(cmdToolsWrapper);
//			  	  			    	}
//			  	  					
//			  	  					if(typeof(Storage)!=="undefined"){
//			  	  						if(localStorage.repObjs){
//			  	  							var allRepObjs = JSON.parse(localStorage.repObjs);
//			  	  							whBoard.vcan.main.replayObjs = allRepObjs;
//			  	  							whBoard.utility.clearAll(false, 'dontClear');
//			  	  						
//			  	  							whBoard.globalObj.replayObjs = whBoard.globalObj.replayObjs.concat(allRepObjs);
//			  	  							if(allRepObjs.length > 0){
//			  	  								whBoard.uid = allRepObjs[allRepObjs.length-1].uid;
//			  	  								vcan.reachedItemId = whBoard.uid;
//			  	  								whBoard.toolInit('t_replay', 'fromBrowser', true, whBoard.utility.packetQueue);
//			  	  							}
//			  	  						}
//			  	  					}
//			  	  					
//			  	  					if(typeof localStorage.teacherId != 'undefined'){
//			  	  						if(typeof localStorage.canvasDrwMsg == 'undefined'){
//			  	  							window.whBoard.view.canvasDrawMsg('Canvas');
//			  	  							window.whBoard.view.drawLabel('drawArea');
//			  	  							localStorage.canvasDrwMsg = true;
//			  	  						}
//			  	  			    	}
//	
//			  	  				
//			  	  				whBoard.globalObj.myrepObj = whBoard.vcan.getStates('replayObjs');
//			  	        		whBoard.globalObj.chunk = [];
//			  	        		
//			  	        		whBoard.canvas.bind('keydown', whBoard.keyBoard.triggerActiveAll);
//			  					whBoard.canvas.bind('keyup', whBoard.keyBoard.triggerdeActiveAll);
									
//									whBoard.utility.makeUserAvailable(e.message.checkUser.e.clientLen);
//									whBoard.utility.makeUserAvailable = function (browerLength){
//										whBoard.utility.isUserConnected(browerLength);
//										if(whBoard.user.connected){
//											whBoard.utility.makeCanvasEnable();
//											whBoard.utility.setStyleUserConnetion('coff', 'con');
//										}
//									}
									
									whBoard.utility.makeUserAvailable(e.message.checkUser.e.clientLen);
//									whBoard.userAvailable = false;
//									whBoard.utility.isUserConnected(e.message.checkUser.e.clientLen);
//									if(whBoard.user.connected){
//										whBoard.utility.makeCanvasEnable();
//										whBoard.utility.setStyleUserConnetion('coff', 'con');
//									}
								}
								
							}, 1200  //time may increased according to server response
						);
				}else{
					
					whBoard.utility.makeUserAvailable(e.message.checkUser.e.clientLen);
					
//					if(!whBoard.hasOwnProperty('userAvailable')){
//						alert('display');
//						whBoard.utility.makeUserAvailable(e.message.checkUser.e.clientLen);
//					}else{
//						alert('not display');
//					}
					
//					if(typeof userAvailable == 'undefined'){
//						alert('happening');
//						whBoard.utility.makeUserAvailable(e.message.checkUser.e.clientLen);
//					}else{
//						alert("simran bahadue");
//					}
					
//					whBoard.utility.isUserConnected(e.message.checkUser.e.clientLen);
//					if(whBoard.user.connected){
//						whBoard.utility.makeCanvasEnable();
//						whBoard.utility.setStyleUserConnetion('coff', 'con');
//					}
				}
  				
					
  					
//  	  				whBoard.utility.isUserConnected(e.message.checkUser.e.clientLen);
//					if(whBoard.user.connected){
//						whBoard.utility.makeCanvasEnable();
//						whBoard.utility.setStyleUserConnetion('coff', 'con');
//					}
  					
//  					whBoard.canvas.bind('keydown', whBoard.keyBoard.triggerActiveAll);
//  					whBoard.canvas.bind('keyup', whBoard.keyBoard.triggerdeActiveAll);
//				}else{
//					alert('id ' + e.message.checkUser.e.clientLen);
//				}
				
		
				
				if(alreadyExist && (id == joinId) && (e.fromUser.userid != id)){
			//		alert('Either Teacher Or Student is already existed, \nIt\'s also possible there other role is passing + suman');
				//	return;
				}else{
				
//					if((e.fromUser.userid == id) && (e.fromUser.userid == joinId)){
//						if(alreadyExist){
//						//alert('the teacher is already existed not able join the room');
//						alert('Either Teacher Or Student is already existed, \nIt\'s also possible there other role is passing');
//	  					return;	
//						}else{
//
//	  					console.log("created canvas");
//	  				    e.messag = {'length' : e.message.checkUser.clientNum}
//  	  					e.newuser = e.message.checkUser.newUser;
//  	  					displayCanvas();
//  	  					var myVideo = new window.whBoard.vcan.videoChat();
//  	  					vcan.myvid = myVideo;
//  	  					vcan.renderedObjId = 0;
//  	  					if(whBoard.role == 't'){
//  	  						vcan.teacher = true;
//  	  					}
//  	  					initAll(e);
//  	  					
//  	  					whBoard.utility.initDefaultInfo(e,  myVideo, role);
//  	  					
//  	  					var storageHasReclaim = whBoard.utility.chkValueInLocalStorage('reclaim');
//						var storageHasTeacher = whBoard.utility.chkValueInLocalStorage('teacherId');
//						
//  	  					
//  	  					
//  	  					if(!storageHasTeacher && !storageHasReclaim){
//						//	alert("Hi I am here for you");
//						//	debugger;
//  	  			    		whBoard.utility.removeToolBox();
//  	  			    		whBoard.utility.setClass('vcanvas', 'student');
//  	  					}else{
//							//alert("this is performing");
//  	  			    		whBoard.utility.setClass('vcanvas', 'teacher');
//  	  					}
//  	  					
//  	  					if(storageHasReclaim){
//  	  			    		var cmdToolsWrapper = document.getElementById(whBoard.commandToolsWrapperId);	
//  	  						while(cmdToolsWrapper.hasChildNodes()){
//  	  							cmdToolsWrapper.removeChild(cmdToolsWrapper.lastChild);
//  	  						}
//  	  			    		whBoard.utility.createReclaimButton(cmdToolsWrapper);
//  	  			    	}
//  	  					
//  	  					if(typeof(Storage)!=="undefined"){
//  	  						if(localStorage.repObjs){
//  	  							var allRepObjs = JSON.parse(localStorage.repObjs);
//  	  							whBoard.vcan.main.replayObjs = allRepObjs;
//  	  							whBoard.utility.clearAll(false, 'dontClear');
//  	  							
//  	  							// TODO this should not be run should do improvement
////	  	  							for(i=0; i<allRepObjs.length; i++){
////	  	  								replayObjs.push(allRepObjs[i]);
////	  	  							}
//  	  							whBoard.globalObj.replayObjs = whBoard.globalObj.replayObjs.concat(allRepObjs);
//  	  							if(allRepObjs.length > 0){
//  	  								whBoard.uid = allRepObjs[allRepObjs.length-1].uid;
//  	  								vcan.reachedItemId = whBoard.uid;
//  	  								whBoard.toolInit('t_replay', 'fromBrowser', true, whBoard.utility.packetQueue);
//  	  							}
//  	  						}
//  	  					}
//  	  					
//  	  					if(typeof localStorage.teacherId != 'undefined'){
//  	  						if(typeof localStorage.canvasDrwMsg == 'undefined'){
//  	  							window.whBoard.view.canvasDrawMsg('Canvas');
//  	  							window.whBoard.view.drawLabel('drawArea');
//  	  							localStorage.canvasDrwMsg = true;
//  	  						}
//  	  			    	}
//	  				}
//					
//				}
//  					
//  					
//  					
//  					whBoard.utility.isUserConnected(e.message.checkUser.e.clientLen);
//						
//					if(whBoard.user.connected){
//						whBoard.utility.makeCanvasEnable();
//						whBoard.utility.setStyleUserConnetion('coff', 'con');
//					}
//  					
//  					whBoard.canvas.bind('keydown', whBoard.keyBoard.triggerActiveAll);
//  					whBoard.canvas.bind('keyup', whBoard.keyBoard.triggerdeActiveAll);
				}
  			//	}
			}else if(e.message.hasOwnProperty('virtualWindow')){
				
//  				var shareBrowser = 	e.message.virtualWindow.hasOwnProperty('shareBrowserWidth');
//  					if(shareBrowser){
//  						var alreadyExist = whBoard.utility.existUserLikeMe(e);
//  		  				if(alreadyExist){
//  		  					alert('the teacher is already existed not able join the room');
//  		  					return;	
//  		  					
//  		  				}
//  					}
  				
	  				
	  				
					whBoard.view.virtualWindow.manupulation(e);
	  				return;
  			}
  			
			if(e.message.hasOwnProperty('createPeerObj')){
  				myVideo.currBrowser =  e.message.createPeerObj[0];
  				myVideo.peerBrowser =  e.message.createPeerObj[1];
  				if(myVideo.currBrowser == id){
  					
  					if(typeof oneExecuted == 'undefined'){
  						alert("this is also performing");
  						console.log("this is also performing");
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
//  				/alert('ssumn');
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
        				
        				localStorage.setItem('studentId', id);
        				
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
        		
//        		whBoard.globalObj.myrepObj = whBoard.vcan.getStates('replayObjs');
//        		whBoard.globalObj.chunk = [];
	    		
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
		    					&& !e.message.hasOwnProperty('checkUser')){
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
		
//  	window.onbeforeunload = function (){
//  		if(localStorage.getItem('otherRole') != null){
//  			console.log("he guys");
//  		//	localStorage.removeItem('otherRole');	
//  		}
//  	}

		
//     VERY DANGEROUS DO NOT ENABLE 		
//		window.onbeforeunload = function (){
//			vm_chat.disconnect();
//		}
		
   });
});

