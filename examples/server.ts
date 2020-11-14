import { Application } from "../mod.ts";

const app = new Application("<URL>", "<TOKEN>");

/**
 * This would be how you create a server.
 *
 * Some fields will have a default value and intellisense
 * should give them to you, assuming your editor supports them.
 */
app
  .createServer({
    name: "Among Us",
    user: 0,
    description: "An Among Us server to play with friends.",
    start: false,
    node: 0,
    allocation: 0,
    limits: {
      memory: 512,
      disk: 512,
    },
    egg: 0,
    image: "quay.io/pterodactyl/core:java",
    startup: "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
    environment: {
      GITHUB_PACKAGE: "AeonLucid/Imposter",
      VERSION: "latest",
      MATCH: "Impostor-Server-linux-x64.zip",
    },
  })
  .then((server) => {
    console.log(server);
  })
  .catch((err) => {
    console.error(err);
  });
