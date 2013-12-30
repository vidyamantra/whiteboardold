(
	function (window){
		//window.whBoard.lang.getString
		whBoard = window.whBoard;
		//alert(window.mybrowser);
		whBoard.view.displayMessage = function (msg){
			//TODO this message have to be displayed
			var msg = whBoard.lang.getString(msg);
			alert(msg);
		}
	}	
)(window);