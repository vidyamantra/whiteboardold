(
	function (window){
		
		var browser = window.mybrowser.detection();
		var browserName = browser[0];
		var browserVersion = browser[1];
		whBoard.system.wbRtc = {};
		
		whBoard.system.isCanvasSupport = function (browserName, version){
			//http://stackoverflow.com/questions/2745432/best-way-to-detect-that-html5-canvas-is-not-supported
			var canvasSupported = !!window.HTMLCanvasElement; //suggested by ie9 team, 
			if(!canvasSupported){
				whBoard.view.displayMessage(whBoard.lang.getString('notSupportCanvas'), browserName, version);
			}else{
			//	alert('supported');
			}
		}
		
	   whBoard.system.isWebRtcSupport = function (navigator, browser, version){
			if(browser == 'Firefox'){
				if(navigator.mozGetUserMedia){
					whBoard.system.wbRtc.userMedia  = true;
					if(!window.mozRTCPeerConnection){
						whBoard.view.displayMessage(whBoard.lang.getString('notSupportPeerConnect'), browser, version);
					}else{
						whBoard.system.wbRtc.peerCon = true;
					}
				}else{
					whBoard.view.displayMessage(whBoard.lang.getString('notSupportGetUserMedia'), browser, version);
				}
			}else if(browser == 'Chrome'){
				if(navigator.webkitGetUserMedia){
					whBoard.system.wbRtc.userMedia  = true;
					if(!window.webkitRTCPeerConnection){
						whBoard.view.displayMessage(whBoard.lang.getString('notSupportPeerConnect'), browser, version);
					}else{
						whBoard.system.wbRtc.peerCon = true;
					}
				}else{
					whBoard.view.displayMessage(whBoard.lang.getString('notSupportGetUserMedia'), browser, version);
				}
			}
		}
	   
	   whBoard.system.isWebSocketSupport = function (navigator, browser, version){
		   if(window.WebSocket == 'undefined' || typeof window.WebSocket != 'function' || !window.WebSocket.hasOwnProperty('OPEN')){
			   whBoard.view.displayMessage(whBoard.lang.getString('notSupportWebSocket'), browser, version);
		   }else{
			   alert("your browser does support web socket");
		   }
		}
		
		whBoard.system.isWebRtcSupport(navigator, browserName, browserVersion);
		whBoard.system.isCanvasSupport(navigator, browserName, browserVersion);
		whBoard.system.isWebSocketSupport(navigator, browserName, browserVersion);
		
		
	}	
)(window);