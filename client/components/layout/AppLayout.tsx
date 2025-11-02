import { Link, Outlet, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun, Timer as TimerIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function AppLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function Navbar() {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/70 backdrop-blur">
      <div className="container h-14 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 rounded-md bg-gradient-to-br from-primary to-primary/60 text-primary-foreground grid place-items-center shadow-[0_0_30px_hsl(var(--primary)_/_45%)]">
            <TimerIcon className="size-4" />
          </div>
          <span className="font-semibold tracking-tight">AI Clock Studio</span>
        </Link>
        <nav className="flex items-center gap-2">
          <NavLink to="/" active={location.pathname === "/"}>
            Home
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

function NavLink({
  to,
  children,
  active,
}: {
  to: string;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "px-3 py-1.5 text-sm rounded-md border",
        active
          ? "bg-primary text-primary-foreground border-transparent"
          : "hover:bg-accent text-foreground/80",
      )}
    >
      {children}
    </Link>
  );
}

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme:dark");
    const isDark = saved ? saved === "true" : root.classList.contains("dark");
    root.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme:dark", String(dark));
  }, [dark]);
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle theme"
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

function Footer() {
  return (
    <footer className="border-t bg-background/60">
      <div className="container py-6 text-xs text-muted-foreground flex items-center justify-between">
        <span>© {new Date().getFullYear()} AI Clock Studio</span>
        <span>Crafted with precision and simplicity</span>
      </div>
    </footer>
  );
}
