/** 
 * 
 */
(
    function(window, document) {
        var vm_chat = window.vm_chat;
        var i = 0;
        /**
         * This is the main object which has properties and methods
         * Through this properties and methods all the front stuff is happening
         * eg:- creating, storing and replaying the objects 
         */
        var whBoard = {
            tool: '',
            obj: {},
            prvObj: '',
            replayTime: 0,
            sentPackets: 0,
            sentPackDiv: 'sentPacket',
            sentPackDivPS: 'sentPacketPS',
            receivedPackets: 0,
            receivedPackDiv: 'receivedNumber',
            receivedPackDivPS: 'receivedNumberPS',
            uid: 0,
            lt: '',
            commandToolsWrapperId: 'commandToolsWrapper',
            //these are top level object
            error: [],
            view: {}, // For display important message to user
            lang: {},
            system: {},
            gObj: {}, // For store the global oject
            bridge: {},
            user: {},
            /**
             * This function basically does create the canvas on which 
             * the user draws the various object
             * @param window the function gets the window object as parameter
             *    
             */
            init: function() {
                whBoard.vcan = window.vcan; //this would be done because of possibility of conflict
                var vcan = whBoard.vcan;
                whBoard.canvas = vcan.create('#canvas');
                var canvasObj = vcan.main.canvas;
                canvasObj.setAttribute('tabindex', '0');  //this does for set chrome
                canvasObj.focus();

                //IMPORTANT  this is changed during the UNIT testing
                //onkeydown event is working into all browser 
                //canvasObj.addEventListener("keydown", whBoard.utility.keyOperation, true);
                canvasObj.onkeydown = whBoard.utility.keyOperation;

                //window.addEventListener('resize', whBoard.resizeCanvas, false);
                //whBoard.setCanvasDimension(vcan.main.canvas);
                whBoard.system.setCanvasDimension();
//				vcan.main.canvas.width = 930;
//				vcan.main.canvas.height = 700;

                if (typeof (Storage) !== "undefined") {
                    if (localStorage.repObjs) {
                        var replayObjs = JSON.parse(localStorage.repObjs);
                        if (replayObjs.length > 0) {
                            //vcan.main.replayObjs = replayObjs;
                            //whBoard.toolInit('t_replay');
                        }
                    }

                    window.whBoard = whBoard;
                }

                this.arrowInit();
                var oldData = whBoard.sentPackets;
                setInterval(function() {
                    if (document.getElementById(whBoard.sentPackDivPS) != null) {
                        oldData = whBoard.utility.calcPsSentPackets(oldData);
                        document.getElementById(whBoard.sentPackDiv).innerHTML = whBoard.sentPackets;  //update total packets
                    }


                }, 1000);

            },
            /**
             * this function called the image function
             * for initialize the arrow
             */
            arrowInit: function() {
                this.arrImg = new Image();
                this.arrImg.src = 'arrow.png';
                this.arrImgDraw = false;
                var wb = this;
                this.arrImg.onload = function() {
                    wb.arrImgDraw = true;
                };
            },
            /**
             * this function does create the command interface  
             */
            createCommand: function() {

                var alreadyCreated = whBoard.utility.alreadyExistToolBar();
                if (alreadyCreated) {
                    return true;
                }

                var cmdToolsWrapper = document.createElement('div');
                //cmdToolsWrapper.id = 'commandToolsWrapper';
                cmdToolsWrapper.id = whBoard.commandToolsWrapperId;

                //var canvasElem = document.getElementById(vcan.canvasWrapperId);
                var canvasElem = document.getElementById(vcan.canvasWrapperId);

                if (canvasElem != null) {
                    //alert(cmdToolsWrapper.id);
                    document.getElementById('containerWb').insertBefore(cmdToolsWrapper, canvasElem);
                } else {
                    document.getElementById('containerWb').appendChild(cmdToolsWrapper);
                }
                //	document.getElementById('containerWb').appendChild(cmdToolsWrapper);


                whBoard.createDiv('t_rectangle', 'rectangle', cmdToolsWrapper, 'tool');
                whBoard.createDiv('t_line', 'line', cmdToolsWrapper, 'tool');
                whBoard.createDiv('t_freeDrawing', 'freeDrawing', cmdToolsWrapper, 'tool');
                whBoard.createDiv('t_oval', 'oval', cmdToolsWrapper, 'tool');
                whBoard.createDiv('t_triangle', 'triangle', cmdToolsWrapper, 'tool');
                whBoard.createDiv('t_text', 'text', cmdToolsWrapper, 'tool');
                //whBoard.createDiv('t_replay', 'replay', cmdToolsWrapper);
                whBoard.createDiv('t_activeall', 'activeAll', cmdToolsWrapper, 'tool');
                whBoard.createDiv('t_clearall', 'clearAll', cmdToolsWrapper, 'tool');
                //whBoard.createDiv('t_userCon', 'clearAll', cmdToolsWrapper);


                //var	cmdToolsWrapper2  = document.createElement('div');
                //cmdToolsWrapper.id = 'commandToolsWrapper2';

                whBoard.createDiv('t_connect', 'conn', cmdToolsWrapper, 'controlCmd coff');
                whBoard.createDiv('t_assign', 'assign', cmdToolsWrapper, 'controlCmd');

                whBoard.socketOn = parseInt(wbUser.socketOn);


                if (whBoard.socketOn == 1) {
                    whBoard.createDiv('t_connectionoff', 'connectionOff', cmdToolsWrapper, 'controlCmd');
                    whBoard.createDiv('t_connectionon', 'connectionOn', cmdToolsWrapper, 'controlCmd');
                    whBoard.utility.setClass('vcanvas', 'socketon');
                }
            },
            /**
             * this function does create the div
             * toolId expect id for command
             * text expects the text used for particular command
             */
            createDiv: function(toolId, text, cmdToolsWrapper, cmdClass) {
                var ancTag = document.createElement('a');
                ancTag.href = '#';

                var lDiv = document.createElement('div');
                lDiv.id = toolId;
                if (typeof cmdClass != 'undefined') {
                    lDiv.className = cmdClass;
                }

                var imgTag = document.createElement('img');
                imgTag.alt = whBoard.lang.getString(text);
                //imgTag.title = whBoard.lang.getString(text);
                imgTag.src = 'images/' + text + ".png";
                ancTag.appendChild(imgTag);

                ancTag.title = '';
                ancTag.dataset.title = text;
                ancTag.className = 'tooltip';



                lDiv.appendChild(ancTag);

                cmdToolsWrapper.appendChild(lDiv);
                //debugger;
                var canvasElem = document.getElementById(vcan.canvasWrapperId);

            },
            /**
             * this funciton does create the canvas
             */
            createCanvas: function() {
                var cmdToolsWrapper = document.createElement('div');
                //cmdToolsWrapper.id = 'canvasWrapper';
                cmdToolsWrapper.id = vcan.canvasWrapperId;
                vcan.canvasWrapperId = cmdToolsWrapper.id;
                var canvas = document.createElement('canvas');
                canvas.id = 'canvas';
                canvas.innerHTML = 'Canvas is missing in your browsers. Please update the latest version of your browser';
                cmdToolsWrapper.appendChild(canvas);
                document.getElementById('containerWb').appendChild(cmdToolsWrapper);
            },
            setCanvasDimension: function(canvas) {

            },
            /**
             * this does call the initializer function for particular object    
             * @param expects the mouse down event.
             */
            objInit: function(evt) {
                if (whBoard.user.connected) {
                    var anchorNode = this;

                    /**important **/

                    if (anchorNode.parentNode.id == 't_replay') {
                        whBoard.utility.clearAll(false);
                        vm_chat.send({'replayAll': true});
                    } else {
                        whBoard.toolInit(anchorNode.parentNode.id);
                    }

                    if (anchorNode.parentNode.id != 't_replay' && anchorNode.parentNode.id != 't_clearall'
                            && anchorNode.parentNode.id != 't_reclaim' && anchorNode.parentNode.id != 't_assign'
                            && anchorNode.parentNode.id != 't_connectionoff' && anchorNode.parentNode.id != 't_connectionon') {

                        var currTime = new Date().getTime();
                        //var obj = {'cmd':anchorNode.parentNode.id, mdTime : currTime};
                        whBoard.lt = anchorNode.parentNode.id;
                        var obj = {'cmd': anchorNode.parentNode.id, mt: currTime};
                        whBoard.uid++;
                        console.log('uid ' + ' ' + whBoard.uid);
                        obj.uid = whBoard.uid;
                        vcan.main.replayObjs.push(obj);
                        vm_chat.send({'repObj': [obj]}); //after optimized
                    }
                } else {
                    alert(whBoard.lang.getString('askForConnect'));
                }
            },
            /**
             * 
             * This function does attach the handlers by click the particular object
             * would be triggered eg:- if user click on rectangle link then rectangle
             * object would triggered for create the rectangle object
             * @param id expects the  id of container which contains all the commands of div
             */
            attachToolFunction: function(id, alreadyCreated) {
                //console.log('suman bogati my name');
                vcan.canvasWrapperId = 'canvasWrapper';

                whBoard.createCommand(alreadyCreated);
                if (typeof alreadyCreated == 'undefined') {
                    if (document.getElementById('canvas') == null) {
                        whBoard.createCanvas();
                    }
                    //	whBoard.createPacketContainer();
                    // whBoard.createPacketInfoContainer();
                    var orginalTeacherId = whBoard.utility.chkValueInLocalStorage('orginalTeacherId');
                    whBoard.dataInfo = parseInt(wbUser.dataInfo);
                    if (orginalTeacherId && whBoard.dataInfo == 1) {
                        if (!whBoard.utility.alreadyExistPacketContainer()) {
                            whBoard.createPacketContainer();
                            whBoard.createPacketInfoContainer();
                            whBoard.utility.initStoredPacketsNumbers();
                        }
                    }
                }


                var allDivs = document.getElementById(id).getElementsByTagName('div');
                for (var i = 0; i < allDivs.length; i++) {

                    //TODO this will have to be fixed as it always assigned t_clearall
                    //whBoard.currComId = allDivs[i].id; 
                    //allDivs[i].getElementsByTagName('a')[0].addEventListener('click', whBoard.objInit, true);
                    //IMPORTANT this is changed during the UNIT testing

                    //allDivs[i].getElementsByTagName('a')[0].onclick = whBoard.objInit;
                    allDivs[i].getElementsByTagName('a')[0].addEventListener('click', whBoard.objInit);
                    //allDivs[i].getElementsByTagName('a')[0].addEventListener('mouseover', whBoard.view.dispToolTip);

                }
            },
            /**
             * By this method the particular function would be initialize
             * eg: if the user click on replay button then  the 'replay' function would initialize   
             * @param cmd expects the particular command from user
             * 
             */
            toolInit: function(cmd, repMode, multiuser, myfunc) {
                if (typeof whBoard.obj.drawTextObj == 'object' && whBoard.obj.drawTextObj.wmode == true) {
                    var ctx = vcan.main.canvas.getContext('2d');
                }


                var allChilds = whBoard.vcan.getStates('children');

                //added after raised by bugs
                if (allChilds.length > 0 && cmd != 't_clearall') {
                    //	if(typeof multiuser == 'undefined' || cmd != 't_replay'){
                    if (typeof multiuser == 'undefined' || cmd != 't_replay') {
                        whBoard.utility.deActiveFrmDragDrop(); //after optimization NOTE:- this should have to be enable
                    }
                    if (multiuser != true && cmd != 't_replay') {
                        whBoard.vcan.renderAll();
                    }
                    //whBoard.vcan.renderAll();
                }
                if (!whBoard.utility.IsObjEmpty(whBoard.obj.freeDrawObj && multiuser == false)) {
                    whBoard.obj.freeDrawObj.freesvg = false;
                }

                whBoard.vcan.main.currUserCommand = cmd + 'Init';

                if (cmd == 't_activeall') {
                    whBoard.utility.t_activeallInit();
                }


                if (cmd == 't_replay') {
                    if (typeof multiuser == 'undefined') {
                        vcan.setValInMain('id', 0);
                    }
                    if (typeof myfunc != 'undefined') {
                        whBoard.t_replayInit(repMode, myfunc);
                    } else {
                        whBoard.t_replayInit(repMode);
                    }
                }


                if (cmd == 't_clearall') {
                    //whBoard.utility.t_clearallInit();

                }
                if (cmd == 't_clearall') {
                    var userInput = confirm(whBoard.lang.getString('clearAllWarnMessage'));
                    if (!userInput) {
                        return;
                    }
                    whBoard.utility.t_clearallInit();
                    whBoard.utility.makeDefaultValue();
                    vm_chat.send({'clearAll': true});
                }

                if (cmd == 't_assign') {
                    whBoard.utility.assignRole();
                    var toolHeight = localStorage.getItem('toolHeight');
                    if (toolHeight != null) {
                        vm_chat.send({'assignRole': true, 'toolHeight': toolHeight, 'socket': whBoard.socketOn});
                    } else {
                        vm_chat.send({'assignRole': true, 'socket': whBoard.socketOn});
                    }

                }

                if (cmd == 't_reclaim') {
                    //alert('ss');
                    whBoard.utility.reclaimRole();
                    whBoard.utility.sendRequest('reclaimRole', true);
                }

                if (cmd == 't_connectionoff') {
                    whBoard.utility.connectionOff();
                }

                if (cmd == 't_connectionon') {
                    whBoard.utility.connectionOn();
                }

                //alert(cmd);
                //if(cmd != 't_activeall' && cmd != 't_replay' && cmd != 't_clearallInit'){
                if (cmd != 't_activeall' && cmd != 't_replay' && cmd != 't_clearallInit' && cmd != 't_assign'
                        && cmd != 't_reclaim' && cmd != 't_connectionoff' && cmd != 't_connectionon') {
                    whBoard.tool = new whBoard.tool_obj(cmd)
                    whBoard.utility.attachEventHandlers();
                }
            },
            /**
             * The object would be created at core level 
             * rectangle object would created  in case of creating the rectangle
             * @param the cmd expects one of the object that user can draw
             * text and free draw are different case than other object
             */
            tool_obj: function(cmd) {
                this.cmd = cmd;
                //when other objecti 
                if (cmd != 't_freeDrawing') {
                    whBoard.obj.freeDrawObj = "";
                }

                if (cmd != 't_text') {
                    whBoard.obj.drawTextObj = "";
                }

                if (cmd == 't_freeDrawing') {
                    //NOTE:- this is added during the UNIT testing
                    var borderColor = "#424240";
                    var linWidth = "3";
                    whBoard.obj.freeDrawObj = new whBoard.readyFreeHandObj(borderColor, linWidth);
                    whBoard.obj.freeDrawObj.init();

                    //below line is commented out during unit testing
                    //whBoard.vcan.main.mcanvas = whBoard.canvas; //TODO this should be control because it is used inside the

                } else if (cmd == 't_text') {
                    whBoard.obj.drawTextObj = new whBoard.readyTextObj();
                    whBoard.obj.drawTextObj.init("canvasWrapper");
                }

                var mCmd = cmd.slice(2, cmd.length);

                whBoard.draw_object(mCmd, whBoard.canvas, this)
            },
            /**
             * This function does initiates replay function after click on replay button 
             * it replays all the object the user would drawn 
             */
            t_replayInit: function(repMode, myfunc) {
                // TODO this should be enable 
                // renderObjText();
                whBoard.replay = whBoard._replay();
                whBoard.replay.init(repMode);

                if (typeof myfunc != 'undefined') {
                    whBoard.replay.renderObj(myfunc);
                } else {
                    whBoard.replay.renderObj();
                }
            }
        };

    window.whBoard = whBoard;
})(window, document);
