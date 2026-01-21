import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, MessageSquare, FileText } from "lucide-react";
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
        { href: "/admin/blogs", label: "Manage Blogs", icon: FileText },
        { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
    ];

    return (
        <div
            className={cn(
                "flex flex-col h-full bg-slate-900 text-white w-64",
                className,
            )}>
            <div className="p-6">
                <h2 className="text-2xl font-bold text-orange-500">Admin</h2>
                <p className="text-slate-400 text-sm">Resonance Code</p>
            </div>

            <nav className="flex-1 px-4 space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                        location.pathname === link.href ||
                        (link.href !== "/admin" &&
                            location.pathname.startsWith(link.href));

                    return (
                        <Link
                            key={link.href}
                            to={link.href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                                isActive
                                    ? "bg-orange-600 text-white"
                                    : "text-slate-300 hover:bg-slate-800 hover:text-white",
                            )}>
                            <Icon className="w-5 h-5" />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-slate-300 hover:bg-slate-800 hover:text-white">
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    );
};

export default AdminSidebar;
