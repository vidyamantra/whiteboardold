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
	
	</script>
	<!-- footer tab -->

	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
	
<!--      <script type="text/javascript" src="js/whiteboard.js"></script> --> 
		
		
	    <script type="text/javascript" src="js/vmchatlib.js"></script>
	   
	   <script type="text/javascript">
	   	   window.vm_chat = vm_chat;		
	   </script>
	   <link rel="stylesheet" type="text/css" href="css/styles.css" />
	   <script type="text/javascript" src="js/vcan.js"></script>
	   <script type="text/javascript" src="js/script.js"></script>
	   <script type="text/javascript" src="index.js"></script>
       

 
  </head>
  <body>

    <div id="stickycontainer"></div>  
    
    <div id="containerWb">
    	
    </div>
    <div id="informtionCont">
    	<label>Sent Msg information</label>
	    <div id="sentMsgInfo">
	    		
	    </div>
	    
	    <label>Received Msg information</label>
	    <div id="rcvdMsgInfo">
	    	
	    </div>
    </div>
    
    <script type="text/javascript" src="js/keyboard.js"></script> 
  </body>
</html>

