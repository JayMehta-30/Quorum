"use client";
import { useState } from "react";
import { Plus, X, Users, ArrowRight, Sparkles, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "./Logo";
import { ALL_GENRES } from "@/data/movies";

interface Props {
  onStart: (names: string[], genres: string[]) => void;
}

export const StartScreen = ({ onStart }: Props) => {
  const [names, setNames] = useState<string[]>(["", ""]);

  const update = (i: number, v: string) => {
    const next = [...names];
    next[i] = v;
    setNames(next);
  };

  const add = () => names.length < 5 && setNames([...names, ""]);
  const remove = (i: number) =>
    names.length > 2 && setNames(names.filter((_, idx) => idx !== i));

  const valid = names.every((n) => n.trim().length > 0);

  return (
    <div className="min-h-screen flex flex-col px-5 py-6 sm:py-10">
      <header className="flex justify-between items-center animate-fade-in max-w-7xl mx-auto w-full">
        <Logo />
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">No setup needed</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
          {/* Hero copy + form */}
          <div className="w-full text-center">
            <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-6 hover:scale-105 transition-spring">
                <Sparkles className="h-3.5 w-3.5 text-accent" />
                <span className="text-xs font-medium text-muted-foreground">
                  Movie night, settled in seconds
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight mb-4 leading-[1.02]">
                Pick the perfect
                <br />
                <span className="text-gradient-primary">movie together.</span>
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-md mx-auto">
                Add 2–5 players, swipe through curated films, and let the group crown a winner.
              </p>
            </div>

            <div
              className="glass rounded-3xl p-6 sm:p-7 shadow-card-cinema mt-8 animate-scale-in"
              style={{ animationDelay: "200ms" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h2 className="text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    Players
                  </h2>
                </div>
                <span className="text-xs font-medium text-muted-foreground tabular-nums">
                  {names.length} / 5
                </span>
              </div>

              <div className="space-y-2.5">
                {names.map((name, i) => (
                  <div
                    key={i}
                    className="flex gap-2 animate-fade-in"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="relative flex-1 group">
                      <div className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-gradient-primary grid place-items-center text-xs font-semibold text-primary-foreground shadow-glow transition-spring group-focus-within:scale-110">
                        {i + 1}
                      </div>
                      <Input
                        value={name}
                        onChange={(e) => update(i, e.target.value)}
                        placeholder={`Player ${i + 1}`}
                        maxLength={20}
                        className="pl-12 h-12 bg-secondary/40 border-border/60 text-base rounded-xl focus-visible:ring-primary focus-visible:ring-2 focus-visible:border-primary/50 transition-smooth"
                      />
                    </div>
                    {names.length > 2 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(i)}
                        className="h-12 w-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 active:scale-90 transition-spring"
                        aria-label={`Remove player ${i + 1}`}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {names.length < 5 && (
                <button
                  onClick={add}
                  className="mt-3 w-full h-12 rounded-xl border border-dashed border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/60 hover:bg-primary/5 active:scale-[0.98] transition-spring flex items-center justify-center gap-2 text-sm font-medium"
                >
                  <Plus className="h-4 w-4" /> Add player
                </button>
              )}

              <Button
                onClick={() => onStart(names.map((n) => n.trim()), [])}
                disabled={!valid}
                size="lg"
                className="w-full mt-6 h-14 text-base font-semibold bg-gradient-primary hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] shadow-glow disabled:shadow-none disabled:opacity-40 disabled:hover:scale-100 transition-spring group rounded-xl"
              >
                Start voting
                <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center text-xs text-muted-foreground/60 mt-6 max-w-7xl mx-auto w-full">
        No accounts. No setup. Just pick a movie.
      </footer>
    </div>
  );
};
