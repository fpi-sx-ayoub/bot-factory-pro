import { describe, it, expect, beforeEach } from "vitest";
import * as fs from "fs";
import * as path from "path";

// Mock data directory for testing
const testDataDir = path.join(__dirname, "../test-data");

describe("Data Manager - JSON Persistence", () => {
  beforeEach(() => {
    // Clean up test data before each test
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true });
    }
    fs.mkdirSync(testDataDir, { recursive: true });
  });

  describe("User Manager", () => {
    it("should create and persist user to JSON", () => {
      const usersFile = path.join(testDataDir, "users.json");

      // Create a test user object
      const testUser = {
        id: "user-1",
        username: "testuser",
        password: "hashed_password",
        role: "user",
        createdAt: new Date().toISOString(),
      };

      // Write to file
      fs.writeFileSync(usersFile, JSON.stringify([testUser], null, 2));

      // Read back and verify
      const data = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
      expect(data).toHaveLength(1);
      expect(data[0].username).toBe("testuser");
      expect(data[0].role).toBe("user");
    });

    it("should read multiple users from JSON", () => {
      const usersFile = path.join(testDataDir, "users.json");

      const testUsers = [
        {
          id: "user-1",
          username: "user1",
          password: "hash1",
          role: "user",
          createdAt: new Date().toISOString(),
        },
        {
          id: "user-2",
          username: "user2",
          password: "hash2",
          role: "user",
          createdAt: new Date().toISOString(),
        },
      ];

      fs.writeFileSync(usersFile, JSON.stringify(testUsers, null, 2));

      const data = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
      expect(data).toHaveLength(2);
      expect(data[0].username).toBe("user1");
      expect(data[1].username).toBe("user2");
    });

    it("should update user in JSON", () => {
      const usersFile = path.join(testDataDir, "users.json");

      const testUser = {
        id: "user-1",
        username: "testuser",
        password: "old_hash",
        role: "user",
        createdAt: new Date().toISOString(),
      };

      fs.writeFileSync(usersFile, JSON.stringify([testUser], null, 2));

      // Update the user
      const data = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
      data[0].password = "new_hash";
      fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));

      // Verify update
      const updated = JSON.parse(fs.readFileSync(usersFile, "utf-8"));
      expect(updated[0].password).toBe("new_hash");
    });
  });

  describe("Account Manager", () => {
    it("should create and persist account to JSON", () => {
      const accountsFile = path.join(testDataDir, "accounts.json");

      const testAccount = {
        id: "acc-1",
        userId: "user-1",
        uid: "12345",
        accountName: "Main Account",
        status: "stopped",
        friends: [],
        friendRequests: [],
        createdAt: new Date().toISOString(),
      };

      fs.writeFileSync(accountsFile, JSON.stringify([testAccount], null, 2));

      const data = JSON.parse(fs.readFileSync(accountsFile, "utf-8"));
      expect(data).toHaveLength(1);
      expect(data[0].uid).toBe("12345");
      expect(data[0].status).toBe("stopped");
    });

    it("should handle friend requests in account JSON", () => {
      const accountsFile = path.join(testDataDir, "accounts.json");

      const testAccount = {
        id: "acc-1",
        userId: "user-1",
        uid: "12345",
        accountName: "Main Account",
        status: "running",
        friends: ["friend-1", "friend-2"],
        friendRequests: ["requester-1"],
        createdAt: new Date().toISOString(),
      };

      fs.writeFileSync(accountsFile, JSON.stringify([testAccount], null, 2));

      const data = JSON.parse(fs.readFileSync(accountsFile, "utf-8"));
      expect(data[0].friends).toContain("friend-1");
      expect(data[0].friendRequests).toContain("requester-1");
    });

    it("should update account status in JSON", () => {
      const accountsFile = path.join(testDataDir, "accounts.json");

      const testAccount = {
        id: "acc-1",
        userId: "user-1",
        uid: "12345",
        accountName: "Main Account",
        status: "stopped",
        friends: [],
        friendRequests: [],
        createdAt: new Date().toISOString(),
      };

      fs.writeFileSync(accountsFile, JSON.stringify([testAccount], null, 2));

      // Update status
      const data = JSON.parse(fs.readFileSync(accountsFile, "utf-8"));
      data[0].status = "running";
      fs.writeFileSync(accountsFile, JSON.stringify(data, null, 2));

      const updated = JSON.parse(fs.readFileSync(accountsFile, "utf-8"));
      expect(updated[0].status).toBe("running");
    });
  });

  describe("Commands Manager", () => {
    it("should persist bot commands to JSON", () => {
      const commandsFile = path.join(testDataDir, "commands.json");

      const testCommands = [
        {
          id: "help",
          trigger: "/help",
          response: "Help message",
          category: "default",
        },
        {
          id: "status",
          trigger: "@status",
          response: "Bot is online",
          category: "default",
        },
      ];

      fs.writeFileSync(commandsFile, JSON.stringify(testCommands, null, 2));

      const data = JSON.parse(fs.readFileSync(commandsFile, "utf-8"));
      expect(data).toHaveLength(2);
      expect(data[0].trigger).toBe("/help");
      expect(data[1].trigger).toBe("@status");
    });

    it("should update command response in JSON", () => {
      const commandsFile = path.join(testDataDir, "commands.json");

      const testCommand = {
        id: "help",
        trigger: "/help",
        response: "Old help message",
        category: "default",
      };

      fs.writeFileSync(commandsFile, JSON.stringify([testCommand], null, 2));

      // Update response
      const data = JSON.parse(fs.readFileSync(commandsFile, "utf-8"));
      data[0].response = "New help message";
      fs.writeFileSync(commandsFile, JSON.stringify(data, null, 2));

      const updated = JSON.parse(fs.readFileSync(commandsFile, "utf-8"));
      expect(updated[0].response).toBe("New help message");
    });

    it("should add custom command to JSON", () => {
      const commandsFile = path.join(testDataDir, "commands.json");

      const testCommands = [
        {
          id: "help",
          trigger: "/help",
          response: "Help message",
          category: "default",
        },
      ];

      fs.writeFileSync(commandsFile, JSON.stringify(testCommands, null, 2));

      // Add new command
      const data = JSON.parse(fs.readFileSync(commandsFile, "utf-8"));
      data.push({
        id: "custom_greet",
        trigger: "/greet",
        response: "Hello friend!",
        category: "custom",
      });
      fs.writeFileSync(commandsFile, JSON.stringify(data, null, 2));

      const updated = JSON.parse(fs.readFileSync(commandsFile, "utf-8"));
      expect(updated).toHaveLength(2);
      expect(updated[1].category).toBe("custom");
    });
  });
});
