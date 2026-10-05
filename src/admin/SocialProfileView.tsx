import React from "react";
import {
  Check,
  Globe,
  Mail,
  MessageCircle,
  Phone,
  Send,
  Share2,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { Content, Profile } from "../data/schema";
import { SOCIAL_KEYS } from "../data/schema";

interface SocialProfileViewProps {
  content: Content;
  patch: (fn: (draft: Content) => void) => void;
  errors: Record<string, string>;
}

export const SocialProfileView: React.FC<SocialProfileViewProps> = ({ content, patch, errors }) => {
  const p = content.profile;

  const setProfile = <K extends keyof Profile>(key: K, value: Profile[K]) => {
    patch((draft) => {
      draft.profile[key] = value;
    });
  };

  return (
    <div className="space-y-8 animate-fade-in text-white">
      {/* Top Profile Card / Creator Bio Bar */}
      <div className="p-6 rounded-2xl bg-[#141417] border border-white/10 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 flex items-center justify-center text-xl font-bold text-white shadow-lg">
                {p.initials || "JJ"}
              </div>
              <span
                className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#141417] ${
                  p.available ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
                }`}
                title={p.available ? "Available for work" : "Unavailable"}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-medium text-white">{p.name || "Josiah Johnmark"}</h2>
                <span className="text-xs text-zinc-400 font-mono">@josiahjohnmark</span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">{p.role || "Product Designer & Art Director"}</p>
            </div>
          </div>

          {/* Quick Availability Status Toggle */}
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-2xl border border-white/5">
            <div className="text-right">
              <span className="text-xs font-medium text-white block">
                {p.available ? "Available for Work" : "Not Taking Work"}
              </span>
              <span className="text-[10px] text-zinc-400">Hero status badge</span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={p.available}
              onClick={() => setProfile("available", !p.available)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                p.available ? "bg-emerald-500" : "bg-zinc-700"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  p.available ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Bio & One-Liner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={p.name}
                onChange={(e) => setProfile("name", e.target.value)}
                className="w-full bg-[#18181c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Primary Role
              </label>
              <input
                type="text"
                value={p.role}
                onChange={(e) => setProfile("role", e.target.value)}
                className="w-full bg-[#18181c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={p.location}
                onChange={(e) => setProfile("location", e.target.value)}
                className="w-full bg-[#18181c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Bio / Statement (Hero Sentence)
              </label>
              <textarea
                rows={4}
                value={p.statement}
                onChange={(e) => setProfile("statement", e.target.value)}
                className="w-full bg-[#18181c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 leading-relaxed"
                placeholder="The headline visitors read first..."
              />
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Keep it under 160 characters for best typography impact.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Availability Badge Text
              </label>
              <input
                type="text"
                value={p.availableLabel}
                onChange={(e) => setProfile("availableLabel", e.target.value)}
                placeholder="Available for work"
                className="w-full bg-[#18181c] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Direct Messaging & Client Reach */}
      <div className="p-6 rounded-2xl bg-[#141417] border border-white/5 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-emerald-400" />
          Direct Messaging & Contact Links
        </h3>
        <p className="text-xs text-zinc-400">
          These links power the "Let's work together" buttons in your footer and contact section.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={p.email}
              onChange={(e) => setProfile("email", e.target.value)}
              className="w-full bg-[#18181c] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
              Phone Number Display
            </label>
            <input
              type="text"
              value={p.phoneDisplay}
              onChange={(e) => setProfile("phoneDisplay", e.target.value)}
              className="w-full bg-[#18181c] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
              WhatsApp Link
            </label>
            <input
              type="text"
              placeholder="https://wa.me/234..."
              value={p.whatsapp}
              onChange={(e) => setProfile("whatsapp", e.target.value)}
              className="w-full bg-[#18181c] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
              Telegram Link
            </label>
            <input
              type="text"
              placeholder="https://t.me/..."
              value={p.telegram}
              onChange={(e) => setProfile("telegram", e.target.value)}
              className="w-full bg-[#18181c] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>
      </div>

      {/* Social Media Profiles */}
      <div className="p-6 rounded-2xl bg-[#141417] border border-white/5 space-y-5">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-200 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-sky-400" />
          Social Media Handles
        </h3>
        <p className="text-xs text-zinc-400">
          Leave any link empty to automatically hide that icon from your portfolio.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SOCIAL_KEYS.map((key) => {
            const row = content.socials.find((s) => s.key === key);
            const label = row?.label ?? key;

            return (
              <div key={key}>
                <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1 capitalize">
                  {label}
                </label>
                <input
                  type="text"
                  placeholder={`https://${key}.com/...`}
                  value={row?.url ?? ""}
                  onChange={(e) => {
                    const v = e.target.value.trim() === "" ? null : e.target.value.trim();
                    patch((draft) => {
                      const item = draft.socials.find((s) => s.key === key);
                      if (item) item.url = v;
                      else draft.socials.push({ key, label, url: v });
                    });
                  }}
                  className="w-full bg-[#18181c] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* CV Document */}
      <div className="p-6 rounded-2xl bg-[#141417] border border-white/5 space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-200">
          Resume / CV File
        </h3>
        <p className="text-xs text-zinc-400">
          Path to your resume in the public folder. Leave empty to hide CV download buttons.
        </p>
        <input
          type="text"
          placeholder="/josiah-johnmark-cv.pdf"
          value={content.resumeUrl || ""}
          onChange={(e) => {
            const v = e.target.value.trim() === "" ? null : e.target.value.trim();
            patch((draft) => {
              draft.resumeUrl = v;
            });
          }}
          className="w-full bg-[#18181c] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-amber-400"
        />
      </div>
    </div>
  );
};
