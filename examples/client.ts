import { Client } from "../mod.ts";

const client = new Client("<URL>", "<TOKEN>");

/**
 * These both retrieve basic information about the account associated
 * with the bearer token.
 *
 * Like the application example, some methods have optional parameters.
 */
console.log("Account Details", await client.getAccount());
console.log("API Keys", await client.getAPIKeys());
