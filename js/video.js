(
	function (window){
		var vm_chat = window.vm_chat;
		var vcan = window.vcan;
		var whBoard = window.whBoard;
		vcan.videoChat = function (){
			return {
		    	isChannelReady : '',
		    	isInitiator : false,
		    	isStarted : '',
		    	browserLen : 0,
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
		    	
		    	init : function (vbool){
		    		    //attach event handler
		    		    //		    		    
		    			cthis = this;
		    		//	document.getElementById('videoOff').addEventListener('click', cthis.hangup);
		    			
		    			//document.getElementById('videoOn').addEventListener('click', cthis);
		    			
//		    			if(typeof vbool != 'undefined'){
//		    				cthis.cn++;
//			    			console.log('cna ' + ' ' + cthis.cn);
//		    			}
		    			
		    			vcan.oneExecuted = true;
		    		
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
					  cthis.sendMessage('got user media');
					  if(cthis.isInitiator) {
						  cthis.maybeStart();
					  }
				}, 

				handleUserMediaError : function (error){
					//whBoard.view.disappearBox();
					whBoard.view.disappearBox('WebRtc');					
					console.log('navigator.getUserMedia error: ', error);
				}, 

				maybeStart : function() {
					if (!cthis.isStarted && cthis.localStream && cthis.isChannelReady) {
						////alert(myVideo);
						if(cthis.pc.length > 0){
							 cthis.cn++;
						}
						
						cthis.createPeerConnection();
						cthis.pc[cthis.cn].addStream(cthis.localStream);
						cthis.isStarted = true;
					    if (cthis.isInitiator) {
					    	cthis.doCall();
					    }
							
						
							
						
					    
//						if(cthis.browserLen <=2){
//							if(cthis.pc.length > 0){
//								 cthis.cn++;
//							}
//							
//							cthis.createPeerConnection();
//							cthis.pc[cthis.cn].addStream(cthis.localStream);
//							cthis.isStarted = true;
//						    if (cthis.isInitiator) {
//						    	cthis.doCall();
//						    }
//						}else{
//							//browser A
//							if(cthis.id == '45' & cthis.ba == false){
//								console.log('suman a');
//								cthis.ba = true;
//								
//								if(cthis.pc.length > 0){
//									 cthis.cn++;
//								}
//								cthis.createPeerConnection();
//								cthis.pc[cthis.cn].addStream(cthis.localStream);
//								cthis.isStarted = true;
//								
//							    if (cthis.isInitiator) {
//							    	cthis.doCall();
//							    }
//							    
//							  //browser B
//							}else if(cthis.id == '15' & cthis.bb == false && cthis.bNotRender == true){
//								//console.log('suman b');
//								cthis.bb = true;
//								
//								if(cthis.pc.length > 0){
//									 cthis.cn++;
//								}
//								cthis.createPeerConnection();
//								cthis.pc[cthis.cn].addStream(cthis.localStream);
//								cthis.isStarted = true;
//							    //if (cthis.isInitiator) {
//							    	cthis.doCall();
//							    //}
//							}
//							//browser C
//							if(cthis.id == '41'){
//								console.log('suman c');
//								if(cthis.pc.length > 0){
//									 cthis.cn++;
//								}
//								cthis.createPeerConnection();
//								cthis.pc[cthis.cn].addStream(cthis.localStream);
//								cthis.isStarted = true;
//								
////							    if (cthis.isInitiator) {
////							    	cthis.doCall();
////							    }
//							    
//							    if(cthis.bNotRender == false){
//							    	cthis.isStarted = false;
//							    	cthis.sendMessage('got user media suman');
//							    }
//							}
//						}
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
				//  reattachMediaStream(miniVideo, localVideo);
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
				  cthis.pc[cthis.cn].createOffer(this.setLocalAndSendMessage, null, constraints);
				  
				}, 

				doAnswer:  function () {
				  console.log('Sending answer to peer.');
				  crtAns = true;
				  cthis.pc[cthis.cn].createAnswer(this.setLocalAndSendMessage, null, this.sdpConstraints);
				  
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
				  cthis.pc.splice(0, 1);
				  console.log('Session terminated.');
				  ////alert('suman bogati is there');
				  cthis.transitionToWaiting();
				  cthis.isInitiator = true;
				  cthis.stop();
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
			
		    videoOnMsg : function (message){
		    		if(message.hasOwnProperty('isChannelReady')){
		    			cthis.isChannelReady = true;
		    		}
		    		
//			    	if(message.hasOwnProperty('create')){
//						vm_chat.send({'video': {'created':true}})
//					}else if(message.hasOwnProperty('join')){
//						console.log('Another peer made a request to join room ' + room);
//						console.log('This peer is the initiator of room ' + room + '!');
//						this.isChannelReady = true;
//						 vm_chat.send({'video': {'joined':true}})
//					}else if(message.hasOwnProperty('joined')){
//						console.log('This peer has joined room ' + room);
//						this.isChannelReady = true;
//					}else if(message.hasOwnProperty('created')){
//						console.log('Created room ' + room);
//						this.isInitiator = true;
//					}
				  console.log('Received message:', message);
				  
				  if(message === 'got user media suman'){
					  cthis.bNotRender = true;
					  cthis.maybeStart();
				  }else if (message === 'got user media') {
					  
					//  cthis.bNotRender = true;
					   cthis.maybeStart();
					   
				  }else if (message.type === 'offer'){
				    if (!cthis.isInitiator && !cthis.isStarted) {
				    	cthis.maybeStart();
				    }
				    
				    
				    
				    cthis.pc[cthis.cn].setRemoteDescription(new whBoard.RTCSessionDescription(message));
				    
				    cthis.doAnswer();
				  } else if (message.type === 'answer' && cthis.isStarted) {
					  cthis.pc[cthis.cn].setRemoteDescription(new whBoard.RTCSessionDescription(message));
				  } else if (message.type === 'candidate' && cthis.isStarted) {
				    var candidate = new whBoard.RTCIceCandidate({sdpMLineIndex:message.label,
				      candidate:message.candidate});
				    cthis.pc[cthis.cn].addIceCandidate(candidate);
				  } else if (message === 'bye' && cthis.isStarted) {
					  
					  cthis.handleRemoteHangup();
				  }
		    },
		    
		    hangUp : function (){
		    	
		    }
		    
		}
		
	
		}
		
		vcan.videoChat.hangup2 = function (){
			//alert("this is performing");
		}
		
		
		window.onbeforeunload = function() {
			////alert('suman bo');
			cthis.sendMessage('bye');
			
		}
	}		
	
)(window);
