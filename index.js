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
				whBoard.utility.clearAll(false);
				whBoard.toolInit('t_replay', 'fromBrowser');
				
				for(i=0; i<allRepObjs.length; i++){
					replayObjs.push(allRepObjs[i]);
				}
			}
		}
    	
	//    	$(document).on("connectionopen", function (e){
	//    		//alert('khan is not');
	//    		//alert('sss');
	//    	});
    	
    	 $(document).on("member_added", function(e){	  
    		//alert('suman bogati');
    		//debugger;
    		
//    		var allRepObjs = JSON.parse(e.repObjs);
//			whBoard.vcan.main.replayObjs = allRepObjs;
//			whBoard.utility.clearAll(false);
//			whBoard.toolInit('t_replay', 'fromBrowser');
 		    
 		});
    	 
    	 
 		var oldData2 = whBoard.receivedPackets;
		setInterval(function (){
			oldData2 = whBoard.utility.calculateRecPacket(oldData2);
			document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
		}, 1000);
    	
    	$(document).on("newmessage", function(e){
    		//alert("brother");
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
    				if(e.message.repObj[0].hasOwnProperty('multiuser') && e.message.repObj[1].hasOwnProperty('multiuser')){
    					initLoop = 2; //we are skippging first and second element
    				}else{
    					initLoop = 0; // we can not skip the two elements for text object
    				}
    				
    				for(j=initLoop; j<e.message.repObj.length; j++){
    					replayObjs.push(e.message.repObj[j]);
    				}
    				
    				localStorage.repObjs = JSON.stringify(replayObjs);
    			}
    			
				
				if(e.fromUser.userid != id ){
					if(e.message.hasOwnProperty('createArrow')){
						whBoard.receivedPackets = whBoard.receivedPackets + (JSON.stringify(e.message).length);
					}else{
						whBoard.receivedPackets = whBoard.receivedPackets + (JSON.stringify(e.message.repObj).length);
					} 
					document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
					
					//document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
				}
				
				//whBoard.receivedPackets = whBoard.receivedPackets + (JSON.stringify(e.message.repObj).length);
				//document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
				
			}
    		
    		
    		if(e.fromUser.userid != id){
    			
//    			if(e.fromUser.userid != id){
//					whBoard.receivedPackets = whBoard.receivedPackets + (JSON.stringify(e.message.repObj).length);
//					document.getElementById(whBoard.receivedPackDiv).innerHTML = whBoard.receivedPackets;
//				}
    			
    			
    			if(e.message.hasOwnProperty('repObj')){ 
    				window.whBoard.vcan.main.replayObjs =  e.message.repObj;
    				if(window.whBoard.vcan.main.replayObjs.length > 0){
    					whBoard.toolInit('t_replay', 'fromBrowser');
            		}
    			}else if(e.message.hasOwnProperty('clearAll')){
    				//replayObjs = [];
    				//whBoard.utility.t_clearallInit();
    				//localStorage.clear();
    			}
    			
    		}
    		
    		if(e.message.hasOwnProperty('clearAll')){
 				replayObjs = [];
 				whBoard.utility.t_clearallInit();
 				localStorage.clear();
 			}
    		
    		//alert('hi brot');
    		if(e.message.hasOwnProperty('replayAll')){
				window.whBoard.vcan.main.replayObjs =  replayObjs;
				whBoard.utility.clearAll(false);
				whBoard.toolInit('t_replay', 'fromFile');
			}
    		
    		//alert('aadsfadsf');
//    		if(e.message.hasOwnProperty('replayAll')){
//    			alert(replayObjs.length);
//				window.whBoard.vcan.main.replayObjs =  replayObjs;
//				whBoard.utility.clearAll(false);
//				whBoard.toolInit('t_replay');
//			}
    	});

//    	var draw = false;
//	    $(document).on("newmessage", function(e){
//        	if(e.message.etype == 'mousedown'){
//        		draw = true;
//        		document.fd.drawStart(e.message.x, e.message.y);
//        	}else if(e.message.etype == 'mousemove'){
//        		document.fd.drawObject(e.message.x, e.message.y);	
//        	}else if(e.message.etype == 'mouseup'){
//        		draw = false;
//        	}
//        	
//        });	
           
        
   });
});

