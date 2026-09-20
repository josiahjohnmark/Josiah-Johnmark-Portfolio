import React, { useId, useRef, useState } from "react";
import { api } from "./api";
import { folderFor, formatBytes, optimise, type ImageKind } from "./image";

/* ========================= text inputs ========================= */

export const Field: React.FC<{
  label: string;
  hint?: string;
  error?: string;
  children: (id: string) => React.ReactNode;
}> = ({ label, hint, error, children }) => {
  const id = useId();
  return (
    <div className="field">
      <label className="field-label" htmlFor={id}>
        {label}
      </label>
      {children(id)}
      {error ? (
        <p className="field-error">{error}</p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  );
};

export const Text: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  error?: string;
  placeholder?: string;
  mono?: boolean;
}> = ({ label, value, onChange, hint, error, placeholder, mono }) => (
  <Field label={label} hint={hint} error={error}>
    {(id) => (
      <input
        id={id}
        className={`input${mono ? " input-mono" : ""}${error ? " input-error" : ""}`}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </Field>
);

export const TextArea: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  error?: string;
  rows?: number;
  placeholder?: string;
}> = ({ label, value, onChange, hint, error, rows = 4, placeholder }) => (
  <Field label={label} hint={hint} error={error}>
    {(id) => (
      <textarea
        id={id}
        className={`input textarea${error ? " input-error" : ""}`}
        rows={rows}
        value={value ?? ""}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    )}
  </Field>
);

export const Select: React.FC<{
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  hint?: string;
}> = ({ label, value, options, onChange, hint }) => (
  <Field label={label} hint={hint}>
    {(id) => (
      <select id={id} className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    )}
  </Field>
);

export const Toggle: React.FC<{
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, hint, checked, onChange }) => (
  <div className="toggle-row">
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`toggle${checked ? " is-on" : ""}`}
    >
      <span className="toggle-knob" />
    </button>
    <div>
      <span className="toggle-label">{label}</span>
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  </div>
);

export const ColorField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}> = ({ label, value, onChange, hint }) => (
  <Field label={label} hint={hint}>
    {(id) => (
      <div className="color-row">
        <input
          type="color"
          className="color-swatch"
          value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#121214"}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} colour picker`}
        />
        <input
          id={id}
          className="input input-mono"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#121214"
        />
      </div>
    )}
  </Field>
);

/* Comma-separated list, edited as plain text — far quicker than chip widgets. */
export const TagsField: React.FC<{
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  hint?: string;
}> = ({ label, value, onChange, hint }) => {
  const [draft, setDraft] = useState<string | null>(null);
  const shown = draft ?? (value ?? []).join(", ");
  return (
    <Field label={label} hint={hint ?? "Separate with commas"}>
      {(id) => (
        <input
          id={id}
          className="input"
          value={shown}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            if (draft !== null) {
              onChange(
                draft
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              );
              setDraft(null);
            }
          }}
        />
      )}
    </Field>
  );
};

/* ========================= buttons ========================= */

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost" | "danger" | "quiet";
    loading?: boolean;
  }
> = ({ variant = "ghost", loading, children, className = "", disabled, ...rest }) => (
  <button
    type="button"
    className={`btn btn-${variant} ${className}`}
    disabled={disabled || loading}
    {...rest}
  >
    {loading && <span className="spinner" aria-hidden="true" />}
    {children}
  </button>
);

/* ========================= repeatable lists ========================= */

export function Repeatable<T>({
  items,
  onChange,
  create,
  addLabel,
  title,
  renderItem,
  summary,
  collapsible = true,
  emptyNote,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  create: () => T;
  addLabel: string;
  title?: string;
  summary: (item: T, index: number) => React.ReactNode;
  renderItem: (item: T, index: number, update: (patch: Partial<T>) => void) => React.ReactNode;
  collapsible?: boolean;
  emptyNote?: string;
}) {
  const [open, setOpen] = useState<number | null>(collapsible ? null : -1);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const next = items.slice();
    const [row] = next.splice(from, 1);
    next.splice(to, 0, row);
    onChange(next);
    setOpen((o) => (o === from ? to : o));
  };

  const update = (i: number) => (patch: Partial<T>) => {
    const next = items.slice();
    next[i] = { ...(next[i] as object), ...(patch as object) } as T;
    onChange(next);
  };

  const remove = (i: number) => {
    onChange(items.filter((_, n) => n !== i));
    setOpen(null);
  };

  return (
    <div className="repeatable">
      {title && <h3 className="group-title">{title}</h3>}

      {items.length === 0 && emptyNote && <p className="empty-note">{emptyNote}</p>}

      <ul className="rep-list">
        {items.map((item, i) => {
          const isOpen = !collapsible || open === i;
          return (
            <li key={i} className={`rep-item${isOpen ? " is-open" : ""}`}>
              <div className="rep-head">
                <span className="rep-index">{String(i + 1).padStart(2, "0")}</span>

                {collapsible ? (
                  <button
                    type="button"
                    className="rep-summary"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                  >
                    {summary(item, i)}
                  </button>
                ) : (
                  <span className="rep-summary as-text">{summary(item, i)}</span>
                )}

                <div className="rep-actions">
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => move(i, i - 1)}
                    disabled={i === 0}
                    aria-label="Move up"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => move(i, i + 1)}
                    disabled={i === items.length - 1}
                    aria-label="Move down"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <ConfirmDelete onConfirm={() => remove(i)} />
                </div>
              </div>

              {isOpen && <div className="rep-body">{renderItem(item, i, update(i))}</div>}
            </li>
          );
        })}
      </ul>

      <Button
        variant="quiet"
        onClick={() => {
          onChange([...items, create()]);
          setOpen(items.length);
        }}
      >
        + {addLabel}
      </Button>
    </div>
  );
}

/* Two-step delete, so nothing disappears on a mis-tap. */
export const ConfirmDelete: React.FC<{ onConfirm: () => void; label?: string }> = ({
  onConfirm,
  label = "Remove",
}) => {
  const [armed, setArmed] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  if (armed) {
    return (
      <button
        type="button"
        className="icon-btn is-danger is-armed"
        onClick={() => {
          window.clearTimeout(timer.current);
          onConfirm();
        }}
        onBlur={() => setArmed(false)}
        autoFocus
      >
        Sure?
      </button>
    );
  }

  return (
    <button
      type="button"
      className="icon-btn is-danger"
      aria-label={label}
      title={label}
      onClick={() => {
        setArmed(true);
        timer.current = window.setTimeout(() => setArmed(false), 4000);
      }}
    >
      ✕
    </button>
  );
};

/* ========================= image uploads ========================= */

export const ImageField: React.FC<{
  label: string;
  value: string | undefined;
  kind: ImageKind;
  onChange: (path: string) => void;
  hint?: string;
  aspect?: string;
}> = ({ label, value, kind, onChange, hint, aspect = "16 / 10" }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handle = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setNote(null);
    setBusy(true);
    try {
      const out = await optimise(file, kind);
      const res = await api.upload(folderFor(kind), file.name, out.type, out.base64);
      onChange(res.path);
      setNote(
        `${out.width}×${out.height} · ${formatBytes(out.originalBytes)} → ${formatBytes(out.bytes)}`
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="field">
      <span className="field-label">{label}</span>

      <div
        className={`dropzone${dragging ? " is-dragging" : ""}${busy ? " is-busy" : ""}`}
        style={{ aspectRatio: aspect }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handle(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        aria-label={`${label} — drop an image or click to choose one`}
      >
        {value ? (
          <img src={value} alt="" className="dropzone-preview" />
        ) : (
          <span className="dropzone-empty">Drop an image, or click to choose</span>
        )}

        {busy && (
          <span className="dropzone-busy">
            <span className="spinner" /> Optimising and uploading…
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        hidden
        onChange={(e) => {
          void handle(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      <div className="dropzone-foot">
        <input
          className="input input-mono input-sm"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/…"
          aria-label={`${label} path`}
        />
        {value && (
          <button type="button" className="icon-btn is-danger" onClick={() => onChange("")} title="Clear">
            ✕
          </button>
        )}
      </div>

      {error ? (
        <p className="field-error">{error}</p>
      ) : note ? (
        <p className="field-ok">Uploaded · {note}</p>
      ) : hint ? (
        <p className="field-hint">{hint}</p>
      ) : null}
    </div>
  );
};

/* ========================= layout helpers ========================= */

export const Panel: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <section className="panel">
    <header className="panel-head">
      <h2 className="panel-title">{title}</h2>
      {description && <p className="panel-desc">{description}</p>}
    </header>
    <div className="panel-body">{children}</div>
  </section>
);

export const Row: React.FC<{ children: React.ReactNode; cols?: 2 | 3 }> = ({
  children,
  cols = 2,
}) => <div className={`row row-${cols}`}>{children}</div>;
