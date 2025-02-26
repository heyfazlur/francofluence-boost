
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";

interface UseRecorderOptions {
  onRecordingComplete: (audioBlob: Blob) => Promise<void>;
  maxDuration?: number;
}

export function useRecorder({ 
  onRecordingComplete, 
  maxDuration = 60000 
}: UseRecorderOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const { toast } = useToast();

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        stream.getTracks().forEach(track => track.stop());
        onRecordingComplete(audioBlob);
      };

      setRecorder(mediaRecorder);
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      const startTime = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setRecordingTime(elapsed);
        
        if (elapsed >= maxDuration) {
          clearInterval(timer);
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
          }
        }
      }, 100);

      // Cleanup timer when recording stops
      mediaRecorder.onstop = () => {
        clearInterval(timer);
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        stream.getTracks().forEach(track => track.stop());
        onRecordingComplete(audioBlob);
      };
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Error",
        description: "Unable to access microphone. Please check your permissions.",
        variant: "destructive",
      });
    }
  }, [maxDuration, onRecordingComplete, toast]);

  const stopRecording = useCallback(() => {
    if (recorder && recorder.state === "recording") {
      recorder.stop();
      setIsRecording(false);
      setRecordingTime(0);
    }
  }, [recorder]);

  return {
    isRecording,
    startRecording,
    stopRecording,
    recordingTime,
  };
}
