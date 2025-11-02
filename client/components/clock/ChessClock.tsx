import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function format(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type Side = "white" | "black" | null;

export default function ChessClock() {
  const [baseMinutes, setBaseMinutes] = useState(5);
  const [incSeconds, setIncSeconds] = useState(0);
  const [whiteMs, setWhiteMs] = useState(baseMinutes * 60 * 1000);
  const [blackMs, setBlackMs] = useState(baseMinutes * 60 * 1000);
  const [active, setActive] = useState<Side>(null);
  const [running, setRunning] = useState(false);
  const lastSideRef = useRef<Side>(null);
  const raf = useRef<number | null>(null);
  const lastStamp = useRef<number | null>(null);

  useEffect(() => {
    if (!running || !active) return;
    const loop = (now: number) => {
      if (lastStamp.current == null) lastStamp.current = now;
      const delta = now - lastStamp.current;
      lastStamp.current = now;
      if (active === "white") setWhiteMs((t) => Math.max(0, t - delta));
      if (active === "black") setBlackMs((t) => Math.max(0, t - delta));
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [running, active]);

  useEffect(() => {
    setWhiteMs(baseMinutes * 60 * 1000);
    setBlackMs(baseMinutes * 60 * 1000);
    setActive(null);
    setRunning(false);
  }, [baseMinutes]);

  const start = () => {
    if (!active) setActive("black");
    setRunning(true);
  };
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setActive(null);
    setWhiteMs(baseMinutes * 60 * 1000);
    setBlackMs(baseMinutes * 60 * 1000);
  };

  const switchTurn = (to: Side) => {
    if (!running) return;
    if (active === to) return;
    if (active && incSeconds > 0) {
      if (active === "white") setWhiteMs((t) => t + incSeconds * 1000);
      if (active === "black") setBlackMs((t) => t + incSeconds * 1000);
    }
    lastSideRef.current = active;
    setActive(to);
    lastStamp.current = null;
  };

  const done = whiteMs === 0 || blackMs === 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 max-w-3xl mx-auto">
        <button
          onClick={() => switchTurn("white")}
          className={`aspect-video rounded-xl border p-6 text-left transition shadow-sm ${active === "white" ? "bg-primary/10 ring-2 ring-primary" : "bg-card/60"} ${done && whiteMs === 0 ? "opacity-60" : ""}`}
        >
          <div className="text-sm text-muted-foreground">White</div>
          <div className="mt-2 text-4xl md:text-6xl font-bold tabular-nums">
            {format(whiteMs)}
          </div>
        </button>
        <button
          onClick={() => switchTurn("black")}
          className={`aspect-video rounded-xl border p-6 text-right transition shadow-sm ${active === "black" ? "bg-primary/10 ring-2 ring-primary" : "bg-card/60"} ${done && blackMs === 0 ? "opacity-60" : ""}`}
        >
          <div className="text-sm text-muted-foreground">Black</div>
          <div className="mt-2 text-4xl md:text-6xl font-bold tabular-nums">
            {format(blackMs)}
          </div>
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {!running ? (
          <Button onClick={start}>Start</Button>
        ) : (
          <Button onClick={pause}>Pause</Button>
        )}
        <Button variant="outline" onClick={reset}>
          Reset
        </Button>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Base</span>
          <Select
            value={String(baseMinutes)}
            onValueChange={(v) => setBaseMinutes(parseInt(v, 10))}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Minutes" />
            </SelectTrigger>
            <SelectContent>
              {[1, 3, 5, 10, 15, 30, 60].map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {m}m
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Increment</span>
          <Select
            value={String(incSeconds)}
            onValueChange={(v) => setIncSeconds(parseInt(v, 10))}
          >
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Inc" />
            </SelectTrigger>
            <SelectContent>
              {[0, 1, 2, 3, 5, 10].map((s) => (
                <SelectItem key={s} value={String(s)}>
                  {s}s
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Tap each side to switch turns. Increment is added to the player who just
        moved.
      </p>
    </div>
  );
}
