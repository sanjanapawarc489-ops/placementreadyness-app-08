"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getHistory, HistoryEntry, deleteHistoryEntry, clearHistory } from "@/lib/storage";
import { 
  Sparkles, 
  Building2, 
  Briefcase, 
  Calendar, 
  Clock, 
  Trash2, 
  FileText, 
  ArrowRight, 
  History as HistoryIcon,
  AlertTriangle,
  Plus,
  RotateCcw
} from "lucide-react";

// Circular Progress Component for scores
function SmallCircularProgress({ score, maxScore }: { score: number; maxScore: number }) {
  const radius = 20;
  const strokeWidth = 3;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / maxScore) * circumference;

  // Determine color based on score
  let strokeColor = "hsl(var(--destructive))";
  if (score >= 70) strokeColor = "hsl(142, 76%, 36%)"; // green
  else if (score >= 50) strokeColor = "hsl(38, 92%, 50%)"; // orange

  return (
    <div className="relative w-10 h-10">
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
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold text-foreground">{score}</span>
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    setEntries(getHistory());
    setLoading(false);
  }, []);

  const handleViewDetails = (id: string) => {
    router.push(`/results?id=${id}`);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteHistoryEntry(id);
      setEntries(getHistory());
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      // Reset after 3 seconds
      setTimeout(() => {
        if (deleteConfirm === id) {
          setDeleteConfirm(null);
        }
      }, 3000);
    }
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to delete all history? This cannot be undone.")) {
      clearHistory();
      setEntries([]);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Clock className="h-8 w-8 animate-spin text-primary" />
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
            <h1 className="text-xl font-bold">Placement Readiness</h1>
          </div>
          <nav className="flex gap-4">
            <Button variant="ghost" onClick={() => router.push("/")}>
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => router.push("/analyze")}>
              Analyze JD
            </Button>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
                <HistoryIcon className="h-8 w-8" />
                Analysis History
              </h1>
              <p className="text-muted-foreground">
                {entries.length} analyses saved in your history
              </p>
            </div>
            {entries.length > 0 && (
              <Button variant="outline" onClick={handleClearAll} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Clear All
              </Button>
            )}
          </div>
        </div>

        {entries.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Analysis History</h2>
              <p className="text-muted-foreground mb-4">
                You haven&apos;t analyzed any job descriptions yet. Your analyses will appear here.
              </p>
              <Button onClick={() => router.push("/analyze")} className="gap-2">
                <Plus className="h-4 w-4" />
                Analyze a Job Description
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <SmallCircularProgress score={entry.readinessScore} maxScore={100} />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <h3 className="font-semibold text-foreground">{entry.company}</h3>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{entry.role}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {formatDate(entry.createdAt)} at {formatTime(entry.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.generalFresherStack && (
                      <Badge variant="outline" className="text-xs">
                        General Fresher
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(entry.id)}
                      className="gap-2"
                    >
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(entry.id)}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      {deleteConfirm === entry.id ? (
                        <AlertTriangle className="h-4 w-4" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
