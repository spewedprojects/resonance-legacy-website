import {
    Mail,
    Phone,
    MapPin,
    Target,
    Eye,
    Users,
    Briefcase,
    GraduationCap,
    Building,
    Lightbulb,
    TrendingUp,
    FileText,
    Award,
    Code,
    Rocket,
    HandHeart,
    Factory,
    Handshake,
    Mouse,
    Minus,
    ArrowLeft,
    ArrowRight,
    Grid,
    Layers,
    Sparkles,
} from "lucide-react";
import { Button } from "../components/ui/button";
import ResonanceLogo from "../components/ui/ResonanceLogo";
import ResonanceLogoNav from "../components/ui/ResonanceLogoNav";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeamSection from "@/components/TeamSection";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import {
    useSiteAdvisors,
    useSiteTeam,
    useSitePrograms,
    useSiteServices,
    useSiteSettings,
} from "@/lib/siteData";

const SERVICE_ICONS: Record<string, React.ElementType> = {
    Users,
    Code,
    GraduationCap,
    Rocket,
    HandHeart,
    FileText,
    Briefcase,
    Sparkles,
    Building,
    Target,
    Award,
    TrendingUp,
};

const Index = () => {
    const advisors = useSiteAdvisors();
    const team = useSiteTeam();
    const programs = useSitePrograms();
    const services = useSiteServices();
    const settings = useSiteSettings();
    const [expandedProgramId, setExpandedProgramId] = useState<string | null>(null);
    const [isServicesDialogOpen, setIsServicesDialogOpen] = useState(false);
    const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);

    const activeService =
        services.find((s) => s.id === selectedServiceId) || services[0];
    const ActiveServiceIcon = activeService
        ? SERVICE_ICONS[activeService.icon] || Briefcase
        : Briefcase;

    const toggleProgram = (id: string, e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        setExpandedProgramId((prev) => (prev === id ? null : id));
    };

    return (
        <div className="min-h-screen">
            <Navbar />
            {/* Hero Section */}
            <section className="h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
                {/* Background geometric elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-20 blur-xl"></div>
                    <div className="absolute bottom-40 left-10 w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full opacity-30"></div>
                    <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-25"></div>
                    <div className="absolute bottom-20 right-1/3 w-20 h-20 bg-gradient-to-br from-orange-300 to-red-400 rounded-full opacity-20"></div>

                    {/* Geometric lines and shapes */}
                    <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 1000 1000"
                        preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <linearGradient
                                id="lineGradient"
                                x1="0%"
                                y1="0%"
                                x2="100%"
                                y2="100%">
                                <stop
                                    offset="0%"
                                    stopColor="#f97316"
                                    stopOpacity="0.1"
                                />
                                <stop
                                    offset="100%"
                                    stopColor="#dc2626"
                                    stopOpacity="0.1"
                                />
                            </linearGradient>
                        </defs>
                        <path
                            d="M0,300 Q250,200 500,300 T1000,300"
                            stroke="url(#lineGradient)"
                            strokeWidth="2"
                            fill="none"
                        />
                        <path
                            d="M0,700 Q250,600 500,700 T1000,700"
                            stroke="url(#lineGradient)"
                            strokeWidth="2"
                            fill="none"
                        />
                        <circle
                            cx="100"
                            cy="200"
                            r="3"
                            fill="#f97316"
                            opacity="0.3"
                        />
                        <circle
                            cx="900"
                            cy="800"
                            r="2"
                            fill="#dc2626"
                            opacity="0.4"
                        />
                        <circle
                            cx="200"
                            cy="600"
                            r="2"
                            fill="#ea580c"
                            opacity="0.3"
                        />
                    </svg>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 md:px-12 lg:px-16 text-center">
                    {/* Logo */}
                    <div className="mb-1">
                        <div className="relative">
                            <div className="w-56 sm:w-60 md:w-72 lg:w-[30rem] h-auto relative">
                                <img
                                    src="/images/page1/resonancelogo.svg"
                                    alt="Logo"
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Company Name */}
                    <div>
                        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#2E5C9D] leading-tight">
                            Entreprenuership & Employability Solutions Pvt Ltd.
                        </h1>
                    </div>
                </div>

                {/* Floating elements */}
                <div className="absolute bottom-10 left-10 opacity-30">
                    <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                </div>

                {/* Scroll down indicator */}
                <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
                    <div className="flex flex-col items-center space-y-2 animate-bounce">
                        <Mouse className="w-6 h-6 text-gray-700" />
                        <p className="text-sm text-gray-700 font-medium">
                            Scroll down
                        </p>
                    </div>
                </div>
            </section>

            {/* Empowerment Section */}
            <section className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-16 relative overflow-hidden py-10">
                {/* Background Gradients */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-10"></div>
                    <div className="absolute bottom-20 right-20 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-10"></div>
                    <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full opacity-10"></div>
                </div>

                {/* Main Content */}
                <div className="max-w-5xl mx-auto w-full relative z-10 space-y-8 text-center">
                    {/* Title */}
                    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2E5C9D] leading-tight">
                        Empowering India’s Skilled <br />
                        Workforce & Entrepreneurs
                    </h1>

                    {/* Image */}
                    <img
                        src="./media/workforce1.png"
                        alt="Workforce"
                        className="w-full max-w-md mx-auto object-contain"
                    />

                    {/* Subtitle */}
                    <h2 className="text-sm sm:text-lg md:text-xl lg:text-2xl text-[#2E5C9D] font-bold leading-relaxed">
                        Resonance Solutions – Bridging Skills, Employability &
                        Sustainability
                    </h2>
                </div>
            </section>

            {/* Welcome to Our Company Section */}
            <section className="min-h-screen flex items-center justify-center relative overflow-hidden p-6 bg-white">
                <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center z-10">
                    {/* Image */}
                    <div className="w-full flex justify-center bg-white border border-white p-4 rounded-xl">
                        <img
                            src="./media/audience.png"
                            alt="Audience"
                            className="w-full max-w-sm md:max-w-full m-0 object-cover rounded-xl"
                        />
                    </div>

                    {/* Text Content */}
                    <div className="space-y-8 text-center md:text-left">
                        <div className="space-y-6">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#2E5C9D]">
                                Welcome to
                                <br />
                                <span className="text-black font-medium">
                                    Our Company
                                </span>
                            </h2>

                            <p className="text-base sm:text-lg md:text-xl text-black font-bold leading-relaxed">
                                A dynamic social enterprise advancing
                                entrepreneurship and employability through skill
                                development, strategic partnerships and
                                innovation.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl  font-bold text-[#2E5C9D] mb-4">
                                Our Edge:
                            </h3>
                            <div className="space-y-3 text-base sm:text-lg md:text-xl text-black font-bold">
                                <p>
                                    Govt-aligned programs (NATS, NAPS, WISTA,
                                    AEDP)
                                </p>
                                <p>
                                    Strong Academia - Industry - Government
                                    linkages
                                </p>
                                <p>
                                    Onboarded 25,000 Candidates in 100+
                                    Establishments
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Vision & Mission Section */}
            <section className="h-auto lg:min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex justify-center relative overflow-hidden mt-5 py-10 lg:py-15 px-4 sm:px-6 lg:px-16">
                <div className="max-w-7xl w-full space-y-20 md:space-y-32">
                    {/* Vision Block */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Image */}
                        <div className="flex justify-center md:justify-start">
                            <img
                                src="./media/vision.png"
                                alt="Vision"
                                className="w-full max-w-sm sm:max-w-md md:max-w-lg object-contain rounded-xl"
                            />
                        </div>

                        {/* Text */}
                        <div className="space-y-6 text-center md:text-left">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2E5C9D]">
                                Vision
                            </h2>
                            <p className="text-base sm:text-lg md:text-xl text-black font-bold leading-relaxed">
                                To ignite a vibrant entrepreneurial culture and
                                equip the youth with employable skills to create
                                a robust industrial workforce for the nation and
                                beyond.
                            </p>
                        </div>
                    </div>

                    {/* Mission Block */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Text */}
                        <div className="space-y-6 text-center md:text-left order-2 md:order-1">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#2E5C9D]">
                                Mission
                            </h2>
                            <div className="space-y-4 text-base sm:text-lg md:text-xl text-black font-bold leading-relaxed">
                                <p>
                                    To establish a strong framework that
                                    empowers entrepreneurs to overcome
                                    challenges and develop scalable, sustainable
                                    businesses.
                                </p>
                                <p>
                                    To champion innovation as a key driver of
                                    India's economic advancement.
                                </p>
                                <p>
                                    To foster job creation, financial
                                    inclusivity and GDP growth through the
                                    success of entrepreneurial ventures.
                                </p>
                            </div>
                        </div>

                        {/* Image */}
                        <div className="flex justify-center md:justify-start order-1 md:order-2">
                            <img
                                src="./media/bonding.png"
                                alt="Bonding"
                                className="w-full max-w-sm sm:max-w-md md:max-w-lg object-contain rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Focus Areas Section */}
            <section className="h-auto flex items-center justify-center px-4 sm:px-6 md:px-12 lg:px-16 relative overflow-hidden py-10">
                <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    {/* Text Content */}
                    <div className="space-y-8">
                        {/* Heading */}
                        <div className="space-y-4 text-center md:text-left">
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#2E5C9D] leading-tight">
                                Our Focus{" "}
                                <span className="font-normal">Area's</span>
                            </h2>
                        </div>

                        {/* Focus Items */}
                        <div className="space-y-4 sm:space-y-5">
                            {[
                                {
                                    icon: GraduationCap,
                                    text: "Employability & Skills Training",
                                },
                                {
                                    icon: Users,
                                    text: "Apprenticeship & Staffing",
                                },
                                {
                                    icon: Building,
                                    text: "Industry Academia Government Collaboration",
                                },
                                {
                                    icon: Lightbulb,
                                    text: "Entrepreneurship Development",
                                },
                                {
                                    icon: TrendingUp,
                                    text: "Startup Incubation",
                                },
                                {
                                    icon: FileText,
                                    text: "Policy Implementation",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3 sm:space-x-4">
                                    <item.icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                                    <span className="text-black text-base sm:text-lg md:text-2xl font-semibold sm:font-bold">
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual */}
                    <div className="flex justify-center md:justify-end">
                        <img
                            src="./media/focusArea.png"
                            alt="Focus Area"
                            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg object-contain"
                        />
                    </div>
                </div>
            </section>

            {/* Core Programs Section */}
            <section className="h-auto flex flex-col items-center justify-center px-4 sm:px-6 md:px-12 lg:px-16 py-10 lg:py-20">
                <div className="flex flex-col justify-center items-center px-4 sm:px-6 lg:px-16 mt-10 text-center">
                    <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-[#2E5C9D] text-center">
                        Core <span className="font-normal">Programs</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-xl">
                        Click on any program card below to view its objectives and curriculum. Click <strong>"-"</strong> to minimize.
                    </p>
                </div>
                <div className="max-w-7xl w-full text-center">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mt-10">
                        {programs.map((program) => {
                            const isExpanded = expandedProgramId === program.id;
                            const IconComponent =
                                program.icon === "TrendingUp"
                                    ? TrendingUp
                                    : program.icon === "Award"
                                        ? Award
                                        : program.icon === "Building"
                                            ? Building
                                            : GraduationCap;

                            return (
                                <div
                                    key={program.id}
                                    onClick={() => toggleProgram(program.id)}
                                    className={`relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center flex flex-col justify-center min-h-[220px] sm:min-h-[240px] cursor-pointer group border-2 ${isExpanded
                                            ? "border-blue-500 shadow-xl bg-gradient-to-b from-white to-blue-50/40 ring-1 ring-blue-400"
                                            : "border-transparent hover:border-blue-100"
                                        }`}>
                                    {/* Minimize Button in Top-Right Corner */}
                                    {isExpanded && (
                                        <button
                                            type="button"
                                            onClick={(e) => toggleProgram(program.id, e)}
                                            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors shadow-sm cursor-pointer z-10"
                                            title="Minimize and hide description">
                                            <Minus className="w-4 h-4 font-bold" />
                                        </button>
                                    )}

                                    {!isExpanded ? (
                                        /* Default State: Large Title & Icon */
                                        <div className="flex flex-col items-center justify-center">
                                            <div
                                                className={`flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${program.gradient} rounded-xl mx-auto mb-4 text-white shadow-sm group-hover:scale-105 transition-transform`}>
                                                <IconComponent className="w-6 h-6 sm:w-8 sm:h-8" />
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-1 group-hover:text-blue-700 transition-colors">
                                                {program.title}
                                            </h3>
                                            <p className="text-sm font-semibold text-gray-500">
                                                ({program.code})
                                            </p>
                                            <span className="text-[11px] text-blue-600 font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                Click to expand details →
                                            </span>
                                        </div>
                                    ) : (
                                        /* Expanded State: Title Shrinks, Description appears in the same card space */
                                        <div className="text-left flex flex-col h-full animate-in fade-in duration-300">
                                            <div className="flex items-center gap-3 pr-8">
                                                <div
                                                    className={`flex items-center justify-center w-9 h-9 bg-gradient-to-br ${program.gradient} rounded-lg text-white shrink-0`}>
                                                    <IconComponent className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h3 className="text-sm sm:text-base font-bold text-blue-950 leading-tight">
                                                        {program.title}
                                                    </h3>
                                                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
                                                        ({program.code})
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-3 pt-3 border-t border-slate-200/80">
                                                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed text-justify">
                                                    {program.description}
                                                </p>
                                            </div>

                                            <div className="mt-auto pt-3 flex items-center justify-between text-[11px] text-gray-400">
                                                <span>Click "-" at top-right to minimize</span>
                                                <span className="text-blue-600 font-semibold">Active Details</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Key Services Section */}
            <section className="h-auto bg-gradient-to-br from-gray-50 via-white to-gray-100 flex justify-center px-4 sm:px-6 md:px-12 lg:px-16 py-10">
                <div className="max-w-7xl w-full text-center relative z-10">
                    {/* Section Header */}
                    <div className="space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
                            Key <span className="text-blue-700">Services</span>
                        </h2>
                        <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded mx-auto" />
                    </div>

                    {/* Services Grid (Shows existing 6 as cards) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                        {services.slice(0, 6).map((item, idx) => {
                            const ItemIcon = SERVICE_ICONS[item.icon] || Briefcase;
                            return (
                                <div
                                    key={item.id || idx}
                                    onClick={() => {
                                        setSelectedServiceId(item.id);
                                        setIsServicesDialogOpen(true);
                                    }}
                                    className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1 text-center">
                                    <div
                                        className={`flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br ${item.color} rounded-xl mx-auto mb-4 group-hover:scale-105 transition-transform`}>
                                        <ItemIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                    </div>
                                    <h3 className="text-base sm:text-lg font-semibold sm:font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
                                        {item.title}
                                    </h3>
                                </div>
                            );
                        })}
                    </div>

                    {/* CTA Button */}
                    <div className="pt-10">
                        <Button
                            onClick={() => {
                                setSelectedServiceId(null);
                                setIsServicesDialogOpen(true);
                            }}
                            size="lg"
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                            View All Services
                        </Button>
                    </div>
                </div>
            </section>

            {/* Services Detailed Dialog Modal */}
            <Dialog
                open={isServicesDialogOpen}
                onOpenChange={(open) => {
                    setIsServicesDialogOpen(open);
                    if (!open) setSelectedServiceId(null);
                }}>
                <DialogContent className="max-w-4xl lg:max-w-5xl w-[95vw] p-5 sm:p-7 max-h-[88vh] flex flex-col overflow-hidden">
                    <DialogHeader className="pb-3 border-b border-slate-100 shrink-0 text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pr-6">
                            <div>
                                <DialogTitle className="text-xl sm:text-2xl font-bold text-blue-950 flex items-center gap-2">
                                    <Layers className="w-5 h-5 text-blue-600" />
                                    Our Key Services
                                </DialogTitle>
                                <DialogDescription className="text-xs sm:text-sm text-gray-500 mt-1">
                                    {selectedServiceId
                                        ? "Select a service from the left list to explore its scope and implementation details."
                                        : "Explore our workforce, entrepreneurship, and venture development offerings. Click any service to view full details."}
                                </DialogDescription>
                            </div>
                            {selectedServiceId && (
                                <button
                                    onClick={() => setSelectedServiceId(null)}
                                    className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shrink-0">
                                    <Grid className="w-3.5 h-3.5 text-slate-500" />
                                    View All in Grid
                                </button>
                            )}
                        </div>
                    </DialogHeader>

                    {/* Dialog Content Area */}
                    <div className="flex-1 overflow-y-auto pt-4 pr-1">
                        {!selectedServiceId ? (
                            /* DEFAULT VIEW: ALL IN A GRID */
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {services.map((service) => {
                                        const IconComp = SERVICE_ICONS[service.icon] || Briefcase;
                                        return (
                                            <div
                                                key={service.id}
                                                onClick={() => setSelectedServiceId(service.id)}
                                                className="bg-slate-50/70 hover:bg-white rounded-2xl p-5 border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between text-left">
                                                <div>
                                                    <div
                                                        className={`w-11 h-11 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center text-white mb-3 shadow-sm group-hover:scale-105 transition-transform`}>
                                                        <IconComp className="w-5 h-5" />
                                                    </div>
                                                    <h3 className="text-sm sm:text-base font-bold text-blue-950 group-hover:text-blue-700 transition-colors mb-2 leading-snug">
                                                        {service.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                                                        {service.description}
                                                    </p>
                                                </div>

                                                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-blue-600 font-semibold group-hover:translate-x-0.5 transition-transform">
                                                    <span>View Details</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            /* DETAIL VIEW: LIST ON LEFT, DESCRIPTION ON RIGHT */
                            <div className="flex flex-col md:flex-row gap-5 min-h-[380px]">
                                {/* Left Side: Services List */}
                                <div className="md:w-5/12 lg:w-4/12 flex flex-col shrink-0 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0 md:pr-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <button
                                            onClick={() => setSelectedServiceId(null)}
                                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                                            <ArrowLeft className="w-3.5 h-3.5" />
                                            Back to Grid View
                                        </button>
                                        <span className="text-[11px] font-semibold text-slate-400">
                                            {services.length} Services
                                        </span>
                                    </div>

                                    <div className="space-y-2 overflow-y-auto max-h-[220px] md:max-h-[50vh] pr-1">
                                        {services.map((item) => {
                                            const isSelected = item.id === (activeService ? activeService.id : "");
                                            const ItemIcon = SERVICE_ICONS[item.icon] || Briefcase;
                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => setSelectedServiceId(item.id)}
                                                    className={`w-full text-left p-2.5 sm:p-3 rounded-xl transition-all flex items-center gap-3 border ${
                                                        isSelected
                                                            ? "bg-blue-50/90 border-blue-500 text-blue-950 shadow-sm ring-1 ring-blue-500/20"
                                                            : "bg-white border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                                                    }`}>
                                                    <div
                                                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} text-white flex items-center justify-center shrink-0`}>
                                                        <ItemIcon className="w-4 h-4" />
                                                    </div>
                                                    <span
                                                        className={`text-xs sm:text-sm leading-snug line-clamp-2 ${
                                                            isSelected
                                                                ? "font-bold text-blue-950"
                                                                : "font-medium text-slate-700"
                                                        }`}>
                                                        {item.title}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Right Side: Active Service Description & Details */}
                                {activeService && (
                                    <div className="md:w-7/12 lg:w-8/12 flex flex-col justify-between overflow-y-auto pr-1">
                                        <div className="space-y-4">
                                            <div className="flex items-start gap-4">
                                                <div
                                                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeService.color} text-white flex items-center justify-center shadow-md shrink-0`}>
                                                    <ActiveServiceIcon className="w-7 h-7" />
                                                </div>
                                                <div>
                                                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 mb-1">
                                                        Service Scope
                                                    </span>
                                                    <h3 className="text-lg sm:text-xl font-bold text-blue-950 leading-snug">
                                                        {activeService.title}
                                                    </h3>
                                                </div>
                                            </div>

                                            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
                                                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                                    Detailed Description
                                                </h4>
                                                <p className="text-sm sm:text-base text-gray-700 leading-relaxed text-justify">
                                                    {activeService.description}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                                            <span className="text-xs text-gray-500">
                                                Interested in collaborating or onboarding?
                                            </span>
                                            <Link
                                                to="/contact"
                                                onClick={() => setIsServicesDialogOpen(false)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E5C9D] hover:bg-blue-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors">
                                                Contact Our Team <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Industry Partners Section */}
            <section className="h-auto bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center px-4 sm:px-6 md:px-12 lg:px-16 py-10">
                <div className="max-w-7xl w-full text-center relative z-10">
                    {/* Heading */}
                    <div className="space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
                            Industry{" "}
                            <span className="text-blue-700">Partners</span>
                        </h2>
                        <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded mx-auto" />
                    </div>

                    {/* Partner Logos */}
                    <div className="space-y-10 my-10">
                        {/* Generate all logos in rows */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 sm:gap-6">
                            {[...Array(21)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg flex items-center justify-center h-20 transition-shadow">
                                    <img
                                        src={`/images/clients/${i + 1}.svg`}
                                        alt={`Client ${i + 1}`}
                                        className="max-h-12 max-w-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    {/* <div className="pt-10">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              View All Partners
            </Button>
          </div> */}
                </div>
            </section>

            {/* Government Partners Section */}
            <section className="h-auto bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center px-4 sm:px-6 md:px-12 lg:px-16 py-10">
                <div className="max-w-7xl w-full text-center relative z-10">
                    {/* Heading */}
                    <div className="space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
                            Government{" "}
                            <span className="text-blue-700">Partners</span>
                        </h2>
                        <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded mx-auto" />
                    </div>

                    {/* Partner Logos */}
                    <div className="my-10">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                            {[...Array(12)].map((_, i) => (
                                <div
                                    key={i}
                                    className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg flex items-center justify-center h-20 transition-shadow">
                                    <img
                                        src={`/images/govlogo/${i + 1}.svg`}
                                        alt={`Government Partner ${i + 1}`}
                                        className="max-h-12 max-w-full object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    {/* <div className="pt-10">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              View All Government Partners
            </Button>
          </div> */}
                </div>
            </section>

            {/* Why Choose Resonance Section */}
            <section className="h-auto bg-gradient-to-br from-blue-50 via-white to-blue-100 flex justify-center px-4 sm:px-6 md:px-12 lg:px-16 py-10 lg:py-20">
                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    {/* Text Content */}
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
                                Why Choose{" "}
                                <span className="text-blue-700">Resonance</span>
                            </h2>
                            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded" />
                            <p className="text-base sm:text-lg md:text-xl text-blue-700 font-medium leading-relaxed">
                                Dynamic team of young professionals connected
                                with the grassroot level in all cross sections
                                of the society. Created impact in socio-economic
                                upliftment through employable skills training,
                                job facilitation & wealth-creating
                                entrepreneurship trainings.
                            </p>
                        </div>

                        {/* Certifications */}
                        <div className="space-y-3">
                            <h3 className="text-lg sm:text-xl font-bold text-blue-800">
                                Influential Trainers Certified by:
                            </h3>
                            <ul className="text-sm sm:text-base text-gray-700 list-disc list-inside space-y-1">
                                <li>
                                    Ministry of Entrepreneurship & Skill
                                    Development
                                </li>
                                <li>
                                    Center for Innovation & AICTE, Ministry of
                                    Education, GOI
                                </li>
                                <li>Department of Science & Technology, GOI</li>
                                <li>
                                    National Institute of Entrepreneurship &
                                    Small Business Development, MSME
                                </li>
                                <li>
                                    Entrepreneurship Development Institute of
                                    India, EDII
                                </li>
                                <li>
                                    International Finance Corporation, World
                                    Bank Group
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Image Section */}
                    <div className="relative">
                        <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1734519654307-ceb306e4073a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                alt="Team collaboration"
                                className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-xl"
                            />
                            {/* Decorative Circles */}
                            <div className="absolute top-4 left-4 w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white rounded-full"></div>
                            </div>
                            <div className="absolute bottom-4 right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-20"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Founder & MD Section */}
            <section className="h-auto bg-gradient-to-br from-orange-50 via-white to-orange-100 flex justify-center px-4 sm:px-6 md:px-12 lg:px-16 py-12 lg:py-20">
                <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    {/* Image */}
                    <div className="relative">
                        <div className="bg-gradient-to-br from-blue-100 to-orange-100 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
                            <img
                                src="\images\founder\found23.png"
                                alt="Vivek Somnath Sinare - Founder & MD"
                                className="w-full h-72 sm:h-80 md:h-92 object-cover rounded-xl"
                            />
                            {/* Decorative Elements */}
                            <div className="absolute top-4 right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-20" />
                            <div className="absolute bottom-4 left-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20" />
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-900 leading-tight">
                                Founder &{" "}
                                <span className="text-orange-600">MD</span>
                            </h2>

                            <h3 className="text-xl sm:text-2xl font-bold text-blue-800">
                                Vivek Somnath Sinare
                            </h3>

                            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded" />

                            <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                                A seasoned socio-economic development leader
                                with 20+ years of expertise in entrepreneurship
                                training and large-scale skill development
                                across India. A Gold Medalist and certified
                                trainer by the IFC, World Bank, and NIESBUD,
                                Vivek has empowered over 25,000 youth through
                                industry-integrated programs. He has held
                                national leadership roles in premier skilling
                                institutions and is a passionate advocate for
                                "Viksit Bharat," delivering impactful sessions
                                at top universities nationwide.
                            </p>
                        </div>

                        {/* Tags */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="bg-blue-600 text-white px-3 py-2 rounded-full text-sm text-center font-semibold flex items-center justify-center space-x-2">
                                <Eye className="w-4 h-4" />
                                <span>Visionary</span>
                            </div>
                            <div className="bg-blue-600 text-white px-3 py-2 rounded-full text-sm text-center font-semibold flex items-center justify-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>Mentor</span>
                            </div>
                            <div className="bg-blue-600 text-white px-3 py-2 rounded-full text-sm text-center font-semibold flex items-center justify-center space-x-2">
                                <Award className="w-4 h-4" />
                                <span>Awarded</span>
                            </div>
                            <div className="bg-blue-600 text-white px-3 py-2 rounded-full text-sm text-center font-semibold flex items-center justify-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span>Author</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet Our Best Advisory Section */}
            <section className="h-auto bg-gradient-to-br from-gray-50 via-white to-gray-100 flex justify-center px-4 sm:px-6 md:px-12 lg:px-16 py-12 lg:py-20">
                <div className="max-w-6xl w-full text-center relative z-10 space-y-12">
                    {/* Section Heading */}
                    <div className="space-y-4">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 leading-tight">
                            Meet Our Best{" "}
                            <span className="text-blue-700">Advisory</span>
                        </h2>
                        <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded mx-auto"></div>
                    </div>

                    {/* Advisory Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {advisors.map((advisor, i) => (
                            <div
                                key={advisor.id || i}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-left">
                                <img
                                    src={advisor.img}
                                    alt={advisor.name}
                                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                                    onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = "/images/advisers/1.svg";
                                    }}
                                />
                                <h3 className="text-lg font-bold text-blue-900 mb-2 text-center">
                                    {advisor.name}
                                </h3>
                                <p className="text-sm text-gray-600 text-justify">
                                    {advisor.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meet Our Team Section (Modular Display) */}
            {settings.showTeamOnHome && <TeamSection />}

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Index;
