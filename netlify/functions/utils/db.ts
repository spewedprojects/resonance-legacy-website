import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless invocations. This prevents connections
 * from growing exponentially during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectDB() {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not defined.');
    }

    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

const EnquirySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

const Enquiry = mongoose.models.Enquiry || mongoose.model('Enquiry', EnquirySchema);

const BlogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    excerpt: { type: String },
    author: { type: String, default: 'Resonance Team' },
    image: { type: String },
    tags: [{ type: String }],
}, {
    timestamps: true
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);

// Generic SiteContent Schema for all dynamic sections (Advisory, Team, Contact, Programs, Services, Albums, Settings)
const SiteContentSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, required: true },
}, {
    timestamps: true
});

const SiteContent = mongoose.models.SiteContent || mongoose.model('SiteContent', SiteContentSchema);

export { connectDB, Enquiry, Blog, SiteContent };
