import { spawn, ChildProcess } from "child_process";
import * as path from "path";
import { AccountManager, ProcessManager } from "./data-manager";

interface BotProcess {
  accountId: string;
  process: ChildProcess;
  uid: string;
  password: string;
  startTime: Date;
}

class BotProcessManager {
  private processes: Map<string, BotProcess> = new Map();
  private botAminePath: string;

  constructor() {
    this.botAminePath = path.join(process.cwd(), "bot-amine");
  }

  /**
   * Start a bot process for a given account
   */
  async startBot(accountId: string, uid: string, password: string): Promise<boolean> {
    try {
      // Check if already running
      if (this.processes.has(accountId)) {
        console.warn(`Bot for account ${accountId} is already running`);
        return false;
      }

      // Spawn G5.py process with environment variables
      const env = {
        ...process.env,
        BOT_UID: uid,
        BOT_PASSWORD: password,
        BOT_ACCOUNT_ID: accountId,
        PYTHONUNBUFFERED: "1",
      };

      const pythonProcess = spawn("python3", [path.join(this.botAminePath, "G5_wrapper.py")], {
        env,
        cwd: this.botAminePath,
        stdio: ["pipe", "pipe", "pipe"],
      });

      // Handle process output
      pythonProcess.stdout?.on("data", (data) => {
        console.log(`[BOT ${uid}] STDOUT:`, data.toString());
      });

      pythonProcess.stderr?.on("data", (data) => {
        console.error(`[BOT ${uid}] STDERR:`, data.toString());
      });

      pythonProcess.on("error", (error) => {
        console.error(`[BOT ${uid}] Process error:`, error);
        this.processes.delete(accountId);
        AccountManager.updateAccountStatus(accountId, "error");
      });

      pythonProcess.on("exit", (code) => {
        console.log(`[BOT ${uid}] Process exited with code ${code}`);
        this.processes.delete(accountId);
        AccountManager.updateAccountStatus(accountId, "stopped");
        ProcessManager.removeProcess(accountId);
      });

      // Store process reference
      const botProcess: BotProcess = {
        accountId,
        process: pythonProcess,
        uid,
        password,
        startTime: new Date(),
      };

      this.processes.set(accountId, botProcess);

      // Update account status in database
      const pid = pythonProcess.pid || 0;
      AccountManager.updateAccountStatus(accountId, "running", pid);
      ProcessManager.recordProcess(accountId, pid, uid);

      console.log(`✅ Bot started for account ${uid} (PID: ${pid})`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to start bot for account ${accountId}:`, error);
      AccountManager.updateAccountStatus(accountId, "error");
      return false;
    }
  }

  /**
   * Stop a bot process
   */
  async stopBot(accountId: string): Promise<boolean> {
    try {
      const botProcess = this.processes.get(accountId);
      if (!botProcess) {
        console.warn(`Bot process for account ${accountId} not found`);
        return false;
      }

      // Kill the process
      botProcess.process.kill("SIGTERM");

      // Wait a bit for graceful shutdown
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Force kill if still running
      if (!botProcess.process.killed) {
        botProcess.process.kill("SIGKILL");
      }

      this.processes.delete(accountId);
      AccountManager.updateAccountStatus(accountId, "stopped", null);
      ProcessManager.removeProcess(accountId);

      console.log(`✅ Bot stopped for account ${accountId}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to stop bot for account ${accountId}:`, error);
      return false;
    }
  }

  /**
   * Restart a bot process
   */
  async restartBot(accountId: string): Promise<boolean> {
    const botProcess = this.processes.get(accountId);
    if (!botProcess) {
      console.warn(`Bot process for account ${accountId} not found`);
      return false;
    }

    await this.stopBot(accountId);
    await new Promise((resolve) => setTimeout(resolve, 500));

    return this.startBot(accountId, botProcess.uid, botProcess.password);
  }

  /**
   * Get status of a bot process
   */
  getBotStatus(accountId: string): string {
    const botProcess = this.processes.get(accountId);
    if (!botProcess) return "stopped";

    if (botProcess.process.killed) return "stopped";
    return "running";
  }

  /**
   * Get all running bots
   */
  getRunningBots(): Array<{ accountId: string; uid: string; uptime: number }> {
    const running: Array<{ accountId: string; uid: string; uptime: number }> = [];

    this.processes.forEach((bot) => {
      const uptime = Date.now() - bot.startTime.getTime();
      running.push({
        accountId: bot.accountId,
        uid: bot.uid,
        uptime,
      });
    });

    return running;
  }

  /**
   * Stop all bots (useful for graceful shutdown)
   */
  async stopAllBots(): Promise<void> {
    const promises: Promise<boolean>[] = [];

    this.processes.forEach((bot) => {
      promises.push(this.stopBot(bot.accountId));
    });

    await Promise.all(promises);
  }

  /**
   * Cleanup dead processes from tracking
   */
  cleanupDeadProcesses(): void {
    const aliveProcessIds: number[] = [];

    this.processes.forEach((bot) => {
      if (!bot.process.killed && bot.process.pid) {
        aliveProcessIds.push(bot.process.pid);
      }
    });

    ProcessManager.cleanupDeadProcesses(aliveProcessIds);
  }
}

// Export singleton instance
export const botProcessManager = new BotProcessManager();
