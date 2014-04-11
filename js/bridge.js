(
	function (window){
		var whBoard = window.whBoard;
		
		whBoard.bridge.requestPackets  = function (msgRepObj){
			//more than one packets comes after connection on
			if(msgRepObj.length > 1){
				//the name myArr should be change into repObjArr
				whBoard.gObj.myArr = msgRepObj;
			}
			
  			whBoard.sentReq = true;
			var sp = whBoard.gObj.rcvdPackId;
			var ep = msgRepObj[0].uid;
			
			//vm_chat.send({'getMsPckt' : [sp, ep]}); //will have to request to teacher
			return [sp, ep];
  		}
		
		whBoard.bridge.makeQueue = function(e){
			if(whBoard.gObj.rcvdPackId != whBoard.gObj.displayedObjId){
					whBoard.gObj.packQueue = whBoard.gObj.packQueue.concat(e.message.repObj);
				
//				for(var i=0; i<e.message.repObj.length; i++){
//					whBoard.gObj.packQueue.push(e.message.repObj[i]);
//				}
			}
		}
  		
		whBoard.bridge.sendPackets = function(e, chunk){
			
			//chunk = [];
			if(e.message.getMsPckt[0] == 0){
				var i = -1;
			}else{
				var fs = e.message.getMsPckt[0].uid;
				//TODO myrepObj should be changed into another name 
				for(var i=0; i<whBoard.gObj.myrepObj.length; i++){
    				if(e.message.getMsPckt[0] == whBoard.gObj.myrepObj[i].uid){
    					fs =  e.message.getMsPckt[0];
    					break;
    				}
				}
			}
			
			for(var j=i+1; j<e.message.getMsPckt[1]; j++){
				chunk.push(whBoard.gObj.myrepObj[j]);
			}
			console.log('fid' + chunk[0].uid + ' eid' + chunk[chunk.length-1].uid);
			return chunk;
			
 //			 vm_chat.send({'repObj' : chunk, 'chunk' : true});
			//return;
  		},
  		
  		whBoard.bridge.handleMissedPackets = function (fromUserId, id, repObj){
  			
//  			if(whBoard.gObj.myArr.length > 0){
//				if(repObj[repObj.length-1].uid == whBoard.gObj.myArr[0].uid){
//					if(!whBoard.gObj.myArr[0].hasOwnProperty('cmd')){
//						whBoard.gObj.myArr.shift();
//					}
//				}
//				repObj = repObj.concat(whBoard.gObj.myArr);
//				whBoard.gObj.myArr = [];
//			}
  			
  			var repObj = whBoard.bridge.removeDupObjs(repObj);
  			
  			whBoard.gObj.replayObjs = whBoard.gObj.replayObjs.concat(repObj);
			
			
		
			//TODO this should be removed later and above code should be enabled
			// right now its doing sorting but above code should be enabled and object 
			// should be stotred in sorted format
			
			whBoard.bridge.sortingReplyObjs();
			
//			whBoard.gObj.replayObjs = whBoard.gObj.replayObjs.sort(function(a, b){
//			    return a.uid - b.uid;
//			});
			
			if(fromUserId != id){
				localStorage.repObjs = JSON.stringify(whBoard.gObj.replayObjs);
			}
			
//			if(fromUserId != id && (whBoard.gObj.displayedObjId + 1 != repObj[0].uid)){
//				if(whBoard.gObj.packQueue.length > 0){
//					if(repObj[repObj.length-1].uid == whBoard.gObj.packQueue[0].uid){
//						alert('suman bogati');
//						debugger;
//						var fArr = repObj;
//						whBoard.gObj.packQueue = fArr.concat(whBoard.gObj.packQueue);
//					}
//				}
//			}
			
			whBoard.bridge.containsIfQueuePacks(fromUserId, id, whBoard.gObj.displayedObjId, repObj);
	    }
  		
//  		whBoard.bridge.removeDuplicateObjs = function (){
//  			
//  		}
  		whBoard.bridge.removeDupObjs = function (repObj){
  			if(whBoard.gObj.myArr.length > 0){
				if(repObj[repObj.length-1].uid == whBoard.gObj.myArr[0].uid){
					if(!whBoard.gObj.myArr[0].hasOwnProperty('cmd')){
						whBoard.gObj.myArr.shift();
					}
				}
				repObj = repObj.concat(whBoard.gObj.myArr);
				whBoard.gObj.myArr = [];
			}
  			return repObj;
  		}
  		
  		whBoard.bridge.containsIfQueuePacks = function (fromUserId, id, dispId, repObj){
  			if(fromUserId != id && (dispId + 1 != repObj[0].uid)){
				if(whBoard.gObj.packQueue.length > 0){
					if(repObj[repObj.length-1].uid == whBoard.gObj.packQueue[0].uid){
						var fArr = repObj;
						whBoard.gObj.packQueue = fArr.concat(whBoard.gObj.packQueue);
					}
				}
			}
  		},
  		
  		whBoard.bridge.sortingReplyObjs = function (){
  			whBoard.gObj.replayObjs = whBoard.gObj.replayObjs.sort(function(a, b){
			    return a.uid - b.uid;
			});
  		}
  		
	}
)(window);