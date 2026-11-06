import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    login,
    setupInitialPassword,
    resetPasswordWithMasterKey,
    isPasswordInitialized,
    getPasswordLastChanged,
} from "@/lib/auth";
import { registerCurrentSession } from "@/lib/siteData";
import { toast } from "sonner";
import {
    Lock,
    KeyRound,
    Eye,
    EyeOff,
    ArrowLeft,
    ShieldCheck,
    Sparkles,
    AlertCircle,
    Loader2,
    CheckCircle2,
} from "lucide-react";

type AuthMode = "login" | "setup" | "reset";

const Login = () => {
    const navigate = useNavigate();

    // The portal defaults to standard Login. Master Key fields are only shown on demand or when explicitly requested.
    const [mode, setMode] = useState<AuthMode>("login");
    const [isInitialized, setIsInitialized] = useState<boolean>(() => isPasswordInitialized());
    const [lastChangedTime, setLastChangedTime] = useState<string | null>(() => getPasswordLastChanged());

    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Verifying credentials...");

    // Form inputs
    const [password, setPassword] = useState("");
    const [masterKey, setMasterKey] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showMasterKey, setShowMasterKey] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    useEffect(() => {
        setIsInitialized(isPasswordInitialized());
        setLastChangedTime(getPasswordLastChanged());
    }, []);

    // 1. Standard Login Handler
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) {
            toast.error("Please enter the administrator password");
            return;
        }

        setIsLoading(true);
        setLoadingMessage("Verifying administrator credentials...");

        try {
            const success = await login(password.trim());
            if (success) {
                setLoadingMessage("Establishing secure session...");
                // Register device session for remote management
                registerCurrentSession();

                toast.success("Welcome back! Signed in successfully.");
                navigate("/admin");
            } else {
                toast.error("Invalid password. Please check and try again, or use Master Key recovery.");
            }
        } catch (err) {
            toast.error("Login verification failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // 2. First-Time Setup Handler
    const handleInitialSetup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!masterKey.trim()) {
            toast.error("Please enter your Master Setup Key");
            return;
        }

        if (!newPassword) {
            toast.error("Please enter your desired administrator password");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirmation do not match");
            return;
        }

        setIsLoading(true);
        setLoadingMessage("Securing administrator account with Master Key...");

        try {
            const res = await setupInitialPassword(masterKey.trim(), newPassword);
            if (res.success) {
                registerCurrentSession();
                toast.success(res.message);
                setIsInitialized(true);
                setLastChangedTime(new Date().toISOString());
                navigate("/admin");
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error("Failed to complete initial setup. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    };

    // 3. Emergency Password Reset Handler
    const handleEmergencyReset = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!masterKey.trim()) {
            toast.error("Please enter your Master Verification Key");
            return;
        }

        if (!newPassword) {
            toast.error("Please enter your new administrator password");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirmation do not match");
            return;
        }

        setIsLoading(true);
        setLoadingMessage("Validating Master Key & updating password...");

        try {
            const res = await resetPasswordWithMasterKey(masterKey.trim(), newPassword);
            if (res.success) {
                registerCurrentSession();
                toast.success(res.message);
                setIsInitialized(true);
                setLastChangedTime(new Date().toISOString());
                navigate("/admin");
            } else {
                toast.error(res.message);
            }
        } catch (err) {
            toast.error("Password reset failed. Please verify your Master Key.");
        } finally {
            setIsLoading(false);
        }
    };

    // Formatted password last changed display
    const formattedLastChanged = lastChangedTime
        ? new Date(lastChangedTime).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
          })
        : null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
            <div className="w-full max-w-md">
                {/* Back to Home Link */}
                <div className="mb-4 text-center sm:text-left">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-200 hover:text-white transition-colors">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Website
                    </Link>
                </div>

                <Card className="border-slate-800 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden relative">
                    {/* Top Active Loading Shimmer Bar */}
                    {isLoading && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-blue-600 to-indigo-600 animate-pulse z-20" />
                    )}

                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
                            {mode === "setup" ? (
                                <ShieldCheck className="w-6 h-6 text-orange-400" />
                            ) : mode === "reset" ? (
                                <KeyRound className="w-6 h-6 text-orange-400" />
                            ) : (
                                <Lock className="w-6 h-6 text-orange-400" />
                            )}
                        </div>

                        <h1 className="text-xl font-bold tracking-tight">
                            {mode === "setup"
                                ? "Initial Admin Setup"
                                : mode === "reset"
                                ? "Reset Admin Password"
                                : "Resonance Admin Portal"}
                        </h1>

                        <p className="text-blue-200 text-xs mt-1 leading-relaxed max-w-xs mx-auto">
                            {mode === "setup"
                                ? "Claim and secure your newly hosted administrator account using your Master Setup Key."
                                : mode === "reset"
                                ? "Reset your password with your Master Key without needing your previous password."
                                : "Enter your administrator password to access the Resonance control suite."}
                        </p>

                        {/* Password Last Changed Security Note */}
                        {formattedLastChanged && mode === "login" && (
                            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-blue-200 text-[11px] font-medium rounded-full border border-white/15">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Password updated: {formattedLastChanged}</span>
                            </div>
                        )}
                    </div>

                    <CardContent className="p-6">
                        {/* ================= MODE: SETUP ================= */}
                        {mode === "setup" && (
                            <form onSubmit={handleInitialSetup} className="space-y-4">
                                <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-xs text-blue-900 space-y-1">
                                    <div className="font-bold flex items-center gap-1.5 text-blue-950">
                                        <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                                        First-Time Setup Mode
                                    </div>
                                    <p className="text-[11px] text-blue-800 leading-relaxed">
                                        Enter the Master Setup Key set in your hosting environment (or default master passphrase), then establish your private admin password.
                                    </p>
                                </div>

                                {/* Master Setup Key */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="setup-master-key"
                                        className="text-xs font-bold text-slate-700">
                                        Master Setup Key *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="setup-master-key"
                                            name="masterKey"
                                            type={showMasterKey ? "text" : "password"}
                                            placeholder="Enter your Master Setup Key"
                                            value={masterKey}
                                            onChange={(e) => setMasterKey(e.target.value)}
                                            className="pr-10 rounded-xl text-xs font-mono"
                                            required
                                            autoFocus
                                            autoComplete="off"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowMasterKey(!showMasterKey)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showMasterKey ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="setup-new-password"
                                        className="text-xs font-bold text-slate-700">
                                        Create New Admin Password *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="setup-new-password"
                                            name="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Choose a strong password (min. 6 chars)"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="pr-10 rounded-xl text-xs"
                                            required
                                            autoComplete="new-password"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showNewPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="setup-confirm-password"
                                        className="text-xs font-bold text-slate-700">
                                        Confirm Password *
                                    </Label>
                                    <Input
                                        id="setup-confirm-password"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Re-enter your chosen password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="rounded-xl text-xs"
                                        required
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="pt-2 space-y-2">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl py-2.5 font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                                                <span>{loadingMessage}</span>
                                            </>
                                        ) : (
                                            <span>Save Password & Launch Portal</span>
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setMode("login")}
                                        disabled={isLoading}
                                        className="w-full text-xs text-slate-500 hover:text-slate-800">
                                        Switch back to standard login
                                    </Button>
                                </div>
                            </form>
                        )}

                        {/* ================= MODE: LOGIN ================= */}
                        {mode === "login" && (
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="login-password"
                                            className="text-xs font-bold text-slate-700">
                                            Admin Password
                                        </Label>
                                        <button
                                            type="button"
                                            onClick={() => setMode("reset")}
                                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                                            Forgot / Reset?
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <Input
                                            id="login-password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter administrator password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pr-10 rounded-xl text-xs"
                                            autoFocus
                                            required
                                            autoComplete="current-password"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl py-2.5 font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin text-white" />
                                            <span>{loadingMessage}</span>
                                        </>
                                    ) : (
                                        <span>Sign In to Admin Portal</span>
                                    )}
                                </Button>

                                <div className="pt-2 text-center space-y-1.5">
                                    <button
                                        type="button"
                                        onClick={() => setMode("reset")}
                                        disabled={isLoading}
                                        className="text-xs text-slate-500 hover:text-blue-700 font-medium transition-colors block mx-auto">
                                        Locked out? Reset using Master Key
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setMode("setup")}
                                        disabled={isLoading}
                                        className="text-[11px] text-slate-400 hover:text-orange-600 transition-colors block mx-auto">
                                        Need first-time setup? Click here
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* ================= MODE: RESET ================= */}
                        {mode === "reset" && (
                            <form onSubmit={handleEmergencyReset} className="space-y-4">
                                <div className="p-3 bg-amber-50/80 border border-amber-200/70 rounded-xl text-xs text-amber-900 space-y-1">
                                    <div className="font-bold flex items-center gap-1.5 text-amber-950">
                                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                        Master Key Emergency Recovery
                                    </div>
                                    <p className="text-[11px] text-amber-800 leading-relaxed">
                                        No previous password is required. Enter your secret Master Key to instantly reset and establish a new admin password.
                                    </p>
                                </div>

                                {/* Master Key */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="reset-master-key"
                                        className="text-xs font-bold text-slate-700">
                                        Master Verification Key *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="reset-master-key"
                                            name="masterKey"
                                            type={showMasterKey ? "text" : "password"}
                                            placeholder="Enter your Master Key"
                                            value={masterKey}
                                            onChange={(e) => setMasterKey(e.target.value)}
                                            className="pr-10 rounded-xl text-xs font-mono"
                                            required
                                            autoFocus
                                            autoComplete="off"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowMasterKey(!showMasterKey)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showMasterKey ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* New Password */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="reset-new-pwd"
                                        className="text-xs font-bold text-slate-700">
                                        New Administrator Password *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="reset-new-pwd"
                                            name="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Enter new password (min. 6 chars)"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="pr-10 rounded-xl text-xs"
                                            required
                                            autoComplete="new-password"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showNewPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm Password */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="reset-confirm-pwd"
                                        className="text-xs font-bold text-slate-700">
                                        Confirm New Password *
                                    </Label>
                                    <Input
                                        id="reset-confirm-pwd"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="rounded-xl text-xs"
                                        required
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="pt-2 space-y-2">
                                    <Button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl py-2.5 font-semibold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2">
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                                                <span>{loadingMessage}</span>
                                            </>
                                        ) : (
                                            <span>Reset Password & Sign In</span>
                                        )}
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setMode("login")}
                                        disabled={isLoading}
                                        className="w-full rounded-xl text-xs text-slate-600">
                                        Back to Sign In
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
