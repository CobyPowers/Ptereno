import { Client, SocketIntent } from "../mod.ts";

const client = new Client("<URL>", "<TOKEN>");

/**
 * This is how you would create a server websocket connection.
 *
 * All of the server options aren't required.
 *
 * Socket intents are sent to signal the server that you
 * want specific data.
 *
 * Currently the daemon does not handle these special intents,
 * so these may only be useful in the future.
 */
const ws = await client.joinServerSocket("<SERVER>", {
  intents: [SocketIntent.LOGS, SocketIntent.STATS],
  reconnect: true,
  reconnectDelay: 5000,
  retries: 60,
});

ws.on("open", async () => {
  console.log("WebSocket Open");
});

ws.on("close", (code, reason?) => {
  console.log(`WebSocket Closed - ${code} ${reason}`);
});

ws.on("error", (err) => {
  console.error("An unknown error has occured!");
  console.error(err);
});

ws.on("output", async (msg) => {
  console.log(msg);
});

ws.on("stats", (stats) => {
  console.log("Server Stats", stats);
});

ws.on("reconnect", (retries) => {
  console.log(`WebSocket Reconnecting (${retries})`);
});
