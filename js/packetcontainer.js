(
	function (window){
		var whBoard = window.whBoard;
		whBoard.createPacketContainer = function (){
			var packCont  = document.createElement('div');
				packCont.id = 'sendPackCont';
			
				//document.getElementById('canvasWrapper').appendChild(packCont);
				document.getElementById('packetContainer').appendChild(packCont);
				
				//creating div for sending packet per second
				var sendPacketPS =  document.createElement('div');
				sendPacketPS.id = 'sendPackPsCont'; 
			    packCont.appendChild(sendPacketPS);
				
				label = document.createElement('label'); 
				
				//label.innerHTML = "Per second sent packets";
				label.innerHTML =  whBoard.lang.getString('perSecSentPacket');
				sendPacketPS.appendChild(label);
				
				counterDiv = document.createElement('div');
				counterDiv.id = whBoard.sentPackDivPS;
				counterDiv.className = 'numbers';
				counterDiv.innerHTML = 0;
				sendPacketPS.appendChild(counterDiv);
				
				
				//creating div for send total packet per second
				var totSendPacket =  document.createElement('div');
			    totSendPacket.id = 'totSendPackCont'; 
			    packCont.appendChild(totSendPacket);
			    
				
				var label = document.createElement('label'); 
					//label.innerHTML = "Total Sent Packets";
					label.innerHTML =  whBoard.lang.getString('totSentPackets');
					totSendPacket.appendChild(label);
					
					var counterDiv = document.createElement('div');
					counterDiv.id = whBoard.sentPackDiv;
					counterDiv.className = 'numbers';
					counterDiv.innerHTML = 0;
					totSendPacket.appendChild(counterDiv);
					
				
//				//TODO below and above statement can be achieved by single funciton
//				packCont  = document.createElement('div');
//				packCont.id = 'receivePackCont';
//				packCont.innerHTML = "Total Received Packets";
//				document.getElementById('canvasWrapper').appendChild(packCont);
//				
//				counterDiv = document.createElement('div');
//				counterDiv.id = 'receivedNumber';
//				counterDiv.className = 'numbers';
//				counterDiv.innerHTML = 0;
//				packCont.appendChild(counterDiv);
				
				
				//hello
				 packCont  = document.createElement('div');
				packCont.id = 'receivePackCont';
				
				//document.getElementById('canvasWrapper').appendChild(packCont);
				document.getElementById('packetContainer').appendChild(packCont);
				
				//creating div for sending packet per second
				var receivePacketPS =  document.createElement('div');
				receivePacketPS.id = 'receivePackPsCont'; 
			    packCont.appendChild(receivePacketPS);
				
				label = document.createElement('label'); 
				label.innerHTML =  whBoard.lang.getString('perSecRcvdData');
				//label.innerHTML = "Per second received packets";
				receivePacketPS.appendChild(label);
				
				counterDiv = document.createElement('div');
				counterDiv.id = whBoard.receivedPackDivPS;
				counterDiv.className = 'numbers';
				counterDiv.innerHTML = 0;
				receivePacketPS.appendChild(counterDiv);
				
				
				//creating div for send total packet per second
				var totReceivedPack =  document.createElement('div');
					totReceivedPack.id = 'totReceivedPackCont'; 
					packCont.appendChild(totReceivedPack);
			    
				
				var label = document.createElement('label'); 
					//label.innerHTML = "Total Received Packets";
					label.innerHTML =  whBoard.lang.getString('totRcvdPackets');
					totReceivedPack.appendChild(label);
					
					counterDiv = document.createElement('div');
					counterDiv.id = whBoard.receivedPackDiv;
					counterDiv.className = 'numbers';
					counterDiv.innerHTML = 0;
					totReceivedPack.appendChild(counterDiv);
				
		}
		
		whBoard.createPacketInfoContainer = function (){
			///creating sent message information
			var informationCont = document.getElementById('informationCont');
			label = document.createElement('label'); 
			label.innerHTML =  "Sent Msg information";
			informationCont.appendChild(label);
			
			
			var sentMsgInfo  = document.createElement('div');
				sentMsgInfo.id = 'sentMsgInfo';
				informationCont.appendChild(sentMsgInfo);
				
			
			///creating received message information	
			label = document.createElement('label'); 
			label.innerHTML =  "Received Msg information";
			informationCont.appendChild(label);
			var rcvdMsgInfo  = document.createElement('div');
				rcvdMsgInfo.id = 'rcvdMsgInfo';
				informationCont.appendChild(rcvdMsgInfo);	
				
				
			
		}
		
	}
)(window);