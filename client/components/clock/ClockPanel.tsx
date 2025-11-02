import { useEffect, useMemo, useState } from "react";

function pad(n: number, l = 2) {
  return String(n).padStart(l, "0");
}

export default function ClockPanel() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const analog = useMemo(() => {
    const s = seconds * 6; // 360/60
    const m = minutes * 6 + seconds * 0.1;
    const h = ((hours % 12) + minutes / 60) * 30;
    return { s, m, h };
  }, [hours, minutes, seconds]);

  const display = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <div className="flex items-center justify-center">
        <div className="relative size-64 md:size-80 rounded-full border bg-card/60 shadow-inner">
          <div className="absolute inset-6 rounded-full border border-dashed opacity-40" />
          <div className="absolute inset-0 m-auto size-2 rounded-full bg-primary" />
          <Hand deg={analog.h} className="h-16 md:h-20 w-1 bg-foreground/80" />
          <Hand deg={analog.m} className="h-24 md:h-28 w-1 bg-foreground" />
          <Hand deg={analog.s} className="h-28 md:h-32 w-0.5 bg-primary" />
          {Array.from({ length: 12 }).map((_, i) => (
            <Tick key={i} i={i} />
          ))}
        </div>
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground">Local time</div>
        <div className="mt-2 text-6xl md:text-7xl font-semibold tracking-tight tabular-nums drop-shadow-[0_0_20px_hsl(var(--primary)_/_25%)]">
          {display}
        </div>
        <div className="mt-3 text-muted-foreground">{now.toLocaleString()}</div>
      </div>
    </div>
  );
}

function Hand({ deg, className }: { deg: number; className: string }) {
  return (
    <div
      className="absolute left-1/2 top-1/2 origin-bottom"
      style={{ transform: `translate(-50%, -100%) rotate(${deg}deg)` }}
    >
      <div className={className + " rounded-full"} />
    </div>
  );
}

function Tick({ i }: { i: number }) {
  const angle = i * 30;
  return (
    <div
      className="absolute left-1/2 top-1/2 h-[46%] origin-bottom"
      style={{ transform: `translate(-50%, -100%) rotate(${angle}deg)` }}
    >
      <div className="h-3 w-0.5 bg-foreground/50 rounded-full" />
    </div>
  );
}
