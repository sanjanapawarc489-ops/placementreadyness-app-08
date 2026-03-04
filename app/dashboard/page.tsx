"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";
import { getMostRecentEntry } from "@/lib/storage";

// Circular Progress Component - Refined to match image precisely
function CircularProgress({ score, maxScore }: { score: number; maxScore: number }) {
    const radius = 60;
    const strokeWidth = 14;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / maxScore) * circumference;

    return (
        <div className="flex flex-col items-center justify-center py-4">
            <div className="relative">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90"
                >
                    {/* Background circle */}
                    <circle
                        stroke="#F1F5F9"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Progress circle */}
                    <circle
                        stroke="#0F172A"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference + " " + circumference}
                        style={{
                            strokeDashoffset,
                            transition: "stroke-dashoffset 0.8s ease-out",
                        }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-[#0F172A]">
                        {score}/{maxScore}
                    </span>
                </div>
            </div>
            <p className="mt-6 text-[#64748B] text-sm">Readiness Score</p>
        </div>
    );
}

// Progress Bar Component - Refined for "Weekly Goals" to match image layout
function ProgressBar({ current, total, label }: { current: number; total: number; label?: string }) {
    const percentage = (current / total) * 100;

    return (
        <div className="w-full mt-4">
            {label && (
                <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-[#64748B]">{label}</span>
                    <span className="text-sm font-bold text-[#0F172A]">{current}/{total}</span>
                </div>
            )}
            <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#0F172A] rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [recentEntry, setRecentEntry] = useState<any>(null);

    useEffect(() => {
        const entry = getMostRecentEntry();
        setRecentEntry(entry);
    }, []);

    const skillData = [
        { subject: "DSA", score: 75 },
        { subject: "System Design", score: 60 },
        { subject: "Communication", score: 80 },
        { subject: "Resume", score: 85 },
        { subject: "Aptitude", score: 70 },
    ];

    return (
        <div className="min-h-screen bg-white p-8 md:p-12">
            <header className="mb-10 max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-[#0F172A] mb-2 tracking-tight">Dashboard</h1>
                <p className="text-[#64748B] text-lg">
                    Track your placement preparation progress and analyze job descriptions
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Overall Readiness */}
                <Card className="border-[#E2E8F0] shadow-sm rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold text-[#0F172A]">Overall Readiness</CardTitle>
                        <CardDescription className="text-[#64748B]">Your placement preparation score</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col items-center justify-center pt-6 pb-8">
                        <CircularProgress score={recentEntry?.readinessScore || 35} maxScore={100} />
                    </CardContent>
                </Card>

                {/* Skill Breakdown */}
                <Card className="border-[#E2E8F0] shadow-sm rounded-2xl overflow-hidden min-h-[300px] flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold text-[#0F172A]">Skill Breakdown</CardTitle>
                        <CardDescription className="text-[#64748B]">Performance across different areas</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 h-64 pt-6 pb-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                <PolarGrid stroke="#E2E8F0" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: "#64748B", fontSize: 12 }} />
                                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Skills"
                                    dataKey="score"
                                    stroke="#0F172A"
                                    fill="#94A3B8"
                                    fillOpacity={0.4}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Continue Practice */}
                <Card className="border-[#E2E8F0] shadow-sm rounded-2xl overflow-hidden flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold text-[#0F172A]">Continue Practice</CardTitle>
                        <CardDescription className="text-[#64748B]">Pick up where you left off</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 pb-8">
                        <h3 className="text-2xl font-extrabold text-[#0F172A] mb-2">Dynamic Programming</h3>
                        <p className="text-[#64748B]">Master the fundamentals of DP with practice problems</p>
                    </CardContent>
                </Card>

                {/* Weekly Goals */}
                <Card className="border-[#E2E8F0] shadow-sm rounded-2xl overflow-hidden flex flex-col">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-bold text-[#0F172A]">Weekly Goals</CardTitle>
                        <CardDescription className="text-[#64748B]">Track your weekly progress</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 pb-8">
                        <ProgressBar
                            current={12}
                            total={20}
                            label="Problems Solved: 12/20 this week"
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
