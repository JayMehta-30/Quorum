"use client";
import { MOVIES } from "@/data/movies";

/**
 * Slow-drifting marquee of movie posters used as a hero accent on the start screen.
 * Pure CSS animation — GPU-friendly.
 */
export const PosterMarquee = () => {
  // Two columns of posters scrolling in opposite directions
  const colA = MOVIES.slice(0, 8);
  const colB = MOVIES.slice(8, 16);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-white/5">
      {/* Top/bottom fade masks */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 z-10 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 z-10 bg-gradient-to-t from-background to-transparent" />

      <div className="grid grid-cols-2 gap-3 p-3 h-full">
        <div className="relative overflow-hidden">
          <div className="flex flex-col gap-3 animate-marquee-up">
            {[...colA, ...colA].map((m, i) => (
              <img
                key={`a-${m.id}-${i}`}
                src={m.poster}
                alt=""
                className="w-full aspect-[2/3] object-cover rounded-xl shadow-card-cinema"
                loading="lazy"
                aria-hidden
              />
            ))}
          </div>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex flex-col gap-3 animate-marquee-down mt-[-30%]">
            {[...colB, ...colB].map((m, i) => (
              <img
                key={`b-${m.id}-${i}`}
                src={m.poster}
                alt=""
                className="w-full aspect-[2/3] object-cover rounded-xl shadow-card-cinema"
                loading="lazy"
                aria-hidden
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
