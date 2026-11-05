import React, { useEffect, useRef } from "react";
import { ArrowRight, Ticket, ExternalLink } from "lucide-react";

interface EventRegistrationWidgetProps {
    snippet?: string;
    fallbackUrl?: string;
    eventTitle?: string;
    className?: string;
}

const EventRegistrationWidget: React.FC<EventRegistrationWidgetProps> = ({
    snippet,
    fallbackUrl,
    eventTitle,
    className = "",
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!snippet || !containerRef.current) return;

        // Clear previous content
        containerRef.current.innerHTML = "";

        // Parse HTML snippet
        const range = document.createRange();
        range.selectNode(containerRef.current);
        const documentFragment = range.createContextualFragment(snippet);

        // Execute any script elements present in the snippet (e.g. Konfhub button / embed scripts)
        const scripts = documentFragment.querySelectorAll("script");
        const executableScripts: HTMLScriptElement[] = [];

        scripts.forEach((oldScript) => {
            const newScript = document.createElement("script");
            Array.from(oldScript.attributes).forEach((attr) => {
                newScript.setAttribute(attr.name, attr.value);
            });
            if (oldScript.innerHTML) {
                newScript.innerHTML = oldScript.innerHTML;
            }
            executableScripts.push(newScript);
            oldScript.parentNode?.removeChild(oldScript);
        });

        containerRef.current.appendChild(documentFragment);

        executableScripts.forEach((newScript) => {
            containerRef.current?.appendChild(newScript);
        });
    }, [snippet]);

    if (snippet && snippet.trim()) {
        return (
            <div
                ref={containerRef}
                className={`event-registration-widget inline-flex items-center ${className}`}
            />
        );
    }

    if (fallbackUrl && fallbackUrl.trim()) {
        return (
            <a
                href={fallbackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 ${className}`}
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
