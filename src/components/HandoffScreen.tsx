"use client";
import { ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  nextPlayer: string;
  playerNumber: number;
  totalPlayers: number;
  onReady: () => void;
}

export const HandoffScreen = ({ nextPlayer, playerNumber, totalPlayers, onReady }: Props) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 animate-fade-in">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass mb-8 animate-fade-in">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Pass the device
          </span>
        </div>

        <div className="relative mb-8 animate-scale-in">
          <div className="h-32 w-32 mx-auto rounded-full bg-gradient-primary grid place-items-center shadow-glow animate-pulse-glow">
            <span className="text-5xl font-semibold text-primary-foreground">
              {nextPlayer.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="absolute -top-2 -right-2 left-1/2 translate-x-8 h-8 w-8 rounded-full glass grid place-items-center text-xs font-semibold">
            {playerNumber}
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2">
          Up next
        </p>
        <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight mb-3">
          <span className="text-gradient-primary">{nextPlayer}</span>
        </h1>
        <p className="text-muted-foreground mb-10">
          Player {playerNumber} of {totalPlayers} — your turn to vote.
        </p>

        <Button
          onClick={onReady}
          size="lg"
          className="h-14 px-8 text-base font-semibold bg-gradient-primary hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] shadow-glow rounded-xl group transition-spring"
        >
          <User className="h-5 w-5 mr-2" />
          I'm ready
          <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </div>
  );
};
