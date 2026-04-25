"use client";
import { forwardRef } from "react";
import { Star, Clock, Calendar } from "lucide-react";
import type { Movie } from "@/data/movies";

interface MovieCardProps extends React.HTMLAttributes<HTMLDivElement> {
  movie: Movie;
}

export const MovieCard = forwardRef<HTMLDivElement, MovieCardProps>(
  ({ movie, className = "", style, ...rest }, ref) => {
    return (
      <div
        ref={ref}
        style={style}
        className={`absolute inset-0 rounded-[2rem] overflow-hidden shadow-card-cinema bg-gradient-card transition-spring will-change-transform ${className}`}
        {...rest}
      >
        <img
          src={movie.poster}
          alt={`${movie.title} poster`}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-overlay" />

        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background/60 backdrop-blur-xl border border-white/10">
            <Star className="h-3.5 w-3.5 fill-accent text-accent" />
            <span className="text-sm font-semibold tabular-nums">{movie.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {movie.genre.map((g) => (
              <span
                key={g}
                className="px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider rounded-full bg-white/10 text-foreground/90 border border-white/15 backdrop-blur-md"
              >
                {g}
              </span>
            ))}
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold leading-tight tracking-tight drop-shadow-lg">
            {movie.title}
          </h2>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {movie.year}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> {movie.runtime}
            </span>
          </div>
          <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3">{movie.overview}</p>
        </div>
      </div>
    );
  }
);
MovieCard.displayName = "MovieCard";
