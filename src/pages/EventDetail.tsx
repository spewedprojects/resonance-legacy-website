import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Calendar,
    Clock,
    MapPin,
    ArrowLeft,
    Share2,
    Target,
    Users,
    ExternalLink,
    CalendarCheck,
    Building2,
    Briefcase,
    Sparkles,
    Coffee,
} from "lucide-react";
import {
    useSiteEvents,
    useSiteEventsConfig,
    isEventPast,
    formatEventDisplayDate,
    formatEventDisplayTime,
    calculateAgendaSchedule,
    ResonanceEvent,
    EventPartnerSection,
} from "@/lib/siteData";
import EventRegistrationWidget from "@/components/EventRegistrationWidget";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const EventDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const events = useSiteEvents();
    const config = useSiteEventsConfig();

    // Scroll to top on navigation
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    const event = events.find((ev) => ev.slug === id || ev.id === id);

    const handleShare = (ev: ResonanceEvent) => {
        if (navigator.share) {
            navigator
                .share({
                    title: ev.title,
                    text: ev.purpose || ev.description,
                    url: window.location.href,
                })
                .catch(() => { });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Event link copied to clipboard!");
        }
    };

    if (!event) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col justify-between">
                <Navbar />
                <main className="flex-1 flex items-center justify-center p-6 pt-32">
                    <div className="bg-white rounded-3xl p-10 max-w-lg w-full text-center shadow-lg border border-slate-100">
                        <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-blue-950 mb-2">
                            Event Not Found
                        </h1>
                        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                            The event you are looking for does not exist, has been removed, or the link may be outdated.
                        </p>
                        <Link to="/events">
                            <Button className="rounded-xl px-6 bg-[#2E5C9D] hover:bg-[#23487c]">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to All Events
                            </Button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    const past = isEventPast(event.date, event.status);
    const displayDate = formatEventDisplayDate(event.date);
    const displayTime = formatEventDisplayTime(event.startTime, event.endTime, event.time);

    // Compute dynamic column layout for partners grid
    const getPartnerGridClass = (cols?: number) => {
        switch (cols) {
            case 2:
                return "grid-cols-1 sm:grid-cols-2";
            case 3:
                return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
            case 5:
                return "grid-cols-2 sm:grid-cols-3 md:grid-cols-5";
            case 4:
            default:
                return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
        }
    };

    // Normalize partner sections: use event.partnerSections if present, else fallback to event.partners
    const partnerSectionsToRender: EventPartnerSection[] =
        event.partnerSections && event.partnerSections.length > 0
            ? event.partnerSections
            : event.partners && event.partners.length > 0
                ? [
                    {
                        id: "default-partners",
                        title: "Partners & Collaborators",
                        subtitle:
                            "Distinguished organizations, industry chambers, and institutions joining hands to power this program.",
                        gridColumns: event.partnerGridColumns || 4,
                        partners: event.partners,
                    },
                ]
                : [];

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between">
            <Navbar />

            <main className="flex-1 pt-24 pb-20">
                {/* Breadcrumbs & Navigation Header */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                        <Link
                            to="/events"
                            className="inline-flex items-center gap-1.5 font-bold text-slate-600 hover:text-blue-700 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>All Events & Initiatives</span>
                        </Link>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleShare(event)}
                                className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-blue-700 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm"
                                title="Share Event Link">
                                <Share2 className="w-3.5 h-3.5 text-blue-600" />
                                <span>Share Event</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Event Hero Header (Completely unobstructed, separate from banner) */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-8">
                    <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-200/80 shadow-sm space-y-6">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2.5">
                            {event.category && (
                                <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200/60 shadow-sm">
                                    {event.category}
                                </span>
                            )}
                            <span
                                className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-sm ${past
                                    ? "bg-slate-600"
                                    : event.status === "ongoing"
                                        ? "bg-orange-500 animate-pulse"
                                        : "bg-emerald-600"
                                    }`}>
                                {past ? "Completed / Concluded" : event.status}
                            </span>
                        </div>

                        {/* Title & Subtitle */}
                        <div className="space-y-3">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-blue-950 leading-tight tracking-tight">
                                {event.title}
                            </h1>
                            {event.subtitle && (
                                <p className="text-base sm:text-lg md:text-xl font-medium text-slate-600 leading-relaxed max-w-4xl">
                                    {event.subtitle}
                                </p>
                            )}
                        </div>

                        {/* Meta Quick Bar */}
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-slate-700 pt-1">
                            {displayDate && (
                                <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80 font-semibold text-blue-950 shadow-xs">
                                    <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                                    <span>{displayDate}</span>
                                </div>
                            )}
                            {displayTime && (
                                <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80 font-medium text-slate-700 shadow-xs">
                                    <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
                                    <span>{displayTime}</span>
                                </div>
                            )}
                            {event.venue && (
                                <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80 font-medium text-slate-700 shadow-xs">
                                    <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
                                    <span>{event.venue}</span>
                                </div>
                            )}
                        </div>

                        {/* Hero Registration Button */}
                        <div className="pt-2 flex flex-wrap items-center gap-4">
                            <EventRegistrationWidget
                                snippet={event.registrationSnippet}
                                fallbackUrl={event.registrationUrl}
                                eventTitle={event.title}
                                buttonStyle={event.buttonStyle || "gradient"}
                                isPast={past}
                                className="scale-105 origin-left"
                            />
                            {past && (
                                <span className="text-xs text-slate-500 font-medium">
                                    This event took place on {displayDate}. Registrations are now closed.
                                </span>
                            )}
                        </div>
                    </div>
                </section>

                {/* Event Banner Showcase (Clean, 100% visible, not covered with any text) */}
                {event.bannerImage && (
                    <section className="max-w-6xl mx-auto px-4 sm:px-6 mb-12">
                        <div className="rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-slate-900/5">
                            <img
                                src={event.bannerImage}
                                alt={event.title}
                                className="w-full h-auto max-h-[560px] object-cover sm:object-contain mx-auto block"
                                onError={(e) => {
                                    const target = e.currentTarget as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = "/media/placeholder.png";
                                }}
                            />
                        </div>
                    </section>
                )}

                <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
                    {/* Purpose Section */}
                    {event.purpose && (
                        <section className="bg-gradient-to-r from-orange-50 via-amber-50/60 to-orange-50/40 rounded-3xl p-6 sm:p-8 border border-orange-200/80 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-orange-600 text-white rounded-2xl shadow-md shrink-0 mt-0.5">
                                    <Target className="w-6 h-6" />
                                </div>
                                <div className="space-y-1.5">
                                    <span className="text-xs font-bold uppercase tracking-wider text-orange-700">
                                        Event Purpose & Vision
                                    </span>
                                    <h2 className="text-xl sm:text-2xl font-bold text-orange-950">
                                        Core Objectives & Desired Impact
                                    </h2>
                                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-1">
                                        {event.purpose}
                                    </p>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Full Description Section */}
                    {event.description && (
                        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider">
                                <Briefcase className="w-4 h-4" />
                                <span>Detailed Overview</span>
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-blue-950">
                                About This Initiative
                            </h2>
                            <div className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line space-y-4 pt-1">
                                {event.description}
                            </div>
                        </section>
                    )}

                    {/* People Sections (Speakers, Delegates, Guests, Panelists, etc.) */}
                    {event.peopleSections &&
                        event.peopleSections.map((section) => {
                            if (!section.members || section.members.length === 0) return null;

                            return (
                                <section key={section.id} className="space-y-6">
                                    <div className="space-y-1 text-center sm:text-left">
                                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider">
                                            <Users className="w-3.5 h-3.5 text-blue-600" />
                                            <span>{section.title || "Featured Individuals"}</span>
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl font-bold text-blue-950">
                                            {section.title}
                                        </h2>
                                        {section.subtitle && (
                                            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                                                {section.subtitle}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                        {section.members.map((person) => (
                                            <div
                                                key={person.id}
                                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md border border-slate-200/80 text-center flex flex-col items-center transition-all group">
                                                {/* Consistent Round Photo Frame */}
                                                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full mb-4 overflow-hidden bg-slate-100 flex items-center justify-center border-4 border-blue-100/90 shadow-md ring-2 ring-blue-50/80 group-hover:scale-105 group-hover:border-blue-300 transition-all duration-300 shrink-0">
                                                    {person.photo ? (
                                                        <img
                                                            src={person.photo}
                                                            alt={person.name || "Individual"}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.currentTarget as HTMLImageElement).src =
                                                                    "/media/resonanceLogoNav.png";
                                                            }}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                                                            <Users className="w-10 h-10 text-blue-400" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Person Name (if present) */}
                                                {person.name && (
                                                    <h4 className="text-base font-bold text-blue-950 mb-1 group-hover:text-blue-800 transition-colors">
                                                        {person.name}
                                                    </h4>
                                                )}

                                                {/* Designation (if present) */}
                                                {person.designation && (
                                                    <p className="text-xs font-semibold text-orange-600 mb-1.5 leading-tight">
                                                        {person.designation}
                                                    </p>
                                                )}

                                                {/* Company (if present) */}
                                                {person.company && (
                                                    <p className="text-xs font-medium text-slate-500 leading-tight flex items-center justify-center gap-1 mt-auto">
                                                        <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
                                                        <span>{person.company}</span>
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            );
                        })}

                    {/* Partners & Sponsors Sections */}
                    {partnerSectionsToRender.map((section) => {
                        if (!section.partners || section.partners.length === 0) return null;

                        return (
                            <section key={section.id} className="space-y-6">
                                <div className="space-y-1 text-center sm:text-left">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider">
                                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                                        <span>{section.title || "Partners & Sponsors"}</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-blue-950">
                                        {section.title}
                                    </h2>
                                    {section.subtitle && (
                                        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
                                            {section.subtitle}
                                        </p>
                                    )}
                                </div>

                                <div
                                    className={`grid ${getPartnerGridClass(
                                        section.gridColumns,
                                    )} gap-5 sm:gap-6`}>
                                    {section.partners.map((partner) => {
                                        const cardContent = (
                                            <div className={`h-full bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center justify-between group ${partner.websiteUrl ? "hover:border-blue-300 hover:-translate-y-0.5 cursor-pointer" : ""
                                                }`}>
                                                {/* Kind of Partner Pill (if present) */}
                                                {partner.category ? (
                                                    <span className="w-full text-center text-[11px] font-bold text-blue-800 bg-blue-50 group-hover:bg-blue-100 px-3 py-1 rounded-full uppercase tracking-wider transition-colors mb-4 line-clamp-1">
                                                        {partner.category}
                                                    </span>
                                                ) : (
                                                    <div className="h-4 mb-2" />
                                                )}

                                                {/* Partner Logo/Icon Only (No partner name text, as requested) */}
                                                <div className="w-full h-24 sm:h-28 flex items-center justify-center p-3 mb-2 bg-slate-50/60 rounded-xl border border-slate-100">
                                                    {partner.logo ? (
                                                        <img
                                                            src={partner.logo}
                                                            alt={partner.category || "Partner Logo"}
                                                            className="max-h-full max-w-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                                                            loading="lazy"
                                                            onError={(e) => {
                                                                (e.currentTarget as HTMLImageElement).src =
                                                                    "/media/resonanceLogoNav.png";
                                                            }}
                                                        />
                                                    ) : (
                                                        <Building2 className="w-10 h-10 text-slate-300" />
                                                    )}
                                                </div>

                                                {/* Optional click-through link hint - only appears on hover */}
                                                {partner.websiteUrl ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 mt-2 opacity-0 group-hover:opacity-100 group-hover:text-orange-600 transition-all duration-200">
                                                        Visit Official Website <ExternalLink className="w-3 h-3" />
                                                    </span>
                                                ) : (
                                                    <div className="h-2" />
                                                )}
                                            </div>
                                        );

                                        return partner.websiteUrl ? (
                                            <a
                                                key={partner.id}
                                                href={partner.websiteUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block h-full"
                                                title={partner.category || "Visit Partner"}>
                                                {cardContent}
                                            </a>
                                        ) : (
                                            <div key={partner.id} className="h-full">
                                                {cardContent}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })}

                    {/* Timeline Agenda Section */}
                    {event.agenda && event.agenda.length > 0 && (() => {
                        const scheduledItems = calculateAgendaSchedule(event.startTime, event.agenda);
                        return (
                            <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-sm space-y-8">
                                <div className="space-y-1">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-900 text-xs font-bold rounded-full uppercase tracking-wider">
                                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                                        <span>Program Schedule</span>
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-bold text-blue-950">
                                        Event Agenda & Timeline
                                    </h2>
                                    <p className="text-xs sm:text-sm text-slate-500">
                                        Calculated sequentially from event start time ({event.startTime ? formatEventDisplayTime(event.startTime) : "09:30 AM"}).
                                    </p>
                                </div>

                                {/* Vertical Timeline with Left-Side Session Info */}
                                <div className="space-y-6 sm:space-y-8 pt-2">
                                    {scheduledItems.map((item, index) => {
                                        const isLast = index === scheduledItems.length - 1;
                                        const isBreak = Boolean(item.isBreak);
                                        return (
                                            <div key={item.id || index} className="flex items-start gap-3 sm:gap-6 group">
                                                {/* Left Side: Session Number / Break & Time (vertically stacked) */}
                                                <div className="w-20 sm:w-24 md:w-28 shrink-0 text-right pt-0.5 sm:pt-1">
                                                    {isBreak ? (
                                                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-slate-200 text-slate-700 border border-slate-300 mb-1">
                                                            Break
                                                        </span>
                                                    ) : (
                                                        <span className="inline-block px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200/60 mb-1">
                                                            Session {item.sessionNumber}
                                                        </span>
                                                    )}
                                                    <div className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums leading-tight">
                                                        {item.startTimeStr}
                                                    </div>
                                                    <div className="text-[10px] sm:text-xs text-slate-500 font-medium leading-tight">
                                                        to {item.endTimeStr}
                                                    </div>
                                                </div>

                                                {/* Center: Icon with vertical line connecting to next */}
                                                <div className="relative flex flex-col items-center shrink-0 self-stretch">
                                                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white flex items-center justify-center ring-4 shadow-md transition-all duration-300 z-10 ${
                                                        isBreak
                                                            ? "bg-slate-600 ring-slate-100 group-hover:scale-105 group-hover:bg-slate-700"
                                                            : "bg-blue-600 ring-blue-50 group-hover:scale-110 group-hover:bg-orange-500"
                                                    }`}>
                                                        {isBreak ? (
                                                            <Coffee className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                                                        ) : (
                                                            <CalendarCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        )}
                                                    </div>
                                                    {!isLast && (
                                                        <div className={`w-0.5 grow my-1 ${
                                                            isBreak
                                                                ? "bg-gradient-to-b from-slate-300 to-slate-200"
                                                                : "bg-gradient-to-b from-blue-300 via-blue-200 to-slate-200"
                                                        }`} />
                                                    )}
                                                </div>

                                                {/* Right Side: Card with Session Length (Grey bg for breaks, blue tint for regular sessions) */}
                                                <div className="grow pb-2">
                                                    <div className={`rounded-2xl p-4 sm:p-5 border shadow-xs transition-all duration-300 space-y-2 ${
                                                        isBreak
                                                            ? "bg-slate-100/90 hover:bg-slate-200/80 border-slate-300/80 text-slate-800"
                                                            : "bg-slate-50/70 group-hover:bg-blue-50/50 border-slate-200/80 hover:border-blue-200"
                                                    }`}>
                                                        {/* Session length & Speaker Pills */}
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            {/* Session length */}
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                                isBreak
                                                                    ? "bg-slate-200 text-slate-800 border border-slate-300/60"
                                                                    : "bg-blue-100 text-blue-900"
                                                            }`}>
                                                                {isBreak ? (
                                                                    <Coffee className="w-3 h-3 text-slate-600" />
                                                                ) : (
                                                                    <Clock className="w-3 h-3 text-blue-600" />
                                                                )}
                                                                <span>{item.durationLabel}</span>
                                                            </span>
                                                            {item.speaker && (
                                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                                                                    isBreak
                                                                        ? "bg-white/80 text-slate-700 border border-slate-300/60"
                                                                        : "bg-emerald-50 text-emerald-800 border border-emerald-200/60"
                                                                }`}>
                                                                    <Users className="w-3 h-3 text-emerald-600" />
                                                                    {item.speaker}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Title */}
                                                        {item.title && (
                                                            <h3 className={`text-base sm:text-lg font-bold leading-snug ${
                                                                isBreak ? "text-slate-800" : "text-blue-950"
                                                            }`}>
                                                                {item.title}
                                                            </h3>
                                                        )}

                                                        {/* Description */}
                                                        {item.description && (
                                                            <p className={`text-xs sm:text-sm leading-relaxed ${
                                                                isBreak ? "text-slate-600 font-normal" : "text-slate-600"
                                                            }`}>
                                                                {item.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        );
                    })()}

                    {/* Bottom CTA Card */}
                    <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center md:text-left max-w-xl">
                            <span className="px-3 py-1 bg-white/10 text-orange-300 text-xs font-bold rounded-full uppercase tracking-wider">
                                {past ? "Event Concluded" : "Participation & Registration"}
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-bold">
                                {past ? "Looking for Upcoming Initiatives?" : "Reserve Your Seat for This Event"}
                            </h3>
                            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                                {past
                                    ? "This event has already taken place. Visit our official events portal to explore upcoming conclaves, workshops, and student entrepreneurship programs."
                                    : "Connect with industry leaders, domain experts, and peers. Register today to confirm your participation."}
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                            <EventRegistrationWidget
                                snippet={event.registrationSnippet}
                                fallbackUrl={event.registrationUrl}
                                eventTitle={event.title}
                                buttonStyle={event.buttonStyle || "gradient"}
                                isPast={past}
                            />
                            <Link to="/events">
                                <Button
                                    variant="outline"
                                    className="rounded-full text-xs font-bold bg-white/10 hover:bg-white/20 text-white border-white/20">
                                    Browse All Events
                                </Button>
                            </Link>
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EventDetail;