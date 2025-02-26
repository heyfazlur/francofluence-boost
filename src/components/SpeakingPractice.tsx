
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Mic, Square, Loader2 } from "lucide-react";
import { WaveformVisualizer } from "./WaveformVisualizer";
import { SpeakingFeedback } from "./SpeakingFeedback";
import { useToast } from "@/hooks/use-toast";
import { useRecorder } from "@/hooks/use-recorder";
import { speakingPrompts, SpeakingPrompt } from "@/data/speakingPrompts";
import { supabase } from "@/integrations/supabase/client";

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
  const [currentPrompt, setCurrentPrompt] = useState<SpeakingPrompt>(speakingPrompts[0]);
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
        
        // Convert blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          
          if (!base64Audio) {
            throw new Error('Failed to convert audio to base64');
          }

          const { data, error } = await supabase.functions.invoke('analyze-speech', {
            body: {
              audio: base64Audio,
              prompt: currentPrompt.text
            }
          });

          if (error) throw error;

          setFeedback(data);

          // Play feedback using text-to-speech
          const feedbackText = `Votre score total est de ${data.overallScore} sur 100. Voici quelques suggestions pour améliorer votre prononciation.`;
          await playFeedback(feedbackText);
        };
      } catch (error) {
        console.error('Error analyzing speech:', error);
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

  const playFeedback = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text },
      });

      if (error) throw error;

      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`);
      await audio.play();
    } catch (error) {
      console.error('Error playing feedback:', error);
    }
  };

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
