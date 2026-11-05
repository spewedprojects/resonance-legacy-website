import { Mail, Phone, MapPin, ExternalLink, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteContact, useSiteEventsConfig } from "@/lib/siteData";

const Footer = () => {
    const contact = useSiteContact();
    const eventsConfig = useSiteEventsConfig();

    return (
        <footer className="bg-gray-900 text-white py-12 px-6 md:px-12 lg:px-16">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4 text-orange-400">
                            RESONANCE
                        </h3>
                        <p className="text-gray-300 mb-4">
                            {contact.companyName}
                        </p>
                        <p className="text-gray-400 text-sm">
                            Empowering businesses and individuals through
                            innovative solutions and strategic guidance.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">
                            Quick Links
                        </h4>
                        <ul className="space-y-2 text-gray-300">
                            <li>
                                <Link
                                    to="/"
                                    className="hover:text-orange-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/blog"
                                    className="hover:text-orange-400 transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <a
                                    href={eventsConfig.portalUrl || "https://events.theresonance.co.in"}
                                    target={eventsConfig.portalUrl?.startsWith("http") ? "_blank" : undefined}
                                    rel={eventsConfig.portalUrl?.startsWith("http") ? "noopener noreferrer" : undefined}
                                    className="hover:text-orange-400 transition-colors inline-flex items-center gap-1.5 font-medium">
                                    <span>Events</span>
                                    {eventsConfig.portalUrl?.startsWith("http") && (
                                        <ExternalLink className="w-3 h-3 text-orange-400/80" />
                                    )}
                                </a>
                            </li>
                            <li>
                                <Link
                                    to="/events"
                                    className="hover:text-orange-400 text-gray-400 text-xs transition-colors pl-2 border-l border-slate-700">
                                    Browse Events
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/about"
                                    className="hover:text-orange-400 transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/gallery"
                                    className="hover:text-orange-400 transition-colors">
                                    Gallery
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/contact"
                                    className="hover:text-orange-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/admin"
                                    className="hover:text-orange-400 text-gray-500 transition-colors">
                                    Admin Login
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">
                            Contact Info
                        </h4>
                        <div className="space-y-3 text-gray-300">
                            <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-3 text-orange-400 shrink-0" />
                                <a
                                    href={`mailto:${contact.email}`}
                                    className="hover:underline truncate">
                                    {contact.email}
                                </a>
                            </div>
                            <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-3 text-orange-400 shrink-0" />
                                <a
                                    href={`tel:${contact.phone.replace(/[^0-9+]/g, "")}`}
                                    className="hover:underline">
                                    {contact.phone}
                                </a>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-3 text-orange-400 shrink-0" />
                                <span>{contact.address}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} {contact.companyName}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
