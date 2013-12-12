(
	function (window){
		window.onload = function (){
			var vm_chat = window.vm_chat;
			
			document.getElementById('onConnection').onclick = connectionOpen;
			document.getElementById('offConnection').onclick = connectionOff;
			
			function connectionOpen(){
				alert('hello guys what is up');
				vm_chat.wsconnect();
			} 
			
			function connectionOff(){
				alert('I am fine here');
				vm_chat.disconnect();
			}
		}
	}
)(window);