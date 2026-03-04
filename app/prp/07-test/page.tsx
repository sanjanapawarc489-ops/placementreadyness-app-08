"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, CheckCircle2, AlertTriangle, RotateCcw, ArrowRight } from "lucide-react";
import { ChecklistItem, getChecklist, saveChecklist, resetChecklist, getPassCount } from "@/lib/checklist";

export default function TestPage() {
    const router = useRouter();
    const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setChecklist(getChecklist());
        setMounted(true);
    }, []);

    const handleToggle = (id: string) => {
        const updated = checklist.map((item) =>
            item.id === id ? { ...item, checked: !item.checked } : item
        );
        setChecklist(updated);
        saveChecklist(updated);
    };

    const handleReset = () => {
        resetChecklist();
        const fresh = getChecklist();
        setChecklist(fresh);
    };

    if (!mounted) return null;

    const passedCount = checklist.filter((item) => item.checked).length;
    const allPassed = passedCount === checklist.length;

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
                        <Button variant="ghost" onClick={() => router.push("/prp/08-ship")}>
                            Ship Platform
                        </Button>
                    </nav>
                </div>
            </header>

            <div className="max-w-3xl mx-auto p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Test Checklist</h1>
                    <p className="text-muted-foreground">
                        Complete all tests below before the platform can be processed for shipping.
                    </p>
                </div>

                {/* Summary Card */}
                <Card className={`mb-6 border-2 ${allPassed ? 'border-green-500/20 bg-green-500/5' : 'border-amber-500/20 bg-amber-500/5'}`}>
                    <CardHeader className="pb-3 flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-2xl">Tests Passed: {passedCount} / {checklist.length}</CardTitle>
                            {!allPassed && (
                                <CardDescription className="text-amber-600 dark:text-amber-400 font-medium mt-1">
                                    <AlertTriangle className="h-4 w-4 inline mr-2" />
                                    Fix issues before shipping.
                                </CardDescription>
                            )}
                            {allPassed && (
                                <CardDescription className="text-green-600 dark:text-green-400 font-medium mt-1">
                                    <CheckCircle2 className="h-4 w-4 inline mr-2" />
                                    All systems ready for shipping!
                                </CardDescription>
                            )}
                        </div>
                        <div className={`p-3 rounded-full ${allPassed ? 'bg-green-500/10 text-green-600' : 'bg-amber-500/10 text-amber-600'}`}>
                            {allPassed ? <CheckCircle2 className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />}
                        </div>
                    </CardHeader>
                </Card>

                {/* Checklist */}
                <div className="space-y-4 mb-8">
                    {checklist.map((item) => (
                        <Card
                            key={item.id}
                            className={`cursor-pointer transition-all hover:bg-card/80 ${item.checked ? 'border-green-500/10 bg-green-500/5' : 'hover:border-primary/20'}`}
                            onClick={() => handleToggle(item.id)}
                        >
                            <CardContent className="p-4 flex items-start gap-4">
                                <div
                                    className={`mt-1 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${item.checked ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30 bg-background'}`}
                                >
                                    {item.checked && <CheckCircle2 className="h-4 w-4" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-semibold ${item.checked ? 'text-foreground' : 'text-foreground/90'}`}>
                                        {item.label}
                                    </h3>
                                    {item.hint && (
                                        <p className="text-sm text-muted-foreground mt-1 font-normal italic">
                                            How to test: {item.hint}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <Button variant="outline" onClick={handleReset} className="w-full sm:w-auto">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Checklist
                    </Button>
                    <Button
                        disabled={!allPassed}
                        onClick={() => router.push("/prp/08-ship")}
                        className="w-full sm:w-auto px-8"
                    >
                        Procced to Shipping
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
