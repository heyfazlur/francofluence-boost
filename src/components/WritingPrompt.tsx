
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface WritingPromptProps {
  prompt: string;
  description: string;
  wordLimit?: number;
}

export function WritingPrompt({ prompt, description, wordLimit = 150 }: WritingPromptProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-french-blue">Writing Prompt</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-medium">{prompt}</p>
        <p className="text-sm text-muted-foreground mt-2">Word limit: {wordLimit} words</p>
      </CardContent>
    </Card>
  );
}
