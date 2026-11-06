import React, { useState } from "react";
import {
    getStoredAdvisors,
    saveStoredAdvisors,
    Advisor,
    processImageFile,
} from "@/lib/siteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Plus,
    Pencil,
    Trash2,
    ArrowUp,
    ArrowDown,
    Upload,
    Search,
    Award,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const ADVISOR_PRESET_PHOTOS = [
    { label: "Advisor 1", path: "/images/advisers/1.svg" },
    { label: "Advisor 2", path: "/images/advisers/2.svg" },
    { label: "Advisor 3", path: "/images/advisers/3.svg" },
    { label: "Advisor 4", path: "/images/advisers/4.svg" },
    { label: "Advisor 5", path: "/images/advisers/5.svg" },
    { label: "Advisor 6", path: "/images/advisers/6.svg" },
    { label: "Advisor 7", path: "/images/advisers/7.svg" },
    { label: "Advisor 8", path: "/images/advisers/8.svg" },
];

const ManageAdvisory: React.FC = () => {
    const [advisors, setAdvisors] = useState<Advisor[]>(getStoredAdvisors);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAdvisor, setEditingAdvisor] = useState<Advisor | null>(null);

    // Form states
    const [formName, setFormName] = useState("");
    const [formDesc, setFormDesc] = useState("");
    const [formImg, setFormImg] = useState<string>("/images/advisers/1.svg");
    const [isUploading, setIsUploading] = useState(false);

    const filteredAdvisors = advisors.filter(
        (a) =>
            a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.desc.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const openAddDialog = () => {
        setEditingAdvisor(null);
        setFormName("");
        setFormDesc("");
        setFormImg("/images/advisers/1.svg");
        setIsDialogOpen(true);
    };

    const openEditDialog = (advisor: Advisor) => {
        setEditingAdvisor(advisor);
        setFormName(advisor.name);
        setFormDesc(advisor.desc);
        setFormImg(advisor.img);
        setIsDialogOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file (PNG, JPG, SVG, WEBP)");
            return;
        }

        try {
            setIsUploading(true);
            const base64 = await processImageFile(file, 600, 0.85);
            setFormImg(base64);
            toast.success("Photo uploaded successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to process image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formName.trim() || !formDesc.trim()) {
            toast.error("Please provide both Name and Description");
            return;
        }

        let updated: Advisor[];

        if (editingAdvisor) {
            updated = advisors.map((a) =>
                a.id === editingAdvisor.id
                    ? {
                          ...a,
                          name: formName.trim().toUpperCase(),
                          desc: formDesc.trim(),
                          img: formImg || "/images/advisers/1.svg",
                      }
                    : a,
            );
            toast.success(`Updated advisor "${formName.trim()}"`);
        } else {
            const newAdvisor: Advisor = {
                id: `adv-${Date.now()}`,
                name: formName.trim().toUpperCase(),
                desc: formDesc.trim(),
                img: formImg || "/images/advisers/1.svg",
            };
            updated = [newAdvisor, ...advisors];
            toast.success(`Added advisor "${formName.trim()}"`);
        }

        setAdvisors(updated);
        saveStoredAdvisors(updated);
        setIsDialogOpen(false);
    };

    const handleDelete = (advisor: Advisor) => {
        if (window.confirm(`Are you sure you want to remove advisor "${advisor.name}"?`)) {
            const updated = advisors.filter((a) => a.id !== advisor.id);
            setAdvisors(updated);
            saveStoredAdvisors(updated);
            toast.success(`Removed advisor "${advisor.name}"`);
        }
    };

    const handleMove = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= advisors.length) return;

        const updated = [...advisors];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        setAdvisors(updated);
        saveStoredAdvisors(updated);
        toast.info("Advisory order updated");
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-900 tracking-tight flex items-center gap-3">
                        <Award className="w-8 h-8 text-orange-500" />
                        Manage Advisory Board
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Add, edit, reorder, and remove members of the Advisory Board shown on the website.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={openAddDialog}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md rounded-xl flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Advisor
                    </Button>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        id="search-advisors"
                        name="advisorySearch"
                        type="search"
                        placeholder="Search advisors by name or bio..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-gray-50 border-gray-200 rounded-lg text-sm"
                        autoComplete="off"
                    />
                </div>
                <div className="text-xs text-gray-500 font-medium">
                    Showing <span className="font-semibold text-blue-900">{filteredAdvisors.length}</span> of {advisors.length} advisors
                </div>
            </div>

            {/* Advisory Grid */}
            {filteredAdvisors.length === 0 ? (
                <Card className="border-dashed border-2 p-12 text-center bg-white rounded-2xl">
                    <Award className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No advisors found</p>
                    <p className="text-gray-400 text-sm mt-1">Try a different search or add a new advisor.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredAdvisors.map((advisor) => {
                        const originalIndex = advisors.findIndex((a) => a.id === advisor.id);
                        return (
                            <div
                                key={advisor.id}
                                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col group relative">
                                {/* Order badge */}
                                <div className="absolute top-3 right-3 flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-orange-100">
                                    #{originalIndex + 1}
                                </div>

                                {/* Avatar */}
                                <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 flex items-center justify-center shrink-0 shadow-inner">
                                    <img
                                        src={advisor.img}
                                        alt={advisor.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src = "/images/advisers/1.svg";
                                        }}
                                    />
                                </div>

                                {/* Name & Bio */}
                                <div className="text-center flex-1">
                                    <h3 className="font-bold text-blue-900 text-base leading-snug tracking-wide">
                                        {advisor.name}
                                    </h3>
                                    <p className="text-xs text-gray-600 mt-2 text-justify line-clamp-4 leading-relaxed">
                                        {advisor.desc}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            disabled={originalIndex === 0}
                                            onClick={() => handleMove(originalIndex, "up")}
                                            className="h-7 w-7 text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                                            title="Move Up">
                                            <ArrowUp className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            disabled={originalIndex === advisors.length - 1}
                                            onClick={() => handleMove(originalIndex, "down")}
                                            className="h-7 w-7 text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                                            title="Move Down">
                                            <ArrowDown className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditDialog(advisor)}
                                            className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50 flex items-center gap-1 font-medium">
                                            <Pencil className="w-3.5 h-3.5" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(advisor)}
                                            className="h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                            title="Delete Advisor">
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Add / Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-lg bg-white rounded-2xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-blue-900">
                            {editingAdvisor ? "Edit Advisor" : "Add New Advisor"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-4 mt-2">
                        {/* Photo Preview & Upload */}
                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-2 border-orange-400 flex items-center justify-center mb-3 shadow-md relative">
                                <img
                                    src={formImg}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold">
                                        Uploading...
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg transition-colors">
                                    <Upload className="w-3.5 h-3.5" />
                                    Upload Photo
                                    <input
                                        id="advisor-photo-upload"
                                        name="advisorPhoto"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Preset Avatars */}
                            <div className="w-full mt-3 pt-3 border-t border-gray-200">
                                <span className="text-[11px] font-semibold text-gray-500 block mb-1.5 text-center">
                                    Or pick an advisor illustration:
                                </span>
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                    {ADVISOR_PRESET_PHOTOS.map((preset) => (
                                        <button
                                            type="button"
                                            key={preset.path}
                                            onClick={() => setFormImg(preset.path)}
                                            className={`w-8 h-8 rounded-full border-2 p-0.5 overflow-hidden transition-all ${
                                                formImg === preset.path
                                                    ? "border-orange-500 scale-110 shadow-sm"
                                                    : "border-gray-200 hover:border-orange-300"
                                            }`}>
                                            <img
                                                src={preset.path}
                                                alt={preset.label}
                                                className="w-full h-full rounded-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <Label htmlFor="advisorName" className="text-xs font-semibold text-gray-700">
                                Full Name (e.g. DR. MILIND KAMBLE) *
                            </Label>
                            <Input
                                id="advisorName"
                                name="name"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="e.g. DR. MILIND KAMBLE"
                                required
                                autoComplete="name"
                                className="mt-1"
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="advisorDesc" className="text-xs font-semibold text-gray-700">
                                Description / Bio *
                            </Label>
                            <Textarea
                                id="advisorDesc"
                                name="description"
                                value={formDesc}
                                onChange={(e) => setFormDesc(e.target.value)}
                                placeholder="Brief background, achievements, and advisory expertise..."
                                rows={4}
                                required
                                className="mt-1 resize-none"
                            />
                        </div>

                        <DialogFooter className="mt-6 flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-orange-600 hover:bg-orange-700 text-white">
                                {editingAdvisor ? "Save Changes" : "Add Advisor"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageAdvisory;
