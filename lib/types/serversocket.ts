export type InstallStateType = "started" | "completed";

export enum InstallState {
  STARTED = "started",
  COMPLETED = "completed",
}

export type SocketIntentType = "stats" | "logs";

export enum SocketIntent {
  STATS = "stats",
  LOGS = "logs",
}

export interface SocketEvent<A = string> {
  event: string;
  args: Array<A>;
}

export interface SocketOptions {
  /**
   * The list of intents to use.
   *
   * NOTICE: This currently has no internal use and will have no effect.
   *
   * @default [SocketIntent.STATS, SocketIntent.LOGS]
   */
  intents?: Array<SocketIntent>;
  /**
   * Automatically reconnects after a connection dies.
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
