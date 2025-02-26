
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardCard({ title, description, children, className = "" }: DashboardCardProps) {
  return (
    <Card className={`overflow-hidden transition-all duration-200 hover:shadow-lg ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-french-blue">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
