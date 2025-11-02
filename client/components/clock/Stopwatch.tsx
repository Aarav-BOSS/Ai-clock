import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

function formatTime(ms: number) {
  const totalMs = Math.max(0, Math.floor(ms));
  const hours = Math.floor(totalMs / 3600000);
  const minutes = Math.floor((totalMs % 3600000) / 60000);
  const seconds = Math.floor((totalMs % 60000) / 1000);
  const centis = Math.floor((totalMs % 1000) / 10);
  const h = hours > 0 ? String(hours).padStart(2, "0") + ":" : "";
  return `${h}${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centis).padStart(2, "0")}`;
}

export default function Stopwatch() {
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const lapsRef = useRef<number[]>([]);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!running) return;
    const start = performance.now() - elapsed;
    startRef.current = start;

    const loop = () => {
      if (!startRef.current) return;
      const now = performance.now();
      setElapsed(now - startRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const handleStartPause = () => setRunning((r) => !r);
  const handleReset = () => {
    setRunning(false);
    setElapsed(0);
    lapsRef.current = [];
    setTick((t) => t + 1);
  };
  const handleLap = () => {
    if (!running) return;
    lapsRef.current = [elapsed, ...lapsRef.current].slice(0, 5);
    setTick((t) => t + 1);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-5xl md:text-7xl font-semibold tracking-tight tabular-nums drop-shadow-[0_0_20px_hsl(var(--primary)_/_25%)]">
          {formatTime(elapsed)}
        </div>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button onClick={handleStartPause} className="min-w-24">
          {running ? "Pause" : "Start"}
        </Button>
        <Button onClick={handleLap} variant="secondary" disabled={!running}>
          Lap
        </Button>
        <Button onClick={handleReset} variant="outline">
          Reset
        </Button>
      </div>
      {lapsRef.current.length > 0 && (
        <div className="grid gap-2 max-w-md mx-auto">
          {lapsRef.current.map((l, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-sm rounded-md border bg-card/50 px-3 py-2"
            >
              <span className="text-muted-foreground">Lap {lapsRef.current.length - i}</span>
              <span className="font-mono">{formatTime(l)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
