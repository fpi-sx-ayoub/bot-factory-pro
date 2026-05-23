import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

function createAuthContext(): any {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
      cookies: {},
    },
    res: {
      clearCookie: () => {},
      setHeader: () => {},
      cookie: () => {},
    },
  };
}

describe("auth.login", () => {
  it("should successfully login with owner credentials", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const loginResult = await caller.auth.login({
      username: "xCTx_AyOuB",
      password: "owner_password",
    });

    expect(loginResult.success).toBe(true);
    expect(loginResult.user?.username).toBe("xCTx_AyOuB");
    expect(loginResult.user?.role).toBe("owner");
  });

  it("should fail login with invalid password", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.login({
        username: "xCTx_AyOuB",
        password: "wrongpassword",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid");
    }
  });

  it("should fail login with non-existent user", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.auth.login({
        username: "nonexistent",
        password: "password123",
      });
      expect.fail("Should have thrown error");
    } catch (error: any) {
      expect(error.message).toContain("Invalid");
    }
  });
});

describe("auth.me", () => {
  it("should return null if not authenticated", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const meResult = await caller.auth.me();
    expect(meResult).toBeNull();
  });
});
