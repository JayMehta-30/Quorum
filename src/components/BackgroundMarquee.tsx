"use client";
import { MOVIES } from "@/data/movies";

export const BackgroundMarquee = () => {
  // Use all movies for the background to reduce repetition
  const bgMovies = [...MOVIES].sort((a, b) => a.id.localeCompare(b.id));

  // Generate columns deterministically so SSR matches Client perfectly
  const columns = Array.from({ length: 8 }).map((_, i) => {
    // Offset each column by a unique amount based on its index
    const offset = (i * 13) % bgMovies.length;
    return [...bgMovies.slice(offset), ...bgMovies.slice(0, offset)];
  });

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-x-0 top-0 h-32 z-10 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-32 z-10 bg-gradient-to-t from-background to-transparent" />

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 gap-3 sm:gap-4 p-3 sm:p-4 h-[120vh] -mt-[10vh] w-full opacity-[0.15]">
        {columns.map((colMovies, i) => {
          const isUp = i % 2 === 0;
          return (
            <div key={i} className="relative h-full overflow-hidden">
              <div
                className={`flex flex-col gap-3 sm:gap-4 ${isUp ? 'animate-marquee-up' : 'animate-marquee-down'} ${!isUp ? 'mt-[-50%]' : ''}`}
                // Slightly vary the animation duration per column for a more organic feel
                style={{ animationDuration: `${30 + (i % 4) * 8}s` }}
              >
                {[...colMovies.slice(0, 15), ...colMovies.slice(0, 15)].map((m, idx) => (
                  <img
                    key={`${i}-${m.id}-${idx}`}
                    src={m.poster}
                    alt=""
                    className="w-full aspect-[2/3] object-cover rounded-xl shadow-card-cinema"
                    loading="lazy"
                    aria-hidden
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
