//var sumCount = 0;
var vm_chat = {
    cfg: {},
    sock: null,
    wsuri: null,
    response: {},
    auth: false,
    error: null,
    uniquesids: null,
    init: function(cfg, callback) {
        this.cfg = cfg;
        this.wsconnect();
    },
    wsconnect: function() {
        //alert('smran');
        //console.log('simran');
        vm_chat.wsuri = "wss://" + this.cfg.rid;
        //console.log(vm_chat.wsuri);
        if ("WebSocket" in window) {
            this.sock = new WebSocket(vm_chat.wsuri);
        } else if ("MozWebSocket" in window) {
            this.sock = new MozWebSocket(vm_chat.wsuri);
        } else {
            console.log("Browser does not support WebSocket!");
            //window.location = "http://autobahn.ws/unsupportedbrowser";
            this.error = "Browser does not support WebSocket!"
        }
        var scope = this;
        this.sock.onopen = function(e) {
            $.event.trigger({
                type: "connectionopen"
                        //repObjs : localStorage.repObjs
                        //type: "connectionopen"
            });
            //authenticate user
            scope.userauthenticat();

            // user join chat room
            scope.addclient();
        }

        this.sock.onmessage = function(e) {

            //console.log("MSG : Connected to " + vm_chat.wsuri);
            //try{

            //var r1 = JSON.parse(e.data, vm_chat.functionReviver);
            var r1 = JSON.parse(e.data);
            //r1.
            //console.log(r1);

            if (r1.type == "joinroom") {

                /* identifying new user from list*/
                var newuser = null;
                if (scope.uniquesids != null) {
                    $.each(r1.clientids, function(i, v) {
                        if (scope.uniquesids[i] == undefined) {
                            newuser = i;
                        }
                    });
                }

                //alert('I am there');

                scope.uniquesids = r1.clientids;
                //update users
                $.event.trigger({
                    type: "member_added",
                    message: r1.users,
                    newuser: newuser
                });
            }
            if (r1.type == "broadcast") {
                var userto = '';
                if (r1.userto != undefined)
                    userto = r1.userto;
                $.event.trigger({
                    type: "newmessage",
                    message: r1.m,
                    fromUser: r1.user,
                    toUser: userto
                });
            }
            if (r1.type == "userleft") {
                console.log("user logout");
                var userto = '';
                if (r1.userto != undefined)
                    userto = r1.userto;
                delete scope.uniquesids[r1.user.userid];

                $.event.trigger({
                    type: "user_logout",
                    fromUser: r1.user,
                    message: 'offline',
                    toUser: userto
                });

                //this.update_userstatus(r1.user,'remove');
            }

            if (r1.type == "leftroom") {
                console.log("member_removed");
                $.event.trigger({
                    type: "member_removed",
                    message: r1.users
                });
            }
            if (r1.type == "Unauthenticated") {
                console.log("Unauthenticated user");
                //alert('Unauthenticated user');		
            }
//			}catch(e){
//				console.log("Error   : "+e);
//				return;
//			} 
        }

        this.sock.onerror = function(e) {
            scope.error = e;
        }
        this.sock.onclose = function(e) {
            $.event.trigger({
                type: "connectionclose",
                message: e.reason
            });
            console.log("Connection closed (wasClean = " + e.wasClean + ", code = " + e.code + ", reason = '" + e.reason + "')");
            setTimeout(function() {
                scope.wsconnect()
            }, 5000);
        }
    },
    userauthenticat: function() { //alert('auth');
        console.log('Start Auth');
        var obj = {
            cfun: 'authenticate',
            arg: {'authuser': this.cfg.authuser, 'authpass': this.cfg.authpass}
        }
        var jobj = JSON.stringify(obj);

        this.sock.send(jobj);
    },
    addclient: function() { //alert('add client');
        //alert('mere bhai');
        var obj = {
            cfun: 'joinroom',
            arg: {'client': this.cfg.userid, 'roomname': this.cfg.fastchatroom_name, 'user': this.cfg.userobj}
        }
        var jobj = JSON.stringify(obj);
        this.sock.send(jobj);
    },
    send: function(msg) {
        //	alert('hi brother');
        var obj = {
            cfun: 'broadcast',
            arg: {'msg': msg}

        }

        if (arguments.length > 1) {
            var uid = arguments[1];// user id to  whom msg in indented
            obj.arg.touser = this.uniquesids[uid];
        }

        /**
         * TODO vm_chat.functionReplacer function can be removed
         * if we remove the function from object.function,
         * this statement is need only for free drawing object
         * other objects than free drawing working well
         */

        var jobj = JSON.stringify(obj);

        // Case for createArrow LIMIT every 500ms
        if (msg.hasOwnProperty('createArrow')) {

            if (typeof optimizObj == 'undefined') {
                optimizObj = optimization(); //new operand should be attached with optimization()
            } else {
                optimizObj.sendPacketWithOptimization(jobj, this.sock, 100);
            }
        } else {
            whBoard.sentPackets = whBoard.sentPackets + jobj.length;
            if (this.sock.readyState == 1) {
                this.sock.send(jobj);
            }

            //TODO this should be enable
            var tempObj = JSON.parse(jobj);
            if (tempObj.arg.msg.hasOwnProperty('repObj')) {
                vm_chat.updateSentInformation(jobj);
            }
        }
        localStorage.sentPackets = whBoard.sentPackets;
    },
    disconnect: function() {
        this.sock.onclose = function() {
        };
        this.sock.close();
    },
    updateSentInformation: function(jobj, createArrow) {
        if (whBoard.utility.chkValueInLocalStorage('orginalTeacherId')) {
            var sentObj = JSON.parse(jobj);
            if (typeof createArrow != 'undefined') {
                var msg = sentObj.arg.msg;
            } else {
                var msg = sentObj.arg.msg.repObj[0];
            }

            var compMsg = "";
            for (var key in msg) {
                compMsg += key + " : " + msg[key] + " <br />";
            }
            document.getElementById('sentMsgInfo').innerHTML = compMsg;
        }
    }
};

//var updateSentInformation  = function (jobj){
//	var sentObj = JSON.parse(jobj);
//	var msg = sentObj.arg.msg.repObj[0];
//	var compMsg = "";
//	for(var key in msg){
//		compMsg += key " : " + msg[key] + " <br />";
//	}
//	
//	document.getElementById('sentMsgInfo').innerHTML = compMsg;
//}
