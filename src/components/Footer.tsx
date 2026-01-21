import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
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
                            Entrepreneurship & Employability Solutions Pvt. Ltd.
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
                                <a
                                    href="/"
                                    className="hover:text-orange-400 transition-colors">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/blog"
                                    className="hover:text-orange-400 transition-colors">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/about"
                                    className="hover:text-orange-400 transition-colors">
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/gallery"
                                    className="hover:text-orange-400 transition-colors">
                                    Gallery
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/contact"
                                    className="hover:text-orange-400 transition-colors">
                                    Contact
                                </a>
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
                                <Mail className="h-4 w-4 mr-3 text-orange-400" />
                                <span>apply.theresonance@gmail.com</span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="h-4 w-4 mr-3 text-orange-400" />
                                <span>+91 6366824350</span>
                            </div>
                            <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-3 text-orange-400" />
                                <span>Pune, India</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>
                        &copy; 2025 Resonance Entrepreneurship & Employability
                        Solutions Pvt. Ltd. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
