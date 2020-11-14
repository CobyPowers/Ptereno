export enum WebSocketState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export interface WebSocketOptions {
  /**
   * The headers to establish the connection with.
   */
  headers?: Headers;
  /**
   * Whether or not to reconnect after an error.
   *
   * @default true
   */
  reconnect?: boolean;
  /**
   * The delay in milliseconds between each reconnection attempt.
   *
   * Only applies when reconnections are enabled.
   *
   * @default 5000
   */
  reconnectDelay?: number;
  /**
   * The number of times the websocket can reconnect before failing.
   *
   * Only applies when reconnections are enabled.
   *
   * @default 60
   */
  retries?: number;
}
