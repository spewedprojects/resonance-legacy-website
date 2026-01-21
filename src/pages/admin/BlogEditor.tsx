import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Editor } from "primereact/editor";

const BlogEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isEditing = !!id;

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        author: "Resonance Team",
        image: "",
        tags: "",
    });

    const { data: blogData, isLoading: isFetching } = useQuery({
        queryKey: ["blog", id],
        queryFn: async () => {
            const response = await fetch(`/.netlify/functions/get-blogs`);
            const data = await response.json();
            // Since get-blogs might not support fetching by ID yet in my implementation,
            // I'll filter on the client side for now or search by slug
            // Actually, I should probably update get-blogs to support ID or just fetch all and find.
            // But for efficiency, let's just find it in the cached 'blogs' if possible.
            const blog = data.blogs.find((b: any) => b._id === id);
            return blog;
        },
        enabled: isEditing,
    });

    useEffect(() => {
        if (blogData) {
            setFormData({
                title: blogData.title || "",
                slug: blogData.slug || "",
                content: blogData.content || "",
                excerpt: blogData.excerpt || "",
                author: blogData.author || "Resonance Team",
                image: blogData.image || "",
                tags: blogData.tags?.join(", ") || "",
            });
        }
    }, [blogData]);

    const mutation = useMutation({
        mutationFn: async (payload: any) => {
            const method = isEditing ? "PUT" : "POST";
            const body = isEditing ? { ...payload, id } : payload;

            const response = await fetch("/.netlify/functions/manage-blogs", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to save blog");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            toast.success(
                `Blog ${isEditing ? "updated" : "created"} successfully`,
            );
            navigate("/admin/blogs");
        },
        onError: (error: any) => {
            toast.error(error.message);
        },
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Auto-generate slug from title if it's a new post
        if (name === "title" && !isEditing) {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const payload = {
            ...formData,
            tags: formData.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
        };
        mutation.mutate(payload);
    };

    if (isEditing && isFetching) {
        return (
            <div className="p-8 text-center text-slate-500">
                Loading blog details...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/admin/blogs")}>
                    <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isEditing ? "Edit Blog Post" : "New Blog Post"}
                    </h1>
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 bg-white p-6 rounded-xl shadow-sm border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter blog title"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="slug">Slug (URL path)</Label>
                        <Input
                            id="slug"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="url-friendly-slug"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="author">Author</Label>
                        <Input
                            id="author"
                            name="author"
                            value={formData.author}
                            onChange={handleChange}
                            placeholder="Resonance Team"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                            placeholder="news, education, startup"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="image">Featured Image URL</Label>
                    <Input
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt (Short Summary)</Label>
                    <Textarea
                        id="excerpt"
                        name="excerpt"
                        value={formData.excerpt}
                        onChange={handleChange}
                        placeholder="Brief overview of the blog post..."
                        rows={3}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <div className="min-h-[400px]">
                        <Editor
                            id="content"
                            value={formData.content}
                            onTextChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    content: e.htmlValue || "",
                                }))
                            }
                            style={{ height: "320px" }}
                            placeholder="Write your blog content here..."
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/admin/blogs")}
                        disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        className="bg-orange-600 hover:bg-orange-700"
                        disabled={mutation.isPending}>
                        {mutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                {isEditing ? "Update Blog" : "Publish Blog"}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default BlogEditor;
