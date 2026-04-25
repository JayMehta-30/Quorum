"use client";
/**
 * Animated cinematic aurora background.
 * Layered radial gradients drift slowly — pure CSS, no canvas, GPU-friendly.
 */
export const AuroraBackground = () => {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base radial vignette */}
      <div className="absolute inset-0 bg-background" />

      {/* Drifting color blobs */}
      <div
        className="absolute -top-1/4 -left-1/4 h-[60vmax] w-[60vmax] rounded-full opacity-40 blur-3xl animate-aurora-1"
        style={{ background: "radial-gradient(circle, hsl(348 100% 60% / 0.6), transparent 60%)" }}
      />
      <div
        className="absolute top-1/3 -right-1/4 h-[55vmax] w-[55vmax] rounded-full opacity-30 blur-3xl animate-aurora-2"
        style={{ background: "radial-gradient(circle, hsl(280 100% 60% / 0.55), transparent 60%)" }}
      />
      <div
        className="absolute -bottom-1/3 left-1/4 h-[50vmax] w-[50vmax] rounded-full opacity-25 blur-3xl animate-aurora-3"
        style={{ background: "radial-gradient(circle, hsl(220 100% 60% / 0.5), transparent 60%)" }}
      />

      {/* Subtle grain via SVG noise for filmic texture */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.035] mix-blend-overlay" aria-hidden>
        <filter id="n">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
        </filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>
    </div>
  );
};
