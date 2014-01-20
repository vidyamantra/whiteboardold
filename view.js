(
	function (window){
		//window.whBoard.lang.getString
		whBoard = window.whBoard;
		whBoard.view.msgBoxClass = 'msgBox';
		
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
		   
		
	}	
)(window);
