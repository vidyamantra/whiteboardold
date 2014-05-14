(
    function(window) {
        window.onload = function() {
            var whBoard = window.whBoard;
            whBoard.keyBoard = {
                prvTool: "",
                skey: false,
                /**
                 * this function triggers the activeAll function 
                 */
                triggerActiveAll: function(e) {
                    if (e.shiftKey) {
                        console.log('what happend mere bhai');
                        whBoard.keyBoard.skey = true;
                        whBoard.keyBoard.prvTool = whBoard.tool.cmd;
                        whBoard.toolInit('t_activeall');
                        var currTime = new Date().getTime();

                        //var obj = {'cmd':'t_activeall', mdTime : currTime};
                        var obj = {'cmd': 't_activeall', mt: currTime};
                        vcan.main.replayObjs.push(obj);
                        vm_chat.send({'repObj': [obj]}); //after optimized
                        whBoard.vcan.main.action = 'move';
                    }
                },
                /**
                 * this function triggers the deActiveAll function 
                 */
                triggerdeActiveAll: function(e) {
                    if (whBoard.keyBoard.skey) {
                        console.log('what happend mere bhai ddd');
                        var currTime = new Date().getTime();
                        whBoard.utility.deActiveFrmDragDrop();
                        whBoard.toolInit(whBoard.keyBoard.prvTool);
                        //var obj = {'cmd': whBoard.keyBoard.prvTool,  mdTime : currTime};
                        var obj = {'cmd': whBoard.keyBoard.prvTool, mt: currTime};
                        vcan.main.replayObjs.push(obj);
                        vm_chat.send({'repObj': [obj]}); //after optimized
                    }
                }
            }

            // this is used for demo only 
            // todo should be into seprate file
            var vm_chat = window.vm_chat;
            function connectionOpen() {
                vm_chat.wsconnect();
            }

            function connectionOff() {
                vm_chat.disconnect();
            }

        }
})(window);
