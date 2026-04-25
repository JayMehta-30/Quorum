"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import SwipeCard from "./SwipeCard";
import { useGameStore } from "@/store/useGameStore";
import { MOVIE_DECK } from "@/data/movies";

export default function CardStack() {
  const [deckIndex, setDeckIndex] = useState(0);
  const { recordVote, nextPlayer } = useGameStore();

  const handleSwipe = (score: number, movieId: string) => {
    recordVote(movieId, score);
    
    setTimeout(() => {
      if (deckIndex + 1 < MOVIE_DECK.length) {
        setDeckIndex((prev) => prev + 1);
      } else {
        // Deck finished for this player
        nextPlayer();
      }
    }, 200); // Small delay to let the exit animation play
  };

  const remainingMovies = MOVIE_DECK.slice(deckIndex, deckIndex + 3); // Only render top 3 for performance

  return (
    <div className="relative w-full h-[60vh] flex items-center justify-center max-w-md mx-auto">
      <AnimatePresence>
        {remainingMovies.map((movie, index) => (
          <SwipeCard
            key={`${movie.id}-${deckIndex + index}`}
            movie={movie}
            index={index}
            active={index === 0}
            onSwipe={(score) => handleSwipe(score, movie.id)}
          />
        ))}
      </AnimatePresence>
      
      {remainingMovies.length === 0 && (
        <div className="text-center text-text-secondary mt-10">
          <p className="text-xl">Out of cards!</p>
        </div>
      )}
    </div>
  );
}
