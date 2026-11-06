import React, { useState } from "react";
import {
    getStoredAlbums,
    saveStoredAlbums,
    DEFAULT_ALBUMS,
    Album,
    processImageFile,
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
    Images,
    Plus,
    Pencil,
    Trash2,
    ArrowUp,
    ArrowDown,
    Upload,
    Link as LinkIcon,
    Star,
    RotateCcw,
    Calendar,
    MapPin,
    Eye,
    X,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const ManageGallery: React.FC = () => {
    const [albums, setAlbums] = useState<Album[]>(getStoredAlbums);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);

    // Form fields
    const [formTitle, setFormTitle] = useState("");
    const [formDescription, setFormDescription] = useState("");
    const [formDate, setFormDate] = useState("");
    const [formLocation, setFormLocation] = useState("");
    const [formCoverImage, setFormCoverImage] = useState("");
    const [formImages, setFormImages] = useState<string[]>([]);

    // Image URL helper field
    const [imageUrlInput, setImageUrlInput] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const openAddDialog = () => {
        setEditingAlbum(null);
        setFormTitle("");
        setFormDescription("");
        setFormDate(
            new Date().toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
            }),
        );
        setFormLocation("Resonance Hub");
        setFormCoverImage("");
        setFormImages([]);
        setImageUrlInput("");
        setIsDialogOpen(true);
    };

    const openEditDialog = (album: Album) => {
        setEditingAlbum(album);
        setFormTitle(album.title);
        setFormDescription(album.description);
        setFormDate(album.date || "");
        setFormLocation(album.location || "");
        setFormCoverImage(album.coverImage || (album.images[0] || ""));
        setFormImages(album.images || []);
        setImageUrlInput("");
        setIsDialogOpen(true);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        const newImages: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith("image/")) continue;
                // Max width 1200px for high-res gallery viewing while optimizing local storage
                const base64 = await processImageFile(file, 1200, 0.85);
                newImages.push(base64);
            }

            if (newImages.length > 0) {
                const updatedImages = [...formImages, ...newImages];
                setFormImages(updatedImages);
                // If no cover image yet, set first image as cover
                if (!formCoverImage) {
                    setFormCoverImage(newImages[0]);
                }
                toast.success(`Added ${newImages.length} image(s) to album`);
            }
        } catch (err) {
            console.error("Error uploading images", err);
            toast.error("Failed to process one or more images");
        } finally {
            setIsUploading(false);
            e.target.value = "";
        }
    };

    const handleAddImageUrl = () => {
        const url = imageUrlInput.trim();
        if (!url) return;
        const updatedImages = [...formImages, url];
        setFormImages(updatedImages);
        if (!formCoverImage) {
            setFormCoverImage(url);
        }
        setImageUrlInput("");
        toast.success("Image URL added to album");
    };

    const handleRemoveImage = (imgToRemove: string) => {
        const updatedImages = formImages.filter((img) => img !== imgToRemove);
        setFormImages(updatedImages);
        if (formCoverImage === imgToRemove) {
            setFormCoverImage(updatedImages[0] || "");
        }
        toast.info("Image removed from album");
    };

    const handleSetCover = (img: string) => {
        setFormCoverImage(img);
        toast.success("Selected as album cover image");
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formTitle.trim() || !formDescription.trim()) {
            toast.error("Please provide both Album Title and Event Details");
            return;
        }

        if (formImages.length === 0) {
            toast.error("Please add at least one picture to this album");
            return;
        }

        const cover = formCoverImage || formImages[0];
        let updated: Album[];

        if (editingAlbum) {
            updated = albums.map((a) =>
                a.id === editingAlbum.id
                    ? {
                          ...a,
                          title: formTitle.trim(),
                          description: formDescription.trim(),
                          date: formDate.trim(),
                          location: formLocation.trim() || undefined,
                          coverImage: cover,
                          images: formImages,
                      }
                    : a,
            );
            toast.success(`Updated album "${formTitle.trim()}"`);
        } else {
            const newAlbum: Album = {
                id: `album-${Date.now()}`,
                title: formTitle.trim(),
                description: formDescription.trim(),
                date: formDate.trim() || "Recent Event",
                location: formLocation.trim() || undefined,
                coverImage: cover,
                images: formImages,
            };
            updated = [newAlbum, ...albums];
            toast.success(`Created album "${formTitle.trim()}"`);
        }

        saveStoredAlbums(updated);
        setAlbums(updated);
        setIsDialogOpen(false);
    };

    const handleDelete = (id: string, title: string) => {
        if (albums.length <= 1) {
            toast.error("You must keep at least one album in the gallery.");
            return;
        }
        if (confirm(`Are you sure you want to delete album "${title}"?`)) {
            const updated = albums.filter((a) => a.id !== id);
            saveStoredAlbums(updated);
            setAlbums(updated);
            toast.success(`Deleted "${title}"`);
        }
    };

    const handleMove = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= albums.length) return;

        const updated = [...albums];
        const temp = updated[index];
        updated[index] = updated[targetIndex];
        updated[targetIndex] = temp;

        saveStoredAlbums(updated);
        setAlbums(updated);
    };

    const handleResetDefaults = () => {
        if (
            confirm(
                "Reset all gallery albums back to the original default events? Any custom albums will be replaced.",
            )
        ) {
            saveStoredAlbums(DEFAULT_ALBUMS);
            setAlbums(DEFAULT_ALBUMS);
            toast.success("Reset gallery albums to defaults");
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-6 md:p-8 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-blue-700/60 text-blue-200 text-xs font-semibold rounded-full uppercase tracking-wider">
                            Media Management
                        </span>
                        <span className="px-3 py-1 bg-white/10 text-white text-xs font-semibold rounded-full">
                            {albums.length} Event Albums
                        </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
                        <Images className="w-8 h-8 text-orange-400" />
                        Manage Gallery Albums
                    </h1>
                    <p className="text-blue-200 text-sm mt-1 max-w-2xl">
                        Create and organize photo albums for company events, student workshops, and partner bootcamps. Select custom cover photos and describe the event details.
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
                        Create New Album
                    </Button>
                </div>
            </div>

            {/* Albums Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {albums.map((album, index) => (
                    <Card
                        key={album.id}
                        className="bg-white rounded-2xl border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
                        <div>
                            {/* Cover Image & Photo Count Badge */}
                            <div className="relative aspect-video w-full bg-slate-100 overflow-hidden">
                                <img
                                    src={album.coverImage || (album.images && album.images[0]) || "/media/placeholder.png"}
                                    alt={album.title}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src =
                                            "/media/placeholder.png";
                                    }}
                                />
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                                    <Images className="w-3.5 h-3.5 text-orange-400" />
                                    <span>{album.images?.length || 0} Photos</span>
                                </div>
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
                                        disabled={index === albums.length - 1}
                                        onClick={() => handleMove(index, "down")}
                                        className="h-6 w-6 p-0 text-slate-700 hover:text-black disabled:opacity-30">
                                        <ArrowDown className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>

                            <CardContent className="p-5">
                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-2">
                                    {album.date && (
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                            {album.date}
                                        </span>
                                    )}
                                    {album.location && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                            {album.location}
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-base font-bold text-blue-950 mb-2 line-clamp-1">
                                    {album.title}
                                </h3>

                                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                                    {album.description}
                                </p>
                            </CardContent>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-400">
                                Album #{index + 1}
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => openEditDialog(album)}
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2.5 text-xs text-blue-700 border-blue-200 hover:bg-blue-50 rounded-lg">
                                    <Pencil className="w-3.5 h-3.5 mr-1" />
                                    Edit Album
                                </Button>
                                <Button
                                    onClick={() => handleDelete(album.id, album.title)}
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

            {/* Album Edit / Create Modal Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold text-blue-950 flex items-center gap-2">
                            <Images className="w-5 h-5 text-blue-600" />
                            {editingAlbum ? `Edit Album: ${editingAlbum.title}` : "Create New Event Album"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-5 pt-2">
                        {/* Title */}
                        <div className="space-y-1.5">
                            <Label htmlFor="album-title" className="text-xs font-bold text-slate-700">
                                Album Title *
                            </Label>
                            <Input
                                id="album-title" name="title"
                                placeholder="e.g. National Apprenticeship Conclave 2026"
                                value={formTitle}
                                onChange={(e) => setFormTitle(e.target.value)}
                                className="rounded-xl"
                                required
                            />
                        </div>

                        {/* Date & Location */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <Label htmlFor="album-date" className="text-xs font-bold text-slate-700">
                                    Event Date
                                </Label>
                                <Input
                                    id="album-date" name="date"
                                    placeholder="e.g. February 2026"
                                    value={formDate}
                                    onChange={(e) => setFormDate(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="album-loc" className="text-xs font-bold text-slate-700">
                                    Event Location / Venue
                                </Label>
                                <Input
                                    id="album-loc" name="location"
                                    placeholder="e.g. Pune Industrial Hub / Online"
                                    value={formLocation}
                                    onChange={(e) => setFormLocation(e.target.value)}
                                    className="rounded-xl"
                                />
                            </div>
                        </div>

                        {/* Event Details / Description */}
                        <div className="space-y-1.5">
                            <Label htmlFor="album-desc" className="text-xs font-bold text-slate-700">
                                Event Details & Description *
                            </Label>
                            <Textarea
                                id="album-desc" name="description"
                                placeholder="Describe what happened at this event, participants, key topics, and highlights..."
                                value={formDescription}
                                onChange={(e) => setFormDescription(e.target.value)}
                                rows={3}
                                className="rounded-xl text-sm leading-relaxed"
                                required
                            />
                        </div>

                        {/* Photo Management Section */}
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                        <Images className="w-4 h-4 text-orange-500" />
                                        Album Pictures ({formImages.length})
                                    </h4>
                                    <p className="text-[11px] text-gray-500">
                                        Upload photos or paste URLs. Click the star ★ on any photo to choose it as the album cover.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors">
                                        <Upload className="w-3.5 h-3.5" />
                                        {isUploading ? "Uploading..." : "Upload Photos"}
                                        <input
                                            id="gallery-file-upload"
                                            name="galleryFiles"
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            disabled={isUploading}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Add by URL */}
                            <div className="flex gap-2">
                                <Input
                                    id="gallery-image-url-input"
                                    name="imageUrlInput"
                                    placeholder="Or paste an image URL (e.g. https://...)"
                                    value={imageUrlInput}
                                    onChange={(e) => setImageUrlInput(e.target.value)}
                                    className="bg-white rounded-xl text-xs"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleAddImageUrl();
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddImageUrl}
                                    className="rounded-xl text-xs shrink-0">
                                    <LinkIcon className="w-3.5 h-3.5 mr-1" />
                                    Add URL
                                </Button>
                            </div>

                            {/* Pictures Grid */}
                            {formImages.length === 0 ? (
                                <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center bg-white">
                                    <Images className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                    <p className="text-xs text-slate-500 font-medium">
                                        No pictures added to this album yet.
                                    </p>
                                    <p className="text-[11px] text-slate-400 mt-0.5">
                                        Click "Upload Photos" above or paste an image URL to add photos.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto p-1">
                                    {formImages.map((img, i) => {
                                        const isCover = formCoverImage === img;
                                        return (
                                            <div
                                                key={i}
                                                className={`relative rounded-xl overflow-hidden group border-2 transition-all ${
                                                    isCover
                                                        ? "border-orange-500 ring-2 ring-orange-500/20"
                                                        : "border-slate-200"
                                                }`}>
                                                <div className="aspect-square bg-slate-100">
                                                    <img
                                                        src={img}
                                                        alt={`Album photo ${i + 1}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Cover Badge */}
                                                {isCover && (
                                                    <div className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow">
                                                        <Star className="w-2.5 h-2.5 fill-white" />
                                                        Cover
                                                    </div>
                                                )}

                                                {/* Action Overlay */}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(img)}
                                                        className="self-end p-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                                        title="Remove photo">
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>

                                                    {!isCover && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSetCover(img)}
                                                            className="w-full py-1 bg-white hover:bg-orange-50 text-orange-600 text-[10px] font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-1">
                                                            <Star className="w-3 h-3" />
                                                            Make Cover
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
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
                                {editingAlbum ? "Save Album Changes" : "Create Album"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ManageGallery;
