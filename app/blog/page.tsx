import Image from "next/image";
import Link from "next/link";
import { source } from "@/lib/source";

export default async function BlogIndex() {
  const pages = await source.getPages(); // [{ url, data:{ title, description, cover, date, author, ... } }, ...]

  return (
    <main className="mx-auto max-w-6xl px-4 md:px-6 py-10">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
        Blog
      </h1>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pages.map((p) => {
          const d = p.data as {
            title?: string;
            description?: string;
            cover?: string;
            date?: string | Date;
            author?: string;
            readTime?: string;
          };

          return (
            <article
              key={p.url}
              className="group overflow-hidden rounded-2xl border bg-background hover:shadow-lg transition"
            >
              <Link href={p.url} className="block">
                <div className="relative aspect-[16/9]">
                  {/* Fallback gray backdrop if no cover */}
                  <div className="absolute inset-0 bg-muted" />
                  {d.cover ? (
                    <Image
                      src={d.cover}
                      alt={d.title ?? ""}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                      priority
                    />
                  ) : null}
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold leading-snug group-hover:underline line-clamp-2">
                    {d.title ?? p.url}
                  </h2>
                  {d.description && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {d.description}
                    </p>
                  )}
                  <div className="mt-4 text-xs text-muted-foreground flex gap-2">
                    {d.date && (
                      <time dateTime={new Date(d.date).toISOString()}>
                        {new Date(d.date).toLocaleDateString()}
                      </time>
                    )}
                    {d.readTime && <span>• {d.readTime}</span>}
                    {d.author && <span>• {d.author}</span>}
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </section>
    </main>
  );
}
