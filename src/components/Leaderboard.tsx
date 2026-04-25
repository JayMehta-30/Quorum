"use client";

import { useGameStore } from "@/store/useGameStore";
import { MOVIE_DECK } from "@/data/movies";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { Trophy, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

export default function Leaderboard() {
  const { votes, resetGame } = useGameStore();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  // Calculate scores
  const results = MOVIE_DECK.map(movie => ({
    ...movie,
    score: votes[movie.id] || 0
  })).sort((a, b) => b.score - a.score);

  const top3 = results.slice(0, 3);
  const others = results.slice(3, 10); // Show next 7

  return (
    <div className="w-full min-h-screen p-6 py-12 flex flex-col items-center relative overflow-x-hidden">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={500}
        colors={['#FF4D6D', '#4ECDC4', '#FFFFFF', '#FFD700']}
      />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16 z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">
          Final Rankings
        </h1>
        <p className="text-text-secondary">The group has spoken.</p>
      </motion.div>

      {/* Podium for Top 3 */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-6 mb-20 z-10 w-full max-w-4xl">
        {/* 2nd Place */}
        {top3[1] && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center order-2 md:order-1"
          >
            <div className="text-2xl font-bold text-gray-300 mb-2">2nd</div>
            <div className="w-40 aspect-[2/3] rounded-2xl overflow-hidden glass relative">
              <img src={top3[1].imageUrl} alt={top3[1].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 text-center text-sm font-bold truncate">
                {top3[1].title}
              </div>
            </div>
            <div className="mt-4 font-mono text-accent font-bold text-xl">{top3[1].score} pts</div>
          </motion.div>
        )}

        {/* 1st Place */}
        {top3[0] && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="flex flex-col items-center order-1 md:order-2 z-20 mb-8 md:mb-0"
          >
            <Trophy className="text-yellow-400 mb-4 w-12 h-12 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
            <div className="w-56 aspect-[2/3] rounded-3xl overflow-hidden glass-glow relative">
              <img src={top3[0].imageUrl} alt={top3[0].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <div className="font-bold text-xl mb-1 truncate">{top3[0].title}</div>
                <div className="text-xs text-secondary">{top3[0].year}</div>
              </div>
            </div>
            <div className="mt-6 font-mono text-yellow-400 font-bold text-3xl drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">
              {top3[0].score} pts
            </div>
          </motion.div>
        )}

        {/* 3rd Place */}
        {top3[2] && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col items-center order-3"
          >
            <div className="text-2xl font-bold text-amber-600 mb-2">3rd</div>
            <div className="w-36 aspect-[2/3] rounded-xl overflow-hidden glass relative">
              <img src={top3[2].imageUrl} alt={top3[2].title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-2 left-2 right-2 text-center text-xs font-bold truncate">
                {top3[2].title}
              </div>
            </div>
            <div className="mt-4 font-mono text-accent font-bold text-lg">{top3[2].score} pts</div>
          </motion.div>
        )}
      </div>

      {/* Runner ups list */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="w-full max-w-2xl flex flex-col space-y-3 z-10"
      >
        <h3 className="text-text-secondary uppercase tracking-widest text-sm mb-4">Runner Ups</h3>
        {others.map((movie, index) => (
          <div key={movie.id} className="flex items-center justify-between p-4 glass rounded-xl">
            <div className="flex items-center space-x-4">
              <div className="font-mono text-text-secondary w-6 text-right">{index + 4}</div>
              <img src={movie.imageUrl} alt={movie.title} className="w-12 h-12 rounded object-cover" />
              <div>
                <div className="font-bold">{movie.title}</div>
                <div className="text-xs text-text-secondary">{movie.genre}</div>
              </div>
            </div>
            <div className="font-mono font-bold">{movie.score}</div>
          </div>
        ))}
      </motion.div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={resetGame}
        className="mt-16 flex items-center space-x-2 px-8 py-4 glass rounded-full hover:bg-white/10 transition-colors z-10"
      >
        <RotateCcw size={20} />
        <span>Start New Session</span>
      </motion.button>
    </div>
  );
}
