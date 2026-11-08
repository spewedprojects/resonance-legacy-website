import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { Link, useSearchParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    Mail,
    Phone,
    Calendar,
    Users,
    Award,
    FileText,
    ArrowRight,
    BookOpen,
    ExternalLink,
    CheckCircle2,
    Sparkles,
    Layers,
    Images,
    Eye,
    Activity,
    Laptop,
    Smartphone,
    ShieldCheck,
    LogOut,
    Flame,
    Radio,
    Clock,
    BarChart3,
    RotateCcw,
    TrendingUp,
    CalendarDays,
    RefreshCw,
} from "lucide-react";
import {
    useSiteTeam,
    useSiteAdvisors,
    useSiteContact,
    useSitePrograms,
    useSiteServices,
    useSiteAlbums,
    useSiteEvents,
    useSiteBlogs,
    useSiteEnquiries,
    useSiteVisitorStats,
    resetVisitorStats,
    useSiteSessions,
    revokeSession,
    revokeAllOtherSessions,
} from "@/lib/siteData";
import { toast } from "sonner";

const Dashboard = () => {
    const team = useSiteTeam();
    const advisors = useSiteAdvisors();
    const contact = useSiteContact();
    const programs = useSitePrograms();
    const services = useSiteServices();
    const albums = useSiteAlbums();
    const events = useSiteEvents();
    const blogs = useSiteBlogs();
    const enquiries = useSiteEnquiries();
    const visitorStats = useSiteVisitorStats();
    const sessions = useSiteSessions();

    const activeTeamCount = team.filter((m) => !m.isFormer).length;
    const formerTeamCount = team.filter((m) => m.isFormer).length;

    const [searchParams, setSearchParams] = useSearchParams();
    const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    useEffect(() => {
        if (searchParams.get("analytics") === "open" || searchParams.get("trends") === "open") {
            setIsAnalyticsOpen(true);
        }
    }, [searchParams]);

    const handleDialogChange = (open: boolean) => {
        setIsAnalyticsOpen(open);
        if (!open && (searchParams.get("analytics") || searchParams.get("trends"))) {
            const next = new URLSearchParams(searchParams);
            next.delete("analytics");
            next.delete("trends");
            setSearchParams(next, { replace: true });
        }
    };

    const handleResetCounters = async () => {
        if (
            window.confirm(
                "Are you sure you want to reset the Unique Visitors and Total Hits counters back to 0? Today's activity and live totals will start fresh."
            )
        ) {
            try {
                setIsResetting(true);
                await resetVisitorStats();
                toast.success("Visitor and hit counters successfully reset to 0.");
            } catch {
                toast.error("Failed to reset counters.");
            } finally {
                setIsResetting(false);
            }
        }
    };

    const recentEnquiries = enquiries.slice(0, 3);
    const newEnquiriesCount = enquiries.filter((e) => e.status === "new").length;

    const handleRevokeSingle = (sessionId: string, deviceName: string) => {
        if (window.confirm(`Log out ${deviceName} remotely? That device will require logging in again.`)) {
            revokeSession(sessionId);
            toast.success(`Logged out ${deviceName} remotely.`);
        }
    };

    const handleRevokeAllOthers = () => {
        if (window.confirm("Log out all other devices? Only your current device will remain signed in.")) {
            revokeAllOtherSessions();
            toast.success("All other active device sessions have been terminated.");
        }
    };

    const otherSessionsCount = sessions.filter((s) => !s.isCurrent).length;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 md:p-8 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <span className="inline-block px-3 py-1 bg-blue-700/60 text-blue-200 text-xs font-semibold rounded-full mb-3 uppercase tracking-wider">
                        Admin Portal
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Resonance Control Center
                    </h1>
                    <p className="text-blue-200 text-sm mt-1 max-w-xl">
                        Manage your Core Programs, Team, Advisory Board, Contact Details, Blog Articles, and Inquiries in real time.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsAnalyticsOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer">
                        <TrendingUp className="w-4 h-4" />
                        Analytics & Trends
                    </button>
                    <Link
                        to="/"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-sm transition-colors border border-white/20">
                        <ExternalLink className="w-4 h-4" />
                        Preview Site
                    </Link>
                </div>
            </div>

            {/* Top Row: Visitor Analytics & Live Hit Counter */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Unique Visitors Counter Card */}
                <Card className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl border-none shadow-md overflow-hidden relative">
                    <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-blue-200 uppercase tracking-wider flex items-center gap-2">
                                <Eye className="w-4 h-4 text-orange-400" />
                                Unique Visitors
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                                Live Counter
                            </span>
                        </div>
                        <div className="text-3xl sm:text-4xl font-extrabold text-white mt-3 tracking-tight">
                            {visitorStats.uniqueVisitors.toLocaleString()}
                        </div>
                        <p className="text-xs text-blue-200/80 mt-1">
                            Distinct human visitors tracked across devices
                        </p>
                        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-blue-200">
                            <span>Today's activity:</span>
                            <span className="font-bold text-white flex items-center gap-1">
                                <Flame className="w-3.5 h-3.5 text-orange-400" />
                                +{visitorStats.todayHits} hits today
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. Total Site Impressions / Hits */}
                <Card className="bg-white rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Activity className="w-4 h-4 text-blue-600" />
                                Total Site Hits
                            </span>
                            <span className="text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                All-Time
                            </span>
                        </div>
                        <div className="text-3xl sm:text-4xl font-extrabold text-blue-950 mt-3 tracking-tight">
                            {visitorStats.totalHits.toLocaleString()}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Total page requests and visitor interactions
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-gray-500">
                            <span>Last visitor activity:</span>
                            <span className="font-semibold text-slate-700">
                                {visitorStats.lastHitAt ? format(new Date(visitorStats.lastHitAt), "h:mm a") : "Active"}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* 3. Connected Devices Security Card */}
                <Card className="bg-white rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                Logged-In Devices
                            </span>
                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                {sessions.length} Connected
                            </span>
                        </div>
                        <div className="text-3xl sm:text-4xl font-extrabold text-blue-950 mt-3 tracking-tight">
                            {sessions.length} <span className="text-sm font-normal text-gray-500">device{sessions.length !== 1 ? "s" : ""}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {otherSessionsCount > 0
                                ? `${otherSessionsCount} other device${otherSessionsCount !== 1 ? "s" : ""} logged in remotely`
                                : "Only this current device is logged in"}
                        </p>
                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                            <span className="text-gray-500">Remote Control:</span>
                            {otherSessionsCount > 0 ? (
                                <button
                                    onClick={handleRevokeAllOthers}
                                    className="font-bold text-red-600 hover:text-red-700 transition-colors">
                                    Log Out Others
                                </button>
                            ) : (
                                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Secure
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* Core Programs Metric */}
                <Card className="bg-white rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Core Programs
                            </span>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                <BookOpen className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-blue-950 mt-2">
                            {programs.length}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500">NATS, NAPS, AEDP...</span>
                            <Link
                                to="/admin/programs"
                                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                                Edit <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Key Services Metric */}
                <Card className="bg-white rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Key Services
                            </span>
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Layers className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-blue-950 mt-2">
                            {services.length}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Offerings</span>
                            <Link
                                to="/admin/services"
                                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
                                Manage <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Events & Portal Metric */}
                <Card className="bg-white rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Events
                            </span>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                <Calendar className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-blue-950 mt-2">
                            {events.length}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Live listings</span>
                            <Link
                                to="/admin/events"
                                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                                Manage <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Team Members Metric */}
                <Card className="bg-white rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Team
                            </span>
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-blue-950 mt-2">
                            {activeTeamCount}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                {formerTeamCount > 0 ? `+${formerTeamCount} former` : "Active"}
                            </span>
                            <Link
                                to="/admin/team"
                                className="text-xs text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
                                Manage <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Advisory Board Metric */}
                <Card className="bg-white rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Advisory Board
                            </span>
                            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                                <Award className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-blue-950 mt-2">
                            {advisors.length}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Distinguished</span>
                            <Link
                                to="/admin/advisory"
                                className="text-xs text-amber-600 hover:text-amber-700 font-semibold flex items-center gap-1">
                                Manage <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Blog Articles Metric */}
                <Card className="bg-white rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Blog Articles
                            </span>
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <FileText className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-blue-950 mt-2">
                            {blogs.length}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Published posts</span>
                            <Link
                                to="/admin/blogs"
                                className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1">
                                View <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Connected Devices & Active Sessions Remote Management */}
            <Card className="bg-white rounded-2xl border-slate-100 shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/70 p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <CardTitle className="text-base font-bold text-blue-950 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-600" />
                            Connected Admin Devices & Security Sessions ({sessions.length})
                        </CardTitle>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Monitor which devices have active access to the admin portal and revoke sessions remotely
                        </p>
                    </div>

                    {otherSessionsCount > 0 && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRevokeAllOthers}
                            className="text-xs text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-1.5 rounded-xl self-start sm:self-auto font-medium">
                            <LogOut className="w-3.5 h-3.5" />
                            Log Out All Other Devices
                        </Button>
                    )}
                </CardHeader>

                <CardContent className="p-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sessions.map((session) => (
                            <div
                                key={session.id}
                                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${session.isCurrent
                                    ? "bg-blue-50/60 border-blue-200 shadow-sm"
                                    : "bg-slate-50/70 border-slate-200 hover:bg-white"
                                    }`}>
                                <div>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-2 rounded-lg ${session.isCurrent ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"}`}>
                                                {session.os === "iOS" || session.os === "Android" ? (
                                                    <Smartphone className="w-4 h-4" />
                                                ) : (
                                                    <Laptop className="w-4 h-4" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                                                    {session.deviceName}
                                                </h4>
                                                <p className="text-[11px] text-slate-500">
                                                    {session.browser} • {session.os}
                                                </p>
                                            </div>
                                        </div>

                                        {session.isCurrent ? (
                                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                                                This Device
                                            </span>
                                        ) : (
                                            <span className="bg-slate-200 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                                Remote
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1 text-[11px] text-slate-500">
                                        <div className="flex items-center justify-between">
                                            <span>Signed In:</span>
                                            <span className="font-medium text-slate-700">
                                                {session.loginTime ? format(new Date(session.loginTime), "MMM d, h:mm a") : "Today"}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span>Network IP:</span>
                                            <span className="font-mono text-[10px] text-slate-600">{session.ip}</span>
                                        </div>
                                    </div>
                                </div>

                                {!session.isCurrent && (
                                    <div className="mt-3 pt-3 border-t border-slate-200">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleRevokeSingle(session.id, session.deviceName)}
                                            className="w-full h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg flex items-center justify-center gap-1.5 font-medium">
                                            <LogOut className="w-3.5 h-3.5" />
                                            Log Out This Device
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Core Programs Preview & Recent Enquiries Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Core Programs Preview */}
                <Card className="bg-white rounded-2xl border-slate-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-100 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-bold text-blue-950 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-600" />
                                Core Programs Content
                            </CardTitle>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Program titles and descriptions currently shown on the homepage
                            </p>
                        </div>
                        <Link to="/admin/programs">
                            <Button variant="ghost" size="sm" className="text-xs text-blue-600 font-semibold">
                                Edit All →
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                        {programs.map((p) => (
                            <div
                                key={p.id}
                                className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-start gap-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-lg uppercase shrink-0 mt-0.5">
                                    {p.code}
                                </span>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-xs text-blue-950 truncate">
                                        {p.title}
                                    </h4>
                                    <p className="text-[11px] text-gray-600 line-clamp-2 mt-0.5 leading-relaxed">
                                        {p.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Latest Enquiries Preview */}
                <Card className="bg-white rounded-2xl border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
                    <CardHeader className="bg-slate-50/70 p-4 border-b border-slate-100 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-bold text-blue-950 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-green-600" />
                                Recent Inquiries
                            </CardTitle>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Latest messages received from visitors
                            </p>
                        </div>
                        <Link to="/admin/enquiries">
                            <Button variant="ghost" size="sm" className="text-xs text-green-700 font-semibold">
                                View Enquiries ({enquiries.length}) →
                            </Button>
                        </Link>
                    </CardHeader>

                    <CardContent className="p-4 space-y-3 flex-1">
                        {recentEnquiries.length === 0 ? (
                            <div className="py-12 text-center text-gray-400 text-xs">
                                No visitor enquiries received yet.
                            </div>
                        ) : (
                            recentEnquiries.map((e) => (
                                <div
                                    key={e._id}
                                    className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-xs text-blue-950 truncate">
                                                {e.name}
                                            </span>
                                            {e.status === "new" && (
                                                <span className="bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase">
                                                    New
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-gray-500 truncate mt-0.5">
                                            {e.email} {e.phone ? `• ${e.phone}` : ""}
                                        </p>
                                        <p className="text-xs text-gray-700 line-clamp-1 mt-1 font-normal">
                                            "{e.message}"
                                        </p>
                                    </div>
                                    <span className="text-[10px] text-gray-400 shrink-0 font-medium">
                                        {format(new Date(e.createdAt), "MMM d")}
                                    </span>
                                </div>
                            ))
                        )}
                    </CardContent>

                    <div className="p-4 border-t border-slate-100 bg-slate-50/40 text-center">
                        <Link to="/admin/enquiries">
                            <Button
                                variant="outline"
                                className="w-full text-xs font-semibold text-blue-700 border-blue-200 hover:bg-blue-50 rounded-xl">
                                Open Dedicated Inquiries Page ({enquiries.length} total)
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
            {/* ================= ANALYTICS & TRENDS DIALOG ================= */}
            <Dialog open={isAnalyticsOpen} onOpenChange={handleDialogChange}>
                <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 space-y-6">
                    <DialogHeader>
                        <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg sm:text-xl font-bold text-blue-950">
                                    Traffic & Visitor Analytics
                                </DialogTitle>
                                <DialogDescription className="text-xs text-slate-500">
                                    Datewise interaction history, daily activity velocity, and counter controls.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    {/* Summary Mini Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-sm">
                            <span className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block">
                                Unique Visitors
                            </span>
                            <div className="text-2xl font-extrabold mt-1">
                                {visitorStats.uniqueVisitors.toLocaleString()}
                            </div>
                            <span className="text-[10px] text-blue-200/70 block mt-0.5">
                                Distinct devices
                            </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                                Total Site Hits
                            </span>
                            <div className="text-2xl font-extrabold text-blue-950 mt-1">
                                {visitorStats.totalHits.toLocaleString()}
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                                All-time page requests
                            </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
                            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">
                                Today&apos;s Hits
                            </span>
                            <div className="text-2xl font-extrabold text-amber-950 mt-1 flex items-center gap-1.5">
                                <Flame className="w-5 h-5 text-orange-500" />
                                +{visitorStats.todayHits}
                            </div>
                            <span className="text-[10px] text-amber-700/80 block mt-0.5">
                                Activity today
                            </span>
                        </div>
                    </div>

                    {/* Datewise Trend Bar Chart */}
                    {(() => {
                        const history = visitorStats.dailyHistory || [];
                        const maxHits = Math.max(...history.map((h) => h.hits), 1);
                        return (
                            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center gap-1.5">
                                        <TrendingUp className="w-4 h-4 text-blue-600" />
                                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                            Recent Activity Trend (Last {history.length} Days)
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <span className="w-2.5 h-2.5 rounded-sm bg-blue-600 inline-block" />
                                            Hits
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <span className="w-2.5 h-2.5 rounded-sm bg-orange-500 inline-block" />
                                            Unique Visitors
                                        </span>
                                    </div>
                                </div>

                                {/* Pure CSS Responsive Bar Chart */}
                                <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-200">
                                    {history.map((day) => {
                                        const hitPercent = Math.max((day.hits / maxHits) * 100, 6);
                                        const visitorPercent = Math.max((day.visitors / maxHits) * 100, 4);
                                        const dayLabel = day.date.slice(5); // "MM-DD"
                                        return (
                                            <div
                                                key={day.date}
                                                className="grow flex flex-col items-center gap-1.5 h-full justify-end group relative">
                                                {/* Tooltip on Hover */}
                                                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 text-white text-[10px] font-semibold px-2 py-1 rounded-md shadow-md whitespace-nowrap z-20">
                                                    {day.date}: {day.hits} hits, {day.visitors} visitors
                                                </div>

                                                <div className="w-full max-w-[28px] flex items-end justify-center gap-0.5 h-full">
                                                    {/* Hits Bar */}
                                                    <div
                                                        style={{ height: `${hitPercent}%` }}
                                                        className="w-1/2 bg-blue-600 group-hover:bg-blue-700 rounded-t-sm transition-all"
                                                        title={`Hits: ${day.hits}`}
                                                    />
                                                    {/* Visitors Bar */}
                                                    <div
                                                        style={{ height: `${visitorPercent}%` }}
                                                        className="w-1/2 bg-orange-500 group-hover:bg-orange-600 rounded-t-sm transition-all"
                                                        title={`Visitors: ${day.visitors}`}
                                                    />
                                                </div>

                                                <span className="text-[10px] text-slate-500 font-mono">
                                                    {dayLabel}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })()}

                    {/* Datewise Record Table */}
                    {(() => {
                        const history = [...(visitorStats.dailyHistory || [])].reverse();
                        return (
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                                    <CalendarDays className="w-3.5 h-3.5 text-slate-500" />
                                    <span>Datewise Record Log</span>
                                </h4>
                                <div className="rounded-xl border border-slate-200 overflow-hidden max-h-48 overflow-y-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold sticky top-0">
                                            <tr>
                                                <th className="py-2 px-3">Date</th>
                                                <th className="py-2 px-3 text-right">Unique Visitors</th>
                                                <th className="py-2 px-3 text-right">Total Hits</th>
                                                <th className="py-2 px-3 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {history.map((row, rIdx) => {
                                                const isToday = rIdx === 0;
                                                return (
                                                    <tr key={row.date} className="hover:bg-slate-50/70">
                                                        <td className="py-2 px-3 font-mono font-semibold text-slate-800">
                                                            {row.date}
                                                        </td>
                                                        <td className="py-2 px-3 text-right font-semibold text-orange-600">
                                                            {row.visitors.toLocaleString()}
                                                        </td>
                                                        <td className="py-2 px-3 text-right font-bold text-blue-900">
                                                            {row.hits.toLocaleString()}
                                                        </td>
                                                        <td className="py-2 px-3 text-right">
                                                            {isToday ? (
                                                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                                                    Today
                                                                </span>
                                                            ) : (
                                                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                                                                    Recorded
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Reset Controls Footer */}
                    <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-xs text-slate-500">
                            <span>Resetting counters sets all-time unique visitors & hits back to zero.</span>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isResetting}
                            onClick={handleResetCounters}
                            className="rounded-xl text-xs font-semibold text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-8 shrink-0 flex items-center gap-1.5">
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{isResetting ? "Resetting..." : "Reset Hit & Visitor Counters"}</span>
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Dashboard;