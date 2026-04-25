"use client";
import { useState, useEffect } from "react";
import { Trophy, Crown, Medal, RotateCcw, Heart, Check, X as XIcon, PlayCircle, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";
import type { Movie } from "@/data/movies";

export interface MovieScore {
  movie: Movie;
  score: number;
  sentiment: Record<number | string, string>;
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
  const [showConfetti, setShowConfetti] = useState(false);

  // Extract players from the first result's sentiment keys
  const players = results.length > 0 ? Object.keys(results[0].sentiment) : [];

  useEffect(() => {
    if (revealStage === 'COUNTDOWN') {
      if (count > 0) {
        const timer = setTimeout(() => setCount(c => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setRevealStage('WINNER');
        setShowConfetti(true);
        // Auto advance to full results after 5 seconds of winner focus
        const advance = setTimeout(() => setRevealStage('FULL_RESULTS'), 5000);
        return () => clearTimeout(advance);
      }
    }
  }, [count, revealStage]);

  if (revealStage === 'COUNTDOWN') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in bg-background/80 backdrop-blur-xl">
        <div className="text-center space-y-12">
          <h2 className="text-2xl font-black text-primary uppercase tracking-[0.4em] animate-pulse">
            The Results Are In
          </h2>
          <div className="relative flex items-center justify-center h-64 w-64 mx-auto">
            <div className="absolute inset-0 border-8 border-primary/20 rounded-full" />
            <div
              className="absolute inset-0 border-8 border-primary rounded-full animate-[spin_3s_linear_infinite]"
              style={{ clipPath: 'polygon(50% 0%, 100% 0%, 100% 50%, 50% 50%)' }}
            />
            <div className="text-[12rem] font-black text-white drop-shadow-[0_0_30px_rgba(255,51,102,0.5)] animate-scale-in" key={count}>
              {count}
            </div>
          </div>
          <p className="text-muted-foreground font-medium tracking-wide">Syncing collective movie brain...</p>
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
        {showConfetti && <Confetti />}

        {/* Animated Background Text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
          <h1 className="text-[25vw] font-black leading-none text-white whitespace-nowrap animate-float">
            WINNER
          </h1>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-gold/30 text-gold mb-8 animate-fade-in">
            <Crown className="w-4 h-4 fill-gold" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">The Ultimate Pick</span>
          </div>

          <div className="relative w-full max-w-sm aspect-[2/3] rounded-[3.5rem] overflow-hidden shadow-[0_0_120px_-10px_rgba(255,215,0,0.4)] animate-winner-zoom ring-8 ring-gold/30 z-20">
            <img
              src={winner.movie.poster}
              alt={winner.movie.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-10 w-full text-center">
              <h1 className="text-5xl font-black text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)] mb-5">{winner.movie.title}</h1>
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-3xl bg-gold text-gold-foreground font-black text-2xl shadow-gold animate-bounce">
                <Trophy className="w-7 h-7" /> {winner.score} PTS
              </div>
            </div>
          </div>

          <button
            onClick={() => setRevealStage('FULL_RESULTS')}
            className="mt-12 px-6 py-2 rounded-full glass text-white/60 hover:text-white transition-all text-sm font-bold tracking-widest uppercase animate-fade-in group"
          >
            Show Full Leaderboard <ArrowRight className="inline-block ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/40 backdrop-blur-md pb-24 animate-fade-in">
      <div className="max-w-6xl mx-auto px-6 pt-16">
        <div className="flex flex-col items-center mb-16 text-center animate-slide-up">
          <Logo size="lg" className="mb-8" />
          <h1 className="text-5xl sm:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-white/40 mb-4">
            The Leaderboard
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto font-medium">
            Collective scores based on your group's "Love", "Yes", and "No" sentiments.
          </p>
        </div>

        {/* Podium Top 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 items-end max-w-5xl mx-auto">
          {podium.map((res, idx) => {
            const rank = idx + 1;
            const isFirst = rank === 1;
            const isSecond = rank === 2;
            const isThird = rank === 3;

            const order = isFirst ? 'md:order-2' : isSecond ? 'md:order-1' : 'md:order-3';
            const height = isFirst ? 'h-[550px]' : isSecond ? 'h-[480px]' : 'h-[440px]';
            const scale = isFirst ? 'scale-110 z-10' : 'scale-100';

            return (
              <div
                key={res.movie.id}
                className={`relative flex flex-col group ${order} ${scale} transition-all duration-500 hover:z-20`}
              >
                {/* Ranking Floating Icon */}
                <div className={`absolute -top-6 left-1/2 -translate-x-1/2 z-30 w-12 h-12 rounded-full border-4 border-background flex items-center justify-center shadow-xl ${isFirst ? 'bg-gold text-gold-foreground' :
                    isSecond ? 'bg-slate-300 text-slate-800' :
                      'bg-amber-700 text-amber-100'
                  }`}>
                  {isFirst ? <Crown className="w-6 h-6 fill-current" /> : <span className="font-black text-xl">{rank}</span>}
                </div>

                <div className={`relative w-full ${height} rounded-[2.5rem] overflow-hidden border ${isFirst ? 'border-gold/50 shadow-gold' : 'border-white/10 shadow-2xl'} bg-gradient-card group-hover:-translate-y-2 transition-transform duration-500`}>
                  <img src={res.movie.poster} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={res.movie.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

                  <div className="absolute bottom-0 left-0 right-0 p-8 pt-20">
                    <h3 className="font-black text-2xl sm:text-3xl text-white mb-2 leading-tight line-clamp-2 drop-shadow-lg">
                      {res.movie.title}
                    </h3>
                    <div className="flex items-center gap-3 text-white/60 text-sm font-medium mb-6">
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-accent text-accent" /> {res.movie.rating.toFixed(1)}</span>
                      <span>•</span>
                      <span>{res.movie.year}</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between px-5 py-3 rounded-2xl glass border-white/20">
                        <span className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Score</span>
                        <span className="text-white font-black text-xl">{res.score} <span className="text-xs text-white/50">PTS</span></span>
                      </div>

                      {res.movie.watchUrl && (
                        <Button
                          className={`w-full h-12 rounded-2xl font-bold transition-all ${isFirst ? 'bg-gold text-gold-foreground hover:bg-gold/90' : 'bg-white text-black hover:bg-white/90'
                            }`}
                          onClick={() => window.open(res.movie.watchUrl, '_blank')}
                        >
                          <PlayCircle className="w-5 h-5 mr-2" />
                          Watch Now
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sentiment Grid Matrix */}
        <div className="glass border-white/10 rounded-[3rem] p-8 sm:p-12 mb-16 animate-slide-up shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white mb-2 flex items-center gap-3">
                <Trophy className="w-8 h-8 text-primary" /> Sentiment Matrix
              </h2>
              <p className="text-muted-foreground font-medium">How every player voted across the entire selection pool.</p>
            </div>
            <div className="flex items-center gap-4 bg-black/40 p-2 rounded-2xl border border-white/10">
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-pink-500">
                <Heart className="w-3 h-3 fill-current" /> Love (+3)
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                <Check className="w-3 h-3" /> Yes (+1)
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <XIcon className="w-3 h-3" /> No (0)
              </div>
            </div>
          </div>

          <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[700px] text-sm text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-xs text-muted-foreground uppercase tracking-[0.2em] font-black">
                  <th className="px-6 py-4">Film</th>
                  <th className="px-6 py-4 text-center">Final</th>
                  {players.map(p => (
                    <th key={p} className="px-6 py-4 text-center">{p}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((res, i) => (
                  <tr key={res.movie.id} className="group">
                    <td className="px-6 py-4 bg-white/5 group-hover:bg-white/10 transition-colors rounded-l-3xl border-y border-l border-white/5">
                      <div className="flex items-center gap-4">
                        <span className="text-muted-foreground/40 font-black w-6 text-base italic">{i + 1}</span>
                        <img
                          src={res.movie.poster}
                          className="w-10 h-14 object-cover rounded-xl shadow-lg"
                          alt=""
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-white text-base leading-tight mb-1">{res.movie.title}</span>
                          <span className="text-xs text-muted-foreground font-medium">{res.movie.genre[0]} · {res.movie.year}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 bg-white/5 group-hover:bg-white/10 transition-colors text-center border-y border-white/5">
                      <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-black border border-primary/30 shadow-glow shadow-primary/20">
                        {res.score}
                      </div>
                    </td>
                    {players.map((p, pIdx) => {
                      const vote = res.sentiment[pIdx];
                      const isLast = pIdx === players.length - 1;
                      return (
                        <td key={p} className={`px-6 py-4 bg-white/5 group-hover:bg-white/10 transition-colors text-center border-y ${isLast ? 'rounded-r-3xl border-r' : ''} border-white/5`}>
                          <div className="flex justify-center">
                            {vote === 'love' ? (
                              <div className="bg-pink-500/20 text-pink-500 w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.3)]" title="Super Like (+3)">
                                <Heart className="w-5 h-5 fill-pink-500 animate-pulse" />
                              </div>
                            ) : vote === 'yes' ? (
                              <div className="bg-primary/20 text-primary w-10 h-10 rounded-full flex items-center justify-center ring-2 ring-primary/30" title="Like (+1)">
                                <Check className="w-5 h-5" />
                              </div>
                            ) : (
                              <div className="bg-white/5 text-muted-foreground/30 w-10 h-10 rounded-full flex items-center justify-center border border-white/10" title="Pass (0)">
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

        <div className="flex flex-col items-center gap-6 pb-20">
          <Button
            onClick={onRestart}
            variant="outline"
            className="h-16 px-12 text-lg font-black uppercase tracking-widest border-white/20 bg-white/5 hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all duration-500 rounded-full shadow-2xl"
          >
            <RotateCcw className="mr-3 h-6 w-6" />
            Regame
          </Button>
          <p className="text-muted-foreground text-sm font-medium">Ready for another round? Reset the pool and players.</p>
        </div>
      </div>
    </div>
  );
};
