import React, { useState } from "react";
import {
    getStoredPrograms,
    saveStoredPrograms,
    Program,
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
    BookOpen,
    Pencil,
    Plus,
    Trash2,
    GraduationCap,
    TrendingUp,
    Award,
    Building,
    Minus,
    ArrowUp,
    ArrowDown,
    CheckCircle2,
    Eye,
} from "lucide-react";
import { toast } from "sonner";

const ICON_MAP: Record<string, React.ElementType> = {
    GraduationCap,
    TrendingUp,
    Award,
    Building,
    BookOpen,
};

const GRADIENTS = [
    { label: "Blue", value: "from-blue-500 to-blue-600" },
    { label: "Orange", value: "from-orange-500 to-orange-600" },
    { label: "Green", value: "from-green-500 to-green-600" },
    { label: "Purple", value: "from-purple-500 to-purple-600" },
    { label: "Indigo", value: "from-indigo-500 to-indigo-600" },
];

const ManagePrograms: React.FC = () => {
    const [programs, setPrograms] = useState<Program[]>(getStoredPrograms);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);

    // Form states
    const [formTitle, setFormTitle] = useState("");
    const [formCode, setFormCode] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formIcon, setFormIcon] = useState("GraduationCap");
    const [formGradient, setFormGradient] = useState("from-blue-500 to-blue-600");

    // Interactive Preview State
    const [previewExpanded, setPreviewExpanded] = useState(false);

    const openAddDialog = () => {
        setEditingProgram(null);
        setFormTitle("");
        setFormCode("");
        setFormDescription("");
        setFormIcon("GraduationCap");
        setFormGradient("from-blue-500 to-blue-600");
        setIsDialogOpen(true);
    };

    const openEditDialog = (program: Program) => {
        setEditingProgram(program);
        setFormTitle(program.title);
        setFormCode(program.code);
        setFormDescription(program.description);
        setFormIcon(program.icon || "GraduationCap");
        setFormGradient(program.gradient || "from-blue-500 to-blue-600");
        setIsDialogOpen(true);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formTitle.trim() || !formDescription.trim()) {
            toast.error("Please provide both Program Title and Description");
            return;
        }

        let updated: Program[];

        if (editingProgram) {
            updated = programs.map((p) =>
                p.id === editingProgram.id
                    ? {
                          ...p,
                          title: formTitle.trim(),
                          code: formCode.trim().toUpperCase() || p.code,
                          description: formDescription.trim(),
                          icon: formIcon,
                          gradient: formGradient,
                      }
                    : p,
            );
            toast.success(`Updated "${formTitle.trim()}"`);
        } else {
            const newProgram: Program = {
                id: `prog-${Date.now()}`,
                title: formTitle.trim(),
                code: formCode.trim().toUpperCase() || "PROG",
                description: formDescription.trim(),
                icon: formIcon,
                gradient: formGradient,
            };
            updated = [...programs, newProgram];
            toast.success(`Added new program "${formTitle.trim()}"`);
        }

        setPrograms(updated);
        saveStoredPrograms(updated);
        setIsDialogOpen(false);
    };

    const handleDelete = (program: Program) => {
        if (
            window.confirm(
                `Are you sure you want to remove the program "${program.title}"?`,
            )
        ) {
            const updated = programs.filter((p) => p.id !== program.id);
            setPrograms(updated);
            saveStoredPrograms(updated);
            toast.success(`Removed "${program.title}"`);
        }
    };

    const handleMove = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= programs.length) return;

        const updated = [...programs];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        setPrograms(updated);
        saveStoredPrograms(updated);
        toast.info("Program order updated");
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-900 tracking-tight flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-blue-600" />
                        Manage Core Programs
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Edit titles, abbreviation codes, and descriptions for programs on the home screen.
                    </p>
                </div>
                <Button
                    onClick={openAddDialog}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-md flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add New Program
                </Button>
            </div>

            {/* Explanatory Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-4 rounded-xl flex items-center gap-3 text-xs text-blue-950">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <span>
                    <strong>Interactive Home Cards:</strong> Visitors can click any program card on the homepage to shrink the title and reveal its full description, with a top-right <strong>"-"</strong> button to minimize it back.
                </span>
            </div>

            {/* Programs List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {programs.map((program, index) => {
                    const IconComponent = ICON_MAP[program.icon] || GraduationCap;

                    return (
                        <Card
                            key={program.id}
                            className="bg-white rounded-2xl border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                        <div
                                            className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${program.gradient} rounded-xl shadow-sm text-white shrink-0`}>
                                            <IconComponent className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-extrabold text-blue-900 text-base">
                                                    {program.title}
                                                </span>
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider">
                                                    ({program.code})
                                                </span>
                                            </div>
                                            <span className="text-xs text-gray-400 font-medium">
                                                Order Position #{index + 1}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Order buttons */}
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            disabled={index === 0}
                                            onClick={() => handleMove(index, "up")}
                                            className="h-7 w-7 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                            title="Move Up">
                                            <ArrowUp className="w-3.5 h-3.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            disabled={index === programs.length - 1}
                                            onClick={() => handleMove(index, "down")}
                                            className="h-7 w-7 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                                            title="Move Down">
                                            <ArrowDown className="w-3.5 h-3.5" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Description Box */}
                                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                                        Expanded Description:
                                    </span>
                                    <p className="text-xs text-gray-700 leading-relaxed text-justify">
                                        {program.description}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEditDialog(program)}
                                        className="h-8 text-xs text-blue-700 border-blue-200 hover:bg-blue-50 flex items-center gap-1.5 font-medium">
                                        <Pencil className="w-3.5 h-3.5" />
                                        Edit Content
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDelete(program)}
                                        className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50"
                                        title="Delete Program">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Add / Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-xl bg-white rounded-2xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-blue-900">
                            {editingProgram ? "Edit Core Program" : "Add Core Program"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-4 mt-2">
                        {/* Title & Code */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div className="sm:col-span-2">
                                <Label htmlFor="progTitle" className="text-xs font-semibold text-gray-700">
                                    Full Program Title *
                                </Label>
                                <Input
                                    id="progTitle" name="title"
                                    value={formTitle}
                                    onChange={(e) => setFormTitle(e.target.value)}
                                    placeholder="e.g. National Apprenticeship Training Scheme"
                                    required
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="progCode" className="text-xs font-semibold text-gray-700">
                                    Code / Acronym *
                                </Label>
                                <Input
                                    id="progCode" name="code"
                                    value={formCode}
                                    onChange={(e) => setFormCode(e.target.value)}
                                    placeholder="e.g. NATS"
                                    required
                                    className="mt-1 uppercase"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="progDesc" className="text-xs font-semibold text-gray-700">
                                Description (revealed when card is clicked) *
                            </Label>
                            <Textarea
                                id="progDesc" name="description"
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                                placeholder="Describe the program's objectives, benefits, and target audience..."
                                rows={4}
                                required
                                className="mt-1 resize-none"
                            />
                        </div>

                        {/* Color Gradient Selection */}
                        <div>
                            <Label className="text-xs font-semibold text-gray-700 block mb-1.5">
                                Theme Color Accent
                            </Label>
                            <div className="flex flex-wrap gap-2">
                                {GRADIENTS.map((g) => (
                                    <button
                                        type="button"
                                        key={g.value}
                                        onClick={() => setFormGradient(g.value)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r ${g.value} transition-all ${
                                            formGradient === g.value
                                                ? "ring-2 ring-offset-2 ring-blue-600 scale-105"
                                                : "opacity-80 hover:opacity-100"
                                        }`}>
                                        {g.label}
                                    </button>
                                ))}
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
                                {editingProgram ? "Save Changes" : "Create Program"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManagePrograms;
