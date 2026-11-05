import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Loader2,
    Mail,
    Phone,
    Calendar,
    Users,
    Award,
    FileText,
    ArrowRight,
    MapPin,
    ExternalLink,
} from "lucide-react";
import {
    useSiteTeam,
    useSiteAdvisors,
    useSiteContact,
} from "@/lib/siteData";

interface Enquiry {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt?: string;
}

const Dashboard = () => {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);

    const team = useSiteTeam();
    const advisors = useSiteAdvisors();
    const contact = useSiteContact();

    const fetchEnquiries = async (isFirstLoad = false) => {
        try {
            const res = await fetch("/.netlify/functions/get-enquiries");
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.enquiries)) {
                    setEnquiries(data.enquiries);
                }
            }
        } catch (error) {
            console.error("Error fetching enquiries:", error);
        } finally {
            if (isFirstLoad) setLoading(false);
        }
    };

    useEffect(() => {
        fetchEnquiries(true);
        const interval = setInterval(() => fetchEnquiries(), 10000);
        return () => clearInterval(interval);
    }, []);

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
                        Manage your team, advisory board, contact details, blog articles, and visitor enquiries in real time.
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

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Team Members */}
                <Card className="bg-white rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Team Members
                            </span>
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-blue-950 mt-2">
                            {team.length}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Live on site</span>
                            <Link
                                to="/admin/team"
                                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                                Manage <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Advisory Board */}
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
                            <span className="text-xs text-gray-500">Advisors active</span>
                            <Link
                                to="/admin/advisory"
                                className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1">
                                Manage <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Contact Information */}
                <Card className="bg-white rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Contact Phone
                            </span>
                            <div className="p-2 bg-green-50 text-green-600 rounded-xl">
                                <Phone className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-sm font-bold text-blue-950 mt-3 truncate" title={contact.phone}>
                            {contact.phone}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500 truncate max-w-[120px]">{contact.address}</span>
                            <Link
                                to="/admin/contact"
                                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1">
                                Edit <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Enquiries count */}
                <Card className="bg-white rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Total Enquiries
                            </span>
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                                <Mail className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-blue-950 mt-2">
                            {enquiries.length}
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-xs text-gray-500">Contact submissions</span>
                            <Link
                                to="/admin/enquiries"
                                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
                                View <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <span className="text-sm font-bold text-blue-900">
                    Quick Actions:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                    <Link to="/admin/team">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-blue-200 text-blue-700 hover:bg-blue-50 text-xs">
                            <Users className="w-3.5 h-3.5 mr-1.5" />
                            Manage Team
                        </Button>
                    </Link>
                    <Link to="/admin/advisory">
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-orange-200 text-orange-700 hover:bg-orange-50 text-xs">
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
                            Edit Contact Info
                        </Button>
                    </Link>
                    <Link to="/admin/blogs/new">
                        <Button
                            size="sm"
                            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs">
                            <FileText className="w-3.5 h-3.5 mr-1.5" />
                            Write New Blog
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Enquiries Section */}
            <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-blue-950 tracking-tight flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-600" />
                        Recent Contact Enquiries
                    </h2>
                    <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-semibold text-slate-600">
                        {enquiries.length} received
                    </span>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                ) : enquiries.length === 0 ? (
                    <Card className="bg-white rounded-2xl border-dashed border-2 p-10 text-center">
                        <Mail className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-600 font-medium text-sm">
                            No visitor enquiries found yet.
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                            When users submit messages from the Contact Us page, they will appear here.
                        </p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {enquiries.map((enquiry) => (
                            <Card
                                key={enquiry._id}
                                className="bg-white rounded-2xl overflow-hidden hover:shadow-md transition-shadow border-slate-100">
                                <CardHeader className="bg-slate-50/70 border-b border-slate-100 p-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                                                {enquiry.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <CardTitle className="text-sm font-bold text-blue-950">
                                                    {enquiry.name}
                                                </CardTitle>
                                                <div className="flex flex-wrap items-center text-xs text-gray-500 gap-3 mt-0.5">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-3.5 h-3.5 text-blue-500" />
                                                        {enquiry.email}
                                                    </span>
                                                    {enquiry.phone && (
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="w-3.5 h-3.5 text-green-500" />
                                                            {enquiry.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {enquiry.createdAt && (
                                            <div className="text-xs text-gray-400 flex items-center gap-1 font-medium">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {format(
                                                    new Date(enquiry.createdAt),
                                                    "MMM d, yyyy • h:mm a",
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 md:p-5">
                                    <p className="text-xs md:text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {enquiry.message}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
