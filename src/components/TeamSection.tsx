import React from "react";
import { Users, Mail, Phone, History } from "lucide-react";
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
    const activeMembers = team.filter((m) => !m.isFormer);
    const formerMembers = team.filter((m) => m.isFormer);

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

                {/* Active Team Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {activeMembers.map((member, i) => (
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

                {/* Former Members / Past Contributors Section (Greyed out at the bottom) */}
                {formerMembers.length > 0 && (
                    <div className="pt-12 border-t border-blue-200/60 space-y-8">
                        <div className="space-y-2 text-center">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200/70 text-slate-700 text-xs font-semibold rounded-full uppercase tracking-wider">
                                <History className="w-3.5 h-3.5 text-slate-500" />
                                Past Contributors & Alumni
                            </div>
                            <h3 className="text-2xl font-bold text-slate-700">
                                Former Team Members
                            </h3>
                            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
                                Acknowledging past team members who contributed to our journey and are no longer part of the organization.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {formerMembers.map((member, i) => (
                                <div
                                    key={member.id || i}
                                    className="bg-slate-50/80 rounded-2xl p-6 border border-dashed border-slate-300 shadow-sm opacity-75 hover:opacity-100 transition-all text-center flex flex-col items-center group">
                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full mb-3 uppercase tracking-wider">
                                        Former Member
                                    </span>

                                    <div className="w-20 h-20 rounded-full mb-3 overflow-hidden bg-slate-200 flex items-center justify-center border-2 border-slate-300 shadow-inner grayscale group-hover:grayscale-0 transition-all duration-300">
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
                                            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                                <Users className="w-8 h-8 text-slate-400" />
                                            </div>
                                        )}
                                    </div>

                                    <h4 className="text-base font-bold text-slate-700 mb-1">
                                        {member.name}
                                    </h4>
                                    <p className="text-xs font-medium text-slate-500 mb-4 leading-tight min-h-[2.5rem] flex items-center justify-center">
                                        {member.position}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default TeamSection;
