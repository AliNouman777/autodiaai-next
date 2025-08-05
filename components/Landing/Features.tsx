import {
  ZapIcon,
  UserXIcon,
  BrainIcon,
  DownloadIcon,
  GitBranchIcon,
  BrainCircuit,
} from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Powered Schema Generation",
    description:
      "Describe database requirements in plain English. Advanced NLP models understand complex business logic, relationships, and constraints to generate accurate ERDs automatically.",
  },
  {
    icon: ZapIcon,
    title: "Professional ERD Editor",
    description:
      "Interactive canvas with drag-and-drop entities, real-time relationship editing, and automatic layout optimization. Supports complex cardinalities and constraint modeling.",
  },
  {
    icon: UserXIcon,
    title: "Zero Setup Required",
    description:
      "Start building ERDs instantly with no registration, downloads, or installations. Privacy-focused design ensures your schema data stays secure and private.",
  },
  {
    icon: BrainIcon,
    title: "Intelligent Relationship Detection",
    description:
      "Advanced AI automatically identifies entities, attributes, primary/foreign keys, and relationship cardinalities. Suggests optimal normalization and database best practices.",
  },
  {
    icon: DownloadIcon,
    title: "Production-Ready Exports",
    description:
      "Export high-resolution PNG images, scalable SVG files, or production-ready SQL DDL scripts. Compatible with PostgreSQL, MySQL, SQLite, and SQL Server.",
  },
  {
    icon: GitBranchIcon,
    title: "Industry Standards Compliance",
    description:
      "Follows Chen's ERD notation and Crow's Foot standards. Automatic cardinality detection, proper normalization rules, and database design best practices built-in.",
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 animate-fade-in">
            Built for{" "}
            <span className="bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
              Database Design
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto animate-fade-in-delay">
            Everything you need to design database schemas and create
            professional ERDs
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white border border-slate-200 rounded-xl p-8 hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover-lift animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-700/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
