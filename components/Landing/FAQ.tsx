"use client";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

const faqs = [
  {
    question: "What makes AutoDia AI different from other ERD tools?",
    answer:
      "AutoDia AI is the first AI-powered ERD generator that understands natural language. Instead of manually creating entities and relationships, simply describe your database requirements in plain English. Our advanced NLP models automatically generate normalized, production-ready ERDs with proper relationships and constraints.",
  },
  {
    question: "Can AutoDia AI handle complex database schemas?",
    answer:
      "Yes! AutoDia AI supports complex enterprise-level schemas including inheritance, polymorphic relationships, composite keys, and multi-table constraints. It automatically applies normalization rules (1NF, 2NF, 3NF) and suggests optimal database design patterns for scalability and performance.",
  },
  {
    question: "Which database systems are supported for DDL export?",
    answer:
      "AutoDia AI generates SQL DDL compatible with PostgreSQL, MySQL, SQLite, SQL Server, and Oracle. The exported scripts include proper data types, constraints, indexes, and foreign key relationships, ready for immediate database implementation.",
  },
  {
    question: "How accurate is the AI relationship detection?",
    answer:
      "Our AI model has been trained on thousands of database schemas and achieves 95%+ accuracy in relationship detection. It understands domain-specific terminology, business rules, and automatically identifies primary keys, foreign keys, and cardinalities based on context clues in your descriptions.",
  },
  {
    question: "Is AutoDia AI suitable for enterprise use?",
    answer:
      "Absolutely! AutoDia AI is used by Fortune 500 companies, startups, and educational institutions. We offer enterprise features including team collaboration, version control, API access, custom templates, and SOC 2 compliant data processing for sensitive projects.",
  },
  {
    question: "Can I integrate AutoDia AI with my existing workflow?",
    answer:
      "Yes! AutoDia AI supports multiple export formats (PNG, SVG, SQL DDL) that integrate seamlessly with documentation tools, CI/CD pipelines, and development workflows. We also provide API access for automated schema generation and validation in your applications.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            <span className="bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
              Frequently Asked
            </span>{" "}
            Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-slate-200"
            >
              <button
                className="w-full px-8 py-6 text-left flex items-center justify-between focus:outline-none rounded-xl"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold text-slate-900">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`h-5 w-5 text-slate-400 transition-transform duration-200 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-8 pb-6 text-slate-600">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
