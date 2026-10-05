import React, { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ExternalLink,
  Eye,
  Grid,
  Image as ImageIcon,
  MoreVertical,
  Plus,
  Sparkles,
  Trash2,
  X,
  Layers,
} from "lucide-react";
import type { Content, Project, Section, Shot } from "../data/schema";
import { slugify } from "../data/schema";
import { ImageField } from "./ui";

interface SocialFeedViewProps {
  content: Content;
  patch: (fn: (draft: Content) => void) => void;
  errors: Record<string, string>;
}

export const SocialFeedView: React.FC<SocialFeedViewProps> = ({ content, patch, errors }) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);

  const projects = content.projects || [];

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= projects.length) return;
    patch((draft) => {
      const list = draft.projects.slice();
      const [item] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, item);
      draft.projects = list;
    });
    if (editingIndex === fromIndex) setEditingIndex(toIndex);
  };

  const handleDelete = (index: number) => {
    patch((draft) => {
      draft.projects.splice(index, 1);
    });
    setDeleteConfirmIndex(null);
    if (editingIndex === index) setEditingIndex(null);
  };

  const handleCreateNew = () => {
    const newProject: Project = {
      id: `project-${Date.now().toString(36)}`,
      index: String(projects.length + 1).padStart(2, "0"),
      title: "Untitled Project",
      kind: "Product Design",
      year: String(new Date().getFullYear()),
      summary: "Short summary of what this project accomplished.",
      role: "Lead Designer",
      tools: ["Figma", "Design Systems"],
      platform: "Web & Mobile",
      coverFit: "cover",
      coverTone: "#121214",
      sections: [{ heading: "Overview", body: "Detailed background and objectives for this project." }],
      shots: [],
    };

    patch((draft) => {
      draft.projects.unshift(newProject);
    });
    setEditingIndex(0);
    setIsCreating(false);
  };

  return (
    <div className="space-y-6 animate-fade-in text-white">
      {/* Creator Composer Bar (Social Media Post Style) */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#141417] border border-white/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-sm font-semibold text-white shadow-md shrink-0">
            {content.profile.initials || "JJ"}
          </div>
          <div className="text-left">
            <span className="text-sm font-medium text-white block">
              {content.profile.name}
            </span>
            <span className="text-xs text-zinc-400">
              {projects.length} portfolio post{projects.length === 1 ? "" : "s"} live
            </span>
          </div>
        </div>

        <button
          onClick={handleCreateNew}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Project Post</span>
        </button>
      </div>

      {/* Projects Feed (Instagram / Social Feed Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((proj, idx) => {
          const isEditing = editingIndex === idx;

          return (
            <div
              key={proj.id || idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                isEditing
                  ? "bg-[#18181c] border-amber-400/50 ring-1 ring-amber-400/50 shadow-2xl"
                  : "bg-[#141417] border-white/5 hover:border-white/15 hover:shadow-xl"
              }`}
            >
              {/* Card Header / Creator Handle */}
              <div className="p-4 flex items-center justify-between border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/5 text-amber-300 border border-white/10">
                    #{String(idx + 1).padStart(2, "0")} {proj.kind || "Project"}
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">{proj.year}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMove(idx, idx - 1)}
                    disabled={idx === 0}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-colors"
                    title="Move up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, idx + 1)}
                    disabled={idx === projects.length - 1}
                    className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-colors"
                    title="Move down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Cover Preview */}
              <div
                className="relative aspect-video w-full overflow-hidden flex items-center justify-center"
                style={{ backgroundColor: proj.coverTone || "#121214" }}
              >
                {proj.cover ? (
                  <img
                    src={proj.cover}
                    alt={proj.title}
                    className={`w-full h-full ${
                      proj.coverFit === "contain" ? "object-contain p-4" : "object-cover"
                    }`}
                  />
                ) : (
                  <div className="text-center p-6 space-y-1">
                    <span className="text-2xl font-serif text-white/80 block font-light">
                      {proj.title || "Typographic Cover"}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      No cover image (typography layout)
                    </span>
                  </div>
                )}
              </div>

              {/* Post Content Details */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-base font-medium text-white">{proj.title}</h4>
                    {proj.liveUrl && (
                      <a
                        href={proj.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-zinc-400 hover:text-amber-300 flex items-center gap-1 shrink-0"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {proj.summary || "No summary provided."}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  {/* Tools / Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {proj.tools?.map((tool) => (
                      <span
                        key={tool}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-zinc-300 font-mono"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={() => setEditingIndex(isEditing ? null : idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        isEditing
                          ? "bg-amber-400 text-black font-semibold"
                          : "bg-white/10 hover:bg-white/15 text-white"
                      }`}
                    >
                      {isEditing ? "Close Editor" : "Edit Project"}
                    </button>

                    <div>
                      {deleteConfirmIndex === idx ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDelete(idx)}
                            className="px-2.5 py-1 rounded bg-red-500 hover:bg-red-600 text-white text-[11px] font-medium transition-colors"
                          >
                            Sure?
                          </button>
                          <button
                            onClick={() => setDeleteConfirmIndex(null)}
                            className="px-2 py-1 rounded bg-white/10 text-zinc-300 text-[11px]"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmIndex(idx)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Inline Social Editor when opened */}
              {isEditing && (
                <div className="p-5 bg-[#111113] border-t border-white/10 space-y-4 text-xs animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5 font-medium text-amber-300">
                    <span>Editing Post: {proj.title}</span>
                    <button
                      onClick={() => setEditingIndex(null)}
                      className="text-zinc-400 hover:text-white"
                    >
                      Done
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={(e) => {
                          const v = e.target.value;
                          patch((draft) => {
                            draft.projects[idx].title = v;
                            draft.projects[idx].id = slugify(v) || draft.projects[idx].id;
                          });
                        }}
                        className="w-full bg-[#18181c] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          value={proj.kind}
                          onChange={(e) => {
                            const v = e.target.value;
                            patch((draft) => {
                              draft.projects[idx].kind = v;
                            });
                          }}
                          className="w-full bg-[#18181c] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                          Year
                        </label>
                        <input
                          type="text"
                          value={proj.year}
                          onChange={(e) => {
                            const v = e.target.value;
                            patch((draft) => {
                              draft.projects[idx].year = v;
                            });
                          }}
                          className="w-full bg-[#18181c] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                        Summary
                      </label>
                      <textarea
                        rows={2}
                        value={proj.summary}
                        onChange={(e) => {
                          const v = e.target.value;
                          patch((draft) => {
                            draft.projects[idx].summary = v;
                          });
                        }}
                        className="w-full bg-[#18181c] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                          Your Role
                        </label>
                        <input
                          type="text"
                          value={proj.role}
                          onChange={(e) => {
                            const v = e.target.value;
                            patch((draft) => {
                              draft.projects[idx].role = v;
                            });
                          }}
                          className="w-full bg-[#18181c] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                          Platform
                        </label>
                        <input
                          type="text"
                          value={proj.platform}
                          onChange={(e) => {
                            const v = e.target.value;
                            patch((draft) => {
                              draft.projects[idx].platform = v;
                            });
                          }}
                          className="w-full bg-[#18181c] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                        Live Website URL
                      </label>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={proj.liveUrl || ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          patch((draft) => {
                            draft.projects[idx].liveUrl = v.trim() || undefined;
                          });
                        }}
                        className="w-full bg-[#18181c] border border-white/10 rounded-lg px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1">
                        Tools (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={proj.tools.join(", ")}
                        onChange={(e) => {
                          const v = e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean);
                          patch((draft) => {
                            draft.projects[idx].tools = v;
                          });
                        }}
                        className="w-full bg-[#18181c] border border-white/10 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Image Cover Field */}
                    <div className="pt-2">
                      <ImageField
                        label="Cover Image"
                        kind="cover"
                        value={proj.cover}
                        onChange={(path) => {
                          patch((draft) => {
                            draft.projects[idx].cover = path || undefined;
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
