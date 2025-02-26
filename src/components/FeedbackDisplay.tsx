
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, X, Lightbulb } from "lucide-react";

interface Feedback {
  errors: Array<{
    original: string;
    correction: string;
    explanation: string;
  }>;
  suggestions: string[];
  score: {
    grammar: number;
    vocabulary: number;
    clarity: number;
    total: number;
  };
}

interface FeedbackDisplayProps {
  feedback: Feedback;
  onRegenerateFeedback: () => void;
}

export function FeedbackDisplay({ feedback, onRegenerateFeedback }: FeedbackDisplayProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">Total Score</p>
          <p className="text-2xl font-bold text-french-blue">{feedback.score.total}%</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">Grammar</p>
          <p className="text-2xl font-bold text-french-blue">{feedback.score.grammar}%</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">Vocabulary</p>
          <p className="text-2xl font-bold text-french-blue">{feedback.score.vocabulary}%</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">Clarity</p>
          <p className="text-2xl font-bold text-french-blue">{feedback.score.clarity}%</p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <X className="text-red-500" />
            Errors and Corrections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {feedback.errors.map((error, index) => (
              <li key={index} className="border-b pb-4 last:border-0 last:pb-0">
                <p className="text-red-500 line-through">{error.original}</p>
                <p className="text-green-600 font-medium">{error.correction}</p>
                <p className="text-sm text-muted-foreground mt-1">{error.explanation}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="text-french-yellow" />
            Suggestions for Improvement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {feedback.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={onRegenerateFeedback}
      >
        Regenerate Feedback
      </Button>
    </div>
  );
}
