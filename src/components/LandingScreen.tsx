import { Logo } from "./Logo";
import { Button } from "./ui/button";

interface Props {
  onGetStarted: () => void;
}

export const LandingScreen = ({ onGetStarted }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-12 text-center p-6">
      <div className="space-y-6">
        <Logo className="w-24 h-24 mx-auto mb-8" />
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50">
          Find What To Watch.
          <br />
          <span className="text-primary/90">Together.</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
          The ultimate movie night decider. Browse the globe, stack your favorites, and swipe to agree.
        </p>
      </div>

      <Button
        onClick={onGetStarted}
        size="lg"
        className="h-16 px-12 text-2xl font-bold rounded-full bg-white text-black hover:bg-white/90 hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]"
      >
        Get Started
      </Button>
    </div>
  );
};
