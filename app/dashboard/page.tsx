"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts";
import { getMostRecentEntry } from "@/lib/storage";
import { Sparkles, Building2, Briefcase, FileText, History, ArrowRight, Plus } from "lucide-react";

// Circular Progress Component
function CircularProgress({ score, maxScore }: { score: number; maxScore: number }) {
    const radius = 80;
    const strokeWidth = 12;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (score / maxScore) * circumference;

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative">
                <svg
                    height={radius * 2}
                    width={radius * 2}
                    className="transform -rotate-90"
                >
                    {/* Background circle */}
                    <circle
                        stroke="hsl(var(--muted))"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                    {/* Progress circle */}
                    <circle
                        stroke="hsl(var(--primary))"
                        fill="transparent"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference + " " + circumference}
                        style={{
                            strokeDashoffset,
                            transition: "stroke-dashoffset 0.5s ease-in-out",
                        }}
                        strokeLinecap="round"
                        r={normalizedRadius}
                        cx={radius}
                        cy={radius}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-4xl font-bold text-foreground">
                        {score}/{maxScore}
                    </span>
                </div>
            </div>
            <p className="mt-4 text-muted-foreground text-sm">Readiness Score</p>
        </div>
    );
}

// Progress Bar Component
function ProgressBar({ current, total, label }: { current: number; total: number; label?: string }) {
    const percentage = (current / total) * 100;

    return (
        <div className="w-full">
            {label && (
                <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium">{current}/{total}</span>
                </div>
            )}
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
}

// Day Circle Component
function DayCircle({ day, active }: { day: string; active: boolean }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors ${active
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
            >
                {day.charAt(0)}
            </div>
            <span className="text-xs text-muted-foreground">{day}</span>
        </div>
    );
}

// Assessment Item Component
function AssessmentItem({
    title,
    date,
    time,
}: {
    title: string;
    date: string;
    time: string;
}) {
    return (
        <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
            <div className="flex-1">
                <h4 className="font-medium text-foreground">{title}</h4>
                <p className="text-sm text-muted-foreground">
                    {date}, {time}
                </p>
            </div>
        </div>
    );
}

export default function Dashboard() {
    const router = useRouter();
    const [recentEntry, setRecentEntry] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get the most recent analysis from history
        const entry = getMostRecentEntry();
        setRecentEntry(entry);
        setLoading(false);
    }, []);

    // Weekly activity data (Mon-Sun)
    const weeklyActivity = [
        { day: "Mon", active: true },
        { day: "Tue", active: true },
        { day: "Wed", active: true },
        { day: "Thu", active: false },
        { day: "Fri", active: true },
        { day: "Sat", active: false },
        { day: "Sun", active: false },
    ];

    // Mock skill data - will be updated with real data when we have an entry
    const skillData = [
        { subject: "DSA", score: 75, fullMark: 100 },
        { subject: "System Design", score: 60, fullMark: 100 },
        { subject: "Communication", score: 80, fullMark: 100 },
        { subject: "Resume", score: 85, fullMark: 100 },
        { subject: "Aptitude", score: 70, fullMark: 100 },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b bg-card">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        <h1 className="text-xl font-bold">Placement Readiness</h1>
                    </div>
                    <nav className="flex gap-4">
                        <Button variant="ghost" onClick={() => router.push("/")}>
                            Home
                        </Button>
                        <Button variant="ghost" onClick={() => router.push("/analyze")}>
                            <Plus className="h-4 w-4 mr-2" />
                            Analyze JD
                        </Button>
                        <Button variant="ghost" onClick={() => router.push("/history")}>
                            <History className="h-4 w-4 mr-2" />
                            History
                        </Button>
                    </nav>
                </div>
            </header>

            <div className="max-w-7xl mx-auto p-6">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Track your placement preparation progress and analyze job descriptions
                    </p>
                </div>

                {/* Recent Analysis Card */}
                {!loading && recentEntry && (
                    <Card className="mb-6 border-2 border-primary/20 bg-primary/5">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div>
                                    <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
                                        <Sparkles className="h-5 w-5 text-primary" />
                                        Recent Analysis
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                        <div className="flex items-center gap-1">
                                            <Building2 className="h-4 w-4" />
                                            <span>{recentEntry.company}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Briefcase className="h-4 w-4" />
                                            <span>{recentEntry.role}</span>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground">
                                        Click below to view your detailed analysis and preparation plan
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-primary">{recentEntry.readinessScore}</div>
                                        <div className="text-xs text-muted-foreground">Readiness Score</div>
                                    </div>
                                    <Button onClick={() => router.push(`/results?id=${recentEntry.id}`)}>
                                        View Details
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* 2-column grid layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 1. Overall Readiness */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Overall Readiness</CardTitle>
                            <CardDescription>Your placement preparation score</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center py-6">
                            {recentEntry ? (
                                <CircularProgress score={recentEntry.readinessScore} maxScore={100} />
                            ) : (
                                <CircularProgress score={35} maxScore={100} />
                            )}
                        </CardContent>
                    </Card>

                    {/* 2. Skill Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Skill Breakdown</CardTitle>
                            <CardDescription>Performance across different areas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                                        <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
                                        <Radar
                                            name="Skills"
                                            dataKey="score"
                                            stroke="hsl(var(--primary))"
                                            fill="hsl(var(--primary))"
                                            fillOpacity={0.3}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. Continue Practice */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Continue Practice</CardTitle>
                            <CardDescription>Pick up where you left off</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-foreground mb-1">
                                        Dynamic Programming
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Master the fundamentals of DP with practice problems
                                    </p>
                                </div>
                                <ProgressBar current={3} total={10} label="Progress" />
                                <Button className="w-full" onClick={() => recentEntry ? router.push(`/results?id=${recentEntry.id}`) : router.push("/analyze")}>Continue</Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 4. Weekly Goals */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Goals</CardTitle>
                            <CardDescription>Track your weekly progress</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <ProgressBar
                                    current={12}
                                    total={20}
                                    label="Problems Solved: 12/20 this week"
                                />
                                <div className="flex justify-between">
                                    {weeklyActivity.map((item) => (
                                        <DayCircle key={item.day} day={item.day} active={item.active} />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 5. Upcoming Assessments - Full width on mobile, spans both columns on desktop */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Upcoming Assessments</CardTitle>
                            <CardDescription>Your scheduled tests and reviews</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="divide-y divide-border">
                                <AssessmentItem
                                    title="DSA Mock Test"
                                    date="Tomorrow"
                                    time="10:00 AM"
                                />
                                <AssessmentItem
                                    title="System Design Review"
                                    date="Wed"
                                    time="2:00 PM"
                                />
                                <AssessmentItem
                                    title="HR Interview Prep"
                                    date="Friday"
                                    time="11:00 AM"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/analyze")}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <FileText className="h-10 w-10 text-primary mb-3" />
                            <h3 className="font-semibold mb-1">Analyze Job Description</h3>
                            <p className="text-sm text-muted-foreground">Get personalized prep plan</p>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => router.push("/history")}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <History className="h-10 w-10 text-primary mb-3" />
                            <h3 className="font-semibold mb-1">View History</h3>
                            <p className="text-sm text-muted-foreground">See all your analyses</p>
                        </CardContent>
                    </Card>
                    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => recentEntry ? router.push(`/results?id=${recentEntry.id}`) : router.push("/analyze")}>
                        <CardContent className="p-6 flex flex-col items-center text-center">
                            <Sparkles className="h-10 w-10 text-primary mb-3" />
                            <h3 className="font-semibold mb-1">Recent Analysis</h3>
                            <p className="text-sm text-muted-foreground">View latest results</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
