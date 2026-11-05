import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { useSiteBlogs } from "@/lib/siteData";

const BlogPost = () => {
    const { slug } = useParams();
    const blogs = useSiteBlogs();

    const blog = blogs.find((b) => b.slug === slug);

    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50">
                <Navbar />
                <div className="max-w-md mx-auto py-32">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Post Not Found
                    </h1>
                    <p className="text-slate-500 mb-8">
                        The blog post you're looking for doesn't exist or has been moved.
                    </p>
                    <Link to="/blog">
                        <Button className="bg-[#2E5C9D] hover:bg-[#1e3d6a] text-white">
                            Back to Blog
                        </Button>
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Header / Hero */}
            <header className="pt-32 pb-12 px-6 bg-slate-50 border-b border-slate-100">
                <div className="max-w-4xl mx-auto">
                    <Link
                        to="/blog"
                        className="inline-flex items-center text-blue-700 font-semibold mb-6 hover:underline group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Articles
                    </Link>

                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-3 leading-tight tracking-tight">
                        {blog.title}
                    </h1>

                    {blog.subtitle && (
                        <p className="text-lg md:text-2xl text-blue-900/80 font-medium mb-6 leading-relaxed">
                            {blog.subtitle}
                        </p>
                    )}

                    <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm pt-2 border-t border-slate-200/60">
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-600" />
                            <span className="font-semibold text-slate-700">
                                {blog.author}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-orange-600" />
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
                        <div className="rounded-3xl overflow-hidden mb-12 shadow-xl border border-slate-100">
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full h-auto object-cover max-h-[500px]"
                            />
                        </div>
                    )}

                    <div
                        className="prose prose-lg max-w-none text-slate-800 leading-relaxed
                        prose-headings:text-slate-950 prose-headings:font-bold
                        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                        prose-p:mb-6 prose-li:mb-2 prose-ul:my-6 prose-ol:my-6
                        prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-4 prose-blockquote:italic
                        prose-a:text-blue-600 prose-a:font-semibold hover:prose-a:underline"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {blog.tags && blog.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-2.5">
                            {blog.tags.map((tag: string) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                                    <Tag className="w-3.5 h-3.5" />
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
