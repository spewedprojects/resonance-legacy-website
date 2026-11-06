import React, { useState } from "react";
import {
    getStoredContact,
    saveStoredContact,
    getStoredAdvisors,
    saveStoredAdvisors,
    getStoredTeam,
    saveStoredTeam,
    resetAllSiteData,
    ContactInfo,
} from "@/lib/siteData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Building,
    Save,
    RotateCcw,
    Download,
    Upload,
    CheckCircle2,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";

const ManageContact: React.FC = () => {
    const [contact, setContact] = useState<ContactInfo>(getStoredContact);

    const handleChange = (field: keyof ContactInfo, value: string) => {
        setContact((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        saveStoredContact(contact);
        toast.success("Contact information saved successfully! All pages updated.");
    };

    const handleReset = () => {
        if (
            window.confirm(
                "Are you sure you want to reset all site data (Team, Advisory, and Contact) back to the original defaults?",
            )
        ) {
            resetAllSiteData();
            setContact(getStoredContact());
            toast.success("All site data has been reset to defaults");
        }
    };

    const handleExportBackup = () => {
        const fullBackup = {
            exportDate: new Date().toISOString(),
            contact: getStoredContact(),
            team: getStoredTeam(),
            advisors: getStoredAdvisors(),
        };

        const blob = new Blob([JSON.stringify(fullBackup, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `resonance-site-data-backup-${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("Site data exported to JSON file");
    };

    const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result as string);
                if (parsed.contact) saveStoredContact(parsed.contact);
                if (parsed.team && Array.isArray(parsed.team)) saveStoredTeam(parsed.team);
                if (parsed.advisors && Array.isArray(parsed.advisors)) saveStoredAdvisors(parsed.advisors);

                setContact(getStoredContact());
                toast.success("Backup imported successfully! Data updated.");
            } catch (err) {
                console.error(err);
                toast.error("Invalid JSON backup file");
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-900 tracking-tight flex items-center gap-3">
                        <Phone className="w-8 h-8 text-blue-600" />
                        Website & Contact Details
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Modify phone numbers, email addresses, office locations, and hours across the entire website.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleExportBackup}
                        className="rounded-xl flex items-center gap-1.5 text-xs text-slate-700">
                        <Download className="w-4 h-4" />
                        Export Backup
                    </Button>
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-input hover:bg-slate-50 rounded-xl transition-colors">
                        <Upload className="w-4 h-4" />
                        Import Backup
                        <input
                            id="import-backup-file"
                            name="importBackupFile"
                            type="file"
                            accept=".json"
                            onChange={handleImportBackup}
                            className="hidden"
                        />
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form (2 cols) */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSave}>
                        <Card className="bg-white rounded-2xl border-slate-100 shadow-sm">
                            <CardHeader className="border-b border-slate-100">
                                <CardTitle className="text-lg text-blue-900">
                                    General & Contact Information
                                </CardTitle>
                                <CardDescription>
                                    Updates take effect instantly in the Footer, Contact Page, and About sections.
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-6 space-y-5">
                                {/* Company Legal Name */}
                                <div>
                                    <Label htmlFor="companyName" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                        <Building className="w-4 h-4 text-blue-600" />
                                        Company Name
                                    </Label>
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        value={contact.companyName}
                                        onChange={(e) => handleChange("companyName", e.target.value)}
                                        className="mt-1"
                                        placeholder="Company full name"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Phone Number */}
                                    <div>
                                        <Label htmlFor="phone" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-blue-600" />
                                            Primary Phone Number
                                        </Label>
                                        <Input
                                            id="phone" name="phone" type="tel" autoComplete="tel"
                                            value={contact.phone}
                                            onChange={(e) => handleChange("phone", e.target.value)}
                                            className="mt-1"
                                            placeholder="+91 63668 24350"
                                        />
                                    </div>

                                    {/* Office / City Address */}
                                    <div>
                                        <Label htmlFor="address" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-orange-500" />
                                            Location / City
                                        </Label>
                                        <Input
                                            id="address" name="address" autoComplete="street-address"
                                            value={contact.address}
                                            onChange={(e) => handleChange("address", e.target.value)}
                                            className="mt-1"
                                            placeholder="Pune, India"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Email */}
                                    <div>
                                        <Label htmlFor="email" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-green-600" />
                                            Primary / Inquiries Email
                                        </Label>
                                        <Input
                                            id="email" name="email" autoComplete="email"
                                            type="email"
                                            value={contact.email}
                                            onChange={(e) => handleChange("email", e.target.value)}
                                            className="mt-1"
                                            placeholder="apply.theresonance@gmail.com"
                                        />
                                    </div>

                                    {/* Support Email */}
                                    <div>
                                        <Label htmlFor="supportEmail" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-orange-500" />
                                            Support Email
                                        </Label>
                                        <Input
                                            id="supportEmail" name="supportEmail" autoComplete="email"
                                            type="email"
                                            value={contact.supportEmail}
                                            onChange={(e) => handleChange("supportEmail", e.target.value)}
                                            className="mt-1"
                                            placeholder="support.theresonance@gmail.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Office Hours */}
                                    <div>
                                        <Label htmlFor="officeHours" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                            Office Hours
                                        </Label>
                                        <Input
                                            id="officeHours" name="officeHours"
                                            value={contact.officeHours}
                                            onChange={(e) => handleChange("officeHours", e.target.value)}
                                            className="mt-1"
                                            placeholder="Mon – Fri, 9:30 AM to 6:30 PM IST"
                                        />
                                    </div>

                                    {/* Response Slogan */}
                                    <div>
                                        <Label htmlFor="responseSlogan" className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-yellow-500" />
                                            Response Promise
                                        </Label>
                                        <Input
                                            id="responseSlogan" name="responseSlogan"
                                            value={contact.responseSlogan}
                                            onChange={(e) => handleChange("responseSlogan", e.target.value)}
                                            className="mt-1"
                                            placeholder="We aim to respond within 1 business day."
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={handleReset}
                                        className="text-xs text-red-600 hover:bg-red-50 hover:text-red-700 flex items-center gap-1.5">
                                        <RotateCcw className="w-3.5 h-3.5" />
                                        Reset All to Defaults
                                    </Button>

                                    <Button
                                        type="submit"
                                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-md flex items-center gap-2">
                                        <Save className="w-4 h-4" />
                                        Save All Changes
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>

                {/* Live Preview Column */}
                <div className="space-y-6">
                    {/* Live Footer Preview */}
                    <Card className="bg-slate-900 text-white rounded-2xl border-slate-800 shadow-sm overflow-hidden">
                        <CardHeader className="bg-slate-800/60 p-4 border-b border-slate-800">
                            <CardTitle className="text-sm font-semibold text-orange-400 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                Footer Live Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4 text-xs">
                            <div>
                                <h4 className="font-bold text-white text-sm mb-1">
                                    RESONANCE
                                </h4>
                                <p className="text-slate-400 text-[11px] leading-relaxed">
                                    {contact.companyName}
                                </p>
                            </div>

                            <div className="space-y-2.5 pt-2 border-t border-slate-800 text-slate-300">
                                <div className="flex items-center gap-2.5">
                                    <Mail className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                                    <span className="truncate">{contact.email}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                                    <span>{contact.phone}</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                                    <span>{contact.address}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Page Box Preview */}
                    <Card className="bg-gradient-to-br from-blue-50 to-white rounded-2xl border-blue-100 shadow-sm overflow-hidden">
                        <CardHeader className="bg-blue-100/50 p-4 border-b border-blue-100">
                            <CardTitle className="text-sm font-semibold text-blue-900 flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-600" />
                                Contact Page Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 space-y-3 text-xs">
                            <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-sm flex items-center gap-3">
                                <div className="p-2 bg-blue-600 rounded-lg text-white">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-bold text-blue-950 text-xs">Call Us</div>
                                    <div className="text-gray-600 text-[11px]">{contact.phone}</div>
                                </div>
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-sm flex items-center gap-3">
                                <div className="p-2 bg-green-600 rounded-lg text-white">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-bold text-blue-950 text-xs">Email</div>
                                    <div className="text-gray-600 text-[11px]">{contact.email}</div>
                                </div>
                            </div>

                            <div className="p-3 bg-white rounded-xl border border-blue-100 shadow-sm flex items-center gap-3">
                                <div className="p-2 bg-orange-600 rounded-lg text-white">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <div>
                                    <div className="font-bold text-blue-950 text-xs">Support</div>
                                    <div className="text-gray-600 text-[11px]">{contact.supportEmail}</div>
                                </div>
                            </div>

                            <div className="pt-2 text-[11px] text-gray-500">
                                <strong>Hours:</strong> {contact.officeHours}
                                <br />
                                <em>{contact.responseSlogan}</em>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ManageContact;
