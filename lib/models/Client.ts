import HTTPClient from "./HTTPClient.ts";

import { ServerSocket } from "./ServerSocket.ts";

import {
  Account,
  Allocation,
  AllocationList,
  AllPermissions,
  APIKeyList,
  Backup,
  BackupList,
  DatabaseList,
  DatabaseParameters,
  File,
  FileList,
  FolderOptions,
  MultiFileOptions,
  NewAPIKey,
  NewAPIKeyOptions,
  NewBackupOptions,
  NewDatabase,
  NewDatabaseOptions,
  NewScheduleOptions,
  NewUserOptions,
  PowerActionType,
  RenameFileOptions,
  Schedule,
  ScheduleList,
  Server,
  ServerList,
  ServerParameters,
  ServerResources,
  SignedURL,
  SingleFileOptions,
  SocketCredentials,
  SubUser,
  SubUserList,
  Task,
  TaskOptions,
  TwoFactorQR,
  TwoFactorTokenList,
  UpdateEmailOptions,
  UpdateFileCHMODOptions,
  UpdateFilesCHMODOptions,
  UpdatePasswordOptions,
  UpdateScheduleOptions,
  UpdateUserOptions,
  UpdateVariableOptions,
  UploadFileOptions,
  Variable,
  VariableList,
} from "../types/client.ts";
import { ContentType, Method } from "../types/http.ts";
import { SocketOptions } from "../types/serversocket.ts";

export default class Client {
  private http: HTTPClient;

  /**
   * Represents a Pterodactyl client object, used for automating client requests.
   *
   * @param endpoint The panel endpoint
   * @param api_token The auth token
   */
  constructor(public endpoint: string, api_token: string) {
    this.http = new HTTPClient(endpoint, api_token);
  }

  /**
   * Retrieves details associated with the bearer account.
   */
  async getAccount() {
    return (await this.http.request<Account>(Method.GET, "/client/account"))
      .attributes;
  }

  /**
   * Retrieves a two-factor QR code image.
   */
  async get2FAImage() {
    return (
      await this.http.request<TwoFactorQR>(
        Method.GET,
        "/client/account/two-factor"
      )
    ).data;
  }

  /**
   * Enables two-factor authentication and retrieves recovery tokens.
   *
   * @param {string} code The parsed two-factor code from a QR image
   */
  async enable2FA(code: string) {
    return (
      await this.http.request<TwoFactorTokenList>(
        Method.POST,
        "/client/account/two-factor",
        { body: { code } }
      )
    ).attributes;
  }

  /**
   * Removes two-factor authentication from the bearer account.
   *
   * @param {string} password The account password
   */
  async delete2FA(password: string) {
    await this.http.request(Method.DELETE, "/client/account/two-factor", {
      body: { password },
    });
  }

  /**
   * Updates the account email address.
   *
   * @param {UpdateEmailOptions} options The email updating options
   */
  async updateEmail(options: UpdateEmailOptions) {
    await this.http.request(Method.PUT, "/client/account/email", {
      body: { ...options },
    });
  }

  /**
   * Updates the account password.
   *
   * @param {UpdatePasswordOptions} options The password updating options
   */
  async updatePassword(options: UpdatePasswordOptions) {
    await this.http.request(Method.PUT, "/client/account/password", {
      body: {
        current_password: options.oldPassword,
        password: options.newPassword,
        password_confirmation: options.newPassword,
      },
    });
  }

  /**
   * Retrieves a list of all API keys associated with the account.
   */
  async getAPIKeys() {
    return (
      await this.http.request<APIKeyList>(
        Method.GET,
        "/client/account/api-keys"
      )
    ).data;
  }

  /**
   * Creates a new API key.
   *
   * @param {NewAPIKeyOptions} options The new api key options
   */
  async createAPIKey(options: NewAPIKeyOptions) {
    return await this.http.request<NewAPIKey>(
      Method.POST,
      "/client/account/api-keys",
      {
        body: {
          description: options.description,
          allowed_ips: options.allowedIPs,
        },
      }
    );
  }

  /**
   * Deletes an API key.
   *
   * @param {number} id The key id
   */
  async deleteAPIKey(id: number) {
    await this.http.request(Method.DELETE, `/client/account/api-keys/${id}`);
  }

  /**
   * Retrieves a list of database objects on a server.
   *
   * @param {string} server The server uuid
   * @param {DatabaseParameters} [params] The list of database parameters
   */
  async getDatabases(server: string, params?: DatabaseParameters) {
    return (
      await this.http.request<DatabaseList>(
        Method.GET,
        `/client/servers/${server}/databases`,
        {
          params,
        }
      )
    ).data;
  }

  /**
   * Creates a new server database.
   *
   * @param {string} server The server uuid
   * @param {NewDatabaseOptions} options The database options
   */
  async createDatabase(server: string, options: NewDatabaseOptions) {
    return (
      await this.http.request<NewDatabase>(
        Method.POST,
        `/client/servers/${server}/databases`,
        { body: { database: options.name, remote: options.remote || "%" } }
      )
    ).attributes;
  }

  /**
   * Changes the password of a server database.
   *
   * @param {string} server The server uuid
   * @param {string} database The database id
   */
  async rotateDatabasePWD(server: string, database: string) {
    return (
      await this.http.request<NewDatabase>(
        Method.POST,
        `/client/servers/${server}/databases/${database}/rotate-password`
      )
    ).attributes;
  }

  /**
   * Deletes a server database.
   *
   * @param {string} server The server uuid
   * @param {string} database The database id
   */
  async deleteDatabase(server: string, database: string) {
    await this.http.request(
      Method.DELETE,
      `/client/servers/${server}/databases/${database}`
    );
  }

  /**
   * Retrieves a list of files.
   *
   * @param {string} server The server uuid
   * @param {string} [directory] The root directory
   */
  async getFiles(server: string, directory: string = "/") {
    return (
      await this.http.request<FileList>(
        Method.GET,
        `/client/servers/${server}/files/list`,
        { query: { directory } }
      )
    ).data;
  }

  /**
   * Retrieves raw contents from a file.
   *
   * The file parameter can also include a directory to the file.
   * Both `bukkit.yml` and `/logs/latest.txt` are valid.
   *
   * @param {string} server The server uuid
   * @param {string} file The file path
   */
  async getFileContents(server: string, file: string) {
    return await this.http.request<string>(
      Method.GET,
      `/client/servers/${server}/files/contents`,
      {
        query: { file },
        type: ContentType.PLAIN,
      }
    );
  }

  /**
   * Retrieves a download link to the file.
   *
   * @param {string} server The server uuid
   * @param {string} file The file path
   */
  async downloadFile(server: string, file: string) {
    return (
      await this.http.request<SignedURL>(
        Method.GET,
        `/client/servers/${server}/files/download`,
        {
          query: { file },
        }
      )
    ).attributes;
  }

  /**
   * Changes the name of a file.
   *
   * @param {string} server The server uuid
   * @param {RenameFileOptions} options The file options
   */
  async renameFile(server: string, options: RenameFileOptions) {
    await this.http.request(
      Method.PUT,
      `/client/servers/${server}/files/rename`,
      {
        body: {
          root: options.directory || "%",
          files: [
            {
              from: options.oldName,
              to: options.newName,
            },
          ],
        },
      }
    );
  }

  /**
   * Makes a copy of a file.
   *
   * @param {string} server The server uuid
   * @param {string} file The file path
   */
  async copyFile(server: string, file: string) {
    await this.http.request(
      Method.POST,
      `/client/servers/${server}/files/copy`,
      {
        body: { location: file },
      }
    );
  }

  /**
   * Writes data into a file on a specific server.
   *
   * If you want to upload a file and have it handled for you,
   * use the `uploadFile` method.
   *
   * @param {string} server The server uuid
   * @param {string} target The name of the file on the server
   * @param {string | Uint8Array} data The upload data
   */
  async writeFile(server: string, target: string, data: string | Uint8Array) {
    await this.http.request(
      Method.POST,
      `/client/servers/${server}/files/write`,
      {
        body: data,
        query: {
          file: target,
        },
        type: ContentType.PLAIN,
      }
    );
  }

  /**
   * Uploads a local file to a specific server.
   *
   * Sends POST requests with raw body data.
   *
   * Requires read permissions.
   *
   * @param {string} server The server uuid
   */
  async uploadFile(server: string, { name, filePath }: UploadFileOptions) {
    const file = await Deno.readFile(filePath);
    await this.writeFile(server, name, file);
  }

  /**
   * Uploads a local file to a specific server.
   *
   * Sends POST requests using multipart
   * form data.
   *
   * @param {string} server The server uuid
   */
  private async uploadFileMP(
    server: string,
    { name, filePath }: UploadFileOptions
  ) {
    throw new Error("This method has not been implemented.");
  }

  /**
   * Compresses a file on a specific server.
   *
   * @param {string} server The server uuid
   */
  async compressFile(server: string, { file, directory }: SingleFileOptions) {
    return await this.compressFiles(server, {
      files: [file],
      directory,
    });
  }

  /**
   * Compresses multiple files on a specific server.
   *
   * @param {string} server The server uuid
   */
  async compressFiles(server: string, { files, directory }: MultiFileOptions) {
    return (
      await this.http.request<File>(
        Method.POST,
        `/client/servers/${server}/files/compress`,
        {
          body: {
            root: directory,
            files: files,
          },
        }
      )
    ).attributes;
  }

  /**
   * Decompresses a file on a specific server.
   *
   * @param {string} server The server uuid
   */
  async decompressFile(server: string, { file, directory }: SingleFileOptions) {
    await this.http.request(
      Method.POST,
      `/client/servers/${server}/files/decompress`,
      {
        body: {
          root: directory,
          file: file,
        },
      }
    );
  }

  /**
   * Deletes a file on a specific server.
   *
   * @param {string} server The server uuid
   */
  async deleteFile(server: string, { file, directory }: SingleFileOptions) {
    await this.deleteFiles(server, {
      files: [file],
      directory,
    });
  }

  /**
   * Deletes multiple files on a specific server.
   *
   * @param {string} server The server uuid
   */
  async deleteFiles(server: string, { files, directory }: MultiFileOptions) {
    await this.http.request(
      Method.POST,
      `/client/servers/${server}/files/delete`,
      {
        body: {
          root: directory,
          files: files,
        },
      }
    );
  }

  /**
   * Creates a new folder on a specific server.
   *
   * @param {string} server The server uuid
   */
  async createFolder(server: string, { name, directory }: FolderOptions) {
    await this.http.request(
      Method.POST,
      `/client/servers/${server}/files/create-folder`,
      {
        body: {
          root: directory,
          name,
        },
      }
    );
  }

  /**
   * Updates the chmod for multiple files.
   * 
   * @param {string} server The server uuid
   */
  async updateFilesCHMOD(server: string, { files, directory }: UpdateFilesCHMODOptions) {
    await this.http.request(
      Method.POST,
      `/client/servers/${server}/files/chmod`,
      {
        body: {
          root: directory || "/",
          files
        }
      }
    );
  }

  /**
   * Updates the chmod for a single file.
   * 
   * @param {string} server The server uuid
   */
  async updateFileCHMOD(server: string, { file, directory }: UpdateFileCHMODOptions) {
    await this.updateFilesCHMOD(server, {
      directory,
      files: [file]
    });
  }

  /**
   * Retrieves a URL to connect with the FTP server.
   *
   * @param server The server uuid
   */
  async getFTPServer(server: string) {
    return (
      await this.http.request<SignedURL>(
        Method.GET,
        `/client/servers/${server}/files/upload`
      )
    ).attributes;
  }

  /**
   * Retrieves a list of server schedules.
   *
   * @param {string} server The server uuid
   */
  async getSchedules(server: string) {
    return (
      await this.http.request<ScheduleList>(
        Method.GET,
        `/client/servers/${server}/schedules`
      )
    ).data;
  }

  /**
   * Creates a new schedule on a specific server.
   *
   * If you need help with setting up cron schedules,
   * refer to this website: https://crontab.guru/
   *
   * @param {string} server The server uuid
   */
  async createSchedule(
    server: string,
    { name, minute, hour, dayOfWeek, dayOfMonth, is_active }: NewScheduleOptions
  ) {
    return (
      await this.http.request<Schedule>(
        Method.POST,
        `/client/servers/${server}/schedules`,
        {
          body: {
            name,
            minute,
            hour,
            day_of_week: dayOfWeek,
            day_of_month: dayOfMonth,
            is_active,
          },
        }
      )
    ).attributes;
  }

  /**
   * Retrieves a specific schedule from a server.
   *
   * @param {string} server The server uuid
   * @param {number} id The schedule id
   */
  async getSchedule(server: string, id: number) {
    return (
      await this.http.request<Schedule>(
        Method.GET,
        `/client/servers/${server}/schedules/${id}`
      )
    ).attributes;
  }

  /**
   * Updates a specific schedule on a server.
   *
   * @param {string} server The server uuid
   * @param {number} id The schedule id
   */
  async updateSchedule(
    server: string,
    id: number,
    { minute, hour, dayOfWeek, dayOfMonth, is_active }: UpdateScheduleOptions
  ) {
    return (
      await this.http.request<Schedule>(
        Method.POST,
        `/client/servers/${server}/schedules/${id}`,
        {
          body: {
            minute,
            hour,
            day_of_week: dayOfWeek,
            day_of_month: dayOfMonth,
            is_active,
          },
        }
      )
    ).attributes;
  }

  /**
   * Deletes a schedule of a specific server.
   *
   * @param {string} server The server uuid
   * @param {number} id The schedule id
   */
  async deleteSchedule(server: string, id: number) {
    await this.http.request(
      Method.DELETE,
      `/client/servers/${server}/schedules/${id}`
    );
  }

  /**
   * Creates a new task on a specific schedule.
   *
   * The payload field can only be used if
   * action is not set to backup.
   *
   * @param {string} server The server uuid
   * @param {string} schedule The schedule id
   */
  async createTask(
    server: string,
    schedule: number,
    { timeOffset, action, payload }: TaskOptions
  ) {
    if (payload && action === "backup") {
      payload = undefined;
    }

    return (
      await this.http.request<Task>(
        Method.POST,
        `/client/servers/${server}/schedules/${schedule}/tasks`,
        {
          body: {
            time_offset: timeOffset,
            action,
            payload,
          },
        }
      )
    ).attributes;
  }

  /**
   * Updates a task on a specific schedule.
   *
   * @param {string} server The server uuid
   * @param {number} schedule The schedule id
   * @param {number} id The task id
   */
  async updateTask(
    server: string,
    schedule: number,
    id: number,
    { timeOffset, action, payload }: TaskOptions
  ) {
    if (payload && action === "backup") {
      payload = undefined;
    }

    return (
      await this.http.request<Task>(
        Method.POST,
        `/client/servers/${server}/schedules/${schedule}/tasks/${id}`,
        {
          body: {
            time_offset: timeOffset,
            action,
            payload,
          },
        }
      )
    ).attributes;
  }

  /**
   * Deletes a task on a specific schedule.
   *
   * @param {string} server The server uuid
   * @param {number} schedule The schedule id
   * @param {number} id The task id
   */
  async deleteTask(server: string, schedule: number, id: number) {
    await this.http.request(
      Method.DELETE,
      `/client/servers/${server}/schedules/${schedule}/tasks/${id}`
    );
  }

  /**
   * Retrieves a list of server allocations.
   *
   * @param {string} server The server uuid
   */
  async getAllocations(server: string) {
    return (
      await this.http.request<AllocationList>(
        Method.GET,
        `/client/servers/${server}/network/allocations`
      )
    ).data;
  }

  /**
   * Sets the note on a server allocation.
   *
   * @param {string} server The server uuid
   * @param {number} id The allocation id
   * @param {string} note The allocation note
   */
  async setAllocationNote(server: string, id: number, note: string) {
    return (
      await this.http.request<Allocation>(
        Method.POST,
        `/client/servers/${server}/network/allocations/${id}`,
        {
          body: {
            notes: note,
          },
        }
      )
    ).attributes;
  }

  /**
   * Sets a server's primary allocation.
   *
   * @param {string} server The server uuid
   * @param {number} id The allocation id
   */
  async setPrimaryAllocation(server: string, id: number) {
    return (
      await this.http.request<Allocation>(
        Method.POST,
        `/client/servers/${server}/network/allocations/${id}/primary`
      )
    ).attributes;
  }

  /**
   * Deletes a server allocation.
   *
   * The allocation must not be the default server allocation.
   *
   * @param {string} server The server uuid
   * @param {number} id The allocation id
   */
  async deleteAllocation(server: string, id: number) {
    await this.http.request(
      Method.DELETE,
      `/client/servers/${server}/network/allocations/${id}`
    );
  }

  /**
   * Retrieves a list of server subusers.
   *
   * @param {string} server The server uuid
   */
  async getUsers(server: string) {
    return (
      await this.http.request<SubUserList>(
        Method.GET,
        `/client/servers/${server}/users`
      )
    ).data;
  }

  /**
   * Creates a new server subuser.
   *
   * @param {string} server The server uuid
   */
  async createUser(server: string, { email, perms }: NewUserOptions) {
    return (
      await this.http.request<SubUser>(
        Method.POST,
        `/client/servers/${server}/users`,
        {
          body: {
            email,
            permissions: perms,
          },
        }
      )
    ).attributes;
  }

  /**
   * Retrieves a specific server subuser.
   *
   * @param {string} server The server uuid
   * @param {string} uuid The user uuid
   */
  async getUser(server: string, uuid: string) {
    return (
      await this.http.request<SubUser>(
        Method.GET,
        `/client/servers/${server}/users/${uuid}`
      )
    ).attributes;
  }

  /**
   * Updates the permissions for a specific server subuser.
   *
   * @param {string} server The server uuid
   * @param {string} uuid The user uuid
   */
  async updateUser(server: string, uuid: string, { perms }: UpdateUserOptions) {
    return (
      await this.http.request<SubUser>(
        Method.POST,
        `/client/servers/${server}/users/${uuid}`,
        {
          body: {
            permissions: perms,
          },
        }
      )
    ).attributes;
  }

  /**
   * Deletes a specific server subuser.
   *
   * @param {string} server The server uuid
   * @param {string} uuid The user uuid
   */
  async deleteUser(server: string, uuid: string) {
    await this.http.request(
      Method.DELETE,
      `/client/servers/${server}/users/${uuid}`
    );
  }

  /**
   * Retrieves a list of server backups.
   *
   * @param {string} server The server uuid
   */
  async getBackups(server: string) {
    return await this.http.request<BackupList>(
      Method.GET,
      `/client/servers/${server}/backups`
    );
  }

  /**
   * Creates a new server backup.
   *
   * If no options are provided, the panel will fill in the data for you.
   *
   * @param {string} server The server uuid
   * @param {NewBackupOptions} [options] The server backup options
   */
  async createBackup(server: string, options?: NewBackupOptions) {
    return (
      await this.http.request<Backup>(
        Method.POST,
        `/client/servers/${server}/backups`,
        {
          body: {
            name: options?.name,
            ignored_files: options?.ignoredFiles,
          },
        }
      )
    ).attributes;
  }

  /**
   * Retrieves a specific server backup.
   *
   * @param {string} server The server uuid
   * @param {string} uuid The backup uuid
   */
  async getBackup(server: string, uuid: string) {
    return (
      await this.http.request<Backup>(
        Method.GET,
        `/client/servers/${server}/backups/${uuid}`
      )
    ).attributes;
  }

  /**
   * Retrieves a url for downloading a server backup.
   *
   * @param {string} server The server uuid
   * @param {string} uuid The backup uuid
   */
  async getBackupDownload(server: string, uuid: string) {
    return (
      await this.http.request<SignedURL>(
        Method.GET,
        `/client/servers/${server}/backups/${uuid}/download`
      )
    ).attributes;
  }

  /**
   * Deletes a server backup.
   *
   * @param {string} server The server uuid
   * @param {string} uuid The backup uuid
   */
  async deleteBackup(server: string, uuid: string) {
    await this.http.request(
      Method.DELETE,
      `/client/servers/${server}/backups/${uuid}`
    );
  }

  /**
   * Retrieves a list of server startup variables.
   *
   * @param {string} server The server uuid
   */
  async getVariables(server: string) {
    return (
      await this.http.request<VariableList>(
        Method.GET,
        `/client/servers/${server}/startup`
      )
    ).data;
  }

  /**
   * Updates a server startup variable.
   *
   * @param {string} server The server uuid
   */
  async updateVariable(server: string, { key, value }: UpdateVariableOptions) {
    return (
      await this.http.request<Variable>(
        Method.PUT,
        `/client/servers/${server}/startup/variable`,
        {
          body: {
            key,
            value: value || null,
          },
        }
      )
    ).attributes;
  }

  /**
   * Renames a specific server.
   *
   * @param {string} server The server uuid
   * @param {string} name The new server name
   */
  async renameServer(server: string, name: string) {
    await this.http.request(
      Method.POST,
      `/client/servers/${server}/settings/rename`,
      {
        body: {
          name,
        },
      }
    );
  }

  /**
   * Triggers a server to reinstall.
   *
   * WARNING: This can potentially delete preexisting server files,
   * use this method with caution.
   *
   * @param {string} server The server uuid
   */
  async reinstallServer(server: string) {
    await this.http.request(
      Method.POST,
      `/client/servers/${server}/settings/reinstall`
    );
  }

  /**
   * Changes the docker image on a given server.
   */
  // TODO: Implement `changeDockerImage` when released.
  async changeDockerImage(server: string) {
    await this.http.request(
      Method.PUT,
      `/client/servers/${server}/settings/docker-image`
    )
  }

  /**
   * Retrieves server information.
   *
   * @param {string} server The server uuid
   * @param {ServerParameters} [params] The server parameters
   */
  async getServer(server: string, params?: ServerParameters) {
    return await this.http.request<Server>(
      Method.GET,
      `/client/servers/${server}`,
      {
        params,
      }
    );
  }

  /**
   * Retrieves a url and token used to connect to a server websocket.
   *
   * @param {string} server The server uuid
   */
  async getServerSocket(server: string) {
    return (
      await this.http.request<SocketCredentials>(
        Method.GET,
        `/client/servers/${server}/websocket`
      )
    ).data;
  }

  /**
   * Returns a websocket connection to the server.
   *
   * @param {string} server The server uuid
   * @param {SocketOptions} [options] The socket options
   */
  async joinServerSocket(server: string, options?: SocketOptions) {
    return new ServerSocket(this, server, options);
  }

  /**
   * Retrieves current statistics about a server.
   *
   * @param {string} server The server uuid
   */
  async getResources(server: string) {
    return (
      await this.http.request<ServerResources>(
        Method.GET,
        `/client/servers/${server}/resources`
      )
    ).attributes;
  }

  /**
   * Sends a command to a server.
   *
   * @param {string} server The server uuid
   * @param {string} command The command to send
   */
  async sendCommand(server: string, command: string) {
    await this.http.request(Method.POST, `/client/servers/${server}/command`, {
      body: {
        command,
      },
    });
  }

  /**
   * Sends a power signal to a server.
   *
   * @param {string} server The server uuid
   * @param {PowerActionType} action The power action to send
   */
  async sendPowerAction(server: string, action: PowerActionType) {
    await this.http.request(Method.POST, `/client/servers/${server}/power`, {
      body: {
        signal: action,
      },
    });
  }

  /**
   * Retrieves a list of servers.
   *
   * @param {ServerParameters} [params] The server parameters
   */
  async getServers(params?: ServerParameters) {
    return await this.http.request<ServerList>(Method.GET, "/client", {
      params,
    });
  }

  /**
   * Retrieves all available permissions.
   */
  async getAllPermissions() {
    return (
      await this.http.request<AllPermissions>(Method.GET, `/client/permissions`)
    ).attributes;
  }
}
