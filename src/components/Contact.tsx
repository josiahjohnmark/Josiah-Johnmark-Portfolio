import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { profile, socials } from "../data/site";
import { Reveal, SocialGlyph } from "./primitives";
import Magnetic from "./Magnetic";

const liveSocials = socials.filter((s) => s.url);

/* Format the user's local time */
const useLocalTime = () => {
  const [time, setTime] = React.useState(() =>
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short",
    })
  );

  React.useEffect(() => {
    const id = setInterval(
      () =>
        setTime(
          new Date().toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short",
          })
        ),
      30_000
    );
    return () => clearInterval(id);
  }, []);

  return time;
};

const Contact: React.FC = () => {
  const localTime = useLocalTime();
  const footerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  // Dennis Snellenberg signature: blue "Get in touch" circle slides softly
  // from near the center towards the right as the footer is unmasked
  const buttonSlideX = useTransform(scrollYProgress, [0, 1], [-130, 0]);

  return (
    <div
      ref={footerRef}
      id="contact"
      className="relative bg-[#1C1D20] text-white pt-16 md:pt-24 select-none z-0"
    >
      <div className="shell">
        {/* =========================================================================
            TOP CTA BLOCK — Dennis Snellenberg Signature Layout (Matching Image 5):
            - Left: portrait avatar + "Let's work together"
            - Right: Arrow + Blue sliding magnetic circle "Get in touch"
            ========================================================================= */}
        <div className="pb-16 md:pb-24">
          <div className="flex items-center gap-5 md:gap-8 mb-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden shrink-0 border-2 border-white/20 bg-[#999D9E] flex items-end justify-center pt-2 shadow-2xl">
              <img
                src="/brand/portrait-clean.png"
                alt={profile.name}
                width={120}
                height={120}
                loading="lazy"
                decoding="async"
                className="w-full h-auto object-bottom scale-110 drop-shadow-md"
              />
            </div>
            <h2 className="display text-white text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.92] tracking-[-0.03em]">
              Let's work
            </h2>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pt-1">
            <h2 className="display text-white text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.92] tracking-[-0.03em]">
              together
            </h2>

            <div className="flex items-center gap-6 md:gap-12">
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-white/40 hidden sm:block"
                aria-hidden="true"
              >
                <path d="M7 17L17 7M17 17H7" />
              </svg>

              {/* Dennis Snellenberg Blue Magnetic Circle Button */}
              <motion.div style={{ x: buttonSlideX }}>
                <Magnetic strength={0.4}>
                  <a
                    href={`mailto:${profile.email}`}
                    className="w-[145px] h-[145px] sm:w-[165px] sm:h-[165px] md:w-[185px] md:h-[185px] rounded-full bg-[#455CE9] text-white flex items-center justify-center font-sans font-medium text-base md:text-lg shadow-2xl transition-transform duration-300 hover:scale-105 active:scale-95"
                    style={{
                      boxShadow: "0 20px 40px -10px rgba(69, 92, 233, 0.55)",
                    }}
                  >
                    Get in touch
                  </a>
                </Magnetic>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Action pills: Email & Phone */}
        <div className="flex flex-wrap items-center gap-4 pb-14 border-b border-white/10">
          <Magnetic strength={0.25}>
            <a
              href={`mailto:${profile.email}`}
              className="btn btn-ghost !border-white/20 !text-white hover:!bg-white/10 rounded-full !px-7 !py-4 text-sm font-medium tracking-wide"
            >
              {profile.email}
            </a>
          </Magnetic>

          <Magnetic strength={0.25}>
            <a
              href={profile.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost !border-white/20 !text-white hover:!bg-white/10 rounded-full !px-7 !py-4 text-sm font-medium tracking-wide"
            >
              {profile.phoneDisplay}
            </a>
          </Magnetic>
        </div>

        {/* Contact details metadata */}
        <div className="py-12 md:py-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
          <div>
            <span className="label !text-white/40 block mb-2">Location</span>
            <p className="text-white/80">Nigeria · Remote worldwide</p>
          </div>
          <div>
            <span className="label !text-white/40 block mb-2">Telegram</span>
            <a
              href={profile.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white transition-colors"
            >
              {profile.telegramHandle}
            </a>
          </div>
          <div>
            <span className="label !text-white/40 block mb-2">Status</span>
            <span className="inline-flex items-center gap-2 text-white/80">
              <span className="w-2 h-2 rounded-full bg-[#3DD68C] animate-pulse" />
              Available for projects &amp; contracts
            </span>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <footer className="border-t border-white/10">
        <div className="shell py-8 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left: copyright */}
          <span className="text-xs text-white/40 tracking-wide font-sans">
            © {new Date().getFullYear()} {profile.name}
          </span>

          {/* Center: local time */}
          <span className="text-xs text-white/40 tracking-wide font-sans">
            Local time — {localTime}
          </span>

          {/* Right: socials */}
          {liveSocials.length > 0 && (
            <ul className="flex items-center gap-5">
              {liveSocials.map((s) => (
                <li key={s.key}>
                  <Magnetic strength={0.3}>
                    <a
                      href={s.url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      className="text-white/40 hover:text-white transition-colors duration-300 block p-1"
                    >
                      <SocialGlyph name={s.key} />
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Contact;
