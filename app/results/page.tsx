"use client";

import { useEffect, useState, Suspense } from "react";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getHistoryEntry, HistoryEntry, updateHistoryEntryWithConfidence } from "@/lib/storage";
import { SKILL_CATEGORIES, SkillCategory } from "@/lib/skills";
import { recalculateReadinessScore, getWeakSkills } from "@/lib/analysis";
import { 
  Sparkles, 
  Building2, 
  Briefcase, 
  Calendar, 
  Target, 
  CheckCircle2, 
  Lightbulb,
  ArrowLeft,
  History,
  AlertCircle,
  Loader2,
  Check,
  Clock,
  Copy,
  Download,
  Play
} from "lucide-react";

// Circular Progress Component
function CircularProgress({ score, maxScore }: { score: number; maxScore: number }) {
  const radius = 70;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  // Determine color based on score
  let strokeColor = "hsl(var(--destructive))";
  if (score >= 70) strokeColor = "hsl(142, 76%, 36%)"; // green
  else if (score >= 50) strokeColor = "hsl(38, 92%, 50%)"; // orange

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="hsl(var(--muted))"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke={strokeColor}
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
          <span className="text-3xl font-bold text-foreground">{score}</span>
          <span className="text-xs text-muted-foreground">/ {maxScore}</span>
        </div>
      </div>
    </div>
  );
}

// Interactive Skill Tag Component
function InteractiveSkillTag({ 
  skill, 
  category, 
  confidence,
  onToggle
}: { 
  skill: string; 
  category: string;
  confidence: "know" | "practice";
  onToggle: (skill: string) => void;
}) {
  const colors: Record<string, string> = {
    coreCS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    languages: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    web: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    data: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    cloud: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
    testing: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  };

  const confidenceColors = {
    know: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-300",
    practice: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-300"
  };

  const confidenceIcon = confidence === "know" ? Check : Clock;
  const confidenceText = confidence === "know" ? "I know this" : "Need practice";

  return (
    <button
      onClick={() => onToggle(skill)}
      className={`
        ${colors[category] || "bg-gray-100"} 
        ${confidenceColors[confidence]}
        font-normal px-3 py-1 rounded-full text-sm border transition-all hover:scale-105
        flex items-center gap-1 cursor-pointer
      `}
      aria-label={`${skill}: ${confidenceText}`}
    >
      <span>{skill}</span>
      {React.createElement(confidenceIcon, { className: "h-3 w-3" })}
    </button>
  );
}

// Checklist Item Component
function ChecklistItem({ item }: { item: string }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
      <span className="text-sm text-foreground">{item}</span>
    </div>
  );
}

// Day Plan Component
function DayPlanCard({ day, title, tasks }: { day: number; title: string; tasks: string[] }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">{day}</span>
          </div>
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {tasks.map((task, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <span className="text-primary mt-1">•</span>
              {task}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

// Results Content Component
function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [entry, setEntry] = useState<HistoryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [skillConfidenceMap, setSkillConfidenceMap] = useState<Record<string, "know" | "practice">>({});
  const [currentScore, setCurrentScore] = useState<number>(0);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      const historyEntry = getHistoryEntry(id);
      if (historyEntry) {
        setEntry(historyEntry);
        setSkillConfidenceMap(historyEntry.skillConfidenceMap || {});
        setCurrentScore(historyEntry.readinessScore);
      }
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Placement Readiness</h1>
            </div>
            <nav className="flex gap-4">
              <Button variant="ghost" onClick={() => router.push("/")}>
                Dashboard
              </Button>
              <Button variant="ghost" onClick={() => router.push("/analyze")}>
                Analyze JD
              </Button>
              <Button variant="ghost" onClick={() => router.push("/history")}>
                History
              </Button>
            </nav>
          </div>
        </header>
        <div className="max-w-4xl mx-auto p-6">
          <Card className="mt-8">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Analysis Not Found</h2>
              <p className="text-muted-foreground mb-4">
                The analysis you&apos;re looking for doesn&apos;t exist or has been deleted.
              </p>
              <Button onClick={() => router.push("/analyze")}>
                Analyze a New JD
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle skill confidence toggle
  const handleSkillToggle = (skill: string) => {
    if (!entry) return;
    
    setSkillConfidenceMap(prev => {
      const newMap: Record<string, "know" | "practice"> = {
        ...prev,
        [skill]: prev[skill] === "know" ? "practice" : "know"
      };
      
      // Recalculate score
      const newScore = recalculateReadinessScore(entry.readinessScore, newMap);
      setCurrentScore(newScore);
      
      // Save to localStorage
      updateHistoryEntryWithConfidence(entry.id, newMap, newScore);
      
      return newMap;
    });
  };

  // Export functions
  const copyPlan = async () => {
    if (!entry) return;
    const planText = entry.plan.map(day => 
      `Day ${day.day}: ${day.title}\n${day.tasks.map(task => `- ${task}`).join('\n')}`
    ).join('\n\n');
    
    try {
      await navigator.clipboard.writeText(planText);
      setCopiedItem('plan');
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy plan:', err);
    }
  };

  const copyChecklist = async () => {
    if (!entry) return;
    const checklistText = entry.checklist.map(round => 
      `Round ${round.round}: ${round.title}\n${round.items.map(item => `- ${item}`).join('\n')}`
    ).join('\n\n');
    
    try {
      await navigator.clipboard.writeText(checklistText);
      setCopiedItem('checklist');
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy checklist:', err);
    }
  };

  const copyQuestions = async () => {
    if (!entry) return;
    const questionsText = entry.questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    
    try {
      await navigator.clipboard.writeText(questionsText);
      setCopiedItem('questions');
      setTimeout(() => setCopiedItem(null), 2000);
    } catch (err) {
      console.error('Failed to copy questions:', err);
    }
  };

  const downloadAll = () => {
    if (!entry) return;
    
    const content = `
PLACEMENT READINESS ANALYSIS
============================
Company: ${entry.company}
Role: ${entry.role}
Date: ${formatDate(entry.createdAt)}
Readiness Score: ${currentScore}/100

KEY SKILLS EXTRACTED:
${Object.entries(entry.extractedSkills)
  .filter(([_, skills]) => skills.length > 0)
  .map(([category, skills]) => `${SKILL_CATEGORIES[category as SkillCategory].name}: ${skills.join(', ')}`)
  .join('\n')}

7-DAY PREPARATION PLAN:
${entry.plan.map(day => 
  `Day ${day.day}: ${day.title}\n${day.tasks.map(task => `- ${task}`).join('\n')}`
).join('\n\n')}

ROUND CHECKLIST:
${entry.checklist.map(round => 
  `Round ${round.round}: ${round.title}\n${round.items.map(item => `- ${item}`).join('\n')}`
).join('\n\n')}

INTERVIEW QUESTIONS:
${entry.questions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `placement-readiness-${entry.company.replace(/\s+/g, '-')}-${entry.role.replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => router.push("/analyze")}>
              Analyze JD
            </Button>
            <Button variant="ghost" onClick={() => router.push("/history")}>
              History
            </Button>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4"
          onClick={() => router.push("/history")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to History
        </Button>

        {/* Header Info */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{formatDate(entry.createdAt)}</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Analysis Results
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>{entry.company}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>{entry.role}</span>
            </div>
          </div>
        </div>

        {/* Readiness Score */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <CircularProgress score={currentScore} maxScore={100} />
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-semibold mb-2">Readiness Score</h2>
                <p className="text-muted-foreground">
                  Based on the job description analysis, your readiness score is calculated
                  from detected skills, company details, and JD completeness.
                </p>
                {entry.readinessScore < 50 && (
                  <p className="text-sm text-amber-600 mt-2">
                    Consider adding more details to improve your score.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="skills" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="plan">7-Day Plan</TabsTrigger>
            <TabsTrigger value="questions">Questions</TabsTrigger>
          </TabsList>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Key Skills Extracted
                </CardTitle>
                <CardDescription>
                  {entry.generalFresherStack
                    ? "No specific skills detected. Showing general fresher stack."
                    : "Skills detected from the job description"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {entry.generalFresherStack ? (
                  <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      <AlertCircle className="h-4 w-4 inline mr-2" />
                      The JD didn&apos;t contain recognizable skill keywords. A general fresher preparation stack is shown.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(Object.keys(SKILL_CATEGORIES) as SkillCategory[]).map(
                      (category) =>
                        entry.extractedSkills[category].length > 0 && (
                          <div key={category}>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">
                              {SKILL_CATEGORIES[category].name}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {entry.extractedSkills[category].map((skill) => (
                                <InteractiveSkillTag
                                  key={skill}
                                  skill={skill}
                                  category={category}
                                  confidence={skillConfidenceMap[skill] || "practice"}
                                  onToggle={handleSkillToggle}
                                />
                              ))}
                            </div>
                          </div>
                        )
                    )}
                  </div>
                )}
                {entry.generalFresherStack && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">
                        General Fresher Stack
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <InteractiveSkillTag 
                          skill="DSA" 
                          category="coreCS" 
                          confidence={skillConfidenceMap["DSA"] || "practice"}
                          onToggle={handleSkillToggle}
                        />
                        <InteractiveSkillTag 
                          skill="OOP" 
                          category="coreCS" 
                          confidence={skillConfidenceMap["OOP"] || "practice"}
                          onToggle={handleSkillToggle}
                        />
                        <InteractiveSkillTag 
                          skill="DBMS" 
                          category="coreCS" 
                          confidence={skillConfidenceMap["DBMS"] || "practice"}
                          onToggle={handleSkillToggle}
                        />
                        <InteractiveSkillTag 
                          skill="Java/Python/C++" 
                          category="languages" 
                          confidence={skillConfidenceMap["Java/Python/C++"] || "practice"}
                          onToggle={handleSkillToggle}
                        />
                        <InteractiveSkillTag 
                          skill="Basic Web" 
                          category="web" 
                          confidence={skillConfidenceMap["Basic Web"] || "practice"}
                          onToggle={handleSkillToggle}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Checklist Tab */}
          <TabsContent value="checklist">
            <div className="grid gap-4">
              {entry.checklist.map((round) => (
                <Card key={round.round}>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Round {round.round}: {round.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="divide-y divide-border">
                      {round.items.map((item, index) => (
                        <ChecklistItem key={index} item={item} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Plan Tab */}
          <TabsContent value="plan">
            <div>
              <h3 className="text-lg font-semibold mb-4">Your 7-Day Preparation Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {entry.plan.map((day) => (
                  <div key={day.day} id={day.day === 1 ? 'day-1' : undefined}>
                    <DayPlanCard
                      day={day.day}
                      title={day.title}
                      tasks={day.tasks}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Questions Tab */}
          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Likely Interview Questions
                </CardTitle>
                <CardDescription>
                  Based on the detected skills, here are questions you should prepare for
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {entry.questions.map((question, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-foreground">{question}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Export Tools */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Tools
            </CardTitle>
            <CardDescription>
              Copy or download your preparation materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={copyPlan}
                variant={copiedItem === 'plan' ? "default" : "outline"}
                className="w-full"
              >
                {copiedItem === 'plan' ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy 7-day Plan
                  </>
                )}
              </Button>
              
              <Button 
                onClick={copyChecklist}
                variant={copiedItem === 'checklist' ? "default" : "outline"}
                className="w-full"
              >
                {copiedItem === 'checklist' ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Round Checklist
                  </>
                )}
              </Button>
              
              <Button 
                onClick={copyQuestions}
                variant={copiedItem === 'questions' ? "default" : "outline"}
                className="w-full"
              >
                {copiedItem === 'questions' ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy 10 Questions
                  </>
                )}
              </Button>
              
              <Button 
                onClick={downloadAll}
                variant="default"
                className="w-full"
              >
                <Download className="h-4 w-4 mr-2" />
                Download as TXT
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Action Next Box */}
        {entry && (
          <Card className="mt-6 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Lightbulb className="h-5 w-5" />
                Action Next
              </CardTitle>
              <CardDescription>
                Focus on these areas to improve your readiness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(() => {
                  const weakSkills = getWeakSkills(skillConfidenceMap);
                  const topWeakSkills = weakSkills.slice(0, 3);
                  
                  if (topWeakSkills.length > 0) {
                    return (
                      <>
                        <div>
                          <h3 className="font-medium text-foreground mb-2">Top skills to practice:</h3>
                          <div className="flex flex-wrap gap-2">
                            {topWeakSkills.map(skill => (
                              <Badge key={skill} variant="secondary" className="bg-amber-100 text-amber-800">
                                <Clock className="h-3 w-3 mr-1" />
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="bg-primary/5 p-4 rounded-lg">
                          <p className="text-primary font-medium flex items-center gap-2">
                            <Play className="h-4 w-4" />
                            Start Day 1 plan now to strengthen these skills
                          </p>
                          <Button 
                            onClick={() => {
                              // Scroll to Day 1 plan
                              const day1Element = document.getElementById('day-1');
                              if (day1Element) {
                                day1Element.scrollIntoView({ behavior: 'smooth' });
                              } else {
                                // Fallback: switch to plan tab
                                const planTab = document.querySelector('[data-state="inactive"][data-value="plan"]') as HTMLElement;
                                if (planTab) planTab.click();
                              }
                            }}
                            className="mt-3"
                          >
                            Start Day 1 Plan
                            <Play className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </>
                    );
                  } else {
                    return (
                      <div className="text-center py-4">
                        <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <p className="text-green-700 font-medium">Great job! You're confident in all skills.</p>
                        <p className="text-sm text-muted-foreground mt-1">Continue with your preparation plan.</p>
                      </div>
                    );
                  }
                })()}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Main page component with Suspense
export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
