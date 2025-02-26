
import { useEffect, useRef } from "react";

interface WaveformVisualizerProps {
  isRecording: boolean;
  recordingTime: number;
}

export function WaveformVisualizer({ isRecording, recordingTime }: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const bars = 50;
    const barWidth = width / bars - 2;

    const animate = () => {
      if (!isRecording) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "#2563eb"; // blue-600

      for (let i = 0; i < bars; i++) {
        const amplitude = isRecording
          ? Math.random() * (height / 2) + height / 4
          : height / 2;
        
        ctx.fillRect(
          i * (barWidth + 2) + 2,
          height / 2 - amplitude / 2,
          barWidth,
          amplitude
        );
      }

      requestAnimationFrame(animate);
    };

    animate();
  }, [isRecording]);

  return (
    <div className="relative w-full max-w-md">
      <canvas
        ref={canvasRef}
        width={400}
        height={100}
        className="w-full h-[100px] rounded-lg"
      />
      {isRecording && (
        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
          {Math.floor(recordingTime / 1000)}s
        </div>
      )}
    </div>
  );
}
