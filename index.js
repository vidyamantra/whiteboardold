/*var cssId = 'myCss';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'css/styles.css'; 
    link.media = 'all';
    head.appendChild(link);
}

var cssId = 'myCss1';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId)){
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';

    link.media = 'all';
    head.appendChild(link);
}*/
$.when(
		//$.getScript( "js/whiteboard.js" )
		/*$.getScript( "js/vcan.js" ),
		$.getScript( "js/script.js" ) */
		
 ).done(function(){
	 $.uiBackCompat=false;
    //place your code here, the scripts are all loaded
    var userobj={'userid':id,'name':name,'img':"http://static.vidyamantra.com/cdnmt/images/quality-support.png"};
    	vm_chat.init({
            'userid':id,
            'sid':'212',
            'rid': path,
            'authuser':auth_user,
            'authpass':auth_pass,
            'userobj': userobj,
            'fastchat_lasttime':'0',
            'fastchatroom_title':'fastchat',
            'fastchatroom_name':'room1'});
        //ToDo:room name contain licencekey,couse id and activity id   
        
           
    $(document).ready(function(){
    	window.whBoard.attachToolFunction('commandToolsWrapper');
    	window.whBoard.init();
    	var replayObjs = [];

    	if(typeof(Storage)!=="undefined"){
			if(localStorage.repObjs){
				//alert('hello guys');
				var allRepObjs = JSON.parse(localStorage.repObjs);
				whBoard.vcan.main.replayObjs = allRepObjs;
				whBoard.utility.clearAll(false, 'dontClear');
				whBoard.toolInit('t_replay', 'fromBrowser');
				for(i=0; i<allRepObjs.length; i++){
					replayObjs.push(allRepObjs[i]);
				}
			}
		}
    	
 		var oldData2 = whBoard.receivedPackets;
		setInterval(function (){
			oldData2 = whBoard.utility.calcPsRecvdPackets(oldData2);
			document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
		}, 1000);
    	

		var prvPacket = "";
		var currElement = "";
    	$(document).on("newmessage", function(e){
    		if(e.fromUser.userid != id){
	    		if(e.message.hasOwnProperty('createArrow')){
	    			var imageElm = whBoard.arrImg;
	    			var obj = {};
	    			obj.mp = { x: e.message.x, y: e.message.y};
	    			whBoard.utility.drawArrowImg(imageElm, obj);
	    		}
	    	}
    		
    		initLoop = 0;
    		if(!e.message.hasOwnProperty('clearAll') && !e.message.hasOwnProperty('replayAll')){
    			if(e.message.hasOwnProperty('repObj')){
    				
//    				if(e.message.repObj[0].hasOwnProperty('multiuser') && e.message.repObj[1].hasOwnProperty('multiuser')){
//    					initLoop = 2; //we are skippging first and second element
//    				}else{
//    					initLoop = 0; // we can not skip the two elements for text object
//    				}
//    				
//    				for(j=initLoop; j<e.message.repObj.length; j++){
//    					if(e.fromUser.userid != id ){
//    						if(e.message.repObj[j].usrCurrAction == 'drag'){
//    							console.log('received.x ' + e.message.repObj[j].x);
//		    				}
//    					}
//    					replayObjs.push(e.message.repObj[j]);
//    				}
//
//    				localStorage.repObjs = JSON.stringify(replayObjs);
    			}
    			
				
				if(e.fromUser.userid != id ){
					if(e.message.hasOwnProperty('createArrow')){
						whBoard.receivedPackets = whBoard.receivedPackets + (JSON.stringify(e.message).length);
					}else{
						whBoard.receivedPackets = whBoard.receivedPackets + (JSON.stringify(e.message.repObj).length);
					} 
					document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
				}
				localStorage.receivedPackets = whBoard.receivedPackets; 
			}
    		
    		
    		
    		if(e.fromUser.userid != id){
    			if(e.message.hasOwnProperty('repObj')){
    				window.whBoard.vcan.main.replayObjs = [];
    				if(e.message.repObj.length > 0){ 
    					var currObj = e.message.repObj[e.message.repObj.length-1];
    					window.whBoard.vcan.main.replayObjs.push(currObj);
    					replayObjs.push(currObj);
    					localStorage.repObjs = JSON.stringify(replayObjs);
    					
    					whBoard.toolInit('t_replay', 'fromBrowser', true);
//    					whBoard.toolInit('t_replay', 'fromBrowser');
    					
    					//localStorage.repObjs = JSON.stringify(replayObjs);
    				}
    			}
    		}
    		
    		if(e.message.hasOwnProperty('clearAll')){
 				replayObjs = [];
 				whBoard.utility.t_clearallInit();
 				localStorage.clear();
 			}
    		

    		if(e.message.hasOwnProperty('replayAll')){
    			
				window.whBoard.vcan.main.replayObjs =  replayObjs;
				whBoard.utility.clearAll(false);
				whBoard.toolInit('t_replay', 'fromFile');
			}
    		
    	});
   });
});

