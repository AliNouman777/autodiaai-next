// lib/content/about.ts
export const PRINCIPLES = [
  {
    title: "Speed to Understanding",
    desc: "Diagrams should accelerate thinking, not slow it down. We remove busywork so you can validate ideas sooner.",
  },
  {
    title: "Editability over Image",
    desc: "A diagram is a living artifact. Everything we build favors revision, clarity, and portability over static screenshots.",
  },
  {
    title: "Transparent Intelligence",
    desc: "AI assistance should be legible. We show what was inferred so you can accept, adjust, or reject with confidence.",
  },
  {
    title: "Ownership & Portability",
    desc: "Your work is yours. We prioritize exports and open-friendly formats so you can move your diagrams anywhere.",
  },
  {
    title: "Accessibility First",
    desc: "Try-first, sign-up-later. Guest mode lowers friction so anyone can model and learn without a gate.",
  },
  {
    title: "Pragmatic Reliability",
    desc: "Simple, predictable behavior over clever surprises. Fast generation, smooth editing, and sensible limits.",
  },
];

export const WHO_WE_SERVE = [
  {
    title: "Engineers & DBAs",
    desc: "Validate schemas quickly, reduce modeling drift, and keep ERDs aligned with DDL.",
  },
  {
    title: "Founders & Product Teams",
    desc: "Align stakeholders on the data model early to de-risk decisions and move faster.",
  },
  {
    title: "Students & Educators",
    desc: "Practice ER modeling with instant feedback and export clean diagrams for assignments.",
  },
  {
    title: "Analytics & Data",
    desc: "Document sources and models today; lineage and importer tools are on the way.",
  },
];

export const COMMITMENTS = [
  {
    title: "Responsible AI",
    desc: "We design prompts, post-processors, and guardrails to prefer predictable, verifiable outputs. See our Privacy and Security pages for details.",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/security", label: "Security" },
    ],
  },
  {
    title: "Interoperability",
    desc: "We favor widely used formats so your diagrams are useful beyond our editor. Today: PNG/JSON/SQL. Next: SVG and more.",
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  {
    title: "Roadmap Transparency",
    desc: "We share what we’re exploring and ship iteratively with feedback from real projects.",
    links: [
      { href: "/roadmap", label: "Roadmap" },
      { href: "/faq", label: "FAQ" },
    ],
  },
];

export const ABOUT_JSONLD = (base = "https://www.autodia.tech") => ({
  "@context": "https://schema.org",
  "@type": ["AboutPage", "WebPage"],
  name: "About AutoDia AI",
  url: `${base}/about`,
  mainEntity: {
    "@type": "Organization",
    name: "AutoDia AI",
    url: base,
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${base}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: `${base}/about`,
      },
    ],
  },
});
