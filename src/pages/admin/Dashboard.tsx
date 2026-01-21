import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, Mail, Phone, Calendar } from "lucide-react";

interface Enquiry {
    _id: string; // MongoDB uses _id
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt?: string; // MongoDB uses camelCase or what we defined
}

const Dashboard = () => {
    const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
    const [loading, setLoading] = useState(true);

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
        // Polling for "realtime" updates every 10 seconds
        const interval = setInterval(() => fetchEnquiries(), 10000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                    Enquiries
                </h1>
                <div className="bg-slate-200 px-3 py-1 rounded-full text-xs font-semibold text-slate-600">
                    Total: {enquiries.length}
                </div>
            </div>

            <div className="grid gap-4 md:gap-6">
                {enquiries.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center text-gray-500">
                            No enquiries found yet.
                        </CardContent>
                    </Card>
                ) : (
                    enquiries.map((enquiry) => (
                        <Card
                            key={enquiry._id}
                            className="overflow-hidden hover:shadow-md transition-shadow border-slate-200">
                            <CardHeader className="bg-gray-50/50 border-b p-3 md:p-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm md:text-lg shrink-0">
                                            {enquiry.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <CardTitle className="text-sm md:text-lg truncate">
                                                {enquiry.name}
                                            </CardTitle>
                                            <div className="flex flex-wrap items-center text-[10px] md:text-sm text-gray-500 gap-2 md:gap-4 mt-0.5">
                                                <span className="flex items-center gap-1">
                                                    <Mail className="w-3 h-3 md:w-4 md:h-4" />{" "}
                                                    {enquiry.email}
                                                </span>
                                                {enquiry.phone && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-3 h-3 md:w-4 md:h-4" />{" "}
                                                        {enquiry.phone}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {enquiry.createdAt && (
                                        <div className="text-[10px] md:text-sm text-gray-400 flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {format(
                                                new Date(enquiry.createdAt),
                                                "MMM d, h:mm a",
                                            )}
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="p-3 md:p-6">
                                <p className="text-xs md:text-base text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {enquiry.message}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
