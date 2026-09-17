import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  CalendarCheck,
  LayoutDashboard,
  ListChecks,
  Mail,
  PenLine,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard Home", icon: LayoutDashboard },
  { to: "/email-summarizer", label: "Email Summarizer", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Notes Parser", icon: ListChecks },
  { to: "/rewriter", label: "Professional Rewriter", icon: PenLine },
  { to: "/planner", label: "Daily Priority Planner", icon: CalendarCheck },
] as const;

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-6 lg:flex">
        <Brand />
        <nav className="mt-8 flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground data-[status=active]:shadow-[var(--shadow-soft)]"
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-xl bg-accent p-4 text-xs leading-relaxed text-accent-foreground">
          <p className="font-semibold">Mock AI mode</p>
          <p className="mt-1 text-muted-foreground">
            Results are generated locally for demonstration.
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-10">
            <div className="min-w-0">
              <h1 className="truncate text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
                {title}
              </h1>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="hidden shrink-0 items-center gap-3 rounded-full border border-border bg-card px-3 py-1.5 shadow-[var(--shadow-soft)] sm:flex">
              <span className="size-2 rounded-full bg-primary" />
              <span className="text-xs font-medium text-muted-foreground">AI assistant ready</span>
            </div>
          </div>
          <MobileNav />
        </header>

        <main className="flex-1 px-5 py-6 lg:px-10 lg:py-8">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </main>

        <footer className="border-t border-border bg-card px-5 py-5 lg:px-10">
          <p className="mx-auto max-w-5xl text-center text-xs text-muted-foreground">
            Powered by AI — Always review AI output. Do not share confidential information.
          </p>
        </footer>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
        <Sparkles className="size-5" />
      </span>
      <span className="leading-tight">
        <span className="block text-sm font-bold tracking-tight text-sidebar-foreground">
          OfficePilot AI
        </span>
        <span className="block text-xs text-muted-foreground">AI Productivity Hub</span>
      </span>
    </Link>
  );
}

function MobileNav() {
  return (
    <div className="flex gap-2 overflow-x-auto border-t border-border px-5 py-3 lg:hidden">
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeOptions={{ exact: item.to === "/" }}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground",
            "data-[status=active]:border-primary data-[status=active]:bg-primary data-[status=active]:text-primary-foreground",
          )}
        >
          <item.icon className="size-3.5" />
          {item.label}
        </Link>
      ))}
    </div>
  );
}
