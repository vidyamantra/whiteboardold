(
	function (window){
		var whBoard =  window.whBoard;
		whBoard.readyTextObj = function(){
			return {
					init : function (boxCont){
						//this.textId =  0;
						this.prevTextObj = "";
						this.currTextObjWrapper = "";
						this.keyTyped = []; //the key typed by user this is used into finalizeText()
						this.currObject = {};
						this.prvModTextObj = {};
						this.prvCurrTransform = {};
						this.textWriteMode = 0;
						this.totalBox = 0;
						this.boxContainer = boxCont;
						this.muser = false;
					},
					
					
					/**
					 * 
					 * This function handles all the functionality of text object
					 * Eg: created the text wrapper for creating text, create text, create the text with older one
					 * @param startPosX points out the x co-ordination of canvas after clicked by user
					 * @param startPosY points out the y co-ordination of canvas after clicked by user
					 * @returns nothing
					 */
					textUtility : function (startPosX, startPosY, mtext){
						this.startPosX = startPosX;
						this.startPosY = startPosY;
						//alert('is there anything for you');
						var vcan = whBoard.vcan;
						var ctx = vcan.main.canvas.getContext('2d');
						var obj = {};
						this.textWriteMode++;
						this.wmode = true;
						
						
						if(vcan.main.currentTransform != undefined && vcan.main.currentTransform != ''){
								 this.currObject = vcan.main.currentTransform.target;
							     if(this.currObject != undefined && this.currObject.type == 'text'){
										obj = {width:300, height: 100 , x: this.currObject['oCoords'].tl.x, y: this.currObject['oCoords'].tl.y, text:this.currObject.text};
										if(!whBoard.utility.clickOutSidebox(this.textWriteMode)){
											//whBoard.obj.drawTextObj.drawTextBoxWrapper(ctx, obj,  this.currObject.id);
											whBoard.obj.drawTextObj.drawTextBoxWrapper(obj,  this.currObject.id);
										}
										vcan.main.currentTransform = "";
							     }
							     
							    	if(whBoard.utility.clickOutSidebox(this.textWriteMode)){
					     			whBoard.obj.drawTextObj.renderText(this.prvCurrTransform, this.prvModTextObj, ctx);
								}
									
								if(this.currObject != undefined && this.currObject.type == 'text'){
									
									//the height and width shoudl be dyanamic
									obj = {width:300, height: 100 , x: this.currObject['oCoords'].tl.x, y: this.currObject['oCoords'].tl.y, text:this.currObject.text};
										this.prvModTextObj = {prvObjId : this.currObject.id, prvText : this.currObject.text, x : this.currObject.x,  y:this.currObject.y};
										this.prvTextObj = this.currObject;
								}	
								this.prvCurrTransform = this.currObject;

						}else{
							
							if (whBoard.utility.clickOutSidebox(this.textWriteMode)){
									//alert('suman bogati khan');
								    if(typeof mtext != 'undefined'){
								    	whBoard.obj.drawTextObj.renderText(this.currObject, this.prvModTextObj, ctx, mtext);
								    }else{
								    	whBoard.obj.drawTextObj.renderText(this.currObject, this.prvModTextObj, ctx);
								    }
									
								}else{
									this.totalBox++;
									var obj = {x:startPosX,  y:startPosY, width:300, height : 100};
									//whBoard.obj.drawTextObj.drawTextBoxWrapper(ctx, obj,  this.totalBox);
									if(typeof mtext == 'undefined'){
										whBoard.obj.drawTextObj.drawTextBoxWrapper(obj,  this.totalBox);
									}else{
										whBoard.obj.drawTextObj.drawTextBoxWrapper(obj,  this.totalBox, mtext);
								}
									
							}
		
						}
						
					},
					
					
					
					/**
					 * It draws the textarea wrapper for draw the text inside it
					 * @param ctx the canvas's context on which the box is being drawn
					 * @param obj contains the information about contianer for example x, y, 
					 * width and height, the object contains the text also if it available
					 * @param boxNumber the number of box till now created
					 * @returns nothing
					 */
					
					//drawTextBoxWrapper : function (ctx, obj, boxNumber){
					drawTextBoxWrapper : function (obj, boxNumber, mtext){
						var vcan = whBoard.vcan;
						var divNode  = document.createElement('div');
						divNode.id = "box" + boxNumber;
						
						divNode.style.position = 'absolute';

						divNode.style.left = (vcan.main.offset.x+obj.x) + "px";
						divNode.style.top =  (vcan.main.offset.y+obj.y) + "px";
//						divNode.style.left = (whBoard.vcan.main.offset.x+obj.x) + "px";
	//					divNode.style.top =  (whBoard.vcan.main.offset.y+obj.y) + "px";
						
						var textNode = document.createElement('textarea');
						textNode.id = divNode.id+'textarea';
						textNode.rows = 8;
						textNode.cols = 41;
						if(obj.text != undefined && obj.text != ''){
							textNode.value = obj.text; 
						}
						
						divNode.appendChild(textNode);
						document.getElementById(this.boxContainer).appendChild(divNode);
						
						if(typeof mtext != 'undefined'){
						//	alert('suman bogati');
							//divNode.style.display = 'none'
						}
						
						this.prevTextObj = divNode;
						this.currTextObjWrapper =  obj;
					//	this.prevTextObj.measure = {};
						this.prevTextObj.measure = obj
					},
				
					
					
					/**
					 * The function renders the text after typed by user into textarea
					 * It removes the older text object on which user would clicked for udate the text
					 * @param currObject is the object which is ready to be printed
					 * @param prvModTextObj
					 * @param ctx is the current canvas context
					 * @returns nothing
					 */
					renderText : function (currObject, prvModTextObj, ctx, mtext){
						var vcan = whBoard.vcan;
						if(this.prevTextObj != '' ){
							
						//	var myVal = isObjEmpty(currObject);
							if(!whBoard.utility.IsObjEmpty(currObject)){
								for(var i=0; i<vcan.main.children.length; i++){
									if(currObject.id == vcan.main.children[i].id){
										vcan.main.children.splice(i, 1);
										this.currObject = "";
										break;
									}
								}
							}
							
							if(!whBoard.utility.IsObjEmpty(currObject)){
								if(typeof mtext != 'undefined'){
									this.finalizeText(ctx, this.prevTextObj,  prvModTextObj, mtext);
								}else{
									this.finalizeText(ctx, this.prevTextObj,  prvModTextObj);
								}
								
								
							}else{
								if(typeof mtext != 'undefined'){
									this.finalizeText(ctx, this.prevTextObj, undefined, mtext);
								}else{
									this.finalizeText(ctx, this.prevTextObj);
								}
							}
							
							whBoard.obj.drawTextObj.wmode = false;
						}
					},
					
					
					/**
					 * This function actually draws the text of passed wrapper for textarea
					 * @param ctx the conext on which the text is drawing
					 * @param txtWrapper The text wrapper which has text and it's wrapper to be drawn 
					 * @param prvModObj if text wrapper has previous text eg 'vidya' new one is vidymantra 
					 * then prvModObj contains the vidya other info x, y 
					 * @returns nothing
					 */
					finalizeText : function (ctx, txtWrapper, prvModObj, mtext){
						    
							var vcan = whBoard.vcan;
							var prvNode = document.getElementById(txtWrapper.id); 
							var userText = "";
							if(typeof mtext == 'undefined'){
								var textarea = prvNode.getElementsByTagName('textarea');
								for(var i =0; i< textarea.length; i++){
									if(textarea[i].id == prvNode.id+'textarea'){
										 userText =textarea[i].value;
										break;
									}
								}
							}else {
								userText = mtext;
							}
							
							
							
							var fontSize = 20;
							ctx.font = fontSize +'px Times New Roman';
							var maxWidth = 0;
							var tempUserTextArr =  userText.split(/\r?\n/);
							maxWidth = ctx.measureText(tempUserTextArr[0]).width;
							var extHeight = 15; //TODO this should be changed according to font size by selected user
							for(var i=1; i<tempUserTextArr.length; i++){
								extHeight += 15;
								var tempMaxWidth = ctx.measureText(tempUserTextArr[i]).width;
								if(tempMaxWidth > maxWidth){
									maxWidth = tempMaxWidth;
								}
							}
							
							var textHalfWidth = maxWidth/2;
							
							var  currTime= new Date().getTime();
							var textObj = {
									type : 'text',
									text : userText, 
									x : txtWrapper.measure.x+textHalfWidth,
									y : txtWrapper.measure.y+extHeight,
									fontSize:fontSize,
									fontWidth : ctx.measureText(userText).width,
									textArr : this.keyTyped, //this should add after called the function canvas.addObject(text)
									mp : {x : txtWrapper.measure.x, y:txtWrapper.measure.y}
							};
							
							if(whBoard.obj.drawTextObj.muser == false){
								var obj = {'mt' :currTime, 'ac':'d', 'x' : this.startPosX, 'y' : this.startPosY,  'mtext' : textObj.text};
								vcan.main.replayObjs.push(obj);
								localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
								vm_chat.send({'repObj': [obj]});
								whBoard.utility.updateSentPackets(obj);
						   }
						   
						   
							
						   var text = whBoard.canvas.readyObject(textObj);
						   var tempObj = text.coreObj;
						  
						   whBoard.canvas.addObject(text);
						   tempObj = vcan.extend({}, tempObj);
						   text = vcan.extend(tempObj, {textArr : this.keyTyped});
						   
						   	text = vcan.extend(tempObj, {textArr : this.keyTyped, mdTime:currTime, func:'add', usrCurrAction : 'create', lastElement:true });
						   	
						   	//TODO prvModObj that should be check through hasOwnProperty method
						   	
					  		if(prvModObj != undefined){
								if(prvModObj != ''){
									text = vcan.extend(tempObj, {textArr : this.keyTyped, mdTime:currTime, func:'add', usrCurrAction : 'create', lastElement:true, 
										prvObj : prvModObj, pt : whBoard.obj.drawTextObj.prvTextObj});
									
								}
								
							}
					  		
					  		var tarr = [];
					  		var lastTxtObj = vcan.main.children[vcan.main.children.length-1];
					  		lastTxtObj.mdTime = currTime;
							this.keyTyped = [];  
							prvNode.parentNode.removeChild(txtWrapper);
							vcan.renderAll();
							if(whBoard.sentPackets > 0) {
								 document.getElementById(whBoard.sentPackDiv).innerHTML = whBoard.sentPackets;
							}
							
					}
			  }
		}
	}
)(window);