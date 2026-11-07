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
    EventPartner,
    EventPartnerSection,
    EventPerson,
    EventPeopleSection,
    EventAgendaItem,
    processImageFile,
    isEventPast,
    formatEventDisplayDate,
    formatEventDisplayTime,
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
    Building2,
    CalendarCheck,
    Users,
    UserCheck,
} from "lucide-react";
import EventRegistrationWidget, { WidgetButtonStyle } from "@/components/EventRegistrationWidget";
import { toast } from "sonner";

// Normalizes arbitrary date formats (e.g. "March 28, 2026") into "YYYY-MM-DD" for <input type="date" />
const normalizeToDateInput = (d?: string): string => {
    if (!d || !d.trim()) return "";
    const trimmed = d.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
        const year = parsed.getFullYear();
        const month = String(parsed.getMonth() + 1).padStart(2, "0");
        const day = String(parsed.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    }
    return "";
};

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
    const [formStartTime, setFormStartTime] = useState("");
    const [formEndTime, setFormEndTime] = useState("");
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
    
    // Partner Sections & People Sections
    const [formPartnerSections, setFormPartnerSections] = useState<EventPartnerSection[]>([]);
    const [formPeopleSections, setFormPeopleSections] = useState<EventPeopleSection[]>([]);
    const [formAgenda, setFormAgenda] = useState<EventAgendaItem[]>([]);
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
        setFormStartTime("09:30");
        setFormEndTime("17:30");
        setFormTime("09:30 AM - 05:30 PM IST");
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
        setFormPartnerSections([]);
        setFormPeopleSections([]);
        setFormAgenda([]);
        setIsDialogOpen(true);
    };

    const openEditDialog = (event: ResonanceEvent) => {
        setEditingEvent(event);
        setFormTitle(event.title);
        setFormSubtitle(event.subtitle || "");
        setFormPurpose(event.purpose || "");
        setFormDescription(event.description);
        setFormDate(normalizeToDateInput(event.date));
        setFormStartTime(event.startTime || "");
        setFormEndTime(event.endTime || "");
        setFormTime(event.time || "");
        setFormVenue(event.venue || "");
        setFormCategory(event.category || "Workshop");
        setFormStatus(event.status || "upcoming");
        setFormBannerImage(event.bannerImage || "");
        setFormSnippet(event.registrationSnippet || "");
        setFormRegistrationUrl(event.registrationUrl || "");
        setFormButtonStyle(event.buttonStyle || "gradient");

        // Load Partner Sections (fallback to legacy event.partners if needed)
        if (event.partnerSections && event.partnerSections.length > 0) {
            setFormPartnerSections(JSON.parse(JSON.stringify(event.partnerSections)));
        } else if (event.partners && event.partners.length > 0) {
            setFormPartnerSections([
                {
                    id: `ps-${Date.now()}`,
                    title: "Partners & Collaborators",
                    subtitle: "Organizations, chambers and institutions powering this initiative",
                    gridColumns: event.partnerGridColumns || 4,
                    partners: JSON.parse(JSON.stringify(event.partners)),
                },
            ]);
        } else {
            setFormPartnerSections([]);
        }

        // Load People Sections (speakers, delegates, etc.)
        if (event.peopleSections && event.peopleSections.length > 0) {
            setFormPeopleSections(JSON.parse(JSON.stringify(event.peopleSections)));
        } else {
            setFormPeopleSections([]);
        }

        setFormAgenda(event.agenda ? JSON.parse(JSON.stringify(event.agenda)) : []);
        setIsDialogOpen(true);
    };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/") && !file.name.toLowerCase().endsWith(".svg")) {
            toast.error("Please select a valid image file (SVG, PNG, JPG, WEBP)");
            return;
        }

        setIsUploading(true);
        try {
            const base64 = await processImageFile(file, 1400, 0.9);
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

    // ================= PARTNER SECTIONS MANAGERS =================
    const handleAddPartnerSection = () => {
        const newSection: EventPartnerSection = {
            id: `psec-${Date.now()}`,
            title: "Event Partners",
            subtitle: "",
            gridColumns: 4,
            partners: [],
        };
        setFormPartnerSections([...formPartnerSections, newSection]);
    };

    const handleUpdatePartnerSection = (
        secId: string,
        field: keyof EventPartnerSection,
        val: any,
    ) => {
        setFormPartnerSections(
            formPartnerSections.map((s) => (s.id === secId ? { ...s, [field]: val } : s)),
        );
    };

    const handleRemovePartnerSection = (secId: string) => {
        setFormPartnerSections(formPartnerSections.filter((s) => s.id !== secId));
    };

    const handleMovePartnerSection = (idx: number, dir: "up" | "down") => {
        const targetIdx = dir === "up" ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= formPartnerSections.length) return;
        const copy = [...formPartnerSections];
        const temp = copy[idx];
        copy[idx] = copy[targetIdx];
        copy[targetIdx] = temp;
        setFormPartnerSections(copy);
    };

    const handleAddPartnerToSection = (secId: string) => {
        const newPartner: EventPartner = {
            id: `part-${Date.now()}`,
            name: "",
            category: "Partner",
            logo: "",
            websiteUrl: "",
        };
        setFormPartnerSections(
            formPartnerSections.map((s) =>
                s.id === secId ? { ...s, partners: [...s.partners, newPartner] } : s,
            ),
        );
    };

    const handleUpdatePartnerItem = (
        secId: string,
        partnerId: string,
        field: keyof EventPartner,
        val: string,
    ) => {
        setFormPartnerSections(
            formPartnerSections.map((s) =>
                s.id === secId
                    ? {
                          ...s,
                          partners: s.partners.map((p) =>
                              p.id === partnerId ? { ...p, [field]: val } : p,
                          ),
                      }
                    : s,
            ),
        );
    };

    const handleRemovePartnerItem = (secId: string, partnerId: string) => {
        setFormPartnerSections(
            formPartnerSections.map((s) =>
                s.id === secId
                    ? { ...s, partners: s.partners.filter((p) => p.id !== partnerId) }
                    : s,
            ),
        );
    };

    const handlePartnerLogoUpload = async (
        secId: string,
        partnerId: string,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const base64 = await processImageFile(file, 600, 0.9);
            handleUpdatePartnerItem(secId, partnerId, "logo", base64);
            toast.success("Partner icon/logo uploaded successfully");
        } catch (err) {
            toast.error("Failed to process logo file");
        } finally {
            e.target.value = "";
        }
    };

    // ================= PEOPLE SECTIONS MANAGERS (SPEAKERS, DELEGATES, GUESTS) =================
    const handleAddPeopleSection = () => {
        const newSection: EventPeopleSection = {
            id: `peopsec-${Date.now()}`,
            title: "Distinguished Speakers",
            subtitle: "",
            members: [],
        };
        setFormPeopleSections([...formPeopleSections, newSection]);
    };

    const handleUpdatePeopleSection = (
        secId: string,
        field: keyof EventPeopleSection,
        val: any,
    ) => {
        setFormPeopleSections(
            formPeopleSections.map((s) => (s.id === secId ? { ...s, [field]: val } : s)),
        );
    };

    const handleRemovePeopleSection = (secId: string) => {
        setFormPeopleSections(formPeopleSections.filter((s) => s.id !== secId));
    };

    const handleMovePeopleSection = (idx: number, dir: "up" | "down") => {
        const targetIdx = dir === "up" ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= formPeopleSections.length) return;
        const copy = [...formPeopleSections];
        const temp = copy[idx];
        copy[idx] = copy[targetIdx];
        copy[targetIdx] = temp;
        setFormPeopleSections(copy);
    };

    const handleAddPersonToSection = (secId: string) => {
        const newPerson: EventPerson = {
            id: `pers-${Date.now()}`,
            name: "",
            company: "",
            designation: "",
            photo: "",
        };
        setFormPeopleSections(
            formPeopleSections.map((s) =>
                s.id === secId ? { ...s, members: [...s.members, newPerson] } : s,
            ),
        );
    };

    const handleUpdatePersonItem = (
        secId: string,
        personId: string,
        field: keyof EventPerson,
        val: string,
    ) => {
        setFormPeopleSections(
            formPeopleSections.map((s) =>
                s.id === secId
                    ? {
                          ...s,
                          members: s.members.map((m) =>
                              m.id === personId ? { ...m, [field]: val } : m,
                          ),
                      }
                    : s,
            ),
        );
    };

    const handleRemovePersonItem = (secId: string, personId: string) => {
        setFormPeopleSections(
            formPeopleSections.map((s) =>
                s.id === secId
                    ? { ...s, members: s.members.filter((m) => m.id !== personId) }
                    : s,
            ),
        );
    };

    const handlePersonPhotoUpload = async (
        secId: string,
        personId: string,
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const base64 = await processImageFile(file, 600, 0.9);
            handleUpdatePersonItem(secId, personId, "photo", base64);
            toast.success("Photo uploaded successfully");
        } catch (err) {
            toast.error("Failed to process photo");
        } finally {
            e.target.value = "";
        }
    };

    // ================= AGENDA TIMELINE MANAGEMENT =================
    const handleAddAgendaItem = () => {
        const newItem: EventAgendaItem = {
            id: `agenda-${Date.now()}`,
            time: "10:00 AM - 11:00 AM",
            title: "",
            speaker: "",
            description: "",
        };
        setFormAgenda([...formAgenda, newItem]);
    };

    const handleUpdateAgendaItem = (
        id: string,
        field: keyof EventAgendaItem,
        value: string,
    ) => {
        setFormAgenda(
            formAgenda.map((a) => (a.id === id ? { ...a, [field]: value } : a)),
        );
    };

    const handleRemoveAgendaItem = (id: string) => {
        setFormAgenda(formAgenda.filter((a) => a.id !== id));
    };

    const handleMoveAgendaItem = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= formAgenda.length) return;
        const copy = [...formAgenda];
        const temp = copy[index];
        copy[index] = copy[targetIndex];
        copy[targetIndex] = temp;
        setFormAgenda(copy);
    };

    const handleSaveEvent = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formTitle.trim()) {
            toast.error("Please provide an Event Title");
            return;
        }

        // Flatten all partners from partner sections for legacy fallback
        const flattenedPartners = formPartnerSections.flatMap((s) => s.partners);

        let updated: ResonanceEvent[];

        if (editingEvent) {
            updated = events.map((ev) =>
                ev.id === editingEvent.id
                    ? {
                          ...ev,
                          title: formTitle.trim(),
                          subtitle: formSubtitle.trim() || undefined,
                          purpose: formPurpose.trim() || undefined,
                          description: formDescription.trim(),
                          date: formDate.trim(),
                          startTime: formStartTime.trim() || undefined,
                          endTime: formEndTime.trim() || undefined,
                          time: formTime.trim() || undefined,
                          venue: formVenue.trim() || undefined,
                          category: formCategory.trim() || undefined,
                          status: formStatus,
                          bannerImage: formBannerImage || "/media/placeholder.png",
                          registrationSnippet: formSnippet.trim() || undefined,
                          registrationUrl: formRegistrationUrl.trim() || undefined,
                          buttonStyle: formButtonStyle,
                          partnerSections: formPartnerSections,
                          peopleSections: formPeopleSections,
                          partners: flattenedPartners,
                          agenda: formAgenda,
                      }
                    : ev,
            );
            toast.success(`Updated event "${formTitle.trim()}"`);
        } else {
            const newEvent: ResonanceEvent = {
                id: `event-${Date.now()}`,
                title: formTitle.trim(),
                subtitle: formSubtitle.trim() || undefined,
                purpose: formPurpose.trim() || undefined,
                description: formDescription.trim(),
                date: formDate.trim(),
                startTime: formStartTime.trim() || undefined,
                endTime: formEndTime.trim() || undefined,
                time: formTime.trim() || undefined,
                venue: formVenue.trim() || undefined,
                category: formCategory.trim() || undefined,
                status: formStatus,
                bannerImage: formBannerImage || "/media/placeholder.png",
                registrationSnippet: formSnippet.trim() || undefined,
                registrationUrl: formRegistrationUrl.trim() || undefined,
                buttonStyle: formButtonStyle,
                partnerSections: formPartnerSections,
                peopleSections: formPeopleSections,
                partners: flattenedPartners,
                agenda: formAgenda,
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
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Events, Conclaves & Initiatives
                    </h2>
                    <p className="text-blue-100 text-xs md:text-sm mt-1 max-w-2xl leading-relaxed">
                        Configure dates, times, custom partner/sponsor sections, speakers & delegates sections, and timeline agendas.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    <Button
                        onClick={openAddDialog}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add New Event
                    </Button>
                    <Button
                        onClick={handleResetDefaults}
                        variant="outline"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs rounded-xl flex items-center gap-2">
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Defaults
                    </Button>
                </div>
            </div>

            {/* Global Events Portal Configuration Card */}
            <Card className="p-6 bg-white rounded-2xl border-slate-100 shadow-sm">
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                                <LinkIcon className="w-4 h-4" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-blue-950">
                                    Official External Events Portal Link
                                </h3>
                                <p className="text-xs text-slate-500">
                                    When enabled, clicking &quot;Events&quot; in the navbar opens this destination directly.
                                </p>
                            </div>
                        </div>

                        {/* Direct Navbar Redirect Toggle */}
                        <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/80">
                            <span className="text-xs font-semibold text-slate-700">
                                Open Portal from Navbar
                            </span>
                            <Switch
                                checked={openDirectUrl}
                                onCheckedChange={handleToggleDirectUrl}
                                className="data-[state=checked]:bg-blue-600"
                            />
                        </div>
                    </div>

                    <form
                        onSubmit={handleSavePortalUrl}
                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="relative flex-1">
                            <Input
                                id="portal-url-input"
                                name="portalUrl"
                                type="url"
                                placeholder="https://events.theresonance.co.in"
                                value={portalUrlInput}
                                onChange={(e) => setPortalUrlInput(e.target.value)}
                                className="rounded-xl pl-3 text-xs"
                            />
                        </div>
                        <Button
                            type="submit"
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold px-5">
                            Save Portal Link
                        </Button>
                        <a
                            href={config.portalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-blue-700 hover:bg-slate-50 transition-colors">
                            <span>Test Link</span>
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
                            (Shown on /events and dedicated event pages)
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
                    {events.map((ev, index) => {
                        const past = isEventPast(ev.date, ev.status);
                        const displayDate = formatEventDisplayDate(ev.date);
                        const displayTime = formatEventDisplayTime(ev.startTime, ev.endTime, ev.time);

                        const totalPartnersCount =
                            ev.partnerSections?.reduce((acc, s) => acc + (s.partners?.length || 0), 0) ??
                            ev.partners?.length ??
                            0;
                        const totalPeopleCount =
                            ev.peopleSections?.reduce((acc, s) => acc + (s.members?.length || 0), 0) ?? 0;

                        return (
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
                                                    past
                                                        ? "bg-slate-600"
                                                        : ev.status === "upcoming"
                                                        ? "bg-green-600"
                                                        : ev.status === "ongoing"
                                                        ? "bg-orange-500"
                                                        : "bg-slate-600"
                                                }`}>
                                                {past ? "Completed / Past" : ev.status}
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
                                        {/* Date, Time & Venue */}
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                            {displayDate && (
                                                <span className="flex items-center gap-1 font-semibold text-blue-900">
                                                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                                    {displayDate}
                                                </span>
                                            )}
                                            {displayTime && (
                                                <span className="flex items-center gap-1 font-medium">
                                                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                                                    {displayTime}
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

                                        {/* Badges for Sections */}
                                        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-500">
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-lg font-medium">
                                                <Building2 className="w-3 h-3 text-blue-600" />
                                                {totalPartnersCount} Partners / Sponsors ({ev.partnerSections?.length || 1} sections)
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-lg font-medium">
                                                <UserCheck className="w-3 h-3 text-emerald-600" />
                                                {totalPeopleCount} Speakers / Delegates ({ev.peopleSections?.length || 0} sections)
                                            </span>
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 rounded-lg font-medium">
                                                <CalendarCheck className="w-3 h-3 text-amber-600" />
                                                {ev.agenda?.length || 0} Agenda Sessions
                                            </span>
                                        </div>

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
                                                buttonStyle={ev.buttonStyle || "gradient"}
                                                isPast={past}
                                            />
                                        </div>
                                    </CardContent>
                                </div>

                                <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-semibold text-slate-400">
                                            Event #{index + 1}
                                        </span>
                                        <a
                                            href={`/events/${ev.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors">
                                            <Eye className="w-3 h-3" />
                                            <span>Preview Page</span>
                                        </a>
                                    </div>
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
                        );
                    })}
                </div>
            </div>

            {/* Event Edit / Create Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-blue-950 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            <span>{editingEvent ? "Edit Event Details" : "Create New Event"}</span>
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSaveEvent} className="space-y-6 pt-2">
                        {/* Title & Subtitle */}
                        <div className="space-y-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="ev-title" className="text-xs font-bold text-slate-700">
                                    Event Title *
                                </Label>
                                <Input
                                    id="ev-title"
                                    name="title"
                                    placeholder="e.g. National Apprenticeship & Skill Conclave 2026"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    className="rounded-xl font-medium"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="ev-sub" className="text-xs font-bold text-slate-700">
                                    Event Subtitle / Tagline
                                </Label>
                                <Input
                                    id="ev-sub"
                                    name="subtitle"
                                    placeholder="e.g. Empowering 2000+ apprentices"
                                    value={formSubtitle}
                                    onChange={(e) => setFormSubtitle(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Date, Time (Start & End), Venue */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="space-y-1.5">
                                <Label htmlFor="ev-date" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Event Date (Date picker)</span>
                                </Label>
                                <Input
                                    id="ev-date"
                                    name="date"
                                    type="date"
                                    value={formDate}
                                    onChange={(e) => setFormDate(e.target.value)}
                                    className="rounded-xl bg-white text-xs font-semibold"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>Event Times (Start - End)</span>
                                </Label>
                                <div className="grid grid-cols-2 gap-1.5">
                                    <Input
                                        id="ev-start-time"
                                        name="startTime"
                                        type="time"
                                        value={formStartTime}
                                        onChange={(e) => setFormStartTime(e.target.value)}
                                        className="rounded-xl bg-white text-xs"
                                        title="Start Time"
                                    />
                                    <Input
                                        id="ev-end-time"
                                        name="endTime"
                                        type="time"
                                        value={formEndTime}
                                        onChange={(e) => setFormEndTime(e.target.value)}
                                        className="rounded-xl bg-white text-xs"
                                        title="End Time"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="ev-venue" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                    <span>Venue / Location</span>
                                </Label>
                                <Input
                                    id="ev-venue"
                                    name="venue"
                                    placeholder="e.g. Pune Tech Center / Online"
                                    value={formVenue}
                                    onChange={(e) => setFormVenue(e.target.value)}
                                    className="rounded-xl bg-white text-xs"
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
                                    id="ev-cat"
                                    name="category"
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
                                    id="ev-status"
                                    name="status"
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
                                Event Purpose / Objective
                            </Label>
                            <Input
                                id="ev-purpose"
                                name="purpose"
                                placeholder="State the core objective or target outcome of this event..."
                                value={formPurpose}
                                onChange={(e) => setFormPurpose(e.target.value)}
                                className="rounded-xl text-xs"
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label htmlFor="ev-desc" className="text-xs font-bold text-slate-700">
                                Full Event Description
                            </Label>
                            <Textarea
                                id="ev-desc"
                                placeholder="Provide comprehensive details: speakers, agenda, topics covered, eligibility..."
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                                rows={3}
                                className="rounded-xl text-xs leading-relaxed"
                            />
                        </div>

                        {/* Banner Image */}
                        <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="flex items-center justify-between mb-1">
                                <div>
                                    <Label className="text-xs font-bold text-slate-700">
                                        Event Banner Image
                                    </Label>
                                    <p className="text-[11px] text-slate-400">
                                        Will be showcased prominently on the event page with zero text obscuring it.
                                    </p>
                                </div>
                                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-slate-100 text-blue-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors">
                                    <Upload className="w-3.5 h-3.5" />
                                    {isUploading ? "Processing..." : "Upload Image"}
                                    <input
                                        id="event-banner-upload"
                                        name="bannerUpload"
                                        type="file"
                                        accept=".svg,.png,.jpg,.jpeg,.webp,image/*"
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
                                <div className="mt-2 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 max-h-48">
                                    <img
                                        src={formBannerImage}
                                        alt="Banner Preview"
                                        className="w-full h-auto max-h-48 object-contain mx-auto"
                                    />
                                </div>
                            )}
                        </div>

                        {/* ================= PEOPLE SECTIONS MANAGER (SPEAKERS, DELEGATES, GUESTS) ================= */}
                        <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <Users className="w-4 h-4 text-emerald-600" />
                                        <span>Speakers, Delegates & Guests Sections</span>
                                    </h4>
                                    <p className="text-[11px] text-slate-500">
                                        Add different sections with editable names (e.g. Keynote Speakers, Delegates, Guests of Honour). Photos display in uniform round frames. No fields mandatory.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleAddPeopleSection}
                                    size="sm"
                                    className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1">
                                    <Plus className="w-3.5 h-3.5" />
                                    Add People Section
                                </Button>
                            </div>

                            {formPeopleSections.length === 0 ? (
                                <p className="text-xs text-slate-400 italic py-2 text-center">
                                    No people sections yet. Click &quot;Add People Section&quot; to list speakers, delegates, or guests.
                                </p>
                            ) : (
                                <div className="space-y-4 pt-1">
                                    {formPeopleSections.map((sec, sIdx) => (
                                        <div
                                            key={sec.id}
                                            className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                                            {/* Section Header Controls */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                    <div>
                                                        <Label className="text-[10px] font-bold text-slate-600 uppercase">
                                                            Section Title (Editable)
                                                        </Label>
                                                        <Input
                                                            placeholder="e.g. Keynote Speakers / Eminent Delegates / Special Guests"
                                                            value={sec.title}
                                                            onChange={(e) =>
                                                                handleUpdatePeopleSection(
                                                                    sec.id,
                                                                    "title",
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="h-8 text-xs rounded-lg font-bold text-blue-950"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-[10px] font-semibold text-slate-500 uppercase">
                                                            Subtitle (Optional)
                                                        </Label>
                                                        <Input
                                                            placeholder="Optional brief description"
                                                            value={sec.subtitle || ""}
                                                            onChange={(e) =>
                                                                handleUpdatePeopleSection(
                                                                    sec.id,
                                                                    "subtitle",
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="h-8 text-xs rounded-lg"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 self-end sm:self-center">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={sIdx === 0}
                                                        onClick={() => handleMovePeopleSection(sIdx, "up")}
                                                        className="h-7 w-7 p-0 text-slate-500">
                                                        <ArrowUp className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={sIdx === formPeopleSections.length - 1}
                                                        onClick={() => handleMovePeopleSection(sIdx, "down")}
                                                        className="h-7 w-7 p-0 text-slate-500">
                                                        <ArrowDown className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleRemovePeopleSection(sec.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Members in this section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-semibold text-slate-600">
                                                        Members ({sec.members.length})
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleAddPersonToSection(sec.id)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs border-emerald-200 text-emerald-800 hover:bg-emerald-50 rounded-lg flex items-center gap-1">
                                                        <Plus className="w-3 h-3" />
                                                        Add Person
                                                    </Button>
                                                </div>

                                                {sec.members.length === 0 ? (
                                                    <p className="text-[11px] text-slate-400 italic py-1">
                                                        No members added to &quot;{sec.title}&quot; yet.
                                                    </p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {sec.members.map((person, pIdx) => (
                                                            <div
                                                                key={person.id}
                                                                className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                                        Individual #{pIdx + 1}
                                                                    </span>
                                                                    <Button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleRemovePersonItem(
                                                                                sec.id,
                                                                                person.id,
                                                                            )
                                                                        }
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </Button>
                                                                </div>

                                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                                    <div>
                                                                        <Label className="text-[10px] font-semibold text-slate-600">
                                                                            Name
                                                                        </Label>
                                                                        <Input
                                                                            placeholder="e.g. Dr. Milind Kamble"
                                                                            value={person.name || ""}
                                                                            onChange={(e) =>
                                                                                handleUpdatePersonItem(
                                                                                    sec.id,
                                                                                    person.id,
                                                                                    "name",
                                                                                    e.target.value,
                                                                                )
                                                                            }
                                                                            className="h-8 text-xs rounded-lg bg-white"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-[10px] font-semibold text-slate-600">
                                                                            Designation
                                                                        </Label>
                                                                        <Input
                                                                            placeholder="e.g. Founder Chairman"
                                                                            value={person.designation || ""}
                                                                            onChange={(e) =>
                                                                                handleUpdatePersonItem(
                                                                                    sec.id,
                                                                                    person.id,
                                                                                    "designation",
                                                                                    e.target.value,
                                                                                )
                                                                            }
                                                                            className="h-8 text-xs rounded-lg bg-white"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-[10px] font-semibold text-slate-600">
                                                                            Company / Organization
                                                                        </Label>
                                                                        <Input
                                                                            placeholder="e.g. DICCI / Tata Motors"
                                                                            value={person.company || ""}
                                                                            onChange={(e) =>
                                                                                handleUpdatePersonItem(
                                                                                    sec.id,
                                                                                    person.id,
                                                                                    "company",
                                                                                    e.target.value,
                                                                                )
                                                                            }
                                                                            className="h-8 text-xs rounded-lg bg-white"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <div className="flex items-center justify-between mb-0.5">
                                                                        <Label className="text-[10px] font-semibold text-slate-600">
                                                                            Photo (URL or Upload)
                                                                        </Label>
                                                                        <label className="cursor-pointer text-[10px] font-bold text-blue-600 hover:text-blue-800">
                                                                            Upload Photo
                                                                            <input
                                                                                type="file"
                                                                                accept=".svg,.png,.jpg,.jpeg,.webp,image/*"
                                                                                onChange={(e) =>
                                                                                    handlePersonPhotoUpload(
                                                                                        sec.id,
                                                                                        person.id,
                                                                                        e,
                                                                                    )
                                                                                }
                                                                                className="hidden"
                                                                            />
                                                                        </label>
                                                                    </div>
                                                                    <Input
                                                                        placeholder="Image URL or /images/..."
                                                                        value={person.photo || ""}
                                                                        onChange={(e) =>
                                                                            handleUpdatePersonItem(
                                                                                sec.id,
                                                                                person.id,
                                                                                "photo",
                                                                                e.target.value,
                                                                            )
                                                                        }
                                                                        className="h-8 text-xs rounded-lg bg-white"
                                                                    />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ================= PARTNER & SPONSOR SECTIONS MANAGER ================= */}
                        <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <Building2 className="w-4 h-4 text-blue-600" />
                                        <span>Partner & Sponsor Sections</span>
                                    </h4>
                                    <p className="text-[11px] text-slate-500">
                                        Add different sections (e.g. Title Partners, Sponsors, Knowledge Partners). On the live page, only the icon and kind of partner badge are shown (no partner name text).
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleAddPartnerSection}
                                    size="sm"
                                    className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-1">
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Partner Section
                                </Button>
                            </div>

                            {formPartnerSections.length === 0 ? (
                                <p className="text-xs text-slate-400 italic py-2 text-center">
                                    No partner sections yet. Click &quot;Add Partner Section&quot; above.
                                </p>
                            ) : (
                                <div className="space-y-4 pt-1">
                                    {formPartnerSections.map((sec, sIdx) => (
                                        <div
                                            key={sec.id}
                                            className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                                            {/* Section Header */}
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                    <div className="sm:col-span-1">
                                                        <Label className="text-[10px] font-bold text-slate-600 uppercase">
                                                            Section Title (Editable)
                                                        </Label>
                                                        <Input
                                                            placeholder="e.g. Title Partners / Event Sponsors"
                                                            value={sec.title}
                                                            onChange={(e) =>
                                                                handleUpdatePartnerSection(
                                                                    sec.id,
                                                                    "title",
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="h-8 text-xs rounded-lg font-bold text-blue-950"
                                                        />
                                                    </div>
                                                    <div className="sm:col-span-1">
                                                        <Label className="text-[10px] font-semibold text-slate-500 uppercase">
                                                            Subtitle (Optional)
                                                        </Label>
                                                        <Input
                                                            placeholder="Optional subtitle"
                                                            value={sec.subtitle || ""}
                                                            onChange={(e) =>
                                                                handleUpdatePartnerSection(
                                                                    sec.id,
                                                                    "subtitle",
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="h-8 text-xs rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="sm:col-span-1">
                                                        <Label className="text-[10px] font-semibold text-slate-500 uppercase">
                                                            Grid Columns
                                                        </Label>
                                                        <select
                                                            value={sec.gridColumns || 4}
                                                            onChange={(e) =>
                                                                handleUpdatePartnerSection(
                                                                    sec.id,
                                                                    "gridColumns",
                                                                    Number(e.target.value) as 2 | 3 | 4 | 5,
                                                                )
                                                            }
                                                            className="w-full h-8 px-2 rounded-lg border border-slate-300 bg-white text-xs font-semibold">
                                                            <option value={2}>2 Columns</option>
                                                            <option value={3}>3 Columns</option>
                                                            <option value={4}>4 Columns (Default)</option>
                                                            <option value={5}>5 Columns</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 self-end sm:self-center">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={sIdx === 0}
                                                        onClick={() => handleMovePartnerSection(sIdx, "up")}
                                                        className="h-7 w-7 p-0 text-slate-500">
                                                        <ArrowUp className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={sIdx === formPartnerSections.length - 1}
                                                        onClick={() => handleMovePartnerSection(sIdx, "down")}
                                                        className="h-7 w-7 p-0 text-slate-500">
                                                        <ArrowDown className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleRemovePartnerSection(sec.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Partners in this section */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[11px] font-semibold text-slate-600">
                                                        Partners / Sponsors ({sec.partners.length})
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleAddPartnerToSection(sec.id)}
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 text-xs border-blue-200 text-blue-800 hover:bg-blue-50 rounded-lg flex items-center gap-1">
                                                        <Plus className="w-3 h-3" />
                                                        Add Partner / Sponsor
                                                    </Button>
                                                </div>

                                                {sec.partners.length === 0 ? (
                                                    <p className="text-[11px] text-slate-400 italic py-1">
                                                        No partners added to &quot;{sec.title}&quot; yet.
                                                    </p>
                                                ) : (
                                                    <div className="space-y-2">
                                                        {sec.partners.map((partner, pIdx) => (
                                                            <div
                                                                key={partner.id}
                                                                className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                                                        Partner #{pIdx + 1}
                                                                    </span>
                                                                    <Button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            handleRemovePartnerItem(
                                                                                sec.id,
                                                                                partner.id,
                                                                            )
                                                                        }
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700">
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </Button>
                                                                </div>

                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                                    <div>
                                                                        <Label className="text-[10px] font-semibold text-slate-600">
                                                                            Kind of Partner (Badge Text)
                                                                        </Label>
                                                                        <Input
                                                                            placeholder="e.g. Title Partner, Academic Partner, Industry Partner"
                                                                            value={partner.category || ""}
                                                                            onChange={(e) =>
                                                                                handleUpdatePartnerItem(
                                                                                    sec.id,
                                                                                    partner.id,
                                                                                    "category",
                                                                                    e.target.value,
                                                                                )
                                                                            }
                                                                            className="h-8 text-xs rounded-lg bg-white"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-[10px] font-semibold text-slate-600">
                                                                            Partner Name (Internal Reference)
                                                                        </Label>
                                                                        <Input
                                                                            placeholder="e.g. Tata Motors (hidden on public site)"
                                                                            value={partner.name || ""}
                                                                            onChange={(e) =>
                                                                                handleUpdatePartnerItem(
                                                                                    sec.id,
                                                                                    partner.id,
                                                                                    "name",
                                                                                    e.target.value,
                                                                                )
                                                                            }
                                                                            className="h-8 text-xs rounded-lg bg-white"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                                                    <div>
                                                                        <div className="flex items-center justify-between mb-0.5">
                                                                            <Label className="text-[10px] font-semibold text-slate-600">
                                                                                Logo / Icon (SVG / PNG / JPG)
                                                                            </Label>
                                                                            <label className="cursor-pointer text-[10px] font-bold text-blue-600 hover:text-blue-800">
                                                                                Upload SVG/Image
                                                                                <input
                                                                                    type="file"
                                                                                    accept=".svg,.png,.jpg,.jpeg,.webp,image/*"
                                                                                    onChange={(e) =>
                                                                                        handlePartnerLogoUpload(
                                                                                            sec.id,
                                                                                            partner.id,
                                                                                            e,
                                                                                        )
                                                                                    }
                                                                                    className="hidden"
                                                                                />
                                                                            </label>
                                                                        </div>
                                                                        <Input
                                                                            placeholder="URL or /images/..."
                                                                            value={partner.logo || ""}
                                                                            onChange={(e) =>
                                                                                handleUpdatePartnerItem(
                                                                                    sec.id,
                                                                                    partner.id,
                                                                                    "logo",
                                                                                    e.target.value,
                                                                                )
                                                                            }
                                                                            className="h-8 text-xs rounded-lg bg-white"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <Label className="text-[10px] font-semibold text-slate-600">
                                                                            Website URL (Optional)
                                                                        </Label>
                                                                        <Input
                                                                            placeholder="https://..."
                                                                            value={partner.websiteUrl || ""}
                                                                            onChange={(e) =>
                                                                                handleUpdatePartnerItem(
                                                                                    sec.id,
                                                                                    partner.id,
                                                                                    "websiteUrl",
                                                                                    e.target.value,
                                                                                )
                                                                            }
                                                                            className="h-8 text-xs rounded-lg bg-white"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ================= AGENDA TIMELINE SECTION ================= */}
                        <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                        <CalendarCheck className="w-4 h-4 text-amber-600" />
                                        <span>Event Agenda & Timeline</span>
                                    </h4>
                                    <p className="text-[11px] text-slate-500">
                                        Configure session time slots, keynote speakers, and session summaries.
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={handleAddAgendaItem}
                                    size="sm"
                                    className="h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center gap-1">
                                    <Plus className="w-3.5 h-3.5" />
                                    Add Session
                                </Button>
                            </div>

                            {formAgenda.length === 0 ? (
                                <p className="text-xs text-slate-400 italic py-2 text-center">
                                    No agenda items added yet. Click &quot;Add Session&quot; to build the schedule timeline.
                                </p>
                            ) : (
                                <div className="space-y-3 pt-1">
                                    {formAgenda.map((item, aIdx) => (
                                        <div
                                            key={item.id}
                                            className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                    Session #{aIdx + 1}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={aIdx === 0}
                                                        onClick={() => handleMoveAgendaItem(aIdx, "up")}
                                                        className="h-6 w-6 p-0 text-slate-500 hover:text-black">
                                                        <ArrowUp className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        disabled={aIdx === formAgenda.length - 1}
                                                        onClick={() => handleMoveAgendaItem(aIdx, "down")}
                                                        className="h-6 w-6 p-0 text-slate-500 hover:text-black">
                                                        <ArrowDown className="w-3 h-3" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        onClick={() => handleRemoveAgendaItem(item.id)}
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700 ml-1">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                <div>
                                                    <Label className="text-[10px] font-semibold text-slate-600">
                                                        Session Time Range
                                                    </Label>
                                                    <Input
                                                        placeholder="e.g. 09:30 AM - 10:15 AM"
                                                        value={item.time}
                                                        onChange={(e) =>
                                                            handleUpdateAgendaItem(
                                                                item.id,
                                                                "time",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-8 text-xs rounded-lg"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-[10px] font-semibold text-slate-600">
                                                        Speaker / Host (Optional)
                                                    </Label>
                                                    <Input
                                                        placeholder="e.g. Dr. Milind Kamble (DICCI)"
                                                        value={item.speaker || ""}
                                                        onChange={(e) =>
                                                            handleUpdateAgendaItem(
                                                                item.id,
                                                                "speaker",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="h-8 text-xs rounded-lg"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <Label className="text-[10px] font-semibold text-slate-600">
                                                    Session Title
                                                </Label>
                                                <Input
                                                    placeholder="e.g. Inaugural Keynote & Lighting of the Lamp"
                                                    value={item.title}
                                                    onChange={(e) =>
                                                        handleUpdateAgendaItem(
                                                            item.id,
                                                            "title",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-8 text-xs rounded-lg font-semibold"
                                                />
                                            </div>

                                            <div>
                                                <Label className="text-[10px] font-semibold text-slate-600">
                                                    Session Description (Optional)
                                                </Label>
                                                <Textarea
                                                    placeholder="Key takeaways, topics discussed, panel topics..."
                                                    value={item.description || ""}
                                                    onChange={(e) =>
                                                        handleUpdateAgendaItem(
                                                            item.id,
                                                            "description",
                                                            e.target.value,
                                                        )
                                                    }
                                                    rows={2}
                                                    className="text-xs rounded-lg"
                                                />
                                            </div>
                                        </div>
                                    ))}
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
                                    id="ev-reg-url"
                                    name="registrationUrl"
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