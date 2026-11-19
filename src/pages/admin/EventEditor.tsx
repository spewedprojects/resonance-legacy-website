"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    getStoredEvents,
    saveStoredEvents,
    getStoredEventsConfig,
    ResonanceEvent,
    EventPartner,
    EventPartnerSection,
    EventPerson,
    EventPeopleSection,
    EventAgendaItem,
    EventAgendaSubItem,
    AgendaSectionType,
    AgendaSubItemStyle,
    processImageFile,
    calculateAgendaSchedule,
    formatSessionDuration,
    formatSubItemMarker,
    generateEventSlug,
    sanitizeEventSlug,
    findEventByIdentifier,
} from "@/lib/siteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import {
    Calendar,
    Plus,
    Trash2,
    ArrowUp,
    ArrowDown,
    ExternalLink,
    Link as LinkIcon,
    Upload,
    Clock,
    MapPin,
    Target,
    Code,
    Sparkles,
    Eye,
    Building2,
    Users,
    UserCheck,
    ChevronDown,
    ChevronUp,
    Ticket,
    Info,
    ArrowLeft,
    Save,
    Copy,
    Check,
    User,
    Image as ImageIcon,
    Coffee,
    ListOrdered,
} from "lucide-react";
import EventRegistrationWidget, { WidgetButtonStyle } from "@/components/EventRegistrationWidget";
import { toast } from "sonner";

const PLACEHOLDER_IMAGE = "/media/placeholder.png";
const showPlaceholder = (img: HTMLImageElement) => {
    img.onerror = null; // Prevent recursive loops
    img.src = PLACEHOLDER_IMAGE;
};

type EventEditorTab = "info" | "people" | "partners" | "agenda" | "registration";

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

const EventEditor: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = !!id && id !== "new";

    const config = getStoredEventsConfig();
    const portalUrl = config.portalUrl || "https://events.theresonance.co.in";

    const [activeTab, setActiveTab] = useState<EventEditorTab>("info");
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [copiedSlug, setCopiedSlug] = useState(false);
    const [copiedShortSlug, setCopiedShortSlug] = useState(false);

    // Form fields
    const [formTitle, setFormTitle] = useState("");
    const [formSlug, setFormSlug] = useState("");
    const [formShortSlug, setFormShortSlug] = useState("");
    const [formSubtitle, setFormSubtitle] = useState("");
    const [formPurpose, setFormPurpose] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formDate, setFormDate] = useState("");
    const [formStartTime, setFormStartTime] = useState("09:30");
    const [formEndTime, setFormEndTime] = useState("17:30");
    const [formTime, setFormTime] = useState("");
    const [formVenue, setFormVenue] = useState("");
    const [formCategory, setFormCategory] = useState("Workshop");
    const [formStatus, setFormStatus] = useState<"upcoming" | "ongoing" | "completed">("upcoming");
    const [formBannerImage, setFormBannerImage] = useState("");
    const [formSnippet, setFormSnippet] = useState("");
    const [formRegistrationUrl, setFormRegistrationUrl] = useState("");
    const [formButtonStyle, setFormButtonStyle] = useState<WidgetButtonStyle>("gradient");

    const [formPartnerSections, setFormPartnerSections] = useState<EventPartnerSection[]>([]);
    const [formPeopleSections, setFormPeopleSections] = useState<EventPeopleSection[]>([]);
    const [formAgenda, setFormAgenda] = useState<EventAgendaItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    // Load existing event data if editing
    useEffect(() => {
        if (isEditing) {
            const allEvents = getStoredEvents();
            const found = findEventByIdentifier(allEvents, id);
            if (found) {
                setFormTitle(found.title || "");
                setFormSlug(found.slug || generateEventSlug(found.title || ""));
                setFormShortSlug(found.shortSlug || "");
                setFormSubtitle(found.subtitle || "");
                setFormPurpose(found.purpose || "");
                setFormDescription(found.description || "");
                setFormDate(normalizeToDateInput(found.date));
                setFormStartTime(found.startTime || "09:30");
                setFormEndTime(found.endTime || "17:30");
                setFormTime(found.time || "");
                setFormVenue(found.venue || "");
                setFormCategory(found.category || "Workshop");
                setFormStatus(found.status || "upcoming");
                setFormBannerImage(found.bannerImage || "");
                setFormSnippet(found.registrationSnippet || "");
                setFormRegistrationUrl(found.registrationUrl || portalUrl);
                setFormButtonStyle(found.buttonStyle || "gradient");

                // Partner sections
                if (found.partnerSections && found.partnerSections.length > 0) {
                    setFormPartnerSections(JSON.parse(JSON.stringify(found.partnerSections)));
                } else if (found.partners && found.partners.length > 0) {
                    setFormPartnerSections([
                        {
                            id: `psec-${Date.now()}`,
                            title: "Event Partners & Sponsors",
                            subtitle: "Organizations collaborating on this initiative",
                            gridColumns: (found.partnerGridColumns as 2 | 3 | 4 | 5) || 4,
                            partners: JSON.parse(JSON.stringify(found.partners)),
                        },
                    ]);
                } else {
                    setFormPartnerSections([]);
                }

                // People sections
                if (found.peopleSections && found.peopleSections.length > 0) {
                    setFormPeopleSections(JSON.parse(JSON.stringify(found.peopleSections)));
                } else {
                    setFormPeopleSections([]);
                }

                // Agenda
                setFormAgenda(found.agenda ? JSON.parse(JSON.stringify(found.agenda)) : []);
            } else {
                toast.error("Event not found");
                navigate("/admin/events");
            }
        } else {
            // Defaults for new event
            setFormTitle("");
            setFormSlug("");
            setFormShortSlug("");
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
                `<a href="${portalUrl}" target="_blank" rel="noopener noreferrer"><span>Register Now</span></a>`,
            );
            setFormRegistrationUrl(portalUrl);
            setFormButtonStyle("gradient");
            setFormPartnerSections([]);
            setFormPeopleSections([]);
            setFormAgenda([]);
        }
    }, [id, isEditing, portalUrl, navigate]);

    // Fast toggle for compact space-saving rows
    const toggleExpanded = (itemId: string) => {
        setExpandedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
    };

    const setAllExpanded = (itemIds: string[], expand: boolean) => {
        setExpandedItems((prev) => {
            const next = { ...prev };
            itemIds.forEach((itemId) => {
                next[itemId] = expand;
            });
            return next;
        });
    };

    // Live sequential calculation of agenda items
    const liveSchedule = useMemo(() => {
        return calculateAgendaSchedule(formStartTime, formAgenda);
    }, [formStartTime, formAgenda]);

    const totalAgendaMinutes = useMemo(() => {
        return liveSchedule.reduce((acc, s) => acc + s.durationMinutes, 0);
    }, [liveSchedule]);

    const totalPeople = useMemo(() => {
        return formPeopleSections.reduce((acc, s) => acc + (s.members?.length || 0), 0);
    }, [formPeopleSections]);

    const totalPartners = useMemo(() => {
        return formPartnerSections.reduce((acc, s) => acc + (s.partners?.length || 0), 0);
    }, [formPartnerSections]);

    // Handle Title change: auto-generate slug for new event
    const handleTitleChange = (val: string) => {
        setFormTitle(val);
        if (!isEditing && (!formSlug || formSlug === generateEventSlug(formTitle))) {
            setFormSlug(generateEventSlug(val));
        }
    };

    // Handle Manual Slug change
    const handleSlugChange = (val: string) => {
        setFormSlug(sanitizeEventSlug(val));
    };

    // Handle Short Alias Slug change
    const handleShortSlugChange = (val: string) => {
        setFormShortSlug(sanitizeEventSlug(val));
    };

    // Banner upload handler
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
        } catch {
            toast.error("Failed to process banner image");
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    // ================= PARTNER SECTION HANDLERS =================
    const handleAddPartnerSection = () => {
        const newSecId = `psec-${Date.now()}`;
        const newSection: EventPartnerSection = {
            id: newSecId,
            title: "New Partner / Sponsor Category",
            subtitle: "",
            gridColumns: 4,
            partners: [],
        };
        setFormPartnerSections([...formPartnerSections, newSection]);
    };

    const handleUpdatePartnerSection = <K extends keyof EventPartnerSection>(
        secId: string,
        field: K,
        val: EventPartnerSection[K],
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
        const newPartId = `part-${Date.now()}`;
        const newPartner: EventPartner = {
            id: newPartId,
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
        setExpandedItems((prev) => ({ ...prev, [newPartId]: true }));
    };

    const handleUpdatePartnerItem = <K extends keyof EventPartner>(
        secId: string,
        partnerId: string,
        field: K,
        val: EventPartner[K],
    ) => {
        setFormPartnerSections(
            formPartnerSections.map((s) => {
                if (s.id !== secId) return s;
                return {
                    ...s,
                    partners: s.partners.map((p) => (p.id === partnerId ? { ...p, [field]: val } : p)),
                };
            }),
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

    const handleMovePartnerItem = (secId: string, idx: number, dir: "up" | "down") => {
        const targetIdx = dir === "up" ? idx - 1 : idx + 1;
        setFormPartnerSections(
            formPartnerSections.map((s) => {
                if (s.id !== secId) return s;
                if (targetIdx < 0 || targetIdx >= s.partners.length) return s;
                const copy = [...s.partners];
                const temp = copy[idx];
                copy[idx] = copy[targetIdx];
                copy[targetIdx] = temp;
                return { ...s, partners: copy };
            }),
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
        } catch {
            toast.error("Failed to process logo file");
        } finally {
            e.target.value = "";
        }
    };

    // ================= PEOPLE SECTION HANDLERS =================
    const handleAddPeopleSection = () => {
        const newSecId = `peopsec-${Date.now()}`;
        const newSection: EventPeopleSection = {
            id: newSecId,
            title: "Distinguished Speakers",
            subtitle: "",
            members: [],
        };
        setFormPeopleSections([...formPeopleSections, newSection]);
    };

    const handleUpdatePeopleSection = <K extends keyof EventPeopleSection>(
        secId: string,
        field: K,
        val: EventPeopleSection[K],
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
        const newPersonId = `person-${Date.now()}`;
        const newPerson: EventPerson = {
            id: newPersonId,
            name: "",
            designation: "",
            company: "",
            photo: "",
        };
        setFormPeopleSections(
            formPeopleSections.map((s) =>
                s.id === secId ? { ...s, members: [...s.members, newPerson] } : s,
            ),
        );
        setExpandedItems((prev) => ({ ...prev, [newPersonId]: true }));
    };

    const handleUpdatePersonItem = <K extends keyof EventPerson>(
        secId: string,
        personId: string,
        field: K,
        val: EventPerson[K],
    ) => {
        setFormPeopleSections(
            formPeopleSections.map((s) => {
                if (s.id !== secId) return s;
                return {
                    ...s,
                    members: s.members.map((m) => (m.id === personId ? { ...m, [field]: val } : m)),
                };
            }),
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

    const handleMovePersonItem = (secId: string, idx: number, dir: "up" | "down") => {
        const targetIdx = dir === "up" ? idx - 1 : idx + 1;
        setFormPeopleSections(
            formPeopleSections.map((s) => {
                if (s.id !== secId) return s;
                if (targetIdx < 0 || targetIdx >= s.members.length) return s;
                const copy = [...s.members];
                const temp = copy[idx];
                copy[idx] = copy[targetIdx];
                copy[targetIdx] = temp;
                return { ...s, members: copy };
            }),
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
            const base64 = await processImageFile(file, 500, 0.9);
            handleUpdatePersonItem(secId, personId, "photo", base64);
            toast.success("Photo uploaded successfully");
        } catch {
            toast.error("Failed to process photo file");
        } finally {
            e.target.value = "";
        }
    };

    // ================= AGENDA HANDLERS =================
    const addAgendaEntry = (type: AgendaSectionType) => {
        const newId = `ag-${type}-${Date.now()}`;
        const newItem: EventAgendaItem = {
            id: newId,
            durationMinutes: type === "break" ? 30 : type === "special" ? 60 : 45,
            title:
                type === "break"
                    ? "Networking & Refreshments Break"
                    : type === "special"
                        ? "Inaugural Session"
                        : "",
            speaker: "",
            description:
                type === "break"
                    ? "Informal networking, tea, and refreshments."
                    : "",
            isBreak: type === "break",
            sectionType: type,
            sectionLabel: type === "special" ? "Inaugural" : undefined,
            subItems: [],
            subItemsStyle: "bullet",
        };
        setFormAgenda((prev) => [...prev, newItem]);
        setExpandedItems((prev) => ({ ...prev, [newId]: true }));
    };

    const setAgendaSectionType = (agId: string, type: AgendaSectionType) => {
        setFormAgenda((prev) =>
            prev.map((a) =>
                a.id === agId
                    ? {
                        ...a,
                        sectionType: type,
                        isBreak: type === "break",
                        sectionLabel:
                            type === "special"
                                ? (a.sectionLabel || "Inaugural")
                                : undefined,
                    }
                    : a,
            ),
        );
    };

    const handleUpdateAgendaItem = <K extends keyof EventAgendaItem>(
        agId: string,
        field: K,
        value: EventAgendaItem[K],
    ) => {
        setFormAgenda((prev) =>
            prev.map((a) => (a.id === agId ? { ...a, [field]: value } : a)),
        );
    };

    const handleRemoveAgendaItem = (agId: string) => {
        setFormAgenda((prev) => prev.filter((a) => a.id !== agId));
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

    const handleAddSubItem = (agId: string) => {
        const subId = `sub-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const newSub: EventAgendaSubItem = {
            id: subId,
            title: "",
            speaker: "",
            durationMinutes: undefined,
        };
        setFormAgenda((prev) =>
            prev.map((a) =>
                a.id === agId
                    ? { ...a, subItems: [...(a.subItems || []), newSub] }
                    : a,
            ),
        );
    };

    const handleUpdateSubItem = <K extends keyof EventAgendaSubItem>(
        agId: string,
        subId: string,
        field: K,
        value: EventAgendaSubItem[K],
    ) => {
        setFormAgenda((prev) =>
            prev.map((a) =>
                a.id === agId
                    ? {
                        ...a,
                        subItems: (a.subItems || []).map((s) =>
                            s.id === subId ? { ...s, [field]: value } : s,
                        ),
                    }
                    : a,
            ),
        );
    };

    const handleRemoveSubItem = (agId: string, subId: string) => {
        setFormAgenda((prev) =>
            prev.map((a) =>
                a.id === agId
                    ? { ...a, subItems: (a.subItems || []).filter((s) => s.id !== subId) }
                    : a,
            ),
        );
    };

    const handleMoveSubItem = (agId: string, subIndex: number, direction: "up" | "down") => {
        setFormAgenda((prev) =>
            prev.map((a) => {
                if (a.id !== agId) return a;
                const list = [...(a.subItems || [])];
                const target = direction === "up" ? subIndex - 1 : subIndex + 1;
                if (target < 0 || target >= list.length) return a;
                const tmp = list[subIndex];
                list[subIndex] = list[target];
                list[target] = tmp;
                return { ...a, subItems: list };
            }),
        );
    };

    // Save event
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formTitle.trim()) {
            toast.error("Please provide an Event Title");
            setActiveTab("info");
            return;
        }

        const effectiveSlug =
            sanitizeEventSlug(formSlug, true) || generateEventSlug(formTitle.trim());
        const cleanedShort = sanitizeEventSlug(formShortSlug, true);
        const effectiveShortSlug =
            cleanedShort && cleanedShort !== effectiveSlug ? cleanedShort : undefined;

        const flattenedPartners = formPartnerSections.flatMap((s) => s.partners);
        const computedSchedule = calculateAgendaSchedule(formStartTime, formAgenda);
        const finalAgenda: EventAgendaItem[] = computedSchedule.map((s) => {
            const cleanSubItems = (s.subItems || [])
                .map((sub) => ({
                    id: sub.id,
                    title: sub.title.trim(),
                    speaker: sub.speaker?.trim() || undefined,
                    durationMinutes:
                        typeof sub.durationMinutes === "number" && sub.durationMinutes > 0
                            ? sub.durationMinutes
                            : undefined,
                }))
                .filter((sub) => sub.title || sub.speaker);

            return {
                id: s.id,
                durationMinutes: s.durationMinutes,
                time: s.timeRangeStr,
                title: s.title,
                speaker: s.speaker,
                description: s.description,
                isBreak: s.isBreak,
                sectionType: s.sectionType,
                sectionLabel:
                    s.sectionType === "special"
                        ? s.sectionLabel?.trim() || "Special Session"
                        : undefined,
                subItems: cleanSubItems.length > 0 ? cleanSubItems : undefined,
                subItemsStyle:
                    cleanSubItems.length > 0 ? s.subItemsStyle || "bullet" : undefined,
            };
        });

        const currentEvents = getStoredEvents();
        const existingEvent = isEditing ? findEventByIdentifier(currentEvents, id) : undefined;
        const eventId = existingEvent?.id || (isEditing && id ? id : `event-${Date.now()}`);

        const conflict = currentEvents.find(
            (ev) =>
                ev.id !== eventId &&
                (ev.slug?.toLowerCase() === effectiveSlug ||
                    ev.shortSlug?.toLowerCase() === effectiveSlug ||
                    (effectiveShortSlug &&
                        (ev.slug?.toLowerCase() === effectiveShortSlug ||
                            ev.shortSlug?.toLowerCase() === effectiveShortSlug))),
        );
        if (conflict) {
            toast.error(
                `Permalink or short slug is already used by "${conflict.title}". Please choose a unique value.`,
            );
            setActiveTab("info");
            return;
        }

        const updatedEvent: ResonanceEvent = {
            id: eventId,
            slug: effectiveSlug,
            shortSlug: effectiveShortSlug,
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
            bannerImage: formBannerImage?.trim() || "",
            registrationSnippet: formSnippet.trim() || undefined,
            registrationUrl: formRegistrationUrl.trim() || undefined,
            buttonStyle: formButtonStyle,
            partnerSections: formPartnerSections,
            peopleSections: formPeopleSections,
            partners: flattenedPartners,
            agenda: finalAgenda,
        };

        let updatedList: ResonanceEvent[];
        if (isEditing) {
            updatedList = currentEvents.map((ev) => (ev.id === eventId ? updatedEvent : ev));
            toast.success(`Updated event "${updatedEvent.title}"`);
        } else {
            updatedList = [updatedEvent, ...currentEvents];
            toast.success(`Created new event "${updatedEvent.title}"`);
        }

        saveStoredEvents(updatedList);
        navigate("/admin/events");
    };

    const copyEventUrl = (slugToCopy: string, which: "primary" | "short") => {
        const url = `${window.location.origin}/events/${slugToCopy}`;
        navigator.clipboard.writeText(url);
        if (which === "primary") {
            setCopiedSlug(true);
            toast.success("Primary event permalink copied to clipboard!");
            setTimeout(() => setCopiedSlug(false), 2000);
        } else {
            setCopiedShortSlug(true);
            toast.success("Short alias URL copied to clipboard!");
            setTimeout(() => setCopiedShortSlug(false), 2000);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-16">
            {/* Top Bar with Navigation & Actions */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/admin/events")}
                        className="rounded-xl flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900 border-slate-300">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Events</span>
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-blue-950 flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-orange-500" />
                            <span>{isEditing ? `Edit: ${formTitle || "Event"}` : "Create New Event"}</span>
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Dedicated high-speed editor with custom permalink, agenda scheduler, and partner showcase
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                    {isEditing && (
                        <Link to={`/events/${formSlug || id}`} target="_blank">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="rounded-xl text-xs font-semibold text-blue-700 border-blue-200 hover:bg-blue-50 flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5" />
                                <span>View Live</span>
                                <ExternalLink className="w-3 h-3 text-blue-500" />
                            </Button>
                        </Link>
                    )}
                    <Button
                        type="button"
                        onClick={handleSave}
                        className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-5 shadow-sm flex items-center gap-1.5">
                        <Save className="w-4 h-4" />
                        <span>{isEditing ? "Save Event Changes" : "Publish Event"}</span>
                    </Button>
                </div>
            </div>

            {/* Permalink Banner */}
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex flex-col gap-2.5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2 text-blue-900">
                        <LinkIcon className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-semibold">Public Event URL:</span>
                        <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-blue-200 text-blue-800 break-all">
                            /events/
                            <span className="font-bold text-orange-600">
                                {formSlug || generateEventSlug(formTitle || "your-event-slug")}
                            </span>
                        </span>
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => copyEventUrl(formSlug || generateEventSlug(formTitle || "event"), "primary")}
                        className="rounded-xl text-xs h-8 bg-white border-blue-200 text-blue-700 hover:bg-blue-100/50 flex items-center gap-1.5 self-start sm:self-center shrink-0">
                        {copiedSlug ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedSlug ? "Copied!" : "Copy URL"}</span>
                    </Button>
                </div>

                {formShortSlug.trim() && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-blue-200/60">
                        <div className="flex flex-wrap items-center gap-2 text-emerald-950">
                            <LinkIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span className="font-semibold">Short Alias URL:</span>
                            <span className="font-mono bg-white px-2.5 py-1 rounded-lg border border-emerald-200 text-emerald-800 break-all">
                                /events/
                                <span className="font-bold text-emerald-600">
                                    {formShortSlug}
                                </span>
                            </span>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => copyEventUrl(formShortSlug.trim(), "short")}
                            className="rounded-xl text-xs h-8 bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50 flex items-center gap-1.5 self-start sm:self-center shrink-0">
                            {copiedShortSlug ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedShortSlug ? "Copied!" : "Copy Short URL"}</span>
                        </Button>
                    </div>
                )}
            </div>

            {/* Horizontal Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-slate-200/70 rounded-2xl overflow-x-auto scrollbar-none">
                <button
                    type="button"
                    onClick={() => setActiveTab("info")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        activeTab === "info"
                            ? "bg-white text-blue-950 shadow-sm ring-1 ring-slate-300"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}>
                    <Info className="w-4 h-4 text-blue-600" />
                    <span>1. Basic Info & Permalink</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("people")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        activeTab === "people"
                            ? "bg-white text-blue-950 shadow-sm ring-1 ring-slate-300"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}>
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span>2. Speakers & Guests</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/50">
                        {totalPeople}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("partners")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        activeTab === "partners"
                            ? "bg-white text-blue-950 shadow-sm ring-1 ring-slate-300"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}>
                    <Building2 className="w-4 h-4 text-purple-600" />
                    <span>3. Partners & Sponsors</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-50 text-purple-700 font-semibold border border-purple-200/50">
                        {totalPartners}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("agenda")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        activeTab === "agenda"
                            ? "bg-white text-blue-950 shadow-sm ring-1 ring-slate-300"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}>
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>4. Agenda & Timeline</span>
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-50 text-amber-700 font-semibold border border-amber-200/50">
                        {formAgenda.length}
                    </span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveTab("registration")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                        activeTab === "registration"
                            ? "bg-white text-blue-950 shadow-sm ring-1 ring-slate-300"
                            : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                    }`}>
                    <Ticket className="w-4 h-4 text-emerald-600" />
                    <span>5. Registration & CTA</span>
                </button>
            </div>

            {/* Main Form Content Container */}
            <form onSubmit={handleSave} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6">
                {/* ================= TAB 1: BASIC INFO & PERMALINK ================= */}
                {activeTab === "info" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="ev-title" className="text-xs font-bold text-slate-700">
                                    Event Title *
                                </Label>
                                <Input
                                    id="ev-title"
                                    name="title"
                                    placeholder="e.g. National Apprenticeship & Skill Conclave 2026"
                                    value={formTitle}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    className="rounded-xl font-medium"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="ev-slug" className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                    <span className="flex items-center gap-1.5">
                                        <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                                        <span>Custom Permalink / Slug</span>
                                    </span>
                                    <span className="text-[11px] text-slate-400">e.g. /events/your-event-slug</span>
                                </Label>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
                                        /events/
                                    </span>
                                    <Input
                                        id="ev-slug"
                                        name="slug"
                                        placeholder="national-apprenticeship-conclave-2026"
                                        value={formSlug}
                                        onChange={(e) => handleSlugChange(e.target.value)}
                                        className="rounded-xl font-mono text-xs font-semibold text-blue-900"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/70">
                            <Label htmlFor="ev-short-slug" className="text-xs font-bold text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <span className="flex items-center gap-1.5">
                                    <LinkIcon className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Short Permalink / Alias Slug (Optional)</span>
                                </span>
                                <span className="text-[11px] font-normal text-emerald-700">
                                    Keep your circulated primary slug above intact; both URLs open this same event
                                </span>
                            </Label>
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-mono text-emerald-700 bg-white px-3 py-2 rounded-xl border border-emerald-200 shrink-0">
                                    /events/
                                </span>
                                <Input
                                    id="ev-short-slug"
                                    name="shortSlug"
                                    placeholder="e.g. nasc26 or skill-fest"
                                    value={formShortSlug}
                                    onChange={(e) => handleShortSlugChange(e.target.value)}
                                    className="rounded-xl font-mono text-xs font-semibold text-emerald-900 bg-white border-emerald-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="ev-sub" className="text-xs font-bold text-slate-700">
                                Event Subtitle / Tagline
                            </Label>
                            <Input
                                id="ev-sub"
                                name="subtitle"
                                placeholder="e.g. Bridging Academia and Industry through Work-Integrated Degree Apprenticeships"
                                value={formSubtitle}
                                onChange={(e) => setFormSubtitle(e.target.value)}
                                className="rounded-xl"
                            />
                        </div>

                        {/* Date, Time (Start & End), Venue */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="space-y-1.5">
                                <Label htmlFor="ev-date" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Event Date</span>
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
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        id="ev-start-time"
                                        name="startTime"
                                        type="time"
                                        value={formStartTime}
                                        onChange={(e) => setFormStartTime(e.target.value)}
                                        className="rounded-xl bg-white text-xs font-semibold"
                                        title="Event Start Time (baseline for Sequential Agenda)"
                                    />
                                    <Input
                                        id="ev-end-time"
                                        name="endTime"
                                        type="time"
                                        value={formEndTime}
                                        onChange={(e) => setFormEndTime(e.target.value)}
                                        className="rounded-xl bg-white text-xs font-semibold"
                                        title="Event End Time"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="ev-venue" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-red-500" />
                                    <span>Venue & Location</span>
                                </Label>
                                <Input
                                    id="ev-venue"
                                    name="venue"
                                    placeholder="e.g. Auto Cluster Exhibition Centre, Pune"
                                    value={formVenue}
                                    onChange={(e) => setFormVenue(e.target.value)}
                                    className="rounded-xl bg-white text-xs"
                                />
                            </div>
                        </div>

                        {/* Category & Status */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="ev-category" className="text-xs font-bold text-slate-700">
                                    Event Category / Format
                                </Label>
                                <select
                                    id="ev-category"
                                    name="category"
                                    value={formCategory}
                                    onChange={(e) => setFormCategory(e.target.value)}
                                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none">
                                    <option value="Conclave">Conclave & Conference</option>
                                    <option value="Workshop">Technical Workshop</option>
                                    <option value="Bootcamp">Bootcamp & Hackathon</option>
                                    <option value="Roundtable">Industry Roundtable</option>
                                    <option value="Webinar">Virtual Seminar / Webinar</option>
                                    <option value="Exhibition">Exhibition & Expo</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="ev-status" className="text-xs font-bold text-slate-700">
                                    Event Status
                                </Label>
                                <select
                                    id="ev-status"
                                    name="status"
                                    value={formStatus}
                                    onChange={(e) => setFormStatus(e.target.value as any)}
                                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-xs font-medium focus:ring-2 focus:ring-blue-600 focus:outline-none">
                                    <option value="upcoming">Upcoming (Registrations Open)</option>
                                    <option value="ongoing">Happening Today / Live</option>
                                    <option value="completed">Concluded / Past Event</option>
                                </select>
                            </div>
                        </div>

                        {/* Purpose Callout */}
                        <div className="space-y-1.5">
                            <Label htmlFor="ev-purpose" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                <Target className="w-3.5 h-3.5 text-orange-500" />
                                <span>Event Purpose & Why Attend</span>
                            </Label>
                            <Textarea
                                id="ev-purpose"
                                name="purpose"
                                placeholder="Highlight the key takeaways and benefits for participants..."
                                value={formPurpose}
                                onChange={(e) => setFormPurpose(e.target.value)}
                                rows={2}
                                className="rounded-xl text-xs"
                            />
                        </div>

                        {/* Full Description */}
                        <div className="space-y-1.5">
                            <Label htmlFor="ev-desc" className="text-xs font-bold text-slate-700">
                                Full Event Description
                            </Label>
                            <Textarea
                                id="ev-desc"
                                name="description"
                                placeholder="Provide comprehensive details about the schedule, tracks, and expected attendees..."
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                                rows={4}
                                className="rounded-xl text-xs"
                            />
                        </div>

                        {/* Banner Image Upload & 16:9 Preview */}
                        <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="flex items-center justify-between">
                                <Label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <Upload className="w-3.5 h-3.5 text-blue-600" />
                                    <span>Event Hero Banner (Unobscured 16:9 Display)</span>
                                </Label>
                                <span className="text-[11px] text-slate-400">
                                    Accepts SVG, PNG, JPG, WEBP (auto-optimized)
                                </span>
                            </div>

                            <div className="flex flex-col md:flex-row gap-4 items-start">
                                <div className="w-full md:w-72 aspect-video bg-slate-100 rounded-xl overflow-hidden border border-slate-300 shadow-inner relative group shrink-0 flex items-center justify-center">
                                    {formBannerImage ? (
                                        <>
                                            <img
                                                src={formBannerImage}
                                                alt="Banner Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    showPlaceholder(e.currentTarget);
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold">
                                                16:9 Banner Preview
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 text-center select-none">
                                            <ImageIcon className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                                            <span className="text-[11px] font-semibold text-slate-500">No banner uploaded</span>
                                            <span className="text-[10px] text-slate-400">16:9 aspect ratio recommended</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 grow w-full">
                                    <div className="flex items-center gap-2">
                                        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs">
                                            <Upload className="w-3.5 h-3.5" />
                                            <span>{isUploading ? "Processing..." : "Upload Banner Image"}</span>
                                            <input
                                                type="file"
                                                accept="image/*,.svg"
                                                onChange={handleBannerUpload}
                                                className="hidden"
                                                disabled={isUploading}
                                            />
                                        </label>
                                        {formBannerImage && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setFormBannerImage("")}
                                                className="text-xs text-red-600 hover:bg-red-50 rounded-xl border-red-200">
                                                Reset
                                            </Button>
                                        )}
                                    </div>

                                    <div className="space-y-1">
                                        <Label htmlFor="ev-banner-url" className="text-[11px] font-semibold text-slate-500">
                                            Or Banner Image URL
                                        </Label>
                                        <Input
                                            id="ev-banner-url"
                                            name="bannerImage"
                                            placeholder="https://..."
                                            value={formBannerImage}
                                            onChange={(e) => setFormBannerImage(e.target.value)}
                                            className="bg-white rounded-xl text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ================= TAB 2: SPEAKERS & GUESTS ================= */}
                {activeTab === "people" && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                            <div>
                                <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-indigo-600" />
                                    <span>Speakers, Guests & Delegates Sections</span>
                                </h3>
                                <p className="text-xs text-indigo-800/80">
                                    Add customizable categories (e.g. Keynote Speakers, Panelists, Chief Guests). Each individual has an elegant circular framed photo.
                                </p>
                            </div>
                            <Button
                                type="button"
                                onClick={handleAddPeopleSection}
                                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shrink-0 flex items-center gap-1.5">
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Speaker Category</span>
                            </Button>
                        </div>

                        {formPeopleSections.length === 0 ? (
                            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                                <Users className="w-10 h-10 text-slate-400 mx-auto" />
                                <div className="text-sm font-semibold text-slate-700">No speaker sections added yet</div>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    Create sections like "Keynote Speakers", "Panel Discussion Leads", or "Chief Guests".
                                </p>
                                <Button
                                    type="button"
                                    onClick={handleAddPeopleSection}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                                    <Plus className="w-3.5 h-3.5 mr-1" />
                                    Add Your First Category
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {formPeopleSections.map((sec, secIdx) => (
                                    <div
                                        key={sec.id}
                                        className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-4 shadow-xs">
                                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                                            <div className="flex items-center gap-2 grow">
                                                <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                                                    {secIdx + 1}
                                                </span>
                                                <Input
                                                    placeholder="Category Title (e.g. Distinguished Speakers)"
                                                    value={sec.title}
                                                    onChange={(e) =>
                                                        handleUpdatePeopleSection(sec.id, "title", e.target.value)
                                                    }
                                                    className="bg-white rounded-xl text-xs font-bold text-slate-800 h-9 max-w-md"
                                                />
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleMovePeopleSection(secIdx, "up")}
                                                    disabled={secIdx === 0}
                                                    className="h-7 w-7 rounded-lg">
                                                    <ArrowUp className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleMovePeopleSection(secIdx, "down")}
                                                    disabled={secIdx === formPeopleSections.length - 1}
                                                    className="h-7 w-7 rounded-lg">
                                                    <ArrowDown className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemovePeopleSection(sec.id)}
                                                    className="h-7 w-7 rounded-lg text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-xs font-bold text-slate-600">
                                                Members ({sec.members.length})
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {sec.members.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const allExpanded = sec.members.every((m) => expandedItems[m.id]);
                                                            setAllExpanded(sec.members.map((m) => m.id), !allExpanded);
                                                        }}
                                                        className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600">
                                                        {sec.members.every((m) => expandedItems[m.id]) ? "Collapse All" : "Expand All"}
                                                    </button>
                                                )}
                                                <Button
                                                    type="button"
                                                    size="sm"
                                                    onClick={() => handleAddPersonToSection(sec.id)}
                                                    className="rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold h-8 flex items-center gap-1">
                                                    <Plus className="w-3 h-3" />
                                                    <span>Add Person</span>
                                                </Button>
                                            </div>
                                        </div>

                                        {sec.members.length === 0 ? (
                                            <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-white text-xs text-slate-400">
                                                No persons added to this section yet. Click "Add Person" above.
                                            </div>
                                        ) : (
                                            <div className="space-y-2.5">
                                                {sec.members.map((m, mIdx) => {
                                                    const isExpanded = expandedItems[m.id] ?? false;
                                                    return (
                                                        <div
                                                            key={m.id}
                                                            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all">
                                                            {/* Compact Collapsed Row */}
                                                            <div
                                                                onClick={() => toggleExpanded(m.id)}
                                                                className="p-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 select-none">
                                                                <div className="flex items-center gap-3 grow min-w-0">
                                                                    <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-orange-400 to-indigo-500 shrink-0 shadow-xs">
                                                                        <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
                                                                            {m.photo ? (
                                                                                <img
                                                                                    src={m.photo}
                                                                                    alt={m.name || "Photo"}
                                                                                    className="w-full h-full object-cover"
                                                                                    onError={(e) => {
                                                                                        e.currentTarget.onerror = null;
                                                                                        showPlaceholder(e.currentTarget);
                                                                                    }}
                                                                                />
                                                                            ) : (
                                                                                <User className="w-4 h-4 text-slate-400" />
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    <div className="min-w-0 grow">
                                                                        <div className="text-xs font-bold text-slate-800 truncate">
                                                                            {m.name || <span className="text-slate-400 italic">Unnamed Person</span>}
                                                                        </div>
                                                                        <div className="text-[11px] text-slate-500 truncate">
                                                                            {m.designation || m.company
                                                                                ? `${m.designation || ""}${m.designation && m.company ? " • " : ""}${m.company || ""}`
                                                                                : "Click to add designation & company"}
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleMovePersonItem(sec.id, mIdx, "up")}
                                                                        disabled={mIdx === 0}
                                                                        className="h-6 w-6 rounded-md">
                                                                        <ArrowUp className="w-3 h-3" />
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleMovePersonItem(sec.id, mIdx, "down")}
                                                                        disabled={mIdx === sec.members.length - 1}
                                                                        className="h-6 w-6 rounded-md">
                                                                        <ArrowDown className="w-3 h-3" />
                                                                    </Button>
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() => handleRemovePersonItem(sec.id, m.id)}
                                                                        className="h-6 w-6 rounded-md text-red-500 hover:bg-red-50">
                                                                        <Trash2 className="w-3 h-3" />
                                                                    </Button>
                                                                    <div className="pl-1 text-slate-400">
                                                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Expanded Card Details */}
                                                            {isExpanded && (
                                                                <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3">
                                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                                        <div className="space-y-1">
                                                                            <Label className="text-[11px] font-semibold text-slate-600">Full Name</Label>
                                                                            <Input
                                                                                placeholder="e.g. Dr. Milind Kamble"
                                                                                value={m.name || ""}
                                                                                onChange={(e) =>
                                                                                    handleUpdatePersonItem(sec.id, m.id, "name", e.target.value)
                                                                                }
                                                                                className="bg-white rounded-xl text-xs h-8"
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <Label className="text-[11px] font-semibold text-slate-600">Designation / Role</Label>
                                                                            <Input
                                                                                placeholder="e.g. Chairman & Founder"
                                                                                value={m.designation || ""}
                                                                                onChange={(e) =>
                                                                                    handleUpdatePersonItem(sec.id, m.id, "designation", e.target.value)
                                                                                }
                                                                                className="bg-white rounded-xl text-xs h-8"
                                                                            />
                                                                        </div>
                                                                        <div className="space-y-1">
                                                                            <Label className="text-[11px] font-semibold text-slate-600">Company / Organization</Label>
                                                                            <Input
                                                                                placeholder="e.g. DICCI Apex Chamber"
                                                                                value={m.company || ""}
                                                                                onChange={(e) =>
                                                                                    handleUpdatePersonItem(sec.id, m.id, "company", e.target.value)
                                                                                }
                                                                                className="bg-white rounded-xl text-xs h-8"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center gap-3 pt-1">
                                                                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold">
                                                                            <Upload className="w-3 h-3" />
                                                                            <span>Upload Photo</span>
                                                                            <input
                                                                                type="file"
                                                                                accept="image/*"
                                                                                onChange={(e) => handlePersonPhotoUpload(sec.id, m.id, e)}
                                                                                className="hidden"
                                                                            />
                                                                        </label>
                                                                        <Input
                                                                            placeholder="Or paste photo URL..."
                                                                            value={m.photo || ""}
                                                                            onChange={(e) =>
                                                                                handleUpdatePersonItem(sec.id, m.id, "photo", e.target.value)
                                                                            }
                                                                            className="bg-white rounded-xl text-xs h-8 grow"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ================= TAB 3: PARTNERS & SPONSORS ================= */}
                {activeTab === "partners" && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-purple-50/60 rounded-2xl border border-purple-100">
                            <div>
                                <h3 className="text-sm font-bold text-purple-950 flex items-center gap-1.5">
                                    <Building2 className="w-4 h-4 text-purple-600" />
                                    <span>Partners & Sponsors Sections</span>
                                </h3>
                                <p className="text-xs text-purple-800/80">
                                    Organize partners by section (e.g. Title Sponsors, Knowledge Partners). For partners, only kind of partner and logo icon are displayed. Accepts SVG, PNG, JPG.
                                </p>
                            </div>
                            <Button
                                type="button"
                                onClick={handleAddPartnerSection}
                                className="rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs shrink-0 flex items-center gap-1.5">
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Partner Category</span>
                            </Button>
                        </div>

                        {formPartnerSections.length === 0 ? (
                            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                                <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
                                <div className="text-sm font-semibold text-slate-700">No partner sections added yet</div>
                                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                    Create sections like "Industry Partners", "Academic Sponsors", or "Media Collaborators".
                                </p>
                                <Button
                                    type="button"
                                    onClick={handleAddPartnerSection}
                                    variant="outline"
                                    size="sm"
                                    className="rounded-xl text-xs font-semibold text-purple-600 border-purple-200 hover:bg-purple-50">
                                    <Plus className="w-3.5 h-3.5 mr-1" />
                                    Add Your First Category
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {formPartnerSections.map((sec, secIdx) => (
                                    <div
                                        key={sec.id}
                                        className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-4 shadow-xs">
                                        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200">
                                            <div className="flex items-center gap-2 grow">
                                                <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center shrink-0">
                                                    {secIdx + 1}
                                                </span>
                                                <Input
                                                    placeholder="Category Title (e.g. Industry Partners)"
                                                    value={sec.title}
                                                    onChange={(e) =>
                                                        handleUpdatePartnerSection(sec.id, "title", e.target.value)
                                                    }
                                                    className="bg-white rounded-xl text-xs font-bold text-slate-800 h-9 max-w-md"
                                                />
                                            </div>

                                            {/* Columns selector & actions */}
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
                                                    <span>Columns:</span>
                                                    <select
                                                        value={sec.gridColumns || 4}
                                                        onChange={(e) =>
                                                            handleUpdatePartnerSection(
                                                                sec.id,
                                                                "gridColumns",
                                                                parseInt(e.target.value, 10) as any,
                                                            )
                                                        }
                                                        className="bg-transparent font-bold text-purple-700 focus:outline-none cursor-pointer">
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                    </select>
                                                </div>

                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleMovePartnerSection(secIdx, "up")}
                                                    disabled={secIdx === 0}
                                                    className="h-7 w-7 rounded-lg">
                                                    <ArrowUp className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleMovePartnerSection(secIdx, "down")}
                                                    disabled={secIdx === formPartnerSections.length - 1}
                                                    className="h-7 w-7 rounded-lg">
                                                    <ArrowDown className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemovePartnerSection(sec.id)}
                                                    className="h-7 w-7 rounded-lg text-red-600 hover:bg-red-50">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-xs font-bold text-slate-600">
                                                Partners ({sec.partners.length})
                                            </span>
                                            <Button
                                                type="button"
                                                size="sm"
                                                onClick={() => handleAddPartnerToSection(sec.id)}
                                                className="rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-semibold h-8 flex items-center gap-1">
                                                <Plus className="w-3 h-3" />
                                                <span>Add Partner Icon</span>
                                            </Button>
                                        </div>

                                        {sec.partners.length === 0 ? (
                                            <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-white text-xs text-slate-400">
                                                No partner logos added. Click "Add Partner Icon" above.
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                {sec.partners.map((p, pIdx) => (
                                                    <div
                                                        key={p.id}
                                                        className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2.5 shadow-xs flex flex-col justify-between">
                                                        <div className="flex items-start justify-between gap-2">
                                                            <div className="w-16 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center p-1.5 overflow-hidden shrink-0">
                                                                {p.logo ? (
                                                                    <img
                                                                        src={p.logo}
                                                                        alt="Logo"
                                                                        className="w-full h-full object-contain"
                                                                        onError={(e) => {
                                                                            e.currentTarget.onerror = null;
                                                                            showPlaceholder(e.currentTarget);
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <Building2 className="w-6 h-6 text-slate-300 stroke-[1.5]" />
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleMovePartnerItem(sec.id, pIdx, "up")}
                                                                    disabled={pIdx === 0}
                                                                    className="h-6 w-6 rounded-md">
                                                                    <ArrowUp className="w-3 h-3" />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleMovePartnerItem(sec.id, pIdx, "down")}
                                                                    disabled={pIdx === sec.partners.length - 1}
                                                                    className="h-6 w-6 rounded-md">
                                                                    <ArrowDown className="w-3 h-3" />
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => handleRemovePartnerItem(sec.id, p.id)}
                                                                    className="h-6 w-6 rounded-md text-red-500 hover:bg-red-50">
                                                                    <Trash2 className="w-3 h-3" />
                                                                </Button>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label className="text-[11px] font-semibold text-slate-500">
                                                                Kind of Partner (e.g. Knowledge Partner)
                                                            </Label>
                                                            <Input
                                                                placeholder="e.g. Knowledge Partner"
                                                                value={p.category || ""}
                                                                onChange={(e) =>
                                                                    handleUpdatePartnerItem(sec.id, p.id, "category", e.target.value)
                                                                }
                                                                className="bg-white rounded-lg text-xs h-8"
                                                            />
                                                        </div>

                                                        <div className="space-y-1.5">
                                                            <Label className="text-[11px] font-semibold text-slate-500">
                                                                Website URL (e.g. https://company.com)
                                                            </Label>
                                                            <Input
                                                                type="url"
                                                                placeholder="https://company.com"
                                                                value={p.websiteUrl || ""}
                                                                onChange={(e) =>
                                                                    handleUpdatePartnerItem(sec.id, p.id, "websiteUrl", e.target.value)
                                                                }
                                                                className="bg-white rounded-lg text-xs h-8"
                                                            />
                                                        </div>

                                                        <div className="flex items-center gap-2 pt-1">
                                                            <label className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 text-xs font-semibold shrink-0">
                                                                <Upload className="w-3 h-3" />
                                                                <span>SVG / Logo</span>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*,.svg"
                                                                    onChange={(e) => handlePartnerLogoUpload(sec.id, p.id, e)}
                                                                    className="hidden"
                                                                />
                                                            </label>
                                                            <Input
                                                                placeholder="Or Logo URL..."
                                                                value={p.logo || ""}
                                                                onChange={(e) =>
                                                                    handleUpdatePartnerItem(sec.id, p.id, "logo", e.target.value)
                                                                }
                                                                className="bg-white rounded-lg text-xs h-8 grow"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ================= TAB 4: AGENDA & TIMELINE ================= */}
                {activeTab === "agenda" && (
                    <div className="space-y-6">
                        <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h3 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-amber-600" />
                                        <span>Sequential Agenda Engine</span>
                                    </h3>
                                    <p className="text-xs text-amber-800/80">
                                        Start time is taken from Event Start Time (<strong>{formStartTime || "09:30"}</strong>). Enter only the session length in minutes — exact start and end times are auto-calculated sequentially! You can also break any session into sub-sections.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 shrink-0">
                                    <Button
                                        type="button"
                                        onClick={() => addAgendaEntry("break")}
                                        className="rounded-xl bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5">
                                        <Coffee className="w-3.5 h-3.5" />
                                        <span>Add a Break</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => addAgendaEntry("special")}
                                        className="rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 text-xs font-semibold shadow-xs flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                                        <span>Add Special / Inaugural</span>
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => addAgendaEntry("session")}
                                        className="rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5">
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Add Agenda Session</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 text-xs font-semibold text-amber-900 pt-1 border-t border-amber-200/60">
                                <span>Event Starts: {formStartTime || "09:30"}</span>
                                <span>•</span>
                                <span>Total Blocks: {formAgenda.length}</span>
                                <span>•</span>
                                <span>Total Scheduled Duration: {formatSessionDuration(totalAgendaMinutes)}</span>
                            </div>
                        </div>

                        {formAgenda.length === 0 ? (
                            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 space-y-3">
                                <Clock className="w-10 h-10 text-slate-400 mx-auto" />
                                <div className="text-sm font-semibold text-slate-700">No agenda sessions scheduled yet</div>
                                <p className="text-xs text-slate-500 max-w-md mx-auto">
                                    Start with an Inaugural / Special block or regular Agenda Sessions. Each session can contain detailed sub-sections, speakers, and individual timings.
                                </p>
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    <Button
                                        type="button"
                                        onClick={() => addAgendaEntry("special")}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl text-xs font-semibold text-amber-800 border-amber-300 bg-amber-50 hover:bg-amber-100">
                                        <Sparkles className="w-3.5 h-3.5 mr-1" />
                                        Add Inaugural / Special
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => addAgendaEntry("session")}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl text-xs font-semibold text-amber-600 border-amber-200 hover:bg-amber-50">
                                        <Plus className="w-3.5 h-3.5 mr-1" />
                                        Add First Session
                                    </Button>
                                    <Button
                                        type="button"
                                        onClick={() => addAgendaEntry("break")}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-xl text-xs font-semibold text-slate-700 border-slate-300 hover:bg-slate-100">
                                        <Coffee className="w-3.5 h-3.5 mr-1" />
                                        Add a Break
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {liveSchedule.map((item, idx) => {
                                    const isExpanded = expandedItems[item.id] ?? false;
                                    const isBreak = Boolean(item.isBreak);
                                    const isSpecial = !isBreak && item.sectionType === "special";
                                    const subItems = item.subItems || [];
                                    const subMinutesSum = subItems.reduce(
                                        (sum, sub) => sum + (Number(sub.durationMinutes) > 0 ? Number(sub.durationMinutes) : 0),
                                        0,
                                    );
                                    return (
                                        <div
                                            key={item.id}
                                            className={`rounded-xl border overflow-hidden shadow-xs ${
                                                isBreak
                                                    ? "bg-slate-50/90 border-slate-300"
                                                    : isSpecial
                                                        ? "bg-amber-50/20 border-amber-200"
                                                        : "bg-white border-slate-200"
                                            }`}>
                                            {/* Compact Header Bar */}
                                            <div
                                                onClick={() => toggleExpanded(item.id)}
                                                className="p-3 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-50/70 select-none">
                                                <div className="flex items-center gap-3 grow min-w-0">
                                                    <div className={`flex flex-col items-center justify-center px-2.5 py-1 rounded-lg shrink-0 min-w-[78px] ${
                                                        isBreak
                                                            ? "bg-slate-200 border border-slate-300 text-slate-800"
                                                            : isSpecial
                                                                ? "bg-amber-100 border border-amber-300 text-amber-950"
                                                                : "bg-amber-50 border border-amber-200/80 text-amber-900"
                                                    }`}>
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                                                            isBreak ? "text-slate-600" : "text-amber-700"
                                                        }`}>
                                                            {isBreak && <Coffee className="w-2.5 h-2.5" />}
                                                            {isSpecial && <Sparkles className="w-2.5 h-2.5" />}
                                                            <span>{item.badgeLabel}</span>
                                                        </span>
                                                        <span className="text-xs font-mono font-bold">
                                                            {item.startTimeStr}
                                                        </span>
                                                    </div>

                                                    <div className="min-w-0 grow">
                                                        <div className="text-xs font-bold text-slate-900 truncate flex flex-wrap items-center gap-2">
                                                            <span>{item.title || <span className="text-slate-400 italic">Untitled {isBreak ? "Break" : "Session"}</span>}</span>
                                                            {isBreak && (
                                                                <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                                                                    Grey BG
                                                                </span>
                                                            )}
                                                            {subItems.length > 0 && (
                                                                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200/70 px-1.5 py-0.2 rounded-md font-semibold flex items-center gap-1">
                                                                    <ListOrdered className="w-2.5 h-2.5" />
                                                                    {subItems.length} sub-section{subItems.length > 1 ? "s" : ""}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="text-[11px] text-slate-500 flex items-center gap-2">
                                                            <span className={`font-semibold ${isBreak ? "text-slate-600" : "text-amber-700"}`}>
                                                                {item.timeRangeStr} ({item.durationLabel})
                                                            </span>
                                                            {item.speaker && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span className="truncate">{item.speaker}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleMoveAgendaItem(idx, "up")}
                                                        disabled={idx === 0}
                                                        className="h-7 w-7 rounded-lg">
                                                        <ArrowUp className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleMoveAgendaItem(idx, "down")}
                                                        disabled={idx === liveSchedule.length - 1}
                                                        className="h-7 w-7 rounded-lg">
                                                        <ArrowDown className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleRemoveAgendaItem(item.id)}
                                                        className="h-7 w-7 rounded-lg text-red-500 hover:bg-red-50">
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                    <div className="pl-1 text-slate-400">
                                                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Expanded Edit Form */}
                                            {isExpanded && (
                                                <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3">
                                                    {/* 3-Way Type Toggle: Session vs Special vs Break */}
                                                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="text-[11px] font-semibold text-slate-500">Item Type:</span>
                                                            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100 text-xs">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setAgendaSectionType(item.id, "session")}
                                                                    className={`px-2.5 py-1 rounded-md font-semibold text-xs transition-all ${
                                                                        item.sectionType === "session"
                                                                            ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                                                                            : "text-slate-600 hover:text-slate-900"
                                                                    }`}>
                                                                    Agenda Session
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setAgendaSectionType(item.id, "special")}
                                                                    className={`px-2.5 py-1 rounded-md font-semibold text-xs flex items-center gap-1 transition-all ${
                                                                        item.sectionType === "special"
                                                                            ? "bg-amber-600 text-white shadow-xs"
                                                                            : "text-slate-600 hover:text-slate-900"
                                                                    }`}>
                                                                    <Sparkles className="w-3 h-3" />
                                                                    Special (e.g. Inaugural)
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setAgendaSectionType(item.id, "break")}
                                                                    className={`px-2.5 py-1 rounded-md font-semibold text-xs flex items-center gap-1 transition-all ${
                                                                        item.sectionType === "break"
                                                                            ? "bg-slate-700 text-white shadow-xs"
                                                                            : "text-slate-600 hover:text-slate-900"
                                                                    }`}>
                                                                    <Coffee className="w-3 h-3" />
                                                                    Break (Grey BG)
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <span className="text-[11px] text-slate-500 font-medium">
                                                            {isBreak
                                                                ? "Renders with a neutral grey background"
                                                                : isSpecial
                                                                    ? "Uses custom badge without incrementing Session #"
                                                                    : "Auto-numbered sequentially"}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                                        <div className="sm:col-span-3 space-y-1">
                                                            <Label className={`text-[11px] font-bold ${isBreak ? "text-slate-700" : "text-amber-800"}`}>
                                                                {isBreak ? "Break Duration (Mins) *" : "Session Length (Mins) *"}
                                                            </Label>
                                                            <Input
                                                                type="number"
                                                                min="5"
                                                                max="480"
                                                                step="5"
                                                                value={item.durationMinutes}
                                                                onChange={(e) =>
                                                                    handleUpdateAgendaItem(
                                                                        item.id,
                                                                        "durationMinutes",
                                                                        parseInt(e.target.value, 10) || 15,
                                                                    )
                                                                }
                                                                className={`bg-white rounded-xl text-xs h-9 font-bold ${
                                                                    isBreak ? "text-slate-800" : "text-amber-900"
                                                                }`}
                                                            />
                                                            <span className="text-[10px] text-slate-400">
                                                                Calculated: {item.timeRangeStr}
                                                            </span>
                                                        </div>

                                                        {isSpecial && (
                                                            <div className="sm:col-span-3 space-y-1">
                                                                <Label className="text-[11px] font-bold text-amber-800">
                                                                    Left Badge Label
                                                                </Label>
                                                                <Input
                                                                    placeholder="e.g. Inaugural / Keynote"
                                                                    value={item.sectionLabel || ""}
                                                                    onChange={(e) =>
                                                                        handleUpdateAgendaItem(item.id, "sectionLabel", e.target.value)
                                                                    }
                                                                    className="bg-white rounded-xl text-xs h-9 font-semibold"
                                                                />
                                                            </div>
                                                        )}

                                                        <div className={`${isSpecial ? "sm:col-span-6" : "sm:col-span-9"} space-y-1`}>
                                                            <Label className="text-[11px] font-semibold text-slate-700">
                                                                {isBreak ? "Break Title *" : "Session Title *"}
                                                            </Label>
                                                            <Input
                                                                placeholder={isBreak ? "e.g. Lunch & Networking Break / High Tea" : "e.g. Inaugural Session / CSR & Future Workforce"}
                                                                value={item.title}
                                                                onChange={(e) =>
                                                                    handleUpdateAgendaItem(item.id, "title", e.target.value)
                                                                }
                                                                className="bg-white rounded-xl text-xs h-9 font-semibold"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <Label className="text-[11px] font-semibold text-slate-700">
                                                                Speaker / Facilitator / Host (Optional)
                                                            </Label>
                                                            <Input
                                                                placeholder="e.g. Dr. Milind Kamble & Guest Dignitaries"
                                                                value={item.speaker || ""}
                                                                onChange={(e) =>
                                                                    handleUpdateAgendaItem(item.id, "speaker", e.target.value)
                                                                }
                                                                className="bg-white rounded-xl text-xs h-8"
                                                            />
                                                        </div>

                                                        <div className="space-y-1">
                                                            <Label className="text-[11px] font-semibold text-slate-700">
                                                                Session Overview / Note (Optional)
                                                            </Label>
                                                            <Input
                                                                placeholder="Brief one-line overview (optional if using sub-sections)"
                                                                value={item.description || ""}
                                                                onChange={(e) =>
                                                                    handleUpdateAgendaItem(item.id, "description", e.target.value)
                                                                }
                                                                className="bg-white rounded-xl text-xs h-8"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Sub-Sections Builder */}
                                                    {!isBreak && (
                                                        <div className="p-3 rounded-xl bg-white border border-blue-200/80 space-y-2.5">
                                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                                                                        <ListOrdered className="w-3.5 h-3.5 text-blue-600" />
                                                                        <span>Sub-sections / Segment Breakdown ({subItems.length})</span>
                                                                    </span>
                                                                    {subMinutesSum > 0 && (
                                                                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                                            Sub-items sum: {subMinutesSum} mins
                                                                        </span>
                                                                    )}
                                                                    {subMinutesSum > 0 && subMinutesSum !== item.durationMinutes && (
                                                                        <button
                                                                            type="button"
                                                                            onClick={() =>
                                                                                handleUpdateAgendaItem(item.id, "durationMinutes", subMinutesSum)
                                                                            }
                                                                            className="text-[10px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-full transition-colors">
                                                                            Sync session length ({subMinutesSum}m)
                                                                        </button>
                                                                    )}
                                                                </div>

                                                                <div className="flex flex-wrap items-center gap-2">
                                                                    {subItems.length > 0 && (
                                                                        <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-[11px]">
                                                                            {(
                                                                                [
                                                                                    { id: "bullet", label: "• Bullets" },
                                                                                    { id: "numeric", label: "1, 2, 3" },
                                                                                    { id: "roman", label: "I, II, III" },
                                                                                ] as { id: AgendaSubItemStyle; label: string }[]
                                                                            ).map((opt) => (
                                                                                <button
                                                                                    key={opt.id}
                                                                                    type="button"
                                                                                    onClick={() =>
                                                                                        handleUpdateAgendaItem(item.id, "subItemsStyle", opt.id)
                                                                                    }
                                                                                    className={`px-2 py-0.5 rounded font-semibold transition-all ${
                                                                                        (item.subItemsStyle || "bullet") === opt.id
                                                                                            ? "bg-white text-blue-900 shadow-xs border border-slate-200"
                                                                                            : "text-slate-500 hover:text-slate-800"
                                                                                    }`}>
                                                                                    {opt.label}
                                                                                </button>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                    <Button
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleAddSubItem(item.id)}
                                                                        className="rounded-lg text-[11px] font-bold h-7 px-2.5 text-blue-700 border-blue-200 bg-blue-50/70 hover:bg-blue-100">
                                                                        <Plus className="w-3 h-3 mr-1" />
                                                                        Add Sub-section
                                                                    </Button>
                                                                </div>
                                                            </div>

                                                            {subItems.length === 0 ? (
                                                                <p className="text-[11px] text-slate-400">
                                                                    Optional: add individual keynote talks, case studies, or Q&A sub-segments inside this session card.
                                                                </p>
                                                            ) : (
                                                                <div className="space-y-1.5">
                                                                    {subItems.map((sub, sIdx) => (
                                                                        <div
                                                                            key={sub.id}
                                                                            className="grid grid-cols-1 md:grid-cols-12 gap-1.5 items-center bg-slate-50/80 px-2.5 py-1.5 rounded-xl border border-slate-200/80">
                                                                            <div className="md:col-span-5 flex items-center gap-1.5">
                                                                                <span className="text-[11px] font-bold text-blue-700 min-w-[20px] text-center shrink-0">
                                                                                    {formatSubItemMarker(sIdx, item.subItemsStyle)}
                                                                                </span>
                                                                                <Input
                                                                                    placeholder="Topic / Segment title *"
                                                                                    value={sub.title}
                                                                                    onChange={(e) =>
                                                                                        handleUpdateSubItem(item.id, sub.id, "title", e.target.value)
                                                                                    }
                                                                                    className="bg-white rounded-lg text-xs h-7 px-2 font-medium"
                                                                                />
                                                                            </div>
                                                                            <div className="md:col-span-4">
                                                                                <Input
                                                                                    placeholder="Speaker / Guest (optional)"
                                                                                    value={sub.speaker || ""}
                                                                                    onChange={(e) =>
                                                                                        handleUpdateSubItem(item.id, sub.id, "speaker", e.target.value)
                                                                                    }
                                                                                    className="bg-white rounded-lg text-xs h-7 px-2"
                                                                                />
                                                                            </div>
                                                                            <div className="md:col-span-2 flex items-center gap-1">
                                                                                <Input
                                                                                    type="number"
                                                                                    min="0"
                                                                                    max="240"
                                                                                    placeholder="Mins"
                                                                                    value={sub.durationMinutes ?? ""}
                                                                                    onChange={(e) => {
                                                                                        const raw = e.target.value;
                                                                                        handleUpdateSubItem(
                                                                                            item.id,
                                                                                            sub.id,
                                                                                            "durationMinutes",
                                                                                            raw === "" ? undefined : parseInt(raw, 10) || undefined,
                                                                                        );
                                                                                    }}
                                                                                    className="bg-white rounded-lg text-xs h-7 px-2 text-center font-semibold"
                                                                                />
                                                                                <span className="text-[10px] text-slate-400 shrink-0">min</span>
                                                                            </div>
                                                                            <div className="md:col-span-1 flex items-center justify-end gap-0.5">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleMoveSubItem(item.id, sIdx, "up")}
                                                                                    disabled={sIdx === 0}
                                                                                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                                                                                    title="Move Up">
                                                                                    <ArrowUp className="w-3 h-3" />
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleMoveSubItem(item.id, sIdx, "down")}
                                                                                    disabled={sIdx === subItems.length - 1}
                                                                                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                                                                                    title="Move Down">
                                                                                    <ArrowDown className="w-3 h-3" />
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => handleRemoveSubItem(item.id, sub.id)}
                                                                                    className="p-1 text-red-400 hover:text-red-600"
                                                                                    title="Delete Sub-section">
                                                                                    <Trash2 className="w-3 h-3" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* ================= TAB 5: REGISTRATION & CTA ================= */}
                {activeTab === "registration" && (
                    <div className="space-y-6">
                        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-1">
                            <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-1.5">
                                <Ticket className="w-4 h-4 text-emerald-600" />
                                <span>Event Registration & Button Styling</span>
                            </h3>
                            <p className="text-xs text-emerald-800/80">
                                Embed external registration forms/widgets (Konfhub, Townscript, Google Forms) or direct URLs.
                            </p>
                        </div>

                        <div className="space-y-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="ev-snippet" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                        <Code className="w-3.5 h-3.5 text-blue-600" />
                                        <span>Custom Registration Button HTML / Snippet</span>
                                    </Label>
                                    <span className="text-[11px] text-slate-500">
                                        Accepts &lt;a&gt;, &lt;button&gt;, or embed scripts
                                    </span>
                                </div>

                                <Textarea
                                    id="ev-snippet"
                                    placeholder={'Paste your button snippet or embed code here, e.g.:\n<div><script src="https://..." ...></script></div>\nor\n<a href="https://..." ...>Register Now</a>'}
                                    value={formSnippet}
                                    onChange={(e) => setFormSnippet(e.target.value)}
                                    rows={3}
                                    className="bg-white rounded-xl text-xs font-mono"
                                />

                                {/* Direct URL */}
                                <div className="pt-2">
                                    <Label htmlFor="ev-reg-url" className="text-[11px] font-semibold text-slate-500">
                                        Direct Fallback URL (used if snippet script fails or is blocked)
                                    </Label>
                                    <Input
                                        id="ev-reg-url"
                                        name="registrationUrl"
                                        type="url"
                                        placeholder="https://events.theresonance.co.in/register"
                                        value={formRegistrationUrl}
                                        onChange={(e) => setFormRegistrationUrl(e.target.value)}
                                        className="bg-white rounded-xl text-xs mt-1"
                                    />
                                </div>
                            </div>

                            {/* Button Styles */}
                            <div className="space-y-2 pt-2 border-t border-slate-200/80">
                                <Label className="text-xs font-bold text-slate-700">
                                    Widget Appearance Style
                                </Label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {(
                                        [
                                            { id: "gradient", label: "Sunset Gradient", desc: "Orange-Red Gradient" },
                                            { id: "navy", label: "Navy Blue", desc: "Corporate Deep Blue" },
                                            { id: "glow", label: "Electric Glow", desc: "Vibrant Fuchsia & Orange" },
                                            { id: "classic", label: "Classic Unstyled", desc: "Original Raw Style" },
                                        ] as const
                                    ).map((st) => (
                                        <button
                                            key={st.id}
                                            type="button"
                                            onClick={() => setFormButtonStyle(st.id)}
                                            className={`p-3 rounded-xl text-xs font-bold border transition-all text-left ${
                                                formButtonStyle === st.id
                                                    ? "border-blue-600 bg-blue-50/80 text-blue-900 shadow-xs ring-1 ring-blue-600"
                                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                            }`}>
                                            <div className="font-bold text-slate-900">{st.label}</div>
                                            <div className="text-[10px] text-slate-500">{st.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Live Widget Preview */}
                            <div className="p-4 bg-white rounded-xl border border-slate-200/80 space-y-2">
                                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                    Live Button Preview
                                </div>
                                <div className="flex items-center gap-3 pt-1">
                                    <EventRegistrationWidget
                                        snippet={formSnippet}
                                        fallbackUrl={formRegistrationUrl}
                                        eventTitle={formTitle}
                                        buttonStyle={formButtonStyle}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/admin/events")}
                        className="rounded-xl text-xs text-slate-600">
                        Cancel & Return
                    </Button>

                    <div className="flex items-center gap-2">
                        {activeTab !== "info" && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const tabs: EventEditorTab[] = ["info", "people", "partners", "agenda", "registration"];
                                    const idx = tabs.indexOf(activeTab);
                                    if (idx > 0) setActiveTab(tabs[idx - 1]);
                                }}
                                className="rounded-xl text-xs">
                                ← Previous Section
                            </Button>
                        )}
                        {activeTab !== "registration" && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const tabs: EventEditorTab[] = ["info", "people", "partners", "agenda", "registration"];
                                    const idx = tabs.indexOf(activeTab);
                                    if (idx < tabs.length - 1) setActiveTab(tabs[idx + 1]);
                                }}
                                className="rounded-xl text-xs text-blue-700 border-blue-200 hover:bg-blue-50">
                                Next Section →
                            </Button>
                        )}
                        <Button
                            type="submit"
                            className="rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-6 shadow-xs">
                            {isEditing ? "Save Event Changes" : "Publish Event"}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EventEditor;
