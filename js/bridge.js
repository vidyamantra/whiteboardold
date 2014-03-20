(
	function (window){
		var whBoard = window.whBoard;
		whBoard.bridge.requestPackets_Orginial  = function (e){
			//more than one packets comes after connection on
			if(e.message.repObj.length > 1){
					whBoard.gObj.myArr = e.message.repObj;
			}
  			whBoard.sentReq = true;
			var sp = vcan.reachedItemId;
			var ep = e.message.repObj[0].uid;
				console.log('sp ' + sp + ' ' + ' ep ' + ep);
				vm_chat.send({'getMsPckt' : [sp, ep]}); //will have to request to teacher
				return;
  		},
  		
  		whBoard.bridge.requestPackets  = function (msgRepObj){
			//more than one packets comes after connection on
			if(msgRepObj.length > 1){
					whBoard.gObj.myArr = msgRepObj;
			}
  			whBoard.sentReq = true;
			var sp = vcan.reachedItemId;
			var ep = msgRepObj[0].uid;
				console.log('sp ' + sp + ' ' + ' ep ' + ep);
				vm_chat.send({'getMsPckt' : [sp, ep]}); //will have to request to teacher
				return;
  		}
		
		
  		
		whBoard.bridge.makeQueue = function(e){
			if(vcan.reachedItemId != vcan.renderedObjId){
				for(var i=0; i<e.message.repObj.length; i++){
					vcan.tempArr.push(e.message.repObj[i]);
				}
			}
		}
  		
		whBoard.bridge.sendPackets = function(e){
//			alert('sss');
//			debugger;
//			whBoard.gObj.myrepObj = whBoard.vcan.getStates('replayObjs');
//			whBoard.gObj.chunk = [];
			chunk = [];
			
			if(e.message.getMsPckt[0] == 0){
				var i = -1;
			}else{
				var fs = e.message.getMsPckt[0].uid;
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
			vm_chat.send({'repObj' : chunk, 'chunk' : true});
			return;
  		},
  		
  		whBoard.bridge.handleMissedPackets = function (fromUserId, id, repObj){
  			if(whBoard.gObj.myArr.length > 0){
				if(repObj[repObj.length-1].uid == whBoard.gObj.myArr[0].uid){
					for(var i=0; i< whBoard.gObj.myArr.length; i++){
						console.log('mArr ' + whBoard.gObj.myArr[i].uid);
					}
					if(!whBoard.gObj.myArr[0].hasOwnProperty('cmd')){
						whBoard.gObj.myArr.shift();
					}
				//	whBoard.gObj.myArr.shift(); //remove object if double id found
				//	//alert("hi how are you");
				}
				repObj = repObj.concat(whBoard.gObj.myArr);
				whBoard.gObj.myArr = [];
			}
			
			whBoard.gObj.replayObjs = whBoard.gObj.replayObjs.concat(repObj);
		
			//TODO this should be removed later and above code should be enabled
			// right now its doing sorting but above code should be enabled and object 
			// should be stotred in sorted format
			whBoard.gObj.replayObjs = whBoard.gObj.replayObjs.sort(function(a, b){
			    return a.uid - b.uid;
			});
			
			if(fromUserId != id){
				localStorage.repObjs = JSON.stringify(whBoard.gObj.replayObjs);
			}
			
			if(fromUserId != id && (vcan.renderedObjId + 1 != repObj[0].uid)){
				if(vcan.tempArr.length > 0){
					if(repObj[repObj.length-1].uid == vcan.tempArr[0].uid){
						var fArr = repObj;
						vcan.tempArr = fArr.concat(vcan.tempArr);
					}
				}
			}
  		}
	}
)(window);