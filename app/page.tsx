// app/page.tsx
import dynamicImport from "next/dynamic";
import Navbar from "@/components/Landing/Navbar/Navbar";
import Hero from "@/components/Landing/Hero";
import FAQ from "@/components/Landing/FAQ";
import HowItWorks from "@/components/Landing/HowItWorks";
import UseCases from "@/components/Landing/UseCases";
import Footer from "@/components/Landing/Footer";

export const dynamic = "force-static";
export const revalidate = 86_400;

// Rationale: Optimize dynamic imports with proper loading states
// Below-the-fold (client/heavy) → lazy-load
const Features = dynamicImport(() => import("@/components/Landing/Features"), {
  loading: () => <div className="h-96" />, // Prevent layout shift
});
const FuturePlan = dynamicImport(
  () => import("@/components/Landing/FuturePlan"),
  {
    loading: () => <div className="h-64" />, // Prevent layout shift
  }
);

const Pricing = dynamicImport(() => import("@/components/Landing/Pricing"), {
  loading: () => <div className="h-96" />, // Prevent layout shift
});

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks /> {/* SSR: fast, zero client JS */}
      <Features /> {/* client/heavy → lazy */}
      <FuturePlan /> {/* client component → lazy */}
      <UseCases /> {/* client/heavy → lazy */}
      <Pricing /> {/* client/heavy → lazy */}
      <FAQ /> {/* SSR: no Suspense needed unless it fetches slowly */}
      <Footer />
    </main>
  );
}
