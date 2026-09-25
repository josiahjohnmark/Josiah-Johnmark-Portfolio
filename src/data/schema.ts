/* ==========================================================================
   The shape of the site's content, shared by the public site, the admin
   panel and the save endpoint. One definition, so the three cannot drift.
   ========================================================================== */

export type SocialKey = "instagram" | "facebook" | "x" | "github" | "linkedin";

export const SOCIAL_KEYS: SocialKey[] = [
  "instagram",
  "facebook",
  "x",
  "github",
  "linkedin",
];

export type Social = { key: SocialKey; label: string; url: string | null };

export type Profile = {
  name: string;
  initials: string;
  role: string;
  statement: string;
  location: string;
  available: boolean;
  availableLabel: string;
  email: string;
  phoneDisplay: string;
  whatsapp: string;
  telegram: string;
  telegramHandle: string;
};

export type Fact = { label: string; value: string };

export type About = {
  paragraphs: string[];
  closing: string;
  facts: Fact[];
};

export type Drawing = { src: string; alt: string };

export type Capability = { title: string; body: string; tools: string[] };

export type Shot = {
  id: string;
  title: string;
  caption: string;
  src: string;
  shape: "phone" | "square";
};

export type Section = { heading: string; body: string };

export type DomainMirror = { label: string; url: string };

export type Project = {
  id: string;
  index: string;
  title: string;
  kind: string;
  year: string;
  summary: string;
  role: string;
  tools: string[];
  platform: string;
  liveUrl?: string;
  mirrors?: DomainMirror[];
  cover?: string;
  coverFit: "cover" | "contain";
  coverTone: string;
  sections: Section[];
  shots?: Shot[];
  note?: string;
};

export type Exploration = { slug: string; title: string; tag: string };

export type Content = {
  profile: Profile;
  socials: Social[];
  resumeUrl: string | null;
  about: About;
  drawings: Drawing[];
  capabilities: Capability[];
  projects: Project[];
  explorations: Exploration[];
};

/* --------------------------------------------------------------------------
   Validation. Runs in the admin before saving and again on the server before
   anything is written to the repository, so a malformed payload can never
   reach the live site.
   -------------------------------------------------------------------------- */

export type Issue = { path: string; message: string };

const isStr = (v: unknown): v is string => typeof v === "string";
const isArr = Array.isArray;

function requireText(v: unknown, path: string, out: Issue[], label = "") {
  if (!isStr(v) || v.trim() === "") {
    out.push({ path, message: `${label || path} cannot be empty` });
  }
}

function optionalUrl(v: unknown, path: string, out: Issue[]) {
  if (v === null || v === undefined || v === "") return;
  if (!isStr(v)) {
    out.push({ path, message: "must be text" });
    return;
  }
  if (!/^https?:\/\/.+/i.test(v) && !v.startsWith("/")) {
    out.push({ path, message: "must start with https:// or /" });
  }
}

export function validateContent(data: unknown): Issue[] {
  const out: Issue[] = [];
  if (typeof data !== "object" || data === null) {
    return [{ path: "root", message: "content must be an object" }];
  }
  const c = data as Partial<Content>;

  /* Profile */
  const p = c.profile;
  if (!p || typeof p !== "object") {
    out.push({ path: "profile", message: "missing" });
  } else {
    requireText(p.name, "profile.name", out, "Name");
    requireText(p.role, "profile.role", out, "Role");
    requireText(p.statement, "profile.statement", out, "Statement");
    requireText(p.email, "profile.email", out, "Email");
    if (isStr(p.email) && p.email.trim() !== "" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {
      out.push({ path: "profile.email", message: "not a valid email address" });
    }
    if (typeof p.available !== "boolean") {
      out.push({ path: "profile.available", message: "must be true or false" });
    }
    optionalUrl(p.whatsapp, "profile.whatsapp", out);
    optionalUrl(p.telegram, "profile.telegram", out);
  }

  /* Socials */
  if (!isArr(c.socials)) {
    out.push({ path: "socials", message: "missing" });
  } else {
    c.socials.forEach((s, i) => {
      if (!SOCIAL_KEYS.includes(s?.key)) {
        out.push({ path: `socials[${i}].key`, message: "unknown network" });
      }
      optionalUrl(s?.url, `socials[${i}].url`, out);
    });
  }

  optionalUrl(c.resumeUrl, "resumeUrl", out);

  /* About */
  if (!c.about || typeof c.about !== "object") {
    out.push({ path: "about", message: "missing" });
  } else {
    if (!isArr(c.about.paragraphs) || c.about.paragraphs.length === 0) {
      out.push({ path: "about.paragraphs", message: "needs at least one paragraph" });
    } else {
      c.about.paragraphs.forEach((t, i) =>
        requireText(t, `about.paragraphs[${i}]`, out, `Paragraph ${i + 1}`)
      );
    }
    if (isArr(c.about.facts)) {
      c.about.facts.forEach((f, i) => {
        requireText(f?.label, `about.facts[${i}].label`, out, "Fact label");
        requireText(f?.value, `about.facts[${i}].value`, out, "Fact value");
      });
    }
  }

  /* Capabilities */
  if (isArr(c.capabilities)) {
    c.capabilities.forEach((cap, i) => {
      requireText(cap?.title, `capabilities[${i}].title`, out, "Title");
      requireText(cap?.body, `capabilities[${i}].body`, out, "Description");
    });
  }

  /* Projects */
  if (!isArr(c.projects)) {
    out.push({ path: "projects", message: "missing" });
  } else {
    const ids = new Set<string>();
    c.projects.forEach((pr, i) => {
      const at = `projects[${i}]`;
      requireText(pr?.title, `${at}.title`, out, "Project title");
      requireText(pr?.id, `${at}.id`, out, "Project id");
      requireText(pr?.kind, `${at}.kind`, out, "Category");
      requireText(pr?.summary, `${at}.summary`, out, "Summary");
      if (isStr(pr?.id)) {
        if (ids.has(pr.id)) {
          out.push({ path: `${at}.id`, message: `duplicate id "${pr.id}"` });
        }
        ids.add(pr.id);
      }
      if (pr?.coverFit !== "cover" && pr?.coverFit !== "contain") {
        out.push({ path: `${at}.coverFit`, message: "must be cover or contain" });
      }
      if (!/^#[0-9a-f]{6}$/i.test(String(pr?.coverTone ?? ""))) {
        out.push({ path: `${at}.coverTone`, message: "must be a hex colour like #1b2230" });
      }
      optionalUrl(pr?.liveUrl, `${at}.liveUrl`, out);
      if (isArr(pr?.mirrors)) {
        pr.mirrors.forEach((m, j) => {
          requireText(m?.label, `${at}.mirrors[${j}].label`, out, "Mirror label");
          optionalUrl(m?.url, `${at}.mirrors[${j}].url`, out);
        });
      }
      if (isArr(pr?.sections)) {
        pr.sections.forEach((s, j) => {
          requireText(s?.heading, `${at}.sections[${j}].heading`, out, "Section heading");
          requireText(s?.body, `${at}.sections[${j}].body`, out, "Section text");
        });
      }
      if (isArr(pr?.shots)) {
        pr.shots.forEach((s, j) => {
          requireText(s?.src, `${at}.shots[${j}].src`, out, "Screen image");
          if (s?.shape !== "phone" && s?.shape !== "square") {
            out.push({ path: `${at}.shots[${j}].shape`, message: "must be phone or square" });
          }
        });
      }
    });
  }

  /* Explorations */
  if (isArr(c.explorations)) {
    c.explorations.forEach((e, i) => {
      requireText(e?.slug, `explorations[${i}].slug`, out, "Slug");
      requireText(e?.title, `explorations[${i}].title`, out, "Title");
    });
  }

  return out;
}

/* Turns a title into a safe id / filename fragment. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60);
}

/* Project index labels ("01", "02", …) are derived from order, never typed. */
export function renumber(projects: Project[]): Project[] {
  return projects.map((p, i) => ({ ...p, index: String(i + 1).padStart(2, "0") }));
}
