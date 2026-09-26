import React, { useEffect, useState, useCallback, useRef } from "react";

/* --------------------------------------------------------------------------
   50 major-language greetings — the final one is English "Hello"
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
const TOTAL_DURATION_MS = 3000;
const HOLD_HELLO_MS = 1000;       // Exactly 1 second as requested
const DOOR_DURATION_S = 1.25;

interface LoaderProps {
  onStartOpening?: () => void;
  onComplete: () => void;
}

const Loader: React.FC<LoaderProps> = ({ onStartOpening, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [greeting, setGreeting] = useState(GREETINGS[0]);
  const [phase, setPhase] = useState<"counting" | "holding" | "opening" | "done">("counting");
  const startRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const lastIdxRef = useRef<number>(-1);

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
        setPhase("opening");
        onStartOpening?.();
      }, HOLD_HELLO_MS);
      return () => clearTimeout(timer);
    }
    if (phase === "opening") {
      const timer = setTimeout(
        () => {
          setPhase("done");
          onComplete();
        },
        DOOR_DURATION_S * 1000 + 200
      );
      return () => clearTimeout(timer);
    }
  }, [phase, onStartOpening, onComplete]);

  if (phase === "done") return null;

  const isOpening = phase === "opening";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
      aria-hidden="true"
    >
      {/* LEFT DOOR */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 bg-[#1C1D20] z-[10001]"
        style={{
          transform: isOpening ? "translateX(-100%)" : "translateX(0%)",
          transition: isOpening
            ? `transform ${DOOR_DURATION_S}s cubic-bezier(0.16, 1, 0.3, 1)`
            : "none",
        }}
      />

      {/* RIGHT DOOR */}
      <div
        className="absolute inset-y-0 right-0 w-1/2 bg-[#1C1D20] z-[10001]"
        style={{
          transform: isOpening ? "translateX(100%)" : "translateX(0%)",
          transition: isOpening
            ? `transform ${DOOR_DURATION_S}s cubic-bezier(0.16, 1, 0.3, 1)`
            : "none",
        }}
      />

      {/* GREETING + COUNTER — fades out swiftly as doors begin parting */}
      <div
        className="relative z-[10002] flex flex-col items-center justify-center gap-6 select-none"
        style={{
          opacity: isOpening ? 0 : 1,
          transform: isOpening ? "scale(0.92)" : "scale(1)",
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
    </div>
  );
};

export default Loader;
