import { Application } from "../mod.ts";

const app = new Application("<URL>", "<TOKEN>");

/**
 * The `app.getUsers()` route will return an array of `User` objects.
 */
console.log("All Users", await app.getUsers());

/**
 * This example is the same as the one above, with the difference that
 * each `User` object contains a `Server` object for each server that they
 * own. The tree can be visualized as such: `Users<UserList>[0].relationships?.servers<ServerList>`
 *
 * These "additional options" are called parameters, and they provide additional
 * information about the object. All parameters can be accessed through the
 * `relationships` property in the case of a single object, object lists
 * require you to index them first before you can access it.
 */
console.log("All Users (With Server Data)", await app.getUsers(["servers"]));
