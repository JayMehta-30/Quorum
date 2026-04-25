"use client";
import { useState, useEffect } from "react";
import { Trophy, Crown, Medal, RotateCcw, Heart, Check, X as XIcon, PlayCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import type { Movie } from "@/data/movies";

export interface MovieScore {
  movie: Movie;
  score: number;
  sentiment: Record<string, string>;
}

interface Props {
  results: MovieScore[];
  totalVoters: number;
  onRestart: () => void;
  players?: string[]; // passed down implicitly or we can extract from sentiment keys
}

const Confetti = () => {
  const pieces = Array.from({ length: 50 });
  const colors = [
    "hsl(348 100% 60%)",
    "hsl(43 96% 58%)",
    "hsl(142 71% 50%)",
    "hsl(280 100% 60%)",
    "hsl(220 100% 60%)",
  ];
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50" aria-hidden>
      {pieces.map((_, i) => {
        const tx = (Math.random() - 0.5) * 800;
        const ty = (Math.random() - 0.2) * 800 + 100;
        const rot = Math.random() * 720;
        const delay = Math.random() * 0.2;
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 w-3 h-3 rounded-sm animate-confetti-burst"
            style={{
              backgroundColor: colors[Math.floor(Math.random() * colors.length)],
              '--tx': `${tx}px`,
              '--ty': `${ty}px`,
              '--rot': `${rot}deg`,
              animationDelay: `${delay}s`,
            } as any}
          />
        );
      })}
    </div>
  );
};

export const ResultsScreen = ({ results, onRestart }: Props) => {
  const [revealStage, setRevealStage] = useState<'COUNTDOWN' | 'WINNER' | 'FULL_RESULTS'>('COUNTDOWN');
  const [count, setCount] = useState(3);

  // Extract players from the first result's sentiment keys
  const players = results.length > 0 ? Object.keys(results[0].sentiment) : [];

  useEffect(() => {
    if (revealStage === 'COUNTDOWN') {
      if (count > 0) {
        const timer = setTimeout(() => setCount(c => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setRevealStage('WINNER');
        // Auto advance to full results after 4 seconds of winner focus
        const advance = setTimeout(() => setRevealStage('FULL_RESULTS'), 4000);
        return () => clearTimeout(advance);
      }
    }
  }, [count, revealStage]);

  if (revealStage === 'COUNTDOWN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in bg-background">
        <h2 className="text-2xl font-semibold text-muted-foreground mb-8 uppercase tracking-[0.2em] animate-pulse">Calculating Consensus</h2>
        <div className="relative flex items-center justify-center">
          <div className="text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary/80 to-primary/20 animate-scale-in" key={count}>
            {count}
          </div>
          <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-ping opacity-20" />
        </div>
      </div>
    );
  }

  const winner = results[0];
  const podium = results.slice(0, 3);
  const remaining = results.slice(3);

  if (revealStage === 'WINNER') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background overflow-hidden relative">
        <Confetti />
        <div className="absolute top-10 w-full text-center z-10 animate-fade-in">
          <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-[0.3em] text-gold drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">
            The Group Has Spoken
          </h2>
        </div>

        <div className="relative w-full max-w-sm aspect-[2/3] rounded-3xl overflow-hidden shadow-[0_0_80px_-15px_rgba(255,215,0,0.4)] animate-winner-zoom ring-4 ring-gold/50 z-20">
          <img src={winner.movie.poster} alt={winner.movie.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 w-full text-center">
            <h1 className="text-4xl font-black text-white drop-shadow-lg mb-2">{winner.movie.title}</h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/20 backdrop-blur-md border border-gold/50 text-gold-foreground font-bold">
              <Trophy className="w-5 h-5" /> Score: {winner.score}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 animate-fade-in">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12">
        <div className="flex flex-col items-center mb-12 animate-slide-up">
          <Logo />
          <h1 className="text-3xl sm:text-4xl font-bold mt-8 mb-3">Final Consensus</h1>
          <p className="text-muted-foreground text-center max-w-md">
            The weighted scores are in. Here is how your group's cinematic preferences aligned.
          </p>
        </div>

        {/* Podium Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {podium.map((res, idx) => {
            const isWinner = idx === 0;
            const rankLabel = idx === 0 ? "1st Place" : idx === 1 ? "2nd Place" : "3rd Place";
            const delta = idx > 0 ? `-${podium[idx - 1].score - res.score}` : null;

            return (
              <div key={res.movie.id} className={`relative flex flex-col rounded-2xl overflow-hidden border ${isWinner ? 'border-gold/50 shadow-[0_0_30px_rgba(255,215,0,0.15)] ring-1 ring-gold/20 scale-105 z-10' : 'border-white/10 shadow-lg bg-white/5'} transition-transform hover:-translate-y-2`}>
                <div className="aspect-[3/4] relative w-full">
                  <img src={res.movie.poster} className="w-full h-full object-cover" alt={res.movie.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />

                  {/* Rank Badge */}
                  <div className={`absolute top-4 left-4 flex items-center justify-center w-10 h-10 rounded-full backdrop-blur-md border ${isWinner ? 'bg-gold/20 border-gold/50 text-gold' : 'bg-white/10 border-white/20 text-white'}`}>
                    <span className="font-bold text-lg">{idx + 1}</span>
                  </div>

                  {/* Score */}
                  <div className="absolute top-4 right-4 flex flex-col items-end">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-md border border-white/10 font-bold">
                      <Star className={`w-4 h-4 ${isWinner ? 'text-gold fill-gold' : 'text-primary'}`} />
                      {res.score} pts
                    </div>
                    {delta && (
                      <span className="text-xs text-muted-foreground mt-1 mr-1 font-mono">{delta} from above</span>
                    )}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl mb-1 line-clamp-1">{res.movie.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <span>{res.movie.year}</span> • <span>{res.movie.genre[0]}</span>
                  </div>

                  <div className="mt-auto pt-4 flex gap-2">
                    {res.movie.watchUrl && (
                      <Button className="w-full bg-white text-black hover:bg-gray-200" onClick={() => window.open(res.movie.watchUrl, '_blank')}>
                        <PlayCircle className="w-4 h-4 mr-2" />
                        Watch Now
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sentiment Grid Matrix */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" /> Full Breakdown
          </h2>

          <div className="overflow-x-auto custom-scrollbar pb-4">
            <table className="w-full min-w-[600px] text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 font-semibold rounded-tl-xl">Film</th>
                  <th className="px-4 py-3 font-semibold text-center">Score</th>
                  {players.map(p => (
                    <th key={p} className="px-4 py-3 font-semibold text-center">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.map((res, i) => (
                  <tr key={res.movie.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-4 flex items-center gap-3">
                      <span className="text-muted-foreground font-mono w-4">{i + 1}.</span>
                      <img src={res.movie.poster} className="w-8 h-12 object-cover rounded-md" alt="" />
                      <span className="font-medium max-w-[150px] truncate">{res.movie.title}</span>
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-primary">{res.score}</td>
                    {players.map(p => {
                      const vote = res.sentiment[p];
                      return (
                        <td key={p} className="px-4 py-4 text-center">
                          <div className="flex justify-center">
                            {vote === 'love' ? (
                              <div className="bg-pink-500/20 text-pink-500 p-1.5 rounded-full ring-1 ring-pink-500/30" title="Super Like (+3)">
                                <Heart className="w-4 h-4 fill-pink-500" />
                              </div>
                            ) : vote === 'yes' ? (
                              <div className="bg-primary/20 text-primary p-1.5 rounded-full ring-1 ring-primary/30" title="Like (+1)">
                                <Check className="w-4 h-4" />
                              </div>
                            ) : (
                              <div className="bg-muted/20 text-muted-foreground p-1.5 rounded-full ring-1 ring-white/10" title="Pass (0)">
                                <XIcon className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center pb-10">
          <Button
            onClick={onRestart}
            variant="outline"
            size="lg"
            className="h-14 px-8 text-base font-semibold border-white/20 hover:bg-white/10 transition-spring rounded-xl"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            Start New Session
          </Button>
        </div>
      </div>
    </div>
  );
};
