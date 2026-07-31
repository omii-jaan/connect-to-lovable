/**
 * Restrained CSS-3D wireframe orb: nested rotating rings on a real 3D
 * transform stack. Decorative only, faint by design, frozen under
 * prefers-reduced-motion via the global motion query.
 */
const RINGS = [
  { size: 100, rotate: 0, duration: "26s", opacity: 0.5 },
  { size: 84, rotate: 62, duration: "34s", opacity: 0.38 },
  { size: 68, rotate: 118, duration: "44s", opacity: 0.28 },
  { size: 52, rotate: 24, duration: "20s", opacity: 0.2 },
];

const HeroOrb = ({ className = "" }: { className?: string }) => {
  return (
    <div
      aria-hidden
      className={`pointer-events-none select-none ${className}`}
      style={{ perspective: "900px" }}
    >
      <div className="relative w-full h-full [transform-style:preserve-3d] animate-orb-drift">
        {RINGS.map((ring) => (
          <div
            key={ring.size}
            className="absolute left-1/2 top-1/2 rounded-full border border-primary animate-orb-spin"
            style={{
              width: `${ring.size}%`,
              height: `${ring.size}%`,
              marginLeft: `-${ring.size / 2}%`,
              marginTop: `-${ring.size / 2}%`,
              opacity: ring.opacity,
              transformStyle: "preserve-3d",
              animationDuration: ring.duration,
              ["--orb-tilt" as string]: `${ring.rotate}deg`,
            }}
          />
        ))}
        <div className="absolute left-1/2 top-1/2 w-2 h-2 -ml-1 -mt-1 rounded-full bg-primary/50 blur-[2px]" />
      </div>
    </div>
  );
};

export default HeroOrb;
