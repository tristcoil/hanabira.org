// pages/example.tsx
import { Button } from "@/components/ui/button";

export default function ExamplePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Welcome to Shadcn UI</h1>
      <Button variant="default" className="mb-2">
        Default Button
      </Button>
      <Button variant="outline" className="mb-2">
        Outline Button
      </Button>
      <Button variant="destructive">
        Destructive Button
      </Button>
    </div>
  );
}
