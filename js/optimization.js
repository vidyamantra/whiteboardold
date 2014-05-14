var optimization = function(socket, time) {
    return {
        socket: socket,
        time: time,
        sendPacketWithOptimization: function(jobj, socket, time) {
            if (typeof this.lastarrowtime == 'undefined') {
                this.lastarrowtime = new Date().getTime();

                whBoard.sentPackets = whBoard.sentPackets + jobj.length;

                if (socket.readyState == 1) {
                    socket.send(jobj);
                }

                vm_chat.updateSentInformation(jobj, true);
            }

            this.presentarrowtime = new Date().getTime();

            if ((this.presentarrowtime - this.lastarrowtime) >= time) {
                whBoard.sentPackets = whBoard.sentPackets + jobj.length;
                if (socket.readyState == 1) {
                    socket.send(jobj);
                }

                vm_chat.updateSentInformation(jobj, true);
                this.lastarrowtime = new Date().getTime();
            }
        }
    }
}

vcan.doOptiMize = function(e) {
    if (((typeof lastmousemovetime == 'undefined') || (lastmousemovetime == null))) {
        lastmousemovetime = new Date().getTime();
        if (!e.detail.hasOwnProperty('cevent')) {
            vcan.calculatePackets(lastmousemovetime, 'm', e.clientX, e.clientY);
        }
    }

    presentmousemovetime = new Date().getTime();

    if ((presentmousemovetime - lastmousemovetime) >= 2000) {	 // Optimized
        var currTime = new Date().getTime();
        if (!e.detail.hasOwnProperty('cevent')) {
            vcan.calculatePackets(lastmousemovetime, 'm', e.clientX, e.clientY);
        }
        vcan.calculatePackets(currTime, 'm', e.clientX, e.clientY);
        lastmousemovetime = new Date().getTime();
    }
}

vcan.calculatePackets = function(time, ac, x, y) {
    var obj = vcan.makeStackObj(time, ac, x, y);
    whBoard.uid++;
    obj.uid = whBoard.uid;
    vcan.main.replayObjs.push(obj);
    vm_chat.send({'repObj': [obj]});
    localStorage.repObjs = JSON.stringify(vcan.main.replayObjs);
    whBoard.utility.updateSentPackets(obj);

}
