
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Timer } from "./Timer";

export function LessonView() {
  const { moduleId } = useParams();
  const [progress, setProgress] = useState(0);

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-french-blue capitalize">
          {moduleId} Practice
        </h2>
        <Timer initialSeconds={1200} /> {/* 20 minutes timer */}
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Score</span>
            <span className="text-sm text-muted-foreground">0 points</span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />

        <Card className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Welcome to {moduleId} Practice!</h3>
            <p className="text-muted-foreground">
              This module will help you prepare for the {moduleId.toUpperCase()} section of your TEF/TCF exam.
            </p>
            <Button size="lg" onClick={() => setProgress(25)}>
              Start Lesson
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
