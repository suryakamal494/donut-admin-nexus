// Subject Background Pattern - Decorative SVG patterns for each subject

import { cn } from "@/lib/utils";

type SubjectPattern = "math" | "physics" | "chemistry" | "biology" | "english" | "cs";

interface SubjectBackgroundPatternProps {
  pattern: SubjectPattern;
  className?: string;
}

// Mathematics: Grid lines with equation fragments
const MathPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Grid lines */}
    <line x1="0" y1="30" x2="200" y2="30" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="0" y1="60" x2="200" y2="60" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="0" y1="90" x2="200" y2="90" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="50" y1="0" x2="50" y2="120" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="100" y1="0" x2="100" y2="120" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    <line x1="150" y1="0" x2="150" y2="120" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
    {/* Parabola curve */}
    <path d="M 20 100 Q 100 -20 180 100" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" />
    {/* Pi symbol */}
    <text x="160" y="40" fill="currentColor" fontSize="24" opacity="0.3" fontFamily="serif">π</text>
    {/* Sigma */}
    <text x="30" y="50" fill="currentColor" fontSize="20" opacity="0.25" fontFamily="serif">Σ</text>
  </svg>
);

// Physics: Orbit rings and wave patterns
const PhysicsPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Atom orbit rings */}
    <ellipse cx="160" cy="60" rx="35" ry="15" stroke="currentColor" strokeWidth="1" opacity="0.3" transform="rotate(-30 160 60)" />
    <ellipse cx="160" cy="60" rx="35" ry="15" stroke="currentColor" strokeWidth="1" opacity="0.3" transform="rotate(30 160 60)" />
    <ellipse cx="160" cy="60" rx="35" ry="15" stroke="currentColor" strokeWidth="1" opacity="0.3" transform="rotate(90 160 60)" />
    <circle cx="160" cy="60" r="5" fill="currentColor" opacity="0.4" />
    {/* Wave pattern */}
    <path d="M 10 80 Q 30 60 50 80 T 90 80 T 130 80" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.35" />
    {/* Small electron dots */}
    <circle cx="130" cy="50" r="2" fill="currentColor" opacity="0.4" />
    <circle cx="175" cy="85" r="2" fill="currentColor" opacity="0.4" />
  </svg>
);

// Chemistry: Hexagon molecule structures
const ChemistryPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Benzene ring */}
    <path d="M 150 30 L 170 42 L 170 66 L 150 78 L 130 66 L 130 42 Z" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.35" />
    <path d="M 145 38 L 158 46 L 158 62 L 145 70 L 132 62 L 132 46 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
    {/* Connection lines */}
    <line x1="170" y1="54" x2="190" y2="54" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    <line x1="130" y1="54" x2="110" y2="54" stroke="currentColor" strokeWidth="1" opacity="0.3" />
    {/* Small molecules */}
    <circle cx="105" cy="54" r="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
    <circle cx="40" cy="80" r="6" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
    <circle cx="60" cy="70" r="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25" />
    <line x1="46" y1="76" x2="56" y2="72" stroke="currentColor" strokeWidth="1" opacity="0.25" />
  </svg>
);

// Biology: Cell-like circles and leaf veins
const BiologyPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cell */}
    <ellipse cx="155" cy="60" rx="35" ry="28" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />
    <ellipse cx="155" cy="60" rx="12" ry="10" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.35" />
    {/* Mitochondria-like shapes */}
    <ellipse cx="170" cy="45" rx="8" ry="4" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.25" transform="rotate(20 170 45)" />
    <ellipse cx="140" cy="75" rx="7" ry="3" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.25" transform="rotate(-15 140 75)" />
    {/* Leaf outline */}
    <path d="M 30 90 Q 50 50 30 20 Q 70 50 30 90" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
    <path d="M 30 90 Q 45 60 30 35" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.25" />
  </svg>
);

// English: Quote marks and text lines
const EnglishPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Quote marks */}
    <text x="140" y="45" fill="currentColor" fontSize="48" opacity="0.2" fontFamily="serif">"</text>
    <text x="175" y="95" fill="currentColor" fontSize="48" opacity="0.2" fontFamily="serif">"</text>
    {/* Text lines */}
    <line x1="20" y1="70" x2="80" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.25" strokeLinecap="round" />
    <line x1="20" y1="82" x2="60" y2="82" stroke="currentColor" strokeWidth="2" opacity="0.2" strokeLinecap="round" />
    <line x1="20" y1="94" x2="70" y2="94" stroke="currentColor" strokeWidth="2" opacity="0.15" strokeLinecap="round" />
    {/* Pen tip */}
    <path d="M 95 95 L 105 85 L 108 92 Z" fill="currentColor" opacity="0.25" />
    <line x1="105" y1="85" x2="115" y2="75" stroke="currentColor" strokeWidth="2" opacity="0.25" />
  </svg>
);

// Computer Science: Code brackets and binary
const CSPattern = () => (
  <svg className="w-full h-full" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Curly braces */}
    <text x="140" y="70" fill="currentColor" fontSize="56" opacity="0.25" fontFamily="monospace">{"{"}</text>
    <text x="175" y="70" fill="currentColor" fontSize="56" opacity="0.25" fontFamily="monospace">{"}"}</text>
    {/* Code dots */}
    <circle cx="155" cy="45" r="2" fill="currentColor" opacity="0.3" />
    <circle cx="163" cy="45" r="2" fill="currentColor" opacity="0.3" />
    <circle cx="171" cy="45" r="2" fill="currentColor" opacity="0.3" />
    {/* Binary */}
    <text x="25" y="85" fill="currentColor" fontSize="10" opacity="0.2" fontFamily="monospace">01101</text>
    <text x="25" y="98" fill="currentColor" fontSize="10" opacity="0.15" fontFamily="monospace">10110</text>
    {/* Angle brackets */}
    <text x="70" y="50" fill="currentColor" fontSize="20" opacity="0.3" fontFamily="monospace">&lt;/&gt;</text>
  </svg>
);

const patternComponents: Record<SubjectPattern, React.FC> = {
  math: MathPattern,
  physics: PhysicsPattern,
  chemistry: ChemistryPattern,
  biology: BiologyPattern,
  english: EnglishPattern,
  cs: CSPattern,
};

const SubjectBackgroundPattern = ({ pattern, className }: SubjectBackgroundPatternProps) => {
  const PatternComponent = patternComponents[pattern] || MathPattern;

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <div className="absolute top-0 right-0 w-2/3 h-full opacity-60">
        <PatternComponent />
      </div>
    </div>
  );
};

export default SubjectBackgroundPattern;
