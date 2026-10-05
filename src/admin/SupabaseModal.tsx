import React, { useState } from "react";
import {
  Check,
  Copy,
  Database,
  ExternalLink,
  ShieldCheck,
  X,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  getSupabaseConfig,
  saveSupabaseConfig,
  clearSupabaseConfig,
  testSupabaseConnection,
  SUPABASE_SQL_SCHEMA,
} from "../lib/supabase";

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose, onSaved }) => {
  const current = getSupabaseConfig();
  const [url, setUrl] = useState(current.url);
  const [anonKey, setAnonKey] = useState(current.anonKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
    tableReady: boolean;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection(url, anonKey);
      setTestResult(res);
      if (res.ok && res.tableReady) {
        saveSupabaseConfig(url, anonKey);
        onSaved();
      }
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    saveSupabaseConfig(url, anonKey);
    onSaved();
    onClose();
  };

  const handleClear = () => {
    if (window.confirm("Disconnect Supabase credentials?")) {
      clearSupabaseConfig();
      setUrl("");
      setAnonKey("");
      setTestResult(null);
      onSaved();
    }
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#121214] border border-white/10 rounded-2xl p-6 sm:p-8 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-medium tracking-tight">Connect Supabase</h2>
              <p className="text-xs text-zinc-400">
                Live, un-fabricated visitor tracking & dwell time analytics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <div className="py-4 space-y-4">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-zinc-300 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-medium text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Why connect Supabase?</span>
            </div>
            <p className="text-xs leading-relaxed text-zinc-300">
              Supabase provides your free, secure cloud database. Whenever someone views your portfolio, it records their real country, city, device, and exact minutes spent — without any fake numbers.
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyzabcdefghijklm.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full bg-[#17171a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
              />
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Found in Supabase → Project Settings → API → Project URL
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400 mb-1.5">
                Supabase Anon Public Key (anon public)
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full bg-[#17171a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
              />
              <span className="text-[11px] text-zinc-500 mt-1 block">
                Found in Supabase → Project Settings → API → Project API Keys (anon public)
              </span>
            </div>
          </div>

          {/* Test Status feedback */}
          {testResult && (
            <div
              className={`p-4 rounded-xl border text-xs leading-relaxed ${
                testResult.ok && testResult.tableReady
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                  : testResult.ok
                  ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                  : "bg-red-500/10 border-red-500/20 text-red-300"
              }`}
            >
              <div className="flex items-start gap-2.5">
                {testResult.ok && testResult.tableReady ? (
                  <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-medium">{testResult.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* 1-Click SQL Setup accordion */}
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                1. Database Table Setup (Run Once in Supabase)
              </span>
              <button
                type="button"
                onClick={copySql}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL Schema</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs text-zinc-400 mb-2">
              In your Supabase project, go to <strong>SQL Editor → New Query</strong>, paste this script, and click <strong>Run</strong>.
            </p>
            <div className="relative">
              <pre className="p-3 bg-[#0d0d0f] border border-white/5 rounded-xl text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-40 scrollbar-thin">
                {SUPABASE_SQL_SCHEMA}
              </pre>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div>
            {current.isConfigured && (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-400 hover:text-red-300 underline underline-offset-4"
              >
                Disconnect
              </button>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleTest}
              disabled={testing || !url || !anonKey}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/15 text-white transition-colors disabled:opacity-50"
            >
              {testing ? "Testing..." : "Test Connection"}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!url || !anonKey}
              className="px-5 py-2 rounded-xl text-xs font-medium bg-emerald-500 hover:bg-emerald-400 text-black transition-colors disabled:opacity-50"
            >
              Save & Activate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
