import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { EventCarouselSlide, sanitizeRichHtmlBasic } from "@/lib/siteData";

interface EventShowcaseCarouselProps {
    bannerImage?: string;
    slides: EventCarouselSlide[];
    intervalSeconds?: number;
    eventTitle?: string;
}

type CarouselRenderItem =
    | { kind: "banner"; id: string; image: string }
    | { kind: "slide"; id: string; image: string; title?: string; badge?: string; description: string };

const PLACEHOLDER_IMAGE = "/media/placeholder.png";

const handleImageFallback = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.onerror = null;
    target.src = PLACEHOLDER_IMAGE;
};

const EventShowcaseCarousel: React.FC<EventShowcaseCarouselProps> = ({
    bannerImage,
    slides,
    intervalSeconds = 3,
    eventTitle,
}) => {
    const validSlides = slides.filter((s) => s.image?.trim() || s.description?.trim() || s.title?.trim());

    // Position 0 is always the Event Banner (when set), followed by custom speaker/highlight slides.
    const items: CarouselRenderItem[] = [
        ...(bannerImage && bannerImage.trim()
            ? [{ kind: "banner" as const, id: "__event-banner__", image: bannerImage.trim() }]
            : []),
        ...validSlides.map((s) => ({ kind: "slide" as const, ...s })),
    ];

    const sectionRef = useRef<HTMLElement>(null);
    const touchStartX = useRef<number | null>(null);

    const [activeIndex, setActiveIndex] = useState(0);
    const [isInView, setIsInView] = useState(true);
    const [isManualPaused, setIsManualPaused] = useState(false);

    // Observe viewport visibility: when user scrolls completely past the carousel,
    // clear any manual navigation pause so auto-sliding resumes cleanly when viewed again.
    useEffect(() => {
        const el = sectionRef.current;
        if (!el || typeof IntersectionObserver === "undefined") return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
                if (!entry.isIntersecting) {
                    setIsManualPaused(false);
                }
            },
            { threshold: 0 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Auto-advance timer (respects custom interval & stops after manual navigation until scrolled past)
    useEffect(() => {
        if (items.length <= 1 || isManualPaused || !isInView) return;
        const delayMs = Math.max(1, Number(intervalSeconds) || 3) * 1000;
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % items.length);
        }, delayMs);
        return () => clearInterval(timer);
    }, [items.length, intervalSeconds, isManualPaused, isInView]);

    if (items.length === 0) return null;

    const safeIndex = activeIndex >= items.length ? 0 : activeIndex;
    const currentItem = items[safeIndex];
    const hasMultiple = items.length > 1;

    const handleManualNav = (targetIndex: number) => {
        if (!hasMultiple) return;
        const nextIdx = ((targetIndex % items.length) + items.length) % items.length;
        setActiveIndex(nextIdx);
        setIsManualPaused(true);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null || !hasMultiple) return;
        const endX = e.changedTouches[0]?.clientX ?? touchStartX.current;
        const diff = touchStartX.current - endX;
        touchStartX.current = null;
        if (Math.abs(diff) > 45) {
            handleManualNav(diff > 0 ? safeIndex + 1 : safeIndex - 1);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!hasMultiple) return;
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            handleManualNav(safeIndex - 1);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            handleManualNav(safeIndex + 1);
        }
    };

    return (
        <section
            ref={sectionRef}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            aria-roledescription="carousel"
            aria-label={eventTitle ? `${eventTitle} Highlights` : "Event Highlights Carousel"}
            className="max-w-6xl mx-auto px-4 sm:px-6 mb-12 focus:outline-none">
            <div className="relative">
                {/* Floating Left/Right Navigation Arrows on Card Edges (outside poster text on md+) */}
                {hasMultiple && (
                    <>
                        <button
                            type="button"
                            onClick={() => handleManualNav(safeIndex - 1)}
                            aria-label="Previous slide"
                            className="absolute left-2 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-blue-950 border border-slate-200/90 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleManualNav(safeIndex + 1)}
                            aria-label="Next slide"
                            className="absolute right-2 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/95 hover:bg-white text-blue-950 border border-slate-200/90 shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </>
                )}

                <div className="rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl bg-white">
                    {currentItem.kind === "banner" ? (
                        /* Slide Position 0: Full Event Banner (uncropped, consistent showcase height) */
                        <div
                            key={currentItem.id}
                            className="w-full h-[260px] sm:h-[380px] md:h-[470px] bg-slate-900/5 flex items-center justify-center animate-in fade-in duration-300">
                            <img
                                src={currentItem.image || PLACEHOLDER_IMAGE}
                                alt={eventTitle || "Event Banner"}
                                className="w-full h-full object-contain block"
                                onError={handleImageFallback}
                            />
                        </div>
                    ) : (
                        /* Speaker / Guest Highlight Slide: 1:1 Image Left + Top-Aligned Rich Text Right */
                        (() => {
                            const rawDesc = currentItem.description || "";
                            const isHtmlDesc = /<[a-z][\s\S]*>/i.test(rawDesc);
                            const safeHtml = isHtmlDesc ? sanitizeRichHtmlBasic(rawDesc) : "";

                            return (
                                <div
                                    key={currentItem.id || safeIndex}
                                    className="grid grid-cols-1 md:grid-cols-12 items-stretch md:min-h-[470px] animate-in fade-in duration-300">
                                    {/* Left: 1:1 Square Poster Showcase (never cropped, full resolution preserved) */}
                                    <div className="md:col-span-5 bg-slate-50/70 border-b md:border-b-0 md:border-r border-slate-200/80 flex items-center justify-center p-2.5 sm:p-4">
                                        <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white flex items-center justify-center shadow-xs">
                                            <img
                                                src={currentItem.image || PLACEHOLDER_IMAGE}
                                                alt={currentItem.title || eventTitle || `Slide ${safeIndex + 1}`}
                                                className="w-full h-full object-contain block"
                                                onError={handleImageFallback}
                                            />
                                        </div>
                                    </div>

                                    {/* Right: Top-Aligned Text Box with Optional Title/Badge & Rich Formatted Description */}
                                    <div className="md:col-span-7 p-6 sm:p-8 lg:p-9 flex flex-col justify-start text-left min-w-0">
                                        <div className="md:max-h-[430px] overflow-y-auto pr-1 space-y-3">
                                            {currentItem.badge && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200/70">
                                                    <Sparkles className="w-3 h-3 text-amber-700" />
                                                    <span>{currentItem.badge}</span>
                                                </span>
                                            )}

                                            {currentItem.title && (
                                                <h3 className="text-xl sm:text-2xl font-extrabold text-blue-950 leading-snug">
                                                    {currentItem.title}
                                                </h3>
                                            )}

                                            {rawDesc && (
                                                isHtmlDesc ? (
                                                    <div
                                                        className="rich-text-content prose prose-sm sm:prose-base max-w-none text-slate-700 leading-relaxed prose-headings:text-blue-950 prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:mb-3 prose-li:my-0.5 prose-ul:my-2 prose-ol:my-2 prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-3 prose-blockquote:italic prose-a:text-blue-600 prose-a:font-semibold hover:prose-a:underline"
                                                        dangerouslySetInnerHTML={{ __html: safeHtml }}
                                                    />
                                                ) : (
                                                    <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                                                        {rawDesc}
                                                    </p>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()
                    )}

                    {/* Bottom Pagination & Navigation Bar */}
                    <div className="border-t border-slate-100 bg-slate-50/80 px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                disabled={!hasMultiple}
                                onClick={() => handleManualNav(safeIndex - 1)}
                                aria-label="Previous slide"
                                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                disabled={!hasMultiple}
                                onClick={() => handleManualNav(safeIndex + 1)}
                                aria-label="Next slide"
                                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Clickable Page Dots */}
                        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5" role="tablist" aria-label="Carousel pages">
                            {items.map((item, idx) => {
                                const isActive = idx === safeIndex;
                                return (
                                    <button
                                        key={item.id || idx}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        aria-label={item.kind === "banner" ? "Go to Event Banner (Slide 1)" : `Go to slide ${idx + 1}`}
                                        onClick={() => handleManualNav(idx)}
                                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                                            isActive
                                                ? "w-7 bg-orange-500 shadow-xs"
                                                : "w-2 bg-slate-300 hover:bg-slate-400"
                                        }`}
                                    />
                                );
                            })}
                        </div>

                        {/* Page Indicator */}
                        <div className="text-xs font-bold text-slate-600 tabular-nums bg-white px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
                            {safeIndex + 1} / {items.length}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EventShowcaseCarousel;
