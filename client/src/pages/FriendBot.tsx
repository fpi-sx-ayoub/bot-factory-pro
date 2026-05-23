import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Send, Trash2, Check, X, Users } from "lucide-react";

export default function FriendBot() {
  const [, setLocation] = useLocation();
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [targetUid, setTargetUid] = useState("");
  const [showSendRequest, setShowSendRequest] = useState(false);

  // Queries
  const { data: accounts } = trpc.accounts.getMyAccounts.useQuery();
  const { data: friendData, refetch: refetchFriends } = trpc.friends.getAccountFriends.useQuery(
    { accountId: selectedAccountId },
    { enabled: !!selectedAccountId }
  );

  // Mutations
  const sendFriendRequestMutation = trpc.friends.sendFriendRequest.useMutation();
  const acceptFriendRequestMutation = trpc.friends.acceptFriendRequest.useMutation();
  const rejectFriendRequestMutation = trpc.friends.rejectFriendRequest.useMutation();
  const removeFriendMutation = trpc.friends.removeFriend.useMutation();

  // Set first account as default
  useEffect(() => {
    if (accounts && accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].id);
    }
  }, [accounts]);

  const handleSendFriendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAccountId || !targetUid) {
      toast.error("Please select an account and enter a UID");
      return;
    }

    try {
      await sendFriendRequestMutation.mutateAsync({
        accountId: selectedAccountId,
        targetUid,
      });
      toast.success("Friend request sent!");
      setTargetUid("");
      setShowSendRequest(false);
      refetchFriends();
    } catch (error: any) {
      toast.error(error.message || "Failed to send friend request");
    }
  };

  const handleAcceptFriendRequest = async (requesterUid: string) => {
    if (!selectedAccountId) return;
    try {
      await acceptFriendRequestMutation.mutateAsync({
        accountId: selectedAccountId,
        requesterUid,
      });
      toast.success("Friend request accepted!");
      refetchFriends();
    } catch (error: any) {
      toast.error(error.message || "Failed to accept friend request");
    }
  };

  const handleRejectFriendRequest = async (requesterUid: string) => {
    if (!selectedAccountId) return;
    try {
      await rejectFriendRequestMutation.mutateAsync({
        accountId: selectedAccountId,
        requesterUid,
      });
      toast.success("Friend request rejected!");
      refetchFriends();
    } catch (error: any) {
      toast.error(error.message || "Failed to reject friend request");
    }
  };

  const handleRemoveFriend = async (friendUid: string) => {
    if (!selectedAccountId) return;
    if (!confirm("Are you sure you want to remove this friend?")) return;

    try {
      await removeFriendMutation.mutateAsync({
        accountId: selectedAccountId,
        friendUid,
      });
      toast.success("Friend removed!");
      refetchFriends();
    } catch (error: any) {
      toast.error(error.message || "Failed to remove friend");
    }
  };

  return (
    <div className="min-h-screen bg-black text-neon-green">
      {/* Header */}
      <div className="border-b-2 border-neon-green/50 bg-black/80 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold drop-shadow-lg drop-shadow-neon-green/50">
              👥 Friend Bot Manager
            </h1>
            <p className="text-neon-cyan text-sm">Manage friend requests and connections</p>
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
        {/* Account Selector */}
        {accounts && accounts.length > 0 && (
          <Card className="cyberpunk-card mb-8">
            <h2 className="text-lg font-bold mb-4">🎯 Select Account</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {accounts.map((account: any) => (
                <Button
                  key={account.id}
                  onClick={() => setSelectedAccountId(account.id)}
                  className={`text-left ${
                    selectedAccountId === account.id
                      ? "cyberpunk-button"
                      : "cyberpunk-button-outline"
                  }`}
                >
                  <div>
                    <p className="font-bold">{account.accountName}</p>
                    <p className="text-xs opacity-70">UID: {account.uid}</p>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        )}

        {selectedAccountId && (
          <>
            {/* Send Friend Request Section */}
            {!showSendRequest ? (
              <Button
                onClick={() => setShowSendRequest(true)}
                className="cyberpunk-button mb-8 text-lg"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Friend Request
              </Button>
            ) : (
              <Card className="cyberpunk-card mb-8">
                <h2 className="text-xl font-bold mb-4">📤 Send Friend Request</h2>
                <form onSubmit={handleSendFriendRequest} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Target UID</label>
                    <Input
                      type="text"
                      placeholder="Enter target player UID"
                      value={targetUid}
                      onChange={(e) => setTargetUid(e.target.value)}
                      className="cyberpunk-input w-full"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" className="cyberpunk-button flex-1">
                      ✅ Send Request
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setShowSendRequest(false)}
                      className="cyberpunk-button-outline flex-1"
                    >
                      ❌ Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {/* Friend Requests Section */}
            {friendData && friendData.friendRequests.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">📬 Incoming Friend Requests</h2>
                <div className="space-y-3">
                  {friendData.friendRequests.map((requesterUid: string) => (
                    <Card key={requesterUid} className="cyberpunk-card">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-neon-green">Request from</p>
                          <p className="text-neon-cyan">{requesterUid}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAcceptFriendRequest(requesterUid)}
                            className="cyberpunk-button text-sm"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleRejectFriendRequest(requesterUid)}
                            className="cyberpunk-button-outline text-sm"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Friends List Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">
                👫 Friends ({friendData?.friends.length || 0})
              </h2>
              {friendData && friendData.friends.length > 0 ? (
                <div className="space-y-3">
                  {friendData.friends.map((friendUid: string) => (
                    <Card key={friendUid} className="cyberpunk-card">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-neon-green">Friend</p>
                          <p className="text-neon-cyan">{friendUid}</p>
                        </div>
                        <Button
                          onClick={() => handleRemoveFriend(friendUid)}
                          className="cyberpunk-button-outline text-sm"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="cyberpunk-card text-center py-8">
                  <Users className="w-12 h-12 mx-auto mb-2 text-neon-green/50" />
                  <p className="text-neon-green/70">No friends yet</p>
                  <p className="text-neon-green/50 text-sm mt-2">
                    Send friend requests to add friends
                  </p>
                </Card>
              )}
            </div>
          </>
        )}

        {!selectedAccountId && (
          <Card className="cyberpunk-card text-center py-8">
            <p className="text-neon-green/70">No accounts available</p>
            <p className="text-neon-green/50 text-sm mt-2">
              Add an account first to manage friends
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
