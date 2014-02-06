(
	function (window){
		//window.whBoard.lang.getString
		whBoard = window.whBoard;
		whBoard.view.msgBoxClass = 'msgBox';
		whBoard.view.window = {};
		whBoard.view.virtualWindow = {};

		/*
		window.addEventListener('click', function (){
    		whBoard.view.disappearBox('WebRtc')
    		whBoard.view.disappearBox('Canvas');
    		whBoard.view.disappearBox('drawArea');
    	}); */ 
		
		whBoard.view.displayMessage = function (msg, id, className, intoAppend, imageTag){
			//TODO this message have to be displayed
			//var msg = whBoard.lang.getString(msg);
			
//			var tag = whBoard.view.customCreateElement('div', id, className);
//			tag.innerHTML = msg;
//			
			if(typeof imageTag == 'undefined'){
				var msgBox = whBoard.view.createMsgBox(msg, id, className);
			}else{
				var msgBox = whBoard.view.createMsgBox(msg, id, className, imageTag);
			}
			
			var parTag = document.getElementById('vcanvas');	
			if(typeof intoAppend != 'undefined'){
				document.getElementById(intoAppend).appendChild(msgBox);
			}else{
				parTag.insertBefore(msgBox, parTag.childNodes[0]);
			}
			
			
//			if(typeof intoAppend != 'undefined'){
//				parTag = document.getElementById(intoAppend);
//				parTag.insertBefore(msgBox, parTag.childNodes[0]);
//			}else{
//				parTag.insertBefore(msgBox, parTag.childNodes[0]);
//			}
			
			
		}
		
		whBoard.view.customCreateElement = function (tagName, id, className){
			var tag = document.createElement(tagName);
			if(typeof id != 'undefined'){
				tag.id = id;
			}
			
			if(typeof className != 'undefined'){
				tag.className = className;
			}
			
			return tag;
		}
		
		whBoard.view.createMsgBox = function (msg, id, className, imageTag){
			var divTag = whBoard.view.customCreateElement('div', id, className);
			if(typeof imageTag == 'undefined'){
				var imageHolder = whBoard.view.customCreateElement('div', id+'img', className+'img');
				divTag.appendChild(imageHolder);
			}
			
				
			var pTag = whBoard.view.customCreateElement('p', id+'Para');
			pTag.innerHTML = msg;
			divTag.appendChild(pTag);
			return divTag;	
		}
		
		whBoard.view.disappearBox = function (className){
			var allDivs = document.getElementsByClassName(whBoard.view.msgBoxClass+className);
				if(allDivs[0] != null){
					allDivs[0].parentNode.removeChild(allDivs[0]);
				}
				
		}
		
		whBoard.view.multiMediaMsg = function (className){
			   if(whBoard.system.mybrowser.name == 'Firefox'){
		   			var msg =  whBoard.lang.getString('wbrtcMsgFireFox');
		   			whBoard.view.displayMessage(msg, "fireFoxWebrtcCont", whBoard.view.msgBoxClass + className);
				 	
			   }else if(whBoard.system.mybrowser.name == 'Chrome'){
				   var msg =  whBoard.lang.getString('wbrtcMsgChrome');
				   whBoard.view.displayMessage(msg, "chormeWebrtcCont", whBoard.view.msgBoxClass + className);
			   }
		}
		
		 whBoard.view.canvasDrawMsg = function (className){
			 var mainContainer = document.getElementById('vcanvas');
			 	mainContainer.className = 'canvasMsgBoxParent';
			   if(whBoard.system.mybrowser.name == 'Firefox'){
		   			var msg =  whBoard.lang.getString('canvasDrawMsg');
		   			whBoard.view.displayMessage(msg, "canvasDrawMsgContFirefox",  whBoard.view.msgBoxClass +className,  'containerWb');
				 	
			   }else if(whBoard.system.mybrowser.name == 'Chrome'){
				   var msg =  whBoard.lang.getString('canvasDrawMsg');
				   whBoard.view.displayMessage(msg, "canvasDrawMsgContChrome", whBoard.view.msgBoxClass + className, 'containerWb');
			   }
		  }
		 
		 window.whBoard.view.drawLabel = function (className){
			 var msg =  whBoard.lang.getString('drawArea');
			 whBoard.view.displayMessage(msg, "canvasDrawArea",  whBoard.view.msgBoxClass+className, 'containerWb', false);
		 }
		 
		 
		 
		 count = 0;
		  //triggered when resize window is finished
		  whBoard.view.window.resizeFinished = (function(){
				var timer = 0;
				return function(callback, ms){
					clearTimeout (timer);
					timer = setTimeout(callback, ms);
				};
		 	})();
		 whBoard.view.window.resize = function (){
			  var res = whBoard.system.measureResoultion({'width' : window.innerWidth, 'height' : window.innerHeight });
			  var vcanvas = document.getElementById('vcanvas');
			  vcanvas.style.width = res.width + 'px';
			  
			  vcan.renderAll();
			   
			  if (typeof  lastresizetime == 'undefined') {
				  lastresizetime = new Date().getTime();
				  //this.sock.send(jobj);
				  console.log('this is performing');
				  vm_chat.send({'virtualWindow' : { 'resizeWindow' : res}});
				}
				
				presentresizetime = new Date().getTime();
				if ((presentresizetime-lastresizetime)>=500) { // Optimized
					vm_chat.send({'virtualWindow' : { 'resizeWindow' : res}});						
					lastresizetime = new Date().getTime();
					console.log('send request ' + count);
				}
				
				whBoard.view.window.resizeFinished(function(){
					//alert('suman bogati');
					vm_chat.send({'virtualWindow' : { 'resizeWindow' : res}});	
			    }, 500);
				
//			   var res = whBoard.system.measureResoultion({'width' : window.outerWidth, 'height' : window.innerHeight });
//			   var vcanvas = document.getElementById('vcanvas');
//			   vcanvas.style.width = res.width + 'px';
			   //vm_chat.send({'virtualWindow' : { 'resizeWindow' : res}});
		 }
		 
//		 whBoard.view.window.resize_old = function (){
//			this.incrFirstRes = this.incrSecRes = this.incrThirdRes = this.incrFourthRes = this.decrFirstRes = this.decrSecRes  = this.decrThirdRes = this.decrFourthRes = false ;
//			
//			
//			
//		//	this.incrSecRes = false;
//		//	this.incrThirdRes = false;
//		//	this.incrFourthRes = false;
//		//	this.decrFirstRes = false;
//		//	this.decrSecRes = false;
//		//	this.decrThirdRes = false;
//		//	this.decrFourthRes = false;
//			
//			var outerWidth = window.outerWidth;
//			
//			if(outerWidth < 1024){ this.incrFirstRes = false;}
//			if(outerWidth < 1280){ this.incrSecRes = false;}
//			if(outerWidth < 1366){ this.incrThirdRes = false;} 
//			if(outerWidth < 1920){ this.incrFourthRes = false;} 
//			
//			if(outerWidth >= 1024 && outerWidth < 1280){
//					if(!this.incrFirstRes){
//						var res = whBoard.system.getResoultion(window.outerWidth);
//						//vm_chat.send({'resizeWindow' : res});
//						vm_chat.send({'virtualWindow' : { 'resizeWindow' : res}});
//						
//					this.incrFirstRes = true;
//				}
//			}else if(outerWidth >= 1280 && outerWidth < 1366){
//				if(!this.incrSecRes){
//					var res  = whBoard.system.getResoultion(window.outerWidth);
//					
//					//vm_chat.send({'resizeWindow' : res});
//					vm_chat.send({'virtualWindow' : { 'resizeWindow' : res}});
//					
//					this.incrSecRes = true;
//					this.decrSecRes = true;
//				}
//			}else if(outerWidth >= 1366 && outerWidth < 1920){
//				if(!this.incrThirdRes){
//					var res  = whBoard.system.getResoultion(window.outerWidth);
//					
//					//vm_chat.send({'resizeWindow' : res});
//					
//					vm_chat.send({'virtualWindow' : { 'resizeWindow' : res}});
//					this.incrThirdRes = true;
//					this.decrThirdRes  = true;
//				}
//			}else if(outerWidth >= 1920){
//				if(!this.incrFourthRes){
//					var res  = whBoard.system.getResoultion(window.outerWidth);
//					
//					vm_chat.send({'virtualWindow' : { 'resizeWindow' : res}});
//					//vm_chat.send({'resizeWindow' : res});
//					
//					this.incrFourthRes = true;
//					this.decrFourthRes = true;
//				}
//			}
//			
//			if(outerWidth < 1280 ){
//				if(this.decrSecRes){
//					var res  = whBoard.system.getResoultion(window.outerWidth);
//					//vm_chat.send({'resizeWindow' : res});
//					vm_chat.send({'virtualWindow' : { 'resizeWindow' : res}});
//					this.decrFirstRes = true;
//					this.decrSecRes = false;
//				}
//			}else if(outerWidth >= 1280 && outerWidth < 1366){
//				if(this.decrThirdRes){
//					var res  = whBoard.system.getResoultion(window.outerWidth);
//					//vm_chat.send({'resizeWindow' : res});
//					vm_chat.send({'virtualWindow' : { 'resizeWindow' : res}});
//					this.decrThirdRes = false;
//				}
//				
//			}else if(outerWidth >= 1366 && outerWidth < 1920){
//				if(this.decrFourthRes){
//					var res  = whBoard.system.getResoultion(window.outerWidth);
//					//vm_chat.send({'resizeWindow' : res});
//					vm_chat.send({'virtualWindow' : { 'resizeWindow' : res}});
//					this.decrFourthRes = false;
//				}
//			}
//			//	console.log(' number of time count ' + count);
//		 }
		 
		 
		 whBoard.view.virtualWindow.manupulation = function (e){
			 	var message = e.message.virtualWindow;
				
				if(message.hasOwnProperty('removeVirtualWindow')){
	  				if(e.fromUser.userid != id){
	  					whBoard.utility.removeVirtualWindow('virtualWindow');
	  				}
	  				return;
	  			}else if(message.hasOwnProperty('resizeWindow')){
					//myResolution =  whBoard.system.getResoultion(window.outerWidth);
	  				myResolution = whBoard.system.measureResoultion({'width' : window.outerWidth, 'height' : window.innerHeight });
	  				//alert(myResolution.width);
//	  				console.log('my width ' + myResolution.width);
	  				if(e.fromUser.userid != id){
	  					var otherResolution = message.resizeWindow;
	  					otherBrowser = otherResolution;
	  					
	  					if(otherResolution.width < myResolution.width){
							whBoard.utility.createVirtualWindow(otherResolution);
						}else if(otherResolution.width == myResolution.width){
							whBoard.utility.removeVirtualWindow('virtualWindow');
						}
	  				}else{
	  					if(myResolution.width < otherBrowser.width){
	  						
	  						//vm_chat.send({'resizeWindow' : myResolution});
	  						//CRITICAL this function does call undefinite
	  						//vm_chat.send({'virtualWindow' : { 'resizeWindow' : myResolution}});

	  						
	  						whBoard.utility.removeVirtualWindow('virtualWindow'); 
	  					}else if(myResolution.width > otherBrowser.width){
	  						whBoard.utility.createVirtualWindow(otherBrowser);
	  						
	  						vm_chat.send({'virtualWindow' : { 'removeVirtualWindow' : true}});

	  						//vm_chat.send({'removeVirtualWindow' : true});
	  						
	  					}else if(myResolution.width == otherBrowser.width){
	  						whBoard.utility.removeVirtualWindow('virtualWindow');
	  					}
	  				}
	  				 return;
	  			}else if(message.hasOwnProperty('createVirtualWindow')){
	  				if(message.hasOwnProperty('toolHeight')){
	  					//alert('sss');
	  					//alert(message.createVirtualWindow.toolHeight);
	  					//whBoard.toolWrapperHeight =  message.toolHeight;
	  					localStorage.setItem('toolHeight', message.toolHeight) ;
	  				}
	  				
	  				if(e.fromUser.userid != id){
	  					whBoard.utility.createVirtualWindow(message.createVirtualWindow);
	  					return;
	  				}
	  			}else if(message.hasOwnProperty('shareBrowserWidth')){
	  				if(localStorage.getItem('teacherId') != null){
	  					var toolBoxHeight = whBoard.utility.getWideValueAppliedByCss('commandToolsWrapper');
	  					
		  				

	  				}
					
					if(e.fromUser.userid != id){
						if(localStorage.getItem('teacherId') != null){
							whBoard.utility.makeCanvasEnable();
						}
						
	  					 otherBrowser = message.browserRes;
	  					 
	  				}else{
	  					 //myBrowser = whBoard.system.getResoultion(window.outerWidth);
	  	  			   myBrowser = whBoard.system.measureResoultion({'width' : window.outerWidth, 'height' : window.innerHeight });

	  				}
	  				
	  				if(typeof myBrowser == 'object' && typeof otherBrowser == 'object'){
	  					if(myBrowser.width > otherBrowser.width){
	  	  						if(virtualWindow == false){
	  	  							whBoard.utility.createVirtualWindow(otherBrowser);
	  	  							virtualWindow = true; 	
								}
	  	  				}else if(myBrowser.width < otherBrowser.width){
	  	  					    if(virtualWindow == false){
	  	  					    	virtualWindow = true;
	  	  					    	if(localStorage.getItem('teacherId') != null){
	  	  					    		//alert(toolBoxHeight);
	  	  					    		//alert('suamn bogati');
	  	  					    		vm_chat.send({'virtualWindow' : {'createVirtualWindow' : myBrowser, 'toolHeight' : toolBoxHeight}});
	  	  					    	}else{
	  	  					    		vm_chat.send({'virtualWindow' : {'createVirtualWindow' : myBrowser}});
	  	  					    	}
	  	  					    	
								}
	  	  				}
	  				}
	  			}
				return;
			}
		 
		 
	}	
)(window);
