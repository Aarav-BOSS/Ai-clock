import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)); }
function formatHMS(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  const hh = h > 0 ? String(h).padStart(2, "0") + ":" : "";
  return `${hh}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function Timer() {
  const [durationMs, setDurationMs] = useState(5 * 60 * 1000);
  const [remaining, setRemaining] = useState(durationMs);
  const [running, setRunning] = useState(false);
  const lastRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    const loop = (now: number) => {
      if (lastRef.current == null) lastRef.current = now;
      const delta = now - lastRef.current;
      lastRef.current = now;
      setRemaining((r) => Math.max(0, r - delta));
      if (remaining <= 0) setRunning(false);
      if (running) requestAnimationFrame(loop);
    };
    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [running, remaining]);

  useEffect(() => {
    if (!running) setRemaining(durationMs);
  }, [durationMs, running]);

  const progress = useMemo(() => 1 - remaining / durationMs, [remaining, durationMs]);

  const setFromMinutes = (m: number) => setDurationMs(clamp(Math.round(m) * 60 * 1000, 0, 12 * 60 * 60 * 1000));

  const handleStartPause = () => setRunning((r) => !r);
  const handleReset = () => { setRunning(false); setRemaining(durationMs); };

  const mins = Math.floor(durationMs / 60000);
  const secs = Math.floor((durationMs % 60000) / 1000);

  return (
    <div className="space-y-6">
      <div className="relative max-w-xl mx-auto">
        <div className="h-4 w-full rounded-full bg-secondary overflow-hidden">
          <div className="h-full bg-primary transition-all" style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }} />
        </div>
        <div className="mt-4 text-center text-5xl md:text-6xl font-semibold tabular-nums">
          {formatHMS(remaining)}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 items-center max-w-2xl mx-auto">
        <div className="md:col-span-2">
          <Slider value={[mins]} min={0} max={120} step={1} onValueChange={(v) => setFromMinutes(v[0])} />
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            value={mins}
            onChange={(e) => setFromMinutes(parseInt(e.target.value || "0", 10))}
            className="w-24"
          />
          <span className="self-center text-sm text-muted-foreground">min</span>
          <Input
            type="number"
            value={secs}
            onChange={(e) => setDurationMs((mins * 60 + clamp(parseInt(e.target.value || "0", 10), 0, 59)) * 1000)}
            className="w-24"
          />
          <span className="self-center text-sm text-muted-foreground">sec</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button onClick={handleStartPause} className="min-w-24">{running ? "Pause" : "Start"}</Button>
        <Button onClick={handleReset} variant="outline">Reset</Button>
        <div className="flex gap-2">
          {[60, 300, 600, 1500].map((s) => (
            <Button key={s} variant="secondary" onClick={() => setDurationMs(s * 1000)}>
              {s >= 60 ? `${Math.round(s / 60)}m` : `${s}s`}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
