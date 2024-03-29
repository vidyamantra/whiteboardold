(
    function(window) {
        var whBoard = window.whBoard;

        /**
         * this class has methods by which the user can draw the particular object at different mouse event
         * @param objType is the particular object type which has to be drawn
         * @canvas canvas is the canvas element on which the object would be drawn 
         * @thisobj is current tool object 
         */
        whBoard.draw_object = function(objType, canvas, thisobj) {
            var tool = thisobj;
            thisobj.started = false;

            var startPosX;
            var startPosY;
            var endPosX;
            var endPosY;
            var dataChunk = [];


            /**
             * This function sets up the situation for draw the particular object
             * This function called when user selected particular tool eg:- rectangle, line and clicked over the canvas
             * 
             */
            tool.mousedown = function(ev, cobj) {
                if (ev.detail.hasOwnProperty('cevent')) {
                    ev.clientX = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
                    ev.clientY = ev.detail.cevent.y + (whBoard.vcan.main.offset.y);
                    ev.x = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
                    ev.y = ev.detail.cevent.x + (whBoard.vcan.main.offset.y);
                    ev.pageX = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
                    ev.pageY = ev.detail.cevent.y + (whBoard.vcan.main.offset.y);
                    ev.currX = ev.detail.cevent.x;
                    ev.currY = ev.detail.cevent.y;
                }

                var vcan = whBoard.vcan;
                lastmousemovetime = null;
                if (typeof (Storage) !== "undefined") {
                    //localStorage.repObjs = "";
                }
                tool.startPosX = ev.currX;
                tool.startPosY = ev.currY;

                var currState = vcan.getStates('action');
                if (currState == 'create') {
                    var currTime = new Date().getTime();
                    if (objType != 'text' && whBoard.tool.cmd != 't_clearall') {
                        var currTransformState = vcan.getStates('currentTransform');
                        if (currTransformState == "" || currTransformState == null) {
                            //	if(!ev.detail.hasOwnProperty('cevent') && objType != 'freeDrawing'){
                            if (!ev.detail.hasOwnProperty('cevent')) {
                                //var currTime = new Date().getTime();
                                vcan.calculatePackets(currTime, 'd', tool.startPosX, tool.startPosY);
                            }
                            tool.started = true;
                        }
                    } else {
                        whBoard.obj.drawTextObj.muser = false;
                        if (!ev.detail.hasOwnProperty('cevent') && whBoard.tool.cmd != 't_clearall') { //creating for other browser
                            if (whBoard.utility.clickOutSidebox(whBoard.obj.drawTextObj.textWriteMode)) {
                                vcan.calculatePackets(currTime, 'd', tool.startPosX, tool.startPosY);
                            }
                        } else {
                            whBoard.obj.drawTextObj.muser = true;
                        }

                        if (ev.detail.hasOwnProperty('cevent')) {
                            if (ev.detail.cevent.hasOwnProperty('mtext')) {
                                whBoard.obj.drawTextObj.textUtility(tool.startPosX, tool.startPosY, ev.detail.cevent.mtext);
                            } else {
                                whBoard.obj.drawTextObj.textUtility(tool.startPosX, tool.startPosY);
                            }
                        } else {
                            whBoard.obj.drawTextObj.textUtility(tool.startPosX, tool.startPosY);
                        }
                    }
                }

                if (objType == 'freeDrawing' && whBoard.obj.freeDrawObj.freesvg == true) {
                    whBoard.obj.freeDrawObj.drawStart(ev);
                }
            };


            //  This function is called every time you move the mouse. Obviously, it only 
            //  draws if the tool.started state is set to true (when you are holding down the mouse button).

            /**
             * This function does create the particular object when user has already been
             * started to draw, at the same time the function made the information eg: creation time about parituclar
             * object and stored drawn object into replayObjs array   
             * @param expects mousemove event
             */
            tool.mousemove = function(ev, mouseup) {
                if (ev.detail.hasOwnProperty('cevent')) {

                    ev.clientX = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
                    ev.clientY = ev.detail.cevent.y + (whBoard.vcan.main.offset.y);
                    ev.x = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
                    ev.y = ev.detail.cevent.x + (whBoard.vcan.main.offset.y);
                    ev.pageX = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
                    ev.pageY = ev.detail.cevent.y + (whBoard.vcan.main.offset.y);
                    ev.currX = ev.detail.cevent.x;
                    ev.currY = ev.detail.cevent.y;
                }
                if (tool.started && whBoard.tool.cmd != 't_clearall') { //command code inserted after found the problem
                    //this function should be conveted into appended with freedrawing module 
                    if (whBoard.obj.freeDrawObj != undefined && whBoard.obj.freeDrawObj.freesvg == true) {
                        if (whBoard.obj.freeDrawObj.fdObj.isCurrentlyDrawing) {
                            whBoard.obj.freeDrawObj.wb_draw(ev);

                            if (!ev.detail.hasOwnProperty('cevent')) {
                                if (typeof mouseup == 'undefined') {
                                    if (((typeof lastmousemovetime == 'undefined') || (lastmousemovetime == null))) {
                                        lastmousemovetime = new Date().getTime();
                                        vcan.calculatePackets(lastmousemovetime, 'm', ev.currX, ev.currY);
                                    }
                                }


                                var currTime = new Date().getTime();
                                var obj = vcan.makeStackObj(currTime, 'm', ev.currX, ev.currY);
                                dataChunk.push(obj);


                                if (typeof mouseup == 'undefined') {
                                    presentmousemovetime = new Date().getTime();
                                    if ((presentmousemovetime - lastmousemovetime) >= 2000) {	 // Optimized
                                        for (var i = 0; i < dataChunk.length; i++) {
                                            whBoard.uid++;
                                            dataChunk[i].uid = whBoard.uid;
                                            vcan.main.replayObjs.push(dataChunk[i]);
                                        }

                                        vm_chat.send({'repObj': dataChunk});
                                        whBoard.utility.updateSentPackets(dataChunk);

                                        localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
                                        dataChunk = [];
                                        lastmousemovetime = new Date().getTime();
                                    }
                                }

                            }

                            return;
                        }
                    } else {
                        endPosX = ev.currX;
                        endPosY = ev.currY;

                        if (whBoard.prvObj != '') {
                            whBoard.canvas.removeObject(whBoard.prvObj);
                        }

                        var currObject = whBoard.makeobj(tool.startPosX, tool.startPosY, endPosX, endPosY, objType);
                        var rCurrObject = whBoard.canvas.readyObject(currObject);
                        whBoard.canvas.addObject(rCurrObject);
                        rCurrObject.coreObj.usrCurrAction = 'create';

                        var currTime = new Date().getTime();

                        if ((typeof lastmousemovetime == 'undefined') || (lastmousemovetime == null)) {
                            lastmousemovetime = new Date().getTime();
                            if (!ev.detail.hasOwnProperty('cevent') && objType != 'text' && whBoard.tool.cmd != 't_clearall') {
                                vcan.calculatePackets(currTime, 'm', endPosX, endPosY);
                            }
                        }
                        presentmousemovetime = new Date().getTime();

                        if ((presentmousemovetime - lastmousemovetime) >= 2000) { // Optimized
                            if (!ev.detail.hasOwnProperty('cevent') && objType != 'text' && whBoard.tool.cmd != 't_clearall') {
                                vcan.calculatePackets(currTime, 'm', endPosX, endPosY);
                            }
                            lastmousemovetime = new Date().getTime();
                        }

                        /**** 
                         *
                         * This would I have disbaled can be critical
                         * whBoard.replay.replayObjs.push(currObject);
                         *
                         ****/


                        whBoard.prvObj = rCurrObject.coreObj;

                    }
                } else {
                    if (whBoard.vcan.main.action != 'move' || ((vcan.main.currentTransform == "" || vcan.main.currentTransform == null) && whBoard.vcan.main.action == "move")) {
                        vm_chat.send({'createArrow': true, x: ev.currX, y: ev.currY});
                    }

                }
            };



            /**
             *  This function does finalize the object 
             *  with last made object very specail
             */
            tool.mouseup = function(ev, cobj) {

                if (ev.detail.hasOwnProperty('cevent')) {
                    ev.clientX = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
                    ev.clientY = ev.detail.cevent.y + (whBoard.vcan.main.offset.y);
                    ev.x = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
                    ev.y = ev.detail.cevent.x + (whBoard.vcan.main.offset.y);
                    ev.pageX = ev.detail.cevent.x + (whBoard.vcan.main.offset.x);
                    ev.pageY = ev.detail.cevent.y + (whBoard.vcan.main.offset.y);
                    ev.currX = ev.detail.cevent.x;
                    ev.currY = ev.detail.cevent.y;
                }


                endPosX = ev.currX;
                endPosY = ev.currY;

                lastmousemovetime = null;
                if (tool.started && objType != 'text') {
                    tool.mousemove(ev, 'up');

                    if (!ev.detail.hasOwnProperty('cevent') && objType != 'freeDrawing') {
                        var currTime = new Date().getTime();
                        vcan.calculatePackets(currTime, 'u', endPosX, endPosY);
                    }

                    //if(vcan.main.freesvg == true ){

                    if ((whBoard.obj.freeDrawObj != undefined && whBoard.obj.freeDrawObj.freesvg == true)) {
                        if (whBoard.obj.freeDrawObj.fdObj.isCurrentlyDrawing) {
                            whBoard.obj.freeDrawObj.finalizeDraw(ev);
                        }

                        if (!ev.detail.hasOwnProperty('cevent')) {
                            if (dataChunk.length > 0) {
                                var currTime = new Date().getTime();
                                var obj = vcan.makeStackObj(currTime, 'u', endPosX, endPosY);
                                //vcan.main.replayObjs.push(obj);

                                dataChunk.push(obj);

                                for (var i = 0; i < dataChunk.length; i++) {
                                    whBoard.uid++;
                                    dataChunk[i].uid = whBoard.uid;
                                    vcan.main.replayObjs.push(dataChunk[i]);
                                }

                                vm_chat.send({'repObj': dataChunk});
                                localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
                                whBoard.utility.updateSentPackets(dataChunk);
                                dataChunk = [];
                            }
                        }
                    }

                    if (whBoard.prvObj != '') {
                        whBoard.prvObj = ""; //this should be into proper way
                    }

                    whBoard.prvObj = "";
                    tool.started = false;
                }

//			  if(whBoard.vcan.wb.sentPack == true) {
                if (whBoard.vcan.wb.sentPack) {
                    whBoard.vcan.wb.sentPack = false;
                }
            };
        }
    }
)(window);