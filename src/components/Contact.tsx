import React from "react";
import { profile, socials } from "../data/site";
import { Reveal, SocialGlyph } from "./primitives";

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

  return (
    <section id="contact" className="relative">
      {/* Curved divider — light to dark */}
      <div className="relative w-full h-[200px] md:h-[280px] overflow-hidden">
        <div
          className="absolute inset-x-[-5%] bottom-0 h-full rounded-t-[50%] bg-[#1C1D20]"
          style={{ transform: "scaleX(1.1)" }}
        />
      </div>

      {/* Dark contact section */}
      <div className="bg-[#1C1D20] text-white pb-0">
        <div className="shell">
          {/* CTA block */}
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 lg:gap-20 pb-16 md:pb-24">
              {/* Left: big heading + portrait circle */}
              <div className="flex items-end gap-6 md:gap-10">
                <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden shrink-0 border-2 border-white/20 bg-[#999D9E] flex items-end justify-center pt-2">
                  <img
                    src="/brand/portrait-clean.png"
                    alt={profile.name}
                    className="w-full h-auto object-bottom scale-110"
                  />
                </div>
                <div>
                  <h2 className="display text-white text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] tracking-[-0.03em]">
                    Let's work
                    <br />
                    together
                  </h2>
                </div>
              </div>

              {/* Right: CTA button */}
              <a href={`mailto:${profile.email}`} className="magnetic-btn shrink-0">
                Get in touch
              </a>
            </div>
          </Reveal>

          {/* Contact details strip */}
          <Reveal delay={0.1}>
            <div className="border-t border-white/10 py-10 md:py-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div>
                <span className="label !text-white/40 block mb-2">Email</span>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-white/80 hover:text-white transition-colors text-sm break-all"
                >
                  {profile.email}
                </a>
              </div>
              <div>
                <span className="label !text-white/40 block mb-2">WhatsApp</span>
                <a
                  href={profile.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {profile.phoneDisplay}
                </a>
              </div>
              <div>
                <span className="label !text-white/40 block mb-2">Telegram</span>
                <a
                  href={profile.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 hover:text-white transition-colors text-sm"
                >
                  {profile.telegramHandle}
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Footer bar */}
        <footer className="border-t border-white/10">
          <div className="shell py-8 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: copyright */}
            <span className="text-xs text-white/40 tracking-wide">
              © {new Date().getFullYear()} {profile.name}
            </span>

            {/* Center: local time */}
            <span className="text-xs text-white/40 tracking-wide">
              Local time — {localTime}
            </span>

            {/* Right: socials */}
            {liveSocials.length > 0 && (
              <ul className="flex items-center gap-4">
                {liveSocials.map((s) => (
                  <li key={s.key}>
                    <a
                      href={s.url as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      className="text-white/40 hover:text-white transition-colors duration-400"
                    >
                      <SocialGlyph name={s.key} />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </footer>
      </div>
    </section>
  );
};

export default Contact;
