import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Lock, User } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const loginMutation = trpc.auth.login.useMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginMutation.mutateAsync({
        username,
        password,
      });

      if (result.success) {
        toast.success(`Welcome, ${result.user.username}!`);
        setLocation("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-neon-green flex items-center justify-center px-4">
      {/* Background effects */}
      <div className="fixed inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-green/20 to-transparent"></div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md bg-black/80 border-2 border-neon-green shadow-2xl shadow-neon-green/50 relative z-10">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl font-bold mb-2 drop-shadow-lg drop-shadow-neon-green/50">
              ⚡ XcT x Team
            </div>
            <div className="text-neon-cyan text-sm drop-shadow-lg drop-shadow-neon-cyan/50">
              Bot Factory Pro
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-bold mb-2 text-neon-green">
                <User className="inline w-4 h-4 mr-2" />
                Username
              </label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="cyberpunk-input w-full"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold mb-2 text-neon-green">
                <Lock className="inline w-4 h-4 mr-2" />
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="cyberpunk-input w-full"
                disabled={isLoading}
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              className="w-full cyberpunk-button mt-6 text-lg font-bold"
              disabled={isLoading}
            >
              {isLoading ? "🔄 Logging in..." : "🔐 Login"}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-neon-green/10 border border-neon-green/30 rounded text-xs text-neon-green/70">
            <p className="font-bold mb-1">Demo Credentials:</p>
            <p>Username: <span className="text-neon-green">xCTx_AyOuB</span></p>
            <p>Password: <span className="text-neon-green">owner_password</span></p>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center text-neon-green/50 text-xs">
            <p>🔒 Secure Login | Local Authentication</p>
          </div>
        </div>
      </Card>

      {/* Decorative elements */}
      <div className="fixed top-8 right-8 w-12 h-12 border-2 border-neon-cyan animate-pulse"></div>
      <div className="fixed bottom-8 left-8 w-12 h-12 border-2 border-neon-green animate-pulse"></div>
    </div>
  );
}
