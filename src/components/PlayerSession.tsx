"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CardStack from "./CardStack";
import { useGameStore } from "@/store/useGameStore";

export default function PlayerSession() {
  const { players, currentPlayerIndex } = useGameStore();
  const [showIntro, setShowIntro] = useState(true);

  const currentPlayer = players[currentPlayerIndex];

  if (!currentPlayer) return null;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -50 }}
            className="flex flex-col items-center space-y-6"
          >
            <h2 className="text-sm font-medium tracking-[0.2em] text-accent uppercase">
              Up Next
            </h2>
            <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-text-secondary text-center">
              {currentPlayer}&apos;s Turn
            </h1>
            <p className="text-text-secondary text-center max-w-sm">
              Swipe right for YES, left for NO, or up if you absolutely LOVE it.
            </p>
            <button
              onClick={() => setShowIntro(false)}
              className="mt-8 px-8 py-4 bg-white text-background rounded-full font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform"
            >
              Start Swiping
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="stack"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full h-full flex flex-col items-center"
          >
            <div className="w-full flex justify-between items-center mb-8 max-w-md">
              <span className="text-text-secondary font-medium">{currentPlayer}</span>
              <span className="text-text-secondary text-sm">
                Player {currentPlayerIndex + 1} of {players.length}
              </span>
            </div>
            
            {/* The actual Card Stack */}
            <CardStack key={`stack-${currentPlayerIndex}`} />
            
            {/* Action Hints */}
            <div className="mt-8 flex items-center justify-center space-x-12 text-text-secondary opacity-50">
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">←</span>
                <span className="text-xs">NOPE</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">↑</span>
                <span className="text-xs">LOVE</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">→</span>
                <span className="text-xs">YES</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
