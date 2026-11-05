import { useState } from "react";
import { Plus, Edit, Trash2, ExternalLink, FileText, Calendar, User, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useSiteBlogs, deleteStoredBlog, BlogPost } from "@/lib/siteData";

const BlogList = () => {
    const blogs = useSiteBlogs();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBlogs = blogs.filter(
        (b) =>
            b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (b.subtitle && b.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (b.author && b.author.toLowerCase().includes(searchQuery.toLowerCase())),
    );

    const handleDelete = async (blog: BlogPost) => {
        if (window.confirm(`Are you sure you want to delete "${blog.title}"?`)) {
            deleteStoredBlog(blog._id);

            // Optional Netlify delete sync
            try {
                await fetch(`/.netlify/functions/manage-blogs?id=${blog._id}`, {
                    method: "DELETE",
                });
            } catch (e) {
                // Ignore in local dev
            }

            toast.success(`Deleted blog post "${blog.title}"`);
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-blue-900 tracking-tight flex items-center gap-3">
                        <FileText className="w-8 h-8 text-orange-500" />
                        Manage Blog Articles
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Create, format, edit, and publish articles displayed on the website.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/blog" target="_blank">
                        <Button
                            variant="outline"
                            className="rounded-xl text-xs flex items-center gap-1.5 border-slate-200 text-slate-700">
                            <ExternalLink className="w-3.5 h-3.5" />
                            View Blog Page
                        </Button>
                    </Link>
                    <Link to="/admin/blogs/new">
                        <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-xl shadow-md text-xs font-semibold flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            New Blog Post
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search posts by title, subtitle, or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-gray-50 border-gray-200 rounded-lg text-sm"
                    />
                </div>
                <div className="text-xs text-gray-500 font-medium">
                    Showing <span className="font-semibold text-blue-900">{filteredBlogs.length}</span> of {blogs.length} articles
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/70 border-b border-slate-100">
                        <TableRow>
                            <TableHead className="w-[45%] text-xs font-bold uppercase text-slate-500">
                                Article Details
                            </TableHead>
                            <TableHead className="text-xs font-bold uppercase text-slate-500">
                                Author
                            </TableHead>
                            <TableHead className="text-xs font-bold uppercase text-slate-500">
                                Date Published
                            </TableHead>
                            <TableHead className="text-right text-xs font-bold uppercase text-slate-500">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBlogs.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center py-12 text-slate-400">
                                    <FileText className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                                    No blog articles found. Click "New Blog Post" to publish your first one!
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBlogs.map((blog) => (
                                <TableRow
                                    key={blog._id}
                                    className="hover:bg-slate-50/80 transition-colors">
                                    <TableCell className="py-4">
                                        <div className="flex items-start gap-3">
                                            {blog.image && (
                                                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                                                    <img
                                                        src={blog.image}
                                                        alt={blog.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div>
                                                <Link
                                                    to={`/blog/${blog.slug}`}
                                                    target="_blank"
                                                    className="font-bold text-blue-950 hover:text-blue-700 transition-colors line-clamp-1 text-sm flex items-center gap-1 group">
                                                    <span>{blog.title}</span>
                                                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 text-blue-500 transition-opacity" />
                                                </Link>
                                                {blog.subtitle && (
                                                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                                        {blog.subtitle}
                                                    </p>
                                                )}
                                                <div className="flex flex-wrap gap-1 mt-1.5">
                                                    {blog.tags?.map((t) => (
                                                        <span
                                                            key={t}
                                                            className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                                                            {t}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-600 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-slate-400" />
                                            {blog.author || "Resonance Team"}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-xs text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                            {new Date(blog.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1.5">
                                            <Link to={`/admin/blogs/edit/${blog._id}`}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2.5 text-xs text-blue-600 hover:bg-blue-50 font-medium flex items-center gap-1">
                                                    <Edit className="w-3.5 h-3.5" />
                                                    Edit
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(blog)}
                                                className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                                title="Delete Article">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default BlogList;
