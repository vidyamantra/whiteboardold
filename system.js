(
	function (window){
		
		var browser = window.mybrowser.detection();
		var browserName = browser[0];
		var browserVersion = browser[1];
		whBoard.system.wbRtc = {};
		
		whBoard.system.isCanvasSupport = function (navigator, browserName, version){
			//alert('khandan');
			//http://stackoverflow.com/questions/2745432/best-way-to-detect-that-html5-canvas-is-not-supported
		//	var canvasSupported = !!window.HTMLCanvasElement || !!window.CanvasRenderingContext2D; //suggested by ie9 team,
			if(browserName == 'MSIE'){
				if(version != 9){
					//TODO there should be some good method to check exisitence of canvas element in IE browsers
					whBoard.view.displayMessage(whBoard.lang.getString('notSupportCanvas'), browserName, version);
				}
			}else{
				var canvasSupported = !!window.CanvasRenderingContext2D;
				if(!canvasSupported){
					whBoard.view.displayMessage(whBoard.lang.getString('notSupportCanvas'), browserName, version);
				}
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
			}else if(browser == 'Chrome' || browser == 'Safari'){
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
			}else if(browser == 'MSIE' && version <= 9){
				whBoard.view.displayMessage(whBoard.lang.getString('notSupportWebRtc'), browser, version);
			}
	   }
	   
	   whBoard.system.isWebSocketSupport = function (navigator, browser, version){
		   whBoard.system.webSocket  = {};
		   
//		   if(typeof window.WebSocket == 'undefined' || typeof window.WebSocket != 'function' || !window.WebSocket.hasOwnProperty('OPEN')){
//			   whBoard.view.displayMessage(whBoard.lang.getString('notSupportWebSocket'), browser, version);
//		   }else{
//			   whBoard.system.webSocket = true;
//		   }
		   
		   if(typeof window.WebSocket != 'undefined' && (typeof window.WebSocket == 'function' || typeof window.WebSocket == 'object')  && window.WebSocket.hasOwnProperty('OPEN')){
			   whBoard.system.webSocket = true;
		   }else{
			   whBoard.view.displayMessage(whBoard.lang.getString('notSupportWebSocket'), browser, version);
		   }
	   }
		
	 whBoard.system.isCanvasSupport(navigator, browserName, browserVersion); 
	 whBoard.system.isWebRtcSupport(navigator, browserName, browserVersion);
	 whBoard.system.isWebSocketSupport(navigator, browserName, browserVersion);
		
	}	
)(window);