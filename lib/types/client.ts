export type PowerActionType = "start" | "stop" | "restart" | "kill";

export enum PowerAction {
  START = "start",
  STOP = "stop",
  RESTART = "restart",
  KILL = "kill",
}

/* Generic */

export interface Host {
  address: string;
  port: number;
}

export interface Cron {
  day_of_week: string;
  day_of_month: string;
  hour: string;
  minute: string;
}

export interface SignedURL {
  object: "signed_url";
  attributes: SignedURLAttributes;
}

export interface SignedURLAttributes {
  url: string;
}

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

/* Account */

export interface Account {
  object: "user";
  attributes: AccountAttributes;
}

export interface AccountAttributes {
  id: number;
  admin: boolean;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
}

/* 2FA */

export interface TwoFactorQR {
  data: TwoFactorQRData;
}

export interface TwoFactorQRData {
  image_url_data: string;
}

export interface TwoFactorTokenList {
  object: "recovery_tokens";
  attributes: TwoFactorTokenListAttributes;
}

export interface TwoFactorTokenListAttributes {
  tokens: Array<string>;
}

/* Keys */

export interface APIKeyList {
  object: "list";
  data: Array<APIKey>;
}

export interface APIKey {
  object: "api_key";
  attributes: APIKeyAttributes;
}

export interface APIKeyAttributes {
  identifier: string;
  description: string;
  allowed_ips: Array<string>;
  last_used_at: string;
  created_at: string;
}

export interface NewAPIKey extends APIKey {
  meta: {
    secret_token: string;
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
  id: string;
  host: Host;
  name: string;
  username: string;
  connections_from: string;
  max_connections: number;
  relationships?: {
    password?: { // parameter option: password
      object: "database_password";
      attributes: {
        password: string;
      };
    };
  };
}

export interface NewDatabase extends Database {
  attributes: NewDatabaseAttributes;
}

export interface NewDatabaseAttributes extends DatabaseAttributes {
  relationships: {
    password: {
      object: "database_password";
      attributes: {
        password: string;
      };
    };
  };
}

/* Files */

export interface FileList {
  object: "list";
  data: Array<File>;
}

export interface File {
  object: "file_object";
  attributes: FileAttributes;
}

export interface FileAttributes {
  name: string;
  mode: string;
  size: number;
  is_file: boolean;
  is_symlink: boolean;
  is_editable?: boolean;
  mimetype: string;
  created_at: string;
  modified_at: string;
}

/* Schedules */

export interface ScheduleList {
  object: "list";
  data: Array<Schedule>;
}

export interface Schedule {
  object: "server_schedule";
  attributes: ScheduleAttributes;
}

export interface ScheduleAttributes {
  id: number;
  name: string;
  cron: Cron;
  is_active: boolean;
  is_processing: boolean;
  last_run_at: string;
  next_run_at: string;
  created_at: string;
  updated_at: string;
  relationships: {
    tasks: TaskList;
  };
}

/* Schedule Tasks */

export interface TaskList {
  object: "list";
  data: Array<Task>;
}

export interface Task {
  object: "schedule_task";
  attributes: TaskAttributes;
}

export interface TaskAttributes {
  id: number;
  sequence_id: number;
  action: string;
  payload: string;
  time_offset: number;
  is_queued: boolean;
  created_at: string;
  updated_at: string;
}

/* Allocations */

export interface AllocationList {
  object: "list";
  data: Array<Allocation>;
}

export interface Allocation {
  object: "allocation";
  attributes: AllocationAttributes;
}

export interface AllocationAttributes {
  id: number;
  ip: string;
  ip_alias: string | null;
  port: number;
  notes: string | null;
  is_default: boolean;
}

/* Subusers */

export interface SubUserList {
  object: "list";
  data: Array<SubUser>;
}

export interface SubUser {
  object: "server_subuser";
  attributes: SubUserAttributes;
}

export interface SubUserAttributes {
  uuid: string;
  username: string;
  email: string;
  image: string;
  "2fa_enabled": boolean;
  created_at: string;
  permissions: Array<string>;
}

/* Backups */

export interface BackupList {
  object: "list";
  data: Array<Backup>;
}

export interface Backup {
  object: "backup";
  attributes: BackupAttributes;
  meta: PaginationMeta;
}

export interface BackupAttributes {
  uuid: string;
  is_successful: boolean;
  name: string;
  ignored_files: Array<string>;
  checksum: string | null;
  bytes: number;
  created_at: string;
  completed_at: string | null;
}

/* Variables */

export interface VariableList {
  object: "list";
  data: Array<Variable>;
}

export interface Variable {
  object: "egg_variable";
  attributes: VariableAttributes;
}

export interface VariableAttributes {
  name: string;
  description: string;
  env_variable: string;
  default_value: string;
  server_value: string;
  is_editable: boolean;
  rules: string;
}

/* Servers */

export interface ServerList {
  object: "list";
  data: Array<Server>;
  meta: PaginationMeta;
}

export interface Server {
  object: "server";
  attributes: ServerAttributes;
  meta: ServerMeta;
}

export interface ServerAttributes {
  server_owner: boolean;
  identifier: string;
  internal_id: number;
  uuid: string;
  name: string;
  node: string;
  sftp_details: Host;
  description: string;
  limits: {
    memory: number;
    swap: number;
    disk: number;
    io: number;
    cpu: number;
  };
  invocation: string;
  egg_features: Array<String>;
  feature_limits: {
    databases: number;
    allocations: number;
    backups: number;
  };
  is_suspended: boolean;
  is_installing: boolean;
  relationships: {
    allocations: AllocationList;
    variables: VariableList;
    egg?: Egg; // parameter option: egg
    subuser?: SubUserList; // parameter option: subusers
  };
}

export interface ServerMeta {
  is_server_owner: boolean;
  user_permissions: Array<string>;
}

export interface SocketCredentials {
  data: SocketCredentialsData;
}

export interface SocketCredentialsData {
  token: string;
  socket: string;
}

export interface ServerResources {
  // returned from GET request
  object: "stats";
  attributes: ServerResourceAttributes;
}

export interface ServerResourceAttributes {
  current_state: string;
  is_suspended: boolean;
  resources: {
    memory_bytes: number;
    cpu_absolute: number;
    disk_bytes: number;
    network_rx_bytes: number;
    network_tx_bytes: number;
  };
}

export interface ServerStats {
  // returned from websocket
  cpu_absolute: number;
  disk_bytes: number;
  memory_bytes: number;
  memory_limit_bytes: number;
  network: {
    rx_bytes: number;
    tx_bytes: number;
  };
  state: string;
}

/* Eggs */

export interface Egg {
  object: "egg";
  attributes: EggAttributes;
}

export interface EggAttributes {
  uuid: string;
  name: string;
}

/* Permissions */

export interface AllPermissions {
  object: "system_permissions";
  attributes: AllPermissionAttributes;
}

export interface AllPermissionAttributes {
  permissions: {
    websocket: {
      description: string;
      keys: {
        connect: string;
      };
    };
    control: {
      description: string;
      keys: {
        console: string;
        start: string;
        stop: string;
        restart: string;
      };
    };
    user: {
      description: string;
      keys: {
        create: string;
        read: string;
        update: string;
        delete: string;
      };
    };
    file: {
      description: string;
      keys: {
        create: string;
        read: string;
        "read-content": string;
        update: string;
        delete: string;
        archive: string;
        sftp: string;
      };
    };
    backup: {
      description: string;
      keys: {
        create: string;
        read: string;
        update: string;
        delete: string;
        download: string;
      };
    };
    allocation: {
      description: string;
      keys: {
        read: string;
        create: string;
        update: string;
        delet: string;
      };
    };
    startup: {
      description: string;
      keys: {
        read: string;
        update: string;
      };
    };
    database: {
      description: string;
      keys: {
        create: string;
        read: string;
        update: string;
        delete: string;
        view_password: string;
      };
    };
    schedule: {
      description: string;
      keys: {
        create: string;
        read: string;
        update: string;
        delete: string;
      };
    };
    settings: {
      description: string;
      keys: {
        rename: string;
        reinstall: string;
      };
    };
  };
}

/* Options */

export interface UpdateEmailOptions {
  /**
   * The new email address
   */
  email: string;
  /**
   * The account password
   */
  password: string;
}

export interface UpdatePasswordOptions {
  /**
   * The current account password
   */
  oldPassword: string;
  /**
   * The new account password
   */
  newPassword: string;
}

export interface NewAPIKeyOptions {
  /**
   * The API key description
   */
  description: string;
  /**
   * A list of ip addresses that can use this key.
   */
  allowedIPs?: Array<string>;
}

export interface NewDatabaseOptions {
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
}

export interface RenameFileOptions {
  /**
   * The target file name
   */
  oldName: string;
  /**
   * The new file name
   */
  newName: string;
  /**
   * The root directory
   * 
   * @default "%"
   */
  directory?: string;
}

export interface UploadFileOptions {
  /**
   * The name of the uploaded file
   */
  name: string;
  /**
   * The path to the local file
   */
  filePath: string;
}

export interface SingleFileOptions {
  /**
   * The target file
   */
  file: string;
  /**
   * The root directory to access the files from.
   * 
   * @default "/"
   */
  directory?: string;
}

export interface MultiFileOptions {
  /**
   * A list of target files
   */
  files: string[];
  /**
   * The root directory to access the files from.
   */
  directory?: string;
}

export interface FolderOptions {
  /**
   * The folder name
   */
  name: string;
  /**
   * The root directory of the folder
   */
  directory?: string;
}

export interface NewScheduleOptions {
  /**
   * The schedule name
   */
  name: string;
  /**
   * The cron minute
   */
  minute: string;
  /**
   * The cron hour
   */
  hour: string;
  /**
   * The cron day of week
   */
  dayOfWeek: string;
  /**
   * The cron day of month
   */
  dayOfMonth: string;
  /**
   * Whether or not the schedule is active
   * 
   * @default true
   */
  is_active?: boolean;
}

export type UpdateScheduleOptions = Omit<NewScheduleOptions, "name">;

export interface TaskOptions {
  /**
   * The delay between the previous task and the new task.
   */
  timeOffset: number;
  /**
   * The action the task executes
   */
  action: string;
  /**
   * The payload included with the action
   */
  payload?: string;
}

export interface NewUserOptions {
  /**
   * The user email address
   */
  email: string;
  /**
   * A list of user permissions
   */
  perms: Array<string>;
}

export type UpdateUserOptions = Omit<NewUserOptions, "email">;

export interface NewBackupOptions {
  /**
   * The backup name
   */
  name?: string;
  /**
   * A list of files or directories to ignore.
   */
  ignoredFiles?: Array<string>;
}

export interface UpdateVariableOptions {
  key: string;
  value: string | null;
}

/* Parameters */

export type DatabaseParameters = Array<DatabaseParameter>;
export type DatabaseParameter = "password";

export type ServerParameters = Array<ServerParameter>;
export type ServerParameter = "egg" | "subusers";
