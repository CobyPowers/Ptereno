export type MethodType = "GET" | "POST" | "DELETE" | "PUT" | "PATCH";

export enum Method {
  GET = "GET",
  POST = "POST",
  DELETE = "DELETE",
  PUT = "PUT",
  PATCH = "PATCH",
}

export enum ContentType {
  JSON = "application/json",
  PLAIN = "text/plain",
  FORM = "multipart/form-data",
}

export interface RequestOptions {
  body?: any;
  query?: Record<string, string | string[]>;
  params?: Array<string>;
  type?: string;
}
