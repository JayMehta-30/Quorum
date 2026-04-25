"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";

export default function RevealScene() {
  const [count, setCount] = useState(5);
  const { phase } = useGameStore();

  useEffect(() => {
    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Transition handled in the parent via state, but we can just set a small delay here
      const timer = setTimeout(() => {
        useGameStore.setState({ phase: 'LEADERBOARD' });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [count]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-background overflow-hidden">
      {/* Pulsing blurred background */}
      <motion.div
        className="absolute inset-0 bg-accent/20"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut" 
        }}
        style={{ filter: "blur(100px)" }}
      />

      <AnimatePresence mode="wait">
        {count > 0 ? (
          <motion.div
            key={count}
            initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            exit={{ scale: 1.5, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.5, type: "spring" }}
            className="text-[15rem] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 z-10"
          >
            {count}
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-secondary z-10 text-center tracking-tighter"
          >
            The Results Are In
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
