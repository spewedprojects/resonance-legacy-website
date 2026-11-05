import { Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "../components/ui/button";
import { useSiteContact } from "@/lib/siteData";

const Contact = () => {
    const contact = useSiteContact();
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<null | "success" | "error">(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const validate = () => {
        if (!form.name.trim() || !form.email.trim() || !form.message.trim())
            return false;
        if (!/\S+@\S+\.\S+/.test(form.email)) return false;
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            setStatus("error");
            return;
        }

        setSubmitting(true);
        setStatus(null);

        try {
            const res = await fetch("/.netlify/functions/submit-enquiry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                setStatus("success");
                setForm({ name: "", email: "", phone: "", message: "" });
            } else {
                setStatus("error");
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            setStatus("error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden">
            <Navbar />

            {/* Decorative background like index */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-24 left-10 w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full opacity-10 blur-3xl" />
                <div className="absolute bottom-32 right-14 w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full opacity-15" />
                <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-10" />
            </div>

            {/* Hero */}
            <section className="pt-32 pb-8 text-center relative z-10">
                <div className="max-w-3xl mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#2E5C9D] mb-2">
                        Let's Connect
                    </h1>
                    <p className="text-lg text-gray-700">
                        Whether you’re looking to partner, enquire, or
                        collaborate — drop us a message and we’ll get back to
                        you.
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-16 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                {/* Info Panel */}
                <div className="flex flex-col justify-center space-y-8">
                    <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-6">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                                <Phone className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[#2E5C9D]">
                                    Call Us
                                </h3>
                                <p className="text-gray-700">{contact.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[#2E5C9D]">
                                    Email
                                </h3>
                                <p className="text-gray-700">
                                    {contact.email}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl">
                                <Mail className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-[#2E5C9D]">
                                    Support
                                </h3>
                                <p className="text-gray-700">
                                    {contact.supportEmail}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-gray-600">
                        <p className="mb-1">
                            <strong>Office Hours:</strong> {contact.officeHours}
                        </p>
                        <p>{contact.responseSlogan}</p>
                    </div>
                </div>

                {/* Form */}
                <div>
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-10">
                        <h2 className="text-2xl font-bold text-[#2E5C9D] mb-4">
                            Send a Message
                        </h2>

                        {status === "success" && (
                            <div className="mb-4 px-4 py-3 rounded-lg bg-green-100 text-green-800">
                                Thanks! Your message has been sent.
                            </div>
                        )}
                        {status === "error" && (
                            <div className="mb-4 px-4 py-3 rounded-lg bg-red-100 text-red-800">
                                Please complete all required fields correctly.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 mb-1">
                                        Name *
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        required
                                        className="w-full rounded-xl border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 mb-1">
                                        Email *
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        required
                                        className="w-full rounded-xl border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="phone"
                                    className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>
                                <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+91 63668 24350"
                                    className="w-full rounded-xl border border-border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium text-gray-700 mb-1">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="How can we help you?"
                                    required
                                    rows={5}
                                    className="w-full rounded-xl border border-border px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="rounded-full px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow hover:scale-105 transition">
                                    {submitting ? "Sending..." : "Send Message"}
                                </Button>
                                <span className="text-sm text-gray-500">
                                    * Required fields
                                </span>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Footer Spacer */}

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Contact;
