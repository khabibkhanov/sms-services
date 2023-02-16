const { WebSocket } = require("ws");
const url = "ws:localhost:8080";
const ws = new WebSocket(url);

ws.on('open', () =>
{
    ws.send(`{"authorize"}`);
});


module.exports.ws = ws;