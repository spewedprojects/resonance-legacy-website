import { Calendar, User, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useSiteBlogs } from "@/lib/siteData";

const Blog = () => {
    const blogs = useSiteBlogs();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#2E5C9D] to-[#1e3d6a] text-white">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Our Insights & Articles
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                        Stay updated with the latest developments in entrepreneurship, employability, apprenticeships, and skilling programs.
                    </p>
                </div>
            </section>

            {/* Blog Grid */}
            <section className="py-20 px-6">
                <div className="max-w-7xl mx-auto">
                    {blogs.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-200">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                No posts yet
                            </h2>
                            <p className="text-slate-500">
                                We're working on exciting content. Check back soon!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogs.map((blog) => (
                                <article
                                    key={blog._id}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group border border-slate-100">
                                    <div className="aspect-video relative overflow-hidden bg-slate-100">
                                        <img
                                            src={
                                                blog.image ||
                                                "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1170&auto=format&fit=crop"
                                            }
                                            alt={blog.title}
                                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {blog.tags && blog.tags.length > 0 && (
                                            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                                                {blog.tags
                                                    .slice(0, 2)
                                                    .map((tag: string) => (
                                                        <span
                                                            key={tag}
                                                            className="bg-orange-600 text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                                            {tag}
                                                        </span>
                                                    ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                                                    {new Date(
                                                        blog.createdAt,
                                                    ).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <User className="w-3.5 h-3.5 text-orange-500" />
                                                    {blog.author}
                                                </div>
                                            </div>

                                            <h2 className="text-xl font-bold text-slate-900 mb-1.5 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                                                {blog.title}
                                            </h2>

                                            {blog.subtitle && (
                                                <p className="text-xs font-semibold text-blue-700 mb-3 line-clamp-2 leading-relaxed">
                                                    {blog.subtitle}
                                                </p>
                                            )}

                                            <p className="text-slate-600 text-sm line-clamp-3 mb-6 leading-relaxed">
                                                {blog.excerpt ||
                                                    blog.content
                                                        .replace(/<[^>]+>/g, " ")
                                                        .slice(0, 140) + "..."}
                                            </p>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                                            <Link
                                                to={`/blog/${blog.slug}`}
                                                className="text-blue-700 font-bold text-sm inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
                                                Read Article
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Blog;
