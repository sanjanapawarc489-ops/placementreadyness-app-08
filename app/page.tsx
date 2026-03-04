"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, History, Code, Video, BarChart3, ChevronRight } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      title: "Practice Problems",
      description: "Solve coding challenges across multiple difficulty levels",
      icon: <Code className="h-6 w-6 text-primary" />,
      color: "bg-blue-500/10",
    },
    {
      title: "Mock Interviews",
      description: "Simulate real interview scenarios with AI feedback",
      icon: <Video className="h-6 w-6 text-primary" />,
      color: "bg-purple-500/10",
    },
    {
      title: "Track Progress",
      description: "Monitor your improvement with detailed analytics",
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      color: "bg-indigo-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold tracking-tight">Placement Readiness</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-sm" onClick={() => router.push("/dashboard")}>
              Dashboard
            </Button>
            <Button variant="ghost" className="text-sm" onClick={() => router.push("/history")}>
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Button className="rounded-full shadow-lg shadow-primary/20" onClick={() => router.push("/analyze")}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] right-[-10%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-[100px]" />
          </div>

          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold text-[#0F172A] mb-6 tracking-tight">
              Ace Your Placement
            </h1>
            <p className="text-xl md:text-2xl text-[#64748B] mb-10 max-w-2xl mx-auto">
              Practice, assess, and prepare for your dream job
            </p>
            <Button
              size="lg"
              className="h-14 px-10 rounded-xl text-lg font-semibold bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-xl shadow-slate-200 transition-all hover:scale-105 active:scale-95"
              onClick={() => router.push("/analyze")}
            >
              Get Started
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="border-none shadow-sm hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm group cursor-pointer"
                  onClick={() => router.push("/analyze")}
                >
                  <CardContent className="p-8">
                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-3">{feature.title}</h3>
                    <p className="text-[#64748B] leading-relaxed mb-6">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-primary font-medium text-sm group-hover:translate-x-1 transition-transform">
                      Explore {feature.title} <ChevronRight className="h-4 w-4 ml-1" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Trust/Social Proof (Optional but looks premium) */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-12">Trusted by students worldwide</h2>
            <div className="flex flex-wrap justify-center gap-12 opacity-40 grayscale">
              {/* Placeholders for logos if needed, but keeping it clean for now */}
              <div className="text-2xl font-black">GOOGLE</div>
              <div className="text-2xl font-black">AMAZON</div>
              <div className="text-2xl font-black">META</div>
              <div className="text-2xl font-black">MICROSOFT</div>
              <div className="text-2xl font-black">APPLE</div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-bold">Placement Readiness</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2024 Placement Readiness Platform. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-600 font-medium">
            <button className="hover:text-primary transition-colors">Privacy</button>
            <button className="hover:text-primary transition-colors">Terms</button>
            <button className="hover:text-primary transition-colors">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
