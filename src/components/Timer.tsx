
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimerProps {
  initialSeconds: number;
}

export function Timer({ initialSeconds }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return (
    <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
      <Clock className="w-4 h-4" />
      <span className="font-medium">
        {minutes.toString().padStart(2, "0")}:{remainingSeconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
