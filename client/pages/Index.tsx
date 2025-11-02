import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import ClockPanel from "@/components/clock/ClockPanel";
import Stopwatch from "@/components/clock/Stopwatch";
import Timer from "@/components/clock/Timer";
import ChessClock from "@/components/clock/ChessClock";

export default function Index() {
  // Example server ping, kept but hidden
  const [exampleFromServer, setExampleFromServer] = useState("");
  useEffect(() => {
    fetchDemo();
  }, []);
  const fetchDemo = async () => {
    try {
      const response = await fetch("/api/demo");
      const data = (await response.json()) as { message: string };
      setExampleFromServer(data.message);
    } catch {}
  };

  return (
    <main className="min-h-screen bg-ai pattern-grid">
      <section className="container py-10 md:py-16">
        <header className="flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-2 rounded-full border bg-background/50 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" /> Built with intelligent focus on speed & precision
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            AI Clock Studio
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            A beautiful, focused suite of time tools: world clock, stopwatch, countdown timer, and a competitive chess clock. Simple. Fast. Delightfully usable.
          </p>
        </header>

        <Card className="mt-10 bg-background/70 backdrop-blur border-primary/20 shadow-[0_0_0_1px_hsl(var(--primary)_/_15%)]">
          <CardHeader>
            <CardTitle className="text-lg">Time Utilities</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="clock" className="w-full">
              <TabsList className="mx-auto flex flex-wrap gap-2 bg-muted/60">
                <TabsTrigger value="clock">Clock</TabsTrigger>
                <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
                <TabsTrigger value="timer">Timer</TabsTrigger>
                <TabsTrigger value="chess">Chess clock</TabsTrigger>
                <TabsTrigger value="more" disabled>More soon</TabsTrigger>
              </TabsList>

              <TabsContent value="clock" className="mt-8">
                <ClockPanel />
              </TabsContent>

              <TabsContent value="stopwatch" className="mt-8">
                <Stopwatch />
              </TabsContent>

              <TabsContent value="timer" className="mt-8">
                <Timer />
              </TabsContent>

              <TabsContent value="chess" className="mt-8">
                <ChessClock />
              </TabsContent>

              <TabsContent value="more" className="mt-8">
                <div className="text-center text-muted-foreground">Pomodoro, lap export, and world time zones coming soon. Ask to add them!</div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <p className="mt-4 hidden">{exampleFromServer}</p>
      </section>
    </main>
  );
}
