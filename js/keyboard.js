(function (window){
	window.onload = function (){
		//suman bogati	
		var whBoard  = window.whBoard;
		whBoard.keyBoard = {
			 prvTool : "",
			 skey : false,
		 	/**
			 * this function triggers the activeAll function 
			 */
			 triggerActiveAll : function (e){
				if(e.shiftKey){
					console.log('what happend mere bhai');
					whBoard.keyBoard.skey = true;
					whBoard.keyBoard.prvTool = whBoard.tool.cmd;
					whBoard.toolInit('t_activeall');
					var currTime = new Date().getTime(); 
					
					//var obj = {'cmd':'t_activeall', mdTime : currTime};
					var obj = {'cmd':'t_activeall', mt : currTime};
					vcan.main.replayObjs.push(obj);
					vm_chat.send({'repObj': [obj]}); //after optimized
					whBoard.vcan.main.action = 'move';
				}
			 },
			 
		 	/**
			 * this function triggers the deActiveAll function 
			 */
			triggerdeActiveAll : function(e){
				if(whBoard.keyBoard.skey){
					console.log('what happend mere bhai ddd');
					var currTime = new Date().getTime(); 
					whBoard.utility.deActiveFrmDragDrop();
					whBoard.toolInit(whBoard.keyBoard.prvTool);
					//var obj = {'cmd': whBoard.keyBoard.prvTool,  mdTime : currTime};
					var obj = {'cmd': whBoard.keyBoard.prvTool,  mt : currTime};
					vcan.main.replayObjs.push(obj);
					vm_chat.send({'repObj': [obj]}); //after optimized
				}
			}
		}
		//alert('');
//		whBoard.canvas.bind('keydown', whBoard.keyBoard.triggerActiveAll);
//		whBoard.canvas.bind('keyup', whBoard.keyBoard.triggerdeActiveAll);
		
		
		// this is used for demo only 
		// todo should be into seprate file
		var vm_chat = window.vm_chat;
//		document.getElementById('onConnection').onclick = connectionOpen;
//		document.getElementById('offConnection').onclick = connectionOff;
		
		function connectionOpen(){
			//alert('suman bogati');
			//debugger;
			vm_chat.wsconnect();
			
			//vm_chat.send({'repObj': true, 'conOn' : true});
		} 
		//whBoard.sentReq = false;
		function connectionOff(){
		//	alert("suman bogati");
		//	debugger;
		//	whBoard.sentReq = false;
			//vm_chat.send({'repObj': true, 'sentObj' : false});
			vm_chat.disconnect();
		}
		
	}
})(window);
