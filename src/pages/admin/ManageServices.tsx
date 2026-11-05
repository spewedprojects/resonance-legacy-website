import React, { useState } from "react";
import {
    getStoredServices,
    saveStoredServices,
    DEFAULT_SERVICES,
    Service,
} from "@/lib/siteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Users,
    Code,
    GraduationCap,
    Rocket,
    HandHeart,
    FileText,
    Briefcase,
    Sparkles,
    Building,
    Target,
    Award,
    TrendingUp,
    Pencil,
    Plus,
    Trash2,
    ArrowUp,
    ArrowDown,
    RotateCcw,
    Layers,
    CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

export const SERVICE_ICONS: Record<string, React.ElementType> = {
    Users,
    Code,
    GraduationCap,
    Rocket,
    HandHeart,
    FileText,
    Briefcase,
    Sparkles,
    Building,
    Target,
    Award,
    TrendingUp,
};

export const SERVICE_GRADIENTS = [
    { label: "Blue", value: "from-blue-500 to-blue-600" },
    { label: "Orange", value: "from-orange-500 to-orange-600" },
    { label: "Green", value: "from-green-500 to-green-600" },
    { label: "Purple", value: "from-purple-500 to-purple-600" },
    { label: "Red", value: "from-red-500 to-red-600" },
    { label: "Indigo", value: "from-indigo-500 to-indigo-600" },
    { label: "Teal", value: "from-teal-500 to-teal-600" },
    { label: "Pink", value: "from-pink-500 to-pink-600" },
];

const ManageServices: React.FC = () => {
    const [services, setServices] = useState<Service[]>(getStoredServices);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    // Form fields
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formIcon, setFormIcon] = useState("Users");
    const [formColor, setFormColor] = useState("from-blue-500 to-blue-600");

    const openAddDialog = () => {
        setEditingService(null);
        setFormTitle("");
        setFormDescription("");
        setFormIcon("Briefcase");
        setFormColor("from-blue-500 to-blue-600");
        setIsDialogOpen(true);
    };

    const openEditDialog = (service: Service) => {
        setEditingService(service);
        setFormTitle(service.title);
        setFormDescription(service.description);
        setFormIcon(service.icon || "Briefcase");
        setFormColor(service.color || "from-blue-500 to-blue-600");
        setIsDialogOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formTitle.trim() || !formDescription.trim()) {
            toast.error("Please provide both Service Title and Description");
            return;
        }

        let updated: Service[];

        if (editingService) {
            updated = services.map((s) =>
                s.id === editingService.id
                    ? {
                          ...s,
                          title: formTitle.trim(),
                          description: formDescription.trim(),
                          icon: formIcon,
                          color: formColor,
                      }
                    : s,
            );
            toast.success(`Updated "${formTitle.trim()}"`);
        } else {
            const newService: Service = {
                id: `serv-${Date.now()}`,
                title: formTitle.trim(),
                description: formDescription.trim(),
                icon: formIcon,
                color: formColor,
            };
            updated = [...services, newService];
            toast.success(`Added "${formTitle.trim()}" to services`);
        }

        saveStoredServices(updated);
        setServices(updated);
        setIsDialogOpen(false);
    };

    const handleDelete = (id: string, title: string) => {
        if (services.length <= 1) {
            toast.error("You must keep at least one service item.");
            return;
        }
        if (confirm(`Are you sure you want to delete "${title}"?`)) {
            const updated = services.filter((s) => s.id !== id);
            saveStoredServices(updated);
            setServices(updated);
            toast.success(`Deleted "${title}"`);
        }
    };

    const handleMove = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= services.length) return;

        const updated = [...services];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        saveStoredServices(updated);
        setServices(updated);
    };

    const handleResetDefaults = () => {
        if (
            confirm(
                "Reset all services back to the original 6 default services? Any custom edits will be replaced.",
            )
        ) {
            saveStoredServices(DEFAULT_SERVICES);
            setServices(DEFAULT_SERVICES);
            toast.success("Reset all services to defaults");
        }
    };

    const SelectedIconComponent = SERVICE_ICONS[formIcon] || Briefcase;

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 md:p-8 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-700/60 text-blue-200 text-xs font-semibold rounded-full uppercase tracking-wider">
                            Content Management
                        </span>
                        <span className="px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-full">
                            {services.length} Total Services
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                        Key Services
                    </h1>
                    <p className="text-blue-200 text-sm mt-1 max-w-2xl">
                        Manage the service offerings displayed on the website. Configure their icons, color accents, and detailed descriptions shown in the "View all Services" modal dialog.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        onClick={handleResetDefaults}
                        variant="outline"
                        size="sm"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs font-semibold rounded-xl">
                        <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                        Reset to Defaults
                    </Button>
                    <Button
                        onClick={openAddDialog}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md text-xs sm:text-sm font-semibold rounded-xl">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Add New Service
                    </Button>
                </div>
            </div>

            {/* List of Services */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((service, index) => {
                    const IconComponent = SERVICE_ICONS[service.icon] || Briefcase;

                    return (
                        <Card
                            key={service.id}
                            className="bg-white rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between overflow-hidden">
                            <CardContent className="p-5 flex flex-col h-full">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div
                                        className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${service.color} rounded-xl text-white shadow-sm shrink-0`}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>
                                    <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-100">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={index === 0}
                                            onClick={() => handleMove(index, "up")}
                                            className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 disabled:opacity-30">
                                            <ArrowUp className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            disabled={index === services.length - 1}
                                            onClick={() => handleMove(index, "down")}
                                            className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 disabled:opacity-30">
                                            <ArrowDown className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>

                                <h3 className="text-base font-bold text-blue-950 mb-2 leading-snug">
                                    {service.title}
                                </h3>

                                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4 flex-1">
                                    {service.description}
                                </p>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
                                    <span className="text-[11px] font-semibold text-slate-400">
                                        #{index + 1} on Homepage
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            onClick={() => openEditDialog(service)}
                                            variant="outline"
                                            size="sm"
                                            className="h-8 px-2.5 text-xs text-blue-700 border-blue-200 hover:bg-blue-50 rounded-lg">
                                            <Pencil className="w-3.5 h-3.5 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(service.id, service.title)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-2 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Service Edit / Add Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-blue-950 flex items-center gap-2">
                            <Layers className="w-5 h-5 text-blue-600" />
                            {editingService ? "Edit Service" : "Add New Service"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-4 pt-2">
                        {/* Title */}
                        <div className="space-y-1.5">
                            <Label htmlFor="service-title" className="text-xs font-bold text-slate-700">
                                Service Title *
                            </Label>
                            <Input
                                id="service-title"
                                placeholder="e.g. Skilled Workforce Sourcing & Onboarding"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                className="rounded-xl"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-1.5">
                            <Label htmlFor="service-desc" className="text-xs font-bold text-slate-700">
                                Full Service Description * (Shown in Dialog View)
                            </Label>
                            <Textarea
                                id="service-desc"
                                placeholder="Describe what the service provides, who it helps, and key outcomes..."
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                                rows={4}
                                className="rounded-xl text-sm leading-relaxed"
                                required
                            />
                            <p className="text-[11px] text-gray-500">
                                Word count: {formDescription.trim().split(/\s+/).filter(Boolean).length} words
                            </p>
                        </div>

                        {/* Icon Selection */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">
                                Select Icon
                            </Label>
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                {Object.keys(SERVICE_ICONS).map((iconKey) => {
                                    const IconComp = SERVICE_ICONS[iconKey];
                                    const isSelected = formIcon === iconKey;
                                    return (
                                        <button
                                            key={iconKey}
                                            type="button"
                                            onClick={() => setFormIcon(iconKey)}
                                            className={`p-2 rounded-xl flex flex-col items-center gap-1 border transition-all text-xs ${
                                                isSelected
                                                    ? "border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-sm"
                                                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                            }`}>
                                            <IconComp className="w-5 h-5" />
                                            <span className="text-[10px] truncate max-w-full">
                                                {iconKey}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Color Theme */}
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold text-slate-700">
                                Color Accent
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {SERVICE_GRADIENTS.map((grad) => {
                                    const isSelected = formColor === grad.value;
                                    return (
                                        <button
                                            key={grad.value}
                                            type="button"
                                            onClick={() => setFormColor(grad.value)}
                                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                                                isSelected
                                                    ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500/20"
                                                    : "border-slate-200 text-slate-700 hover:bg-slate-50"
                                            }`}>
                                            <span
                                                className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${grad.value}`}
                                            />
                                            {grad.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Live Preview */}
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                Live Preview (Homepage Card)
                            </span>
                            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
                                <div
                                    className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${formColor} rounded-xl text-white shrink-0`}>
                                    <SelectedIconComponent className="w-6 h-6" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h4 className="font-bold text-sm text-blue-950 truncate">
                                        {formTitle || "Service Title Preview"}
                                    </h4>
                                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                        {formDescription || "Description preview will appear here..."}
                                    </p>
                                </div>
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
                                {editingService ? "Save Changes" : "Create Service"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageServices;
