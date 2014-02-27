<!-- The following line is essential for the "position: fixed" property to work correctly in IE -->
<!DOCTYPE html>
<html>
  <head>
  	<meta charset="UTF-8">
    <title>jquery.ui.chatbox</title>
	<?php include('key.php') ?>
   <script type="text/javascript">
	<?php echo "name='".$_GET['name']."';"; ?>
	<?php echo "id='".$_GET['id']."';"; ?>
	<?php echo "socketOn='".$_GET['socket']."';"; ?>
	<?php echo "dataInfo='".$_GET['datainfo']."';"; ?>
	<?php echo "role='".$_GET['r']."';"; ?>
	
	
	</script>
	<!-- footer tab -->
	
	  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	   <script type="text/javascript" src="js/vmchatlib.js"></script>
	   <script type="text/javascript">
	   	   window.vm_chat = vm_chat;		
	   </script>
	
	   <link rel="stylesheet" type="text/css" href="css/styles.css" /> 
	   
	   <script type="text/javascript" src="js/vcan.js"></script>
	   <script type="text/javascript" src="js/script.js"></script>
	   <script type="text/javascript" src="index.js"></script>
	   <script type="text/javascript" src="js/wb_utility.js"></script>

	   <!--  <script type="text/javascript" src="lib.js"></script> -->
	   <script type="text/javascript" src="js/en.js"></script>
	   <script type="text/javascript" src="js/lang.js"></script>
	   <script type="text/javascript" src="js/view.js"></script>
	   <script type="text/javascript" src="js/system.js"></script>
	   
	   <script type="text/javascript" src="js/packetcontainer.js"></script>
	   <script type="text/javascript" src="js/drawobject.js"></script>
	   <script type="text/javascript" src="js/makeobj.js"></script>
	   <script type="text/javascript" src="js/utility.js"></script>
	   <script type="text/javascript" src="js/vcanmain.js"></script>
	   <script type="text/javascript" src="js/events.js"></script>
	   <script type="text/javascript" src="js/virtualbox.js"></script>
	   <script type="text/javascript" src="js/interact.js"></script>
	  <!--   <script type="text/javascript" src="index.js"></script> -->
	   <script type="text/javascript" src="js/rectangle.js"></script>
       <script type="text/javascript" src="js/oval.js"></script>
       <script type="text/javascript" src="js/triangle.js"></script>
       <script type="text/javascript" src="js/line.js"></script>
       <script type="text/javascript" src="js/text.js"></script>
       <script type="text/javascript" src="js/freedrawing.js"></script>
       <script type="text/javascript" src="js/path.js"></script>
       <script type="text/javascript" src="js/mouse.js"></script>
       <script type="text/javascript" src="js/readyfreehandobj.js"></script>
       <script type="text/javascript" src="js/replay.js"></script>
       <script type="text/javascript" src="js/readytextobj.js"></script>
       <script type="text/javascript" src="js/keyboard.js"></script>
       <script type="text/javascript" src="js/adapter.js"></script> 
       <script type="text/javascript" src="js/video.js"></script>  
       <script type="text/javascript" src="js/bridge.js"></script>
       <script type="text/javascript" src="js/video_resize.js"></script>
       <script type="text/javascript" src="js/optimization.js"></script>
       
       <!--  <script type="text/javascript" src="js/whiteboard.js"></script> --> 
	  
		   
  </head>
  
  <body>

	
  	<div id="topContainer">Top Container</div>
  	<div id="leftContainer">
  		This is my left container
  		This is my left container
  		This is my left container
  		This is my left container
  		This is my left container
  		This is my left container
  	</div>
  	 

 	<div id="vcanvas">
	<!--   	
 	<div id="myExample">
 		suman bogati
 	</div>
	-->
	    <div id="containerWb">
	    
	    </div>	
	    
	    <div id='videos'>
	   <!--  
	    	<div id="vidCmdWrapper">
	    		<div id="resizeVideo" class="command">
	    			r
	    		</div>
	    		
	    		<div id="miniMizeVideo" class="command">
	    			m
	    		</div>
	    		
	    	</div>
	    -->			
	    		<!--  <h4>Users Video</h4> -->
	    		<!--   <video id='localVideo' autoplay></video>-->
	    		<div id="videoContainer">
	    		 
	    		 <div class="dynDiv_resizeDiv_tl"></div>
	    		 
	    		 <div  class="dynDiv_moveParentDiv">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	    		 		<video id="localVideo" autoplay>
				 		
					</video>
	    		
	    		<video id='remoteVideo' class="remoteVideo" autoplay>

	    			 <source src="http://www.w3schools.com/tags/movie.mp4" type="video/mp4">
  					<source src="http://www.w3schools.com/tags/movie.ogg" type="video/ogg">

	    		</video>
	    		 	
	    		  </div>
				 
				 	    		<!--  <video id='remoteVideo2'  autoplay muted></video> -->
	    		<div class="clear"></div>
	    </div>
	     </div>
	    <dv id="mainContainer">
		    <div id="packetContainer">
		    		
		    </div>
		    
		    <div id="informationCont">
	    	
	    	</div>
	    </dv>
	    
	    <!-- 
	    <div id="conControler">
	    	<a href="#" id="onConnection">Connection On</a> <br />
	    	<a href="#" id="offConnection">Connection Off</a>
	    </div>
	     -->
	    
	    <div class="clear"></div>
  	</div>   
  	<div class="clear"></div>
  	<div id="dss">This is my left container</div>
  </body>
  
  
  <!-- 
  <script type="text/javascript" src="js/dispmsg.js"> </script>  
  	
  	   <script type="text/javascript" src="js/lib/adapter.js"></script>
	   <script type="text/javascript" src="js/video.js"></script>
  	 -->
		
</html>

