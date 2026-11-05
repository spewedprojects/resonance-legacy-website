import { useState } from "react";
import { format } from "date-fns";
import {
    Mail,
    Phone,
    Calendar,
    Search,
    Trash2,
    CheckCircle2,
    Clock,
    Download,
    MessageSquare,
    ExternalLink,
    Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    useSiteEnquiries,
    deleteStoredEnquiry,
    updateEnquiryStatus,
    saveStoredEnquiries,
    Enquiry,
} from "@/lib/siteData";

const Enquiries = () => {
    const enquiries = useSiteEnquiries();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | "new" | "read">("all");

    const filtered = enquiries.filter((e) => {
        const matchesSearch =
            e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (e.phone && e.phone.includes(searchQuery)) ||
            e.message.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "all" ? true : e.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const newCount = enquiries.filter((e) => e.status === "new").length;

    const handleDelete = (enquiry: Enquiry) => {
        if (
            window.confirm(
                `Are you sure you want to delete enquiry from "${enquiry.name}"?`,
            )
        ) {
            deleteStoredEnquiry(enquiry._id);
            toast.success("Enquiry deleted");
        }
    };

    const handleToggleStatus = (enquiry: Enquiry) => {
        const nextStatus = enquiry.status === "new" ? "read" : "new";
        updateEnquiryStatus(enquiry._id, nextStatus);
        toast.info(
            `Marked as ${nextStatus === "read" ? "Read" : "Unread (New)"}`,
        );
    };

    const handleClearAll = () => {
        if (
            window.confirm(
                "Are you sure you want to clear all enquiries? This cannot be undone.",
            )
        ) {
            saveStoredEnquiries([]);
            toast.success("All enquiries cleared");
        }
    };

    const handleExportCSV = () => {
        if (enquiries.length === 0) {
            toast.info("No enquiries to export");
            return;
        }

        const headers = ["ID", "Name", "Email", "Phone", "Message", "Date", "Status"];
        const rows = enquiries.map((e) => [
            `"${e._id}"`,
            `"${e.name.replace(/"/g, '""')}"`,
            `"${e.email.replace(/"/g, '""')}"`,
            `"${(e.phone || "").replace(/"/g, '""')}"`,
            `"${e.message.replace(/"/g, '""')}"`,
            `"${e.createdAt}"`,
            `"${e.status}"`,
        ]);

        const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `resonance-enquiries-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Enquiries exported to CSV file");
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-900 tracking-tight flex items-center gap-3">
                        <MessageSquare className="w-8 h-8 text-blue-600" />
                        Visitor Enquiries
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        All contact submissions from prospective clients, students, and partners.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={handleExportCSV}
                        className="rounded-xl text-xs flex items-center gap-1.5 border-slate-200 text-slate-700">
                        <Download className="w-3.5 h-3.5" />
                        Export CSV
                    </Button>
                    {enquiries.length > 0 && (
                        <Button
                            variant="ghost"
                            onClick={handleClearAll}
                            className="rounded-xl text-xs text-red-600 hover:bg-red-50 hover:text-red-700">
                            Clear All
                        </Button>
                    )}
                </div>
            </div>

            {/* Controls Bar: Search & Status Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search by name, email, phone, or message..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-gray-50 border-gray-200 rounded-lg text-sm"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider mr-1 flex items-center gap-1">
                        <Filter className="w-3 h-3" /> Filter:
                    </span>
                    <button
                        type="button"
                        onClick={() => setStatusFilter("all")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            statusFilter === "all"
                                ? "bg-blue-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}>
                        All ({enquiries.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setStatusFilter("new")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                            statusFilter === "new"
                                ? "bg-orange-600 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}>
                        <span>Unread</span>
                        {newCount > 0 && (
                            <span className="bg-white/30 text-white text-[10px] px-1.5 rounded-full font-bold">
                                {newCount}
                            </span>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => setStatusFilter("read")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            statusFilter === "read"
                                ? "bg-slate-700 text-white shadow-sm"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}>
                        Read ({enquiries.length - newCount})
                    </button>
                </div>
            </div>

            {/* Enquiries Grid */}
            {filtered.length === 0 ? (
                <Card className="bg-white rounded-2xl border-dashed border-2 p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-700 font-bold text-base">
                        No enquiries matching your filter
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                        New submissions from the Contact Us page will be automatically listed here.
                    </p>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filtered.map((enquiry) => {
                        const isNew = enquiry.status === "new";
                        return (
                            <Card
                                key={enquiry._id}
                                className={`bg-white rounded-2xl overflow-hidden hover:shadow-md transition-all border ${
                                    isNew
                                        ? "border-blue-300 bg-gradient-to-r from-blue-50/20 via-white to-white"
                                        : "border-slate-100"
                                }`}>
                                <CardHeader className="bg-slate-50/60 border-b border-slate-100 p-4 sm:p-5">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3.5">
                                            <div
                                                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
                                                    isNew
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-slate-200 text-slate-700"
                                                }`}>
                                                {enquiry.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <CardTitle className="text-base font-bold text-blue-950">
                                                        {enquiry.name}
                                                    </CardTitle>
                                                    {isNew && (
                                                        <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex flex-wrap items-center text-xs text-gray-500 gap-3 mt-1">
                                                    <span className="flex items-center gap-1 font-medium text-slate-700">
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

                                        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {format(
                                                new Date(enquiry.createdAt),
                                                "MMM d, yyyy • h:mm a",
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="p-5 flex flex-col justify-between">
                                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        {enquiry.message}
                                    </p>

                                    {/* Action buttons */}
                                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleToggleStatus(enquiry)}
                                                className="h-8 text-xs text-slate-600 hover:text-blue-600 hover:bg-blue-50 flex items-center gap-1.5 font-medium">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                {isNew ? "Mark as Read" : "Mark as Unread"}
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(enquiry)}
                                                className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 flex items-center gap-1.5 font-medium">
                                                <Trash2 className="w-3.5 h-3.5" />
                                                Delete
                                            </Button>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {enquiry.phone && (
                                                <a href={`tel:${enquiry.phone.replace(/[^0-9+]/g, "")}`}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-50 flex items-center gap-1.5 font-medium">
                                                        <Phone className="w-3.5 h-3.5" />
                                                        Call
                                                    </Button>
                                                </a>
                                            )}
                                            <a
                                                href={`mailto:${enquiry.email}?subject=RE: Your Enquiry with Resonance Solutions&body=Dear ${encodeURIComponent(
                                                    enquiry.name,
                                                )},\n\nThank you for reaching out to Resonance Solutions.\n\nRegarding your message:\n"${encodeURIComponent(
                                                    enquiry.message,
                                                )}"\n\n`}
                                                target="_blank"
                                                rel="noopener noreferrer">
                                                <Button
                                                    size="sm"
                                                    className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 font-medium">
                                                    <Mail className="w-3.5 h-3.5" />
                                                    Reply via Email
                                                </Button>
                                            </a>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Enquiries;
