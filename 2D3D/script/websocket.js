var host = "wss://mapa-ws.herokuapp.com/";
var wsh = null;

var messagesWaiting = [];
var messagesSent = [];
var messagesReceived = [];

var ws = {
      start: function () {
           wsh = new WebSocket(host);
           wsh.onopen = function (e) {
                $("#server-info").html("CONNECTED&nbsp;"+
                "<i class=\"fa-solid fa-lock\"></i>");
                for (var k in messagesWaiting) {
                     wsh.send(messagesWaiting[k]);
                };
                messagesWaiting = [];
           };
           wsh.onclose = function(e) {
                $("#server-info").html("DISCONNECTED&nbsp;"+
                "<i class=\"fa-solid fa-lock-open\"></i>");
                ws.start();
           };
           wsh.onmessage = function(e) {
                ws.onmessage(e);
                messagesReceived.push(
                     e.data.split("|").slice(0,6).join("|"));
           };
      },
      send: function (e) {
           if (wsh.readyState == 1) {
               wsh.send(e);
               messagesSent.push(
                     e.split("|").slice(0,7).join("|"));
           }
           else { messagesWaiting.push(e); }
      },
      onmessage: function (e) { },
      tempo: 0
};
ws.start();