(function (window){
	window.onload = function (){
		var whBoard  = window.whBoard;
		whBoard.keyBoard = {
			 prvTool : "",
			 skey : false,
		 	/**
			 * this function triggers the activeAll function 
			 */
			 triggerActiveAll : function (e){
				if(e.shiftKey){
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
		
		whBoard.canvas.bind('keydown', whBoard.keyBoard.triggerActiveAll);
		whBoard.canvas.bind('keyup', whBoard.keyBoard.triggerdeActiveAll);
		
	}
})(window);