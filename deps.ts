export * as path from "https://deno.land/std@0.77.0/path/mod.ts";

export { EventEmitter } from "https://deno.land/std@0.77.0/node/events.ts";

/**
 * Version `0.68.0` is being used for a custom websocket client.
 *
 * The new websocket client does not allow for custom headers.
 */
export {
  connectWebSocket,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
  isWebSocketPongEvent,
} from "https://deno.land/std@0.68.0/ws/mod.ts";

export type { WebSocket as STDWebSocket } from "https://deno.land/std@0.68.0/ws/mod.ts";
