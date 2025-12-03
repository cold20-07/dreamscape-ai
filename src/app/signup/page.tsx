"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/services/authService";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Check } from "lucide-react";

type Step = "email" | "otp" | "password";

export default function SignupPage() {
    const [step, setStep] = useState<Step>("email");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await authService.sendOtp(email);

        if (error) {
            setError(error.message);
        } else {
            setStep("otp");
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await authService.verifyOtp(email, otp);

        if (error) {
            setError(error.message);
        } else {
            setStep("password");
        }
        setLoading(false);
    };

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        // Update password
        const { error: passwordError } = await authService.updatePassword(password);
        if (passwordError) {
            setError(passwordError.message);
            setLoading(false);
            return;
        }

        // Update profile name if provided
        if (name) {
            await authService.updateProfile(name);
        }

        router.push("/dashboard");
        router.refresh();
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8 p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm"
            >
                {/* Progress indicator */}
                <div className="flex items-center justify-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "email" ? "bg-purple-500" : "bg-green-500"}`}>
                        {step === "email" ? "1" : <Check className="w-4 h-4" />}
                    </div>
                    <div className={`w-12 h-0.5 ${step !== "email" ? "bg-green-500" : "bg-white/20"}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "otp" ? "bg-purple-500" : step === "password" ? "bg-green-500" : "bg-white/20"}`}>
                        {step === "password" ? <Check className="w-4 h-4" /> : "2"}
                    </div>
                    <div className={`w-12 h-0.5 ${step === "password" ? "bg-purple-500" : "bg-white/20"}`} />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === "password" ? "bg-purple-500" : "bg-white/20"}`}>
                        3
                    </div>
                </div>

                <div className="text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        {step === "password" ? (
                            <Lock className="w-8 h-8 text-purple-400" />
                        ) : (
                            <Mail className="w-8 h-8 text-purple-400" />
                        )}
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {step === "email" && "Create Account"}
                        {step === "otp" && "Verify Email"}
                        {step === "password" && "Set Password"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        {step === "email" && "Enter your email to get started"}
                        {step === "otp" && `Enter the 6-digit code sent to ${email}`}
                        {step === "password" && "Create a password for future logins"}
                    </p>
                </div>

                {step === "email" && (
                    <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="sr-only">Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="relative block w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm"
                                    placeholder="Name (optional)"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="sr-only">Email address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="relative block w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm"
                                    placeholder="Email address"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sending code...
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                )}

                {step === "otp" && (
                    <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
                        <div>
                            <label htmlFor="otp" className="sr-only">Verification code</label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                required
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                className="relative block w-full rounded-lg border border-white/10 bg-black/50 px-4 py-4 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-center text-2xl tracking-[0.5em] font-mono"
                                placeholder="000000"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="group relative flex w-full justify-center items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                <>
                                    Verify
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={async () => {
                                    const { error } = await authService.sendOtp(email);
                                    if (!error) alert("New code sent!");
                                }}
                                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                Resend code
                            </button>
                        </div>
                    </form>
                )}

                {step === "password" && (
                    <form className="mt-8 space-y-6" onSubmit={handleSetPassword}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="password" className="sr-only">Password</label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="relative block w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm"
                                    placeholder="Password (min 6 characters)"
                                />
                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="relative block w-full rounded-lg border border-white/10 bg-black/50 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 sm:text-sm"
                                    placeholder="Confirm password"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center items-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Complete Signup"
                            )}
                        </button>
                    </form>
                )}

                <div className="text-center text-sm">
                    <span className="text-gray-400">Already have an account? </span>
                    <Link href="/login" className="font-medium text-purple-400 hover:text-purple-300">
                        Sign in
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
