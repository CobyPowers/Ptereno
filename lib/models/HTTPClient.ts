import PteroError from "../errors/PteroError.ts";

import { ContentType, MethodType, RequestOptions } from "../types/http.ts";

import { path } from "../../deps.ts";

export default class HTTPClient {
  private endpoint: string;

  /**
   * Creates a new HTTP client for handling requests.
   *
   * @param {string} endpoint The HTTP endpoint
   * @param {string} api_token The API token
   */
  constructor(endpoint: string, private api_token: string) {
    this.endpoint = path.join(endpoint, "/api");
  }

  /**
   * Makes an HTTP request to a specific endpoint.
   *
   * @param {MethodType} method The request method
   * @param {string} url The request url
   * @param {RequestOptions} options The request options
   */
  async request<T = null>(
    method: MethodType,
    url: string,
    options?: RequestOptions,
  ): Promise<T> {
    let query = options?.query || {};

    if (options?.params) {
      query["include"] = options?.params;
    }

    const body = JSON.stringify(options?.body);
    // @ts-ignore
    const queryStr = new URLSearchParams(query).toString();
    const type = options?.type || ContentType.JSON;

    url = path.join(this.endpoint, url, "?" + queryStr);

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": type,
        Authorization: "Bearer " + this.api_token,
      },
      method,
      redirect: "follow",
      body,
    });

    if (res.body) {
      const json = await res.json();

      if (!res.ok) {
        throw new PteroError("An error was returned from the API.", json);
      }

      return json;
    } else {
      if (!res.ok) throw new PteroError("An unknown error has occured.");

      return null!;
    }
  }
}
