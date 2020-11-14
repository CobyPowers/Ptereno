import Client from "./Client.ts";

import { WebSocket } from "./WebSocket.ts";

import WebSocketError from "../errors/WebSocketError.ts";

import { ServerStats } from "../types/client.ts";
import {
  InstallStateType,
  SocketEvent,
  SocketIntent,
  SocketIntentType,
  SocketOptions,
} from "../types/serversocket.ts";
import { WebSocketOptions } from "../types/websocket.ts";

import { EventEmitter } from "../../deps.ts";

export declare interface ServerSocket {
  on<K extends keyof ServerSocketEventMap>(
    event: K,
    callback: ServerSocketEventMap[K]
  ): this;
  once<K extends keyof ServerSocketEventMap>(
    event: K,
    callback: ServerSocketEventMap[K]
  ): this;
}

interface ServerSocketEventMap {
  /**
   * Fired when the socket is opened.
   */
  open: () => void;
  /**
   * Fired when the socket closes.
   */
  close: (code: number, reason?: string) => void;
  /**
   * Fired when the socket begins to reconnect.
   */
  reconnect: (retries: number) => void;
  /**
   * Fired when the socket encounters an error.
   */
  error: (error: Error) => void;
  /**
   * Fired when the socket has been authenticated.
   */
  ready: () => void;
  /**
   * Fired when the server power state changes.
   */
  state: (status: string) => void;
  /**
   * Fired when the socket receives server statistics.
   */
  stats: (stats: ServerStats) => void;
  /**
   * Fired when any output is received.
   */
  output: (msg: string) => void;
  /**
   * Fired exclusively when console output is received.
   */
  console_output: (msg: string) => void;
  /**
   * Fired exclusively when daemon output is received.
   */
  daemon_output: (msg: string) => void;
  /**
   * Fired exclusively when install output is recieved.
   */
  install_output: (msg: string) => void;
  /**
   * Fired when the server install state changes.
   */
  install_state: (state: InstallStateType) => void;
}

export class ServerSocket extends EventEmitter {
  private intents?: Array<SocketIntentType>;

  private ws!: WebSocket;

  endpoint!: string;
  token!: string;

  /**
   * Establishes a websocket connection with the Pterodactyl daemon.
   *
   * If no intents are passed, all intents will be used.
   *
   * @param {Client} client The client object
   * @param {string} server The server uuid
   * @param {SocketOptions} [options] The socket options
   */
  constructor(
    private client: Client,
    private server: string,
    private options?: SocketOptions
  ) {
    super();
    this.intents = options?.intents || [SocketIntent.STATS, SocketIntent.LOGS];

    this.connect();
  }

  /**
   * Prepares a connection to the Pterodactyl daemon.
   */
  async connect() {
    const details = await this.client.getServerSocket(this.server);

    this.endpoint = details.socket;
    this.token = details.token;

    const headers = new Headers({
      Origin: this.client.endpoint,
    });

    const options: WebSocketOptions = {
      ...this.options,
      headers,
    };

    const ws = (this.ws = new WebSocket(this.endpoint, options));

    ws.on("open", this.onOpen.bind(this));
    ws.on("close", this.onClose.bind(this));
    ws.on("reconnect", this.onReconnect.bind(this));
    ws.on<SocketEvent>("message", this.onMessage.bind(this));
    ws.on("error", this.onError.bind(this));
  }

  /**
   * Reconnects to the daemon and prepares a new connection.
   *
   * @param {number} [code] The close code
   * @param {string} [reason] The close reason
   */
  async reconnect(
    code: number = 1000,
    reason: string = "WebSocket reconnection was requested."
  ) {
    if (!this.ws.isClosed) {
      await this.close(code, reason);
    }

    this.emit("reconnect", 0);

    await this.connect();
  }

  /**
   * Fired when the websocket opens.
   */
  private async onOpen() {
    await this.sendAuth();

    this.once("ready", async () => {
      await this.sendIntents();
    });

    this.emit("open");
  }

  /**
   * Fired when the websocket is closed.
   *
   * @param {number} code The close code
   * @param {string} [reason] The close reason
   */
  private onClose(code: number, reason?: string) {
    this.emit("close", code, reason);
  }

  /**
   * Fired when the websocket attempts to reconnect.
   *
   * @param {number} retries The number of attempts that have been made
   */
  private onReconnect(retries: number) {
    this.emit("reconnect", retries);
  }

  /**
   * Fired when a message is received from the server.
   *
   * @param {SocketEvent} data The socket data received from the websocket.
   */
  private async onMessage(data: SocketEvent) {
    switch (data.event) {
      case "auth success":
        this.emit("ready");
        break;
      case "jwt error":
        this.emit(
          "error",
          new WebSocketError("Failed to authenticate with the daemon.")
        );
        await this.reconnect(1006, "Failed to authenticate with the daemon.");
        break;
      case "status":
        this.emit("state", data.args[0]);
        break;
      case "stats":
        this.emit("stats", JSON.parse(data.args[0]));
        break;
      case "console output":
      case "daemon message":
      case "install output":
        this.emit(data.event, data.args[0]);
        this.emit("output", data.args[0]);
        break;
      case "install started":
      case "install completed":
        this.emit("install_state", data.event.split(" ")[1]);
        break;
      case "token expiring": // heartbeat
        await this.sendAuth();
        break;
    }
  }

  /**
   * Fired when the websocket encounters an error.
   *
   * @param {Error} err The socket error
   */
  private onError(err: Error) {
    this.emit("error", err);
  }

  /**
   * Closes the socket connection.
   *
   * @param {number} [code] The close code
   * @param {string} [reason] The close reason
   */
  async close(code?: number, reason?: string) {
    await this.ws.close(code, reason);
  }

  /**
   * Closes the socket connection without sending a close frame.
   *
   * Use this method with caution.
   */
  forceClose() {
    this.ws.closeForce();
  }

  /**
   * Sends socket data through the websocket.
   *
   * @param {SocketEvent<any>} payload The socket payload
   */
  private async send(payload: SocketEvent<any>) {
    await this.ws.send(JSON.stringify(payload));
  }

  /**
   * Authorizes the connection with the websocket.
   *
   * If no token is passed, a new token will be automatically
   * fetched.
   *
   * @param {string} [token] The authentication token
   */
  private async sendAuth(token?: string) {
    if (!token) {
      token = await this.getNewToken();
    }
    this.token = token;

    const payload: SocketEvent = {
      event: "auth",
      args: [token],
    };

    await this.send(payload);
  }

  /**
   * Sends intents through the websocket indicating
   * what events the user chooses to capture.
   */
  private async sendIntents() {
    if (this.intents) {
      for (let intent of this.intents) {
        const payload: SocketEvent<null> = {
          event: "send " + intent,
          args: [null],
        };

        await this.send(payload);
      }
    }
  }

  /**
   * Retrieves a new token from the API.
   */
  private async getNewToken() {
    const details = await this.client.getServerSocket(this.server);
    return details.token;
  }

  /**
   * Returns the state of the websocket.
   */
  get getState() {
    return this.ws.state;
  }
}
