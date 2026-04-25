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
    const pool = filteredMovies.length > 0 ? filteredMovies : MOVIES;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    setSelectedMovies(shuffled.slice(0, 5));
  };

  return (
    <div className="absolute inset-0 z-20 flex flex-col pointer-events-auto h-screen bg-background/60 backdrop-blur-xl overflow-hidden animate-fade-in">

      {/* Premium Header */}
      <div className="sticky top-0 z-30 flex flex-col p-8 bg-gradient-to-b from-background via-background/95 to-transparent pt-12 pb-10">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row md:items-end justify-between gap-8 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary mb-2">
              <Film className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Step 1: Build the Pool</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tighter text-white drop-shadow-2xl">
              Curate Your <span className="text-gradient-primary">Session.</span>
            </h1>
            <p className="text-muted-foreground text-lg font-medium max-w-xl">
              Filter by genre and select the movies you want to vote on. At least one movie required.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              variant="outline"
              className="bg-white/5 backdrop-blur-md border-white/10 text-white rounded-2xl h-14 px-6 hover:bg-white hover:text-black transition-all duration-300 font-bold group"
              onClick={pickRandom}
            >
              <Dice5 className="w-5 h-5 mr-3 group-hover:rotate-180 transition-transform duration-500" />
              Pick 5 Random
            </Button>

            <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-2 rounded-[1.5rem] flex items-center gap-6 shadow-2xl">
              <div className="pl-4">
                <span className="block text-[10px] uppercase tracking-widest text-white/50 font-black">Selection</span>
                <span className="text-white font-black text-xl tabular-nums">{selectedMovies.length} <span className="text-xs text-white/40">FILMS</span></span>
              </div>
              <Button
                size="lg"
                className="rounded-2xl h-12 px-8 font-black uppercase tracking-widest shadow-glow group"
                disabled={selectedMovies.length === 0}
                onClick={() => setPhase("LOBBY")}
              >
                Continue
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        {/* Genre filter - Primary Step */}
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex items-center gap-2 shrink-0 text-white/40 font-black text-xs uppercase tracking-widest mr-2">
              Genres
            </div>
            {ALL_GENRES.map((g) => {
              const active = selectedGenres.includes(g);
              return (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`shrink-0 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 active:scale-95 border ${active
                      ? "bg-primary border-primary text-white shadow-glow"
                      : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border-white/5"
                    }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-8 pt-0 pb-32 custom-scrollbar scroll-smooth">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8 max-w-7xl mx-auto mt-4">
          {filteredMovies.map((movie) => {
            const isSelected = selectedMovies.some((m) => m.id === movie.id);

            return (
              <div
                key={movie.id}
                onClick={() => toggleMovieSelection(movie)}
                className={`relative group cursor-pointer aspect-[2/3] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:shadow-primary/20 ${isSelected ? 'ring-4 ring-primary ring-offset-8 ring-offset-background' : 'ring-1 ring-white/10'
                  }`}
              >
                {/* Poster Image */}
                <img
                  src={movie.poster}
                  alt={`${movie.title} poster`}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&q=80";
                  }}
                />

                {/* Premium Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-500 ${isSelected ? 'opacity-90' : 'opacity-60 group-hover:opacity-80'}`} />

                {/* Rating Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  <span className="text-xs font-bold tabular-nums text-white">{movie.rating.toFixed(1)}</span>
                </div>

                {/* Selection Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
                    <div className="bg-primary text-white p-4 rounded-full shadow-[0_0_40px_rgba(255,51,102,0.8)] animate-in zoom-in duration-300 scale-125">
                      <Check className="w-8 h-8 stroke-[3]" />
                    </div>
                  </div>
                )}

                {/* Movie Details */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1 transform transition-transform duration-500 group-hover:translate-y-[-4px]">
                  <h3 className="text-xl font-black leading-tight text-white line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    {movie.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-white/70 uppercase tracking-widest">
                    <span>{movie.year}</span>
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    <span className="truncate">{movie.genre[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMovies.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Film className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No movies found</h3>
            <p className="text-muted-foreground">Try selecting a different genre or clearing filters.</p>
            <Button
              variant="link"
              className="mt-4 text-primary font-bold"
              onClick={() => setSelectedGenres([])}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
