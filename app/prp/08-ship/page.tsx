"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Lock, ArrowLeft, CheckCircle2, PackageCheck, Send, Rocket } from "lucide-react";
import { allTestsPassed, getPassCount } from "@/lib/checklist";

export default function ShipPage() {
    const router = useRouter();
    const [isLocked, setIsLocked] = useState(true);
    const [passCount, setPassCount] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const passed = allTestsPassed();
        setIsLocked(!passed);
        setPassCount(getPassCount());
        setMounted(true);
    }, []);

    if (!mounted) return null;

    if (isLocked) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-6">
                <Card className="max-w-md w-full border-destructive/20 bg-destructive/5 text-center p-8">
                    <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
                        <Lock className="h-8 w-8 text-destructive" />
                    </div>
                    <CardHeader className="pt-0">
                        <CardTitle className="text-2xl font-bold">Shipping Module Locked</CardTitle>
                        <CardDescription className="text-lg mt-2 text-foreground">
                            Deployment is disabled because testing is incomplete.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="p-4 bg-muted rounded-lg font-medium">
                            Tests Passed: {passCount} / 10
                        </div>
                        <p className="text-sm text-muted-foreground">
                            All 10 quality checks must be passed to unlock the shipping pipeline.
                            Please return to the Test Checklist and complete the remaining items.
                        </p>
                        <Button onClick={() => router.push("/prp/07-test")} className="w-full h-12 text-lg">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Return to Checklist
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-bold">PRP Deployment Center</h1>
                    </div>
                    <nav className="flex gap-4">
                        <Button variant="ghost" onClick={() => router.push("/")}>
                            Dashboard
                        </Button>
                        <Button variant="ghost" onClick={() => router.push("/prp/07-test")}>
                            Checklist
                        </Button>
                    </nav>
                </div>
            </header>

            <div className="max-w-4xl mx-auto p-6">
                <div className="mb-12 text-center">
                    <div className="mx-auto w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                        <PackageCheck className="h-10 w-10 text-green-600" />
                    </div>
                    <h1 className="text-4xl font-bold text-foreground mb-4">Ready for Shipment</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Your Placement Readiness Platform has passed all 10 quality tests.
                        The deployment pipeline is now unlocked and ready to process.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <Card className="border-2 border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Rocket className="h-5 w-5 text-primary" />
                                Next.js Optimized
                            </CardTitle>
                            <CardDescription>Server-side rendering and static generation</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" /> Bundle optimized: 1.2MB
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" /> Performance score: 98/100
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Send className="h-5 w-5 text-primary" />
                                Vercel Pipeline
                            </CardTitle>
                            <CardDescription>Continuous Deployment Hook active</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" /> Webhook connected
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" /> SSL Certificate valid
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                {/* SHIP BUTTON */}
                <div className="flex justify-center">
                    <Button size="lg" className="h-16 px-12 text-xl font-bold group shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
                        <Rocket className="h-6 w-6 mr-3 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                        SHIP NOW
                    </Button>
                </div>
            </div>
        </div>
    );
}
