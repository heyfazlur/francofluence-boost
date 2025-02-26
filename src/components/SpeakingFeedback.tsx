
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Check, X, Volume2 } from "lucide-react";

interface SpeakingAnalysis {
  pronunciationScore: number;
  fluencyScore: number;
  overallScore: number;
  mistakes: Array<{
    word: string;
    correction: string;
    phoneticHint: string;
  }>;
  suggestions: string[];
}

interface SpeakingFeedbackProps {
  feedback: SpeakingAnalysis;
}

export function SpeakingFeedback({ feedback }: SpeakingFeedbackProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
          <p className="text-2xl font-bold text-french-blue">
            {feedback.overallScore}%
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">Pronunciation</p>
          <p className="text-2xl font-bold text-french-blue">
            {feedback.pronunciationScore}%
          </p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm font-medium text-muted-foreground">Fluency</p>
          <p className="text-2xl font-bold text-french-blue">
            {feedback.fluencyScore}%
          </p>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <X className="text-red-500" />
            Pronunciation Mistakes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {feedback.mistakes.map((mistake, index) => (
              <li key={index} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-2">
                  <p className="text-red-500 line-through">{mistake.word}</p>
                  <Volume2 
                    className="w-4 h-4 text-french-blue cursor-pointer hover:text-french-blue/80"
                    onClick={() => {
                      const utterance = new SpeechSynthesisUtterance(mistake.correction);
                      utterance.lang = "fr-FR";
                      speechSynthesis.speak(utterance);
                    }}
                  />
                </div>
                <p className="text-green-600 font-medium">{mistake.correction}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Phonetic: {mistake.phoneticHint}
                </p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Check className="text-green-500" />
            Improvement Suggestions
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
    </div>
  );
}
