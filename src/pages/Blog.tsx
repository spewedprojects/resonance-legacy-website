import { useQuery } from "@tanstack/react-query";
import { Calendar, User, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const Blog = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["public-blogs"],
        queryFn: async () => {
            const response = await fetch("/.netlify/functions/get-blogs");
            if (!response.ok) throw new Error("Failed to fetch blogs");
            return response.json();
        },
    });

    const blogs = data?.blogs || [];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#2E5C9D] to-[#1e3d6a] text-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Our Insights & Blog
                    </h1>
                    <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                        Stay updated with the latest trends in entrepreneurship,
                        skill development, and industry news.
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                            <p className="text-slate-500">
                                Loading interesting reads...
                            </p>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                No posts yet
                            </h2>
                            <p className="text-slate-500">
                                We're working on some exciting content. Check
                                back soon!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog: any) => (
                                <article
                                    key={blog._id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow flex flex-col">
                                    <div className="aspect-video relative overflow-hidden">
                                        <img
                                            src={
                                                blog.image ||
                                                "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1170&auto=format&fit=crop"
                                            }
                                            alt={blog.title}
                                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                        />
                                        {blog.tags && blog.tags.length > 0 && (
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                {blog.tags
                                                    .slice(0, 2)
                                                    .map((tag: string) => (
                                                        <span
                                                            key={tag}
                                                            className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                                                            {tag}
                                                        </span>
                                                    ))}
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(
                                                    blog.createdAt,
                                                ).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                {blog.author}
                                            </div>
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 hover:text-blue-700 transition-colors">
                                            <Link to={`/blog/${blog.slug}`}>
                                                {blog.title}
                                            </Link>
                                        </h2>
                                        <p className="text-slate-600 mb-6 line-clamp-3">
                                            {blog.excerpt ||
                                                blog.content
                                                    .substring(0, 150)
                                                    .replace(/<[^>]*>/g, "") +
                                                    "..."}
                                        </p>
                                        <div className="mt-auto">
                                            <Link to={`/blog/${blog.slug}`}>
                                                <Button
                                                    variant="ghost"
                                                    className="text-blue-700 font-bold p-0 hover:bg-transparent hover:text-blue-800 group">
                                                    Read More{" "}
                                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer - Consistent with Index.tsx */}
            <Footer />
        </div>
    );
};

export default Blog;
