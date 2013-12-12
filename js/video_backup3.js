(
	function (window){
		window.mysuman = function(){
			console.log('suman bogati');
		}
		var vm_chat = window.vm_chat;
		var vcan = window.vcan;
		vcan.videoChat = function (){
			return {
		    	isChannelReady : '',
		    	isInitiator : '',
		    	isStarted : '',
		    	browserLen : 0,
		    	localStream : '',
		    	//pc : '',
		    	pc : [],
		    	cn : 0,
		    	remoteStream : '',
		    	turnReady : '',
		    	oneExecuted : false,
		    	
		    	init : function (vbool, browser){
		    			cthis = this;
		    			if(typeof browser != 'undefined'){
		    				cthis.myBrowser = browser;
		    			}
		    			
//		    			if(typeof vbool != 'undefined'){
//		    				cthis.cn++;
//			    			console.log('cna ' + ' ' + cthis.cn);
//		    			}
		    			
		    			vcan.oneExecuted = true;
		    		
			    		vcan.videoChat.localVideo = document.querySelector('#localVideo');
			    		vcan.videoChat.remoteVideo = document.querySelector('#remoteVideo');
			    		vcan.videoChat.remoteVideo2 = document.querySelector('#remoteVideo2');
			    		
			    		
			    		//vcan.videoChat.localVideo = document.querySelector('#localVideo');
			    		this.pc_config = webrtcDetectedBrowser === 'firefox' ?
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
						console.log('Getting user media with constraints', this.constraints);
	    			
				}, 
				
				sendMessage : function(message){
					console.log('Sending message: ', message);
					//socket.emit('message', message);
					//vm_chat.send(message);
					vm_chat.send({'video': message});
				},
				
				////////////////////////////////////////////////////
//				var localVideo = document.querySelector('#localVideo');
//				var remoteVideo = document.querySelector('#remoteVideo');

				handleUserMedia : function (stream) {
					  //debugger;
					  //cthis = vcan.vid;
					  cthis.localStream = stream;
					  //alert('fine i am there for you');
					  //debugger;
					  attachMediaStream(vcan.videoChat.localVideo, stream);
					  console.log('Adding local stream.');
					 // alert('ssuman bogati');
					  //debugger;
					  cthis.sendMessage('got user media');
					  if(cthis.isInitiator) {
						  //alert('this should happend');
						  //debugger;
						  cthis.maybeStart();
					  }
				}, 

				handleUserMediaError : function (error){
					console.log('navigator.getUserMedia error: ', error);
				}, 

				maybeStart : function() {
				//	alert(cthis.isStarted);
					if (!cthis.isStarted && cthis.localStream && cthis.isChannelReady) {
						 //how many sockets have been created
//						 cthis.cn = cthis.pc.length;  
//						 if(cthis.cn > 0){
//							 cthis.cn = cthis.cn - 1;
//						 }
						
						if(cthis.pc.length > 0){
							 cthis.cn++;
						}
						
						//if broad cast on browser A OR
						if(typeof cthis.myBrowser != 'undefined'){
							if(cthis.id == cthis.myBrowser){
								cthis.createPeerConnection();
								cthis.pc[cthis.cn].addStream(cthis.localStream);
								cthis.isStarted = true;
							    if (cthis.isInitiator) {
							    	cthis.doCall();
							    }
							}
						}else{
							cthis.createPeerConnection();
							cthis.pc[cthis.cn].addStream(cthis.localStream);
							cthis.isStarted = true;
						    if (cthis.isInitiator) {
						    	cthis.doCall();
						    }
						}
						
						
					}
				},

				createPeerConnection : function () {
				  try {
					  
					  //last key/index of array
					 var tpc = new RTCPeerConnection(this.pc_config, this.pc_constraints)
					 cthis.pc.push(tpc);
					 cthis.pc[cthis.cn].onicecandidate = cthis.handleIceCandidate;
					 console.log('Created RTCPeerConnnection with:\n' +
				      '  config: \'' + JSON.stringify(this.pc_config) + '\';\n' +
				      '  constraints: \'' + JSON.stringify(this.pc_constraints) + '\'.');
				  } catch (e) {
				    console.log('Failed to create PeerConnection, exception: ' + e.message);
				    alert('Cannot create RTCPeerConnection object.');
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
					//alert('sumanbrother');
					//debugger;
					//for remote 1
					if(cthis.cn == 0){
						attachMediaStream(vcan.videoChat.remoteVideo, event.stream);
						cthis.remoteStream = event.stream;
					//}else if(cthis.cn > 1 ){
					}else if(cthis.pc.length > 1 ){
						///alert("Hi brother");
						// for remote 2	
						attachMediaStream(vcan.videoChat.remoteVideo2, event.stream);
						cthis.remoteStream = event.stream;
					}
					
				//  waitForRemoteVideo();
				}, 

				doCall : function() {
				  var constraints = {'optional': [], 'mandatory': {'MozDontOfferDataChannel': true}};
				  // temporary measure to remove Moz* constraints in Chrome
				  if (webrtcDetectedBrowser === 'chrome') {
				    for (var prop in constraints.mandatory) {
				      if (prop.indexOf('Moz') !== -1) {
				        delete constraints.mandatory[prop];
				      }
				     }
				   }
				  constraints = this.mergeConstraints(constraints, this.sdpConstraints);
				  console.log('Sending offer to peer, with constraints: \n' +
				    '  \'' + JSON.stringify(constraints) + '\'.');
				  cthis.pc[cthis.cn].createOffer(this.setLocalAndSendMessage, null, constraints);
				}, 

				doAnswer:  function () {
				  console.log('Sending answer to peer.');
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
				  cthis.sendMessage(sessionDescription);
				},

				handleRemoteStreamRemoved:function(event) {
					console.log('Remote stream removed. Event: ', event);
				},

				hangup : function() {
				  console.log('Hanging up.');
				  this.stop();
				  this.sendMessage('bye');
				}, 

				handleRemoteHangup : function() {
				  console.log('Session terminated.');
				  cthis.stop();
				  cthis.isInitiator = false;
				},

				stop : function() {
				  this.isStarted = false;
				  // isAudioMuted = false;
				  // isVideoMuted = false;
				  this.pc.close();
				  this.pc = null;
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
				  if (message === 'got user media') {
					   cthis.maybeStart();
				  }else if (message.type === 'offer'){
				    if (!cthis.isInitiator && !cthis.isStarted) {
				    	cthis.maybeStart();
				    }
				    cthis.pc[cthis.cn].setRemoteDescription(new RTCSessionDescription(message));
				    cthis.doAnswer();
				  } else if (message.type === 'answer' && cthis.isStarted) {
					  cthis.pc[cthis.cn].setRemoteDescription(new RTCSessionDescription(message));
				  } else if (message.type === 'candidate' && cthis.isStarted) {
				    var candidate = new RTCIceCandidate({sdpMLineIndex:message.label,
				      candidate:message.candidate});
				    cthis.pc[cthis.cn].addIceCandidate(candidate);
				  } else if (message === 'bye' && cthis.isStarted) {
				    cthis.handleRemoteHangup();
				  }
		    }
		    
		}
		
	
		}
	}		
)(window);