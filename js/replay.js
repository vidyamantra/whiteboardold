(
	function (window){
		var whBoard = window.whBoard;
		whBoard._replay = function (){
			return {
				init : function (repMode){
					var vcan = whBoard.vcan;
					this.objs = vcan.getStates('replayObjs');
					this.objNo  = 0;
					this.repMode = repMode;
				},
				
				renderObj : function (){
					wbRep = whBoard.replay;
					if(wbRep.objs[wbRep.objNo].hasOwnProperty('cmd')){
						
						//whBoard.toolInit(wbRep.objs[wbRep.objNo].cmd, 'fromFile', true);
						whBoard.toolInit(wbRep.objs[wbRep.objNo].cmd, 'fromFile', true);
					}else{
						var event = "";
						if(wbRep.objs[wbRep.objNo].ac == 'd'){
							event = 'mousedown';
						}else if((wbRep.objs[wbRep.objNo].ac == 'm')){
							event = 'mousemove';
						}else if(wbRep.objs[wbRep.objNo].ac == 'u'){
							event = 'mouseup';
						}
						
						var currObj = wbRep.objs[wbRep.objNo];
					
						if(currObj.hasOwnProperty('mtext')){
							var eventObj = {detail : {cevent : {x:currObj.x, y:currObj.y, mtext:currObj.mtext}}};
						}else{
							var eventObj = {detail : {cevent : {x:currObj.x, y:currObj.y}}};
						}
						
                        
                        var eventConstruct = new CustomEvent(event, eventObj); //this is not supported for ie9 and older ie browsers
                        vcan.main.canvas.dispatchEvent(eventConstruct);

					}
					
					if(typeof wbRep.objs[wbRep.objNo+1] == 'object'){
						
						whBoard.replayTime = wbRep.objs[wbRep.objNo+1].mt - wbRep.objs[wbRep.objNo].mt;
						wbRep.objNo++;
						
						if(typeof wbRep.repMode != 'undefined' && wbRep.repMode == 'fromBrowser'){
							whBoard.replayTime = 0;
						}
						setTimeout(wbRep.renderObj, whBoard.replayTime);
					}
					
					//if(whBoard.replayTime >= 0){
						//setTimeout(wbRep.renderObj, whBoard.replayTime);
					//}
					return ;
					
				}
			}
		}
	}
)(window);