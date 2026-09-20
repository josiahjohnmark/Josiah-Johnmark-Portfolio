import React from "react";
import { profile, resumeUrl, socials } from "../data/site";
import { Arrow, Mark, Reveal, SocialGlyph } from "./primitives";

const liveSocials = socials.filter((s) => s.url);

const Contact: React.FC = () => (
  <section id="contact" className="section hairline pb-0">
    <div className="shell">
      <Reveal>
        <div className="flex items-center gap-4 mb-8">
          <span className="rule-index">05</span>
          <span className="h-px flex-1 bg-[var(--line)]" aria-hidden="true" />
        </div>

        <h2 className="h-section text-bone max-w-[16ch]">
          Have something you want built?
        </h2>

        <p className="lede mt-6 max-w-[46ch]">
          Games, apps, client websites or interface design — tell me what you have
          in mind and I will tell you honestly whether I am the right person for it.
        </p>
      </Reveal>

      {/* Primary contact — the email is the hero of this section */}
      <Reveal delay={0.08}>
        <a
          href={`mailto:${profile.email}`}
          className="group/mail block mt-12 md:mt-16 border-t border-[var(--line)] pt-8"
        >
          <span className="label block mb-3">Email</span>
          <span className="display text-bone text-[clamp(1.35rem,5.6vw,3.25rem)] break-words transition-colors duration-500 group-hover/mail:text-gold inline-flex items-baseline gap-4 max-w-full">
            {profile.email}
            <Arrow
              size={22}
              className="hidden sm:inline-block shrink-0 -translate-y-0.5 transition-transform duration-500 group-hover/mail:translate-x-2"
            />
          </span>
        </a>
      </Reveal>

      {/* Secondary channels */}
      <Reveal delay={0.12}>
        <div className="mt-10 grid sm:grid-cols-2 gap-px bg-[var(--line)] border border-[var(--line)] rounded-2xl overflow-hidden">
          <a
            href={profile.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ink hover:bg-ink-elev transition-colors duration-400 p-7 md:p-8 flex flex-col gap-2"
          >
            <span className="label">WhatsApp</span>
            <span className="text-bone text-lg">{profile.phoneDisplay}</span>
            <span className="text-sm text-bone-faint mt-1">
              Fastest reply during the day
            </span>
          </a>

          <a
            href={profile.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-ink hover:bg-ink-elev transition-colors duration-400 p-7 md:p-8 flex flex-col gap-2"
          >
            <span className="label">Telegram</span>
            <span className="text-bone text-lg">{profile.telegramHandle}</span>
            <span className="text-sm text-bone-faint mt-1">
              Good for files and longer briefs
            </span>
          </a>
        </div>
      </Reveal>

      {resumeUrl && (
        <Reveal delay={0.16}>
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost mt-8"
          >
            Download CV
          </a>
        </Reveal>
      )}
    </div>

    {/* ---------------------------- Footer ---------------------------- */}
    <footer className="mt-24 md:mt-32 border-t border-[var(--line)]">
      <div className="shell py-12 md:py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <Mark className="h-9 text-bone" />
            <p className="mt-5 text-sm text-bone-muted max-w-[28ch]">
              {profile.role}. {profile.location}.
            </p>
          </div>

          {liveSocials.length > 0 && (
            <ul className="flex items-center gap-2">
              {liveSocials.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    title={s.label}
                    className="w-12 h-12 rounded-full border border-[var(--line)] flex items-center justify-center text-bone-muted hover:text-bone hover:border-[var(--line-strong)] transition-colors duration-400"
                  >
                    <SocialGlyph name={s.key} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-12 pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row gap-3 justify-between">
          <span className="label">
            © {new Date().getFullYear()} {profile.name}
          </span>
          <a href="#top" className="label hover:text-bone-muted transition-colors">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  </section>
);

export default Contact;
