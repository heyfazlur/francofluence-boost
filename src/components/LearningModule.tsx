
import { useNavigate } from "react-router-dom";
import { BookOpen, Headphones, Mic, PenTool } from "lucide-react";
import { DashboardCard } from "./DashboardCard";
import { Button } from "./ui/button";

const modules = [
  {
    id: "reading",
    title: "Reading Practice",
    description: "Improve your French reading comprehension",
    icon: BookOpen,
    color: "text-blue-500",
  },
  {
    id: "listening",
    title: "Listening Practice",
    description: "Enhance your French listening skills",
    icon: Headphones,
    color: "text-purple-500",
  },
  {
    id: "writing",
    title: "Writing Practice",
    description: "Perfect your French writing abilities",
    icon: PenTool,
    color: "text-green-500",
  },
  {
    id: "speaking",
    title: "Speaking Practice",
    description: "Master French pronunciation and fluency",
    icon: Mic,
    color: "text-red-500",
  },
];

export function LearningModule() {
  const navigate = useNavigate();

  return (
    <div className="container py-8">
      <h2 className="text-3xl font-bold mb-6 text-french-blue">Choose a Learning Module</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {modules.map((module) => (
          <DashboardCard
            key={module.id}
            title={module.title}
            description={module.description}
            className="hover:scale-105 transition-transform duration-200"
          >
            <div className="flex flex-col items-center gap-4">
              <module.icon className={`w-16 h-16 ${module.color}`} />
              <Button 
                className="w-full"
                onClick={() => navigate(`/lesson/${module.id}`)}
              >
                Start Practice
              </Button>
            </div>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
