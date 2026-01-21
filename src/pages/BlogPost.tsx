import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, User, ArrowLeft, Loader2, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const BlogPost = () => {
    const { slug } = useParams();

    const { data, isLoading, error } = useQuery({
        queryKey: ["blog-post", slug],
        queryFn: async () => {
            const response = await fetch(
                `/.netlify/functions/get-blogs?slug=${slug}`,
            );
            if (!response.ok) throw new Error("Blog post not found");
            return response.json();
        },
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    if (error || !data?.blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-4xl font-bold text-slate-900 mb-4">
                    Post Not Found
                </h1>
                <p className="text-slate-500 mb-8">
                    The blog post you're looking for doesn't exist or has been
                    removed.
                </p>
                <Link to="/blog">
                    <Button className="bg-[#2E5C9D] hover:bg-[#1e3d6a]">
                        Back to Blog
                    </Button>
                </Link>
            </div>
        );
    }

    const blog = data.blog;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Header / Hero */}
            <header className="pt-32 pb-12 px-6 bg-slate-50 border-b">
                <div className="max-w-4xl mx-auto">
                    <Link
                        to="/blog"
                        className="inline-flex items-center text-blue-700 font-medium mb-8 hover:underline group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Blog
                    </Link>

                    <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-slate-500">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-slate-700">
                                {blog.author}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-orange-600" />
                            <span>
                                {new Date(blog.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                    },
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-12 px-6">
                <article className="max-w-4xl mx-auto">
                    {blog.image && (
                        <div className="rounded-3xl overflow-hidden mb-12 shadow-xl">
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-auto object-cover max-h-[500px]"
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-lg max-w-none text-slate-700 leading-relaxed
                        prose-headings:text-slate-900 prose-headings:font-bold
                        prose-p:mb-6 prose-li:mb-2
                        prose-a:text-blue-600 prose-a:font-medium hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t flex flex-wrap gap-3">
                            {blog.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold">
                                    <Tag className="w-4 h-4" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </article>
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default BlogPost;
