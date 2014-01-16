(
	function (window){
		var whBoard = window.whBoard;
		whBoard.createPacketContainer = function (){
				
			var labelDiv = document.createElement('div');
				labelDiv.id = "dataInformation";
				
				document.getElementById('packetContainer').appendChild(labelDiv);
				
				var blankDiv = document.createElement('div');
					blankDiv.id = "blankDiv";
					
					labelDiv.appendChild(blankDiv);
				
				var perSecLabel = document.createElement('div');
					perSecLabel.id = "perSecData";
					perSecLabel.innerHTML = "Per Second Data";
					
					labelDiv.appendChild(perSecLabel);
					
				var totalDataLabel = document.createElement('div');
					totalDataLabel.id = "totalDataLabel";
					totalDataLabel.innerHTML = "Total";
					labelDiv.appendChild(totalDataLabel);	
					
			
			var packCont  = document.createElement('div');
				packCont.id = 'sendPackCont';
				document.getElementById('packetContainer').appendChild(packCont);
				
				//
				var sendPacketPSLabel = document.createElement('div');
					sendPacketPSLabel.id = 'sentPacketsLabel';
					sendPacketPSLabel.innerHTML = "Sent Packets";
					
					packCont.appendChild(sendPacketPSLabel);
					
				var sendPacketPS =  document.createElement('div');
				sendPacketPS.id = 'sendPackPsCont'; 
			    packCont.appendChild(sendPacketPS);
				
				counterDiv = document.createElement('div');
				counterDiv.id = whBoard.sentPackDivPS;
				counterDiv.className = 'numbers';
				counterDiv.innerHTML = 0;
				sendPacketPS.appendChild(counterDiv);
				
				
				//creating div for send total packet per second
				var totSendPacket =  document.createElement('div');
			    totSendPacket.id = 'totSendPackCont'; 
			    packCont.appendChild(totSendPacket);
			    
				
					
					var counterDiv = document.createElement('div');
					counterDiv.id = whBoard.sentPackDiv;
					counterDiv.className = 'numbers';
					counterDiv.innerHTML = 0;
					totSendPacket.appendChild(counterDiv);
					
				

				packCont  = document.createElement('div');
				packCont.id = 'receivePackCont';
				document.getElementById('packetContainer').appendChild(packCont);
				
				var receivedPacketPSLabel = document.createElement('div');
				receivedPacketPSLabel.id = 'receivedPacketsLabel';
				receivedPacketPSLabel.innerHTML = "Recevied Packets";
				
				packCont.appendChild(receivedPacketPSLabel);
				
				var receivePacketPS =  document.createElement('div');
				receivePacketPS.id = 'receivePackPsCont'; 
			    packCont.appendChild(receivePacketPS);
				
			    /*
				label = document.createElement('label'); 
				label.innerHTML =  whBoard.lang.getString('perSecRcvdData');
				receivePacketPS.appendChild(label); */
				
				counterDiv = document.createElement('div');
				counterDiv.id = whBoard.receivedPackDivPS;
				counterDiv.className = 'numbers';
				counterDiv.innerHTML = 0;
				receivePacketPS.appendChild(counterDiv);
				
				
				//creating div for send total packet per second
				var totReceivedPack =  document.createElement('div');
					totReceivedPack.id = 'totReceivedPackCont'; 
					packCont.appendChild(totReceivedPack);
			    
				/*
				var label = document.createElement('label'); 
					//label.innerHTML = "Total Received Packets";
					label.innerHTML =  whBoard.lang.getString('totRcvdPackets');
					totReceivedPack.appendChild(label); */
					
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