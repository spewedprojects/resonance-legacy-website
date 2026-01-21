import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const BlogList = () => {
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["blogs"],
        queryFn: async () => {
            const response = await fetch("/.netlify/functions/get-blogs");
            if (!response.ok) throw new Error("Failed to fetch blogs");
            return response.json();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await fetch(
                `/.netlify/functions/manage-blogs?id=${id}`,
                {
                    method: "DELETE",
                },
            );
            if (!response.ok) throw new Error("Failed to delete blog");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["blogs"] });
            toast.success("Blog deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to delete blog");
        },
    });

    const handleDelete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8 text-center text-slate-500">
                Loading blogs...
            </div>
        );
    }

    const blogs = data?.blogs || [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Manage Blogs
                    </h1>
                    <p className="text-slate-500">
                        Create, edit, and delete your blog posts.
                    </p>
                </div>
                <Link to="/admin/blogs/new">
                    <Button className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="w-4 h-4 mr-2" />
                        New Blog Post
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {blogs.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="text-center py-8 text-slate-500">
                                    No blogs found. Create your first post!
                                </TableCell>
                            </TableRow>
                        ) : (
                            blogs.map((blog: any) => (
                                <TableRow key={blog._id}>
                                    <TableCell className="font-medium">
                                        {blog.title}
                                    </TableCell>
                                    <TableCell>{blog.author}</TableCell>
                                    <TableCell>
                                        {new Date(
                                            blog.createdAt,
                                        ).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link
                                            to={`/blog/${blog.slug}`}
                                            target="_blank">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="View Publicly">
                                                <ExternalLink className="w-4 h-4 text-blue-600" />
                                            </Button>
                                        </Link>
                                        <Link
                                            to={`/admin/blogs/edit/${blog._id}`}>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                title="Edit">
                                                <Edit className="w-4 h-4 text-slate-600" />
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleDelete(blog._id)
                                            }
                                            title="Delete">
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
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
