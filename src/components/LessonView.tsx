
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
import { supabase } from "@/integrations/supabase/client";

const WRITING_PROMPTS = [
  {
    prompt: "Décrivez votre ville idéale pour vivre et travailler.",
    description: "Write about your ideal city to live and work in. Consider aspects like transportation, culture, and quality of life.",
    wordLimit: 150,
  },
  {
    prompt: "Comment la technologie a-t-elle changé notre façon de travailler?",
    description: "Discuss how technology has changed the way we work. Consider both positive and negative impacts.",
    wordLimit: 200,
  },
  {
    prompt: "Quels sont les avantages et les inconvénients de vivre dans une grande ville?",
    description: "Discuss the advantages and disadvantages of living in a big city.",
    wordLimit: 180,
  }
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
      const { data, error } = await supabase.functions.invoke('analyze-writing', {
        body: { 
          text,
          prompt: currentPrompt.prompt
        },
      });

      if (error) throw error;

      setFeedback(data);
      setProgress(Math.min(progress + 25, 100));
      
      // Play audio feedback using text-to-speech
      const feedbackText = `Votre score total est de ${data.score.total} sur 100. Voici quelques suggestions pour améliorer votre texte.`;
      await playText(feedbackText);

    } catch (error) {
      console.error('Error analyzing writing:', error);
      toast({
        title: "Error",
        description: "Failed to analyze your writing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerateFeedback = async () => {
    toast({
      description: "Regenerating feedback...",
    });
    if (feedback?.originalText) {
      await handleSubmitWriting(feedback.originalText);
    }
  };

  const playText = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text },
      });

      if (error) throw error;

      // Create and play audio from base64
      const audioContent = data.audioContent;
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      await audio.play();

    } catch (error) {
      console.error('Error playing text:', error);
      toast({
        title: "Error",
        description: "Failed to play audio. Please try again.",
        variant: "destructive",
      });
    }
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
