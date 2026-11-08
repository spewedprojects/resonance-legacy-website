import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { syncFromCloud, recordVisitorHit } from "@/lib/siteData";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogList from "./pages/admin/BlogList";
import BlogEditor from "./pages/admin/BlogEditor";
import ManageTeam from "./pages/admin/ManageTeam";
import ManageAdvisory from "./pages/admin/ManageAdvisory";
import ManageContact from "./pages/admin/ManageContact";
import ManagePrograms from "./pages/admin/ManagePrograms";
import ManageServices from "./pages/admin/ManageServices";
import ManageGallery from "./pages/admin/ManageGallery";
import ManageEvents from "./pages/admin/ManageEvents";
import EventEditor from "./pages/admin/EventEditor";
import Enquiries from "./pages/admin/Enquiries";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";

const queryClient = new QueryClient();

const App = () => {
    useEffect(() => {
        // Record unique visitor hit & page view analytics
        recordVisitorHit();

        // Asynchronously sync content from cloud backend if available
        syncFromCloud();

        // SPA redirect handler for static hosts (AWS S3 404 fallback)
        try {
            const redirectPath = sessionStorage.getItem("spa_redirect_path");
            if (redirectPath) {
                sessionStorage.removeItem("spa_redirect_path");
                window.history.replaceState(null, "", redirectPath);
            }
        } catch (e) {
            // Ignore in restricted environments
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner position="top-right" richColors />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:id" element={<EventDetail />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />

                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="programs" element={<ManagePrograms />} />
                        <Route path="services" element={<ManageServices />} />
                        <Route path="gallery" element={<ManageGallery />} />
                        <Route path="events" element={<ManageEvents />} />
                        <Route path="events/new" element={<EventEditor />} />
                        <Route path="events/edit/:id" element={<EventEditor />} />
                        <Route path="team" element={<ManageTeam />} />
                        <Route path="advisory" element={<ManageAdvisory />} />
                        <Route path="contact" element={<ManageContact />} />
                        <Route path="enquiries" element={<Enquiries />} />
                        <Route path="blogs" element={<BlogList />} />
                        <Route path="blogs/new" element={<BlogEditor />} />
                        <Route path="blogs/edit/:id" element={<BlogEditor />} />
                    </Route>
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
    );
};

export default App;
