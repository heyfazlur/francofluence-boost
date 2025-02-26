
import { BookOpen, Newspaper, Mic, Headphones, PenTool, LogOut } from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { ProgressBar } from "@/components/ProgressBar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-french-beige">
      <header className="bg-french-blue text-white py-6">
        <div className="container flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2 animate-fade-in">FranceFluence</h1>
            <p className="text-lg opacity-90 animate-slide-up">Your path to TEF/TCF success</p>
          </div>
          <Button
            variant="ghost"
            className="text-white hover:text-white/80"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
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
              <Button variant="ghost" className="w-full justify-start text-left">
                <Newspaper className="mr-2 h-4 w-4" />
                Updates to TEF exam format for 2024
              </Button>
              <Button variant="ghost" className="w-full justify-start text-left">
                <Newspaper className="mr-2 h-4 w-4" />
                New immigration pathways announced
              </Button>
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
