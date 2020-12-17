import HTTPClient from "./HTTPClient.ts";

import {
  AllocationList,
  AllocationParameters,
  Database,
  DatabaseList,
  DatabaseParameters,
  Egg,
  EggList,
  EggParameters,
  Location,
  LocationList,
  LocationParameters,
  Nest,
  NestList,
  NestParameters,
  NewAllocationOptions,
  NewDatabase,
  NewDatabaseOptions,
  NewLocation,
  NewLocationOptions,
  NewNode,
  NewNodeOptions,
  NewServerOptions,
  NewUser,
  NewUserOptions,
  Node,
  NodeConfiguration,
  NodeList,
  NodeParameters,
  Server,
  ServerList,
  ServerParameters,
  UpdateLocationOptions,
  UpdateServerBuildOptions,
  UpdateServerDetailsOptions,
  UpdateServerStartupOptions,
  UpdateUserOptions,
  User,
  UserList,
  UserParameters,
} from "../types/application.ts";
import { Method } from "../types/http.ts";

export default class Application {
  private http: HTTPClient;

  /**
   * Represents a Pterodactyl application object, used for automating application requests.
   *
   * @param endpoint The panel endpoint
   * @param api_token The auth token
   */
  constructor(public endpoint: string, api_token: string) {
    this.http = new HTTPClient(endpoint, api_token);
  }

  /**
   * Retrieves a list of users.
   * 
   * @param {UserParameters} [params] The user parameters
   */
  async getUsers(params?: UserParameters) {
    return await this.http.request<UserList>(
      Method.GET,
      "/application/users",
      {
        params,
      },
    );
  }

  /**
   * Retrieves a user.
   * 
   * @param {number} id The user id 
   * @param {UserParameters} [params] The user parameters
   */
  async getUser(id: number, params?: UserParameters) {
    return (await this.http.request<User>(
      Method.GET,
      `/application/users/${id}`,
      {
        params,
      },
    )).attributes;
  }

  /**
   * Retrieves a user based on an external id.
   * 
   * @param {string} externalID The external user id
   * @param {UserParameters} [params] The user parameters
   */
  async getExternalUser(externalID: string, params?: UserParameters) {
    return (await this.http.request<User>(
      Method.GET,
      `/application/users/external/${externalID}`,
      {
        params,
      },
    )).attributes;
  }

  /**
   * Creates a new user.
   */
  async createUser(
    { email, username, firstName, lastName, language, admin, password }:
      NewUserOptions,
  ) {
    return await this.http.request<NewUser>(
      Method.POST,
      "/application/users",
      {
        body: {
          email,
          username,
          first_name: firstName,
          last_name: lastName,
          language,
          root_admin: admin,
          password,
        },
      },
    );
  }

  /**
   * Updates a user.
   * 
   * @param {number} id The user id
   */
  async updateUser(
    id: number,
    { email, username, firstName, lastName, language, admin, password }:
      UpdateUserOptions,
  ) {
    return await this.http.request<NewUser>(
      Method.PATCH,
      `/application/users/${id}`,
      {
        body: {
          email,
          username,
          first_name: firstName,
          last_name: lastName,
          language,
          root_admin: admin,
          password,
        },
      },
    );
  }

  /**
   * Deletes a user.
   * 
   * @param {number} id The user id
   */
  async deleteUser(id: number) {
    await this.http.request(
      Method.DELETE,
      `/application/users/${id}`,
    );
  }

  /**
   * Retrieves a list of node allocations.
   * 
   * @param {number} node The node id
   * @param {AllocationParameters} [params] The allocation parameters
   */
  async getAllocations(node: number, params?: AllocationParameters) {
    return await this.http.request<AllocationList>(
      Method.GET,
      `/application/nodes/${node}/allocations`,
      {
        params,
      },
    );
  }

  /**
   * Creates a new allocation.
   * 
   * If more than one port is provided, multiple allocations will be created.
   * 
   * @param {number} node The node id
   * @param {NewAllocationOptions} options The allocation options
   */
  async createAllocation(
    node: number,
    options: NewAllocationOptions,
  ) {
    await this.http.request(
      Method.POST,
      `/application/nodes/${node}/allocations`,
      {
        body: options,
      },
    );
  }

  /**
   * Deletes an allocation.
   * 
   * @param {number} node The node id
   * @param {number} id The allocation id
   */
  async deleteAllocation(node: number, id: number) {
    await this.http.request(
      Method.DELETE,
      `/application/nodes/${node}/allocations/${id}`,
    );
  }

  /**
   * Retrieves a list of nodes.
   * 
   * @param {NodeParameters} [params] The node parameters
   */
  async getNodes(params?: NodeParameters) {
    return await this.http.request<NodeList>(
      Method.GET,
      "/application/nodes",
      {
        params,
      },
    );
  }

  /**
   * Retrieves information about a node.
   * 
   * @param {number} id The node id
   * @param {NodeParameters} [params] The node parameters
   */
  async getNode(id: number, params?: NodeParameters) {
    return (await this.http.request<Node>(
      Method.GET,
      `/application/nodes/${id}`,
      {
        params,
      },
    )).attributes;
  }

  /**
   * Retrieves a specific node configuration.
   * 
   * @param {number} id The node id
   */
  async getNodeConfiguration(id: number) {
    return this.http.request<NodeConfiguration>(
      Method.GET,
      `/application/nodes/${id}/configuration`,
    );
  }

  /**
   * Creates a new node.
   */
  async createNode(
    {
      name,
      description,
      locationID,
      visibility,
      fqdn,
      scheme,
      proxy,
      memory,
      memoryOverallocate,
      disk,
      diskOverallocate,
      uploadSize,
      daemonBase,
      daemonSFTP,
      daemonListen,
    }: NewNodeOptions,
  ) {
    return await this.http.request<NewNode>(
      Method.POST,
      "/application/node",
      {
        body: {
          name,
          description,
          location_id: locationID,
          public: visibility === "public",
          fqdn,
          scheme,
          behind_proxy: proxy || false,
          memory,
          memory_overallocate: memoryOverallocate || 0,
          disk,
          disk_overallocate: diskOverallocate || 0,
          upload_size: uploadSize || 100,
          daemon_base: daemonBase,
          daemon_sftp: daemonSFTP || 2022,
          daemon_listen: daemonListen || 8080,
        },
      },
    );
  }

  /**
   * Updates a node.
   * 
   * @param {number} id The node id
   */
  async updateNode(id: number, {
    name,
    description,
    locationID,
    visibility,
    fqdn,
    scheme,
    proxy,
    memory,
    memoryOverallocate,
    disk,
    diskOverallocate,
    uploadSize,
    daemonBase,
    daemonSFTP,
    daemonListen,
  }: NewNodeOptions) {
    return await this.http.request<NewNode>(
      Method.PATCH,
      `/application/node/${id}`,
      {
        body: {
          name,
          description,
          location_id: locationID,
          public: visibility === "public",
          fqdn,
          scheme,
          proxy,
          memory,
          memory_overallocate: memoryOverallocate,
          disk,
          disk_overallocate: diskOverallocate,
          upload_size: uploadSize,
          daemon_base: daemonBase,
          daemon_sftp: daemonSFTP,
          daemon_listen: daemonListen,
        },
      },
    );
  }

  /**
   * Deletes a node.
   * 
   * @param {number} id The node id
   */
  async deleteNode(id: number) {
    await this.http.request(
      Method.DELETE,
      `/application/nodes/${id}`,
    );
  }

  /**
   * Retrieves a list of locations.
   * 
   * @param {LocationParameters} [params] The location parameters
   */
  async getLocations(params?: LocationParameters) {
    return await this.http.request<LocationList>(
      Method.GET,
      "/aplication/locations",
      {
        params,
      },
    );
  }

  /**
   * Retrieves details for a specific location.
   * 
   * @param {number} id The location id
   * @param {LocationParameters} [params] The location parameters
   */
  async getLocation(id: number, params?: LocationParameters) {
    return (await this.http.request<Location>(
      Method.GET,
      `/application/locations/${id}`,
      {
        params,
      },
    )).attributes;
  }

  /**
   * Creates a new location.
   * 
   * @param {NewLocationOptions} options The location options
   */
  async createLocation(options: NewLocationOptions) {
    return await this.http.request<NewLocation>(
      Method.POST,
      "/application/locations",
      {
        body: options,
      },
    );
  }

  /**
   * Updates a specific location.
   * 
   * @param {number} id The location id
   * @param {UpdateLocationOptions} options The location options
   */
  async updateLocation(id: number, options: UpdateLocationOptions) {
    return (await this.http.request<Location>(
      Method.PATCH,
      `/application/locations/${id}`,
      {
        body: options,
      },
    )).attributes;
  }

  /**
 * Deletes a specific location.
 * 
 * @param {number} id The location id
 */
  async deleteLocation(id: number) {
    await this.http.request(
      Method.DELETE,
      `/application/location/${id}`,
    );
  }

  /**
   * Retrieves a list of server databases.
   * 
   * @param {number} server The server id
   * @param {DatabaseParameters} [params] The database parameters
   */
  async getDatabases(server: number, params?: DatabaseParameters) {
    return (await this.http.request<DatabaseList>(
      Method.GET,
      `/application/servers/${server}/databases`,
      {
        params,
      },
    )).data;
  }

  /**
   * Retrieves a specific server database.
   * 
   * @param {number} server The server id
   * @param {number} id The database id
   * @param {DatabaseParameters} [params] The database parameters
   */
  async getDatabase(server: number, id: number, params?: DatabaseParameters) {
    return (await this.http.request<Database>(
      Method.GET,
      `/application/servers/${server}/databases/${id}`,
      {
        params,
      },
    )).attributes;
  }

  /**
   * Creates a new server database.
   * 
   * @param {number} id The server id
   */
  async createDatabase(
    id: number,
    { host, name, remote, maxConnections }: NewDatabaseOptions,
  ) {
    return await this.http.request<NewDatabase>(
      Method.POST,
      `/application/servers/${id}/databases`,
      {
        body: {
          host,
          database: name,
          remote: remote || "%",
          max_connections: maxConnections,
        },
      },
    );
  }

  /**
   * Resets the password on a specific server database.
   * 
   * @param {number} server The server id
   * @param {number} id The database id
   */
  async rotateDatabasePWD(server: number, id: number) {
    await this.http.request(
      Method.POST,
      `/application/servers/${server}/databases/${id}/reset-password`,
    );
  }

  /**
   * Deletes a server database.
   * 
   * @param {number} server The server id
   * @param {number} id The database id
   */
  async deleteDatabase(server: number, id: number) {
    await this.http.request(
      Method.DELETE,
      `/application/servers/${server}/databases/${id}`,
    );
  }

  /**
   * Retrieves a list of servers.
   */
  async getServers() {
    return await this.http.request<ServerList>(
      Method.GET,
      "/application/servers",
    );
  }

  /**
   * Retrieves information for a given server.
   * 
   * @param {number} id The server id
   * @param {ServerParameters} [params]
   */
  async getServer(id: number, params?: ServerParameters) {
    return (await this.http.request<Server>(
      Method.GET,
      `/application/servers/${id}`,
      {
        params,
      },
    )).attributes;
  }

  /**
   * Retrieves information for a given server by external id.
   * 
   * @param {string} id The external server id
   * @param {ServerParameters} [params] The server parameters
   */
  async getExternalServer(id: string, params?: ServerParameters) {
    return (await this.http.request<Server>(
      Method.GET,
      `/appliation/servers/external/${id}`,
      {
        params,
      },
    )).attributes;
  }

  /**
   * Updates details for a specific server.
   * 
   * @param {number} id The server id
   */
  async updateServerDetails(
    id: number,
    { name, description, user, externalID }: UpdateServerDetailsOptions,
  ) {
    return (await this.http.request<Server>(
      Method.PATCH,
      `/application/servers/${id}/details`,
      {
        body: {
          name,
          description,
          user,
          external_id: externalID,
        },
      },
    )).attributes;
  }

  /**
   * Updates build information for a specific server.
   * 
   * @param {number} id The server id
   */
  async updateServerBuild(id: number, {
    allocation,
    memory,
    swap,
    io,
    cpu,
    disk,
    threads,
    oom,
    feature_limits,
    addAllocations,
    removeAllocations,
  }: UpdateServerBuildOptions) {
    return (await this.http.request<Server>(
      Method.PATCH,
      `/application/servers/${id}/build`,
      {
        body: {
          allocation,
          memory,
          swap,
          io,
          cpu,
          disk,
          threads,
          oom_disabled: oom ? !oom : undefined,
          feature_limits,
          add_allocations: addAllocations,
          remove_allocations: removeAllocations,
        },
      },
    )).attributes;
  }

  /**
   * Updates startup configuration for a specific server.
   * 
   * @param {number} id The server id
   */
  async updateServerStartup(id: number, {
    startup,
    environment,
    egg,
    image,
    skipScripts,
  }: UpdateServerStartupOptions) {
    return (await this.http.request<Server>(
      Method.PATCH,
      `/application/servers/${id}/startup`,
      {
        body: {
          startup,
          environment,
          egg,
          image,
          skip_scripts: skipScripts || false,
        },
      },
    )).attributes;
  }

  /**
   * Creates a new server.
   */
  async createServer({
    name,
    user,
    description,
    start,
    node,
    allocation,
    additionalAllocations,
    featureLimits,
    limits,
    egg,
    skipScripts,
    image,
    startup,
    environment,
  }: NewServerOptions) {
    return (await this.http.request<Server>(
      Method.POST,
      "/application/servers",
      {
        body: {
          name,
          user,
          description,
          start_on_completion: start,
          node,
          allocation: {
            default: allocation,
            additional: additionalAllocations,
          },
          feature_limits: {
            allocations: featureLimits?.allocation || 0,
            backups: featureLimits?.backups || 0,
            databases: featureLimits?.databases || 0,
          },
          limits: {
            ...limits,
            cpu: limits.cpu || 0,
            swap: limits.swap || 0,
            io: limits.io || 500,
          },
          egg,
          skip_scripts: skipScripts,
          docker_image: image,
          startup,
          environment,
        },
      },
    )).attributes;
  }

  /**
   * Suspends a server.
   * 
   * @param {number} id The server id
   */
  async suspendServer(id: number) {
    await this.http.request(
      Method.POST,
      `/application/servers/${id}/suspend`,
    );
  }

  /**
   * Unsuspends a server.
   * 
   * @param {number} id The server id
   */
  async unsuspendServer(id: number) {
    await this.http.request(
      Method.POST,
      `/application/servers/${id}/unsuspend`,
    );
  }

  /**
   * Triggers a server to reinstall.
   * 
   * WARNING: This can potentially delete preexisting server files,
   * use this method with caution.
   * 
   * @param {number} id The server id
   */
  async reinstallServer(id: number) {
    await this.http.request(
      Method.POST,
      `/application/servers/${id}/reinstall`,
    );
  }

  /**
   * Safely deletes a server.
   * 
   * @param {number} id The server id
   */
  async deleteServer(id: number) {
    await this.http.request(
      Method.DELETE,
      `/application/servers/${id}`,
    );
  }

  /**
   * ForcefullY deletes a server.
   * 
   * This method may leave dangling files if an error is encountered.
   * 
   * @param {number} id The server id
   */
  async forceDeleteServer(id: number) {
    await this.http.request(
      Method.DELETE,
      `/application/servers/${id}/force`,
    );
  }

  /**
   * Retrieves a list of eggs.
   * 
   * @param {numbers} nest The nest id
   * @param {EggParameters} [params] The egg parameters
   */
  async getEggs(nest: number, params?: EggParameters) {
    return (await this.http.request<EggList>(
      Method.GET,
      `/application/nests/${nest}/eggs`,
      {
        params,
      },
    )).data;
  }

  /**
   * Retrieves information for a given egg.
   * 
   * @param {numbers} nest The nest id
   * @param {numbers} id The egg id
   * @param {EggParameters} [params] The egg parameters
   */
  async getEgg(nest: number, id: number, params?: EggParameters) {
    return (await this.http.request<Egg>(
      Method.GET,
      `/application/nests/${nest}/eggs/${id}`,
      {
        params,
      },
    )).attributes;
  }

  /**
   * Retrieves a list of nests.
   * 
   * @param {NestParameters} [param] The nest parameters
   */
  async getNests(params?: NestParameters) {
    return await this.http.request<NestList>(
      Method.GET,
      "/application/nests",
      {
        params,
      },
    );
  }

  /**
   * Retrieves information for a given nest.
   * 
   * @param {number} id The nest id
   * @param {NestParameters} [params] The nest parameters
   */
  async getNest(id: number, params?: NestParameters) {
    return (await this.http.request<Nest>(
      Method.GET,
      `/application/nests/${id}`,
      {
        params,
      },
    )).attributes;
  }
}
