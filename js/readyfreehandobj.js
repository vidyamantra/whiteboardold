(
    function(window) {
        var whBoard = window.whBoard;

        /**
         * this class initializes the functions 
         * thorugh which the free hand object is drawn
         */
        //NOTE:- have changed during the unit testing
        whBoard.readyFreeHandObj = function(borderColor, lineWidth) {
            return {
                /**
                 * this function does intialize the value which is required for drawing the object 
                 * @returns nothing
                 */

                init: function() {
                    this.freesvg = true;
                    this.fdObj = {};
                    this.borderColor = borderColor;
                    this.freeDrawingLineWidth = lineWidth;
                },
                /**
                 * this function does setup the drawing object fdObj for free drawing 
                 * it is called when user click on canvas
                 * It expects mouse down event
                 * @returns nothing
                 */

                drawStart: function(ev) {
                    var vcan = whBoard.vcan;
                    //if(vcan.main.freesvg == true){
                    if (whBoard.obj.freeDrawObj.freesvg == true) {
                        var ctx = vcan.main.canvas.getContext('2d');
                        //borderColor = "red";
                        //this.fdObj = vcan.main.freeHandDrawing(ev, {borderColor: borderColor});
                        this.fdObj = vcan.main.freeHandDrawing({borderColor: this.borderColor, lineWidth: this.freeDrawingLineWidth});
                        this.fdObj.init();

                        pointer = vcan.utility.getReltivePoint(ev);
                        this.fdObj.fhdStart(ctx, pointer);
                        return;
                        //}
                    }
                },
                /**
                 * this function calls the function through 
                 * which the free hand draw object is drawn as user move the mouse 
                 * @param ev expects the mouse move event
                 * @returns nothing
                 */
                wb_draw: function(ev) {
                    var pointer = vcan.utility.getReltivePoint(ev);
                    this.fdObj.fhRendering(pointer);
                },
                finalizeDraw: function(ev) {
                    var vcan = whBoard.vcan;
                    //TODO this(finalizeDrawingPath) should be called over the object 
                    //prvObj =  vcan.main.freeDraw.finalizeDrawingPath();

                    whBoard.prvObj = this.fdObj.finalizeDrawingPath(whBoard.canvas);
                    var lastChild = vcan.main.children[vcan.main.children.length - 1];
                    lastChild.mt = whBoard.utility.stringToNumber(whBoard.prvObj.path[whBoard.prvObj.path.length - 1][3]);


                    /**** 
                     *
                     * This would I have disbaled can be critical
                     * whBoard.repObj.replayObjs.push(whBoard.prvObj);
                     *
                     ****/
                }
            };
        }
    }
)(window);