
import { useState } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

interface WritingEditorProps {
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export function WritingEditor({ onSubmit, isLoading }: WritingEditorProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      onSubmit(text);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Type your response in French..."
        className="min-h-[200px] text-lg p-4"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex justify-between items-center">
        <span className="text-sm text-muted-foreground">
          {text.split(/\s+/).filter(Boolean).length} words
        </span>
        <Button 
          size="lg"
          onClick={handleSubmit}
          disabled={!text.trim() || isLoading}
        >
          {isLoading ? "Analyzing..." : "Submit for Review"}
        </Button>
      </div>
    </div>
  );
}
