(
	function (window){
		var vcan = window.vcan; 
		
		/**
		 * @Class defined text for drawing text
		 *  methods initilized for creating line object
		 *  in future there can be more properties than now
		 */
		vcan.text = function (){
			return  {
				type : 'text',
				
				/**
				 * initiates the properties to object
				 * @param obj the properties would initates on it
				 */
				init : function (obj){
					/*
					obj.textLines = {}; //This is object we have created
					obj.textLines.length = 1;
					*/

					obj.lineHeight = 1.3 //earlier 1.3 it was
					
					if(obj.fontSize == undefined){
						obj.fontSize = 30;
					}
					//change during the unit testing
					obj.font = obj.fontSize + 'px Times New Roman';
					return obj;	
				},
				
				/**
				 * it draws the text object as passed parameter obj 
				 * @param ctx current context
				 * @param obj would be drawn
				 */
				draw : function (ctx, obj, noTransform){
					//ctx.fillStyle = "black";	
					ctx.font = obj.font;
					
					//TODO this should be done at init function of this class
					//obj.height = obj.fontSize * obj.textLines.length * obj.lineHeight;
					//obj.width = ctx.measureText(obj.text).width;
					
					var textLines = obj.text.split(/\r?\n/);
					//obj.height = obj.fontSize * obj.textLines.length * obj.lineHeight;
					
					obj.height = this.getTextHeight(ctx, textLines, obj);
					obj.width = this.getTextWidth(ctx, textLines);
					
					//obj.width = ctx.measureText(obj.text).width;
					//salert(obj.width);
					
					ctx.beginPath();
					for (var i = 0, len = textLines.length; i < len; i++) {
				      	var tempHeight = (-obj.height / 2) + (i * obj.fontSize * obj.lineHeight) + obj.fontSize;
				      	ctx.fillText(textLines[i], -obj.width/2, tempHeight)
				    }
					ctx.closePath();
					
					obj.setCoords();
				    
				},
				
				/***
				 * It gets the width of text which is passed by textLines
				 * @param ctx the context is current canvas context
				 * @param textLines this is the texts
				 * @returns returns width of text
				 */
				getTextWidth: function(ctx, textLines) {
				     var maxWidth = ctx.measureText(textLines[0]).width;

				      for (var i = 1, len = textLines.length; i < len; i++) {
					        var currentLineWidth = ctx.measureText(textLines[i]).width;
					        if (currentLineWidth > maxWidth) {
					        	maxWidth = currentLineWidth;
					        }
				      }
				      return maxWidth;
				 },
				 
				 
				 /***
					 * It gets the height of text which is passed by textLines
					 * @param ctx the context is current canvas context
					 * @param textLines this is the texts the heigth of which is calcualted
					 * @returns returns height
					 */
				 getTextHeight: function(ctx, textLines, obj) {
					  return obj.fontSize * textLines.length * obj.lineHeight;
				 }
			};
		}
	}
)(window);