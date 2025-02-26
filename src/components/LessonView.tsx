
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Timer } from "./Timer";
import { WritingPrompt } from "./WritingPrompt";
import { WritingEditor } from "./WritingEditor";
import { FeedbackDisplay } from "./FeedbackDisplay";
import { useToast } from "./ui/use-toast";

const WRITING_PROMPTS = [
  {
    prompt: "Décrivez votre ville idéale pour vivre et travailler.",
    description: "Write about your ideal city to live and work in. Consider aspects like transportation, culture, and quality of life.",
    wordLimit: 150,
  },
  // Add more prompts here
];

export function LessonView() {
  const { moduleId } = useParams();
  const [progress, setProgress] = useState(0);
  const [started, setStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrompt] = useState(WRITING_PROMPTS[0]);
  const [feedback, setFeedback] = useState<any>(null);
  const { toast } = useToast();

  const handleSubmitWriting = async (text: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call to OpenAI
      // Simulated feedback for now
      const mockFeedback = {
        errors: [
          {
            original: "Je suis allé au le parc",
            correction: "Je suis allé au parc",
            explanation: "When using 'à' with 'le', it contracts to 'au'.",
          },
        ],
        suggestions: [
          "Try using more complex sentence structures",
          "Include more descriptive adjectives",
          "Consider using the subjunctive mood where appropriate",
        ],
        score: {
          grammar: 85,
          vocabulary: 75,
          clarity: 90,
          total: 83,
        },
      };

      setFeedback(mockFeedback);
      setProgress(Math.min(progress + 25, 100));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to analyze your writing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateFeedback = () => {
    toast({
      description: "Regenerating feedback...",
    });
    // TODO: Implement feedback regeneration
  };

  if (!started) {
    return (
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-french-blue capitalize">
            {moduleId} Practice
          </h2>
          <Timer initialSeconds={1200} />
        </div>

        <Card className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Welcome to Writing Practice!</h3>
            <p className="text-muted-foreground">
              Improve your French writing skills with AI-powered feedback and corrections.
            </p>
            <Button size="lg" onClick={() => setStarted(true)}>
              Start Writing
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-french-blue capitalize">
          {moduleId} Practice
        </h2>
        <Timer initialSeconds={1200} />
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">{progress}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Score</span>
            <span className="text-sm text-muted-foreground">
              {feedback ? `${feedback.score.total} points` : "0 points"}
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-2" />

        <WritingPrompt {...currentPrompt} />
        
        <WritingEditor onSubmit={handleSubmitWriting} isLoading={isLoading} />

        {feedback && (
          <FeedbackDisplay 
            feedback={feedback} 
            onRegenerateFeedback={handleRegenerateFeedback} 
          />
        )}
      </div>
    </div>
  );
}
