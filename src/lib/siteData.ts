import { useState, useEffect } from "react";

export interface Advisor {
    id: string;
    name: string;
    desc: string;
    img: string;
}

export interface TeamMember {
    id: string;
    name: string;
    position: string;
    img: string | null;
    contact?: string | null;
    email?: string | null;
}

export interface ContactInfo {
    phone: string;
    email: string;
    supportEmail: string;
    address: string;
    officeHours: string;
    responseSlogan: string;
    companyName: string;
}

export const DEFAULT_ADVISORS: Advisor[] = [
    {
        id: "adv-1",
        name: "DR. MILIND KAMBLE",
        img: "/images/advisers/7.svg",
        desc: "Leading entrepreneur and visionary strategist pioneering transformative entrepreneurial landscape through inclusive growth and MSCI leadership.",
    },
    {
        id: "adv-2",
        name: "ATUL KULKARNI",
        img: "/images/advisers/3.svg",
        desc: "Techno-managerial expert with 35+ years in rural credit, banking and policy, specializing in supply chain and global markets.",
    },
    {
        id: "adv-3",
        name: "VAIBHAV DANGE",
        img: "/images/advisers/1.svg",
        desc: "Change agent with expertise in government CSR, sustainable development, and strategic planning.",
    },
    {
        id: "adv-4",
        name: "RITA SEN GUPTA",
        img: "/images/advisers/2.svg",
        desc: "Former HR-CEO renowned expert in skill development and experience training 1500 professionals in entrepreneurship.",
    },
    {
        id: "adv-5",
        name: "SUMITRA GOENKA",
        img: "/images/advisers/6.svg",
        desc: "Entrepreneur, Director & CEO managing Storage & Logistics, UiImg Pvt Ltd, and more. Growth architect & NSE listed company.",
    },
    {
        id: "adv-6",
        name: "RAJENDRA BAGADE",
        img: "/images/advisers/4.svg",
        desc: "Senior Chartered Accountant with expertise in MNCs, PSUs, FPOs, and FPCs across diverse industries.",
    },
    {
        id: "adv-7",
        name: "SAARA A TOMAR",
        img: "/images/advisers/8.svg",
        desc: "Startup mentor and edtech founder with 20+ years in sales, marketing, and strategic planning.",
    },
    {
        id: "adv-8",
        name: "NARENDRA GODSE",
        img: "/images/advisers/5.svg",
        desc: "Startup mentor and public sector advisor with 20+ years in sales, marketing, and strategy.",
    },
];

export const DEFAULT_TEAM: TeamMember[] = [
    {
        id: "team-1",
        name: "Vivek Sinare",
        position: "Managing Director",
        img: null,
        contact: "8766825520",
        email: "viveksinare@theresonance.co.in",
    },
    {
        id: "team-2",
        name: "Imran Bagwan",
        position: "Manager - Compliance",
        img: "/team/Imran.JPG",
        contact: "7030910333",
        email: "imran@theresonance.co.in",
    },
    {
        id: "team-3",
        name: "Arundhati Katdare",
        position: "HEAD - HR Operations and L&D",
        img: "/team/Arundhati.JPG",
        contact: "9850742620",
        email: "arundhati@theresonance.co.in",
    },
    {
        id: "team-4",
        name: "Kirti Katti",
        position: "Assistant Manager - Talent Acquisition & Compliance",
        img: "/team/Kirti.JPG",
        contact: "7758979161",
        email: "kirti@theresonance.co.in",
    },
    {
        id: "team-5",
        name: "Vishakha Patil",
        position: "Assistant Manager - Client Relations & Business Development",
        img: "/team/Vishakha.JPG",
        contact: "7758979167",
        email: "vishakha@theresonance.co.in",
    },
    {
        id: "team-6",
        name: "Chaitrali Badan",
        position: "Chief Manager - HR Operations & Data Analytics",
        img: null,
        contact: "9890625021",
        email: "chaitrali@theresonance.co.in",
    },
    {
        id: "team-7",
        name: "Pratima Singh",
        position: "Chief Manager - MMR",
        img: null,
        contact: "8108129569",
        email: "pratima@theresonance.co.in",
    },
    {
        id: "team-8",
        name: "Vijeta Sharma",
        position: "Manager - Talent Acquisition Officer",
        img: null,
        contact: "9665196719",
        email: "vijeta@theresonance.co.in",
    },
    {
        id: "team-9",
        name: "Shreya Pimperkar",
        position: "Assistant Manager - Talent Acquisition",
        img: null,
        contact: "9156691613",
        email: "shreya.theresonance@gmail.com",
    },
    {
        id: "team-10",
        name: "Manasi Abhyankar",
        position: "Team Associate",
        img: null,
        contact: "7709008581",
        email: null,
    },
    {
        id: "team-11",
        name: "Shrushti Naik",
        position: "Talent Acquisition - Interns",
        img: null,
        contact: "7758906191",
        email: "shrushti.theresonance@gmail.com",
    },
    {
        id: "team-12",
        name: "Sejal Mirajkar",
        position: "Talent Acquisition - Interns",
        img: null,
        contact: "7758979163",
        email: "sejal.resonance@gmail.com",
    },
    {
        id: "team-13",
        name: "Priynka Mule",
        position: "Assistant Manager - Talent Acquisition",
        img: null,
        contact: "8655940092",
        email: "priya.theresonance@gmail.com",
    },
];

export const DEFAULT_CONTACT: ContactInfo = {
    phone: "+91 63668 24350",
    email: "apply.theresonance@gmail.com",
    supportEmail: "apply.theresonance@gmail.com",
    address: "Pune, India",
    officeHours: "Mon – Fri, 9:30 AM to 6:30 PM IST",
    responseSlogan: "We aim to respond within 1 business day.",
    companyName: "Resonance Entrepreneurship & Employability Solutions Pvt. Ltd.",
};

const STORAGE_KEYS = {
    ADVISORS: "resonance_advisors_data",
    TEAM: "resonance_team_data",
    CONTACT: "resonance_contact_data",
};

// Dispatch custom event to notify all components in the current tab
const notifyDataChange = (key: string) => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("siteDataUpdated", { detail: { key } }));
    }
};

export const getStoredAdvisors = (): Advisor[] => {
    if (typeof window === "undefined") return DEFAULT_ADVISORS;
    try {
        const data = localStorage.getItem(STORAGE_KEYS.ADVISORS);
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.error("Error reading advisors from localStorage", e);
    }
    return DEFAULT_ADVISORS;
};

export const saveStoredAdvisors = (advisors: Advisor[]) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEYS.ADVISORS, JSON.stringify(advisors));
        notifyDataChange(STORAGE_KEYS.ADVISORS);
    } catch (e) {
        console.error("Error saving advisors to localStorage", e);
    }
};

export const getStoredTeam = (): TeamMember[] => {
    if (typeof window === "undefined") return DEFAULT_TEAM;
    try {
        const data = localStorage.getItem(STORAGE_KEYS.TEAM);
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.error("Error reading team from localStorage", e);
    }
    return DEFAULT_TEAM;
};

export const saveStoredTeam = (team: TeamMember[]) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEYS.TEAM, JSON.stringify(team));
        notifyDataChange(STORAGE_KEYS.TEAM);
    } catch (e) {
        console.error("Error saving team to localStorage", e);
    }
};

export const getStoredContact = (): ContactInfo => {
    if (typeof window === "undefined") return DEFAULT_CONTACT;
    try {
        const data = localStorage.getItem(STORAGE_KEYS.CONTACT);
        if (data) {
            const parsed = JSON.parse(data);
            if (parsed && typeof parsed === "object") return { ...DEFAULT_CONTACT, ...parsed };
        }
    } catch (e) {
        console.error("Error reading contact from localStorage", e);
    }
    return DEFAULT_CONTACT;
};

export const saveStoredContact = (contact: ContactInfo) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEYS.CONTACT, JSON.stringify(contact));
        notifyDataChange(STORAGE_KEYS.CONTACT);
    } catch (e) {
        console.error("Error saving contact to localStorage", e);
    }
};

export const resetAllSiteData = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.ADVISORS);
    localStorage.removeItem(STORAGE_KEYS.TEAM);
    localStorage.removeItem(STORAGE_KEYS.CONTACT);
    notifyDataChange("all");
};

// React Hooks
export const useSiteAdvisors = () => {
    const [advisors, setAdvisors] = useState<Advisor[]>(getStoredAdvisors);

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (!customEvent.detail || customEvent.detail.key === STORAGE_KEYS.ADVISORS || customEvent.detail.key === "all") {
                setAdvisors(getStoredAdvisors());
            }
        };
        window.addEventListener("siteDataUpdated", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("siteDataUpdated", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    return advisors;
};

export const useSiteTeam = () => {
    const [team, setTeam] = useState<TeamMember[]>(getStoredTeam);

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (!customEvent.detail || customEvent.detail.key === STORAGE_KEYS.TEAM || customEvent.detail.key === "all") {
                setTeam(getStoredTeam());
            }
        };
        window.addEventListener("siteDataUpdated", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("siteDataUpdated", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    return team;
};

export const useSiteContact = () => {
    const [contact, setContact] = useState<ContactInfo>(getStoredContact);

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (!customEvent.detail || customEvent.detail.key === STORAGE_KEYS.CONTACT || customEvent.detail.key === "all") {
                setContact(getStoredContact());
            }
        };
        window.addEventListener("siteDataUpdated", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("siteDataUpdated", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    return contact;
};

// Helper function to resize and compress uploaded image files to base64 Data URLs
export const processImageFile = (file: File, maxWidth = 500, quality = 0.85): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    resolve(event.target?.result as string);
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
                // Return compressed webp or jpeg Data URL
                const dataUrl = canvas.toDataURL("image/jpeg", quality);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};
