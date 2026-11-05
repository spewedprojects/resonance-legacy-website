import React, { useState } from "react";
import {
    getStoredTeam,
    saveStoredTeam,
    TeamMember,
    processImageFile,
} from "@/lib/siteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
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
    Mail,
    Phone,
    Upload,
    Users,
    Search,
    Image as ImageIcon,
    Check,
} from "lucide-react";
import { toast } from "sonner";

const PRESET_PHOTOS = [
    { label: "Arundhati Katdare", path: "/team/Arundhati.JPG" },
    { label: "Imran Bagwan", path: "/team/Imran.JPG" },
    { label: "Kirti Katti", path: "/team/Kirti.JPG" },
    { label: "Vishakha Patil", path: "/team/Vishakha.JPG" },
    { label: "Akshay", path: "/team/Akshay.JPG" },
    { label: "Shyam Dhobale", path: "/team/Shyam Dhobale.jpeg" },
];

const ManageTeam: React.FC = () => {
    const [team, setTeam] = useState<TeamMember[]>(getStoredTeam);
    const [searchQuery, setSearchQuery] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

    // Form states
    const [formName, setFormName] = useState("");
    const [formPosition, setFormPosition] = useState("");
    const [formContact, setFormContact] = useState("");
    const [formEmail, setFormEmail] = useState("");
    const [formImg, setFormImg] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const filteredTeam = team.filter(
        (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (m.email && m.email.toLowerCase().includes(searchQuery.toLowerCase())),
    );

    const openAddDialog = () => {
        setEditingMember(null);
        setFormName("");
        setFormPosition("");
        setFormContact("");
        setFormEmail("");
        setFormImg(null);
        setIsDialogOpen(true);
    };

    const openEditDialog = (member: TeamMember) => {
        setEditingMember(member);
        setFormName(member.name);
        setFormPosition(member.position);
        setFormContact(member.contact || "");
        setFormEmail(member.email || "");
        setFormImg(member.img || null);
        setIsDialogOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file (PNG, JPG, WEBP)");
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

        if (!formName.trim() || !formPosition.trim()) {
            toast.error("Please fill in both Name and Position");
            return;
        }

        let updated: TeamMember[];

        if (editingMember) {
            updated = team.map((m) =>
                m.id === editingMember.id
                    ? {
                          ...m,
                          name: formName.trim(),
                          position: formPosition.trim(),
                          contact: formContact.trim() || null,
                          email: formEmail.trim() || null,
                          img: formImg,
                      }
                    : m,
            );
            toast.success(`Updated "${formName.trim()}"`);
        } else {
            const newMember: TeamMember = {
                id: `team-${Date.now()}`,
                name: formName.trim(),
                position: formPosition.trim(),
                contact: formContact.trim() || null,
                email: formEmail.trim() || null,
                img: formImg,
            };
            updated = [newMember, ...team];
            toast.success(`Added "${formName.trim()}" to Team`);
        }

        setTeam(updated);
        saveStoredTeam(updated);
        setIsDialogOpen(false);
    };

    const handleDelete = (member: TeamMember) => {
        if (window.confirm(`Are you sure you want to remove "${member.name}"?`)) {
            const updated = team.filter((m) => m.id !== member.id);
            setTeam(updated);
            saveStoredTeam(updated);
            toast.success(`Removed "${member.name}"`);
        }
    };

    const handleMove = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= team.length) return;

        const updated = [...team];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        setTeam(updated);
        saveStoredTeam(updated);
        toast.info("Team order updated");
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-900 tracking-tight flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-600" />
                        Manage Team Members
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Add, edit, reorder, or remove team members displayed on the Home and About pages.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={openAddDialog}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md rounded-xl flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Team Member
                    </Button>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search team members..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-gray-50 border-gray-200 rounded-lg text-sm"
                    />
                </div>
                <div className="text-xs text-gray-500 font-medium">
                    Showing <span className="font-semibold text-blue-900">{filteredTeam.length}</span> of {team.length} members
                </div>
            </div>

            {/* Team Grid */}
            {filteredTeam.length === 0 ? (
                <Card className="border-dashed border-2 p-12 text-center bg-white rounded-2xl">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No team members found</p>
                    <p className="text-gray-400 text-sm mt-1">Try a different search or add a new team member.</p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredTeam.map((member, idx) => {
                        const originalIndex = team.findIndex((m) => m.id === member.id);
                        return (
                            <div
                                key={member.id}
                                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-100 flex flex-col group relative">
                                {/* Order badge */}
                                <div className="absolute top-3 right-3 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full text-[10px] text-gray-500 font-medium">
                                    #{originalIndex + 1}
                                </div>

                                {/* Avatar */}
                                <div className="w-20 h-20 rounded-full mx-auto mb-3 overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 flex items-center justify-center shrink-0 shadow-inner">
                                    {member.img ? (
                                        <img
                                            src={member.img}
                                            alt={member.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.currentTarget as HTMLImageElement).src = "/media/resonanceLogoNav.png";
                                            }}
                                        />
                                    ) : (
                                        <Users className="w-8 h-8 text-blue-400" />
                                    )}
                                </div>

                                {/* Details */}
                                <div className="text-center flex-1">
                                    <h3 className="font-bold text-blue-950 text-base leading-snug">
                                        {member.name}
                                    </h3>
                                    <p className="text-xs text-blue-700 font-medium mt-1 min-h-[2rem] flex items-center justify-center">
                                        {member.position}
                                    </p>

                                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-left text-xs text-gray-600">
                                        {member.email ? (
                                            <div className="flex items-center gap-2 truncate" title={member.email}>
                                                <Mail className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                                                <span className="truncate">{member.email}</span>
                                            </div>
                                        ) : (
                                            <div className="text-gray-300 italic text-[11px]">No email listed</div>
                                        )}

                                        {member.contact ? (
                                            <div className="flex items-center gap-2">
                                                <Phone className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                <span>{member.contact}</span>
                                            </div>
                                        ) : (
                                            <div className="text-gray-300 italic text-[11px]">No phone listed</div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            disabled={originalIndex === 0}
                                            onClick={() => handleMove(originalIndex, "up")}
                                            className="h-7 w-7 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                            title="Move Up">
                                            <ArrowUp className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            disabled={originalIndex === team.length - 1}
                                            onClick={() => handleMove(originalIndex, "down")}
                                            className="h-7 w-7 text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                                            title="Move Down">
                                            <ArrowDown className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditDialog(member)}
                                            className="h-7 px-2 text-xs text-blue-600 hover:bg-blue-50 flex items-center gap-1 font-medium">
                                            <Pencil className="w-3.5 h-3.5" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(member)}
                                            className="h-7 w-7 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                            title="Delete Member">
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
                            {editingMember ? "Edit Team Member" : "Add New Team Member"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-4 mt-2">
                        {/* Photo Preview & Upload */}
                        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-white border-2 border-blue-400 flex items-center justify-center mb-3 shadow-md relative">
                                {formImg ? (
                                    <img
                                        src={formImg}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Users className="w-10 h-10 text-gray-300" />
                                )}
                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold">
                                        Uploading...
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-2">
                                <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                                    <Upload className="w-3.5 h-3.5" />
                                    Upload Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>

                                {formImg && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setFormImg(null)}
                                        className="text-xs h-7 text-red-600 border-red-200 hover:bg-red-50">
                                        Remove Photo
                                    </Button>
                                )}
                            </div>

                            {/* Presets Option */}
                            <div className="w-full mt-3 pt-3 border-t border-gray-200">
                                <span className="text-[11px] font-semibold text-gray-500 block mb-1.5 text-center">
                                    Or choose an existing site photo:
                                </span>
                                <div className="flex flex-wrap gap-1.5 justify-center">
                                    {PRESET_PHOTOS.map((preset) => (
                                        <button
                                            type="button"
                                            key={preset.path}
                                            onClick={() => setFormImg(preset.path)}
                                            className={`text-[11px] px-2 py-0.5 rounded-full border transition-all ${
                                                formImg === preset.path
                                                    ? "bg-blue-600 text-white border-blue-600"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-400"
                                            }`}>
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <Label htmlFor="memberName" className="text-xs font-semibold text-gray-700">
                                Full Name *
                            </Label>
                            <Input
                                id="memberName"
                                value={formName}
                                onChange={(e) => setFormName(e.target.value)}
                                placeholder="e.g. John Doe"
                                required
                                className="mt-1"
                            />
                        </div>

                        {/* Position */}
                        <div>
                            <Label htmlFor="memberPosition" className="text-xs font-semibold text-gray-700">
                                Position / Designation *
                            </Label>
                            <Input
                                id="memberPosition"
                                value={formPosition}
                                onChange={(e) => setFormPosition(e.target.value)}
                                placeholder="e.g. Manager - Operations"
                                required
                                className="mt-1"
                            />
                        </div>

                        {/* Contact info grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor="memberContact" className="text-xs font-semibold text-gray-700">
                                    Phone / Contact
                                </Label>
                                <Input
                                    id="memberContact"
                                    value={formContact}
                                    onChange={(e) => setFormContact(e.target.value)}
                                    placeholder="e.g. 9850012345"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="memberEmail" className="text-xs font-semibold text-gray-700">
                                    Email Address
                                </Label>
                                <Input
                                    id="memberEmail"
                                    type="email"
                                    value={formEmail}
                                    onChange={(e) => setFormEmail(e.target.value)}
                                    placeholder="e.g. name@theresonance.co.in"
                                    className="mt-1"
                                />
                            </div>
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
                                className="bg-blue-600 hover:bg-blue-700 text-white">
                                {editingMember ? "Save Changes" : "Add Member"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageTeam;
