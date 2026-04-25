"use client";

import { useGameStore } from "@/store/useGameStore";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlayerSession from "@/components/PlayerSession";
import RevealScene from "@/components/RevealScene";
import Leaderboard from "@/components/Leaderboard";
import { Plus, Play, UserX } from "lucide-react";

export default function Home() {
  const { phase, players, addPlayer, removePlayer, startGame } = useGameStore();
  const [newPlayer, setNewPlayer] = useState("");

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlayer.trim()) {
      addPlayer(newPlayer);
      setNewPlayer("");
    }
  };

  return (
    <main className="min-h-screen w-full bg-background text-text-primary overflow-hidden relative">
      <AnimatePresence mode="wait">
        {phase === 'LOBBY' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="w-full min-h-screen flex flex-col items-center justify-center p-6"
          >
            <div className="max-w-md w-full space-y-8">
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring" }}
                  className="inline-block px-4 py-1.5 rounded-full glass text-accent text-sm font-medium tracking-widest mb-6"
                >
                  QUORUM
                </motion.div>
                <h1 className="text-5xl font-bold tracking-tight mb-4">
                  Decide <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary">Together</span>
                </h1>
                <p className="text-text-secondary">
                  Add players to begin the cinematic voting session.
                </p>
              </div>

              <div className="glass p-6 rounded-3xl space-y-6">
                <form onSubmit={handleAddPlayer} className="flex space-x-2">
                  <input
                    type="text"
                    value={newPlayer}
                    onChange={(e) => setNewPlayer(e.target.value)}
                    placeholder="Enter player name..."
                    className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!newPlayer.trim()}
                    className="bg-accent text-white p-3 rounded-xl hover:bg-accent/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus size={24} />
                  </button>
                </form>

                <div className="space-y-2 max-h-[30vh] overflow-y-auto">
                  <AnimatePresence>
                    {players.map((player) => (
                      <motion.div
                        key={player}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
                      >
                        <span className="font-medium">{player}</span>
                        <button
                          onClick={() => removePlayer(player)}
                          className="text-text-secondary hover:text-red-400 transition-colors"
                        >
                          <UserX size={18} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {players.length === 0 && (
                    <div className="text-center text-text-secondary text-sm py-4">
                      No players added yet
                    </div>
                  )}
                </div>

                <button
                  onClick={startGame}
                  disabled={players.length === 0}
                  className="w-full flex items-center justify-center space-x-2 bg-white text-background py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  <span>Start Session</span>
                  <Play size={20} className="fill-current" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'VOTING' && (
          <motion.div key="voting" className="absolute inset-0">
            <PlayerSession />
          </motion.div>
        )}

        {phase === 'REVEAL' && (
          <motion.div key="reveal" className="absolute inset-0">
            <RevealScene />
          </motion.div>
        )}

        {phase === 'LEADERBOARD' && (
          <motion.div key="leaderboard" className="absolute inset-0 overflow-y-auto">
            <Leaderboard />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
