
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Mic, Square, Loader2 } from "lucide-react";
import { WaveformVisualizer } from "./WaveformVisualizer";
import { SpeakingFeedback } from "./SpeakingFeedback";
import { useToast } from "@/hooks/use-toast";
import { useRecorder } from "@/hooks/use-recorder";
import { speakingPrompts } from "@/data/speakingPrompts";

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

export function SpeakingPractice() {
  const [currentPrompt, setCurrentPrompt] = useState(speakingPrompts[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<SpeakingAnalysis | null>(null);
  const { toast } = useToast();
  
  const {
    isRecording,
    startRecording,
    stopRecording,
    recordingTime,
  } = useRecorder({
    onRecordingComplete: async (audioBlob) => {
      try {
        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append("audio", audioBlob);
        formData.append("prompt", currentPrompt.text);

        const response = await fetch("/api/analyze-speech", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to analyze speech");
        }

        const analysis = await response.json();
        setFeedback(analysis);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to analyze your speech. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
      }
    },
  });

  const handleNextPrompt = () => {
    const currentIndex = speakingPrompts.findIndex(
      (prompt) => prompt.id === currentPrompt.id
    );
    const nextIndex = (currentIndex + 1) % speakingPrompts.length;
    setCurrentPrompt(speakingPrompts[nextIndex]);
    setFeedback(null);
  };

  return (
    <div className="container max-w-3xl mx-auto py-8 space-y-6">
      <Card className="p-6">
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-semibold text-center mb-6">
            {currentPrompt.title}
          </h2>
          <p className="text-lg text-center mb-8">{currentPrompt.text}</p>
          
          <div className="flex flex-col items-center gap-6">
            <WaveformVisualizer 
              isRecording={isRecording} 
              recordingTime={recordingTime}
            />
            
            <div className="flex gap-4">
              {!isRecording ? (
                <Button
                  size="lg"
                  onClick={startRecording}
                  className="w-32"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Mic className="w-4 h-4 mr-2" />
                  )}
                  Record
                </Button>
              ) : (
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={stopRecording}
                  className="w-32"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Stop
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={handleNextPrompt}
                disabled={isRecording || isAnalyzing}
              >
                Next Prompt
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {feedback && <SpeakingFeedback feedback={feedback} />}
    </div>
  );
}
