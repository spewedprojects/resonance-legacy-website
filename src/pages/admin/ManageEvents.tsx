import React, { useState } from "react";
import {
    getStoredEvents,
    saveStoredEvents,
    getStoredEventsConfig,
    saveStoredEventsConfig,
    DEFAULT_EVENTS,
    DEFAULT_EVENTS_CONFIG,
    ResonanceEvent,
    EventsConfig,
    processImageFile,
} from "@/lib/siteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Calendar,
    Plus,
    Pencil,
    Trash2,
    ArrowUp,
    ArrowDown,
    ExternalLink,
    Link as LinkIcon,
    Upload,
    RotateCcw,
    Clock,
    MapPin,
    Target,
    Code,
    Sparkles,
    CheckCircle2,
    Eye,
} from "lucide-react";
import EventRegistrationWidget, { WidgetButtonStyle } from "@/components/EventRegistrationWidget";
import { toast } from "sonner";

const ManageEvents: React.FC = () => {
    // Events & Config states
    const [events, setEvents] = useState<ResonanceEvent[]>(getStoredEvents);
    const [config, setConfig] = useState<EventsConfig>(getStoredEventsConfig);
    const [portalUrlInput, setPortalUrlInput] = useState(config.portalUrl);
    const [openDirectUrl, setOpenDirectUrl] = useState<boolean>(config.openDirectUrl ?? true);

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<ResonanceEvent | null>(null);

    // Form states
    const [formTitle, setFormTitle] = useState("");
    const [formSubtitle, setFormSubtitle] = useState("");
    const [formPurpose, setFormPurpose] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formDate, setFormDate] = useState("");
    const [formTime, setFormTime] = useState("");
    const [formVenue, setFormVenue] = useState("");
    const [formCategory, setFormCategory] = useState("Workshop");
    const [formStatus, setFormStatus] = useState<
        "upcoming" | "ongoing" | "completed"
    >("upcoming");
    const [formBannerImage, setFormBannerImage] = useState("");
    const [formSnippet, setFormSnippet] = useState("");
    const [formRegistrationUrl, setFormRegistrationUrl] = useState("");
    const [formButtonStyle, setFormButtonStyle] = useState<WidgetButtonStyle>("gradient");
    const [isUploading, setIsUploading] = useState(false);

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

    const openAddDialog = () => {
        setEditingEvent(null);
        setFormTitle("");
        setFormSubtitle("");
        setFormPurpose("");
        setFormDescription("");
        setFormDate("");
        setFormTime("10:00 AM - 04:00 PM IST");
        setFormVenue("Pune, Maharashtra");
        setFormCategory("Workshop");
        setFormStatus("upcoming");
        setFormBannerImage(
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
        );
        setFormSnippet(
            `<a href="${config.portalUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#ff5722,#e64a19);color:#ffffff;font-family:sans-serif;font-size:13px;font-weight:700;padding:10px 22px;border-radius:9999px;text-decoration:none;box-shadow:0 4px 12px rgba(230,74,25,0.3);"><span>Register Now</span></a>`,
        );
        setFormRegistrationUrl(config.portalUrl);
        setFormButtonStyle("gradient");
        setIsDialogOpen(true);
    };

    const openEditDialog = (event: ResonanceEvent) => {
        setEditingEvent(event);
        setFormTitle(event.title);
        setFormSubtitle(event.subtitle || "");
        setFormPurpose(event.purpose || "");
        setFormDescription(event.description);
        setFormDate(event.date || "");
        setFormTime(event.time || "");
        setFormVenue(event.venue || "");
        setFormCategory(event.category || "Workshop");
        setFormStatus(event.status || "upcoming");
        setFormBannerImage(event.bannerImage || "");
        setFormSnippet(event.registrationSnippet || "");
        setFormRegistrationUrl(event.registrationUrl || "");
        setFormButtonStyle(event.buttonStyle || "gradient");
        setIsDialogOpen(true);
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please select a valid image file");
            return;
        }

        setIsUploading(true);
        try {
            const base64 = await processImageFile(file, 1200, 0.85);
            setFormBannerImage(base64);
            toast.success("Banner image uploaded successfully");
        } catch (err) {
            console.error("Banner upload failed", err);
            toast.error("Failed to process banner image");
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    const handleSaveEvent = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formTitle.trim() || !formDescription.trim()) {
            toast.error("Please provide both Event Title and Description");
            return;
        }

        let updated: ResonanceEvent[];

        if (editingEvent) {
            updated = events.map((ev) =>
                ev.id === editingEvent.id
                    ? {
                          ...ev,
                          title: formTitle.trim(),
                          subtitle: formSubtitle.trim() || undefined,
                          purpose: formPurpose.trim(),
                          description: formDescription.trim(),
                          date: formDate.trim() || "TBA",
                          time: formTime.trim() || undefined,
                          venue: formVenue.trim() || "Online",
                          category: formCategory.trim() || "Event",
                          status: formStatus,
                          bannerImage: formBannerImage || "/media/placeholder.png",
                          registrationSnippet: formSnippet.trim() || undefined,
                          registrationUrl: formRegistrationUrl.trim() || undefined,
                          buttonStyle: formButtonStyle,
                      }
                    : ev,
            );
            toast.success(`Updated event "${formTitle.trim()}"`);
        } else {
            const newEvent: ResonanceEvent = {
                id: `event-${Date.now()}`,
                title: formTitle.trim(),
                subtitle: formSubtitle.trim() || undefined,
                purpose: formPurpose.trim(),
                description: formDescription.trim(),
                date: formDate.trim() || "TBA",
                time: formTime.trim() || undefined,
                venue: formVenue.trim() || "Online",
                category: formCategory.trim() || "Event",
                status: formStatus,
                bannerImage: formBannerImage || "/media/placeholder.png",
                registrationSnippet: formSnippet.trim() || undefined,
                registrationUrl: formRegistrationUrl.trim() || undefined,
                buttonStyle: formButtonStyle,
            };
            updated = [newEvent, ...events];
            toast.success(`Created new event "${formTitle.trim()}"`);
        }

        saveStoredEvents(updated);
        setEvents(updated);
        setIsDialogOpen(false);
    };

    const handleDelete = (id: string, title: string) => {
        if (confirm(`Are you sure you want to delete event "${title}"?`)) {
            const updated = events.filter((ev) => ev.id !== id);
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
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Banner */}
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
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2.5">
                        <Calendar className="w-8 h-8 text-orange-400" />
                        Manage Events & Portal Link
                    </h1>
                    <p className="text-blue-200 text-sm mt-1 max-w-2xl">
                        Configure the external events portal destination and create rich event listings with custom HTML registration widgets (ticketing widgets, embed scripts, and custom banners).
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        onClick={handleResetDefaults}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold rounded-xl">
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                        Reset Defaults
                    </Button>
                    <Button
                        onClick={openAddDialog}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md text-xs sm:text-sm font-semibold rounded-xl">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Create New Event
                    </Button>
                </div>
            </div>

            {/* Portal Link Configuration Card */}
            <Card className="bg-white rounded-2xl border-slate-200/80 shadow-sm p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                        <h3 className="text-base font-bold text-blue-950 flex items-center gap-2">
                            <ExternalLink className="w-5 h-5 text-blue-600" />
                            Navbar & Footer "Events" Navigation Behavior
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed max-w-xl">
                            Choose whether clicking the <strong>"Events"</strong> button in the navigation opens the external portal directly or takes visitors to the website's on-site events showcase.
                        </p>
                    </div>

                    {/* Switch Control */}
                    <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 px-4 py-3 rounded-2xl shrink-0">
                        <Switch
                            id="portal-switch"
                            checked={openDirectUrl}
                            onCheckedChange={handleToggleDirectUrl}
                        />
                        <Label
                            htmlFor="portal-switch"
                            className="cursor-pointer text-xs font-bold text-slate-800 flex flex-col">
                            <span>{openDirectUrl ? "Direct External URL" : "On-Site Events Page (/events)"}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                                {openDirectUrl
                                    ? "Opens external portal directly in a new tab"
                                    : "Opens /events page on this website"}
                            </span>
                        </Label>
                    </div>
                </div>

                {/* Destination URL Input */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                        <h4 className="text-xs font-bold text-slate-700">
                            Destination External Portal URL
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                            Target address when direct external link is enabled (or featured in the header banner).
                        </p>
                    </div>

                    <form
                        onSubmit={(e) => handleSavePortalUrl(e)}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 max-w-lg">
                        <div className="relative flex-1">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                id="portal-url-input"
                                name="portalUrl"
                                type="url"
                                value={portalUrlInput}
                                onChange={(e) => setPortalUrlInput(e.target.value)}
                                placeholder="https://events.theresonance.co.in"
                                className="pl-9 rounded-xl text-xs font-mono"
                                required
                            />
                        </div>
                        <Button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shrink-0">
                            Save URL
                        </Button>
                        <a
                            href={config.portalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-blue-700 hover:bg-slate-50 transition-colors"
                            title="Test URL in new tab">
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </form>
                </div>
            </Card>

            {/* Listed Events Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-blue-950 flex items-center gap-2">
                        <span>On-Site Events List</span>
                        <span className="text-xs font-semibold text-slate-400">
                            (Shown on /events)
                        </span>
                    </h3>
                    <a
                        href="/events"
                        target="_blank"
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
                        View Public Events Page <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {events.map((ev, index) => (
                        <Card
                            key={ev.id}
                            className="bg-white rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
                            <div>
                                {/* Banner Preview */}
                                <div className="relative aspect-[16/9] w-full bg-slate-100 overflow-hidden">
                                    <img
                                        src={ev.bannerImage || "/media/placeholder.png"}
                                        alt={ev.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src =
                                                "/media/placeholder.png";
                                        }}
                                    />
                                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${
                                                ev.status === "upcoming"
                                                    ? "bg-green-600"
                                                    : ev.status === "ongoing"
                                                    ? "bg-orange-500"
                                                    : "bg-slate-600"
                                            }`}>
                                            {ev.status}
                                        </span>
                                        {ev.category && (
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-sm shadow-sm">
                                                {ev.category}
                                            </span>
                                        )}
                                    </div>

                                    {/* Reorder Buttons */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm p-1 rounded-lg shadow-sm">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={index === 0}
                                            onClick={() => handleMove(index, "up")}
                                            className="h-6 w-6 p-0 text-slate-700 hover:text-black disabled:opacity-30">
                                            <ArrowUp className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={index === events.length - 1}
                                            onClick={() => handleMove(index, "down")}
                                            className="h-6 w-6 p-0 text-slate-700 hover:text-black disabled:opacity-30">
                                            <ArrowDown className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>

                                <CardContent className="p-5 space-y-3">
                                    {/* Date & Venue */}
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                        {ev.date && (
                                            <span className="flex items-center gap-1 font-semibold text-blue-900">
                                                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                                {ev.date}
                                            </span>
                                        )}
                                        {ev.venue && (
                                            <span className="flex items-center gap-1 font-medium">
                                                <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                                {ev.venue}
                                            </span>
                                        )}
                                    </div>

                                    <h4 className="text-base font-bold text-blue-950 leading-snug line-clamp-1">
                                        {ev.title}
                                    </h4>

                                    {ev.purpose && (
                                        <div className="p-2.5 bg-orange-50/70 border border-orange-100 rounded-xl text-xs text-slate-700 line-clamp-2">
                                            <strong className="text-orange-950">Purpose: </strong>
                                            {ev.purpose}
                                        </div>
                                    )}

                                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                        {ev.description}
                                    </p>

                                    {/* Registration Widget Status */}
                                    <div className="pt-2 flex items-center justify-between text-xs">
                                        <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                                            <Code className="w-3.5 h-3.5 text-indigo-500" />
                                            {ev.registrationSnippet
                                                ? "HTML Snippet Active"
                                                : "Direct URL Button"}
                                        </span>
                                        <EventRegistrationWidget
                                            snippet={ev.registrationSnippet}
                                            fallbackUrl={ev.registrationUrl}
                                            eventTitle={ev.title}
                                        />
                                    </div>
                                </CardContent>
                            </div>

                            <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                <span className="text-[11px] font-semibold text-slate-400">
                                    Event #{index + 1}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => openEditDialog(ev)}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-2.5 text-xs text-blue-700 border-blue-200 hover:bg-blue-50 rounded-lg">
                                        <Pencil className="w-3.5 h-3.5 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        onClick={() => handleDelete(ev.id, ev.title)}
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Create / Edit Event Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-blue-950 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            {editingEvent ? "Edit Event" : "Create New Event"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSaveEvent} className="space-y-4 pt-2">
                        {/* Title & Subtitle */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="ev-title" className="text-xs font-bold text-slate-700">
                                    Event Title *
                                </Label>
                                <Input
                                    id="ev-title" name="title"
                                    placeholder="e.g. National Apprenticeship Conclave 2026"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    className="rounded-xl"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="ev-sub" className="text-xs font-bold text-slate-700">
                                    Event Subtitle / Tagline
                                </Label>
                                <Input
                                    id="ev-sub" name="subtitle"
                                    placeholder="e.g. Empowering 2000+ apprentices"
                                    value={formSubtitle}
                                    onChange={(e) => setFormSubtitle(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Date, Time, Venue */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="ev-date" className="text-xs font-bold text-slate-700">
                                    Event Date *
                                </Label>
                                <Input
                                    id="ev-date" name="date"
                                    placeholder="e.g. March 28, 2026"
                                    value={formDate}
                                    onChange={(e) => setFormDate(e.target.value)}
                                    className="rounded-xl"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="ev-time" className="text-xs font-bold text-slate-700">
                                    Event Time
                                </Label>
                                <Input
                                    id="ev-time" name="time"
                                    placeholder="e.g. 10:00 AM - 05:00 PM IST"
                                    value={formTime}
                                    onChange={(e) => setFormTime(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="ev-venue" className="text-xs font-bold text-slate-700">
                                    Venue / Location
                                </Label>
                                <Input
                                    id="ev-venue" name="venue"
                                    placeholder="e.g. Pune Tech Center / Online"
                                    value={formVenue}
                                    onChange={(e) => setFormVenue(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Category & Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="ev-cat" className="text-xs font-bold text-slate-700">
                                    Category
                                </Label>
                                <Input
                                    id="ev-cat" name="category"
                                    placeholder="e.g. Workshop, Conclave, Bootcamp"
                                    value={formCategory}
                                    onChange={(e) => setFormCategory(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="ev-status" className="text-xs font-bold text-slate-700">
                                    Status
                                </Label>
                                <select
                                    id="ev-status" name="status"
                                    value={formStatus}
                                    onChange={(e) =>
                                        setFormStatus(
                                            e.target.value as
                                                | "upcoming"
                                                | "ongoing"
                                                | "completed",
                                        )
                                    }
                                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs font-semibold">
                                    <option value="upcoming">Upcoming</option>
                                    <option value="ongoing">Live & Ongoing</option>
                                    <option value="completed">Completed / Past</option>
                                </select>
                            </div>
                        </div>

                        {/* Purpose */}
                        <div className="space-y-1.5">
                            <Label htmlFor="ev-purpose" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5 text-orange-500" />
                                Event Purpose / Objective *
                            </Label>
                            <Input
                                id="ev-purpose" name="purpose"
                                placeholder="State the core objective or target outcome of this event..."
                                value={formPurpose}
                                onChange={(e) => setFormPurpose(e.target.value)}
                                className="rounded-xl text-xs"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label htmlFor="ev-desc" className="text-xs font-bold text-slate-700">
                                Full Event Description *
                            </Label>
                            <Textarea
                                id="ev-desc"
                                placeholder="Provide comprehensive details: speakers, agenda, topics covered, eligibility..."
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                                rows={3}
                                className="rounded-xl text-xs leading-relaxed"
                                required
                            />
                        </div>

                        {/* Banner Image */}
                        <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="flex items-center justify-between mb-1">
                                <Label className="text-xs font-bold text-slate-700">
                                    Banner Image
                                </Label>
                                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-blue-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors">
                                    <Upload className="w-3.5 h-3.5" />
                                    {isUploading ? "Processing..." : "Upload Image"}
                                    <input
                                        id="event-banner-upload"
                                        name="bannerUpload"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleBannerUpload}
                                        className="hidden"
                                        disabled={isUploading}
                                    />
                                </label>
                            </div>
                            <Input
                                id="event-banner-url"
                                name="bannerImageUrl"
                                placeholder="Or enter banner image URL (e.g. https://...)"
                                value={formBannerImage}
                                onChange={(e) => setFormBannerImage(e.target.value)}
                                className="bg-white rounded-xl text-xs font-mono"
                            />
                            {formBannerImage && (
                                <div className="mt-2 aspect-[21/9] rounded-xl overflow-hidden bg-slate-100 max-h-36">
                                    <img
                                        src={formBannerImage}
                                        alt="Banner Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Third-Party Registration HTML Snippet */}
                        <div className="space-y-2 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="ev-snippet" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <Code className="w-3.5 h-3.5 text-indigo-600" />
                                    Third-Party Registration Button / HTML Snippet
                                </Label>
                                <span className="text-[10px] text-slate-400">
                                    Accepts &lt;a&gt;, &lt;button&gt;, or embed scripts
                                </span>
                            </div>

                            <Textarea
                                id="ev-snippet"
                                placeholder={`Paste your button snippet or embed code here, e.g.:\n<div><script src=\"https://...\" ...></script></div>\nor\n<a href=\"https://...\" ...>Register Now</a>`}
                                value={formSnippet}
                                onChange={(e) => setFormSnippet(e.target.value)}
                                rows={3}
                                className="bg-white rounded-xl text-xs font-mono"
                            />

                            {/* Fallback Direct URL */}
                            <div className="pt-1">
                                <Label htmlFor="ev-reg-url" className="text-[11px] font-semibold text-slate-500">
                                    Direct Registration URL (Alternative / Fallback)
                                </Label>
                                <Input
                                    id="ev-reg-url" name="registrationUrl"
                                    placeholder="https://..."
                                    value={formRegistrationUrl}
                                    onChange={(e) => setFormRegistrationUrl(e.target.value)}
                                    className="bg-white rounded-xl text-xs mt-1"
                                />
                            </div>

                            {/* Button Appearance Style Selector */}
                            <div className="space-y-1.5 pt-1">
                                <Label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                    <span>Button Visual Appearance</span>
                                    <span className="text-[10px] text-slate-400 font-normal">
                                        Overrides raw flat orange button with high-end visuals
                                    </span>
                                </Label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormButtonStyle("gradient")}
                                        className={`p-2.5 rounded-xl border text-left transition-all ${
                                            formButtonStyle === "gradient"
                                                ? "border-orange-500 bg-orange-50/70 shadow-sm ring-1 ring-orange-500"
                                                : "border-slate-200 hover:border-slate-300 bg-white"
                                        }`}>
                                        <div className="h-3.5 rounded-full bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 mb-1.5 shadow-sm" />
                                        <div className="text-[11px] font-bold text-slate-800">Resonance Pill</div>
                                        <div className="text-[9px] text-slate-500">Vibrant gradient</div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFormButtonStyle("navy")}
                                        className={`p-2.5 rounded-xl border text-left transition-all ${
                                            formButtonStyle === "navy"
                                                ? "border-blue-700 bg-blue-50/70 shadow-sm ring-1 ring-blue-700"
                                                : "border-slate-200 hover:border-slate-300 bg-white"
                                        }`}>
                                        <div className="h-3.5 rounded-full bg-gradient-to-r from-blue-900 to-indigo-900 mb-1.5 border border-orange-400/60 shadow-sm" />
                                        <div className="text-[11px] font-bold text-slate-800">Corporate Navy</div>
                                        <div className="text-[9px] text-slate-500">Navy with orange ring</div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFormButtonStyle("glow")}
                                        className={`p-2.5 rounded-xl border text-left transition-all ${
                                            formButtonStyle === "glow"
                                                ? "border-purple-600 bg-purple-50/70 shadow-sm ring-1 ring-purple-600"
                                                : "border-slate-200 hover:border-slate-300 bg-white"
                                        }`}>
                                        <div className="h-3.5 rounded-full bg-gradient-to-r from-orange-500 via-fuchsia-600 to-purple-600 mb-1.5 shadow-sm shadow-purple-500/40" />
                                        <div className="text-[11px] font-bold text-slate-800">Cyber Aurora</div>
                                        <div className="text-[9px] text-slate-500">High-energy glow</div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setFormButtonStyle("classic")}
                                        className={`p-2.5 rounded-xl border text-left transition-all ${
                                            formButtonStyle === "classic"
                                                ? "border-slate-700 bg-slate-100 shadow-sm ring-1 ring-slate-700"
                                                : "border-slate-200 hover:border-slate-300 bg-white"
                                        }`}>
                                        <div className="h-3.5 rounded bg-[#ff5722] mb-1.5 shadow-sm" />
                                        <div className="text-[11px] font-bold text-slate-800">Original / Raw</div>
                                        <div className="text-[9px] text-slate-500">Raw third-party style</div>
                                    </button>
                                </div>
                            </div>

                            {/* Snippet Preview */}
                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-500">
                                    Button Preview:
                                </span>
                                <EventRegistrationWidget
                                    snippet={formSnippet}
                                    fallbackUrl={formRegistrationUrl}
                                    eventTitle={formTitle}
                                    buttonStyle={formButtonStyle}
                                />
                            </div>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                className="rounded-xl text-xs">
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold">
                                {editingEvent ? "Save Event Changes" : "Create Event"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageEvents;
