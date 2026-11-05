import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Save,
    Loader2,
    Upload,
    Sparkles,
    Eye,
    Type,
    FileText,
    Tag,
    User,
    Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Editor } from "primereact/editor";
import {
    getStoredBlogs,
    saveSingleBlog,
    BlogPost,
    processImageFile,
} from "@/lib/siteData";

const BlogEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;

    const [formData, setFormData] = useState<Omit<BlogPost, "createdAt">>({
        _id: "",
        title: "",
        subtitle: "",
        slug: "",
        content: "",
        excerpt: "",
        author: "Resonance Team",
        image: "",
        tags: ["Skill Development", "Insights"],
    });

    const [tagInput, setTagInput] = useState("Skill Development, Insights");
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (isEditing) {
            const blogs = getStoredBlogs();
            const found = blogs.find((b) => b._id === id);
            if (found) {
                setFormData({
                    _id: found._id,
                    title: found.title || "",
                    subtitle: found.subtitle || "",
                    slug: found.slug || "",
                    content: found.content || "",
                    excerpt: found.excerpt || "",
                    author: found.author || "Resonance Team",
                    image: found.image || "",
                    tags: found.tags || [],
                });
                setTagInput((found.tags || []).join(", "));
            }
        }
    }, [id, isEditing]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Auto-generate URL slug from title if it's a new post
        if (name === "title" && !isEditing) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file (PNG, JPG, WEBP)");
            return;
        }

        try {
            setIsUploading(true);
            const base64 = await processImageFile(file, 1200, 0.85);
            setFormData((prev) => ({ ...prev, image: base64 }));
            toast.success("Featured image uploaded successfully");
        } catch (err) {
            console.error(err);
            toast.error("Failed to process image");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Please enter a blog post title");
            return;
        }

        if (!formData.content.trim()) {
            toast.error("Please add content to your blog post");
            return;
        }

        setIsSaving(true);

        const parsedTags = tagInput
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean);

        const autoExcerpt =
            formData.excerpt.trim() ||
            formData.subtitle.trim() ||
            formData.content.replace(/<[^>]+>/g, "").slice(0, 150) + "...";

        const blogPayload = {
            ...formData,
            _id: isEditing ? id : undefined,
            subtitle: formData.subtitle.trim(),
            excerpt: autoExcerpt,
            tags: parsedTags,
        };

        try {
            // Save locally to siteData store
            saveSingleBlog(blogPayload);

            // Attempt to sync with Netlify backend if running
            try {
                const method = isEditing ? "PUT" : "POST";
                const body = isEditing ? { ...blogPayload, id } : blogPayload;
                await fetch("/.netlify/functions/manage-blogs", {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });
            } catch (backendErr) {
                // Ignore backend errors in local standalone dev
                console.info("Saved locally to browser store (backend sync optional).");
            }

            toast.success(
                `Blog post "${formData.title}" ${isEditing ? "updated" : "published"} successfully!`,
            );
            navigate("/admin/blogs");
        } catch (err) {
            console.error(err);
            toast.error("Failed to save blog post");
        } finally {
            setIsSaving(false);
        }
    };

    // WordPress-style Custom Header Toolbar for PrimeReact / Quill Editor
    const renderCustomToolbar = () => (
        <span className="ql-formats flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200">
            {/* Heading formatting */}
            <select className="ql-header" defaultValue="">
                <option value="1">Heading 1 (H1)</option>
                <option value="2">Heading 2 (H2)</option>
                <option value="3">Heading 3 (H3)</option>
                <option value="">Normal Text</option>
            </select>

            <span className="w-[1px] h-5 bg-slate-300 mx-1" />

            {/* Basic formatting: Bold, Italic, Underline, Strike */}
            <button type="button" className="ql-bold" title="Bold (Ctrl+B)" />
            <button type="button" className="ql-italic" title="Italics (Ctrl+I)" />
            <button type="button" className="ql-underline" title="Underline (Ctrl+U)" />
            <button type="button" className="ql-strike" title="Strikethrough" />

            <span className="w-[1px] h-5 bg-slate-300 mx-1" />

            {/* Lists & Bullets */}
            <button
                type="button"
                className="ql-list"
                value="bullet"
                title="Bulleted List"
            />
            <button
                type="button"
                className="ql-list"
                value="ordered"
                title="Numbered List"
            />

            <span className="w-[1px] h-5 bg-slate-300 mx-1" />

            {/* Blockquote & Code */}
            <button type="button" className="ql-blockquote" title="Quote Block" />
            <button type="button" className="ql-code-block" title="Code Block" />

            <span className="w-[1px] h-5 bg-slate-300 mx-1" />

            {/* Alignments */}
            <button type="button" className="ql-align" value="" title="Align Left" />
            <button
                type="button"
                className="ql-align"
                value="center"
                title="Align Center"
            />
            <button
                type="button"
                className="ql-align"
                value="right"
                title="Align Right"
            />
            <button
                type="button"
                className="ql-align"
                value="justify"
                title="Justify"
            />

            <span className="w-[1px] h-5 bg-slate-300 mx-1" />

            {/* Clean & Links */}
            <button type="button" className="ql-link" title="Insert Link" />
            <button type="button" className="ql-clean" title="Clear Formatting" />
        </span>
    );

    const wordCount = formData.content
        ? formData.content
              .replace(/<[^>]+>/g, " ")
              .trim()
              .split(/\s+/)
              .filter(Boolean).length
        : 0;
    const readTimeEstimate = Math.max(1, Math.ceil(wordCount / 200));

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/admin/blogs")}
                        className="rounded-xl hover:bg-slate-100">
                        <ArrowLeft className="w-5 h-5 text-slate-700" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-blue-950 flex items-center gap-2">
                            <FileText className="w-6 h-6 text-orange-500" />
                            {isEditing ? "Edit Blog Article" : "Create New Blog Post"}
                        </h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            WordPress-style visual editor with headings, bold, italics, bullets, and subheadings.
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/admin/blogs")}
                        className="rounded-xl text-xs">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl shadow-md text-xs font-semibold flex items-center gap-2">
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                {isEditing ? "Update Article" : "Publish Article"}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-6">
                {/* Title & Subtitle Card */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-5">
                    {/* Post Title */}
                    <div>
                        <Label
                            htmlFor="title"
                            className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                            Article Title *
                        </Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter a compelling headline..."
                            required
                            className="text-xl md:text-2xl font-bold py-6 px-4 rounded-xl border-slate-200 focus:border-blue-500"
                        />
                    </div>

                    {/* Post Subtitle (WordPress-style sub-heading) */}
                    <div>
                        <Label
                            htmlFor="subtitle"
                            className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-1.5">
                            <Type className="w-3.5 h-3.5 text-blue-600" />
                            Subtitle / Sub-heading
                        </Label>
                        <Input
                            id="subtitle"
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            placeholder="Add a secondary summary line that appears right below the main title..."
                            className="text-base text-slate-700 py-3 px-4 rounded-xl border-slate-200"
                        />
                    </div>

                    {/* Slug & Author & Tags */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                        <div>
                            <Label
                                htmlFor="slug"
                                className="text-xs font-semibold text-slate-600">
                                URL Slug (Permalink) *
                            </Label>
                            <Input
                                id="slug"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                placeholder="article-url-slug"
                                required
                                className="mt-1 text-xs font-mono"
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="author"
                                className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-400" />
                                Author Name
                            </Label>
                            <Input
                                id="author"
                                name="author"
                                value={formData.author}
                                onChange={handleChange}
                                placeholder="Resonance Team"
                                className="mt-1 text-xs"
                            />
                        </div>

                        <div>
                            <Label
                                htmlFor="tags"
                                className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                                <Tag className="w-3 h-3 text-slate-400" />
                                Categories / Tags (comma separated)
                            </Label>
                            <Input
                                id="tags"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                placeholder="Skills, Innovation, Startups"
                                className="mt-1 text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* Body Content (WordPress Style Rich Text Editor) */}
                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                            <h2 className="text-base font-bold text-blue-950">
                                Article Body & Formatting
                            </h2>
                            <p className="text-xs text-slate-500">
                                Format with headings, bold, italics, lists, and quotes.
                            </p>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-3">
                            <span>
                                <strong>{wordCount}</strong> words
                            </span>
                            <span>•</span>
                            <span>
                                <strong>~{readTimeEstimate}</strong> min read
                            </span>
                        </div>
                    </div>

                    {/* Quill Editor */}
                    <div className="min-h-[420px] rounded-xl overflow-hidden border border-slate-200">
                        <Editor
                            id="content"
                            value={formData.content}
                            headerTemplate={renderCustomToolbar()}
                            onTextChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    content: e.htmlValue || "",
                                }))
                            }
                            style={{ height: "360px", fontSize: "15px" }}
                            placeholder="Write your article content here. Use the toolbar above for bold, italics, bullet points, and headers..."
                        />
                    </div>
                </div>

                {/* Featured Image & Excerpt */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Featured Image */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                        <h3 className="text-sm font-bold text-blue-950">
                            Featured Header Image
                        </h3>

                        {/* Image Preview */}
                        <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center relative">
                            {formData.image ? (
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center p-4 text-slate-400 text-xs">
                                    No featured image chosen yet
                                </div>
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-xs font-semibold">
                                    Uploading...
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <label className="cursor-pointer inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">
                                <Upload className="w-4 h-4" />
                                Upload Image from Computer
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>

                            <div className="relative">
                                <span className="text-[11px] font-semibold text-slate-500 block mb-1">
                                    Or paste an online Image URL:
                                </span>
                                <Input
                                    id="image"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleChange}
                                    placeholder="https://images.unsplash.com/..."
                                    className="text-xs"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Excerpt / Summary */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-3 flex flex-col justify-between">
                        <div>
                            <h3 className="text-sm font-bold text-blue-950 mb-1">
                                Short Excerpt (Preview text)
                            </h3>
                            <p className="text-xs text-slate-500 mb-3">
                                A brief 1-2 sentence teaser shown on blog archive cards.
                            </p>
                            <Textarea
                                id="excerpt"
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                placeholder="Leave blank to automatically use subtitle or first paragraph..."
                                rows={5}
                                className="text-xs resize-none"
                            />
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span>Status: Ready to publish</span>
                            <Button
                                type="submit"
                                className="bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold">
                                {isEditing ? "Save Changes" : "Publish Post"}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BlogEditor;
