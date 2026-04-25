"use client";

import { useMemo } from "react";
import { useGameStore } from "@/store/useGameStore";
import { StartScreen } from "@/components/StartScreen";
import { LandingScreen } from "@/components/LandingScreen";
import { BrowseMovies } from "@/components/BrowseMovies";
import { VotingScreen } from "@/components/VotingScreen";
import { ResultsScreen, type MovieScore } from "@/components/ResultsScreen";
import { HandoffScreen } from "@/components/HandoffScreen";
import { AuroraBackground } from "@/components/AuroraBackground";
import { BackgroundMarquee } from "@/components/BackgroundMarquee";

export default function Home() {
  const { phase, players, currentPlayerIndex, votes, selectedMovies, setPhase, startGame, nextPlayer, resetGame, recordVote } = useGameStore();

  const results = useMemo(() => {
    return selectedMovies
      .map((movie) => {
        let score = 0;
        const sentiment: Record<number, string> = {};
        
        players.forEach((p, i) => {
          const vote = votes[i]?.[movie.id];
          sentiment[i] = vote || 'no';
          if (vote === 'love') score += 3;
          else if (vote === 'yes') score += 1;
        });
        
        return { movie, score, sentiment };
      })
      .sort((a, b) => b.score - a.score || b.movie.rating - a.movie.rating);
  }, [selectedMovies, players, votes]);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden selection:bg-primary/30">
      <BackgroundMarquee />
      <AuroraBackground />
      <div key={phase + currentPlayerIndex} className="animate-fade-in relative z-10">
        {phase === "LANDING" && <LandingScreen onGetStarted={() => setPhase("BROWSE")} />}
        {phase === "BROWSE" && <BrowseMovies />}
        {phase === "LOBBY" && <StartScreen onStart={startGame} />}

        {phase === "HANDOFF" && players[currentPlayerIndex] && (
          <HandoffScreen
            nextPlayer={players[currentPlayerIndex]}
            playerNumber={currentPlayerIndex + 1}
            totalPlayers={players.length}
            onReady={() => useGameStore.setState({ phase: "VOTING" })}
          />
        )}

        {phase === "VOTING" && players[currentPlayerIndex] && (
          <VotingScreen
            movies={selectedMovies}
            player={players[currentPlayerIndex]}
            playerNumber={currentPlayerIndex + 1}
            totalPlayers={players.length}
            onVote={recordVote}
            onComplete={nextPlayer}
            onBack={resetGame}
          />
        )}

        {(phase === "REVEAL" || phase === "LEADERBOARD") && (
          <ResultsScreen results={results} totalVoters={players.length} players={players} onRestart={resetGame} />
        )}
      </div>
    </main>
  );
}
