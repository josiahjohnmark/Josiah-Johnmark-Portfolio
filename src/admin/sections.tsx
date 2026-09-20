import React from "react";
import type {
  Capability,
  Content,
  Drawing,
  Exploration,
  Fact,
  Project,
  Section,
  Shot,
} from "../data/schema";
import { SOCIAL_KEYS, slugify } from "../data/schema";
import {
  ColorField,
  ImageField,
  Panel,
  Repeatable,
  Row,
  Select,
  TagsField,
  Text,
  TextArea,
  Toggle,
} from "./ui";

type Patch = (fn: (draft: Content) => void) => void;
type ErrorMap = Record<string, string>;

const err = (errors: ErrorMap, path: string) => errors[path];

/* ========================================================================
   Profile & contact
   ======================================================================== */

export const ProfileSection: React.FC<{ content: Content; patch: Patch; errors: ErrorMap }> = ({
  content,
  patch,
  errors,
}) => {
  const p = content.profile;
  const set = <K extends keyof typeof p>(key: K, value: (typeof p)[K]) =>
    patch((d) => {
      d.profile[key] = value;
    });

  return (
    <>
      <Panel
        title="Identity"
        description="The name and one-line pitch a client reads first, in the hero."
      >
        <Row>
          <Text label="Name" value={p.name} onChange={(v) => set("name", v)} error={err(errors, "profile.name")} />
          <Text
            label="Role"
            value={p.role}
            onChange={(v) => set("role", v)}
            hint="Shown under the hero and in the footer"
            error={err(errors, "profile.role")}
          />
        </Row>
        <TextArea
          label="Statement"
          value={p.statement}
          onChange={(v) => set("statement", v)}
          rows={3}
          hint="One sentence. Keep it under about 160 characters."
          error={err(errors, "profile.statement")}
        />
        <Row>
          <Text label="Location" value={p.location} onChange={(v) => set("location", v)} />
          <Text
            label="Initials"
            value={p.initials}
            onChange={(v) => set("initials", v)}
            hint="Used as a fallback label for the logo"
          />
        </Row>
      </Panel>

      <Panel title="Availability" description="The pill at the top of the hero.">
        <Toggle
          label="Show the availability badge"
          hint="Turn this off when you are not taking work"
          checked={p.available}
          onChange={(v) => set("available", v)}
        />
        {p.available && (
          <Text
            label="Badge text"
            value={p.availableLabel}
            onChange={(v) => set("availableLabel", v)}
            placeholder="Available for work"
          />
        )}
      </Panel>

      <Panel title="How people reach you" description="Used in the contact section and the footer.">
        <Row>
          <Text
            label="Email"
            value={p.email}
            onChange={(v) => set("email", v)}
            error={err(errors, "profile.email")}
          />
          <Text label="Phone (as displayed)" value={p.phoneDisplay} onChange={(v) => set("phoneDisplay", v)} />
        </Row>
        <Row>
          <Text
            label="WhatsApp link"
            value={p.whatsapp}
            onChange={(v) => set("whatsapp", v)}
            mono
            hint="https://wa.me/234…"
            error={err(errors, "profile.whatsapp")}
          />
          <Text
            label="Telegram link"
            value={p.telegram}
            onChange={(v) => set("telegram", v)}
            mono
            error={err(errors, "profile.telegram")}
          />
        </Row>
        <Text label="Telegram handle" value={p.telegramHandle} onChange={(v) => set("telegramHandle", v)} />
      </Panel>

      <Panel
        title="Social profiles"
        description="Leave a field empty and that icon simply is not shown — the site never displays a link that goes nowhere."
      >
        {SOCIAL_KEYS.map((key) => {
          const row = content.socials.find((s) => s.key === key);
          const label = row?.label ?? key;
          return (
            <Text
              key={key}
              label={label}
              mono
              value={row?.url ?? ""}
              placeholder="Not shown"
              onChange={(v) =>
                patch((d) => {
                  const url = v.trim() === "" ? null : v.trim();
                  const existing = d.socials.find((s) => s.key === key);
                  if (existing) existing.url = url;
                  else d.socials.push({ key, label, url });
                })
              }
            />
          );
        })}
      </Panel>

      <Panel title="CV" description="Put the PDF in the public folder, then paste its path here.">
        <Text
          label="CV file path"
          mono
          value={content.resumeUrl ?? ""}
          placeholder="/josiah-johnmark-cv.pdf — leave empty to hide the buttons"
          onChange={(v) =>
            patch((d) => {
              d.resumeUrl = v.trim() === "" ? null : v.trim();
            })
          }
          error={err(errors, "resumeUrl")}
        />
      </Panel>
    </>
  );
};

/* ========================================================================
   About
   ======================================================================== */

export const AboutSection: React.FC<{ content: Content; patch: Patch; errors: ErrorMap }> = ({
  content,
  patch,
  errors,
}) => (
  <>
    <Panel title="Your story" description="Each paragraph is its own block. The first one is set larger.">
      <Repeatable<string>
        items={content.about.paragraphs}
        onChange={(next) => patch((d) => { d.about.paragraphs = next; })}
        create={() => ""}
        addLabel="Add paragraph"
        collapsible={false}
        summary={(t, i) => (
          <span className="rep-preview">{t.slice(0, 70) || `Paragraph ${i + 1}`}…</span>
        )}
        renderItem={(text, i) => (
          <TextArea
            label={i === 0 ? "Opening line (shown large)" : `Paragraph ${i + 1}`}
            value={text}
            rows={i === 0 ? 2 : 4}
            error={err(errors, `about.paragraphs[${i}]`)}
            onChange={(v) =>
              patch((d) => {
                d.about.paragraphs[i] = v;
              })
            }
          />
        )}
      />

      <TextArea
        label="Closing line"
        value={content.about.closing}
        rows={2}
        hint="The italic line at the end, against the gold rule"
        onChange={(v) => patch((d) => { d.about.closing = v; })}
      />
    </Panel>

    <Panel title="Quick facts" description="The small label-and-value grid beside your portrait.">
      <Repeatable<Fact>
        items={content.about.facts}
        onChange={(next) => patch((d) => { d.about.facts = next; })}
        create={() => ({ label: "", value: "" })}
        addLabel="Add fact"
        collapsible={false}
        summary={(f) => <span className="rep-preview">{f.label || "New fact"}</span>}
        renderItem={(fact, i, update) => (
          <Row>
            <Text
              label="Label"
              value={fact.label}
              onChange={(v) => update({ label: v })}
              error={err(errors, `about.facts[${i}].label`)}
            />
            <Text
              label="Value"
              value={fact.value}
              onChange={(v) => update({ value: v })}
              error={err(errors, `about.facts[${i}].value`)}
            />
          </Row>
        )}
      />
    </Panel>

    <Panel
      title="Where it started"
      description="The graphite drawings shown at the end of About. Square images work best."
    >
      <Repeatable<Drawing>
        items={content.drawings}
        onChange={(next) => patch((d) => { d.drawings = next; })}
        create={() => ({ src: "", alt: "" })}
        addLabel="Add drawing"
        summary={(_d, i) => <span className="rep-preview">Drawing {i + 1}</span>}
        renderItem={(drawing, _i, update) => (
          <>
            <ImageField
              label="Image"
              kind="drawing"
              aspect="1 / 1"
              value={drawing.src}
              onChange={(path) => update({ src: path })}
            />
            <Text
              label="Description for screen readers"
              value={drawing.alt}
              onChange={(v) => update({ alt: v })}
              hint="Describe what the drawing shows"
            />
          </>
        )}
      />
    </Panel>
  </>
);

/* ========================================================================
   Projects
   ======================================================================== */

const ProjectEditor: React.FC<{
  project: Project;
  index: number;
  update: (patch: Partial<Project>) => void;
  errors: ErrorMap;
}> = ({ project, index, update, errors }) => {
  const at = `projects[${index}]`;

  return (
    <>
      <Row>
        <Text
          label="Title"
          value={project.title}
          error={err(errors, `${at}.title`)}
          onChange={(v) =>
            update({
              title: v,
              /* Keep the id in step until it has been published once. */
              id: project.id && project.id !== slugify(project.title) ? project.id : slugify(v),
            })
          }
        />
        <Text
          label="Category"
          value={project.kind}
          hint="e.g. Game, Mobile app, Client — nonprofit"
          error={err(errors, `${at}.kind`)}
          onChange={(v) => update({ kind: v })}
        />
      </Row>

      <TextArea
        label="Summary"
        value={project.summary}
        rows={3}
        hint="Two lines at most — this is the card text"
        error={err(errors, `${at}.summary`)}
        onChange={(v) => update({ summary: v })}
      />

      <Row cols={3}>
        <Text label="Your role" value={project.role} onChange={(v) => update({ role: v })} />
        <Text label="Platform" value={project.platform} onChange={(v) => update({ platform: v })} />
        <Text label="Year" value={project.year} onChange={(v) => update({ year: v })} />
      </Row>

      <TagsField label="Tools" value={project.tools} onChange={(v) => update({ tools: v })} />

      <Text
        label="Live site"
        mono
        value={project.liveUrl ?? ""}
        placeholder="https://… — leave empty to hide the link"
        error={err(errors, `${at}.liveUrl`)}
        onChange={(v) => update({ liveUrl: v.trim() === "" ? undefined : v.trim() })}
      />

      <div className="divider" />

      <ImageField
        label="Cover image"
        kind="cover"
        value={project.cover}
        onChange={(path) => update({ cover: path === "" ? undefined : path })}
        hint="Leave empty to use a typographic cover with just the title"
      />

      <Row>
        <Select
          label="Cover fit"
          value={project.coverFit}
          options={[
            { value: "cover", label: "Fill the frame (photos, key art)" },
            { value: "contain", label: "Fit inside (logos, app icons)" },
          ]}
          onChange={(v) => update({ coverFit: v as Project["coverFit"] })}
        />
        <ColorField
          label="Cover background"
          value={project.coverTone}
          hint="Behind the image, and the tint on a typographic cover"
          onChange={(v) => update({ coverTone: v })}
        />
      </Row>

      <Text
        label="Note"
        value={project.note ?? ""}
        placeholder='e.g. "Screens for this project are being prepared."'
        hint="A small line at the end of the case study. Leave empty to hide."
        onChange={(v) => update({ note: v.trim() === "" ? undefined : v })}
      />

      <div className="divider" />

      <Repeatable<Section>
        title="Case study"
        items={project.sections ?? []}
        onChange={(next) => update({ sections: next })}
        create={() => ({ heading: "", body: "" })}
        addLabel="Add case study section"
        emptyNote="No sections yet. These are the numbered blocks inside the case study."
        summary={(s, i) => <span className="rep-preview">{s.heading || `Section ${i + 1}`}</span>}
        renderItem={(section, i, updateSection) => (
          <>
            <Text
              label="Heading"
              value={section.heading}
              error={err(errors, `${at}.sections[${i}].heading`)}
              onChange={(v) => updateSection({ heading: v })}
            />
            <TextArea
              label="Text"
              value={section.body}
              rows={6}
              error={err(errors, `${at}.sections[${i}].body`)}
              onChange={(v) => updateSection({ body: v })}
            />
          </>
        )}
      />

      <div className="divider" />

      <Repeatable<Shot>
        title="Screens"
        items={project.shots ?? []}
        onChange={(next) => update({ shots: next })}
        create={() => ({ id: `shot-${Date.now().toString(36)}`, title: "", caption: "", src: "", shape: "phone" })}
        addLabel="Add screen"
        emptyNote="No screens yet. Add screenshots and they appear in a grid with a fullscreen viewer."
        summary={(s, i) => <span className="rep-preview">{s.title || `Screen ${i + 1}`}</span>}
        renderItem={(shot, i, updateShot) => (
          <>
            <ImageField
              label="Screenshot"
              kind="screen"
              aspect={shot.shape === "phone" ? "440 / 956" : "1 / 1"}
              value={shot.src}
              onChange={(path) => updateShot({ src: path })}
            />
            <Row>
              <Text
                label="Title"
                value={shot.title}
                onChange={(v) => updateShot({ title: v, id: slugify(v) || shot.id })}
              />
              <Select
                label="Shape"
                value={shot.shape}
                options={[
                  { value: "phone", label: "Phone screenshot (tall)" },
                  { value: "square", label: "Square (art, renders)" },
                ]}
                onChange={(v) => updateShot({ shape: v as Shot["shape"] })}
              />
            </Row>
            <TextArea
              label="Caption"
              value={shot.caption}
              rows={2}
              hint="Also used as the image description for screen readers"
              error={err(errors, `${at}.shots[${i}].src`)}
              onChange={(v) => updateShot({ caption: v })}
            />
          </>
        )}
      />

      <div className="divider" />

      <Text
        label="Web address fragment"
        mono
        value={project.id}
        hint="Used internally to identify this project. Only change it if you know why."
        error={err(errors, `${at}.id`)}
        onChange={(v) => update({ id: slugify(v) })}
      />
    </>
  );
};

export const WorkSection: React.FC<{ content: Content; patch: Patch; errors: ErrorMap }> = ({
  content,
  patch,
  errors,
}) => (
  <Panel
    title="Selected work"
    description="Your real projects, in the order they appear. The numbers are set automatically from the order."
  >
    <Repeatable<Project>
      items={content.projects}
      onChange={(next) => patch((d) => { d.projects = next; })}
      create={() => ({
        id: `project-${Date.now().toString(36)}`,
        index: "00",
        title: "",
        kind: "",
        year: String(new Date().getFullYear()),
        summary: "",
        role: "",
        tools: [],
        platform: "",
        coverFit: "cover",
        coverTone: "#121214",
        sections: [{ heading: "Overview", body: "" }],
      })}
      addLabel="Add project"
      summary={(p) => (
        <span className="rep-preview">
          <strong>{p.title || "Untitled project"}</strong>
          {p.kind && <span className="rep-sub">{p.kind}</span>}
        </span>
      )}
      renderItem={(project, i, update) => (
        <ProjectEditor project={project} index={i} update={update} errors={errors} />
      )}
    />
  </Panel>
);

/* ========================================================================
   Explorations
   ======================================================================== */

export const ExplorationsSection: React.FC<{ content: Content; patch: Patch; errors: ErrorMap }> = ({
  content,
  patch,
  errors,
}) => (
  <Panel
    title="Explorations"
    description="Personal experiments. Each one needs a still image, and optionally an animated version shown on hover."
  >
    <Repeatable<Exploration>
      items={content.explorations}
      onChange={(next) => patch((d) => { d.explorations = next; })}
      create={() => ({ slug: "", title: "", tag: "" })}
      addLabel="Add exploration"
      summary={(e) => <span className="rep-preview">{e.title || "Untitled"}</span>}
      renderItem={(item, i, update) => (
        <>
          <Row>
            <Text
              label="Title"
              value={item.title}
              error={err(errors, `explorations[${i}].title`)}
              onChange={(v) => update({ title: v })}
            />
            <Text label="Short tag" value={item.tag} hint="e.g. Kinetic carousel" onChange={(v) => update({ tag: v })} />
          </Row>
          <Text
            label="Image name"
            mono
            value={item.slug}
            error={err(errors, `explorations[${i}].slug`)}
            hint="Looks for /images/thumbnails/NAME.webp and /images/animations/NAME.webp"
            onChange={(v) => update({ slug: slugify(v) })}
          />
          <div className="thumb-check">
            {item.slug ? (
              <>
                <figure>
                  <img src={`/images/thumbnails/${item.slug}.webp`} alt="" />
                  <figcaption>Still</figcaption>
                </figure>
                <figure>
                  <img src={`/images/animations/${item.slug}.webp`} alt="" />
                  <figcaption>Animated</figcaption>
                </figure>
              </>
            ) : (
              <p className="field-hint">Enter an image name to preview.</p>
            )}
          </div>
        </>
      )}
    />
  </Panel>
);

/* ========================================================================
   Capabilities
   ======================================================================== */

export const CapabilitiesSection: React.FC<{ content: Content; patch: Patch; errors: ErrorMap }> = ({
  content,
  patch,
  errors,
}) => (
  <Panel title="What I do" description="The numbered list of disciplines.">
    <Repeatable<Capability>
      items={content.capabilities}
      onChange={(next) => patch((d) => { d.capabilities = next; })}
      create={() => ({ title: "", body: "", tools: [] })}
      addLabel="Add discipline"
      summary={(c) => <span className="rep-preview">{c.title || "Untitled"}</span>}
      renderItem={(cap, i, update) => (
        <>
          <Text
            label="Title"
            value={cap.title}
            error={err(errors, `capabilities[${i}].title`)}
            onChange={(v) => update({ title: v })}
          />
          <TextArea
            label="Description"
            value={cap.body}
            rows={4}
            error={err(errors, `capabilities[${i}].body`)}
            onChange={(v) => update({ body: v })}
          />
          <TagsField label="Tools" value={cap.tools} onChange={(v) => update({ tools: v })} />
        </>
      )}
    />
  </Panel>
);

/* ========================================================================
   Help
   ======================================================================== */

export const HelpSection: React.FC<{ status: React.ReactNode }> = ({ status }) => (
  <>
    <Panel title="How saving works" description="">
      <ol className="help-list">
        <li>
          You edit here. Nothing is live until you press <strong>Publish</strong>.
        </li>
        <li>
          Publishing writes your changes to GitHub as a commit, which Vercel picks up
          automatically.
        </li>
        <li>
          The live site updates about a minute later. Refresh it to see the change.
        </li>
        <li>
          Every publish is a separate commit, so nothing is ever lost — anything can be
          rolled back.
        </li>
      </ol>
    </Panel>

    <Panel title="Images" description="">
      <p className="help-text">
        Drop any PNG or JPG onto an image box. Before it leaves your browser it is resized to a
        sensible maximum, converted to WebP and given a clean filename. A 6MB phone screenshot
        usually lands somewhere around 200KB, so adding images does not slow the site down.
      </p>
    </Panel>

    <Panel title="Server status" description="">
      {status}
    </Panel>
  </>
);
