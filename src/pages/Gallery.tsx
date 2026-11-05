import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
    Images,
    Calendar,
    MapPin,
    ArrowLeft,
    ArrowRight,
    X,
    ChevronLeft,
    ChevronRight,
    Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteAlbums, Album } from "@/lib/siteData";

const Gallery = () => {
    const albums = useSiteAlbums();
    const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Scroll to top when page mounts or album selected
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [selectedAlbumId]);

    const activeAlbum = albums.find((a) => a.id === selectedAlbumId);
    const albumImages = activeAlbum ? activeAlbum.images : [];

    // Keyboard navigation for lightbox
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (lightboxIndex === null) return;
            if (e.key === "Escape") setLightboxIndex(null);
            if (e.key === "ArrowLeft") handlePrevImage();
            if (e.key === "ArrowRight") handleNextImage();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [lightboxIndex, albumImages]);

    const handlePrevImage = () => {
        if (lightboxIndex === null || albumImages.length === 0) return;
        setLightboxIndex((prev) =>
            prev === 0 ? albumImages.length - 1 : (prev as number) - 1,
        );
    };

    const handleNextImage = () => {
        if (lightboxIndex === null || albumImages.length === 0) return;
        setLightboxIndex((prev) =>
            prev === albumImages.length - 1 ? 0 : (prev as number) + 1,
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col justify-between">
            <Navbar />

            <main className="flex-1">
                {/* Hero / Header Section */}
                <section className="pt-32 pb-10 text-center px-4 sm:px-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-800 text-xs font-semibold mb-3">
                            <Images className="w-3.5 h-3.5 text-blue-600" />
                            <span>Resonance Event Memories</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-3 tracking-tight">
                            Event <span className="text-blue-700">Gallery</span>
                        </h1>
                        <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
                            Highlights and visual archives from our skill development workshops, startup bootcamps, and incubation milestones.
                        </p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 pb-20">
                    {!activeAlbum ? (
                        /* ================= ALL ALBUMS VIEW ================= */
                        <div className="space-y-8">
                            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                                <h2 className="text-xl sm:text-2xl font-bold text-blue-950 flex items-center gap-2">
                                    <span>Browse Albums</span>
                                    <span className="text-sm font-semibold text-slate-400">
                                        ({albums.length})
                                    </span>
                                </h2>
                                <span className="text-xs text-gray-500">
                                    Click any album to view event photos
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                {albums.map((album) => (
                                    <div
                                        key={album.id}
                                        onClick={() => setSelectedAlbumId(album.id)}
                                        className="bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col cursor-pointer group hover:-translate-y-1">
                                        {/* Cover Image */}
                                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                                            <img
                                                src={album.coverImage || (album.images && album.images[0]) || "/media/placeholder.png"}
                                                alt={album.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                loading="lazy"
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).src =
                                                        "/media/placeholder.png";
                                                }}
                                            />
                                            {/* Photo Count Tag */}
                                            <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                                <Images className="w-3.5 h-3.5 text-orange-400" />
                                                <span>{album.images?.length || 0} Photos</span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 flex flex-col flex-1 justify-between">
                                            <div>
                                                {/* Meta: Date & Location */}
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                                                    {album.date && (
                                                        <span className="flex items-center gap-1 font-medium">
                                                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                                                            {album.date}
                                                        </span>
                                                    )}
                                                    {album.location && (
                                                        <span className="flex items-center gap-1 font-medium">
                                                            <MapPin className="w-3.5 h-3.5 text-orange-500" />
                                                            {album.location}
                                                        </span>
                                                    )}
                                                </div>

                                                <h3 className="text-lg font-bold text-blue-950 group-hover:text-blue-700 transition-colors mb-2 leading-snug">
                                                    {album.title}
                                                </h3>

                                                <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 leading-relaxed mb-4">
                                                    {album.description}
                                                </p>
                                            </div>

                                            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-800 transition-colors mt-auto">
                                                <span>Explore Album</span>
                                                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        /* ================= SINGLE ALBUM DETAIL VIEW ================= */
                        <div className="space-y-8 animate-in fade-in duration-300">
                            {/* Back to Albums Bar */}
                            <div className="flex items-center justify-between">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedAlbumId(null)}
                                    className="rounded-full border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold flex items-center gap-1.5 px-4">
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to All Albums
                                </Button>

                                <span className="text-xs text-gray-500">
                                    {albumImages.length} Pictures in this Album
                                </span>
                            </div>

                            {/* Album Header Banner */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-start">
                                <div className="w-full md:w-1/3 aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 shadow-inner shrink-0">
                                    <img
                                        src={activeAlbum.coverImage || (albumImages[0] || "/media/placeholder.png")}
                                        alt={activeAlbum.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                        {activeAlbum.date && (
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-semibold">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {activeAlbum.date}
                                            </span>
                                        )}
                                        {activeAlbum.location && (
                                            <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-full font-semibold">
                                                <MapPin className="w-3.5 h-3.5" />
                                                {activeAlbum.location}
                                            </span>
                                        )}
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-bold text-blue-950">
                                        {activeAlbum.title}
                                    </h2>

                                    <div className="pt-2 border-t border-slate-100">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                                            Event Details
                                        </h4>
                                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                            {activeAlbum.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Album Pictures Grid */}
                            <div>
                                <h3 className="text-lg font-bold text-blue-950 mb-4 flex items-center gap-2">
                                    <Images className="w-5 h-5 text-blue-600" />
                                    Album Photos ({albumImages.length})
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {albumImages.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setLightboxIndex(idx)}
                                            className="group relative rounded-2xl overflow-hidden bg-slate-100 shadow-sm hover:shadow-lg transition-all aspect-square cursor-pointer">
                                            <img
                                                src={img}
                                                alt={`${activeAlbum.title} photo ${idx + 1}`}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                                onError={(e) => {
                                                    (e.currentTarget as HTMLImageElement).src =
                                                        "/media/placeholder.png";
                                                }}
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="p-3 bg-white/90 backdrop-blur-sm rounded-full text-blue-900 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                                                    <Maximize2 className="w-5 h-5" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* Lightbox Modal */}
            {lightboxIndex !== null && albumImages[lightboxIndex] && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-4 py-6"
                    onClick={() => setLightboxIndex(null)}>
                    {/* Close Button */}
                    <button
                        onClick={() => setLightboxIndex(null)}
                        className="absolute top-5 right-5 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
                        title="Close (Esc)">
                        <X className="w-6 h-6" />
                    </button>

                    {/* Previous Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handlePrevImage();
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 hidden sm:flex items-center justify-center"
                        title="Previous photo (←)">
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Lightbox Image Container */}
                    <div
                        className="relative max-w-5xl max-h-[85vh] flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}>
                        <img
                            src={albumImages[lightboxIndex]}
                            alt={`Photo ${lightboxIndex + 1}`}
                            className="max-h-[75vh] w-auto max-w-full object-contain rounded-2xl shadow-2xl"
                        />
                        <div className="mt-4 text-center text-white">
                            <p className="text-sm font-semibold">
                                {activeAlbum ? activeAlbum.title : "Gallery Image"}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Photo {lightboxIndex + 1} of {albumImages.length}
                            </p>
                        </div>
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleNextImage();
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 hidden sm:flex items-center justify-center"
                        title="Next photo (→)">
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Mobile Prev/Next Controls */}
                    <div className="absolute bottom-5 inset-x-0 flex justify-center gap-6 sm:hidden z-50">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrevImage();
                            }}
                            className="px-4 py-2 bg-white/20 text-white rounded-full text-xs font-semibold backdrop-blur-sm">
                            Previous
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNextImage();
                            }}
                            className="px-4 py-2 bg-white/20 text-white rounded-full text-xs font-semibold backdrop-blur-sm">
                            Next
                        </button>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Gallery;
