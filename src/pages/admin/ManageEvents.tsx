"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    getStoredEvents,
    saveStoredEvents,
    getStoredEventsConfig,
    saveStoredEventsConfig,
    DEFAULT_EVENTS,
    DEFAULT_EVENTS_CONFIG,
    ResonanceEvent,
    EventsConfig,
    isEventPast,
    formatEventDisplayDate,
    formatEventDisplayTime,
} from "@/lib/siteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Calendar,
    Plus,
    Pencil,
    Trash2,
    ArrowUp,
    ArrowDown,
    ExternalLink,
    Link as LinkIcon,
    RotateCcw,
    Clock,
    MapPin,
    Eye,
    Users,
    Building2,
} from "lucide-react";
import { toast } from "sonner";

const PLACEHOLDER_IMAGE = "/media/placeholder.png";
const showPlaceholder = (img: HTMLImageElement) => {
    img.onerror = null;
    img.src = PLACEHOLDER_IMAGE;
};

const ManageEvents: React.FC = () => {
    const navigate = useNavigate();

    // Events & Config states
    const [events, setEvents] = useState<ResonanceEvent[]>(getStoredEvents);
    const [config, setConfig] = useState<EventsConfig>(getStoredEventsConfig);
    const [portalUrlInput, setPortalUrlInput] = useState(config.portalUrl);
    const [openDirectUrl, setOpenDirectUrl] = useState<boolean>(config.openDirectUrl ?? true);

    // Save portal link setting
    const handleSavePortalUrl = (e?: React.FormEvent, newDirectVal?: boolean) => {
        if (e) e.preventDefault();
        const trimmed = portalUrlInput.trim();
        if (!trimmed) {
            toast.error("Please enter a valid portal URL");
            return;
        }

        const validUrl = /^https?:\/\//i.test(trimmed)
            ? trimmed
            : `https://${trimmed}`;

        const effectiveDirectVal = newDirectVal !== undefined ? newDirectVal : openDirectUrl;

        const updated: EventsConfig = {
            ...config,
            portalUrl: validUrl,
            openDirectUrl: effectiveDirectVal,
        };

        saveStoredEventsConfig(updated);
        setConfig(updated);
        setPortalUrlInput(updated.portalUrl);
        setOpenDirectUrl(updated.openDirectUrl);
        toast.success("Events portal configuration updated successfully!");
    };

    const handleToggleDirectUrl = (checked: boolean) => {
        setOpenDirectUrl(checked);
        handleSavePortalUrl(undefined, checked);
    };

    const handleDelete = (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete event "${title}"?`)) {
            const updated = events.filter((ev) => ev.id !== id && ev.slug !== id);
            saveStoredEvents(updated);
            setEvents(updated);
            toast.success(`Deleted event "${title}"`);
        }
    };

    const handleMove = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= events.length) return;

        const updated = [...events];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        saveStoredEvents(updated);
        setEvents(updated);
    };

    const handleResetDefaults = () => {
        if (
            confirm(
                "Reset all events and the portal link back to initial defaults? Custom changes will be replaced.",
            )
        ) {
            saveStoredEvents(DEFAULT_EVENTS);
            saveStoredEventsConfig(DEFAULT_EVENTS_CONFIG);
            setEvents(DEFAULT_EVENTS);
            setConfig(DEFAULT_EVENTS_CONFIG);
            setPortalUrlInput(DEFAULT_EVENTS_CONFIG.portalUrl);
            setOpenDirectUrl(DEFAULT_EVENTS_CONFIG.openDirectUrl);
            toast.success("Reset events and portal configuration to defaults");
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-16">
            {/* Header Banner (Restored to exact elegant gradient from previous version) */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 md:p-8 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-700/60 text-blue-200 text-xs font-semibold rounded-full uppercase tracking-wider">
                            Events Management
                        </span>
                        <span className="px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-full">
                            {events.length} Listed Events
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                        Events & Conclaves Hub
                    </h1>
                    <p className="text-blue-100/90 text-sm max-w-2xl mt-1 leading-relaxed">
                        Create and manage upcoming workshops, conferences, and startup conclaves. Events feature dedicated per-event pages, custom permalinks, sequential agenda timelines, and customizable partners.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <Link to="/events" target="_blank">
                        <Button
                            variant="outline"
                            size="sm"
                            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold rounded-xl backdrop-blur-xs flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" />
                            <span>Public Events Page</span>
                            <ExternalLink className="w-3 h-3 text-blue-200" />
                        </Button>
                    </Link>

                    <Link to="/admin/events/new">
                        <Button
                            className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 px-4">
                            <Plus className="w-4 h-4" />
                            <span>Add New Event</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Global Portal Link Configuration */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                            <LinkIcon className="w-4 h-4" />
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-800">
                                External Events Portal Integration
                            </h2>
                            <p className="text-xs text-slate-500">
                                Configure where the header "Register / All Events" button redirects visitors.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Switch
                                id="direct-url-switch"
                                checked={openDirectUrl}
                                onCheckedChange={handleToggleDirectUrl}
                            />
                            <label
                                htmlFor="direct-url-switch"
                                className="text-xs font-semibold text-slate-700 cursor-pointer">
                                {openDirectUrl ? "Redirects directly to portal" : "Shows events on-site first"}
                            </label>
                        </div>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetDefaults}
                            className="text-xs text-slate-500 hover:text-red-600 rounded-xl flex items-center gap-1">
                            <RotateCcw className="w-3 h-3" />
                            <span>Reset Defaults</span>
                        </Button>
                    </div>
                </div>

                <form onSubmit={handleSavePortalUrl} className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                    <Input
                        type="url"
                        placeholder="https://events.theresonance.co.in"
                        value={portalUrlInput}
                        onChange={(e) => setPortalUrlInput(e.target.value)}
                        className="rounded-xl text-xs bg-slate-50 border-slate-200 focus:bg-white grow"
                    />
                    <Button
                        type="submit"
                        className="rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold shrink-0">
                        Update Portal URL
                    </Button>
                </form>
            </div>

            {/* Events Cards Grid (Rollback to exact 2-column cards layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {events.map((event, index) => {
                    const past = isEventPast(event.date);
                    const displayDate = formatEventDisplayDate(event.date);
                    const displayTime = formatEventDisplayTime(event.startTime, event.endTime, event.time);
                    const totalSpeakers = event.peopleSections?.reduce((acc, s) => acc + (s.members?.length || 0), 0) || 0;
                    const totalPartners = (event.partnerSections?.reduce((acc, s) => acc + (s.partners?.length || 0), 0) || 0) + (event.partners?.length || 0);

                    return (
                        <div
                            key={event.id}
                            className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
                            <div>
                                {/* 16:9 Banner Image Header */}
                                <div className="aspect-video w-full bg-slate-800 relative overflow-hidden group flex items-center justify-center">
                                    {event.bannerImage ? (
                                        <img
                                            src={event.bannerImage}
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                showPlaceholder(e.currentTarget);
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 flex items-center justify-center">
                                            <Calendar className="w-12 h-12 text-blue-400/40" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-between p-4">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs border border-white/20">
                                                {event.category || "Event"}
                                            </span>
                                            {past ? (
                                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-800/90 text-slate-300 border border-slate-700">
                                                    Concluded
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-xs">
                                                    Active
                                                </span>
                                            )}
                                        </div>

                                        <div className="text-white">
                                            <h3 className="font-extrabold text-base sm:text-lg leading-tight line-clamp-2 drop-shadow-sm">
                                                {event.title}
                                            </h3>
                                            {event.subtitle && (
                                                <p className="text-xs text-slate-200 line-clamp-1 mt-0.5 drop-shadow-xs font-medium">
                                                    {event.subtitle}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Event Info Body */}
                                <div className="p-5 space-y-3">
                                    {/* Date, Time, Venue Pills */}
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                                        <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                            <span className="font-semibold text-slate-800">{displayDate}</span>
                                        </div>
                                        {displayTime && (
                                            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                                                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                                                <span>{displayTime}</span>
                                            </div>
                                        )}
                                        {event.venue && (
                                            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                                                <MapPin className="w-3.5 h-3.5 text-red-500" />
                                                <span className="line-clamp-1 max-w-[200px]">{event.venue}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Purpose Callout */}
                                    {event.purpose && (
                                        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs text-amber-900 line-clamp-2">
                                            <strong className="text-amber-950 font-bold">Purpose: </strong>
                                            {event.purpose}
                                        </div>
                                    )}

                                    {/* Custom Permalink Pill & Section Counters */}
                                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500 border-t border-slate-100">
                                        <div className="flex items-center gap-1 font-mono text-blue-700 font-semibold bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-200/60">
                                            <LinkIcon className="w-3 h-3 text-blue-500" />
                                            <span>/events/{event.slug || event.id}</span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {totalSpeakers > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-3 h-3 text-indigo-500" />
                                                    <span>{totalSpeakers} Speakers</span>
                                                </span>
                                            )}
                                            {totalPartners > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Building2 className="w-3 h-3 text-purple-500" />
                                                    <span>{totalPartners} Partners</span>
                                                </span>
                                            )}
                                            {event.agenda && event.agenda.length > 0 && (
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-amber-500" />
                                                    <span>{event.agenda.length} Sessions</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5">
                                    <Link to={`/events/${event.slug || event.id}`} target="_blank">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl text-xs font-semibold h-8 bg-white text-blue-700 border-blue-200 hover:bg-blue-50 flex items-center gap-1">
                                            <Eye className="w-3 h-3" />
                                            <span>View Page</span>
                                        </Button>
                                    </Link>

                                    <Link to={`/admin/events/edit/${event.slug || event.id}`}>
                                        <Button
                                            size="sm"
                                            className="rounded-xl text-xs font-bold h-8 bg-blue-900 hover:bg-blue-950 text-white flex items-center gap-1">
                                            <Pencil className="w-3 h-3" />
                                            <span>Edit Event</span>
                                        </Button>
                                    </Link>
                                </div>

                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleMove(index, "up")}
                                        disabled={index === 0}
                                        className="h-7 w-7 rounded-lg"
                                        title="Move Up">
                                        <ArrowUp className="w-3.5 h-3.5 text-slate-600" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleMove(index, "down")}
                                        disabled={index === events.length - 1}
                                        className="h-7 w-7 rounded-lg"
                                        title="Move Down">
                                        <ArrowDown className="w-3.5 h-3.5 text-slate-600" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(event.id, event.title)}
                                        className="h-7 w-7 rounded-lg text-red-600 hover:bg-red-50"
                                        title="Delete Event">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ManageEvents;
