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
					//whBoard.view.displayMessage(whBoard.lang.getString('notSupportCanvas'), browserName, version);
					whBoard.error.push({'msg' : whBoard.lang.getString('notSupportCanvas'), 'id':'errorCanvas', 'className' : 'error'});	
				}
			}else{
				var canvasSupported = !!window.CanvasRenderingContext2D;
				if(!canvasSupported){
					//whBoard.view.displayMessage(whBoard.lang.getString('notSupportCanvas'), browserName, version);
					 whBoard.error.push({'msg' : whBoard.lang.getString('notSupportCanvas'), 'id':'errorCanvas', 'className' : 'error'});

				}
			}
			
		}
		
	    whBoard.system.isWebRtcSupport = function (navigator, browser, version){
			if(browser == 'Firefox'){
				if(navigator.mozGetUserMedia){
					whBoard.system.wbRtc.userMedia  = true;
					if(!window.mozRTCPeerConnection){
						
						//whBoard.error.push({'msg' : whBoard.lang.getString('notSupportPeerConnect'), 'id':'errorWebRtc', 'className' : 'error'});
						 whBoard.error.push({'msg' : whBoard.lang.getString('notSupportPeerConnect'), 'id':'errorPeerConnect', 'className' : 'error'});

						console.log('suman bogati hero');
					}else{
						whBoard.system.wbRtc.peerCon = true;
					}
				}else{
					//whBoard.view.displayMessage(whBoard.lang.getString('notSupportGetUserMedia'), browser, version);
					//whBoard.view.displayMessage(whBoard.lang.getString('notSupportGetUserMedia'), 'errorWebRtc', 'error');
					 whBoard.error.push({'msg' : whBoard.lang.getString('notSupportGetUserMedia'), 'id':'errorGetUserMedia', 'className' : 'error'});

				}
			}else if(browser == 'Chrome' || browser == 'Safari'){
				if(navigator.webkitGetUserMedia){
					whBoard.system.wbRtc.userMedia  = true;
					if(!window.webkitRTCPeerConnection){
						//whBoard.view.displayMessage(whBoard.lang.getString('notSupportPeerConnect'), browser, version);
						//whBoard.view.displayMessage(whBoard.lang.getString('notSupportPeerConnect'), 'errorWebRtc', 'error');
						 whBoard.error.push({'msg' : whBoard.lang.getString('notSupportPeerConnect'), 'id':'errorPeerConnect', 'className' : 'error'});
					}else{
						whBoard.system.wbRtc.peerCon = true;
					}
				}else{
					//whBoard.view.displayMessage(whBoard.lang.getString('notSupportGetUserMedia'), browser, version);
					//whBoard.view.displayMessage(whBoard.lang.getString('notSupportGetUserMedia'), 'errorWebRtc', 'error');
					 whBoard.error.push({'msg' : whBoard.lang.getString('notSupportGetUserMedia'), 'id':'errorGetUserMedia', 'className' : 'error'});

				}
			}else if(browser == 'MSIE' && version <= 9){
				//alert('suman bogati');
				//alert(whBoard.error.length);
				//whBoard.view.displayMessage(whBoard.lang.getString('notSupportWebRtc'), browser, version);
				whBoard.error.push({'msg' : whBoard.lang.getString('notSupportWebRtc'), 'id':'errorWebRtc', 'className' : 'error'});
			}
	   }
	   
	   whBoard.system.isWebSocketSupport = function (navigator, browser, version){
		   whBoard.system.webSocket  = {};
		   if(typeof window.WebSocket != 'undefined' && (typeof window.WebSocket == 'function' || typeof window.WebSocket == 'object')  && window.WebSocket.hasOwnProperty('OPEN')){
			   whBoard.system.webSocket = true;
		   }else{
				//whBoard.view.displayMessage(whBoard.lang.getString('notSupportWebSocket'), browser, version);
			   whBoard.error.push({'msg' : whBoard.lang.getString('notSupportWebSocket'), 'id':'errorWebSocket', 'className' : 'error'});
		   }
	   }
	   
	   whBoard.system.measureResoultion = function (resolution){
		    var canvas  = {};
		    if(resolution.width == 1024){
				canvas.width = 800;
				canvas.height = 480;
			}else if(resolution.width == 1280){
				canvas.width = 1025;
				canvas.height = 715;
			}else if(resolution.width == 1366){
				canvas.width = 1125;
				canvas.height = 475;
			}else if(resolution.width == 1920){
				canvas.width = 1670;
				canvas.height = 780;
			}
		    return canvas;
		   
	   }
	   
	   whBoard.system.setCanvasDimension = function (){
		   var canvas = vcan.main.canvas;
		   var resolution = whBoard.system.getResoultion();
		   var measureRes = whBoard.system.measureResoultion(resolution);
		   	   canvas.width = measureRes.width;
			   canvas.height = measureRes.height;
			   
//			if(resolution.width == 1024){
//				canvas.width = 800;
//				canvas.height = 480;
//			}else if(resolution.width == 1280){
//				canvas.width = 1025;
//				canvas.height = 715;
//			}else if(resolution.width == 1366){
//				canvas.width = 1125;
//				canvas.height = 475;
//			}else if(resolution.width == 1920){
//				canvas.width = 1670;
//				canvas.height = 780;
//			}
			   
	   }
	   
	   whBoard.system.getResoultion =  function (){
			var resolution = {};
			if(window.outerWidth < 1280){
				resolution.width = 1024;
				resolution.height = 768; 
			}else if(window.outerWidth >= 1280 && window.outerWidth < 1366){
				resolution.width = 1280;
				resolution.height = 1024;
			}else if(window.outerWidth >= 1366 && window.outerWidth < 1920){
				resolution.width = 1366;
				resolution.height = 768;
			}else if(window.outerWidth >= 1920){
				resolution.width = 1920;
				resolution.height = 1080;
			}
			
			return resolution;
	  }
	   
	 window.addEventListener('resize', whBoard.system.setCanvasDimension);
	   
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