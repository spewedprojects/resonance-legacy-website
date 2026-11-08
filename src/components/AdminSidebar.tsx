import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    LogOut,
    MessageSquare,
    FileText,
    Users,
    Award,
    Phone,
    BookOpen,
    ExternalLink,
    Layers,
    Images,
    Calendar,
    KeyRound,
    Eye,
    EyeOff,
    TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { logout, changePassword, resetPasswordWithMasterKey } from "@/lib/auth";
import { toast } from "sonner";

interface SidebarProps {
    className?: string;
    onClose?: () => void;
}

const AdminSidebar = ({ className, onClose }: SidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    // Change Password Dialog States
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd, setNewPwd] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [useMasterKey, setUseMasterKey] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPwd) {
            toast.error(useMasterKey ? "Please enter your Master Setup Key" : "Please enter your current password");
            return;
        }

        if (!newPwd) {
            toast.error("Please enter a new password");
            return;
        }

        if (newPwd.length < 6) {
            toast.error("New password must be at least 6 characters long");
            return;
        }

        if (newPwd !== confirmPwd) {
            toast.error("New password and confirmation do not match");
            return;
        }

        let res;
        if (useMasterKey) {
            res = await resetPasswordWithMasterKey(currentPwd.trim(), newPwd);
        } else {
            res = await changePassword(currentPwd, newPwd);
        }

        if (res.success) {
            toast.success(res.message);
            setCurrentPwd("");
            setNewPwd("");
            setConfirmPwd("");
            setUseMasterKey(false);
            setIsPasswordModalOpen(false);
        } else {
            toast.error(res.message);
        }
    };

    const links = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/programs", label: "Core Programs", icon: BookOpen },
        { href: "/admin/services", label: "Key Services", icon: Layers },
        { href: "/admin/gallery", label: "Gallery Albums", icon: Images },
        { href: "/admin/events", label: "Events & Portal", icon: Calendar },
        { href: "/admin/team", label: "Team Members", icon: Users },
        { href: "/admin/advisory", label: "Advisory Board", icon: Award },
        { href: "/admin/contact", label: "Contact Details", icon: Phone },
        { href: "/admin/blogs", label: "Manage Blogs", icon: FileText },
        { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
    ];

    return (
        <div
            className={cn(
                "flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800",
                className,
            )}>
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-orange-500 tracking-wide">
                        RESONANCE
                    </h2>
                    <p className="text-slate-400 text-xs font-medium">
                        Admin Management Suite
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
                <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Content Management
                </div>
                {links.map((link) => {
                    const Icon = link.icon;
                    const isAnalyticsLink = link.href.includes("analytics=open");
                    const isActive = isAnalyticsLink
                        ? location.pathname === "/admin" && location.search.includes("analytics=open")
                        : link.href === "/admin"
                            ? location.pathname === "/admin" && !location.search.includes("analytics=open")
                            : location.pathname.startsWith(link.href);

                    return (
                        <Link
                            key={link.href}
                            to={link.href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
                                isActive
                                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-sm"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                            )}>
                            <Icon
                                className={cn(
                                    "w-4 h-4",
                                    isActive ? "text-white" : "text-slate-400",
                                )}
                            />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-3 border-t border-slate-800 space-y-1">
                <Link
                    to="/"
                    target="_blank"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                    <span>View Live Website</span>
                </Link>

                {/* Change Password Button (Above Logout Button) */}
                <Button
                    variant="ghost"
                    onClick={() => {
                        setCurrentPwd("");
                        setNewPwd("");
                        setConfirmPwd("");
                        setIsPasswordModalOpen(true);
                    }}
                    className="w-full justify-start text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white px-3.5 py-2.5 rounded-xl transition-colors">
                    <KeyRound className="w-4 h-4 mr-3 text-orange-400" />
                    Change Password
                </Button>

                {/* Logout Button */}
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 px-3.5 py-2.5 rounded-xl">
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                </Button>
            </div>

            {/* Change Password Dialog Modal */}
            <Dialog
                open={isPasswordModalOpen}
                onOpenChange={setIsPasswordModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-blue-950 flex items-center gap-2">
                            <KeyRound className="w-5 h-5 text-orange-500" />
                            Change Admin Password
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleUpdatePassword} className="space-y-4 pt-2">
                        {/* Current Password or Master Key */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label
                                    htmlFor="sidebar-current-pwd"
                                    className="text-xs font-bold text-slate-700">
                                    {useMasterKey ? "Master Verification Key *" : "Current Password *"}
                                </Label>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setUseMasterKey(!useMasterKey);
                                        setCurrentPwd("");
                                    }}
                                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold transition-colors">
                                    {useMasterKey ? "Use Current Password" : "Forgot? Use Master Key"}
                                </button>
                            </div>
                            <div className="relative">
                                <Input
                                    id="sidebar-current-pwd"
                                    name="currentPassword"
                                    type={showCurrent ? "text" : "password"}
                                    placeholder="Enter your current password"
                                    value={currentPwd}
                                    onChange={(e) => setCurrentPwd(e.target.value)}
                                    className="pr-10 rounded-xl"
                                    required
                                    autoFocus
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showCurrent ? (
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
                                htmlFor="sidebar-new-pwd"
                                className="text-xs font-bold text-slate-700">
                                New Password *
                            </Label>
                            <div className="relative">
                                <Input
                                    id="sidebar-new-pwd"
                                    name="newPassword"
                                    type={showNew ? "text" : "password"}
                                    placeholder="Enter new password (min. 4 characters)"
                                    value={newPwd}
                                    onChange={(e) => setNewPwd(e.target.value)}
                                    className="pr-10 rounded-xl"
                                    required
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showNew ? (
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
                                htmlFor="sidebar-confirm-pwd"
                                className="text-xs font-bold text-slate-700">
                                Confirm New Password *
                            </Label>
                            <Input
                                id="sidebar-confirm-pwd"
                                name="confirmPassword"
                                type="password"
                                placeholder="Re-enter new password"
                                value={confirmPwd}
                                onChange={(e) => setConfirmPwd(e.target.value)}
                                className="rounded-xl"
                                required
                                autoComplete="new-password"
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsPasswordModalOpen(false)}
                                className="rounded-xl text-xs">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xs font-semibold shadow-sm">
                                Save New Password
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminSidebar;
