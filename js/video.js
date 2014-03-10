(
	function (window){
		var vm_chat = window.vm_chat;
		var vcan = window.vcan;
		var whBoard = window.whBoard;
		
		//have to 
		var responseErorr = function (){
			console.log("this error is come when the create and answer is occurring");
		}
		vcan.videoChat = function (){
			return {
		    	isChannelReady : '',
		    	isInitiator : false,
		    	isStarted : '',
		    	//browserLen : 0,
		    	localStream : '',
		    	//pc : '',
		    	pc : [],
		    	cn : 0,
		    	ba : false,
		    	bb : false,
		    	bc : false,
		    	bNotRender : false,
		    	remoteStream : '',
		    	turnReady : '',
		    	oneExecuted : false,
		    	videoControlId : 'videoContainer',
		    	videoContainerId : "videos",
		    	
		    	init : function (vbool){
		    		    //attach event handler
		    		    //TODO this variable should be localized	    
		    			cthis = this; 
		    		//	document.getElementById('videoOff').addEventListener('click', cthis.hangup);
		    			
		    			//document.getElementById('videoOn').addEventListener('click', cthis);
		    			
//		    			if(typeof vbool != 'undefined'){
//		    				cthis.cn++;
//			    			console.log('cna ' + ' ' + cthis.cn);
//		    			}
		    			
		    			/*
		    			var headingTag = document.createElement('h4');
		    				headingTag.id = 'videoHeading';
		    				headingTag.innerHTML  = "User Video";
		    				var beforeAppend = document.getElementById('localVideo');
		    				beforeAppend.parentNode.insertBefore(headingTag, beforeAppend); */
		    			
		    			vcan.oneExecuted = true;
		    			
		    			cthis.createMiniMizeButton();
//		    			var  videoCmd = document.getElementById("videoMiniMize");
//		    			videoCmd.addEventListener('click', cthis.miniMizeVideo);
		    			
		    			
		    			//divCmd.addEventListener('click', cthis.resizeVideo);
		    			
			    		vcan.videoChat.localVideo = document.querySelector('#localVideo');
			    		vcan.videoChat.remoteVideo = document.querySelector('#remoteVideo');
			    		vcan.videoChat.remoteVideo2 = document.querySelector('#remoteVideo2');
			    		
			    		//vcan.videoChat.localVideo = document.querySelector('#localVideo');
			    		this.pc_config = window.webrtcDetectedBrowser === 'firefox' ?
								  {'iceServers':[{'url':'stun:23.21.150.121'}]} : // number IP
								  {'iceServers': [{'url': 'stun:stun.l.google.com:19302'}]};
						this.pc_constraints = {
							  'optional': [
							    {'DtlsSrtpKeyAgreement': true},
							    {'RtpDataChannels': true}
							  ]};

						// Set up audio and video regardless of what devices are present.
						this.sdpConstraints = {'mandatory': {
						  'OfferToReceiveAudio':true,
						  'OfferToReceiveVideo':true }
						};		  
						
						/*
						if(navigator.mozGetUserMedia){
							//debugger;
							//vm_chat.send({'create':true});
							vm_chat.send({'video': {'create':true}})
							//socket.emit('message', {'create':true});
							console.log('creating room');
						}else{
							//vm_chat.send({'join':true});
							//vm_chat.send({'join':true});
							vm_chat.send({'video': {'join':true}});
						} */
						
						this.constraints = {video: true, audio : true, cthis : this};
						navigator.getUserMedia(this.constraints, this.handleUserMedia, this.handleUserMediaError);
//						if(typeof localStorage.teacherId != 'undefined'){
//							//alert("this is performing");
//							whBoard.view.multiMediaMsg();
//						}
						//alert(whBoard.system.wbRtc.peerCon);
						if(whBoard.system.wbRtc.peerCon){
							if(typeof localStorage.wbrtcMsg == 'undefined'){
								whBoard.view.multiMediaMsg('WebRtc');
								localStorage.wbrtcMsg = true;
							}
						}
						
						console.log('Getting user media with constraints', this.constraints);
	    			
				}, 
				
				sendMessage : function(message){
					console.log('Sending message: ', message);
					//socket.emit('message', message);
					//vm_chat.send(message);
					if(arguments.length>1){
						vm_chat.send({'video': message}, arguments[1]);
					}else{
						vm_chat.send({'video': message});
					}
					
				},
				
				////////////////////////////////////////////////////
//				var localVideo = document.querySelector('#localVideo');
//				var remoteVideo = document.querySelector('#remoteVideo');

				handleUserMedia : function (stream) {
					  //whBoard.view.disappearBox();
					  whBoard.view.disappearBox('WebRtc');
					  cthis.localStream = stream;
					  
					  whBoard.attachMediaStream(vcan.videoChat.localVideo, stream);
					  console.log('Adding local stream.');
					  
					  //					  
					  if(whBoard.clentLen == 1){
						  cthis.sendMessage('got user media');
					  }
					  
					  // this whole feature can be hide 
					  // if we avoid this feature.
					  if(whBoard.clientLen >= 2){
						  vm_chat.send({'vidInit' : true})
					  }
	
//					   // NOTE:- warning:- can be very critical
//					  if(cthis.isInitiator) {
//						  cthis.maybeStart();
//					  }
				}, 

				handleUserMediaError : function (error){
					//whBoard.view.disappearBox();
					whBoard.view.disappearBox('WebRtc');					
					console.log('navigator.getUserMedia error: ', error);
				}, 

				maybeStart : function(fromUserId) {
					if ((fromUserId != id && !cthis.isStarted && cthis.localStream && cthis.isChannelReady) || 
							(whBoard.joinUserId == id && !cthis.isStarted && cthis.localStream && cthis.isChannelReady  && !cthis.isInitiator)) {
						if(cthis.pc.length > 0){
							 cthis.cn++;
						}
						
						cthis.createPeerConnection();
						cthis.pc[cthis.cn].addStream(cthis.localStream);
						cthis.isStarted = true;
						
					    if (cthis.isInitiator) {
					    	cthis.doCall();
					    }
					}
				},

				createPeerConnection : function () {
				  try {
					  
					  //last key/index of array
					 var tpc = new whBoard.RTCPeerConnection(this.pc_config, this.pc_constraints)
					 cthis.pc.push(tpc);
					 cthis.pc[cthis.cn].onicecandidate = cthis.handleIceCandidate;
					 				  //onclosedconnection
					 cthis.pc[cthis.cn].onclosedconnection = function (){
						 //alert("hello brother closeed");
					 }
					 console.log('Created RTCPeerConnnection with:\n' +
				      '  config: \'' + JSON.stringify(this.pc_config) + '\';\n' +
				      '  constraints: \'' + JSON.stringify(this.pc_constraints) + '\'.');
				  } catch (e) {
				    console.log('Failed to create PeerConnection, exception: ' + e.message);
				    //alert('Cannot create RTCPeerConnection object.');
				      return;
				  }
				  
				  cthis.pc[cthis.cn].onaddstream = cthis.handleRemoteStreamAdded;
				  cthis.pc[cthis.cn].onremovestream = cthis.handleRemoteStreamRemoved;
				}, 

				handleIceCandidate: function(event) {
				  console.log('handleIceCandidate event: ', event);
				  if (event.candidate) {
					  cthis.sendMessage({
						  type: 'candidate',
						  label: event.candidate.sdpMLineIndex,
						  id: event.candidate.sdpMid,
						  candidate: event.candidate.candidate});
				  } else {
				    console.log('End of candidates.');
				  }
				}, 

				handleRemoteStreamAdded : function(event) {
					console.log('Remote stream added.');
					
					//reattachMediaStream(miniVideo, localVideo);
					////alert('sumanbrother');
					//debugger;
					//for remote 1
					if(cthis.cn == 0){
						whBoard.attachMediaStream(vcan.videoChat.remoteVideo, event.stream);
						cthis.remoteStream = event.stream;
					//}else if(cthis.cn > 1 ){
					}else if(cthis.pc.length > 1 ){
						// for remote 2	
						whBoard.attachMediaStream(vcan.videoChat.remoteVideo2, event.stream);
						cthis.remoteStream = event.stream;
					}
					
				//  waitForRemoteVideo();
				}, 

				doCall : function() {
//					alert('do call');
					console.log('Do Call');
//					/alert("do call");
				  ////alert(cthis.id);
				  ////alert('hi hello');
				  var constraints = {'optional': [], 'mandatory': {'MozDontOfferDataChannel': true}};
				  // temporary measure to remove Moz* constraints in Chrome
				  if (window.webrtcDetectedBrowser === 'chrome') {
				    for (var prop in constraints.mandatory) {
				      if (prop.indexOf('Moz') !== -1) {
				        delete constraints.mandatory[prop];
				      }
				     }
				   }
				  constraints = this.mergeConstraints(constraints, this.sdpConstraints);
				  console.log('Sending offer to peer, with constraints: \n' +
				    '  \'' + JSON.stringify(constraints) + '\'.');
				  crtOffer = true;
				  cthis.pc[cthis.cn].createOffer(this.setLocalAndSendMessage, responseErorr, constraints);
				  
				}, 

				doAnswer:  function () {
				  console.log('Sending answer to peer.');
				  crtAns = true;
				  cthis.pc[cthis.cn].createAnswer(this.setLocalAndSendMessage, responseErorr, this.sdpConstraints);
				  
				},

				mergeConstraints : function(cons1, cons2) {
				  var merged = cons1;
				  for (var name in cons2.mandatory) {
				    merged.mandatory[name] = cons2.mandatory[name];
				  }
				  merged.optional.concat(cons2.optional);
				  return merged;
				}, 

				 setLocalAndSendMessage : function(sessionDescription) {
				  // Set Opus as the preferred codec in SDP if Opus is present.
				  sessionDescription.sdp =cthis.preferOpus(sessionDescription.sdp);
				  cthis.pc[cthis.cn].setLocalDescription(sessionDescription);
				  
//				  if(typeof crtOffer != 'undefined'){
//					  cthis.sendMessage(sessionDescription, 15);
//					  crtAns = false;
//				  }
//				  
//				  if(typeof crtAns != 'undefined'){
//					  if(crtAns == true){
//						  cthis.sendMessage(sessionDescription, 45);  
//					  }
//					  
//				  }
				  
				  cthis.sendMessage(sessionDescription);
				  
				},

				handleRemoteStreamRemoved:function(event) {
					//alert("suman bgoati");
					console.log('Remote stream removed. Event: ', event);
				},

				hangup : function() {
				  
				  ////alert('raju brother');
				  //console.log('Hanging up.');
				  cthis.stop();
				  cthis.sendMessage('bye');
				}, 

				handleRemoteHangup : function() {
//				  alert('sss');
//				  cthis.pc.splice(0, 1);
				  console.log('Session terminated.');
				  ////alert('suman bogati is there');
				  cthis.transitionToWaiting();
				  cthis.isInitiator = true;
				  cthis.isStarted = false;
				  cthis.stop();
				  cthis.pc.splice(0, 1);
				 // //alert('suman bogati');
				  //debugger;
				  
				},
				
				transitionToWaiting : function() {
						
						vcan.videoChat.remoteVideo.src = '';
					  //card.style.webkitTransform = 'rotateY(0deg)';
//					  setTimeout(function() {
//						  //  localVideo.src = miniVideo.src;
//						  //  miniVideo.src = '';
//						  
//						//  vcan.videoChat.remoteVideo.src = '';
//						  var tval = "";
//					  }, 500);
					  
				},

				stop : function() {
					  this.isStarted = false;
					  // isAudioMuted = false;
					  // isVideoMuted = false;
					  //this.pc.close();
					  //this.pc = null;
					  this.pc[cthis.cn].close();
					  this.pc[cthis.cn] = null;
					  this.pc.splice(0, 1);
				},

				///////////////////////////////////////////

				// Set Opus as the default audio codec if it's present.
				preferOpus : function(sdp) {
				  var sdpLines = sdp.split('\r\n');
				  var mLineIndex;
				  // Search for m line.
				  for (var i = 0; i < sdpLines.length; i++) {
				      if (sdpLines[i].search('m=audio') !== -1) {
				          mLineIndex = i;
				          break;
				      }
				  }
				  
				  if (mLineIndex === null) {
					  return sdp;
				  }

				  // If Opus is available, set it as the default in m line.
				  for (i = 0; i < sdpLines.length; i++) {
				    if (sdpLines[i].search('opus/48000') !== -1) {
				      var opusPayload = cthis.extractSdp(sdpLines[i], /:(\d+) opus\/48000/i);
				      if (opusPayload) {
				        sdpLines[mLineIndex] = cthis.setDefaultCodec(sdpLines[mLineIndex], opusPayload);
				      }
				      break;
				    }
				  }
				  
				  // Remove CN in m line and sdp.
				  sdpLines = this.removeCN(sdpLines, mLineIndex);

				  sdp = sdpLines.join('\r\n');
				  return sdp;
				}, 

				extractSdp : function(sdpLine, pattern) {
				  var result = sdpLine.match(pattern);
				  return result && result.length === 2 ? result[1] : null;
				},

				// Set the selected codec to the first in m line.
				setDefaultCodec : function(mLine, payload) {
				  var elements = mLine.split(' ');
				  var newLine = [];
				  var index = 0;
				  for (var i = 0; i < elements.length; i++) {
				    if (index === 3) { // Format of media starts from the fourth.
				      newLine[index++] = payload; // Put target payload to the first.
				    }
				    if (elements[i] !== payload) {
				      newLine[index++] = elements[i];
				    }
				  }
				  return newLine.join(' ');
				},

				// Strip CN from sdp before CN constraints is ready.
				removeCN : function(sdpLines, mLineIndex) {
				  var mLineElements = sdpLines[mLineIndex].split(' ');
				  // Scan from end for the convenience of removing an item.
				  for (var i = sdpLines.length-1; i >= 0; i--) {
				    var payload = cthis.extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/\d+/i);
				    if (payload) {
				      var cnPos = mLineElements.indexOf(payload);
				      if (cnPos !== -1) {
				        // Remove CN payload from m line.
				        mLineElements.splice(cnPos, 1);
				      }
				      // Remove CN line in sdp
				      sdpLines.splice(i, 1);
				    }
				  }

				  sdpLines[mLineIndex] = mLineElements.join(' ');
				  return sdpLines;
				},
			
		    videoOnMsg : function (message, fromUserId){
		    		if(message.hasOwnProperty('isChannelReady')){
		    			cthis.isChannelReady = true;
		    		}
		    		
				  console.log('Received message:', message);
				  
				  if(message === 'got user media suman'){
					  cthis.bNotRender = true;
					  cthis.maybeStart();
				  }else if (message === 'got user media') {
//					  alert('just started suman');
					//  cthis.bNotRender = true;
					   cthis.maybeStart(fromUserId);
					   
				  }else if (message.type === 'offer'){
				    if (!cthis.isInitiator && !cthis.isStarted) {
				    	cthis.maybeStart();
				    }
				    
				    cthis.pc[cthis.cn].setRemoteDescription(new whBoard.RTCSessionDescription(message));
				    
				    cthis.doAnswer();
				  } else if (message.type === 'answer' && cthis.isStarted) {
					  cthis.pc[cthis.cn].setRemoteDescription(new whBoard.RTCSessionDescription(message));
				  } else if (message.type === 'candidate' && cthis.isStarted) {
//					alert('sss');
//					debugger;
				    var candidate = new whBoard.RTCIceCandidate({sdpMLineIndex:message.label,
				      candidate:message.candidate});
				    cthis.pc[cthis.cn].addIceCandidate(candidate);
				  } else if (message === 'bye'){
					  tempIsInitiaor = true;
					  if(cthis.isStarted){
						  cthis.handleRemoteHangup();
					  }
				  }
//				  if(message === 'bye' && cthis.isStarted) {	
//					  cthis.handleRemoteHangup();
//				  }
		    },
		    
		    hangUp : function (){
		    	
		    }, 
		    
		    miniMizeVideo : function (){
		    	//cthis.minButtonId = this.id;
		    	//var currentId = this.id;
		    	var toBeHideVideo = document.getElementById(cthis.videoControlId);
		    	var parTag = toBeHideVideo.parentNode;
		    	toBeHideVideo.style.display = 'none'
		    	
		    	cthis.removeButton(cthis.minButtonId);
		    	cthis.createMaxMizeButton();
		    },
		    
		    maxMizeVideo : function (parTagId){
		    	cthis.createMiniMizeButton();
		    	//	valert(document.getElementById(cthis.videoControlId));
		    	document.getElementById(cthis.videoControlId).style.display = 'block';
		    	cthis.removeButton(cthis.maxButtonId);
		    },
		    
		    
		    removeButton : function (id){
		    	var deleteItem = document.getElementById(id); 
		    	deleteItem.parentNode.removeChild(deleteItem);
		    },
		    
		    //TODO THE functions createMiniMizeButton and createMaxMizeButton should be merged
		    
		    createMiniMizeButton : function (){
		    	cthis.minButtonId = 'videoMinMize';
		        var minButton = document.createElement('div');
		        minButton.id = cthis.minButtonId;
		        //minButton.className = 'tooltip';
		        minButton.innerHTML = '<a href="#" title="" data-title="Minmize The Video" class="tooltip">&nbsp;</a>';
		        minButton.addEventListener('click', cthis.miniMizeVideo);
		        
		        var parElement = document.getElementById(cthis.videoControlId);
		        parElement.insertBefore(minButton, parElement.firstChild);
		    },
		    
		    createMaxMizeButton  : function (){
		    	cthis.maxButtonId = 'videoMaxMize';
		        var maxButton = document.createElement('div');
		        maxButton.id = cthis.maxButtonId;
		        //maxButton.className = 'tooltip';
		        //maxButton.innerHTML = '<a href="#" title="" data-title="Maxmize The Video" class="tooltip">&nbsp;</a>';
		        maxButton.innerHTML = '<a href="#" title="" data-title="Maxmize The Video" class="tooltip">&nbsp;</a>';
		        maxButton.addEventListener('click', cthis.maxMizeVideo);
		        
		        var parElement = document.getElementById(cthis.videoContainerId);
		        parElement.insertBefore(maxButton, parElement.firstChild);
		    },
		    
		    // basically this function would called when 
		    // second browser would come or any browser refresh the 
		    // after both browser come
			isVideoFound : function (videoFound, fromUser){
					if(fromUser != id){
						if(videoFound == false){
							cthis.isInitiator = true;
						}
						alert('this is chrome');
						cthis.sendMessage('got user media');
					}
				}
			}
		}
		
		vcan.videoChat.hangup2 = function (){
			//alert("this is performing");
		}
		
		
		window.onbeforeunload = function() {
			//tempIsInitiaor = true;
			////alert('suman bo');
			cthis.sendMessage('bye');
			//THIS COULD BE VERY DANGEROUS
			vm_chat.disconnect();
		}
		
		window.isVideoFound = function (videoFound, fromUser){
			if(fromUser != id){
				if(videoFound == false){
					cthis.isInitiator = true;
				}
				cthis.sendMessage('got user media');
			}
		}
	}		
	
)(window);
