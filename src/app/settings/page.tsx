"use client";

import { dreamService } from "@/services/dreamService";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Download, Trash2, User, Bell, Shield } from "lucide-react";

export default function SettingsPage() {
    return (
        <ProtectedRoute>
            <SettingsContent />
        </ProtectedRoute>
    );
}

function SettingsContent() {
    const { user } = useAuth();
    const [isExporting, setIsExporting] = useState(false);
    
    const userName = user?.user_metadata?.name || user?.email?.split('@')[0] || 'Dreamer';
    const userEmail = user?.email || '';
    const userInitial = userName.charAt(0).toUpperCase();

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const data = await dreamService.exportData();
            const blob = new Blob([data], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `dreamscape-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Failed to export data.");
        } finally {
            setTimeout(() => setIsExporting(false), 1000);
        }
    };

    const handleClearData = async () => {
        if (confirm("Are you sure? This will delete ALL your dreams, characters, and locations. This action cannot be undone.")) {
            await dreamService.clearAll();
            window.location.reload();
        }
    };

    return (
        <div className="min-h-screen pt-32 px-8 pb-20">
            <div className="max-w-3xl mx-auto space-y-12">
                <header>
                    <h1 className="text-6xl font-bold text-white mb-4 tracking-tighter">
                        SETTINGS
                    </h1>
                    <p className="text-xl text-white/60">
                        Manage your profile and data.
                    </p>
                </header>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <User className="w-6 h-6 text-mantis-green" />
                        Profile
                    </h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                            {userInitial}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{userName}</h3>
                            <p className="text-white/40">{userEmail}</p>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Shield className="w-6 h-6 text-blue-400" />
                        Data Management
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-3 text-white/80">
                                <Download className="w-5 h-5" />
                                <h3 className="font-bold">Export Data</h3>
                            </div>
                            <p className="text-sm text-white/40">
                                Download a JSON backup of your entire journal.
                            </p>
                            <button
                                onClick={handleExport}
                                disabled={isExporting}
                                className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {isExporting ? "Exporting..." : "Download Backup"}
                            </button>
                        </div>

                        <div className="bg-white/5 border border-red-500/20 rounded-2xl p-6 space-y-4">
                            <div className="flex items-center gap-3 text-red-400">
                                <Trash2 className="w-5 h-5" />
                                <h3 className="font-bold">Clear Data</h3>
                            </div>
                            <p className="text-sm text-white/40">
                                Permanently delete all local data.
                            </p>
                            <button
                                onClick={handleClearData}
                                className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg font-medium transition-colors"
                            >
                                Delete All Data
                            </button>
                        </div>
                    </div>
                </section>

                <section className="space-y-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Bell className="w-6 h-6 text-yellow-400" />
                        Preferences
                    </h2>
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="p-6 flex items-center justify-between border-b border-white/5">
                            <div>
                                <div className="font-bold text-white">Notifications</div>
                                <div className="text-sm text-white/40">Receive reminders to record dreams</div>
                            </div>
                            <div className="w-12 h-6 bg-mantis-green rounded-full relative cursor-pointer">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-black rounded-full" />
                            </div>
                        </div>
                        <div className="p-6 flex items-center justify-between">
                            <div>
                                <div className="font-bold text-white">Dark Mode</div>
                                <div className="text-sm text-white/40">Always on for deep immersion</div>
                            </div>
                            <div className="w-12 h-6 bg-white/20 rounded-full relative cursor-not-allowed opacity-50">
                                <div className="absolute right-1 top-1 w-4 h-4 bg-white/40 rounded-full" />
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
