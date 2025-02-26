
import { BookOpen, Newspaper, Mic, Headphones, PenTool, Volume2 } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const playText = async (text: string) => {
    try {
      setIsGenerating(true);
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
    } finally {
      setIsGenerating(false);
    }
  };

  const newsUpdates = [
    {
      text: "Les changements du format d'examen TEF pour 2024",
      translation: "Updates to TEF exam format for 2024"
    },
    {
      text: "Nouvelles voies d'immigration annoncées",
      translation: "New immigration pathways announced"
    }
  ];

  return (
    <div className="min-h-screen bg-french-beige">
      <header className="bg-french-blue text-white py-6">
        <div className="container">
          <h1 className="text-4xl font-bold mb-2 animate-fade-in">FranceFluence</h1>
          <p className="text-lg opacity-90 animate-slide-up">Your path to TEF/TCF success</p>
        </div>
      </header>

      <main className="container py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Progress Overview */}
          <DashboardCard
            title="Your Progress"
            description="Track your TEF/TCF preparation"
            className="lg:col-span-3"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <ProgressBar value={75} label="Listening" />
              <ProgressBar value={60} label="Reading" />
              <ProgressBar value={45} label="Writing" />
              <ProgressBar value={30} label="Speaking" />
            </div>
          </DashboardCard>

          {/* Start Learning Card */}
          <DashboardCard
            title="Start Learning"
            description="Begin your practice session"
            className="lg:col-span-2"
          >
            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate("/learn")}
            >
              Launch Learning Modules
            </Button>
          </DashboardCard>

          {/* News Updates */}
          <DashboardCard title="Latest Updates" description="Canadian Immigration News">
            <div className="space-y-4">
              {newsUpdates.map((update, index) => (
                <div key={index} className="space-y-1">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left flex items-start"
                  >
                    <Newspaper className="mr-2 h-4 w-4 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">{update.text}</p>
                      <p className="text-sm text-muted-foreground">{update.translation}</p>
                    </div>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-6"
                    onClick={() => playText(update.text)}
                    disabled={isGenerating}
                  >
                    <Volume2 className="mr-2 h-4 w-4" />
                    Listen
                  </Button>
                </div>
              ))}
            </div>
          </DashboardCard>

          {/* Quick Actions */}
          <DashboardCard title="Quick Start" description="Choose your activity">
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Start Lesson
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <PenTool className="mr-2 h-4 w-4" />
                Practice Writing
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mic className="mr-2 h-4 w-4" />
                Speaking Exercise
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Headphones className="mr-2 h-4 w-4" />
                Listening Test
              </Button>
            </div>
          </DashboardCard>
        </div>
      </main>
    </div>
  );
};

export default Index;
