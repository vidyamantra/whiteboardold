(
	function (window){
//		alert('hi brother');
//		debugger;
		window.whBoard.lang.getString = function (string){
//			alert('suman');
//			debugger;
			return window.whBoard.lang.message[string];
		}
	}
)(window);