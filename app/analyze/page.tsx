"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { extractSkills } from "@/lib/skills";
import { analyzeJD } from "@/lib/analysis";
import { saveToHistory } from "@/lib/storage";
import { Building2, Briefcase, FileText, Loader2, Sparkles } from "lucide-react";

export default function AnalyzePage() {
  const router = useRouter();
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!jdText.trim()) {
      setError("Please enter a job description");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      // Extract skills from JD
      const extractedSkills = extractSkills(jdText);

      // Perform analysis
      const analysisResult = analyzeJD(jdText, company, role, extractedSkills);

      // Save to history
      const entry = saveToHistory(company, role, jdText, analysisResult);

      // Navigate to results page with the entry ID
      router.push(`/results?id=${entry.id}`);
    } catch (err) {
      console.error("Analysis error:", err);
      setError("An error occurred during analysis. Please try again.");
      setIsAnalyzing(false);
    }
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
            <Button variant="ghost" onClick={() => router.push("/history")}>
              History
            </Button>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Analyze Job Description
          </h1>
          <p className="text-muted-foreground">
            Paste a job description to get a personalized preparation plan
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              Enter the company and role information along with the job description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company and Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Company Name
                </Label>
                <Input
                  id="company"
                  placeholder="e.g., Google, Microsoft, Amazon"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Role / Position
                </Label>
                <Input
                  id="role"
                  placeholder="e.g., Software Engineer, Full Stack Developer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <Label htmlFor="jd" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Job Description
              </Label>
              <Textarea
                id="jd"
                placeholder="Paste the full job description here. Include requirements, skills needed, and responsibilities..."
                className="min-h-[300px] resize-none"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {jdText.length} characters
                {jdText.length > 800 && (
                  <span className="text-green-600 ml-2">
                    ✓ Detailed JD detected (+10 readiness points)
                  </span>
                )}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                {error}
              </div>
            )}

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyze & Generate Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mt-6 bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3">Tips for best results:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Paste the complete job description including requirements and responsibilities
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Longer JDs (&gt;800 characters) give more accurate skill detection
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                Include company and role for a personalized readiness score
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">•</span>
                All analysis is done locally - your data never leaves your browser
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
