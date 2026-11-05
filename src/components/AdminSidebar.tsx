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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/auth";

interface SidebarProps {
    className?: string;
    onClose?: () => void;
}

const AdminSidebar = ({ className, onClose }: SidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const links = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/programs", label: "Core Programs", icon: BookOpen },
        { href: "/admin/services", label: "Key Services", icon: Layers },
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
                    const isActive =
                        link.href === "/admin"
                            ? location.pathname === "/admin"
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

                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-xs font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 px-3.5 py-2.5 rounded-xl">
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default AdminSidebar;
