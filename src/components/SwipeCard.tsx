"use client";

import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion";
import { Movie } from "@/data/movies";
import { useState } from "react";
import { Heart, X, Check } from "lucide-react";

interface SwipeCardProps {
  movie: Movie;
  active: boolean;
  onSwipe: (score: number) => void;
  index: number;
}

export default function SwipeCard({ movie, active, onSwipe, index }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0);
  const [exitY, setExitY] = useState(0);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Rotations & Scales based on X and Y movements
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Icon Opacities
  const nopeOpacity = useTransform(x, [-100, -50, 0], [1, 0.5, 0]);
  const yesOpacity = useTransform(x, [0, 50, 100], [0, 0.5, 1]);
  const loveOpacity = useTransform(y, [-100, -50, 0], [1, 0.5, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    const thresholdX = 100;
    const thresholdY = -100; // Swipe up

    if (info.offset.y < thresholdY) {
      setExitY(-1000);
      onSwipe(3); // LOVE
    } else if (info.offset.x > thresholdX) {
      setExitX(1000);
      onSwipe(1); // YES
    } else if (info.offset.x < -thresholdX) {
      setExitX(-1000);
      onSwipe(0); // NO
    }
  };

  const isFront = index === 0;

  return (
    <motion.div
      className="absolute top-0 left-0 w-full h-full flex items-center justify-center p-4"
      style={{
        zIndex: 50 - index,
      }}
      initial={{ scale: 0.95, y: 30, opacity: 0 }}
      animate={{ 
        scale: isFront ? 1 : 1 - index * 0.05, 
        y: isFront ? 0 : index * 15,
        opacity: isFront ? 1 : 1 - index * 0.2
      }}
      exit={{ x: exitX, y: exitY, opacity: 0, transition: { duration: 0.3 } }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div
        drag={active ? true : false}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        onDragEnd={handleDragEnd}
        style={{ x, y, rotate }}
        whileTap={{ cursor: "grabbing" }}
        className="w-full max-w-[350px] aspect-[2/3] glass rounded-3xl overflow-hidden relative cursor-grab shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        <img
          src={movie.imageUrl}
          alt={movie.title}
          className="w-full h-full object-cover pointer-events-none"
          draggable={false}
        />
        
        {/* Gradients and Details */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
        
        <div className="absolute bottom-0 left-0 w-full p-6 text-white pointer-events-none">
          <p className="text-secondary font-semibold text-sm mb-1">{movie.year} • {movie.genre}</p>
          <h2 className="text-3xl font-bold mb-2 tracking-tight">{movie.title}</h2>
          <p className="text-sm text-text-secondary line-clamp-2">{movie.description}</p>
        </div>

        {/* Feedback Icons overlay */}
        <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 rotate-12 border-4 border-red-500 rounded-full p-2 text-red-500">
          <X size={48} strokeWidth={3} />
        </motion.div>
        
        <motion.div style={{ opacity: yesOpacity }} className="absolute top-8 left-8 -rotate-12 border-4 border-green-500 rounded-full p-2 text-green-500">
          <Check size={48} strokeWidth={3} />
        </motion.div>

        <motion.div style={{ opacity: loveOpacity }} className="absolute bottom-32 left-1/2 -translate-x-1/2 -translate-y-1/2 border-4 border-pink-500 bg-pink-500/20 backdrop-blur-sm rounded-full p-4 text-pink-500">
          <Heart size={64} fill="currentColor" strokeWidth={0} />
        </motion.div>

      </motion.div>
    </motion.div>
  );
}
