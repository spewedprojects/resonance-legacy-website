import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Calendar,
    Clock,
    MapPin,
    ExternalLink,
    Sparkles,
    Tag,
    Target,
    Layers,
    Share2,
    CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    useSiteEvents,
    useSiteEventsConfig,
    ResonanceEvent,
} from "@/lib/siteData";
import EventRegistrationWidget from "@/components/EventRegistrationWidget";
import { toast } from "sonner";

const Events: React.FC = () => {
    const events = useSiteEvents();
    const config = useSiteEventsConfig();
    const [selectedStatus, setSelectedStatus] = useState<
        "all" | "upcoming" | "ongoing" | "completed"
    >("all");

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const filteredEvents = events.filter((ev) => {
        if (selectedStatus === "all") return true;
        return ev.status === selectedStatus;
    });

    const handleShare = (event: ResonanceEvent) => {
        if (navigator.share) {
            navigator
                .share({
                    title: event.title,
                    text: event.purpose || event.description,
                    url: window.location.href,
                })
                .catch(() => {});
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Event link copied to clipboard!");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col justify-between">
            <Navbar />

            <main className="flex-1">
                {/* Hero Header */}
                <section className="pt-32 pb-12 text-center px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto space-y-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold">
                            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                            <span>Workshops, Bootcamps & Conclaves</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 tracking-tight">
                            Events & <span className="text-blue-700">Initiatives</span>
                        </h1>

                        <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                            Explore upcoming apprenticeship summits, student entrepreneurship pitch fests, and capacity-building programs across India.
                        </p>

                        {/* External Events Portal CTA Banner */}
                        <div className="pt-3">
                            <a
                                href={config.portalUrl || "https://events.theresonance.co.in"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 hover:from-blue-700 hover:to-indigo-900 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                                <Calendar className="w-4 h-4 text-orange-400" />
                                <span>Visit Official Events Portal</span>
                                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                            </a>
                        </div>
                    </div>
                </section>

                {/* Events Listing Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 pb-20">
                    {/* Status Filters */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5 mb-8">
                        <div className="flex flex-wrap items-center gap-2">
                            {(
                                [
                                    { key: "all", label: "All Events" },
                                    { key: "upcoming", label: "Upcoming" },
                                    { key: "ongoing", label: "Live & Ongoing" },
                                    { key: "completed", label: "Past Events" },
                                ] as const
                            ).map((filter) => (
                                <button
                                    key={filter.key}
                                    type="button"
                                    onClick={() => setSelectedStatus(filter.key)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        selectedStatus === filter.key
                                            ? "bg-[#2E5C9D] text-white shadow-sm"
                                            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                    }`}>
                                    {filter.label}
                                </button>
                            ))}
                        </div>

                        <span className="text-xs font-semibold text-slate-500">
                            Showing {filteredEvents.length} {filteredEvents.length === 1 ? "Event" : "Events"}
                        </span>
                    </div>

                    {/* Events Grid / List */}
                    {filteredEvents.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 max-w-xl mx-auto">
                            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-blue-950 mb-1">
                                No events found in this category
                            </h3>
                            <p className="text-xs text-gray-500 mb-4">
                                Stay tuned for upcoming skill development and startup events.
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedStatus("all")}
                                className="rounded-xl text-xs">
                                View All Events
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {filteredEvents.map((ev) => (
                                <div
                                    key={ev.id}
                                    className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-slate-100 flex flex-col lg:flex-row">
                                    {/* Event Banner */}
                                    <div className="lg:w-5/12 relative aspect-[16/10] lg:aspect-auto overflow-hidden bg-slate-100">
                                        <img
                                            src={ev.bannerImage || "/media/placeholder.png"}
                                            alt={ev.title}
                                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                                            loading="lazy"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src =
                                                    "/media/placeholder.png";
                                            }}
                                        />
                                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                                            <span
                                                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-white shadow-sm ${
                                                    ev.status === "upcoming"
                                                        ? "bg-green-600"
                                                        : ev.status === "ongoing"
                                                        ? "bg-orange-500 animate-pulse"
                                                        : "bg-slate-600"
                                                }`}>
                                                {ev.status}
                                            </span>
                                            {ev.category && (
                                                <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-sm text-white shadow-sm">
                                                    {ev.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Event Information */}
                                    <div className="lg:w-7/12 p-6 sm:p-8 flex flex-col justify-between">
                                        <div>
                                            {/* Meta Info (Date, Time, Venue) */}
                                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-3">
                                                {ev.date && (
                                                    <span className="flex items-center gap-1.5 font-semibold text-blue-900 bg-blue-50 px-3 py-1 rounded-lg">
                                                        <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                                        {ev.date}
                                                    </span>
                                                )}
                                                {ev.time && (
                                                    <span className="flex items-center gap-1.5 font-medium bg-slate-50 px-2.5 py-1 rounded-lg">
                                                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                        {ev.time}
                                                    </span>
                                                )}
                                                {ev.venue && (
                                                    <span className="flex items-center gap-1.5 font-medium bg-slate-50 px-2.5 py-1 rounded-lg">
                                                        <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                                        {ev.venue}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Title & Subtitle */}
                                            <h2 className="text-xl sm:text-2xl font-bold text-blue-950 mb-1 leading-snug">
                                                {ev.title}
                                            </h2>
                                            {ev.subtitle && (
                                                <p className="text-xs sm:text-sm font-semibold text-blue-700 mb-3">
                                                    {ev.subtitle}
                                                </p>
                                            )}

                                            {/* Purpose Highlight */}
                                            {ev.purpose && (
                                                <div className="p-3.5 bg-orange-50/70 border border-orange-200/80 rounded-2xl mb-4">
                                                    <div className="flex items-start gap-2">
                                                        <Target className="w-4 h-4 text-orange-600 mt-0.5 shrink-0" />
                                                        <p className="text-xs text-slate-800 leading-relaxed font-medium">
                                                            <strong className="text-orange-950 font-bold">
                                                                Purpose:{" "}
                                                            </strong>
                                                            {ev.purpose}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Full Description */}
                                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                                                {ev.description}
                                            </p>
                                        </div>

                                        {/* Actions: Registration Button (Snippet / Konfhub) & Share */}
                                        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 mt-auto">
                                            {/* Konfhub / Registration Widget */}
                                            <div className="flex items-center gap-3">
                                                <EventRegistrationWidget
                                                    snippet={ev.registrationSnippet}
                                                    fallbackUrl={ev.registrationUrl}
                                                    eventTitle={ev.title}
                                                />
                                            </div>

                                            {/* Share Button */}
                                            <button
                                                type="button"
                                                onClick={() => handleShare(ev)}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-700 transition-colors p-2 rounded-xl hover:bg-slate-50"
                                                title="Share Event">
                                                <Share2 className="w-3.5 h-3.5" />
                                                <span>Share</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default Events;
