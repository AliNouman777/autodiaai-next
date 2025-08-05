"use client";
import {
  GraduationCapIcon,
  ShoppingCartIcon,
  HeartIcon,
  CreditCardIcon,
  TruckIcon,
  BookOpenIcon,
  BuildingIcon,
  GamepadIcon,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const examples = [
  {
    icon: ShoppingCartIcon,
    title: "E-commerce Platform",
    description:
      "Complete online marketplace with multi-vendor support, reviews, and advanced inventory management.",
    prompt:
      "Create a comprehensive e-commerce system with Users, Vendors, Products, Categories, Orders, OrderItems, Reviews, ShoppingCart, Payments, Shipping, and Inventory. Include user authentication, product ratings, order tracking, and payment processing.",
    entities: [
      "Users",
      "Vendors",
      "Products",
      "Categories",
      "Orders",
      "Reviews",
      "Payments",
    ],
    relationships: [
      "User places Orders",
      "Products belong to Categories",
      "Orders contain OrderItems",
    ],
    preview: "7 entities, 12 relationships",
    complexity: "Advanced",
    useCase: "Online stores, marketplaces, retail platforms",
  },
  {
    icon: GraduationCapIcon,
    title: "University Management",
    description:
      "Academic institution system with enrollment, grading, and course management.",
    prompt:
      "Design a university management system with Students, Professors, Courses, Departments, Enrollments, Grades, Semesters, Classrooms, and Prerequisites. Include course scheduling, grade tracking, and academic records.",
    entities: [
      "Students",
      "Professors",
      "Courses",
      "Departments",
      "Enrollments",
      "Grades",
    ],
    relationships: [
      "Students enroll in Courses",
      "Professors teach Courses",
      "Courses have Prerequisites",
    ],
    preview: "6 entities, 9 relationships",
    complexity: "Intermediate",
    useCase: "Schools, universities, training centers",
  },
  {
    icon: HeartIcon,
    title: "Healthcare Management",
    description:
      "Hospital system with patient records, appointments, and medical history tracking.",
    prompt:
      "Build a healthcare management system with Patients, Doctors, Appointments, MedicalRecords, Prescriptions, Departments, Treatments, and Insurance. Include appointment scheduling, medical history, and billing integration.",
    entities: [
      "Patients",
      "Doctors",
      "Appointments",
      "MedicalRecords",
      "Prescriptions",
      "Treatments",
    ],
    relationships: [
      "Patients have Appointments",
      "Doctors treat Patients",
      "Appointments generate MedicalRecords",
    ],
    preview: "6 entities, 10 relationships",
    complexity: "Advanced",
    useCase: "Hospitals, clinics, medical practices",
  },
  {
    icon: CreditCardIcon,
    title: "SaaS Billing Platform",
    description:
      "Subscription management with tiered pricing, usage tracking, and automated billing.",
    prompt:
      "Create a SaaS billing system with Users, Organizations, Subscriptions, Plans, Features, Invoices, Payments, UsageMetrics, and Billing. Include plan upgrades, usage-based billing, and payment processing.",
    entities: [
      "Users",
      "Organizations",
      "Subscriptions",
      "Plans",
      "Invoices",
      "Payments",
    ],
    relationships: [
      "Users belong to Organizations",
      "Organizations have Subscriptions",
      "Plans define Features",
    ],
    preview: "6 entities, 8 relationships",
    complexity: "Advanced",
    useCase: "SaaS products, subscription services",
  },
  {
    icon: TruckIcon,
    title: "Logistics & Supply Chain",
    description:
      "Comprehensive shipping system with real-time tracking and warehouse management.",
    prompt:
      "Design a logistics system with Warehouses, Products, Inventory, Shipments, Carriers, Tracking, Routes, and DeliveryStatus. Include real-time tracking, route optimization, and inventory management.",
    entities: [
      "Warehouses",
      "Products",
      "Inventory",
      "Shipments",
      "Carriers",
      "Routes",
    ],
    relationships: [
      "Warehouses store Inventory",
      "Shipments use Routes",
      "Carriers handle Shipments",
    ],
    preview: "6 entities, 9 relationships",
    complexity: "Intermediate",
    useCase: "Shipping companies, e-commerce fulfillment",
  },
  {
    icon: BookOpenIcon,
    title: "Library Management",
    description:
      "Digital library with book lending, member management, and reservation system.",
    prompt:
      "Build a library management system with Members, Books, Authors, Categories, Loans, Reservations, Fines, and Branches. Include book lending, return tracking, and fine calculation.",
    entities: ["Members", "Books", "Authors", "Loans", "Reservations", "Fines"],
    relationships: [
      "Members borrow Books",
      "Authors write Books",
      "Loans can have Fines",
    ],
    preview: "6 entities, 7 relationships",
    complexity: "Beginner",
    useCase: "Libraries, bookstores, reading platforms",
  },
  {
    icon: BuildingIcon,
    title: "Real Estate Platform",
    description:
      "Property management with listings, agents, and transaction tracking.",
    prompt:
      "Create a real estate system with Properties, Agents, Clients, Listings, Viewings, Offers, Contracts, and PropertyTypes. Include property search, viewing scheduling, and offer management.",
    entities: [
      "Properties",
      "Agents",
      "Clients",
      "Listings",
      "Viewings",
      "Offers",
    ],
    relationships: [
      "Agents manage Properties",
      "Clients schedule Viewings",
      "Viewings lead to Offers",
    ],
    preview: "6 entities, 8 relationships",
    complexity: "Intermediate",
    useCase: "Real estate agencies, property platforms",
  },
  {
    icon: GamepadIcon,
    title: "Gaming Platform",
    description:
      "Online gaming system with players, matches, achievements, and leaderboards.",
    prompt:
      "Design a gaming platform with Players, Games, Matches, Teams, Achievements, Leaderboards, and Tournaments. Include matchmaking, score tracking, and tournament management.",
    entities: [
      "Players",
      "Games",
      "Matches",
      "Teams",
      "Achievements",
      "Tournaments",
    ],
    relationships: [
      "Players join Teams",
      "Teams participate in Matches",
      "Players earn Achievements",
    ],
    preview: "6 entities, 9 relationships",
    complexity: "Intermediate",
    useCase: "Gaming platforms, esports, tournaments",
  },
];

const complexityColors = {
  Beginner: "bg-green-100 text-green-700 border-green-200",
  Intermediate: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Advanced: "bg-red-100 text-red-700 border-red-200",
};

export default function PromptExamples() {
  const router = useRouter();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleExampleClick = (prompt: string) => {
    sessionStorage.setItem("examplePrompt", prompt);

    router.push("/erd");
  };

  const copyToClipboard = async (
    prompt: string,
    index: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 animate-fade-in">
            Try These{" "}
            <span className="bg-gradient-to-r from-primary to-blue-700 bg-clip-text text-transparent">
              Example Prompts
            </span>
          </h2>
          <p className="text-xl text-slate-600 animate-fade-in-delay">
            Click any example to generate it instantly, or copy the prompt to
            customize it
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {examples.map((example, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-xl border-2 border-slate-200 hover:border-primary transition-all duration-300 cursor-pointer transform hover:scale-[1.02] hover:shadow-xl animate-slide-up`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleExampleClick(example.prompt)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl flex items-center justify-center transition-transform duration-300 ${
                        hoveredIndex === index ? "scale-110 rotate-3" : ""
                      }`}
                    >
                      <example.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1">
                        {example.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full border ${
                          complexityColors[
                            example.complexity as keyof typeof complexityColors
                          ]
                        }`}
                      >
                        {example.complexity}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => copyToClipboard(example.prompt, index, e)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-slate-100 rounded-lg"
                    title="Copy prompt"
                  >
                    {copiedIndex === index ? (
                      <span className="text-green-600 text-xs font-medium">
                        Copied!
                      </span>
                    ) : (
                      <svg
                        className="w-4 h-4 text-slate-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                  {example.description}
                </p>

                {/* Preview Info */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span className="flex items-center space-x-1">
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{example.preview}</span>
                  </span>
                  <span className="text-slate-400">{example.useCase}</span>
                </div>

                {/* Entity Preview */}
                <div className="mb-4">
                  <div className="text-xs text-slate-500 mb-2">
                    Key Entities:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {example.entities.slice(0, 4).map((entity, entityIndex) => (
                      <span
                        key={entityIndex}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md"
                      >
                        {entity}
                      </span>
                    ))}
                    {example.entities.length > 4 && (
                      <span className="text-xs text-slate-400 px-2 py-1">
                        +{example.entities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Prompt Preview */}
              <div className="px-6 pb-6">
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 transition-colors group-hover:bg-slate-100">
                  <div className="text-xs text-slate-500 mb-2 flex items-center justify-between">
                    <span>Prompt:</span>
                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to generate →
                    </span>
                  </div>
                  <code className="text-sm text-slate-700 font-mono leading-relaxed line-clamp-3">
                    {example.prompt}
                  </code>
                </div>
              </div>

              {/* Hover Effects */}
              <div
                className={`absolute inset-0 bg-gradient-to-r from-primary/5 to-blue-700/5 rounded-xl transition-opacity duration-300 pointer-events-none ${
                  hoveredIndex === index ? "opacity-100" : "opacity-0"
                }`}
              />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-slate-600 mb-6">
            Need something different? Describe any database system in your own
            words.
          </p>
          <button
            onClick={() => router.push("/erd")}
            className="bg-primary text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-all duration-300 font-semibold transform hover:scale-105 animate-pulse-subtle cursor-pointer"
          >
            Start with Custom Prompt →
          </button>
        </div>
      </div>
    </section>
  );
}
