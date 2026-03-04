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
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="border-b bg-white">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-[#0F172A]">Deployment Center</h1>
                    </div>
                    <nav className="flex gap-4">
                        <Button variant="ghost" className="text-[#0F172A] font-medium" onClick={() => router.push("/dashboard")}>
                            Dashboard
                        </Button>
                    </nav>
                </div>
            </header>

            <div className="max-w-4xl mx-auto p-8 md:p-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-[#0F172A] mb-3 tracking-tight">Test Checklist</h1>
                    <p className="text-[#64748B] text-lg">
                        Complete all tests below before the platform can be processed for shipping.
                    </p>
                </div>

                {/* Summary Card */}
                <Card className={`mb-10 shadow-sm border-none rounded-2xl ${allPassed ? 'bg-[#ECFDF5]' : 'bg-[#FFFBEB]'}`}>
                    <CardContent className="p-10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-[#0F172A] mb-2">Tests Passed: {passedCount} / {checklist.length}</h2>
                                {allPassed ? (
                                    <div className="flex items-center gap-2 text-[#059669] font-semibold">
                                        <CheckCircle2 className="h-5 w-5" />
                                        All systems ready for shipping!
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-[#D97706] font-semibold">
                                        <AlertTriangle className="h-5 w-5" />
                                        Complete all tests to unlock shipping.
                                    </div>
                                )}

                                <div className="mt-8">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${allPassed ? 'bg-[#10B981] text-white shadow-lg shadow-green-200' : 'bg-white text-[#94A3B8] border-4 border-dashed'}`}>
                                        <CheckCircle2 className={`h-8 w-8 ${allPassed ? 'opacity-100' : 'opacity-30'}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Checklist */}
                <div className="space-y-6 mb-12">
                    {checklist.map((item) => (
                        <Card
                            key={item.id}
                            className={`border-[#E2E8F0] shadow-sm rounded-2xl cursor-pointer transition-all hover:border-primary/30 group ${item.checked ? 'bg-white' : 'bg-white'}`}
                            onClick={() => handleToggle(item.id)}
                        >
                            <CardContent className="p-6 flex items-start gap-5">
                                <div
                                    className={`mt-1 flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center transition-all ${item.checked ? 'bg-[#0F172A] border-[#0F172A] text-white' : 'border-[#E2E8F0] group-hover:border-[#94A3B8]'}`}
                                >
                                    {item.checked && <CheckCircle2 className="h-5 w-5" />}
                                    {!item.checked && <div className="w-1 h-1 rounded-full bg-slate-200" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className={`text-xl font-bold ${item.checked ? 'text-[#0F172A]' : 'text-[#1E293B]'}`}>
                                        {item.label}
                                    </h3>
                                    {item.hint && (
                                        <p className="text-[#64748B] mt-2 font-medium italic">
                                            How to test: {item.hint}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-8 border-t border-[#F1F5F9]">
                    <Button variant="ghost" onClick={handleReset} className="text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50">
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Checklist
                    </Button>
                    <Button
                        disabled={!allPassed}
                        size="lg"
                        onClick={() => router.push("/prp/08-ship")}
                        className={`px-10 h-14 rounded-xl font-bold shadow-xl transition-all ${allPassed ? 'bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-slate-200 scale-105' : 'bg-[#E2E8F0] text-[#94A3B8] shadow-none cursor-not-allowed'}`}
                    >
                        Proceed to Shipping
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
