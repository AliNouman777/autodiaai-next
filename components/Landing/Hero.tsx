import Button from "../common/Button";
import { ChartScatter, LayoutTemplate } from "lucide-react";
import ERDdiagram from "@/public/erd.png";
import Image from "next/image";
export default function Hero() {
  return (
    <section className="pt-26 pb-20 bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <div className="mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left animate-slide-in-left">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6 animate-fade-in">
              Generate Professional{" "}
              <span className="bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent animate-glow">
                ERD Diagrams
              </span>{" "}
              from{" "}
              <span className="bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
                Natural Language
              </span>
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed animate-fade-in-delay">
              Create interactive Entity-Relationship Diagrams (ERDs) instantly
              from natural language prompts — powered by AI. Easily design
              database schemas and export your ERD as a high-quality PNG image.
              Perfect for developers, students, and data professionals building
              modern databases.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 mb-8 animate-slide-up"
              style={{ animationDelay: "0.6s", animationFillMode: "both" }}
            >
              <Button
                href="/diagram"
                className="bg-primary text-white px-8 py-4 rounded-full hover:bg-blue-700 transition-all duration-300 font-semibold text-lg hover-lift transform hover:scale-105 cursor-pointer  flex "
              >
                <LayoutTemplate className="h-5 w-5 mr-2 mt-1" />
                Start Building ERDs Free
              </Button>
              {/* <Button
                href="/erd"
                className="border-2 border-slate-300 text-slate-700 px-8 py-4 rounded-full hover:border-slate-400 hover:text-slate-900 transition-all duration-300 font-semibold text-lg hover-lift cursor-pointer"
              >
                <ChartScatter className="h-5 w-5 mr-2" />
                View Live Demo
              </Button> */}
            </div>

            {/* Trust Indicators */}
            <div
              className="flex flex-wrap items-center gap-6 mb-8 text-sm text-slate-500 animate-slide-up"
              style={{ animationDelay: "0.7s", animationFillMode: "both" }}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>No signup required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Export to PNG</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Industry-standard ERD notation</span>
              </div>
            </div>

            <div
              className="glass border border-slate-200 rounded-xl p-4 inline-block animate-slide-up"
              style={{ animationDelay: "0.8s", animationFillMode: "both" }}
            >
              <p className="text-sm text-slate-500 mb-2 flex items-center">
                <span className="animate-pulse mr-2">💡</span>
                Try this example:
              </p>
              <code className="text-primary font-mono text-sm block">
                "Create an e-commerce system with Users, Products, Orders, and
                Categories"
              </code>
            </div>
          </div>

          <div className="relative animate-slide-in-right">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-700/20 rounded-3xl blur-2xl animate-pulse-subtle"></div>
            <Image
              src={ERDdiagram}
              alt="AutoDia AI ERD Generator Interface"
              className="relative rounded-2xl shadow-xl w-auto h-auto border border-slate-200 hover-lift transition-all duration-500"
              width={800}
              height={60}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent rounded-2xl"></div>

            {/* Floating elements */}
            <div
              className="absolute -top-4 -right-4 w-8 h-8 bg-primary rounded-full animate-float"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/4 -left-4 w-6 h-6 bg-blue-400 rounded-full animate-float"
              style={{ animationDelay: "2s" }}
            ></div>
            <div
              className="absolute bottom-1/4 -right-6 w-4 h-4 bg-blue-600 rounded-full animate-float"
              style={{ animationDelay: "4s" }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
