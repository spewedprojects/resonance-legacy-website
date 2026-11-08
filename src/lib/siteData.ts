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
    isFormer?: boolean;
    formerNote?: string | null;
}

export interface VisitorStats {
    uniqueVisitors: number;
    totalHits: number;
    todayHits: number;
    lastHitAt: string;
}

export interface DeviceSession {
    id: string;
    deviceName: string;
    browser: string;
    os: string;
    ip: string;
    loginTime: string;
    lastActive: string;
    isCurrent: boolean;
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

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    color: string;
}

export interface Program {
    id: string;
    title: string;
    code: string;
    description: string;
    icon: string;
    gradient: string;
}

export interface BlogPost {
    _id: string;
    title: string;
    subtitle: string;
    slug: string;
    content: string;
    excerpt: string;
    author: string;
    image: string;
    tags: string[];
    createdAt: string;
}

export interface Enquiry {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt: string;
    status: "new" | "read" | "replied";
}

export interface Album {
    id: string;
    title: string;
    description: string;
    date: string;
    coverImage: string;
    images: string[];
    location?: string;
}

export interface SiteSettings {
    showTeamOnHome: boolean;
    showTeamOnAbout: boolean;
}

export interface EventPartner {
    id: string;
    name?: string;
    category?: string;
    logo?: string;
    websiteUrl?: string;
}

export interface EventPartnerSection {
    id: string;
    title: string;
    subtitle?: string;
    gridColumns?: 2 | 3 | 4 | 5;
    partners: EventPartner[];
}

export interface EventPerson {
    id: string;
    name?: string;
    company?: string;
    designation?: string;
    photo?: string;
}

export interface EventPeopleSection {
    id: string;
    title: string;
    subtitle?: string;
    members: EventPerson[];
}

export interface EventAgendaItem {
    id: string;
    time?: string;
    durationMinutes?: number;
    title: string;
    speaker?: string;
    description?: string;
}

export interface ResonanceEvent {
    id: string;
    slug?: string;
    title: string;
    subtitle?: string;
    purpose?: string;
    description: string;
    bannerImage: string;
    date: string;
    startTime?: string;
    endTime?: string;
    time?: string;
    venue?: string;
    category?: string;
    status: "upcoming" | "ongoing" | "completed";
    registrationSnippet?: string;
    registrationUrl?: string;
    buttonStyle?: "gradient" | "navy" | "glow" | "classic";
    partnerGridColumns?: 2 | 3 | 4 | 5;
    partners?: EventPartner[];
    partnerSections?: EventPartnerSection[];
    peopleSections?: EventPeopleSection[];
    agenda?: EventAgendaItem[];
}

export interface EventsConfig {
    portalUrl: string;
    openDirectUrl: boolean;
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

export const DEFAULT_PROGRAMS: Program[] = [
    {
        id: "prog-1",
        title: "National Apprenticeship Training Scheme",
        code: "NATS",
        description:
            "A premier government-backed skill-development initiative providing technically qualified graduates and diploma holders with structured, on-the-job training in recognized industrial establishments.",
        icon: "GraduationCap",
        gradient: "from-blue-500 to-blue-600",
    },
    {
        id: "prog-2",
        title: "National Apprenticeship Promotion Scheme",
        code: "NAPS",
        description:
            "Incentivizes businesses to engage apprentices by providing financial stipends, policy support, and simplified compliance, creating a strong talent pipeline across key sectors.",
        icon: "TrendingUp",
        gradient: "from-orange-500 to-orange-600",
    },
    {
        id: "prog-3",
        title: "Apprenticeship Embedded Degree Program",
        code: "AEDP",
        description:
            "Integrates accredited university degree curricula directly with corporate apprenticeship assignments, allowing students to earn stipends while acquiring workplace-ready domain skills.",
        icon: "Award",
        gradient: "from-green-500 to-green-600",
    },
    {
        id: "prog-4",
        title: "Work Integrated Skills Training & Apprenticeships",
        code: "WISTA",
        description:
            "Tailor-made corporate capacity building models connecting fresh academic talent with specialized enterprise technologies, fast-tracking employability and organizational onboarding.",
        icon: "Building",
        gradient: "from-purple-500 to-purple-600",
    },
];

export const DEFAULT_SERVICES: Service[] = [
    {
        id: "serv-1",
        title: "Skilled Workforce Sourcing & Onboarding",
        description:
            "We help organisations identify, source and onboard skilled and experienced professionals to meet their workforce requirements. Our support covers candidate sourcing, screening, coordination, offer management and induction to ensure a smooth hiring process.",
        icon: "Users",
        color: "from-blue-500 to-blue-600",
    },
    {
        id: "serv-2",
        title: "Customize Skill Development Program",
        description:
            "We design and facilitate customised skill development programmes based on organisational requirements and identified competency gaps. Our services include training needs assessment, module development, training calendars, programme delivery and effectiveness assessment.",
        icon: "Code",
        color: "from-orange-500 to-orange-600",
    },
    {
        id: "serv-3",
        title: "Campus Entrepreneurship Program",
        description:
            "We work with educational institutions to nurture entrepreneurial thinking and develop an enterprising mindset among students. Through structured learning, practical exposure and industry engagement, we help students explore entrepreneurship and develop the skills to turn ideas into viable ventures.",
        icon: "GraduationCap",
        color: "from-green-500 to-green-600",
    },
    {
        id: "serv-4",
        title: "Startup Mentoring & Fundraising",
        description:
            "We support emerging startups in navigating their early stages through business mentoring, strategic guidance and fundraising assistance. Our focus is on helping entrepreneurs strengthen their business models, explore funding opportunities and build sustainable ventures.",
        icon: "Rocket",
        color: "from-purple-500 to-purple-600",
    },
    {
        id: "serv-5",
        title: "Incubation Support & Handholding",
        description:
            "We provide structured support to aspiring entrepreneurs and early-stage ventures through incubation assistance, business development guidance and access to relevant resources and networks. We help translate ideas into actionable plans and support ventures through their growth journey.",
        icon: "HandHeart",
        color: "from-red-500 to-red-600",
    },
    {
        id: "serv-6",
        title: "CSR Project Implementation",
        description:
            "We support organisations in planning, coordinating and implementing CSR initiatives aligned with their social impact objectives. Our approach focuses on programme execution, stakeholder coordination, monitoring and documentation to facilitate effective implementation.",
        icon: "FileText",
        color: "from-indigo-500 to-indigo-600",
    },
];

export const DEFAULT_BLOGS: BlogPost[] = [
    {
        _id: "blog-1",
        title: "The Future of Apprenticeships in Modern Industry",
        subtitle: "How integrated work-learning models are transforming talent pipelines in 2026",
        slug: "future-of-apprenticeships-modern-industry",
        content: `
            <p>Apprenticeships are rapidly evolving beyond traditional manufacturing setups into high-tech domains like IT, supply chain analytics, and healthcare services.</p>
            <h3>Why Work-Integrated Learning Matters</h3>
            <p>Industry leaders cite the widening skills gap as one of their primary operational hurdles. By incorporating apprenticeship models such as NATS and NAPS, companies directly train candidates on their technology stack.</p>
            <ul>
                <li><strong>Reduced Onboarding Time:</strong> Graduates are already familiar with company tools and culture.</li>
                <li><strong>Government Incentives:</strong> Financial support and structured compliance under national skill initiatives.</li>
                <li><strong>Higher Retention Rates:</strong> Apprentices show 35% higher 3-year retention compared to walk-in hires.</li>
            </ul>
            <p>As India continues its transformation into a global manufacturing and knowledge powerhouse, work-integrated education will remain at the forefront.</p>
        `,
        excerpt:
            "Discover how integrated work-learning models like NATS and NAPS are bridging the talent gap and accelerating corporate productivity.",
        author: "Resonance Team",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
        tags: ["Apprenticeship", "Skill Development", "Industry"],
        createdAt: "2026-02-15T10:00:00.000Z",
    },
    {
        _id: "blog-2",
        title: "Empowering Rural Entrepreneurs Through Targeted Mentorship",
        subtitle: "Unlocking grassroot innovation with strategic advisory and venture support",
        slug: "empowering-rural-entrepreneurs-mentorship",
        content: `
            <p>Grassroots innovation is thriving across Tier 2 and Tier 3 regions in India. With the right strategic guidance, local ventures can scale into sustainable, high-revenue enterprises.</p>
            <h3>Core Pillars of Venture Incubation</h3>
            <p>Resonance focuses on three fundamental pillars when mentoring early-stage founders:</p>
            <ol>
                <li><strong>Financial Literacy & Credit Access:</strong> Connecting founders with formal banking channels and MSME schemes.</li>
                <li><strong>Supply Chain Integration:</strong> Linking regional producers to national markets and corporate buyers.</li>
                <li><strong>Digital Transformation:</strong> Leveraging modern ERP and inventory tooling for seamless operations.</li>
            </ol>
            <p>Together, inclusive growth and mentorship build self-reliant regional economies.</p>
        `,
        excerpt:
            "A closer look at how targeted incubation and advisory help Tier 2/3 founders build scalable businesses.",
        author: "Resonance Insights",
        image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
        tags: ["Entrepreneurship", "Mentorship", "Startups"],
        createdAt: "2026-01-28T09:30:00.000Z",
    },
];

export const DEFAULT_ALBUMS: Album[] = [
    {
        id: "album-1",
        title: "National Apprenticeship Workshop",
        description:
            "Interactive technical workshop bringing together college students, academic deans, and corporate HR partners to explore NATS & NAPS apprentice frameworks, stipend structures, and modern industrial talent models.",
        date: "February 2026",
        location: "Pune Industrial Hub",
        coverImage: "/gallery/1.svg",
        images: [
            "/gallery/1.svg",
            "/gallery/3.svg",
            "/gallery/4.svg",
            "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
        ],
    },
    {
        id: "album-2",
        title: "Campus Entrepreneurship Bootcamp",
        description:
            "3-day experiential innovation bootcamp where student teams turned concepts into viable pitch decks, backed by mentor-led business modeling, MVP design, and investor simulation reviews.",
        date: "January 2026",
        location: "PCCOE Campus, Pune",
        coverImage: "/gallery/2.svg",
        images: [
            "/gallery/2.svg",
            "/gallery/5.svg",
            "/gallery/6.svg",
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
        ],
    },
    {
        id: "album-3",
        title: "Startup Mentoring & Demo Day",
        description:
            "High-energy demo day and strategic advisory session connecting early-stage regional ventures with angel networks, technical architects, and enterprise buyers for scaling support.",
        date: "December 2025",
        location: "Resonance Incubation Center",
        coverImage: "/gallery/7.svg",
        images: [
            "/gallery/7.svg",
            "/gallery/8.svg",
            "/gallery/2.svg",
            "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
        ],
    },
    {
        id: "album-4",
        title: "CSR Skill Initiative Launch",
        description:
            "Formal inauguration and community orientation of vocational training centers in collaboration with manufacturing and industrial partners across Maharashtra.",
        date: "November 2025",
        location: "Bhosari Industrial Area",
        coverImage: "/gallery/5.svg",
        images: [
            "/gallery/5.svg",
            "/gallery/1.svg",
            "/gallery/3.svg",
            "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1200&auto=format&fit=crop",
        ],
    },
];

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
    showTeamOnHome: false,
    showTeamOnAbout: true,
};

export const DEFAULT_ENQUIRIES: Enquiry[] = [
    {
        _id: "enq-1",
        name: "Siddharth Verma",
        email: "siddharth.v@acme-corp.com",
        phone: "+91 9823456780",
        message:
            "We are looking to implement the NATS apprenticeship scheme for 50 trainee engineers in Pune. Kindly share details on onboarding and stipend subsidies.",
        createdAt: "2026-03-01T11:20:00.000Z",
        status: "new",
    },
    {
        _id: "enq-2",
        name: "Pooja Deshmukh",
        email: "pooja.d@techhub.in",
        phone: "+91 9876543210",
        message:
            "Interested in collaborating on the Campus Entrepreneurship Program for our engineering batch. Would love to schedule a discussion this week.",
        createdAt: "2026-02-24T14:45:00.000Z",
        status: "read",
    },
];

export const DEFAULT_EVENTS_CONFIG: EventsConfig = {
    portalUrl: "https://events.theresonance.co.in",
    openDirectUrl: true,
};

export const DEFAULT_EVENTS: ResonanceEvent[] = [
    {
        id: "event-1",
        slug: "national-apprenticeship-skill-conclave-2026",
        title: "National Apprenticeship & Skill Conclave 2026",
        subtitle: "Bridging the Academia-Industry Talent Gap through NATS & NAPS Frameworks",
        purpose:
            "Connecting 150+ manufacturing and tech enterprises with over 2,000 engineering and diploma apprentices, enabling on-the-spot offer rollouts and compliance handholding.",
        description:
            "A full-day flagship conclave featuring keynote addresses by MSCI leaders, panel discussions on work-integrated degree models (AEDP/WISTA), and structured corporate networking lounges. Organizations will receive practical guidance on stipend reimbursement and apprenticeship capacity expansion.",
        bannerImage:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
        date: "2026-03-28",
        startTime: "09:30",
        endTime: "17:30",
        time: "09:30 AM - 05:30 PM IST",
        venue: "Auto Cluster Exhibition Centre, Chinchwad, Pune",
        category: "Conclave",
        status: "upcoming",
        partnerGridColumns: 4,
        partnerSections: [
            {
                id: "ps-1",
                title: "Title & Industry Partners",
                subtitle: "Leading industrial champions powering nationwide skill development",
                gridColumns: 2,
                partners: [
                    {
                        id: "p-1",
                        name: "Tata Motors",
                        category: "Automotive Industry Partner",
                        logo: "/images/clients/1.svg",
                        websiteUrl: "https://www.tatamotors.com",
                    },
                    {
                        id: "p-2",
                        name: "DICCI",
                        category: "Industry Chamber Partner",
                        logo: "/images/govlogo/1.svg",
                        websiteUrl: "https://dicci.in",
                    },
                ],
            },
            {
                id: "ps-2",
                title: "Ecosystem & Knowledge Sponsors",
                subtitle: "Academic and government apex bodies guiding curriculum standards",
                gridColumns: 2,
                partners: [
                    {
                        id: "p-3",
                        name: "Skill India / NSDC",
                        category: "Skill Development Partner",
                        logo: "/images/govlogo/2.svg",
                        websiteUrl: "https://www.skillindia.gov.in",
                    },
                    {
                        id: "p-4",
                        name: "Savitribai Phule Pune University",
                        category: "Academic Knowledge Partner",
                        logo: "/images/clients/2.svg",
                        websiteUrl: "http://www.unipune.ac.in",
                    },
                ],
            },
        ],
        peopleSections: [
            {
                id: "peop-1",
                title: "Distinguished Keynote Speakers",
                subtitle: "Visionary industry pioneers and institutional leaders",
                members: [
                    {
                        id: "spk-1",
                        name: "Dr. Milind Kamble",
                        company: "DICCI Apex Chamber",
                        designation: "Founder Chairman & Padmashri Awardee",
                        photo: "/images/advisers/7.svg",
                    },
                    {
                        id: "spk-2",
                        name: "Atul Kulkarni",
                        company: "Global Trade & Infrastructure Advisory",
                        designation: "Techno-Managerial Strategist",
                        photo: "/images/advisers/3.svg",
                    },
                ],
            },
            {
                id: "peop-2",
                title: "Industry Delegates & Panelists",
                subtitle: "Senior corporate HR directors and technical workforce deans",
                members: [
                    {
                        id: "del-1",
                        name: "Rajesh Sharma",
                        company: "Tata Motors Manufacturing Division",
                        designation: "Head - Talent Acquisition & Apprenticeships",
                        photo: "/images/advisers/1.svg",
                    },
                    {
                        id: "del-2",
                        name: "Priya Nair",
                        company: "National Skill Development Corporation",
                        designation: "Director - Academic Alliances",
                        photo: "/images/advisers/4.svg",
                    },
                ],
            },
        ],
        partners: [
            {
                id: "p-1",
                name: "Tata Motors",
                category: "Automotive Industry Partner",
                logo: "/images/clients/1.svg",
                websiteUrl: "https://www.tatamotors.com",
            },
            {
                id: "p-2",
                name: "DICCI",
                category: "Industry Chamber Partner",
                logo: "/images/govlogo/1.svg",
                websiteUrl: "https://dicci.in",
            },
            {
                id: "p-3",
                name: "Skill India / NSDC",
                category: "Skill Development Partner",
                logo: "/images/govlogo/2.svg",
                websiteUrl: "https://www.skillindia.gov.in",
            },
            {
                id: "p-4",
                name: "Savitribai Phule Pune University",
                category: "Academic Knowledge Partner",
                logo: "/images/clients/2.svg",
                websiteUrl: "http://www.unipune.ac.in",
            },
        ],
        agenda: [
            {
                id: "ag-1",
                durationMinutes: 45,
                time: "09:30 AM - 10:15 AM",
                title: "Inaugural Keynote & Lighting of the Lamp",
                speaker: "Dr. Milind Kamble (Chairman - DICCI) & Chief Guests",
                description:
                    "Opening reflections on the evolving role of NATS/NAPS apprenticeships in driving industrial self-reliance.",
            },
            {
                id: "ag-2",
                durationMinutes: 75,
                time: "10:15 AM - 11:30 AM",
                title: "Panel Discussion: Work-Integrated Degree Apprenticeship (WIDA)",
                speaker: "Industry HR Directors & Academic Deans",
                description:
                    "Practical frameworks for aligning engineering curriculums with live floor-shop apprenticeship requirements.",
            },
            {
                id: "ag-3",
                durationMinutes: 90,
                time: "11:45 AM - 01:15 PM",
                title: "Corporate Talent Showcase & Onboarding Masterclass",
                speaker: "Resonance Apprenticeship Advisory Team",
                description:
                    "Walkthrough of automated compliance, DBT stipend subsidies, and institutional partner matching.",
            },
            {
                id: "ag-4",
                durationMinutes: 105,
                time: "02:00 PM - 03:45 PM",
                title: "Industry Networking Lounges & MOU Exchange",
                speaker: "Participating Corporate Delegates",
                description:
                    "Structured 1-on-1 enterprise interactions and formalizing academic tie-ups for upcoming cohorts.",
            },
            {
                id: "ag-5",
                durationMinutes: 90,
                time: "04:00 PM - 05:30 PM",
                title: "Valedictory Address & Certificate Distribution",
                speaker: "Distinguished Guests & resonance Leadership",
                description:
                    "Honoring leading employer contributions and concluding roadmap for 2026-2027 skill initiatives.",
            },
        ],
        registrationSnippet: "<div><script src=\"https://widget.konfhub.com/widget.js\" button_id=\"btn_6390d9287402\"></script></div>",
        registrationUrl: "https://konfhub.com/national-csr-conclave-resonance-rmp",
        buttonStyle: "gradient",
    },
    {
        id: "event-2",
        slug: "campus-entrepreneurship-venture-pitch-fest",
        title: "Campus Entrepreneurship & Venture Pitch Fest",
        subtitle: "Empowering Next-Gen Student Founders to Build Scalable Enterprises",
        purpose:
            "Incubating student venture ideas, providing seed funding readiness assessments, and linking early-stage collegiate founders with seasoned angels and industry mentors.",
        description:
            "An intense 2-day startup summit comprising prototype demonstrations, rapid business modeling workshops, and a live pitch competition in front of early-stage venture funds and ecosystem leaders.",
        bannerImage:
            "https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=1200&auto=format&fit=crop",
        date: "2026-04-18",
        startTime: "10:00",
        endTime: "16:30",
        time: "10:00 AM - 04:30 PM IST",
        venue: "Resonance Innovation Auditorium, Pune & Online Streaming",
        category: "Bootcamp",
        status: "upcoming",
        partnerGridColumns: 3,
        partnerSections: [
            {
                id: "ps-201",
                title: "Venture & Incubation Sponsors",
                subtitle: "Venture funds and government startup missions fostering student innovations",
                gridColumns: 3,
                partners: [
                    {
                        id: "p-201",
                        name: "Startup India Hub",
                        category: "Incubation Partner",
                        logo: "/images/govlogo/3.svg",
                        websiteUrl: "https://www.startupindia.gov.in",
                    },
                    {
                        id: "p-202",
                        name: "Venture Catalyst Fund",
                        category: "Investment Partner",
                        logo: "/images/clients/3.svg",
                    },
                    {
                        id: "p-203",
                        name: "Engineering Colleges Consortium",
                        category: "Academic Ecosystem Partner",
                        logo: "/images/clients/4.svg",
                    },
                ],
            },
        ],
        peopleSections: [
            {
                id: "peop-201",
                title: "Jury Panel & Startup Mentors",
                subtitle: "Seasoned founders and venture partners evaluating collegiate ventures",
                members: [
                    {
                        id: "jur-1",
                        name: "Arun Deshmukh",
                        company: "Early Stage Angels Network",
                        designation: "Managing Partner",
                        photo: "/images/advisers/2.svg",
                    },
                    {
                        id: "jur-2",
                        name: "Ananya Roy",
                        company: "Catalyst Innovation Labs",
                        designation: "Chief Incubation Officer",
                        photo: "/images/advisers/5.svg",
                    },
                ],
            },
        ],
        partners: [
            {
                id: "p-201",
                name: "Startup India Hub",
                category: "Incubation Partner",
                logo: "/images/govlogo/3.svg",
                websiteUrl: "https://www.startupindia.gov.in",
            },
            {
                id: "p-202",
                name: "Venture Catalyst Fund",
                category: "Investment Partner",
                logo: "/images/clients/3.svg",
            },
            {
                id: "p-203",
                name: "Engineering Colleges Consortium",
                category: "Academic Ecosystem Partner",
                logo: "/images/clients/4.svg",
            },
        ],
        agenda: [
            {
                id: "ag-201",
                durationMinutes: 60,
                time: "10:00 AM - 11:00 AM",
                title: "Student Startup Orientation & Pitch Guidelines",
                speaker: "Resonance Mentorship Cell",
                description:
                    "Overview of evaluation rubrics, unit economics validation, and investor presentation formats.",
            },
            {
                id: "ag-202",
                durationMinutes: 135,
                time: "11:15 AM - 01:30 PM",
                title: "Round 1: Rapid Fire Pitching & Mentoring Booths",
                speaker: "Angel Investors & Industry Mentors",
                description:
                    "Top 20 shortlisted collegiate ventures present prototype demonstrations across Tech, Agritech, and EV domains.",
            },
            {
                id: "ag-203",
                durationMinutes: 120,
                time: "02:30 PM - 04:30 PM",
                title: "Grand Finale: Live Seed Grants & Incubation Announcements",
                speaker: "Jury Panel",
                description:
                    "Announcement of prototyping grants, equity-free seed awards, and year-long incubation onboarding.",
            },
        ],
        registrationSnippet: "<a href=\"https://events.theresonance.co.in\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"display:inline-flex;align-items:center;gap:8px;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#ffffff;font-family:sans-serif;font-size:13px;font-weight:700;padding:10px 22px;border-radius:9999px;text-decoration:none;box-shadow:0 4px 12px rgba(37,99,235,0.3);transition:all 0.2s ease;\"><span>Register for Event</span><svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\"><path d=\"M5 12h14M12 5l7 7-7 7\"/></svg></a>",
        registrationUrl: "https://events.theresonance.co.in",
    },
];

export const DEFAULT_VISITOR_STATS: VisitorStats = {
    uniqueVisitors: 428,
    totalHits: 1940,
    todayHits: 34,
    lastHitAt: new Date().toISOString(),
};

const STORAGE_KEYS = {
    ADVISORS: "resonance_advisors_data",
    TEAM: "resonance_team_data",
    CONTACT: "resonance_contact_data",
    PROGRAMS: "resonance_programs_data",
    SERVICES: "resonance_services_data",
    BLOGS: "resonance_blogs_data",
    ENQUIRIES: "resonance_enquiries_data",
    ALBUMS: "resonance_albums_data",
    SETTINGS: "resonance_site_settings_data",
    EVENTS_CONFIG: "resonance_events_config",
    EVENTS: "resonance_events_data",
    ANALYTICS: "resonance_site_analytics",
    SESSIONS: "resonance_admin_sessions",
};

// API endpoint for cloud hosting environments (Netlify / AWS / Custom Backend)
export const API_BASE =
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_URL) ||
    "/.netlify/functions";

// Background sync from cloud backend on app start
export const syncFromCloud = async () => {
    if (typeof window === "undefined") return;
    try {
        const res = await fetch(`${API_BASE}/site-content`);
        if (!res.ok) return;
        const result = await res.json();
        if (result.success && result.content && typeof result.content === "object") {
            Object.entries(result.content).forEach(([storageKey, value]) => {
                try {
                    localStorage.setItem(storageKey, JSON.stringify(value));
                } catch (e) {
                    // Ignore quota limits
                }
            });
            notifyDataChange("all");
        }
    } catch (e) {
        // Graceful silent fallback for local dev / offline mode
    }
};

// Background push to cloud backend
export const syncToCloud = async (key: string, data: any) => {
    if (typeof window === "undefined") return;
    try {
        await fetch(`${API_BASE}/site-content`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, data }),
        });
    } catch (e) {
        // Graceful silent fallback for local dev / offline mode
    }
};

// Dispatch custom event to notify all components in the current tab
const notifyDataChange = (key: string) => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("siteDataUpdated", { detail: { key } }));
    }
};

// ADVISORS
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
        syncToCloud(STORAGE_KEYS.ADVISORS, advisors);
    } catch (e) {
        console.error("Error saving advisors to localStorage", e);
    }
};

// TEAM
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
        syncToCloud(STORAGE_KEYS.TEAM, team);
    } catch (e) {
        console.error("Error saving team to localStorage", e);
    }
};

// CONTACT
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
        syncToCloud(STORAGE_KEYS.CONTACT, contact);
    } catch (e) {
        console.error("Error saving contact to localStorage", e);
    }
};

// SERVICES
export const getStoredServices = (): Service[] => {
    if (typeof window === "undefined") return DEFAULT_SERVICES;
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SERVICES);
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.error("Error reading services from localStorage", e);
    }
    return DEFAULT_SERVICES;
};

export const saveStoredServices = (services: Service[]) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
        notifyDataChange(STORAGE_KEYS.SERVICES);
        syncToCloud(STORAGE_KEYS.SERVICES, services);
    } catch (e) {
        console.error("Error saving services to localStorage", e);
    }
};

// PROGRAMS
export const getStoredPrograms = (): Program[] => {
    if (typeof window === "undefined") return DEFAULT_PROGRAMS;
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PROGRAMS);
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.error("Error reading programs from localStorage", e);
    }
    return DEFAULT_PROGRAMS;
};

export const saveStoredPrograms = (programs: Program[]) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEYS.PROGRAMS, JSON.stringify(programs));
        notifyDataChange(STORAGE_KEYS.PROGRAMS);
        syncToCloud(STORAGE_KEYS.PROGRAMS, programs);
    } catch (e) {
        console.error("Error saving programs to localStorage", e);
    }
};

// BLOGS
export const getStoredBlogs = (): BlogPost[] => {
    if (typeof window === "undefined") return DEFAULT_BLOGS;
    try {
        const data = localStorage.getItem(STORAGE_KEYS.BLOGS);
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.error("Error reading blogs from localStorage", e);
    }
    return DEFAULT_BLOGS;
};

export const saveStoredBlogs = (blogs: BlogPost[]) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(blogs));
        notifyDataChange(STORAGE_KEYS.BLOGS);
        syncToCloud(STORAGE_KEYS.BLOGS, blogs);
    } catch (e) {
        console.error("Error saving blogs to localStorage", e);
    }
};

export const saveSingleBlog = (blog: Omit<BlogPost, "_id" | "createdAt"> & { _id?: string }) => {
    const blogs = getStoredBlogs();
    let updated: BlogPost[];
    if (blog._id) {
        updated = blogs.map((b) =>
            b._id === blog._id
                ? {
                      ...b,
                      ...blog,
                      _id: blog._id!,
                      createdAt: b.createdAt || new Date().toISOString(),
                  }
                : b,
        );
    } else {
        const newPost: BlogPost = {
            ...blog,
            _id: `blog-${Date.now()}`,
            createdAt: new Date().toISOString(),
        };
        updated = [newPost, ...blogs];
    }
    saveStoredBlogs(updated);
    return updated;
};

export const deleteStoredBlog = (id: string) => {
    const blogs = getStoredBlogs();
    const updated = blogs.filter((b) => b._id !== id);
    saveStoredBlogs(updated);
    return updated;
};

// ENQUIRIES
export const getStoredEnquiries = (): Enquiry[] => {
    if (typeof window === "undefined") return DEFAULT_ENQUIRIES;
    try {
        const data = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.error("Error reading enquiries from localStorage", e);
    }
    return DEFAULT_ENQUIRIES;
};

export const saveStoredEnquiries = (enquiries: Enquiry[]) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(enquiries));
        notifyDataChange(STORAGE_KEYS.ENQUIRIES);
    } catch (e) {
        console.error("Error saving enquiries to localStorage", e);
    }
};

export const addEnquiry = (enquiryData: {
    name: string;
    email: string;
    phone: string;
    message: string;
}): Enquiry => {
    const enquiries = getStoredEnquiries();
    const newEnquiry: Enquiry = {
        _id: `enq-${Date.now()}`,
        name: enquiryData.name.trim(),
        email: enquiryData.email.trim(),
        phone: enquiryData.phone.trim(),
        message: enquiryData.message.trim(),
        createdAt: new Date().toISOString(),
        status: "new",
    };
    const updated = [newEnquiry, ...enquiries];
    saveStoredEnquiries(updated);

    // Asynchronously submit to cloud backend if available
    try {
        fetch(`${API_BASE}/submit-enquiry`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(enquiryData),
        }).catch(() => {});
    } catch (e) {
        // Silently continue locally
    }

    return newEnquiry;
};

export const deleteStoredEnquiry = (id: string) => {
    const enquiries = getStoredEnquiries();
    const updated = enquiries.filter((e) => e._id !== id);
    saveStoredEnquiries(updated);
    return updated;
};

export const updateEnquiryStatus = (id: string, status: "new" | "read" | "replied") => {
    const enquiries = getStoredEnquiries();
    const updated = enquiries.map((e) => (e._id === id ? { ...e, status } : e));
    saveStoredEnquiries(updated);
    return updated;
};

// ALBUMS
export const getStoredAlbums = (): Album[] => {
    if (typeof window === "undefined") return DEFAULT_ALBUMS;
    try {
        const data = localStorage.getItem(STORAGE_KEYS.ALBUMS);
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.error("Error reading albums from localStorage", e);
    }
    return DEFAULT_ALBUMS;
};

export const saveStoredAlbums = (albums: Album[]) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEYS.ALBUMS, JSON.stringify(albums));
        notifyDataChange(STORAGE_KEYS.ALBUMS);
        syncToCloud(STORAGE_KEYS.ALBUMS, albums);
    } catch (e) {
        console.error("Error saving albums to localStorage", e);
    }
};

// SETTINGS
export const getStoredSettings = (): SiteSettings => {
    if (typeof window === "undefined") return DEFAULT_SITE_SETTINGS;
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
        if (data) {
            const parsed = JSON.parse(data);
            if (parsed && typeof parsed === "object") {
                return { ...DEFAULT_SITE_SETTINGS, ...parsed };
            }
        }
    } catch (e) {
        console.error("Error reading settings from localStorage", e);
    }
    return DEFAULT_SITE_SETTINGS;
};

export const saveStoredSettings = (settings: SiteSettings) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        notifyDataChange(STORAGE_KEYS.SETTINGS);
        syncToCloud(STORAGE_KEYS.SETTINGS, settings);
    } catch (e) {
        console.error("Error saving settings to localStorage", e);
    }
};

// EVENTS CONFIG
export const getStoredEventsConfig = (): EventsConfig => {
    if (typeof window === "undefined") return DEFAULT_EVENTS_CONFIG;
    try {
        const data = localStorage.getItem(STORAGE_KEYS.EVENTS_CONFIG);
        if (data) {
            const parsed = JSON.parse(data);
            if (parsed && typeof parsed === "object") {
                return { ...DEFAULT_EVENTS_CONFIG, ...parsed };
            }
        }
    } catch (e) {
        console.error("Error reading events config from localStorage", e);
    }
    return DEFAULT_EVENTS_CONFIG;
};

export const saveStoredEventsConfig = (config: EventsConfig) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEYS.EVENTS_CONFIG, JSON.stringify(config));
        notifyDataChange(STORAGE_KEYS.EVENTS_CONFIG);
        syncToCloud(STORAGE_KEYS.EVENTS_CONFIG, config);
    } catch (e) {
        console.error("Error saving events config to localStorage", e);
    }
};

// EVENTS
export const getStoredEvents = (): ResonanceEvent[] => {
    if (typeof window === "undefined") return DEFAULT_EVENTS;
    try {
        const data = localStorage.getItem(STORAGE_KEYS.EVENTS);
        if (data) {
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.error("Error reading events from localStorage", e);
    }
    return DEFAULT_EVENTS;
};

export const saveStoredEvents = (events: ResonanceEvent[]) => {
    if (typeof window === "undefined") return;
    try {
        localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
        notifyDataChange(STORAGE_KEYS.EVENTS);
        syncToCloud(STORAGE_KEYS.EVENTS, events);
    } catch (e) {
        console.error("Error saving events to localStorage", e);
    }
};

export const resetAllSiteData = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.ADVISORS);
    localStorage.removeItem(STORAGE_KEYS.TEAM);
    localStorage.removeItem(STORAGE_KEYS.CONTACT);
    localStorage.removeItem(STORAGE_KEYS.PROGRAMS);
    localStorage.removeItem(STORAGE_KEYS.SERVICES);
    localStorage.removeItem(STORAGE_KEYS.BLOGS);
    localStorage.removeItem(STORAGE_KEYS.ENQUIRIES);
    notifyDataChange("all");
};

// React Hooks
export const useSiteAdvisors = () => {
    const [advisors, setAdvisors] = useState<Advisor[]>(getStoredAdvisors);

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (
                !customEvent.detail ||
                customEvent.detail.key === STORAGE_KEYS.ADVISORS ||
                customEvent.detail.key === "all"
            ) {
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
            if (
                !customEvent.detail ||
                customEvent.detail.key === STORAGE_KEYS.TEAM ||
                customEvent.detail.key === "all"
            ) {
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
            if (
                !customEvent.detail ||
                customEvent.detail.key === STORAGE_KEYS.CONTACT ||
                customEvent.detail.key === "all"
            ) {
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

export const useSiteServices = () => {
    const [services, setServices] = useState<Service[]>(getStoredServices);

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (
                !customEvent.detail ||
                customEvent.detail.key === STORAGE_KEYS.SERVICES ||
                customEvent.detail.key === "all"
            ) {
                setServices(getStoredServices());
            }
        };
        window.addEventListener("siteDataUpdated", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("siteDataUpdated", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    return services;
};

export const useSitePrograms = () => {
    const [programs, setPrograms] = useState<Program[]>(getStoredPrograms);

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (
                !customEvent.detail ||
                customEvent.detail.key === STORAGE_KEYS.PROGRAMS ||
                customEvent.detail.key === "all"
            ) {
                setPrograms(getStoredPrograms());
            }
        };
        window.addEventListener("siteDataUpdated", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("siteDataUpdated", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    return programs;
};

export const useSiteBlogs = () => {
    const [blogs, setBlogs] = useState<BlogPost[]>(getStoredBlogs);

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (
                !customEvent.detail ||
                customEvent.detail.key === STORAGE_KEYS.BLOGS ||
                customEvent.detail.key === "all"
            ) {
                setBlogs(getStoredBlogs());
            }
        };
        window.addEventListener("siteDataUpdated", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("siteDataUpdated", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    return blogs;
};

export const useSiteAlbums = () => {
    const [albums, setAlbums] = useState<Album[]>(getStoredAlbums);

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (
                !customEvent.detail ||
                customEvent.detail.key === STORAGE_KEYS.ALBUMS ||
                customEvent.detail.key === "all"
            ) {
                setAlbums(getStoredAlbums());
            }
        };
        window.addEventListener("siteDataUpdated", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("siteDataUpdated", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    return albums;
};

export const useSiteSettings = () => {
    const [settings, setSettings] = useState<SiteSettings>(getStoredSettings);

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (
                !customEvent.detail ||
                customEvent.detail.key === STORAGE_KEYS.SETTINGS ||
                customEvent.detail.key === "all"
            ) {
                setSettings(getStoredSettings());
            }
        };
        window.addEventListener("siteDataUpdated", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("siteDataUpdated", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    return settings;
};

export const useSiteEventsConfig = () => {
    const [config, setConfig] = useState<EventsConfig>(getStoredEventsConfig);

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (
                !customEvent.detail ||
                customEvent.detail.key === STORAGE_KEYS.EVENTS_CONFIG ||
                customEvent.detail.key === "all"
            ) {
                setConfig(getStoredEventsConfig());
            }
        };
        window.addEventListener("siteDataUpdated", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("siteDataUpdated", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    return config;
};

export const useSiteEvents = () => {
    const [events, setEvents] = useState<ResonanceEvent[]>(getStoredEvents);

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (
                !customEvent.detail ||
                customEvent.detail.key === STORAGE_KEYS.EVENTS ||
                customEvent.detail.key === "all"
            ) {
                setEvents(getStoredEvents());
            }
        };
        window.addEventListener("siteDataUpdated", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("siteDataUpdated", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    return events;
};

export const useSiteEnquiries = () => {
    const [enquiries, setEnquiries] = useState<Enquiry[]>(getStoredEnquiries);

    useEffect(() => {
        const handler = (e: Event) => {
            const customEvent = e as CustomEvent;
            if (
                !customEvent.detail ||
                customEvent.detail.key === STORAGE_KEYS.ENQUIRIES ||
                customEvent.detail.key === "all"
            ) {
                setEnquiries(getStoredEnquiries());
            }
        };
        window.addEventListener("siteDataUpdated", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("siteDataUpdated", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    return enquiries;
};

// Helper function to resize and compress uploaded image files to base64 Data URLs
export const processImageFile = (
    file: File,
    maxWidth = 500,
    quality = 0.85,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        // Direct passthrough for SVG vectors to avoid rasterization / quality degradation
        if (
            file.type === "image/svg+xml" ||
            file.name.toLowerCase().endsWith(".svg")
        ) {
            const svgReader = new FileReader();
            svgReader.onload = (e) => resolve((e.target?.result as string) || "");
            svgReader.onerror = (e) => reject(e);
            svgReader.readAsDataURL(file);
            return;
        }

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
                const dataUrl = canvas.toDataURL("image/jpeg", quality);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};

// ================= EVENT DATE & TIME HELPERS =================
export function isEventPast(dateStr?: string, status?: string): boolean {
    if (status === "completed") return true;
    if (!dateStr || !dateStr.trim()) return false;
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return false;
    // Set to end of day in local time so it stays active during the event day
    const endOfDay = new Date(
        parsed.getFullYear(),
        parsed.getMonth(),
        parsed.getDate(),
        23,
        59,
        59,
        999,
    );
    return Date.now() > endOfDay.getTime();
}

export function formatEventDisplayDate(dateStr?: string): string {
    if (!dateStr || !dateStr.trim()) return "";
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return dateStr;
    return parsed.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
}

function formatTime12Hour(time24: string): string {
    if (!time24 || !time24.includes(":")) return time24;
    const [hStr, mStr] = time24.split(":");
    const h = parseInt(hStr, 10);
    const m = parseInt(mStr, 10);
    if (isNaN(h) || isNaN(m)) return time24;
    const ampm = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 || 12;
    const padM = m < 10 ? `0${m}` : `${m}`;
    return `${h12}:${padM} ${ampm}`;
}

export function formatEventDisplayTime(
    startTime?: string,
    endTime?: string,
    legacyTime?: string,
): string {
    if (startTime && endTime) {
        return `${formatTime12Hour(startTime)} - ${formatTime12Hour(endTime)}`;
    }
    if (startTime) {
        return `From ${formatTime12Hour(startTime)}`;
    }
    return legacyTime || "";
}

/**
 * Converts a time string (e.g. "09:30", "14:15", "09:30 AM", "2:00 PM") into minutes from midnight.
 * Defaults to 570 (09:30 AM) if invalid.
 */
export function parseTimeToMinutes(timeStr?: string, defaultMinutes = 570): number {
    if (!timeStr || !timeStr.trim()) return defaultMinutes;
    const str = timeStr.trim();
    
    // Check 12-hour format with AM/PM e.g. "09:30 AM" or "2:15 PM"
    const match12 = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
    if (match12) {
        let h = parseInt(match12[1], 10);
        const m = parseInt(match12[2], 10);
        const ampm = match12[3]?.toUpperCase();
        if (ampm === "PM" && h < 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        return h * 60 + m;
    }
    
    // Check 24-hour format e.g. "09:30" or "14:15"
    const match24 = str.match(/^(\d{1,2}):(\d{2})$/);
    if (match24) {
        const h = parseInt(match24[1], 10);
        const m = parseInt(match24[2], 10);
        return h * 60 + m;
    }

    // Try finding time in a range string like "09:30 AM - 10:15 AM"
    const rangeMatch = str.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (rangeMatch) {
        let h = parseInt(rangeMatch[1], 10);
        const m = parseInt(rangeMatch[2], 10);
        const ampm = rangeMatch[3]?.toUpperCase();
        if (ampm === "PM" && h < 12) h += 12;
        if (ampm === "AM" && h === 12) h = 0;
        return h * 60 + m;
    }

    return defaultMinutes;
}

/**
 * Formats minutes from midnight (e.g. 570) to 12-hour format string (e.g. "09:30 AM").
 */
export function formatMinutesToTime12(totalMinutes: number): string {
    const normalized = ((totalMinutes % 1440) + 1440) % 1440;
    const h24 = Math.floor(normalized / 60);
    const m = normalized % 60;
    const ampm = h24 >= 12 ? "PM" : "AM";
    const h12 = h24 % 12 || 12;
    const padH = h12 < 10 ? `0${h12}` : `${h12}`;
    const padM = m < 10 ? `0${m}` : `${m}`;
    return `${padH}:${padM} ${ampm}`;
}

/**
 * Formats duration in minutes into a human-readable label (e.g. "45 mins", "1 hr", "1 hr 15 mins", "2 hrs").
 */
export function formatSessionDuration(minutes?: number): string {
    const mins = Math.max(1, Math.round(Number(minutes) || 45));
    if (mins < 60) {
        return `${mins} mins`;
    }
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const hLabel = h === 1 ? "1 hr" : `${h} hrs`;
    if (m === 0) return hLabel;
    return `${hLabel} ${m} mins`;
}

/**
 * Extracts or infers duration in minutes from an agenda item.
 * If durationMinutes is explicitly set, uses it.
 * Otherwise, tries to parse duration from a legacy time string (e.g. "09:30 AM - 10:15 AM" -> 45).
 * Falls back to defaultMinutes (45).
 */
export function getAgendaItemDuration(item: EventAgendaItem, defaultMinutes = 45): number {
    if (typeof item.durationMinutes === "number" && item.durationMinutes > 0) {
        return item.durationMinutes;
    }
    if (item.time && item.time.includes("-")) {
        const parts = item.time.split("-");
        const start = parseTimeToMinutes(parts[0], -1);
        const end = parseTimeToMinutes(parts[1], -1);
        if (start >= 0 && end > start) {
            return end - start;
        }
    }
    return defaultMinutes;
}

export interface CalculatedAgendaItem extends EventAgendaItem {
    sessionNumber: number;
    startMinutes: number;
    endMinutes: number;
    startTimeStr: string;
    endTimeStr: string;
    timeRangeStr: string;
    durationMinutes: number;
    durationLabel: string;
}

/**
 * Calculates sequential schedule for agenda items starting from the event start time.
 */
export function calculateAgendaSchedule(
    eventStartTime?: string,
    agenda?: EventAgendaItem[],
): CalculatedAgendaItem[] {
    if (!agenda || agenda.length === 0) return [];
    
    // Parse starting time
    const initialStart = parseTimeToMinutes(eventStartTime, 570); // default 09:30 AM
    let currentMins = initialStart;

    return agenda.map((item, index) => {
        const duration = getAgendaItemDuration(item, 45);
        const startMins = currentMins;
        const endMins = startMins + duration;
        currentMins = endMins;

        const startTimeStr = formatMinutesToTime12(startMins);
        const endTimeStr = formatMinutesToTime12(endMins);

        return {
            ...item,
            sessionNumber: index + 1,
            startMinutes: startMins,
            endMinutes: endMins,
            startTimeStr,
            endTimeStr,
            timeRangeStr: `${startTimeStr} - ${endTimeStr}`,
            durationMinutes: duration,
            durationLabel: formatSessionDuration(duration),
        };
    });
}

/**
 * Generates a clean URL slug from an event title (e.g. "National Skill Conclave 2026" -> "national-skill-conclave-2026")
 */
export function generateEventSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// ================= VISITOR ANALYTICS =================
export const getVisitorStats = (): VisitorStats => {
    if (typeof window === "undefined") return DEFAULT_VISITOR_STATS;
    try {
        const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
        if (data) {
            const parsed = JSON.parse(data);
            if (typeof parsed.uniqueVisitors === "number") return parsed;
        }
    } catch (e) {
        // Fallback to default
    }
    return DEFAULT_VISITOR_STATS;
};

export const recordVisitorHit = (): VisitorStats => {
    if (typeof window === "undefined") return DEFAULT_VISITOR_STATS;
    try {
        const stats = getVisitorStats();
        let isUnique = false;

        // 1. Check unique visitor token in localStorage
        let visitorToken = localStorage.getItem("resonance_visitor_token");
        if (!visitorToken) {
            visitorToken = `vt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
            localStorage.setItem("resonance_visitor_token", visitorToken);
            isUnique = true;
        }

        // 2. Check session hit in sessionStorage so repeated reloads in the same tab don't spam hits
        const sessionHit = sessionStorage.getItem("resonance_session_hit");
        const isNewSession = !sessionHit;
        if (isNewSession) {
            sessionStorage.setItem("resonance_session_hit", "1");
        }

        const now = new Date();
        const lastDate = stats.lastHitAt ? new Date(stats.lastHitAt) : new Date();
        const isSameDay = now.toDateString() === lastDate.toDateString();

        const updated: VisitorStats = {
            uniqueVisitors: isUnique ? stats.uniqueVisitors + 1 : stats.uniqueVisitors,
            totalHits: isNewSession ? stats.totalHits + 1 : stats.totalHits,
            todayHits: isSameDay
                ? (isNewSession ? stats.todayHits + 1 : stats.todayHits)
                : 1,
            lastHitAt: now.toISOString(),
        };

        if (isUnique || isNewSession) {
            localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(updated));
            notifyDataChange(STORAGE_KEYS.ANALYTICS);
            syncToCloud(STORAGE_KEYS.ANALYTICS, updated);

            // Forward to central analytics API when available
            fetch("/api/analytics", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ visitorToken }),
            })
                .then((r) => (r.ok ? r.json() : null))
                .then((d) => {
                    if (d?.stats) {
                        localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(d.stats));
                        notifyDataChange(STORAGE_KEYS.ANALYTICS);
                    }
                })
                .catch(() => {});
        }

        return updated;
    } catch {
        return DEFAULT_VISITOR_STATS;
    }
};

export const useSiteVisitorStats = (): VisitorStats => {
    const [stats, setStats] = useState<VisitorStats>(getVisitorStats);

    useEffect(() => {
        // Attempt to fetch live central analytics
        fetch("/api/analytics")
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
                if (data && typeof data.uniqueVisitors === "number") {
                    setStats(data);
                    localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(data));
                }
            })
            .catch(() => {});
        const handler = (e: any) => {
            if (!e.detail?.key || e.detail.key === STORAGE_KEYS.ANALYTICS || e.detail.key === "all") {
                setStats(getVisitorStats());
            }
        };

        window.addEventListener("siteDataUpdated", handler);
        window.addEventListener("storage", handler);
        return () => {
            window.removeEventListener("siteDataUpdated", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    return stats;
};

// ================= CONNECTED SESSIONS MANAGEMENT =================
export const parseUserAgent = (): { deviceName: string; browser: string; os: string } => {
    if (typeof window === "undefined" || !window.navigator) {
        return { deviceName: "Unknown Device", browser: "Browser", os: "Unknown OS" };
    }
    const ua = navigator.userAgent;
    let os = "Desktop OS";
    let deviceName = "Computer";

    if (/Windows/i.test(ua)) {
        os = "Windows";
        deviceName = "Windows PC";
    } else if (/Macintosh|Mac OS X/i.test(ua)) {
        os = "macOS";
        deviceName = "Apple Mac";
    } else if (/iPhone/i.test(ua)) {
        os = "iOS";
        deviceName = "Apple iPhone";
    } else if (/iPad/i.test(ua)) {
        os = "iPadOS";
        deviceName = "Apple iPad";
    } else if (/Android/i.test(ua)) {
        os = "Android";
        deviceName = "Android Mobile";
    } else if (/Linux/i.test(ua)) {
        os = "Linux";
        deviceName = "Linux Workstation";
    }

    let browser = "Web Browser";
    if (/Edg\//i.test(ua)) browser = "Microsoft Edge";
    else if (/Chrome\//i.test(ua)) browser = "Google Chrome";
    else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) browser = "Apple Safari";
    else if (/Firefox\//i.test(ua)) browser = "Mozilla Firefox";

    return { deviceName, browser, os };
};

export const getStoredSessions = (): DeviceSession[] => {
    if (typeof window === "undefined") return [];
    try {
        const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
        const currentSessionId = localStorage.getItem("resonance_current_session_id") || "";
        if (data) {
            const list: DeviceSession[] = JSON.parse(data);
            if (Array.isArray(list) && list.length > 0) {
                return list.map((s) => ({
                    ...s,
                    isCurrent: s.id === currentSessionId,
                }));
            }
        }
    } catch {}

    // If empty, return at least current session mock
    const { deviceName, browser, os } = parseUserAgent();
    return [
        {
            id: "current-default",
            deviceName,
            browser,
            os,
            ip: "Localhost (Active)",
            loginTime: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            isCurrent: true,
        },
    ];
};

export const registerCurrentSession = (): DeviceSession => {
    if (typeof window === "undefined") {
        return {
            id: "current",
            deviceName: "Current Device",
            browser: "Browser",
            os: "OS",
            ip: "Localhost",
            loginTime: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            isCurrent: true,
        };
    }
    const { deviceName, browser, os } = parseUserAgent();
    let currentId = localStorage.getItem("resonance_current_session_id");
    if (!currentId) {
        currentId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        localStorage.setItem("resonance_current_session_id", currentId);
    }

    const currentSession: DeviceSession = {
        id: currentId,
        deviceName,
        browser,
        os,
        ip: "Active Device Session",
        loginTime: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        isCurrent: true,
    };

    let sessions = getStoredSessions().filter((s) => s.id !== currentId && s.id !== "current-default");
    sessions = [currentSession, ...sessions].slice(0, 10);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    notifyDataChange(STORAGE_KEYS.SESSIONS);
    syncToCloud(STORAGE_KEYS.SESSIONS, sessions);

    return currentSession;
};

export const revokeSession = (sessionId: string) => {
    if (typeof window === "undefined") return;
    const currentId = localStorage.getItem("resonance_current_session_id");
    if (sessionId === currentId) {
        localStorage.removeItem("isAdminAuthenticated");
        localStorage.removeItem("resonance_current_session_id");
    }
    const updated = getStoredSessions().filter((s) => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
    notifyDataChange(STORAGE_KEYS.SESSIONS);
    syncToCloud(STORAGE_KEYS.SESSIONS, updated);

    fetch("/api/auth/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
    }).catch(() => {});
};

export const revokeAllOtherSessions = () => {
    if (typeof window === "undefined") return;
    const currentId = localStorage.getItem("resonance_current_session_id");
    const updated = getStoredSessions().filter((s) => s.id === currentId);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
    notifyDataChange(STORAGE_KEYS.SESSIONS);
    syncToCloud(STORAGE_KEYS.SESSIONS, updated);

    fetch("/api/auth/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revokeAllOthers: true }),
    }).catch(() => {});
};

export const useSiteSessions = (): DeviceSession[] => {
    const [sessions, setSessions] = useState<DeviceSession[]>(getStoredSessions);

    useEffect(() => {
        const syncSessions = () => {
            fetch("/api/auth/sessions")
                .then((r) => (r.ok ? r.json() : null))
                .then((data) => {
                    if (data?.sessions && Array.isArray(data.sessions)) {
                        setSessions(data.sessions);
                        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(data.sessions));
                    }
                })
                .catch(() => {});
        };

        syncSessions();
        const interval = setInterval(syncSessions, 10000);

        const handler = (e: any) => {
            if (!e.detail?.key || e.detail.key === STORAGE_KEYS.SESSIONS || e.detail.key === "all") {
                setSessions(getStoredSessions());
            }
        };

        window.addEventListener("siteDataUpdated", handler);
        window.addEventListener("storage", handler);
        return () => {
            clearInterval(interval);
            window.removeEventListener("siteDataUpdated", handler);
            window.removeEventListener("storage", handler);
        };
    }, []);

    return sessions;
};
