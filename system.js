(
	function (window){
		//var browser = window.mybrowser.detection();
		//var browserName = browser[0];
		//var browserVersion = browser[1];
		whBoard.system.wbRtc = {};
		whBoard.system.wbRtc.className = 'webrtcCont';
		whBoard.system.mybrowser = {};
		//window.mybrowser = {};	
		//alert(browserName);
		whBoard.system.mybrowser.detection = function(){
		    var ua= navigator.userAgent, tem, 
		    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*([\d\.]+)/i) || [];
		    if(/trident/i.test(M[1])){
		        tem=  /\brv[ :]+(\d+(\.\d+)?)/g.exec(ua) || [];
		        return 'IE '+(tem[1] || '');
		    }
		    M= M[2]? [M[1], M[2]]:[navigator.appName, navigator.appVersion, '-?'];
		    if((tem= ua.match(/version\/([\.\d]+)/i))!= null) M[2]= tem[1];
		   // return M.join(' ');
		    return M;
		}
		
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
						//alert('raju');
						//debugger;
						//alert('this should be true');
						//whBoard.view.displayMessage(whBoard.lang.getString('notSupportPeerConnect'), browser, version);
						//alert(whBoard.error.length);
						//debugger;
						//whBoard.error.push({'msg' : whBoard.lang.getString('notSupportPeerConnect'), 'id':'errorWebRtc', 'className' : 'error'});
						
						//whBoard.view.displayMessage(whBoard.lang.getString('notSupportPeerConnect'), 'errorWebRtc', 'error');
						
						whBoard.error.push({'msg' : whBoard.lang.getString('notSupportPeerConnect'), 'id':'errorWebRtc', 'className' : 'error'});
						console.log('suman bogati hero');
					}else{
						whBoard.system.wbRtc.peerCon = true;
					}
				}else{
					//whBoard.view.displayMessage(whBoard.lang.getString('notSupportGetUserMedia'), browser, version);
					whBoard.view.displayMessage(whBoard.lang.getString('notSupportGetUserMedia'), 'errorWebRtc', 'error');
				}
			}else if(browser == 'Chrome' || browser == 'Safari'){
				if(navigator.webkitGetUserMedia){
					whBoard.system.wbRtc.userMedia  = true;
					if(!window.webkitRTCPeerConnection){
						//whBoard.view.displayMessage(whBoard.lang.getString('notSupportPeerConnect'), browser, version);
						whBoard.view.displayMessage(whBoard.lang.getString('notSupportPeerConnect'), 'errorWebRtc', 'error');
					}else{
						whBoard.system.wbRtc.peerCon = true;
					}
				}else{
					//whBoard.view.displayMessage(whBoard.lang.getString('notSupportGetUserMedia'), browser, version);
					whBoard.view.displayMessage(whBoard.lang.getString('notSupportGetUserMedia'), 'errorWebRtc', 'error');
				}
			}else if(browser == 'MSIE' && version <= 9){
				//whBoard.view.displayMessage(whBoard.lang.getString('notSupportWebRtc'), browser, version);
				//whBoard.view.displayMessage(whBoard.lang.getString('notSupportWebRtc'), 'errorWebRtc', 'error');
				//alert('raj');
				whBoard.error.push({'msg' : whBoard.lang.getString('notSupportWebRtc'), 'id':'errorWebRtc', 'className' : 'error'});
			}
	   }
	   
	   whBoard.system.isWebSocketSupport = function (navigator, browser, version){
		   whBoard.system.webSocket  = {};
		   if(typeof window.WebSocket != 'undefined' && (typeof window.WebSocket == 'function' || typeof window.WebSocket == 'object')  && window.WebSocket.hasOwnProperty('OPEN')){
			   whBoard.system.webSocket = true;
		   }else{
				

			   whBoard.view.displayMessage(whBoard.lang.getString('notSupportWebSocket'), browser, version);
		   }
	   }
	   
//	   whBoard.system.multiMediaMsg = function (){
//		   if(whBoard.system.mybrowser.name == 'Firefox'){
//	   			var msg =  whBoard.lang.getString('wbrtcMsgFireFox');
//	   			whBoard.view.displayMessage(msg, "fireFoxWebrtcCont", whBoard.system.wbRtc.className);
//			 	
//		   }else if(whBoard.system.mybrowser.name == 'Chrome'){
//			   var msg =  whBoard.lang.getString('wbrtcMsgChrome');
//			   whBoard.view.displayMessage(msg, "chormeWebrtcCont", whBoard.system.wbRtc.className);
//		   }
//	   }
	   
//	   whBoard.system.canvasDrawMsg = function (){
//		   if(whBoard.system.mybrowser.name == 'Firefox'){
//	   			var msg =  whBoard.lang.getString('canvasDrawMsg');
//	   			whBoard.view.displayMessage(msg, "canvasDrawMsgContFirefox");
//			 	
//		   }else if(whBoard.system.mybrowser.name == 'Chrome'){
//			   var msg =  whBoard.lang.getString('canvasDrawMsg');
//			   whBoard.view.displayMessage(msg, "canvasDrawMsgContChrome");
//		   }
//	   }
//	   
	   
	 var browser = whBoard.system.mybrowser.detection();
	 var browserName = browser[0];
	 var browserVersion = browser[1];
	 whBoard.system.mybrowser.name = browserName;
	 whBoard.system.mybrowser.version = browserVersion;
	 
	 whBoard.system.isCanvasSupport(navigator, browserName, browserVersion); 
	 whBoard.system.isWebRtcSupport(navigator, browserName, browserVersion);
	 whBoard.system.isWebSocketSupport(navigator, browserName, browserVersion);
		
	}	
)(window);