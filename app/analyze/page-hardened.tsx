"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { analyzeJD } from "@/lib/analysis-hardened";
import { saveToHistory } from "@/lib/storage-hardened";
import {
  FileText,
  Building2,
  Briefcase,
  Sparkles,
  AlertCircle,
  CheckCircle
} from "lucide-react";

export default function AnalyzeJD() {
  const router = useRouter();
  const [jdText, setJdText] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [jdWarning, setJdWarning] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setJdWarning(false);

    // Validate JD text (required)
    if (!jdText.trim()) {
      setError("Job description is required");
      return;
    }

    // Check JD length (minimum 200 characters)
    if (jdText.trim().length < 200) {
      setJdWarning(true);
      // Don't prevent submission, just show warning
    }

    setLoading(true);

    try {
      // Analyze the job description
      const analysisResult = analyzeJD(jdText, company, role);

      // Save to history with full schema
      const historyEntry = (saveToHistory as any)(company, role, jdText, analysisResult);

      // Navigate to results page
      router.push(`/results?id=${historyEntry.id}`);
      setSuccess("Analysis completed successfully!");
    } catch (err) {
      console.error("Analysis error:", err);
      setError("Failed to analyze job description. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJdChange = (value: string) => {
    setJdText(value);
    // Clear warning when user starts typing
    if (jdWarning && value.length >= 200) {
      setJdWarning(false);
    }
    // Show warning when user types less than 200 chars
    if (value.length > 0 && value.length < 200) {
      setJdWarning(true);
    } else if (value.length === 0) {
      setJdWarning(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Placement Readiness</h1>
          </div>
          <Button variant="ghost" onClick={() => router.push("/")}>
            Dashboard
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Analyze Job Description
          </h1>
          <p className="text-muted-foreground">
            Paste a job description to get a personalized preparation plan and readiness score
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Job Description Analysis
                </CardTitle>
                <CardDescription>
                  Paste the complete job description for the most accurate analysis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="jdText">
                      Job Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="jdText"
                      placeholder="Paste the complete job description here..."
                      value={jdText}
                      onChange={(e) => handleJdChange(e.target.value)}
                      className="min-h-[300px]"
                      required
                    />
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {jdText.length} characters
                      </p>
                      {jdWarning && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="h-4 w-4" />
                          <span className="text-sm">
                            This JD is too short to analyze deeply. Paste full JD for better output.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="company"
                          placeholder="e.g., Google, Microsoft"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Role/Position</Label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="role"
                          placeholder="e.g., Software Engineer, SDE"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <p className="text-destructive text-sm">{error}</p>
                    </div>
                  )}

                  {success && (
                    <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <p className="text-success text-sm">{success}</p>
                      </div>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !jdText.trim()}
                  >
                    {loading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Job Description"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Info Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-primary">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Skill Detection</h3>
                    <p className="text-xs text-muted-foreground">
                      We identify required technical skills from the job description
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-primary">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Readiness Scoring</h3>
                    <p className="text-xs text-muted-foreground">
                      Get a personalized score based on detected skills and JD completeness
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-primary">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">Preparation Plan</h3>
                    <p className="text-xs text-muted-foreground">
                      Receive a 7-day study plan and interview checklist
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips for better results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Paste the complete job description for accurate skill detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Include company and role for a personalized readiness score</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Longer JDs (&gt;800 characters) give more accurate skill detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>All analysis is done locally - your data never leaves your browser</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}