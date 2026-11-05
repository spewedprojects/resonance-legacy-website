import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import {
    useSiteTeam,
    useSiteAdvisors,
    useSiteContact,
    useSitePrograms,
    useSiteServices,
    useSiteBlogs,
    useSiteEnquiries,
} from "@/lib/siteData";

const Dashboard = () => {
    const team = useSiteTeam();
    const advisors = useSiteAdvisors();
    const contact = useSiteContact();
    const programs = useSitePrograms();
    const services = useSiteServices();
    const blogs = useSiteBlogs();
    const enquiries = useSiteEnquiries();

    const recentEnquiries = enquiries.slice(0, 3);
    const newEnquiriesCount = enquiries.filter((e) => e.status === "new").length;

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
                    <Link
                        to="/"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-sm transition-colors border border-white/20">
                        <ExternalLink className="w-4 h-4" />
                        Preview Site
                    </Link>
                </div>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
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
                            <span className="text-xs text-gray-500">Offerings & Dialog</span>
                            <Link
                                to="/admin/services"
                                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
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
                                Team Members
                            </span>
                            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-blue-950 mt-2">
                            {team.length}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Live profiles</span>
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
                            <div className="p-2 bg-orange-50 text-orange-600 rounded-xl">
                                <Award className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-blue-950 mt-2">
                            {advisors.length}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Active mentors</span>
                            <Link
                                to="/admin/advisory"
                                className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1">
                                Manage <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Enquiries Metric */}
                <Card className="bg-white rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Inquiries
                            </span>
                            <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                                <Mail className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <div className="text-3xl font-extrabold text-blue-950">
                                {enquiries.length}
                            </div>
                            {newEnquiriesCount > 0 && (
                                <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase">
                                    {newEnquiriesCount} New
                                </span>
                            )}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Contact form leads</span>
                            <Link
                                to="/admin/enquiries"
                                className="text-xs text-green-600 hover:text-green-700 font-semibold flex items-center gap-1">
                                View Inquiries <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <span className="text-sm font-bold text-blue-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    Quick Actions:
                </span>
                <div className="flex flex-wrap items-center gap-2.5">
                    <Link to="/admin/programs">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 text-xs">
                            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                            Core Programs
                        </Button>
                    </Link>
                    <Link to="/admin/services">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-indigo-200 text-indigo-700 hover:bg-indigo-50 text-xs">
                            <Layers className="w-3.5 h-3.5 mr-1.5" />
                            Key Services
                        </Button>
                    </Link>
                    <Link to="/admin/blogs/new">
                        <Button
                            size="sm"
                            className="rounded-xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-xs shadow-sm">
                            <FileText className="w-3.5 h-3.5 mr-1.5" />
                            Write New Blog
                        </Button>
                    </Link>
                    <Link to="/admin/team">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs">
                            <Users className="w-3.5 h-3.5 mr-1.5" />
                            Manage Team
                        </Button>
                    </Link>
                    <Link to="/admin/advisory">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs">
                            <Award className="w-3.5 h-3.5 mr-1.5" />
                            Manage Advisory
                        </Button>
                    </Link>
                    <Link to="/admin/contact">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 text-xs">
                            <Phone className="w-3.5 h-3.5 mr-1.5" />
                            Contact Details
                        </Button>
                    </Link>
                </div>
            </div>

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

                {/* Latest Enquiries Preview (Notice: Only top 3 with link to dedicated Enquiries page!) */}
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
        </div>
    );
};

export default Dashboard;
