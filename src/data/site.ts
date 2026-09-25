/* ==========================================================================
   The public site reads its content from content.json, which is the file the
   admin panel at /admin writes to.

   Prefer the admin panel over hand-editing content.json.
   Types and validation live in schema.ts.
   ========================================================================== */

import raw from "./content.json";
import type { Content } from "./schema";

const content = raw as unknown as Content;

export type {
  Capability,
  Content,
  DomainMirror,
  Drawing,
  Exploration,
  Fact,
  Profile,
  Project,
  Section,
  Shot,
  Social,
  SocialKey,
} from "./schema";

export const profile = content.profile;
export const socials = content.socials;
export const resumeUrl = content.resumeUrl;
export const about = content.about;
export const drawings = content.drawings;
export const capabilities = content.capabilities;
export const projects = content.projects;
export const explorations = content.explorations;

/* Navigation is tied to the section ids in the markup, so it stays in code —
   editing it in a CMS could only ever break the anchors. */
export const nav = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#contact", label: "Contact" },
];
