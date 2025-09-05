// app/blog/[...slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { source } from "@/lib/source";
import { site } from "@/lib/site";
import defaultMdxComponents from "fumadocs-ui/mdx";
import type { ComponentType, HTMLAttributes, ComponentProps } from "react";
import Link from "next/link";
import Image from "next/image";

type Params = Promise<{ slug: string | string[] }>;

function toArraySlug(slug: string | string[]) {
  return Array.isArray(slug) ? slug : [slug];
}
function toIso(input?: string | Date) {
  if (!input) return undefined;
  const d = typeof input === "string" ? new Date(input) : input;
  return isNaN(d.getTime()) ? undefined : d.toISOString();
}
function toDate(input?: string | Date) {
  if (!input) return undefined;
  const d = typeof input === "string" ? new Date(input) : input;
  return isNaN(d.getTime()) ? undefined : d;
}
function formatDateUTC(d?: Date) {
  if (!d) return "";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(d);
}
function canonicalFor(parts: string[]) {
  const path = `/blog/${parts.join("/")}`;
  return new URL(path, site.url).toString();
}
function resolveOg(url?: string) {
  if (!url) return site.defaultOg;
  try {
    return new URL(url, site.url).toString();
  } catch {
    return site.defaultOg;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const parts = Array.isArray(slug) ? slug : [slug];

  const page = await source.getPage(parts);
  const canonical = canonicalFor(parts);

  if (!page) {
    return {
      title: "Not found",
      robots: { index: false, follow: false },
      alternates: { canonical },
    };
  }

  const data = page.data as {
    title?: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    author?: string;
    date?: string | Date;
    modified?: string | Date;
    draft?: boolean;
    cover?: string;
  };

  const title = data.metaTitle ?? data.title ?? parts.join(" / ");
  const description = data.metaDescription ?? data.description ?? "";
  const ogImage = resolveOg(data.cover);

  return {
    title,
    description,
    alternates: { canonical },
    robots: data.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      siteName: site.name,
      images: [{ url: ogImage }],
      publishedTime: toIso(data.date),
      modifiedTime: toIso(data.modified ?? data.date),
      authors: data.author ? [data.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: site.twitter,
      images: [ogImage],
    },
  };
}

/* ---- MDX overrides: headings, tables, and Link mapping ---- */

function H2(props: HTMLAttributes<HTMLHeadingElement>) {
  const { className = "", ...rest } = props;
  return (
    <h2
      {...rest}
      className={`mt-14 mb-5 scroll-mt-28 text-2xl md:text-[28px] font-semibold tracking-tight ${className}`}
    />
  );
}
function H3(props: HTMLAttributes<HTMLHeadingElement>) {
  const { className = "", ...rest } = props;
  return (
    <h3
      {...rest}
      className={`mt-10 mb-4 scroll-mt-28 text-xl md:text-2xl font-semibold tracking-tight ${className}`}
    />
  );
}
function H4(props: HTMLAttributes<HTMLHeadingElement>) {
  const { className = "", ...rest } = props;
  return (
    <h4
      {...rest}
      className={`mt-7 mb-3 text-lg md:text-xl font-semibold tracking-tight ${className}`}
    />
  );
}

function MdxTable(props: ComponentProps<"table">) {
  const { className = "", ...rest } = props;
  return (
    <div className="my-8 overflow-x-auto rounded-xl border">
      <table
        {...rest}
        className={`min-w-full border-collapse text-sm ${className}`}
      />
    </div>
  );
}
function MdxThead(props: ComponentProps<"thead">) {
  const { className = "", ...rest } = props;
  return (
    <thead
      {...rest}
      className={`bg-muted/60 text-muted-foreground ${className}`}
    />
  );
}
function MdxTh(props: ComponentProps<"th">) {
  const { className = "", ...rest } = props;
  return (
    <th
      {...rest}
      className={`border-b px-3 py-2 text-left font-medium ${className}`}
    />
  );
}
function MdxTd(props: ComponentProps<"td">) {
  const { className = "", ...rest } = props;
  return (
    <td {...rest} className={`border-t px-3 py-2 align-top ${className}`} />
  );
}

/** Render all MDX links through Next <Link> */
function Anchor({ href = "", children, ...rest }: ComponentProps<"a">) {
  if (!href) return <a {...rest}>{children}</a>;
  const external =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:");
  return (
    <Link
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(rest as any)}
    >
      {children}
    </Link>
  );
}

function shareLinks(url: string, title?: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(title ?? "");
  return {
    x: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    reddit: `https://www.reddit.com/submit?url=${u}&title=${t}`,
  };
}

export default async function BlogPost({ params }: { params: Params }) {
  const { slug } = await params;
  const parts = toArraySlug(slug);

  const page = await source.getPage(parts);
  if (!page) return notFound();

  const data = page.data as {
    title?: string;
    description?: string;
    author?: string;
    date?: string | Date;
    modified?: string | Date;
    tags?: string[];
    draft?: boolean;
    readTime?: string;
    cover?: string;
    thumbnail?: string;
    body?: ComponentType<any>;
    exports?: { default?: ComponentType<any> };
  };

  const MDX = data.body ?? data.exports?.default;
  if (!MDX) return notFound();

  const canonical = canonicalFor(parts);
  const publishedDate = toDate(data.date);
  const modifiedDate = toDate(data.modified ?? data.date);
  const share = shareLinks(canonical, data.title);

  const all = await source.getPages();
  const normalized = all
    .filter((p) => !(p.data as any)?.draft)
    .sort((a, b) => {
      const ad = toDate((a.data as any)?.date)?.getTime() ?? 0;
      const bd = toDate((b.data as any)?.date)?.getTime() ?? 0;
      return bd - ad;
    });

  const currentPath = `/blog/${parts.join("/")}`;
  const idx = normalized.findIndex((p) => p.url === currentPath);
  const prev = idx > 0 ? normalized[idx - 1] : undefined;
  const next =
    idx >= 0 && idx < normalized.length - 1 ? normalized[idx + 1] : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: data.title,
    description: data.description,
    datePublished: publishedDate?.toISOString(),
    dateModified: modifiedDate?.toISOString(),
    mainEntityOfPage: canonical,
    author: data.author ? { "@type": "Person", name: data.author } : undefined,
    image: data.cover ? [new URL(data.cover, site.url).toString()] : undefined,
    publisher: {
      "@type": "Organization",
      name: site.name,
      logo: {
        "@type": "ImageObject",
        url: new URL(site.logo, site.url).toString(),
      },
    },
  };

  return (
    <article className="mx-auto max-w-4xl">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {data.cover ? (
        <div className="relative mb-8 overflow-hidden rounded-3xl border bg-muted/30">
          <div className="relative aspect-[16/7] w-full">
            <Image
              src={data.cover}
              alt={data.title ?? ""}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h1 className="text-2xl leading-tight font-bold text-white md:text-4xl">
                {data.title}
              </h1>
            </div>
          </div>
        </div>
      ) : (
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {data.title}
          </h1>
        </header>
      )}

      <nav className="mb-4 text-sm text-muted-foreground">
        <Link href="/blog" className="hover:underline">
          Blog
        </Link>{" "}
        / <span className="text-foreground">{parts.at(-1)}</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        {publishedDate && (
          <time dateTime={publishedDate.toISOString()}>
            {formatDateUTC(publishedDate)}
          </time>
        )}
        {data.readTime && <span>• {data.readTime}</span>}
        {data.author && <span>• By {data.author}</span>}
        {modifiedDate && data.modified && (
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs">
            Updated {formatDateUTC(modifiedDate)}
          </span>
        )}
        <span className="ml-auto flex items-center gap-2">
          <span className="hidden md:inline">Share:</span>
          <Link
            aria-label="Share on X"
            href={share.x}
            className="rounded-md px-2 py-1 hover:bg-muted"
            target="_blank"
          >
            X
          </Link>
          <Link
            aria-label="Share on LinkedIn"
            href={share.linkedin}
            className="rounded-md px-2 py-1 hover:bg-muted"
            target="_blank"
          >
            in
          </Link>
          <Link
            aria-label="Share on Reddit"
            href={share.reddit}
            className="rounded-md px-2 py-1 hover:bg-muted"
            target="_blank"
          >
            r
          </Link>
        </span>
      </div>

      <div
        className={[
          "prose dark:prose-invert max-w-none",
          "prose-headings:font-semibold prose-headings:tracking-tight",
          "prose-p:my-5 prose-li:my-1.5",
          "prose-a:underline-offset-4 hover:prose-a:underline",
          "prose-img:rounded-xl",
          "prose-hr:my-12",
          "prose-blockquote:border-l-4 prose-blockquote:border-muted prose-blockquote:pl-4",
          "prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5",
          "prose-pre:rounded-xl",
          "prose-h2:mt-14 prose-h2:mb-5 prose-h3:mt-10 prose-h3:mb-4 prose-h4:mt-7 prose-h4:mb-3",
        ].join(" ")}
      >
        <MDX
          components={{
            ...defaultMdxComponents,
            h2: H2,
            h3: H3,
            h4: H4,
            table: MdxTable,
            thead: MdxThead,
            th: MdxTh,
            td: MdxTd,
            a: Anchor, // markdown links -> Next <Link>
            Link, // allow <Link> JSX in MDX
          }}
        />
      </div>

      <footer className="mt-14">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-full bg-muted text-sm font-medium">
              {data.author?.[0]?.toUpperCase() ?? "A"}
            </div>
            <div className="text-sm">
              <div className="font-medium">{data.author ?? "—"}</div>
              {publishedDate && (
                <div className="text-muted-foreground">
                  Published {formatDateUTC(publishedDate)}
                </div>
              )}
            </div>
          </div>

          <Link
            href={canonical}
            className="text-sm underline underline-offset-4"
          >
            {canonical}
          </Link>
        </div>

        {(prev || next) && (
          <div className="grid gap-4 md:grid-cols-2">
            {prev ? (
              <Link
                href={prev.url}
                className="group block rounded-2xl border p-5 transition hover:bg-muted/50"
              >
                <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                  Previous
                </div>
                <div className="line-clamp-2 font-medium group-hover:underline">
                  {(prev.data as any)?.title ?? prev.url}
                </div>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link
                href={next.url}
                className="group block rounded-2xl border p-5 text-right transition hover:bg-muted/50 md:justify-self-end"
              >
                <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
                  Next
                </div>
                <div className="line-clamp-2 font-medium group-hover:underline">
                  {(next.data as any)?.title ?? next.url}
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        )}
      </footer>
    </article>
  );
}

export function generateStaticParams() {
  return source.generateParams();
}
