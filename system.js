(
	function (window){
		var browserName = window.mybrowser.detection[0];
		var browserVersion = window.mybrowser.detection[1];
		
		if(browserName == 'Firefox'  && Number(browserVersion) < 24){
			whBoard.view.displayMessage("browserNotSupport");
		}
	}	
)(window);