import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { UserManager, AccountManager, CommandManager } from "./data-manager";
import { botProcessManager } from "./bot-process-manager";
import { TRPCError } from "@trpc/server";

// Custom context for session-based auth
interface SessionUser {
  id: string;
  username: string;
  role: string;
}

// Session storage (in-memory for now, can be replaced with Redis)
const sessions = new Map<string, SessionUser>();

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(({ ctx }) => {
      // Check if user has session cookie
      const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
      if (!sessionId) return null;

      const user = sessions.get(sessionId);
      return user || null;
    }),

    login: publicProcedure
      .input(
        z.object({
          username: z.string().min(1),
          password: z.string().min(1),
        })
      )
      .mutation(({ input, ctx }) => {
        const isValid = UserManager.verifyPassword(input.username, input.password);
        if (!isValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid username or password",
          });
        }

        const user = UserManager.getUserByUsername(input.username);
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User not found",
          });
        }

        // Create session
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const sessionUser: SessionUser = {
          id: user.id,
          username: user.username,
          role: user.role,
        };

        sessions.set(sessionId, sessionUser);

        // Set session cookie
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionId, {
          ...cookieOptions,
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return {
          success: true,
          user: sessionUser,
        };
      }),

    logout: publicProcedure.mutation(({ ctx }) => {
      const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
      if (sessionId) {
        sessions.delete(sessionId);
      }

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    }),
  }),

  owner: router({
    // Get all users (owner only)
    getAllUsers: publicProcedure.query(({ ctx }) => {
      const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
      const user = sessions.get(sessionId || "");
      if (!user || user.role !== "owner") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Owner access required",
        });
      }
      const users = UserManager.getAllUsers();
      return users.map((u: any) => ({
        id: u.id,
        username: u.username,
        role: u.role,
        createdAt: u.createdAt,
      }));
    }),

    // Create new user (owner only)
    createUser: publicProcedure
      .input(
        z.object({
          username: z.string().min(3),
          password: z.string().min(6),
        })
      )
      .mutation(({ input, ctx }) => {
        const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
        const user = sessions.get(sessionId || "");
        if (!user || user.role !== "owner") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Owner access required",
          });
        }
        try {
          const user = UserManager.createUser(input.username, input.password, "user");
          return {
            success: true,
            user: {
              id: user.id,
              username: user.username,
              role: user.role,
            },
          };
        } catch (error: any) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }
      }),

    // Delete user (owner only)
    deleteUser: publicProcedure
      .input(z.object({ userId: z.string() }))
      .mutation(({ input, ctx }) => {
        const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
        const user = sessions.get(sessionId || "");
        if (!user || user.role !== "owner") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Owner access required",
          });
        }
        const success = UserManager.deleteUser(input.userId);
        return { success };
      }),

    // Update user password (owner only)
    updateUserPassword: publicProcedure
      .input(
        z.object({
          userId: z.string(),
          newPassword: z.string().min(6),
        })
      )
      .mutation(({ input, ctx }) => {
        const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
        const user = sessions.get(sessionId || "");
        if (!user || user.role !== "owner") {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Owner access required",
          });
        }
        const success = UserManager.updateUserPassword(input.userId, input.newPassword);
        return { success };
      }),
  }),

  accounts: router({
    // Get all accounts for current user
    getMyAccounts: publicProcedure.query(({ ctx }) => {
      const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
      const user = sessions.get(sessionId || "");

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }

      const accounts = AccountManager.getAccountsByUser(user.id);
      return accounts;
    }),

    // Get all accounts (owner only)
    getAllAccounts: publicProcedure.query(({ ctx }) => {
      const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
      const user = sessions.get(sessionId || "");
      if (!user || user.role !== "owner") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Owner access required",
        });
      }
      return AccountManager.getAllAccounts();
    }),

    // Create new account (authenticated users only)
    createAccount: publicProcedure
      .input(
        z.object({
          uid: z.string(),
          password: z.string(),
          accountName: z.string().optional(),
        })
      )
      .mutation(({ input, ctx }) => {
        const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
        const user = sessions.get(sessionId || "");

        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }

        try {
          const account = AccountManager.createAccount(
            user.id,
            input.uid,
            input.password,
            input.accountName
          );
          return {
            success: true,
            account,
          };
        } catch (error: any) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }
      }),

    // Delete account (authenticated users only)
    deleteAccount: publicProcedure
      .input(z.object({ accountId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
        const user = sessions.get(sessionId || "");
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }
        // Stop bot if running
        await botProcessManager.stopBot(input.accountId);

        const success = AccountManager.deleteAccount(input.accountId);
        return { success };
      }),

    // Start bot (authenticated users only)
    startBot: publicProcedure
      .input(z.object({ accountId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
        const user = sessions.get(sessionId || "");
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }
        const account = AccountManager.getAccountById(input.accountId);
        if (!account) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Account not found",
          });
        }

        const success = await botProcessManager.startBot(
          input.accountId,
          account.uid,
          account.password
        );

        return { success };
      }),

    // Stop bot (authenticated users only)
    stopBot: publicProcedure
      .input(z.object({ accountId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
        const user = sessions.get(sessionId || "");
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }
        const success = await botProcessManager.stopBot(input.accountId);
        return { success };
      }),

    // Get bot status
    getBotStatus: publicProcedure
      .input(z.object({ accountId: z.string() }))
      .query(({ input }) => {
        const status = botProcessManager.getBotStatus(input.accountId);
        return { status };
      }),

    // Get all running bots (authenticated users only)
    getRunningBots: publicProcedure.query(({ ctx }) => {
      const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
      const user = sessions.get(sessionId || "");
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }
      return botProcessManager.getRunningBots();
    }),
  }),

  friends: router({
    // Add friend request (authenticated users only)
    sendFriendRequest: publicProcedure
      .input(
        z.object({
          accountId: z.string(),
          targetUid: z.string(),
        })
      )
      .mutation(({ input, ctx }) => {
        const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
        const user = sessions.get(sessionId || "");
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }
        const success = AccountManager.addFriend(input.accountId, input.targetUid);
        return { success };
      }),

    // Accept friend request (authenticated users only)
    acceptFriendRequest: publicProcedure
      .input(
        z.object({
          accountId: z.string(),
          requesterUid: z.string(),
        })
      )
      .mutation(({ input, ctx }) => {
        const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
        const user = sessions.get(sessionId || "");
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }
        AccountManager.removeFriendRequest(input.accountId, input.requesterUid);
        const success = AccountManager.addFriend(input.accountId, input.requesterUid);
        return { success };
      }),

    // Reject friend request (authenticated users only)
    rejectFriendRequest: publicProcedure
      .input(
        z.object({
          accountId: z.string(),
          requesterUid: z.string(),
        })
      )
      .mutation(({ input, ctx }) => {
        const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
        const user = sessions.get(sessionId || "");
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }
        const success = AccountManager.removeFriendRequest(
          input.accountId,
          input.requesterUid
        );
        return { success };
      }),

    // Remove friend (authenticated users only)
    removeFriend: publicProcedure
      .input(
        z.object({
          accountId: z.string(),
          friendUid: z.string(),
        })
      )
      .mutation(({ input, ctx }) => {
        const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
        const user = sessions.get(sessionId || "");
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }
        const success = AccountManager.removeFriend(input.accountId, input.friendUid);
        return { success };
      }),

    // Get account friends (authenticated users only)
    getAccountFriends: publicProcedure
      .input(z.object({ accountId: z.string() }))
      .query(({ input, ctx }) => {
        const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
        const user = sessions.get(sessionId || "");
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }
        const account = AccountManager.getAccountById(input.accountId);
        return {
          friends: account?.friends || [],
          friendRequests: account?.friendRequests || [],
        };
      }),
  }),

  commands: router({
    // Get all commands (authenticated users only)
    getAllCommands: publicProcedure.query(({ ctx }) => {
      const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
      const user = sessions.get(sessionId || "");
      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authenticated",
        });
      }
      return CommandManager.getAllCommands();
    }),

    // Update command (authenticated users only)
    updateCommand: publicProcedure
      .input(
        z.object({
          commandId: z.string(),
          response: z.string(),
        })
      )
      .mutation(({ input, ctx }) => {
        const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
        const user = sessions.get(sessionId || "");
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }
        const success = CommandManager.updateCommand(input.commandId, {
          response: input.response,
        });
        return { success };
      }),

    // Create custom command (authenticated users only)
    createCommand: publicProcedure
      .input(
        z.object({
          id: z.string(),
          trigger: z.string(),
          response: z.string(),
        })
      )
      .mutation(({ input, ctx }) => {
        const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
        const user = sessions.get(sessionId || "");
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }
        try {
          const success = CommandManager.createCommand(
            input.id,
            input.trigger,
            input.response,
            "custom"
          );
          return { success };
        } catch (error: any) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: error.message,
          });
        }
      }),

    // Delete command (authenticated users only)
    deleteCommand: publicProcedure
      .input(z.object({ commandId: z.string() }))
      .mutation(({ input, ctx }) => {
        const sessionId = (ctx.req as any).cookies?.[COOKIE_NAME];
        const user = sessions.get(sessionId || "");
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Not authenticated",
          });
        }
        const success = CommandManager.deleteCommand(input.commandId);
        return { success };
      }),
  }),
});

export type AppRouter = typeof appRouter;
