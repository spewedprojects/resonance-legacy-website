import React from "react";
import { Users, Mail, Phone } from "lucide-react";
import { useSiteTeam } from "@/lib/siteData";

interface TeamSectionProps {
    className?: string;
    bgClassName?: string;
    title?: string;
    highlightWord?: string;
    subtitle?: string;
}

const TeamSection: React.FC<TeamSectionProps> = ({
    className = "",
    bgClassName = "bg-gradient-to-br from-blue-50 via-white to-blue-100",
    title = "Meet Our",
    highlightWord = "Team",
    subtitle = "The passionate leadership and professionals powering the Resonance mission.",
}) => {
    const team = useSiteTeam();

    return (
        <section
            className={`h-auto flex justify-center px-4 sm:px-6 md:px-12 lg:px-16 py-12 lg:py-20 ${bgClassName} ${className}`}>
            <div className="max-w-6xl w-full text-center relative z-10 space-y-12">
                {/* Section Heading */}
                <div className="space-y-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 leading-tight">
                        {title} <span className="text-blue-700">{highlightWord}</span>
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded mx-auto" />
                    {subtitle && (
                        <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Team Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {team.map((member, i) => (
                        <div
                            key={member.id || i}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full mb-4 overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-blue-100 shadow-inner">
                                {member.img ? (
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.currentTarget as HTMLImageElement).src =
                                                "/media/resonanceLogoNav.png";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white flex items-center justify-center">
                                        <Users className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-lg font-bold text-blue-900 mb-1">
                                {member.name}
                            </h3>
                            <p className="text-sm font-semibold text-blue-700 mb-4 leading-tight min-h-[3rem] flex items-center justify-center">
                                {member.position}
                            </p>
                            <div className="w-full space-y-2 pt-4 border-t border-gray-100 mt-auto">
                                {member.email && (
                                    <div className="flex items-center justify-center space-x-2 text-[10px] sm:text-xs text-gray-600">
                                        <Mail className="w-3 h-3 text-orange-500 shrink-0" />
                                        <span className="truncate">{member.email}</span>
                                    </div>
                                )}
                                {member.contact && (
                                    <div className="flex items-center justify-center space-x-2 text-[10px] sm:text-xs text-gray-600">
                                        <Phone className="w-3 h-3 text-blue-500 shrink-0" />
                                        <span>{member.contact}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
