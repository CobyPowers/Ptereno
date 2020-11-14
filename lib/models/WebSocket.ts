import WebSocketError from "../errors/WebSocketError.ts";

import { WebSocketState, WebSocketOptions } from "../types/websocket.ts";

import {
  connectWebSocket,
  EventEmitter,
  isWebSocketCloseEvent,
  isWebSocketPingEvent,
  isWebSocketPongEvent,
} from "../../deps.ts";

import type { STDWebSocket } from "../../deps.ts";

export declare interface WebSocket {
  on<K extends keyof WebSocketEventMap>(
    event: K,
    callback: WebSocketEventMap[K]
  ): this;
  once<K extends keyof WebSocketEventMap>(
    event: K,
    callback: WebSocketEventMap[K]
  ): this;
  /**
   * Fired when a message is received.
   */
  on<T = string>(event: "message", callback: (msg: T) => void): this;
  once<T = string>(event: "message", callback: (msg: T) => void): this;
}

interface WebSocketEventMap {
  /**
   * Fired when the websocket opens.
   */
  open: () => void;
  /**
   * Fired when the websocket closes.
   */
  close: (code: number, reason?: string) => void;
  /**
   * Fired after the websocket attempts to reconnect.
   */
  reconnect: (retries: number) => void;
  /**
   * Fired when an error is encountered.
   */
  error: (error: Error) => void;
  /**
   * Fired when a ping event is received.
   */
  ping: (msg: string | Uint8Array) => void;
  /**
   * Fired when a pong event is received.
   */
  pong: (msg: string | Uint8Array) => void;
}

export class WebSocket extends EventEmitter {
  private headers?: Headers;
  private reconnectable: boolean;
  private reconnectDelay: number;
  private maxRetries: number;
  private retries: number = 0;

  private ws!: STDWebSocket;
  state: WebSocketState = WebSocketState.CONNECTING;

  /**
   * Prepares a new websocket connection.
   *
   * @param {string} endpoint The websocket endpoint
   * @param {WebSocketOptions} [options] The websocket options.
   */
  constructor(private endpoint: string, options?: WebSocketOptions) {
    super();

    this.headers = options?.headers;
    this.reconnectable = options?.reconnect || true;
    this.reconnectDelay = options?.reconnectDelay || 5000;
    this.maxRetries = options?.retries || 60;

    this.createSocket();
  }

  /**
   * Creates a new websocket connection.
   */
  private createSocket() {
    this.state = WebSocketState.CONNECTING;
    connectWebSocket(this.endpoint, this.headers)
      .then((ws) => this.open(ws))
      .catch(this.onConnError.bind(this));
  }

  /**
   * Fired when the websocket encounters an error during connection.
   *
   * @param {Error} err The websocket error
   */
  private onConnError(err: Error) {
    if (!this.reconnectable) {
      return this.emit("error", err);
    }

    this.attemptReconnect();
  }

  /**
   * Fired when the websocket fails to parse a received message.
   *
   * @param {Error} err The websocket error
   */
  private async onRecvError(err: Error) {
    if (!this.ws.isClosed) {
      await this.ws.close(1000);
    }

    this.emit("error", err);
  }

  /**
   * Takes an open websocket connection and handles it.
   *
   * @param {STDWebSocket} ws The open websocket
   */
  private async open(ws: STDWebSocket) {
    this.ws = ws;
    this.state = WebSocketState.OPEN;

    this.retries = 0;

    this.emit("open");

    try {
      for await (const ev of ws) {
        if (typeof ev === "string") {
          this.emit("message", JSON.parse(ev));
        } else if (ev instanceof Uint8Array) {
          this.emit("message", ev);
        } else if (isWebSocketCloseEvent(ev)) {
          const { code, reason } = ev;

          this.state = WebSocketState.CLOSED;
          this.emit("close", code, reason);
        } else if (isWebSocketPingEvent(ev)) {
          const [, body] = ev;

          this.emit("ping", body);
        } else if (isWebSocketPongEvent(ev)) {
          const [, body] = ev;

          this.emit("pong", body);
        }
      }

      if (!this.isUnavailable) {
        this.state = WebSocketState.CLOSED;
        this.emit("close", 1006, "The connection was dropped unexpectedly.");
        this.attemptReconnect();
      }
    } catch (err) {
      this.onRecvError(err);
    }
  }

  /**
   * Closes the websocket connection.
   *
   * @param {number} [code] The close code
   * @param {string} [reason] The close reason
   */
  async close(code: number = 1000, reason?: string) {
    if (this.isUnavailable) return;

    await this.ws.close(code, reason!);
    this.state = WebSocketState.CLOSED;
    this.emit("close", code, reason);
  }

  /**
   * Forcefully closes the websocket connection.
   */
  closeForce() {
    if (this.isUnavailable) return;

    this.ws.closeForce();
    this.state = WebSocketState.CLOSED;
    this.emit("close");
  }

  /**
   * Used internally to reconnect a dead or errored connection.
   */
  private attemptReconnect() {
    if (!this.reconnectable) {
      return;
    }

    if (this.retries >= this.maxRetries) {
      return this.emit(
        "error",
        new WebSocketError(
          `Failed to connect to the daemon after ${this.retries} retries.`
        )
      );
    }

    setTimeout(() => {
      this.retries++;
      this.emit("reconnect", this.retries);
      this.createSocket();
    }, this.reconnectDelay);
  }

  /**
   * Sends a message to the websocket.
   *
   * @param {string} message The message payload
   */
  async send(message: string | Uint8Array) {
    if (this.state !== WebSocketState.OPEN) {
      throw new WebSocketError(
        "WebSocket attempted to send message while unavailable."
      );
    }
    await this.ws.send(message);
  }

  /**
   * Pings the server with a provided message.
   *
   * @param message The ping message
   */
  async ping(message?: string | Uint8Array) {
    if (this.isUnavailable) return;

    await this.ws.ping(message);
  }

  /**
   * Returns the closure status of the websocket.
   */
  get isClosed() {
    return this.ws ? this.ws.isClosed : true;
  }

  /**
   * Returns the unavailability of the websocket.
   */
  get isUnavailable() {
    return this.state !== WebSocketState.OPEN;
  }
}
