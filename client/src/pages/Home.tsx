import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Zap, Bot, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-neon-green overflow-hidden">
      {/* Animated background grid */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-green/20 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-pulse">
          <div className="text-6xl font-bold mb-2 drop-shadow-lg drop-shadow-neon-green/50">
            ⚡ XcT x Team
          </div>
          <div className="text-2xl text-neon-cyan drop-shadow-lg drop-shadow-neon-cyan/50">
            Bot Factory Pro
          </div>
          <div className="text-sm text-neon-green/70 mt-2">
            Advanced Free Fire Bot Management Platform
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl">
          <div className="cyberpunk-card">
            <Zap className="w-8 h-8 mb-3 text-neon-cyan" />
            <h3 className="text-lg font-bold mb-2">Lightning Fast</h3>
            <p className="text-sm text-neon-green/70">
              Instant bot deployment and real-time management
            </p>
          </div>

          <div className="cyberpunk-card">
            <Bot className="w-8 h-8 mb-3 text-neon-cyan" />
            <h3 className="text-lg font-bold mb-2">Multi-Bot Control</h3>
            <p className="text-sm text-neon-green/70">
              Manage multiple accounts simultaneously with ease
            </p>
          </div>

          <div className="cyberpunk-card">
            <Shield className="w-8 h-8 mb-3 text-neon-cyan" />
            <h3 className="text-lg font-bold mb-2">Secure & Reliable</h3>
            <p className="text-sm text-neon-green/70">
              Advanced security with local data storage
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 flex-wrap justify-center">
          <Link href="/login">
            <Button className="cyberpunk-button text-lg px-8 py-3">
              🔐 Login
            </Button>
          </Link>
          <Button className="cyberpunk-button-outline text-lg px-8 py-3">
            📖 Learn More
          </Button>
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center text-neon-green/50 text-sm">
          <p>v1.0.0 | Powered by XcT x Team</p>
          <p className="mt-2">⚠️ For authorized users only</p>
        </div>
      </div>

      {/* Animated corner elements */}
      <div className="fixed top-4 right-4 w-8 h-8 border-2 border-neon-cyan animate-pulse"></div>
      <div className="fixed bottom-4 left-4 w-8 h-8 border-2 border-neon-green animate-pulse"></div>
    </div>
  );
}
