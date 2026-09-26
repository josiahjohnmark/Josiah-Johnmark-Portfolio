import React, { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "motion/react";

/* --------------------------------------------------------------------------
   50 major-language greetings — the final one is English "Hello"
   Dennis Snellenberg signature sequence
   -------------------------------------------------------------------------- */
const GREETINGS = [
  "مرحبا",       // Arabic
  "হ্যালো",       // Bengali
  "Здравейте",   // Bulgarian
  "မင်္ဂလာပါ",     // Burmese
  "你好",         // Chinese (Mandarin)
  "Ahoj",        // Czech
  "Hej",         // Danish
  "Hallo",       // Dutch
  "Tere",        // Estonian
  "Kamusta",     // Filipino
  "Hei",         // Finnish
  "Bonjour",     // French
  "Hallo",       // German
  "Γεια σας",    // Greek
  "નમસ્તે",       // Gujarati
  "Aloha",       // Hawaiian
  "שלום",        // Hebrew
  "नमस्ते",       // Hindi
  "Szia",        // Hungarian
  "Halló",       // Icelandic
  "Halo",        // Indonesian
  "Ciao",        // Italian
  "こんにちは",   // Japanese
  "ಹಲೋ",        // Kannada
  "안녕하세요",   // Korean
  "Salve",       // Latin
  "Sveiki",      // Latvian
  "Sveiki",      // Lithuanian
  "Здраво",      // Macedonian
  "Hai",         // Malay
  "ഹലോ",        // Malayalam
  "Bongu",       // Maltese
  "Hei",         // Norwegian
  "سلام",        // Persian
  "Cześć",       // Polish
  "Olá",         // Portuguese
  "ਸਤ ਸ੍ਰੀ ਅਕਾਲ", // Punjabi
  "Salut",       // Romanian
  "Привет",      // Russian
  "Здраво",      // Serbian
  "Ahoj",        // Slovak
  "Živjo",       // Slovenian
  "Hola",        // Spanish
  "Habari",      // Swahili
  "Hej",         // Swedish
  "สวัสดี",       // Thai
  "Merhaba",     // Turkish
  "Привіт",      // Ukrainian
  "Xin chào",    // Vietnamese
  "Hello",       // English — the finale
];

const TOTAL_GREETINGS = GREETINGS.length;
const TOTAL_DURATION_MS = 2800;
const HOLD_HELLO_MS = 1000; // Exactly 1 second on "Hello"

interface LoaderProps {
  onStartOpening?: () => void;
  onComplete: () => void;
}

const curveEase = [0.76, 0, 0.24, 1] as const;

const Loader: React.FC<LoaderProps> = ({ onStartOpening, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [greeting, setGreeting] = useState(GREETINGS[0]);
  const [phase, setPhase] = useState<"counting" | "holding" | "rising" | "done">("counting");
  const [dimension, setDimension] = useState({ width: 0, height: 0 });

  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const lastIdxRef = useRef<number>(-1);

  // Measure window dimensions
  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => {
      setDimension({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock scroll to top while loader is active
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Progress counter and greeting cycler
  const tick = useCallback(
    (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / TOTAL_DURATION_MS, 1);

      const eased = 1 - Math.pow(1 - t, 3);
      const pct = Math.round(eased * 100);
      setProgress(pct);

      const idx = Math.min(
        Math.floor(eased * TOTAL_GREETINGS),
        TOTAL_GREETINGS - 1
      );
      if (idx !== lastIdxRef.current) {
        lastIdxRef.current = idx;
        setGreeting(GREETINGS[idx]);
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setProgress(100);
        setGreeting(GREETINGS[TOTAL_GREETINGS - 1]);
        setPhase("holding");
      }
    },
    []
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [tick]);

  useEffect(() => {
    if (phase === "holding") {
      const timer = setTimeout(() => {
        window.scrollTo(0, 0);
        setPhase("rising");
        onStartOpening?.();
      }, HOLD_HELLO_MS);
      return () => clearTimeout(timer);
    }
  }, [phase, onStartOpening]);

  if (phase === "done" || dimension.width === 0) return null;

  // Dennis Snellenberg SVG curve coordinates:
  // Starts with a concave curve extending 300px below window height,
  // then flattens out as the entire curtain slides up off-screen.
  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 320} 0 ${dimension.height} L0 0`;
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height} 0 ${dimension.height} L0 0`;

  const isRising = phase === "rising";

  return (
    <motion.div
      initial={{ top: 0 }}
      animate={isRising ? { top: "-100vh" } : { top: 0 }}
      transition={{ duration: 0.95, ease: curveEase as unknown as number[] }}
      onAnimationComplete={() => {
        if (isRising) {
          window.scrollTo(0, 0);
          setPhase("done");
          onComplete();
        }
      }}
      className="fixed inset-0 z-[99999] h-screen w-screen pointer-events-none"
    >
      {/* Curved SVG curtain — fills background and sweeps upward with liquid curve */}
      <svg
        className="absolute top-0 w-full h-[calc(100%+320px)] pointer-events-none fill-[#1C1D20]"
        viewBox={`0 0 ${dimension.width} ${dimension.height + 320}`}
      >
        <motion.path
          initial={{ d: initialPath }}
          animate={isRising ? { d: targetPath } : { d: initialPath }}
          transition={{ duration: 0.95, ease: curveEase as unknown as number[] }}
        />
      </svg>

      {/* Greeting text + counter — sits centered inside the dark curtain, fades up as curtain ascends */}
      <div
        className="relative z-10 h-full w-full flex flex-col items-center justify-center gap-6 select-none"
        style={{
          opacity: isRising ? 0 : 1,
          transform: isRising ? "translateY(-40px)" : "translateY(0px)",
          transition: "opacity 0.25s ease, transform 0.3s ease",
        }}
      >
        <div className="h-[5rem] sm:h-[6rem] md:h-[8rem] flex items-center justify-center overflow-hidden">
          <span className="text-white font-sans font-light text-[clamp(2.5rem,8vw,5.5rem)] tracking-[-0.03em] leading-none whitespace-nowrap">
            {greeting}
          </span>
        </div>

        <div className="w-[60px] h-px bg-white/20" />

        <span className="text-white/40 font-mono text-sm md:text-base tracking-widest tabular-nums">
          {String(progress).padStart(3, "\u2007")}%
        </span>
      </div>
    </motion.div>
  );
};

export default Loader;
