<p align="center">
  <img width="250" src="https://alanexei.dev/ptereno.png">
</p>
<h1 align="center">Ptereno</h1>
<p align="center">An efficient and fully compliant Pterodactyl API wrapper.</p>

<br />

> The library is currently in release candidate phase, you may use this library in production but expect bugs.
> If you encounter any issues, please make an issue or a pull request.

# Why Ptereno?

Ptereno provides all the tools you need to manage your Pterodactyl instances.
With full coverage over all client/application endpoints, you can access and
modify any data, as well as manage realtime events through websockets.

# Features

- Full coverage for all client/application routes
- WebSockets for handling realtime server events
- Type-strict responses

# Breakdown

> It is recommended that you have a basic understanding of your panel before
> you decide to use this library.

In Pterodactyl, there are 2 possible API route groupings which are represented
with their respective classes (`Client` and `Application`).

The client is a collection of endpoints for managing your panel from a client
account. The data from these endpoints only provide what you need to _manage_
your servers and your account. (You can create API keys here:
https://pterodactyl.app/account/api)

The application is for administrative-specific endpoints. The application routes
require more fine-tuned access and contains more information about servers, eggs,
nests, nodes, and other structures. (You can create API keys here:
https://pterodactyl.app/admin/api)

# Documentation

> If you find any issues with the library, please make a new issue or pull request.

Currently, there is no official documentation, but you can always use the
[deno documentation generator](https://doc.deno.land/https/deno.land/x/ptereno/mod.ts).

# Examples

Below are a few basic examples, but you can find the rest [here](https://github.com/Alanexei/Ptereno/tree/master/examples).

## Client

The example below shows a how to get information from the client account.

```ts
import { Client } from "https://deno.land/x/ptereno@1.0.0/mod.ts";

const client = new Client("<URL>", "<TOKEN>");

const account = await client.getAccount();

console.log(account);
//  {
//    id: 0,
//    admin: true,
//    username: "Alanexei",
//    email: "alan@alanexei.dev",
//    first_name: "Alan",
//    last_name: "Dev",
//    language: "en"
//  }
```

## Application

The example below shows how you can get user information from an application.

```ts
import { Application } from "https://deno.land/x/ptereno@1.0.0/mod.ts";

const app = new Application("<URL>", "<TOKEN>");

const user = await app.getUser(0);

console.log(user);
//  {
//    id: 0,
//    external_id: null,
//    uuid: "ABCDEFGH-1234-5678-9012-ABCDEFGHIJKL",
//    username: "Alanexei",
//    email: "alan@alanexei.dev",
//    first_name: "Alan",
//    last_name: "Dev",
//    language: "en",
//    root_admin: true,
//    2fa: true,
//    created_at: "1970-01-01T00:00:00.000Z",
//    updated_at: "1970-01-01T00:00:00.000Z"
//  }
```

## Sockets

The example below demonstrates the server socket system.

```ts
import { Client } from "https://deno.land/x/ptereno@1.0.0/mod.ts";

const client = new Client("<URL>", "<TOKEN>");
const ws = client.joinServerSocket("<SERVER>");

ws.on("open", () => {
  console.log("Socket Open");
});

ws.on("close" (code, reason) => {
  console.log(`Socket Closed - ${code} ${reason}`);
});

ws.on("output", (msg) => {
  console.log(msg);
});
```

# Disclaimer

The contributors of Ptereno are not responsible for any damage you cause
on your Pterodactyl instances. Be cautious of certain endpoints, as for some
can cause severe damage.

All credit for the logo elements go to Deno and Pterodactyl; however, this
library has no affiliation with either source.
