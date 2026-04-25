"use client";
import { useState } from "react";
import { Heart, X, Info, Trophy, ArrowLeft, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MovieCard } from "./MovieCard";
import { Logo } from "./Logo";
import type { Movie } from "@/data/movies";
import type { VoteType } from "@/store/useGameStore";
import { motion, useMotionValue, useTransform } from "framer-motion";

interface Props {
  movies: Movie[];
  player: string;
  playerNumber: number;
  totalPlayers: number;
  onVote: (movieId: string, vote: VoteType) => void;
  onComplete: () => void;
  onBack: () => void;
}

type FlyDir = null | "left" | "right" | "up";

export const VotingScreen = ({
  movies,
  player,
  playerNumber,
  totalPlayers,
  onVote,
  onComplete,
  onBack,
}: Props) => {
  const [movieIdx, setMovieIdx] = useState(0);
  const [flying, setFlying] = useState<FlyDir>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  // Opacity decreases as you drag far in any direction
  const dragOpacity = useTransform(
    () => {
      const dist = Math.max(Math.abs(x.get()), Math.abs(y.get()));
      if (dist > 150) return 0.5;
      if (dist > 100) return 0.8;
      return 1;
    }
  );

  const progress = (movieIdx / movies.length) * 100;
  const stack = movies.slice(movieIdx, movieIdx + 3);
  const done = movieIdx >= movies.length;
  const currentMovie = movies[movieIdx];

  const advance = (dir: FlyDir) => {
    if (flying || done || !dir) return;
    setFlying(dir);
    const vote: VoteType = dir === "up" ? "love" : dir === "right" ? "yes" : "no";
    onVote(currentMovie.id, vote);

    window.setTimeout(() => {
      const next = movieIdx + 1;
      setMovieIdx(next);
      setFlying(null);
      x.set(0);
      y.set(0);
      if (next >= movies.length) {
        window.setTimeout(onComplete, 700);
      }
    }, 320);
  };

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 100;
    // Prioritize UP swipe if dragged mostly up
    if (info.offset.y < -threshold && Math.abs(info.offset.y) > Math.abs(info.offset.x)) {
      advance("up");
    } else if (info.offset.x > threshold) {
      advance("right");
    } else if (info.offset.x < -threshold) {
      advance("left");
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-5 py-6 max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-5 animate-fade-in">
        <button
          onClick={onBack}
          className="h-9 w-9 rounded-full grid place-items-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
          aria-label="Back to start"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <Logo size="sm" />
        <Button
          variant="ghost"
          size="sm"
          onClick={onComplete}
          className="text-muted-foreground hover:text-accent gap-1.5 h-9 px-3"
        >
          <Trophy className="h-4 w-4" />
          Skip
        </Button>
      </header>

      {/* Player + progress */}
      <div className="mb-5 animate-fade-in" style={{ animationDelay: "80ms" }}>
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-full bg-gradient-primary grid place-items-center text-sm font-semibold text-primary-foreground shadow-glow">
              {player.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground leading-none mb-1 uppercase tracking-wider">
                Voting
              </p>
              <p className="text-sm font-semibold leading-none">{player}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-muted-foreground leading-none mb-1 uppercase tracking-wider">
              Movie
            </p>
            <p className="text-sm font-semibold leading-none tabular-nums">
              {Math.min(movieIdx + 1, movies.length)} / {movies.length}
            </p>
          </div>
        </div>
        <Progress value={progress} className="h-1.5 bg-secondary" />
        <p className="text-[11px] text-muted-foreground/70 mt-2 text-center">
          Player {playerNumber} of {totalPlayers}
        </p>
      </div>

      {/* Card stack */}
      <div className="flex-1 flex items-center justify-center min-h-0 relative">
        {/* Soft hint text behind the cards */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="flex flex-col items-center gap-2">
            <Heart className="w-16 h-16 fill-pink-500 text-pink-500 -translate-y-10" />
            <span className="uppercase tracking-widest font-bold text-xl text-pink-500">Love</span>
          </div>
        </div>

        <div className="relative w-full aspect-[2/3] max-h-[58vh]">
          {done ? (
            <div className="absolute inset-0 rounded-[2rem] glass grid place-items-center text-center p-6 animate-scale-in">
              <div>
                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-gold grid place-items-center shadow-gold animate-float">
                  <Trophy className="h-8 w-8 text-accent-foreground" />
                </div>
                <p className="font-semibold mb-1 text-lg">Nice work, {player}!</p>
                <p className="text-sm text-muted-foreground">Tallying votes…</p>
              </div>
            </div>
          ) : (
            stack
              .map((movie, i) => {
                const depth = i;
                const isTop = depth === 0;

                const flyTransform =
                  isTop && flying
                    ? flying === "right"
                      ? "translateX(140%) rotate(18deg)"
                      : flying === "left"
                        ? "translateX(-140%) rotate(-18deg)"
                        : "translateY(-140%) scale(1.1) rotate(0deg) perspective(1000px) rotateX(15deg)"
                    : `translateY(${depth * -10}px) scale(${1 - depth * 0.04})`;

                return (
                  <motion.div
                    key={`${movie.id}-${movieIdx}-${depth}`}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    style={{
                      zIndex: 10 - depth,
                      ...(isTop && !flying ? { x, y, rotate, opacity: dragOpacity } : {})
                    }}
                    drag={isTop && !flying ? true : false}
                    dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                    dragElastic={0.7}
                    onDragEnd={isTop ? handleDragEnd : undefined}
                  >
                    <MovieCard
                      movie={movie}
                      className={isTop && !flying ? "animate-scale-in" : ""}
                      style={{
                        transform: flyTransform,
                        opacity: isTop && flying ? 0 : 1 - depth * 0.2,
                        transition:
                          isTop && flying
                            ? "transform 320ms cubic-bezier(0.4, 0, 0.2, 1), opacity 320ms ease-out"
                            : isTop && !flying ? "none" : "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease-out",
                      }}
                    />

                    {/* Stamps overlay (top card only) */}
                    {isTop && flying === "right" && (
                      <div
                        className="absolute top-10 left-8 z-20 px-5 py-2 rounded-2xl border-4 border-success text-success font-extrabold text-3xl tracking-widest animate-stamp-in pointer-events-none"
                        style={{ ["--rot" as string]: "-12deg" }}
                      >
                        LIKE
                      </div>
                    )}
                    {isTop && flying === "left" && (
                      <div
                        className="absolute top-10 right-8 z-20 px-5 py-2 rounded-2xl border-4 border-destructive text-destructive font-extrabold text-3xl tracking-widest animate-stamp-in pointer-events-none"
                        style={{ ["--rot" as string]: "12deg" }}
                      >
                        NOPE
                      </div>
                    )}
                    {isTop && flying === "up" && (
                      <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 px-8 py-4 rounded-3xl border-4 border-pink-500 bg-pink-500/20 backdrop-blur-md text-pink-500 font-black text-4xl tracking-widest animate-stamp-in pointer-events-none shadow-[0_0_50px_rgba(236,72,153,0.5)] flex items-center gap-3"
                        style={{ ["--rot" as string]: "0deg" }}
                      >
                        <Heart className="w-10 h-10 fill-pink-500 animate-pulse" />
                        LOVE
                      </div>
                    )}
                  </motion.div>
                );
              })
              .reverse()
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div
        className="flex items-center justify-center gap-5 sm:gap-6 mt-6 pt-2 animate-fade-in"
        style={{ animationDelay: "200ms" }}
      >
        <button
          onClick={() => advance("left")}
          disabled={done || !!flying}
          aria-label="Skip"
          className="h-14 w-14 rounded-full glass grid place-items-center text-destructive hover:scale-110 hover:border-destructive/60 hover:bg-destructive/10 active:scale-95 transition-spring shadow-card-cinema disabled:opacity-40 disabled:hover:scale-100"
        >
          <X className="h-6 w-6" strokeWidth={2.5} />
        </button>
        <button
          onClick={() => advance("up")}
          disabled={done || !!flying}
          aria-label="Love"
          className="h-16 w-16 rounded-full glass grid place-items-center text-pink-500 hover:scale-110 hover:border-pink-500/60 hover:bg-pink-500/10 active:scale-95 transition-spring shadow-[0_0_20px_rgba(236,72,153,0.3)] disabled:opacity-40 disabled:hover:scale-100"
        >
          <Star className="h-8 w-8 fill-pink-500" strokeWidth={2.5} />
        </button>
        <button
          onClick={() => advance("right")}
          disabled={done || !!flying}
          aria-label="Like"
          className="h-14 w-14 rounded-full bg-gradient-primary grid place-items-center text-primary-foreground hover:scale-110 active:scale-95 transition-spring shadow-glow disabled:opacity-40 disabled:hover:scale-100"
        >
          <Heart className="h-6 w-6 fill-current" strokeWidth={2.5} />
        </button>
      </div>

      {/* Details modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="glass border-border/60 max-w-md">
          {currentMovie && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold tracking-tight">
                  {currentMovie.title}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {currentMovie.year} · Directed by {currentMovie.director} · {currentMovie.runtime}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {currentMovie.genre.map((g) => (
                  <span
                    key={g}
                    className="px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-primary/15 text-primary-glow border border-primary/30"
                  >
                    {g}
                  </span>
                ))}
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed mt-3">
                {currentMovie.overview}
              </p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
