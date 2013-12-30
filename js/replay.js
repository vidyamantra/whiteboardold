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
					this.callBkfunc = "";
				},
				
				renderObj : function (myfunc){
					wbRep = whBoard.replay;
					if(typeof wbRep.objs[wbRep.objNo] == 'undefined'){
						console.log("is this happend");	
						return;
					}
					
					
					/*
					if(wbRep.objs.length > 0 && wbRep.objNo > 0){
							if(wbRep.objs[wbRep.objNo-1].uid == wbRep.objs[wbRep.objNo].uid){
								//alert("hello guys what is up");
								//debugger;
							}
						}
					*/
					if(typeof myfunc != 'undefined'){
						wbRep.callBkfunc = myfunc;
					}
					
					if(wbRep.objs[wbRep.objNo].hasOwnProperty('cmd')){
						console.log('cmd ' + wbRep.objs[wbRep.objNo].cmd)
						if(wbRep.objs[wbRep.objNo].cmd == 't_freeDrawing'){
							//alert("hello boys");
//							debugger;
						}
						//whBoard.toolInit(wbRep.objs[wbRep.objNo].cmd, 'fromFile', true);
						vcan.renderedObjId = wbRep.objs[wbRep.objNo].uid;
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
					    vcan.renderedObjId = wbRep.objs[wbRep.objNo].uid;
					   // console.log('rendered id ' + vcan.renderedObjId);
                        var eventConstruct = new CustomEvent(event, eventObj); //this is not supported for ie9 and older ie browsers
                        vcan.main.canvas.dispatchEvent(eventConstruct);
                        
                		//vcan.renderedObjId = wbRep.objs[wbRep.objNo].uid;
						//console.log('renderObj ' + vcan.renderedObjId);
					}
					
					console.log('rendered id ' + vcan.renderedObjId);
					
					if(typeof wbRep.callBkfunc == 'function'){
						if(wbRep.objs[wbRep.objs.length-1].uid == vcan.renderedObjId){
							
							//alert(wbRep.callBkfunc.hasOwnProeprty('myname')); 
							wbRep.callBkfunc('callBkfunc');
							
							//myfunc(true);
						}
					}
					
					if(typeof wbRep.objs[wbRep.objNo+1] == 'object'){
//						vcan.renderedObj = wbRep.objs[wbRep.objNo].uid;
//						console.log('renderObj ' + vcan.renderedObj);
						
						whBoard.replayTime = wbRep.objs[wbRep.objNo+1].mt - wbRep.objs[wbRep.objNo].mt;
//						if(typeof myfunc != 'undefined'){
//							if(wbRep.objs[wbRep.objs.length-1].uid == vcan.renderedObjId){
//								myfunc(true);
//							}
//						}
						
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
