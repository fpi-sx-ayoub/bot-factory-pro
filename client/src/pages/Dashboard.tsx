import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Trash2, Power, PowerOff, Users, Settings, Users2, Zap } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [uid, setUid] = useState("");
  const [password, setPassword] = useState("");
  const [accountName, setAccountName] = useState("");

  // Queries
  const { data: accounts, refetch: refetchAccounts } =
    trpc.accounts.getMyAccounts.useQuery();
  const { data: runningBots } = trpc.accounts.getRunningBots.useQuery();

  // Mutations
  const createAccountMutation = trpc.accounts.createAccount.useMutation();
  const startBotMutation = trpc.accounts.startBot.useMutation();
  const stopBotMutation = trpc.accounts.stopBot.useMutation();
  const deleteAccountMutation = trpc.accounts.deleteAccount.useMutation();

  const handleAddAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAccountMutation.mutateAsync({
        uid,
        password,
        accountName: accountName || undefined,
      });
      toast.success("Account added successfully!");
      setUid("");
      setPassword("");
      setAccountName("");
      setShowAddAccount(false);
      refetchAccounts();
    } catch (error: any) {
      toast.error(error.message || "Failed to add account");
    }
  };

  const handleStartBot = async (accountId: string) => {
    try {
      await startBotMutation.mutateAsync({ accountId });
      toast.success("Bot started!");
      refetchAccounts();
    } catch (error: any) {
      toast.error(error.message || "Failed to start bot");
    }
  };

  const handleStopBot = async (accountId: string) => {
    try {
      await stopBotMutation.mutateAsync({ accountId });
      toast.success("Bot stopped!");
      refetchAccounts();
    } catch (error: any) {
      toast.error(error.message || "Failed to stop bot");
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (!confirm("Are you sure you want to delete this account?")) return;
    try {
      await deleteAccountMutation.mutateAsync({ accountId });
      toast.success("Account deleted!");
      refetchAccounts();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete account");
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-black text-neon-green">
      {/* Header */}
      <div className="border-b-2 border-neon-green/50 bg-black/80 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold drop-shadow-lg drop-shadow-neon-green/50">
              ⚡ XcT x Team
            </h1>
            <p className="text-neon-cyan text-sm">Bot Factory Dashboard</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <div className="text-right">
              <p className="text-sm text-neon-green/70">Logged in as</p>
              <p className="font-bold text-neon-green">{user?.username}</p>
            </div>
            <Button
              onClick={() => setLocation("/friends")}
              className="cyberpunk-button-outline text-sm"
            >
              <Users2 className="w-4 h-4 mr-2" />
              Friends
            </Button>
            <Button
              onClick={() => setLocation("/commands")}
              className="cyberpunk-button-outline text-sm"
            >
              <Zap className="w-4 h-4 mr-2" />
              Commands
            </Button>
            {user?.role === "owner" && (
              <Button
                onClick={() => setLocation("/owner")}
                className="cyberpunk-button-outline text-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Owner Panel
              </Button>
            )}
            <Button onClick={handleLogout} className="cyberpunk-button-outline text-sm">
              🚪 Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="cyberpunk-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neon-green/70 text-sm">Total Accounts</p>
                <p className="text-3xl font-bold text-neon-green">
                  {accounts?.length || 0}
                </p>
              </div>
              <Users className="w-8 h-8 text-neon-cyan" />
            </div>
          </Card>

          <Card className="cyberpunk-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neon-green/70 text-sm">Running Bots</p>
                <p className="text-3xl font-bold text-neon-cyan">
                  {runningBots?.length || 0}
                </p>
              </div>
              <Power className="w-8 h-8 text-neon-green" />
            </div>
          </Card>

          <Card className="cyberpunk-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neon-green/70 text-sm">Status</p>
                <p className="text-3xl font-bold text-neon-green">🟢 Online</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-neon-green/50 animate-pulse"></div>
            </div>
          </Card>
        </div>

        {/* Add Account Section */}
        {!showAddAccount ? (
          <Button
            onClick={() => setShowAddAccount(true)}
            className="cyberpunk-button mb-8 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Account
          </Button>
        ) : (
          <Card className="cyberpunk-card mb-8">
            <h2 className="text-xl font-bold mb-4">➕ Add New Account</h2>
            <form onSubmit={handleAddAccount} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Account UID</label>
                <Input
                  type="text"
                  placeholder="Enter Free Fire UID"
                  value={uid}
                  onChange={(e) => setUid(e.target.value)}
                  className="cyberpunk-input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="Enter account password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="cyberpunk-input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">
                  Account Name (Optional)
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Main Account"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="cyberpunk-input w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="cyberpunk-button flex-1">
                  ✅ Add Account
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddAccount(false)}
                  className="cyberpunk-button-outline flex-1"
                >
                  ❌ Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Accounts List */}
        <h2 className="text-2xl font-bold mb-4">📋 Your Accounts</h2>
        {accounts && accounts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account: any) => (
              <Card key={account.id} className="cyberpunk-card">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-neon-green">
                      {account.accountName}
                    </h3>
                    <p className="text-sm text-neon-green/70">UID: {account.uid}</p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      account.status === "running"
                        ? "bg-neon-green animate-pulse"
                        : "bg-neon-green/30"
                    }`}
                  ></div>
                </div>

                <div className="mb-4 text-xs text-neon-green/50">
                  <p>Status: {account.status}</p>
                  <p>
                    Created:{" "}
                    {new Date(account.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex gap-2">
                  {account.status === "running" ? (
                    <Button
                      onClick={() => handleStopBot(account.id)}
                      className="cyberpunk-button-outline flex-1 text-sm"
                    >
                      <PowerOff className="w-4 h-4 mr-1" />
                      Stop
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleStartBot(account.id)}
                      className="cyberpunk-button flex-1 text-sm"
                    >
                      <Power className="w-4 h-4 mr-1" />
                      Start
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDeleteAccount(account.id)}
                    className="cyberpunk-button-outline flex-1 text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="cyberpunk-card text-center py-8">
            <p className="text-neon-green/70">No accounts added yet</p>
            <p className="text-neon-green/50 text-sm mt-2">
              Add your first account to get started
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
