import * as fs from "fs";
import * as path from "path";
import { createHash } from "crypto";

const DATA_DIR = path.join(process.cwd(), "data");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const USERS_FILE = path.join(DATA_DIR, "users.json");
const ACCOUNTS_FILE = path.join(DATA_DIR, "accounts.json");
const COMMANDS_FILE = path.join(DATA_DIR, "commands.json");
const PROCESSES_FILE = path.join(DATA_DIR, "processes.json");

// Initialize default data files if they don't exist
function initializeDataFiles() {
  // Initialize users with owner account
  if (!fs.existsSync(USERS_FILE)) {
    const defaultUsers = {
      users: [
        {
          id: "owner",
          username: "xCTx_AyOuB",
          passwordHash: hashPassword("owner_password"), // Fixed owner password
          role: "owner",
          createdAt: new Date().toISOString(),
        },
      ],
    };
    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2));
  }

  // Initialize accounts
  if (!fs.existsSync(ACCOUNTS_FILE)) {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify({ accounts: [] }, null, 2));
  }

  // Initialize commands with default bot commands
  if (!fs.existsSync(COMMANDS_FILE)) {
    const defaultCommands = {
      commands: [
        { id: "help", trigger: "/help", response: "Bot commands list", category: "info" },
        { id: "status", trigger: "@status", response: "Bot is online", category: "info" },
        { id: "squad3", trigger: "/3", response: "3-Player Squad Created!", category: "squad" },
        { id: "squad4", trigger: "/4", response: "4-Player Squad Created!", category: "squad" },
      ],
    };
    fs.writeFileSync(COMMANDS_FILE, JSON.stringify(defaultCommands, null, 2));
  }

  // Initialize processes
  if (!fs.existsSync(PROCESSES_FILE)) {
    fs.writeFileSync(PROCESSES_FILE, JSON.stringify({ processes: [] }, null, 2));
  }
}

initializeDataFiles();

// Utility functions
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function readJSON(filePath: string): any {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

function writeJSON(filePath: string, data: any): boolean {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing to ${filePath}:`, error);
    return false;
  }
}

// User management
export const UserManager = {
  getAllUsers() {
    const data = readJSON(USERS_FILE);
    return data?.users || [];
  },

  getUserByUsername(username: string) {
    const users = this.getAllUsers();
    return users.find((u: any) => u.username === username);
  },

  verifyPassword(username: string, password: string): boolean {
    const user = this.getUserByUsername(username);
    if (!user) return false;
    return user.passwordHash === hashPassword(password);
  },

  createUser(username: string, password: string, role: string = "user") {
    const users = this.getAllUsers();

    // Check if user already exists
    if (users.some((u: any) => u.username === username)) {
      throw new Error("User already exists");
    }

    const newUser = {
      id: `user_${Date.now()}`,
      username,
      passwordHash: hashPassword(password),
      role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    const data = readJSON(USERS_FILE);
    data.users = users;
    writeJSON(USERS_FILE, data);

    return newUser;
  },

  deleteUser(userId: string) {
    const data = readJSON(USERS_FILE);
    data.users = data.users.filter((u: any) => u.id !== userId);
    return writeJSON(USERS_FILE, data);
  },

  updateUserPassword(userId: string, newPassword: string) {
    const data = readJSON(USERS_FILE);
    const user = data.users.find((u: any) => u.id === userId);
    if (!user) return false;

    user.passwordHash = hashPassword(newPassword);
    return writeJSON(USERS_FILE, data);
  },
};

// Account management
export const AccountManager = {
  getAllAccounts() {
    const data = readJSON(ACCOUNTS_FILE);
    return data?.accounts || [];
  },

  getAccountById(accountId: string) {
    const accounts = this.getAllAccounts();
    return accounts.find((a: any) => a.id === accountId);
  },

  getAccountsByUser(userId: string) {
    const accounts = this.getAllAccounts();
    return accounts.filter((a: any) => a.userId === userId);
  },

  createAccount(userId: string, uid: string, password: string, accountName?: string) {
    const accounts = this.getAllAccounts();

    // Check if account already exists
    if (accounts.some((a: any) => a.uid === uid)) {
      throw new Error("Account UID already added");
    }

    const newAccount = {
      id: `acc_${Date.now()}`,
      userId,
      uid,
      password,
      accountName: accountName || `Account_${uid}`,
      status: "stopped",
      processId: null,
      friends: [],
      friendRequests: [],
      createdAt: new Date().toISOString(),
      lastStarted: null,
    };

    accounts.push(newAccount);
    const data = readJSON(ACCOUNTS_FILE);
    data.accounts = accounts;
    writeJSON(ACCOUNTS_FILE, data);

    return newAccount;
  },

  updateAccountStatus(accountId: string, status: string, processId?: number | null) {
    const data = readJSON(ACCOUNTS_FILE);
    const account = data.accounts.find((a: any) => a.id === accountId);
    if (!account) return false;

    account.status = status;
    if (processId !== undefined) {
      account.processId = processId;
    }
    if (status === "running") {
      account.lastStarted = new Date().toISOString();
    }

    return writeJSON(ACCOUNTS_FILE, data);
  },

  deleteAccount(accountId: string) {
    const data = readJSON(ACCOUNTS_FILE);
    data.accounts = data.accounts.filter((a: any) => a.id !== accountId);
    return writeJSON(ACCOUNTS_FILE, data);
  },

  addFriend(accountId: string, friendUid: string) {
    const data = readJSON(ACCOUNTS_FILE);
    const account = data.accounts.find((a: any) => a.id === accountId);
    if (!account) return false;

    if (!account.friends.includes(friendUid)) {
      account.friends.push(friendUid);
    }

    return writeJSON(ACCOUNTS_FILE, data);
  },

  removeFriend(accountId: string, friendUid: string) {
    const data = readJSON(ACCOUNTS_FILE);
    const account = data.accounts.find((a: any) => a.id === accountId);
    if (!account) return false;

    account.friends = account.friends.filter((f: string) => f !== friendUid);
    return writeJSON(ACCOUNTS_FILE, data);
  },

  addFriendRequest(accountId: string, requesterUid: string) {
    const data = readJSON(ACCOUNTS_FILE);
    const account = data.accounts.find((a: any) => a.id === accountId);
    if (!account) return false;

    if (!account.friendRequests.includes(requesterUid)) {
      account.friendRequests.push(requesterUid);
    }

    return writeJSON(ACCOUNTS_FILE, data);
  },

  removeFriendRequest(accountId: string, requesterUid: string) {
    const data = readJSON(ACCOUNTS_FILE);
    const account = data.accounts.find((a: any) => a.id === accountId);
    if (!account) return false;

    account.friendRequests = account.friendRequests.filter((r: string) => r !== requesterUid);
    return writeJSON(ACCOUNTS_FILE, data);
  },
};

// Command management
export const CommandManager = {
  getAllCommands() {
    const data = readJSON(COMMANDS_FILE);
    return data?.commands || [];
  },

  getCommandById(commandId: string) {
    const commands = this.getAllCommands();
    return commands.find((c: any) => c.id === commandId);
  },

  updateCommand(commandId: string, updates: any) {
    const data = readJSON(COMMANDS_FILE);
    const command = data.commands.find((c: any) => c.id === commandId);
    if (!command) return false;

    Object.assign(command, updates);
    return writeJSON(COMMANDS_FILE, data);
  },

  createCommand(id: string, trigger: string, response: string, category: string = "custom") {
    const data = readJSON(COMMANDS_FILE);

    if (data.commands.some((c: any) => c.id === id)) {
      throw new Error("Command already exists");
    }

    const newCommand = {
      id,
      trigger,
      response,
      category,
      createdAt: new Date().toISOString(),
    };

    data.commands.push(newCommand);
    return writeJSON(COMMANDS_FILE, data);
  },

  deleteCommand(commandId: string) {
    const data = readJSON(COMMANDS_FILE);
    data.commands = data.commands.filter((c: any) => c.id !== commandId);
    return writeJSON(COMMANDS_FILE, data);
  },
};

// Process management
export const ProcessManager = {
  getAllProcesses() {
    const data = readJSON(PROCESSES_FILE);
    return data?.processes || [];
  },

  getProcessByAccountId(accountId: string) {
    const processes = this.getAllProcesses();
    return processes.find((p: any) => p.accountId === accountId);
  },

  recordProcess(accountId: string, processId: number, uid: string) {
    const data = readJSON(PROCESSES_FILE);

    // Remove old process for this account if exists
    data.processes = data.processes.filter((p: any) => p.accountId !== accountId);

    const newProcess = {
      id: `proc_${Date.now()}`,
      accountId,
      processId,
      uid,
      startedAt: new Date().toISOString(),
    };

    data.processes.push(newProcess);
    return writeJSON(PROCESSES_FILE, data);
  },

  removeProcess(accountId: string) {
    const data = readJSON(PROCESSES_FILE);
    data.processes = data.processes.filter((p: any) => p.accountId !== accountId);
    return writeJSON(PROCESSES_FILE, data);
  },

  cleanupDeadProcesses(aliveProcessIds: number[]) {
    const data = readJSON(PROCESSES_FILE);
    data.processes = data.processes.filter((p: any) => aliveProcessIds.includes(p.processId));
    return writeJSON(PROCESSES_FILE, data);
  },
};
