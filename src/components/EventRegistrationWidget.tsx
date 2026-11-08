import React, { useEffect, useRef, useState, useId } from "react";
import { ArrowRight, Ticket, Sparkles, Calendar } from "lucide-react";

export type WidgetButtonStyle = "gradient" | "navy" | "glow" | "classic";

interface EventRegistrationWidgetProps {
    snippet?: string;
    fallbackUrl?: string;
    eventTitle?: string;
    className?: string;
    buttonStyle?: WidgetButtonStyle;
    isPast?: boolean;
}

/**
 * Normalizes input snippet:
 * Ensures any script tag has a parent container so document.currentScript.parentElement works reliably.
 * Automatically upgrades insecure http:// widget script URLs to https:// to prevent mixed-content blocks online.
 */
function normalizeSnippet(raw?: string): { normalizedSnippet: string } {
    if (!raw || !raw.trim()) return { normalizedSnippet: "" };
    
    // Online safety: ensure https is used for 3rd-party widget scripts to prevent mixed-content blocks
    const trimmed = raw.trim().replace(/http:\/\/(.+?\.(?:js|css))/gi, "https://$1");

    // If it's a script without an enclosing parent div, wrap in a div so document.currentScript.parentElement works
    if (trimmed.includes("<script") && !trimmed.startsWith("<div")) {
        return {
            normalizedSnippet: `<div>${trimmed}</div>`,
        };
    }

    return { normalizedSnippet: trimmed };
}

const EventRegistrationWidget: React.FC<EventRegistrationWidgetProps> = ({
    snippet,
    fallbackUrl,
    eventTitle,
    className = "",
    buttonStyle = "gradient",
    isPast = false,
}) => {
    const rawId = useId().replace(/:/g, "_");
    const widgetId = `event_widget_${rawId}`;
    const containerRef = useRef<HTMLDivElement>(null);
    const [isScriptReady, setIsScriptReady] = useState(false);

    const { normalizedSnippet } = normalizeSnippet(snippet);

    useEffect(() => {
        if (isPast) return;
        if (!normalizedSnippet || !containerRef.current) {
            setIsScriptReady(false);
            return;
        }

        const container = containerRef.current;
        container.innerHTML = "";
        setIsScriptReady(false);

        // Parse HTML snippet safely
        const range = document.createRange();
        range.selectNode(container);
        const fragment = range.createContextualFragment(normalizedSnippet);

        // Find all script elements
        const scripts = Array.from(fragment.querySelectorAll("script"));

        // If no script tags exist (e.g. pure <a> or <button> snippet), just append
        if (scripts.length === 0) {
            container.appendChild(fragment);
            setIsScriptReady(true);
            return;
        }

        // Prepare executable scripts in-place inside the fragment
        // This ensures document.currentScript.parentElement is the expected parent div
        const newScripts: HTMLScriptElement[] = [];
        scripts.forEach((oldScript) => {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes).forEach((attr) => {
                newScript.setAttribute(attr.name, attr.value);
            });
            if (oldScript.innerHTML) {
                newScript.innerHTML = oldScript.innerHTML;
            }
            // Replace oldScript with newScript in the fragment DOM tree
            oldScript.parentNode?.replaceChild(newScript, oldScript);
            newScripts.push(newScript);
        });

        // Append the whole fragment with executable scripts to the live DOM container
        container.appendChild(fragment);

        // Watch for rendered button elements inside the widget container
        let checkCount = 0;
        const observerInterval = setInterval(() => {
            checkCount++;
            if (container.querySelector("button") || container.querySelector("a")) {
                setIsScriptReady(true);
                clearInterval(observerInterval);
            }
            if (checkCount > 40) {
                // After 4s timeout, mark ready so fallback isn't permanently stuck
                setIsScriptReady(true);
                clearInterval(observerInterval);
            }
        }, 100);

        return () => {
            clearInterval(observerInterval);
            try {
                container.innerHTML = "";
            } catch {
                // Ignore cleanup errors during unmount
            }
        };
    }, [normalizedSnippet, isPast]);

    // Scoped CSS styles to enhance third-party button appearance with modern visuals
    const getOverrideStyles = () => {
        if (buttonStyle === "classic") {
            return `
                #${widgetId} button, #${widgetId} a, #${widgetId} .reg-button, #${widgetId} input[type="button"], #${widgetId} input[type="submit"] {
                    font-family: inherit !important;
                }
            `;
        }

        if (buttonStyle === "navy") {
            return `
                #${widgetId} button, #${widgetId} a, #${widgetId} .reg-button, #${widgetId} input[type="button"], #${widgetId} input[type="submit"] {
                    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #312e81 100%) !important;
                    color: #ffffff !important;
                    border: 1px solid rgba(249, 115, 22, 0.7) !important;
                    border-radius: 9999px !important;
                    font-family: inherit !important;
                    font-weight: 700 !important;
                    font-size: 0.8125rem !important;
                    padding: 0.625rem 1.375rem !important;
                    box-shadow: 0 4px 14px 0 rgba(30, 58, 138, 0.4) !important;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 0.5rem !important;
                    cursor: pointer !important;
                    letter-spacing: 0.025em !important;
                    line-height: 1.25 !important;
                    text-decoration: none !important;
                }
                #${widgetId} button *, #${widgetId} a *, #${widgetId} .reg-button * {
                    color: #ffffff !important;
                    font-family: inherit !important;
                }
                #${widgetId} button:hover, #${widgetId} a:hover, #${widgetId} .reg-button:hover, #${widgetId} input[type="button"]:hover, #${widgetId} input[type="submit"]:hover {
                    transform: translateY(-2px) scale(1.03) !important;
                    border-color: #f97316 !important;
                    box-shadow: 0 8px 20px 0 rgba(249, 115, 22, 0.35) !important;
                }
                #${widgetId} button:active, #${widgetId} a:active, #${widgetId} .reg-button:active {
                    transform: translateY(0px) scale(0.98) !important;
                }
                #${widgetId} img {
                    filter: brightness(0) invert(1) !important;
                }
            `;
        }

        if (buttonStyle === "glow") {
            return `
                #${widgetId} button, #${widgetId} a, #${widgetId} .reg-button, #${widgetId} input[type="button"], #${widgetId} input[type="submit"] {
                    background: linear-gradient(135deg, #ea580c 0%, #c026d3 50%, #7c3aed 100%) !important;
                    color: #ffffff !important;
                    border: none !important;
                    outline: none !important;
                    border-radius: 9999px !important;
                    font-family: inherit !important;
                    font-weight: 700 !important;
                    font-size: 0.8125rem !important;
                    padding: 0.625rem 1.375rem !important;
                    box-shadow: 0 0 15px rgba(234, 88, 12, 0.5), 0 4px 14px rgba(192, 38, 211, 0.4) !important;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
                    display: inline-flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    gap: 0.5rem !important;
                    cursor: pointer !important;
                    letter-spacing: 0.025em !important;
                    line-height: 1.25 !important;
                    text-decoration: none !important;
                }
                #${widgetId} button *, #${widgetId} a *, #${widgetId} .reg-button * {
                    color: #ffffff !important;
                    font-family: inherit !important;
                }
                #${widgetId} button:hover, #${widgetId} a:hover, #${widgetId} .reg-button:hover, #${widgetId} input[type="button"]:hover, #${widgetId} input[type="submit"]:hover {
                    transform: translateY(-2px) scale(1.04) !important;
                    box-shadow: 0 0 25px rgba(234, 88, 12, 0.7), 0 8px 20px rgba(192, 38, 211, 0.6) !important;
                }
                #${widgetId} button:active, #${widgetId} a:active, #${widgetId} .reg-button:active {
                    transform: translateY(0px) scale(0.98) !important;
                }
                #${widgetId} img {
                    filter: brightness(0) invert(1) !important;
                }
            `;
        }

        // Default: 'gradient' (Vibrant Resonance Gradient Pill)
        return `
            #${widgetId} button, #${widgetId} a, #${widgetId} .reg-button, #${widgetId} input[type="button"], #${widgetId} input[type="submit"] {
                background: linear-gradient(135deg, #f97316 0%, #ea580c 45%, #dc2626 100%) !important;
                color: #ffffff !important;
                border: none !important;
                outline: none !important;
                border-radius: 9999px !important;
                font-family: inherit !important;
                font-weight: 700 !important;
                font-size: 0.8125rem !important;
                padding: 0.625rem 1.375rem !important;
                box-shadow: 0 4px 14px 0 rgba(234, 88, 12, 0.38) !important;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 0.5rem !important;
                cursor: pointer !important;
                letter-spacing: 0.025em !important;
                line-height: 1.25 !important;
                text-decoration: none !important;
            }
            #${widgetId} button *, #${widgetId} a *, #${widgetId} .reg-button * {
                color: #ffffff !important;
                font-family: inherit !important;
            }
            #${widgetId} button:hover, #${widgetId} a:hover, #${widgetId} .reg-button:hover, #${widgetId} input[type="button"]:hover, #${widgetId} input[type="submit"]:hover {
                transform: translateY(-2px) scale(1.03) !important;
                background: linear-gradient(135deg, #fb923c 0%, #ea580c 45%, #b91c1c 100%) !important;
                box-shadow: 0 8px 22px 0 rgba(234, 88, 12, 0.52) !important;
            }
            #${widgetId} button:active, #${widgetId} a:active, #${widgetId} .reg-button:active {
                transform: translateY(0px) scale(0.98) !important;
            }
            #${widgetId} img {
                filter: brightness(0) invert(1) !important;
            }
        `;
    };

    const getFallbackThemeClass = () => {
        switch (buttonStyle) {
            case "navy":
                return "bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 hover:from-blue-950 hover:to-indigo-950 text-white border border-orange-500/70 shadow-md hover:shadow-lg shadow-blue-900/30";
            case "glow":
                return "bg-gradient-to-r from-orange-600 via-fuchsia-600 to-purple-600 hover:from-orange-500 hover:to-purple-500 text-white shadow-md hover:shadow-lg shadow-purple-500/40 ring-1 ring-orange-400/50";
            case "classic":
                return "bg-slate-800 hover:bg-slate-900 text-white shadow-sm border border-slate-700";
            case "gradient":
            default:
                return "bg-gradient-to-r from-orange-500 via-rose-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md hover:shadow-lg shadow-orange-500/25";
        }
    };

    if (isPast) {
        return (
            <span
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-slate-200 text-slate-500 border border-slate-300/80 cursor-not-allowed select-none ${className}`}
                title="This event has concluded. Registration is closed.">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Registration Closed</span>
            </span>
        );
    }

    if (normalizedSnippet) {
        return (
            <div
                id={widgetId}
                className={`event-registration-widget relative inline-flex items-center min-h-[40px] ${className}`}
                data-style={buttonStyle}>
                {/* Scoped CSS to enhance third-party button styles */}
                <style dangerouslySetInnerHTML={{ __html: getOverrideStyles() }} />

                {/* Instant visual loading placeholder to eliminate Cumulative Layout Shift (CLS) */}
                {!isScriptReady && (
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-sm opacity-90 animate-pulse pointer-events-none">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                        <span>Loading Registration...</span>
                    </div>
                )}

                {/* Container for rendered widget DOM */}
                <div
                    ref={containerRef}
                    className={`inline-flex items-center ${!isScriptReady ? "hidden" : "animate-in fade-in duration-300"}`}
                />
            </div>
        );
    }

    if (fallbackUrl && fallbackUrl.trim()) {
        return (
            <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs transform hover:scale-105 active:scale-95 transition-all duration-300 ${getFallbackThemeClass()} ${className}`}
                title={`Register for ${eventTitle || "Event"}`}>
                <Ticket className="w-3.5 h-3.5" />
                <span>Register Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
            </a>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200">
            Registration opening soon
        </span>
    );
};

export default EventRegistrationWidget;
