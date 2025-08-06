// Features.tsx
// import { featuresData } from "@/constant/data/featuresData"; // adjust path as needed
import Image from "next/image";

export function Features() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Built for{" "}
            <span className="bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
              Modern Diagramming
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            All the AI-powered tools you need to design, edit, and export
            professional diagrams—no design skills required.
          </p>
        </div>

        <div>
          <section className="sm:py-10 bg-white">
            <div className="max-w-6xl mx-auto px-4 space-y-20">
              {featuresData.map((feature, idx) => {
                const isImageRight = idx % 2 === 0;
                return (
                  <div
                    key={feature.title}
                    className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${
                      isImageRight ? "" : "md:flex-row-reverse"
                    }`}
                  >
                    {/* IMAGE */}
                    <div className="flex-1 w-full">
                      <Image
                        src={feature.src}
                        alt={feature.title}
                        className="rounded-2xl shadow-lg object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={idx === 0}
                      />
                    </div>
                    {/* CONTENT */}
                    <div className="flex-1 w-full">
                      <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-slate-700 mb-6">
                        {feature.description}
                      </p>
                      {feature.ctaText && (
                        <a
                          href={feature.ctaLink}
                          className="inline-block px-6 py-2 bg-primary text-white rounded-lg font-semibold shadow hover:bg-blue-800 transition"
                        >
                          {feature.ctaText}
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
