export type SchemeType = "https" | "http";

export enum Scheme {
  HTTPS = "https",
  HTTP = "http",
}

export type VisibilityType = "public" | "private";

export enum Visibility {
  PUBLIC = "public",
  PRIVATE = "private",
}

/* Generic */

export interface PaginationMeta {
  pagination: Pagination;
}

export interface Pagination {
  total: number;
  count: number;
  per_page: number;
  current_page: number;
  total_pages: number;
  links: {};
}

/* Users */

export type MetalessUserList = Omit<UserList, "meta">;

export interface UserList {
  object: "list";
  data: Array<User>;
  meta: PaginationMeta;
}

export interface User {
  object: "user";
  attributes: UserAttributes;
}

export interface UserAttributes {
  id: number;
  external_id: string | null;
  uuid: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
  root_admin: boolean;
  "2fa": boolean;
  created_at: string;
  updated_at: string;
  relationships?: {
    servers?: MetalessServerList; // parameter option: servers
  };
}

export interface NewUser extends User {
  meta: {
    resource: string;
  };
}

/* SubUsers */

export interface SubUserList {
  object: "list";
  data: Array<SubUser>;
}

export interface SubUser {
  object: "subuser";
  attributes: SubUserAttributes;
}

export interface SubUserAttributes {
  id: number;
  user_id: number;
  server_id: number;
  permissions: Array<string>;
  created_at: string;
  updated_at: string;
}

/* Allocations */

export interface AllocationList {
  object: "list";
  data: Array<Allocation>;
  meta: PaginationMeta;
}

export interface Allocation {
  object: "allocation";
  attributes: AllocationAttributes;
}

export interface AllocationAttributes {
  id: number;
  ip: string;
  alias: string | null;
  port: number;
  notes: string | null;
  assigned: boolean;
  relationships?: {
    node?: Node; // parameter option: node
    server?: Server; // parameter option: node
  };
}

/* Nodes */

export type MetalessNodeList = Omit<NodeList, "meta">;

export interface NodeList {
  object: "list";
  data: Array<Node>;
  meta: PaginationMeta;
}

export interface Node {
  object: "node";
  attributes: NodeAttributes;
}

export interface NodeAttributes {
  id: number;
  uuid: string;
  public: boolean;
  name: string;
  description: string;
  location_id: number;
  fqdn: string;
  scheme: string;
  behind_proxy: boolean;
  maintenance_mode: boolean;
  memory: number;
  memory_overallocate: number;
  disk: number;
  disk_overallocate: number;
  upload_size: number;
  daemon_listen: number;
  daemon_sftp: number;
  daemon_base: string;
  created_at: string;
  updated_at: string;
  allocated_resources: {
    memory: number;
    disk: number;
  };
  relationships?: {
    allocations?: AllocationList; // parameter option: allocations
    location?: Location; // parameter option: location
    servers?: MetalessServerList; // parameter option: servers
  };
}

export interface NewNode extends Node {
  meta: {
    resource: string;
  };
}

export interface NodeConfiguration {
  debug: boolean;
  uuid: string;
  token_id: string;
  token: string;
  api: {
    host: string;
    port: number;
    ssl: {
      enabled: boolean;
      cert: string;
      key: string;
    };
    upload_limit: number;
  };
  system: {
    data: string;
    sftp: {
      bind_port: number;
    };
  };
  allowed_mounts: Array<string>;
  remote: string;
}

/* Locations */

export type MetalessLocationList = Omit<LocationList, "meta">;

export interface LocationList {
  object: "list";
  data: Array<Location>;
  meta: PaginationMeta;
}

export interface Location {
  object: "location";
  attributes: LocationAttributes;
}

export interface LocationAttributes {
  id: number;
  short: string;
  long: string;
  updated_at: string;
  created_at: string;
  relationships?: {
    nodes?: MetalessNodeList; // parameter option: nodes
    servers?: MetalessServerList; // parameter option: servers
  };
}

export interface NewLocation extends Location {
  meta: {
    resource: string;
  };
}

/* Databases */

export interface DatabaseList {
  object: "list";
  data: Array<Database>;
}

export interface Database {
  object: "server_database";
  attributes: DatabaseAttributes;
}

export interface DatabaseAttributes {
  id: number;
  server: number;
  host: number;
  database: string;
  username: string;
  remote: string;
  max_connections: number;
  created_at: string;
  updated_at: string;
  relationships?: {
    host?: DatabaseHost; // parameter option: host
    password?: DatabasePassword; // parameter option: password
  };
}

export interface NewDatabase extends Database {
  meta: {
    resource: string;
  };
}

export interface DatabaseHost {
  object: "database_host";
  attributes: DatabaseHostAttributes;
}

export interface DatabaseHostAttributes {
  id: number;
  name: string;
  host: string;
  port: number;
  username: string;
  node: number | null;
  created_at: string;
  updated_at: string;
}

export interface DatabasePassword {
  object: "database_password";
  attributes: DatabasePasswordAttributes;
}

export interface DatabasePasswordAttributes {
  password: string;
}

/* Servers */

export type MetalessServerList = Omit<ServerList, "meta">;

export interface ServerList {
  object: "list";
  data: Array<Server>;
  meta: PaginationMeta;
}

export interface Server {
  object: "server";
  attributes: ServerAttributes;
}

export interface ServerAttributes {
  id: number;
  external_id: string | null;
  uuid: string;
  identifier: string;
  name: string;
  description: string;
  suspended: boolean;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
    threads: string | null;
  };
  feature_limits: {
    databases: number;
    allocations: number;
    backups: number;
  };
  user: number;
  node: number;
  allocation: number;
  nest: number;
  egg: number;
  container: {
    startup_command: string;
    image: string;
    installed: boolean;
    environment: Record<string, string>;
  };
  updated_at: string;
  created_at: string;
  relationships?: {
    allocations?: AllocationList; // parameter option: allocations
    user?: User; // parameter option: user
    subusers?: SubUserList; // parameter option: subusers
    nest?: Nest; // parameter option: nest
    egg?: Egg; // parameter option: egg
    // variables?: VariableList; // parameter option: variables
    location?: Location; // parameter option: location
    node?: Node; // parameter option: node
    databases?: DatabaseList; // parameter option: databases
  };
}

/* Nests */

export type MetalessNestList = Omit<NestList, "meta">;

export interface NestList {
  object: "list";
  data: Array<Nest>;
  meta: PaginationMeta;
}

export interface Nest {
  object: "nest";
  attributes: NestAttributes;
}

export interface NestAttributes {
  id: number;
  uuid: string;
  author: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

/* Eggs */

export interface EggList {
  object: "list";
  data: Array<Egg>;
}

export interface Egg {
  object: "egg";
  attributes: EggAttributes;
}

export interface EggAttributes {
  id: number;
  uuid: string;
  name: string;
  nest: number;
  author: string;
  description: string;
  docker_image: string;
  config: {
    files: {
      [file: string]: {
        parser: string;
        find: Record<string, string | Record<string, string>>;
      };
    } | [];
    startup: {
      done: string;
      userInteraction?: Array<string>;
    };
    stop: string;
    logs: {
      custom: boolean;
      location: string;
    } | [];
    extends: any;
  };
  startup: string;
  script: {
    privileged: boolean;
    install: string;
    entry: string;
    container: string;
    extends: any;
  };
  created_at: string;
  updated_at: string;
  relationships?: {
    nest?: Nest;
    servers?: MetalessServerList;
  };
}

/* Options */

export interface NewUserOptions {
  /**
   * The user email address
   */
  email: string;
  /**
   * The username
   */
  username: string;
  /**
   * The user first name
   */
  firstName: string;
  /**
   * The user last name
   */
  lastName: string;
  /**
   * The user default language
   */
  language?: string;
  /**
   * If `true`, the user will have full control over the panel.
   * 
   * @default false
   */
  admin?: boolean;
  /**
   * The user password
   */
  password?: string;
}

export type UpdateUserOptions = Partial<NewUserOptions>;

export interface NewAllocationOptions {
  /**
   * The allocation ip
   */
  ip: string;
  /**
   * A list of allocation ports
   */
  ports: Array<string> | string;
  /**
   * The allocation ip alias
   */
  alias?: string;
}

export interface NodeDeployabilityParameters {
  /**
   * The amount of memory in megabytes
   */
  memory: number;
  /**
   * The amount of disk space in megabytes
   */
  disk: number;
}

export interface NewNodeOptions {
  /**
   * The node name
   */
  name: string;
  /**
   * The node description
   */
  description?: string;
  /**
   * The node location id
   */
  locationID: number;
  /**
   * The node visibility
   * 
   * When set to `private`, this node cannot be auto-deployed.
   * 
   * @default "public"
   */
  visibility?: VisibilityType;
  /**
   * The node domain or ip address
   */
  fqdn: string;
  /**
   * The URI scheme
   */
  scheme: SchemeType;
  /**
   * Whether or not the node is behind a proxy
   * 
   * When set to `true`, certificates will be skipped on boot.
   * 
   * @default false
   */
  proxy?: boolean;
  /**
   * The total amount of usable memory
   */
  memory: number;
  /**
   * The memory overallocation percentage
   * 
   * When specified, a percentage of the server memory
   * will be added to the total memory capacity.
   * 
   * @default 0
   */
  memoryOverallocate?: number;
  /**
   * The total amount of disk space in megabytes
   */
  disk: number;
  /**
   * The disk overallocation percentage
   * 
   * When specified, a percentage of the server disk
   * will be added to the total disk space.
   * 
   * @default 0
   */
  diskOverallocate?: number;
  /**
   * The maximum upload size
   * 
   * @default 100
   */
  uploadSize?: number;
  /**
   * The base directory for all server files
   */
  daemonBase?: string;
  /**
   * The daemon SFTP port
   * 
   * @default 2022
   */
  daemonSFTP?: number;
  /**
   * The daemon listening port
   * 
   * @default 8080
   */
  daemonListen?: number;
}

export type UpdateNodeOptions = Partial<NewNodeOptions>;

export interface NewLocationOptions {
  /**
   * The location identifier
   */
  short: string;
  /**
   * The location description
   */
  long?: string;
}

export type UpdateLocationOptions = Partial<NewLocationOptions>;

export interface NewDatabaseOptions {
  /**
   * The database host id
   */
  host: number;
  /**
   * The database name
   */
  name: string;
  /**
   * The ip address allowed to access this database.
   * 
   * @default "%"
   */
  remote?: string;
  /**
   * The maximum number of connections allowed to use this database at a time.
   * 
   * @default unlimited
   */
  maxConnections?: number;
}

export interface UpdateServerDetailsOptions {
  /**
   * The server name
   */
  name: string;
  /**
   * The server description
   */
  description?: string;
  /**
   * The server owner
   */
  user: number;
  /**
   * The server external id
   */
  externalID: number;
}

export interface UpdateServerBuildOptions {
  /**
   * The default allocation id
   */
  allocation: number;
  /**
   * The maximum amount of memory to allocate for the server in megabytes.
   * 
   * When set to `0`, an unlimited amount of memory can be consumed.
   * 
   * Required when there are no limits provided.
   */
  memory?: number;
  /**
   * The maximum amount of swap space to allocate for the server in megabytes.
   *
   * When set to `0`, swap space will be disabled. When set to `-1`, swap
   * space will be unlimited.
   * 
   * Required when there are no limits provided.
   */
  swap?: number;
  /**
   * The IO performance of this server relative to other *running* containers 
   * on the system.
   * 
   * This is a value between `10` and `1000`.
   * 
   * Required when there are no limits provided.
   */
  io?: number;
  /**
   * The maximum CPU consumption, in a percentage, allotted for the server.
   * 
   * A single CPU core would be considered `100%`, and a full quad-core
   * processor would be considered `400%`.
   * 
   * When set to `0`, the server can use as much CPU time as needed.
   * 
   * Required when there are no limits provided.
   */
  cpu?: number;
  /**
   * The maximum amount of disk space allotted for the server in megabytes.
   * 
   * When set to `0`, the server can use as much disk space as needed.
   * 
   * Required when there are no limits provided.
   */
  disk?: number;
  /**
   * The specific CPU cores that this server can use.
   * 
   * **Examples**
   * 
   * `0` - The first core
   * 
   * `0-1,3` - The first 2 cores and the fourth core
   * 
   * `0,1,3,4` - The first, second, fourth, and fifth cores 
   */
  threads?: string;
  /**
   * When enabled, the server will be killed when it runs out of memory.
   */
  oom?: boolean;
  /**
   * The application feature limits
   */
  feature_limits?: {
    /**
     * The maximum number of allocations that can be assigned to this server.
     */
    allocations?: number;
    /**
     * The maximum number of databases that can be created for this server.
     */
    databases?: number;
    /**
     * The maximum number of backups that can be created for this server.
     */
    backups?: number;
  };
  /**
   * A list of allocation ids to assign to the server.
   * 
   * The allocations must not already be assigned to a server.
   */
  addAllocations?: Array<number>;
  /**
   * A list of allocation ids to remove from the server.
   * 
   * The list must not contain the default server allocation.
   */
  removeAllocations?: Array<number>;
}

export interface UpdateServerStartupOptions {
  /**
   * The startup command used by the server.
   */
  startup: string;
  /**
   * The key-pair value representing the environment variables.
   * 
   * All environment variables and their respective values must be included.
   * 
   * @example
   * ```
   * environment: {
   *   MINECRAFT_VERSION: "latest",
   *   SERVER_JARFILE: "server.jar",
   *   BUILD_NUMBER: "latest"
   * }
   * ```
   */
  environment: Record<string, string>;
  /**
   * The egg id
   */
  egg: number;
  /**
   * The URL for the docker image.
   */
  image: string;
  /**
   * When enabled, the install script will not be ran during installation.
   * 
   * @default false
   */
  skipScripts?: boolean;
}

export interface NewServerOptions {
  /**
   * The server name
   */
  name: string;
  /**
   * The owner user id
   */
  user: number;
  /**
   * The server description
   */
  description?: string;
  /**
   * When enabled, the server will start on creation.
   * 
   * @default true
   */
  start?: boolean;
  /**
   * The server node id
   */
  node?: number;
  /**
   * The server default allocation id
   */
  allocation: number;
  /**
   * A list of allocation ids to assign to the server.
   * 
   * The allocations must not already be assigned to a server.
   */
  additionalAllocations?: Array<number>;
  featureLimits?: {
    /**
     * The maximum number of databases that can be created for a server.
     * 
     * @default 0
     */
    databases?: number;
    /**
     * The maximum number of allocations that can be assigned to a server.
     * 
     * @default 0
     */
    allocation?: number;
    /**
     * The maximum number of backups that can be created for a server.
     * 
     * @default 0
     */
    backups?: number;
  };
  /**
   * The server limits
   */
  limits: {
    /**
     * The maximum CPU consumption, in a percentage, allotted for the server.
     * 
     * A single CPU core would be considered `100%`, and a full quad-core
     * processor would be `400%`.
     * 
     * When set to `0`, the server can use as much CPU time as needed.
     */
    cpu?: number;
    /**
     * The specific CPU cores that this server can use.
     * 
     * **Examples**
     * 
     * `0` - The first core
     * 
     * `0-1,3` - The first 2 cores and the fourth core
     * 
     * `0,1,3,4` - The first, second, fourth, and fifth cores 
     */
    threads?: string;
    /**
     * The maximum amount of memory allocated for the server in megabytes.
     * 
     * When set to `0`, an unlimited amount of memory can be consumed.
     */
    memory: number;
    /**
     * The maximum amount of swap space allocated for the server in megabytes.
     *
     * When set to `0`, swap space will be disabled. When set to `-1`, swap
     * space will be unlimited.
     */
    swap?: number;
    /**
     * The maximum amount of disk space allotted for the server in megabytes.
     * 
     * When set to `0`, the server can use as much disk space as needed.
     */
    disk: number;
    /**
     * The IO performance of this server relative to other *running* containers 
     * on the system.
     * 
     * This is a value between `10` and `1000`.
     */
    io?: number;
  };
  /**
   * The server egg id
   */
  egg: number;
  /**
   * When enabled, the install script will not be ran during installation.
   */
  skipScripts?: boolean;
  /**
   * The URL for the docker image.
   */
  image: string;
  /**
   * The startup command used by the server.
   */
  startup: string;
  /**
   * The key-pair value representing the environment variables.
   * 
   * All environment variables and their respective values must be included.
   * 
   * @example
   * ```
   * environment: {
   *   MINECRAFT_VERSION: "latest",
   *   SERVER_JARFILE: "server.jar",
   *   BUILD_NUMBER: "latest"
   * }
   * ```
   */
  environment: Record<string, string>;
}

/* Parameters */

export type UserParameters = Array<UserParameter>;
export type UserParameter = "servers";

export type AllocationParameters = Array<AllocationParameter>;
export type AllocationParameter = "node" | "server";

export type NodeParameters = Array<NodeParameter>;
export type NodeParameter = "allocations" | "location" | "servers";

export type LocationParameters = Array<LocationParameter>;
export type LocationParameter = "nodes" | "servers";

export type DatabaseParameters = Array<DatabaseParameter>;
export type DatabaseParameter = "host" | "password";

export type ServerParameters = Array<ServerParameter>;
export type ServerParameter =
  | "allocations"
  | "user"
  | "subusers"
  | "nest"
  | "egg"
  | "location"
  | "node"
  | "databases";

export type EggParameters = Array<EggParameter>;
export type EggParameter =
  | "nest"
  | "servers"
  | "config"
  | "script"
  | "variables";

export type NestParameters = Array<NestParameter>;
export type NestParameter = "eggs" | "servers";
