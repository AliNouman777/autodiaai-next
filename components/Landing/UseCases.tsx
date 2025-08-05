import {
  CodeIcon,
  DatabaseIcon,
  Table,
  BookOpenIcon,
  GraduationCapIcon,
  HandshakeIcon,
} from "lucide-react";

const useCases = [
  {
    icon: CodeIcon,
    title: "Developers",
    description:
      "Quickly prototype database schemas before implementation. Generate DDL scripts and validate relationships early in development.",
    benefits: ["Rapid prototyping", "DDL generation", "API planning"],
    color: "green",
  },
  {
    icon: DatabaseIcon,
    title: "Data Engineers",
    description:
      "Design data pipelines and warehouse schemas. Visualize complex data relationships and optimize for performance.",
    benefits: ["Pipeline design", "Schema optimization", "Data modeling"],
    color: "blue",
  },
  {
    icon: Table,
    title: "Architects",
    description:
      "Document system architecture and communicate database design decisions to stakeholders and development teams.",
    benefits: [
      "System documentation",
      "Stakeholder communication",
      "Design reviews",
    ],
    color: "purple",
  },
  {
    icon: BookOpenIcon,
    title: "Educators",
    description:
      "Create teaching materials and examples for database design courses. Help students understand entity relationships visually.",
    benefits: ["Course materials", "Visual learning", "Assignment creation"],
    color: "orange",
  },
  {
    icon: GraduationCapIcon,
    title: "Students",
    description:
      "Learn database design concepts through hands-on practice. Complete assignments and projects with professional-quality diagrams.",
    benefits: [
      "Assignment completion",
      "Concept learning",
      "Project documentation",
    ],
    color: "red",
  },
  {
    icon: HandshakeIcon,
    title: "Consultants",
    description:
      "Rapidly create client proposals and documentation. Demonstrate database solutions with clear, professional visuals.",
    benefits: [
      "Client proposals",
      "Solution documentation",
      "Professional presentations",
    ],
    color: "teal",
  },
];

const colorMap = {
  green: "bg-green-100 text-green-600",
  blue: "bg-blue-100 text-blue-600",
  purple: "bg-purple-100 text-purple-600",
  orange: "bg-orange-100 text-orange-600",
  red: "bg-red-100 text-red-600",
  teal: "bg-teal-100 text-teal-600",
};

export default function UseCases() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Built for{" "}
            <span className="bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
              Database Teams
            </span>
          </h2>
          <p className="text-xl text-slate-600">
            Trusted by professionals who design and work with databases
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 border border-slate-200 hover:shadow-lg transition-all duration-300"
            >
              <div
                className={`w-12 h-12 ${
                  colorMap[useCase.color as keyof typeof colorMap]
                } rounded-xl flex items-center justify-center mb-6`}
              >
                <useCase.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                {useCase.title}
              </h3>
              <p className="text-slate-600 leading-relaxed mb-4">
                {useCase.description}
              </p>
              <ul className="text-sm text-slate-500 space-y-2">
                {useCase.benefits.map((benefit, idx) => (
                  <li key={idx}>• {benefit}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
