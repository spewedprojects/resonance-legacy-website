import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "@/components/ui/card";
import { login, changePassword } from "@/lib/auth";
import { toast } from "sonner";
import {
    Lock,
    KeyRound,
    Eye,
    EyeOff,
    ArrowLeft,
    CheckCircle2,
    ShieldCheck,
} from "lucide-react";

const Login = () => {
    const navigate = useNavigate();

    // Mode: 'login' | 'change-password'
    const [mode, setMode] = useState<"login" | "change-password">("login");

    // Login Form State
    const [password, setPassword] = useState("");
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    // Change Password Form State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (!password.trim()) {
            toast.error("Please enter the admin password");
            return;
        }

        if (login(password.trim())) {
            toast.success("Welcome back! Signed in successfully");
            navigate("/admin");
        } else {
            toast.error("Invalid password. Please check and try again.");
        }
    };

    const handleChangePassword = (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword) {
            toast.error("Please enter your last used (current) password");
            return;
        }

        if (!newPassword) {
            toast.error("Please enter a new password");
            return;
        }

        if (newPassword.length < 4) {
            toast.error("New password must be at least 4 characters long");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirmation password do not match");
            return;
        }

        const result = changePassword(currentPassword, newPassword);

        if (result.success) {
            // Auto login with new password
            login(newPassword);
            toast.success("Password updated successfully! Welcome to the admin portal.");
            navigate("/admin");
        } else {
            toast.error(result.message);
        }
    };

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

                <Card className="border-slate-800 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
                            {mode === "login" ? (
                                <Lock className="w-6 h-6 text-orange-400" />
                            ) : (
                                <KeyRound className="w-6 h-6 text-orange-400" />
                            )}
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">
                            {mode === "login"
                                ? "Resonance Admin Portal"
                                : "Change Admin Password"}
                        </h1>
                        <p className="text-blue-200 text-xs mt-1">
                            {mode === "login"
                                ? "Enter your admin credentials to manage site content"
                                : "Update your admin password using your last used password"}
                        </p>
                    </div>

                    <CardContent className="p-6">
                        {mode === "login" ? (
                            /* ================= LOGIN FORM ================= */
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
                                            onClick={() => setMode("change-password")}
                                            className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                                            Change Password?
                                        </button>
                                    </div>

                                    <div className="relative">
                                        <Input
                                            id="login-password"
                                            type={showLoginPassword ? "text" : "password"}
                                            placeholder="Enter password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pr-10 rounded-xl"
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowLoginPassword(!showLoginPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showLoginPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl py-2.5 font-semibold text-sm shadow-md transition-all">
                                    Sign In to Admin
                                </Button>


                            </form>
                        ) : (
                            /* ================= CHANGE PASSWORD FORM ================= */
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                {/* Last Used (Current) Password */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="current-pwd"
                                        className="text-xs font-bold text-slate-700">
                                        Last Used (Current) Password *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="current-pwd"
                                            type={showCurrentPassword ? "text" : "password"}
                                            placeholder="Enter your current password"
                                            value={currentPassword}
                                            onChange={(e) =>
                                                setCurrentPassword(e.target.value)
                                            }
                                            className="pr-10 rounded-xl"
                                            required
                                            autoFocus
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCurrentPassword(!showCurrentPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showCurrentPassword ? (
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
                                        htmlFor="new-pwd"
                                        className="text-xs font-bold text-slate-700">
                                        New Password *
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="new-pwd"
                                            type={showNewPassword ? "text" : "password"}
                                            placeholder="Enter new password (min. 4 chars)"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className="pr-10 rounded-xl"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNewPassword(!showNewPassword)
                                            }
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showNewPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Confirm New Password */}
                                <div className="space-y-1.5">
                                    <Label
                                        htmlFor="confirm-pwd"
                                        className="text-xs font-bold text-slate-700">
                                        Confirm New Password *
                                    </Label>
                                    <Input
                                        id="confirm-pwd"
                                        type="password"
                                        placeholder="Re-enter new password"
                                        value={confirmPassword}
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
                                        }
                                        className="rounded-xl"
                                        required
                                    />
                                </div>

                                <div className="pt-2 space-y-2">
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl py-2.5 font-semibold text-sm shadow-md transition-all">
                                        Update Password & Sign In
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setMode("login")}
                                        className="w-full rounded-xl text-xs text-slate-600">
                                        Cancel & Back to Sign In
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
