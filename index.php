<!-- The following line is essential for the "position: fixed" property to work correctly in IE -->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<meta http-equiv="Content-type" content="text/html;charset=UTF-8">

  <head>
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
		
	 <!-- 	 <script type="text/javascript" src="js/ui.tabs.paging.js"></script> -->
    <script type="text/javascript" src="index.js"></script> 

 
  </head>
  <body>

    <div id="stickycontainer"></div>  
    
    <div id="containerWb">
    	
    </div>
  </body>
</html>

