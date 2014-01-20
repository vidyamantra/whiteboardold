(
	function (window){
		var whBoard = window.whBoard;
		whBoard.bridge.requestPackets  = function (e){
			//more than one packets comes after connection on
			if(e.message.repObj.length > 1){
					whBoard.globalObj.myArr = e.message.repObj;
			}
  			whBoard.sentReq = true;
			var sp = vcan.reachedItemId;
			var ep = e.message.repObj[0].uid;
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
  		
		whBoard.bridge.sendPackets = function(e, chunk){
			if(e.message.getMsPckt[0] == 0){
				var i = -1;
			}else{
				var fs = e.message.getMsPckt[0].uid;
				for(var i=0; i<whBoard.globalObj.myrepObj.length; i++){
    				if(e.message.getMsPckt[0] == whBoard.globalObj.myrepObj[i].uid){
    					fs =  e.message.getMsPckt[0];
    					break;
    				}
				}
			}
			
			for(var j=i+1; j<e.message.getMsPckt[1]; j++){
				chunk.push(whBoard.globalObj.myrepObj[j]);
			}
			console.log('fid' + chunk[0].uid + ' eid' + chunk[chunk.length-1].uid);
			vm_chat.send({'repObj' : chunk, 'chunk' : true});
			return;
  		}
	}
)(window);