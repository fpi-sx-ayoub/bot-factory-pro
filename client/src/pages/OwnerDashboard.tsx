import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Trash2, Lock } from "lucide-react";
import { useLocation } from "wouter";

export default function OwnerDashboard() {
  const [, setLocation] = useLocation();
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newPasswordEdit, setNewPasswordEdit] = useState("");

  // Queries
  const { data: users, refetch: refetchUsers } = trpc.owner.getAllUsers.useQuery();
  const { data: allAccounts } = trpc.accounts.getAllAccounts.useQuery();

  // Mutations
  const createUserMutation = trpc.owner.createUser.useMutation();
  const deleteUserMutation = trpc.owner.deleteUser.useMutation();
  const updatePasswordMutation = trpc.owner.updateUserPassword.useMutation();

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserMutation.mutateAsync({
        username: newUsername,
        password: newPassword,
      });
      toast.success("User created successfully!");
      setNewUsername("");
      setNewPassword("");
      setShowAddUser(false);
      refetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to create user");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUserMutation.mutateAsync({ userId });
      toast.success("User deleted!");
      refetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const handleUpdatePassword = async (userId: string) => {
    if (!newPasswordEdit) {
      toast.error("Please enter a new password");
      return;
    }
    try {
      await updatePasswordMutation.mutateAsync({
        userId,
        newPassword: newPasswordEdit,
      });
      toast.success("Password updated!");
      setEditingUserId(null);
      setNewPasswordEdit("");
      refetchUsers();
    } catch (error: any) {
      toast.error(error.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen bg-black text-neon-green">
      {/* Header */}
      <div className="border-b-2 border-neon-green/50 bg-black/80 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold drop-shadow-lg drop-shadow-neon-green/50">
              👑 Owner Control Panel
            </h1>
            <p className="text-neon-cyan text-sm">XcT x Team Bot Factory</p>
          </div>
          <Button
            onClick={() => setLocation("/dashboard")}
            className="cyberpunk-button-outline"
          >
            ← Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="cyberpunk-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neon-green/70 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-neon-green">
                  {users?.length || 0}
                </p>
              </div>
              <div className="text-4xl">👥</div>
            </div>
          </Card>

          <Card className="cyberpunk-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neon-green/70 text-sm">Total Accounts</p>
                <p className="text-3xl font-bold text-neon-cyan">
                  {allAccounts?.length || 0}
                </p>
              </div>
              <div className="text-4xl">🤖</div>
            </div>
          </Card>

          <Card className="cyberpunk-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neon-green/70 text-sm">System Status</p>
                <p className="text-3xl font-bold text-neon-green">🟢 Active</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-neon-green/50 animate-pulse"></div>
            </div>
          </Card>
        </div>

        {/* Add User Section */}
        {!showAddUser ? (
          <Button
            onClick={() => setShowAddUser(true)}
            className="cyberpunk-button mb-8 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New User
          </Button>
        ) : (
          <Card className="cyberpunk-card mb-8">
            <h2 className="text-xl font-bold mb-4">➕ Create New User</h2>
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Username</label>
                <Input
                  type="text"
                  placeholder="Enter username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="cyberpunk-input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Password</label>
                <Input
                  type="password"
                  placeholder="Enter password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="cyberpunk-input w-full"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="cyberpunk-button flex-1">
                  ✅ Create User
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="cyberpunk-button-outline flex-1"
                >
                  ❌ Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Users List */}
        <h2 className="text-2xl font-bold mb-4">👥 Registered Users</h2>
        {users && users.length > 0 ? (
          <div className="space-y-4">
            {users.map((user: any) => (
              <Card key={user.id} className="cyberpunk-card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-neon-green">
                        {user.username}
                      </h3>
                      {user.role === "owner" && (
                        <span className="text-xs bg-neon-green/20 text-neon-green px-2 py-1 rounded">
                          👑 Owner
                        </span>
                      )}
                      {user.role === "user" && (
                        <span className="text-xs bg-neon-cyan/20 text-neon-cyan px-2 py-1 rounded">
                          👤 User
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neon-green/50">
                      Created: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {editingUserId === user.id ? (
                      <div className="flex gap-2 items-center">
                        <Input
                          type="password"
                          placeholder="New password"
                          value={newPasswordEdit}
                          onChange={(e) => setNewPasswordEdit(e.target.value)}
                          className="cyberpunk-input w-32 text-sm"
                        />
                        <Button
                          onClick={() => handleUpdatePassword(user.id)}
                          className="cyberpunk-button text-sm"
                        >
                          ✅
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingUserId(null);
                            setNewPasswordEdit("");
                          }}
                          className="cyberpunk-button-outline text-sm"
                        >
                          ❌
                        </Button>
                      </div>
                    ) : (
                      <>
                        {user.role !== "owner" && (
                          <>
                            <Button
                              onClick={() => setEditingUserId(user.id)}
                              className="cyberpunk-button-outline text-sm"
                            >
                              <Lock className="w-4 h-4 mr-1" />
                              Reset Password
                            </Button>
                            <Button
                              onClick={() => handleDeleteUser(user.id)}
                              className="cyberpunk-button-outline text-sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="cyberpunk-card text-center py-8">
            <p className="text-neon-green/70">No users found</p>
          </Card>
        )}

        {/* Info Section */}
        <Card className="cyberpunk-card mt-8 bg-neon-green/5">
          <h3 className="text-lg font-bold mb-2">📋 System Information</h3>
          <div className="text-sm text-neon-green/70 space-y-1">
            <p>• Platform: XcT x Team Bot Factory v1.0</p>
            <p>• Data Storage: Local JSON Files</p>
            <p>• Bot Engine: G5.py (Free Fire)</p>
            <p>• Status: 🟢 Operational</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
