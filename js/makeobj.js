(
	function (window){
		var whBoard = window.whBoard;
		
		/**
		 * this function makes the properties for particular object like start and end point for line, width,height,x,y made for rectangle
		 *	@param startPosX for starts horizontal position for start point
		 *  @param startPosY for starts vertical position for start point
		 *  @param endPosX for starts horizontal position for end point
		 *  @param endtPosY for starts vertical position for end point
		 *  @param objType particular ocanvas object type eg:- rectangle, oval etc
		 *  returns the object wrapped along with the properties  
		 */
		whBoard.makeobj = function(startPosX, startPosY, endPosX, endPosY, objType){
			////console.log('startPos ' + startPosX + ' ' + startPosY  + '/' + 'endPos ' + endPosX + ' ' + endPosY);
			////console.log('endPos ' + endPosX + ' ' + endPosY);
			var obj = {};
			 obj.mp = {};
			 obj.mp.x = endPosX;
			 obj.mp.y = endPosY;
			//below code have been daibled during the unit testing
			//if(whBoard.prvObj != " "){
			//	if(typeof whBoard.prvObj == "object"){
				if(startPosX > endPosX ){
					//this is not using for oval
					//TODO will have to look for other object that is it need or not
					var temp_endPosX = endPosX;
					var temp_endPosY = endPosY;
					 endPosX = startPosX;
					 endPosY = startPosY;
					 startPosX =  temp_endPosX;
					 startPosY =  temp_endPosY;
					 obj.dRoad = 'b2t';
				}else{
					obj.dRoad = 't2b';
				}
	//		}
			
			obj.type = objType;
			
			if(objType == 'rectangle' || objType == 'triangle'){
				obj.sx = startPosX;
				obj.sy = startPosY;
				obj.ex = endPosX;
				obj.ey = endPosY;
			}
			
			if (objType == 'line'){	
				obj.lineColor = "navy";
				obj.lineWidth = 3;
				obj.start = {x:startPosX, y:startPosY};
				obj.end = {x:endPosX, y:endPosY};
				
			}else if(objType == 'rectangle'){
				obj.width = endPosX-startPosX;
				obj.height =  endPosY-startPosY;
				
				obj.borderColor = 'green';
				obj.fillColor = "#ddd";
				obj.lineWidth = 3;
				
			}else if(objType == 'oval'){
				obj.lineWidth = 3;
				obj.borderColor = 'red';
				
				obj.width =   endPosX-startPosX;
				obj.height =  endPosY-startPosY;
				
				obj.x =  endPosX - (obj.width / 2);
				obj.y = endPosY - (obj.height / 2);
				
				obj.rx = (obj.width/2);
				obj.ry = (obj.height/2);
			   
			}else if(objType == 'triangle'){
				obj.lineWidth = 3;
				obj.borderColor = 'blue';
			}else if(objType == 'text'){
				return;
			}
			return obj;
		}
		
	}
)(window);