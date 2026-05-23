import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

export default function CommandsEditor() {
  const [, setLocation] = useLocation();
  const [showAddCommand, setShowAddCommand] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCommandId, setNewCommandId] = useState("");
  const [newTrigger, setNewTrigger] = useState("");
  const [newResponse, setNewResponse] = useState("");
  const [editResponse, setEditResponse] = useState("");

  // Queries
  const { data: commands, refetch: refetchCommands } = trpc.commands.getAllCommands.useQuery();

  // Mutations
  const createCommandMutation = trpc.commands.createCommand.useMutation();
  const updateCommandMutation = trpc.commands.updateCommand.useMutation();
  const deleteCommandMutation = trpc.commands.deleteCommand.useMutation();

  const handleAddCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createCommandMutation.mutateAsync({
        id: newCommandId,
        trigger: newTrigger,
        response: newResponse,
      });
      toast.success("Command created successfully!");
      setNewCommandId("");
      setNewTrigger("");
      setNewResponse("");
      setShowAddCommand(false);
      refetchCommands();
    } catch (error: any) {
      toast.error(error.message || "Failed to create command");
    }
  };

  const handleUpdateCommand = async (commandId: string) => {
    try {
      await updateCommandMutation.mutateAsync({
        commandId,
        response: editResponse,
      });
      toast.success("Command updated!");
      setEditingId(null);
      setEditResponse("");
      refetchCommands();
    } catch (error: any) {
      toast.error(error.message || "Failed to update command");
    }
  };

  const handleDeleteCommand = async (commandId: string) => {
    if (!confirm("Are you sure you want to delete this command?")) return;
    try {
      await deleteCommandMutation.mutateAsync({ commandId });
      toast.success("Command deleted!");
      refetchCommands();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete command");
    }
  };

  const startEditing = (commandId: string, currentResponse: string) => {
    setEditingId(commandId);
    setEditResponse(currentResponse);
  };

  return (
    <div className="min-h-screen bg-black text-neon-green">
      {/* Header */}
      <div className="border-b-2 border-neon-green/50 bg-black/80 sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold drop-shadow-lg drop-shadow-neon-green/50">
              ⚙️ Bot Commands Editor
            </h1>
            <p className="text-neon-cyan text-sm">Customize bot responses and triggers</p>
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
        {/* Add Command Section */}
        {!showAddCommand ? (
          <Button
            onClick={() => setShowAddCommand(true)}
            className="cyberpunk-button mb-8 text-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Custom Command
          </Button>
        ) : (
          <Card className="cyberpunk-card mb-8">
            <h2 className="text-xl font-bold mb-4">➕ Create New Command</h2>
            <form onSubmit={handleAddCommand} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Command ID</label>
                <Input
                  type="text"
                  placeholder="e.g., custom_greet"
                  value={newCommandId}
                  onChange={(e) => setNewCommandId(e.target.value)}
                  className="cyberpunk-input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Trigger</label>
                <Input
                  type="text"
                  placeholder="e.g., /greet or @hello"
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="cyberpunk-input w-full"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Response Message</label>
                <textarea
                  placeholder="Enter bot response message..."
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  className="cyberpunk-input w-full h-24"
                  required
                ></textarea>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="cyberpunk-button flex-1">
                  ✅ Create Command
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAddCommand(false)}
                  className="cyberpunk-button-outline flex-1"
                >
                  ❌ Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Commands List */}
        <h2 className="text-2xl font-bold mb-4">📋 Bot Commands</h2>
        {commands && commands.length > 0 ? (
          <div className="space-y-4">
            {commands.map((command: any) => (
              <Card key={command.id} className="cyberpunk-card">
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-neon-green">{command.trigger}</h3>
                      <p className="text-sm text-neon-green/50">ID: {command.id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-neon-cyan/20 text-neon-cyan px-2 py-1 rounded">
                        {command.category}
                      </span>
                    </div>
                  </div>

                  {editingId === command.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editResponse}
                        onChange={(e) => setEditResponse(e.target.value)}
                        className="cyberpunk-input w-full h-20"
                      ></textarea>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUpdateCommand(command.id)}
                          className="cyberpunk-button flex-1 text-sm"
                        >
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingId(null);
                            setEditResponse("");
                          }}
                          className="cyberpunk-button-outline flex-1 text-sm"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="bg-black/50 border border-neon-green/30 rounded p-3 mb-3">
                        <p className="text-sm text-neon-green/70 mb-1">Response:</p>
                        <p className="text-neon-green whitespace-pre-wrap">{command.response}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => startEditing(command.id, command.response)}
                          className="cyberpunk-button-outline flex-1 text-sm"
                        >
                          <Edit2 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        {command.category === "custom" && (
                          <Button
                            onClick={() => handleDeleteCommand(command.id)}
                            className="cyberpunk-button-outline flex-1 text-sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="cyberpunk-card text-center py-8">
            <p className="text-neon-green/70">No commands available</p>
          </Card>
        )}

        {/* Info Section */}
        <Card className="cyberpunk-card mt-8 bg-neon-green/5">
          <h3 className="text-lg font-bold mb-2">📖 Command Syntax Guide</h3>
          <div className="text-sm text-neon-green/70 space-y-2">
            <p>• <span className="text-neon-green">/command</span> - Slash commands (e.g., /help)</p>
            <p>• <span className="text-neon-green">@command</span> - At commands (e.g., @status)</p>
            <p>• Response can include color codes: <span className="text-neon-green">[FF0000]</span> for red</p>
            <p>• Use <span className="text-neon-green">[B]</span> for bold text</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
