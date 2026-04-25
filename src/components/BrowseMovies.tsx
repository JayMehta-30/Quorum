"use client";
import { useState } from 'react';
import { useGameStore } from '@/store/useGameStore';
import { MOVIES, ALL_GENRES } from '@/data/movies';
import { Button } from './ui/button';
import { ArrowRight, Check, Star, Dice5, Film } from 'lucide-react';

export const BrowseMovies = () => {
  const { toggleMovieSelection, selectedMovies, setSelectedMovies, setPhase } = useGameStore();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const filteredMovies = MOVIES.filter((m) =>
    selectedGenres.length === 0 ? true : m.genre.some((g) => selectedGenres.includes(g))
  );

  const pickRandom = () => {
    const shuffled = [...filteredMovies].sort(() => 0.5 - Math.random());
    setSelectedMovies(shuffled.slice(0, 5));
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col pointer-events-auto h-screen bg-background/40 backdrop-blur-sm overflow-hidden">

      {/* Sticky Header */}
      <div className="sticky top-0 z-30 flex flex-col p-6 bg-gradient-to-b from-background/90 to-transparent pt-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Pool Selection</h1>
            <p className="text-muted-foreground font-medium">Select the movies you want to swipe on.</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="bg-black/40 backdrop-blur-md border-white/10 text-white rounded-full h-12 px-5 hover:bg-white/10"
              onClick={pickRandom}
            >
              <Dice5 className="w-5 h-5 mr-2" />
              Pick 5 Random
            </Button>
            <div className="bg-black/60 backdrop-blur-md border border-white/10 text-white px-6 py-3 rounded-full flex items-center gap-4 shadow-xl">
              <span className="font-semibold">{selectedMovies.length} selected</span>
              <Button
                className="pointer-events-auto rounded-full h-8 px-4"
                disabled={selectedMovies.length === 0}
                onClick={() => setPhase("LOBBY")}
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Genre filter */}
        <div className="flex items-center gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] mask-edges">
          <div className="flex items-center gap-2 shrink-0 text-white bg-black/40 px-3 py-2 rounded-full border border-white/10">
            <Film className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-[0.15em]">Genres</span>
          </div>
          {ALL_GENRES.map((g) => {
            const active = selectedGenres.includes(g);
            return (
              <button
                key={g}
                onClick={() => toggleGenre(g)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-spring active:scale-95 ${active
                    ? "bg-primary text-primary-foreground shadow-glow scale-105"
                    : "bg-black/40 text-white/70 hover:text-white hover:bg-black/60 border border-white/10"
                  }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-6 pt-0 pb-32 custom-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto mt-4">
          {filteredMovies.map((movie) => {
            const isSelected = selectedMovies.some((m) => m.id === movie.id);

            return (
              <div
                key={movie.id}
                onClick={() => toggleMovieSelection(movie)}
                className={`relative group cursor-pointer aspect-[2/3] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${isSelected ? 'ring-4 ring-primary ring-offset-2 ring-offset-background' : 'ring-1 ring-white/10'
                  }`}
              >
                {/* Poster Image */}
                <img
                  src={movie.poster}
                  alt={`${movie.title} poster`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${isSelected ? 'opacity-80' : 'opacity-60 group-hover:opacity-80'}`} />

                {/* Rating Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/60 backdrop-blur-md border border-white/10">
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <span className="text-xs font-semibold tabular-nums">{movie.rating.toFixed(1)}</span>
                </div>

                {/* Selection Checkmark */}
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground p-1.5 rounded-full shadow-lg animate-in zoom-in duration-200">
                    <Check className="w-4 h-4" />
                  </div>
                )}

                {/* Movie Details */}
                <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1 transform transition-transform duration-300">
                  <h3 className="text-lg font-bold leading-tight text-white line-clamp-2 drop-shadow-md">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-white/70">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span className="truncate">{movie.genre.slice(0, 2).join(", ")}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
