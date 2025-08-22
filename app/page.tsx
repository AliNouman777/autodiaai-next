// app/page.tsx
import dynamicImport from "next/dynamic";
import Navbar from "@/components/Landing/Navbar/Navbar"; // SSR
import Hero from "@/components/Landing/Hero"; // SSR
import FAQ from "@/components/Landing/FAQ"; // SSR
import HowItWorks from "@/components/Landing/HowItWorks"; // SSR

export const dynamic = "force-static";
export const revalidate = 86_400;
export const runtime = "edge";

// Below-the-fold (client/heavy) → lazy-load
const Features = dynamicImport(() => import("@/components/Landing/Features"), {
  loading: () => null,
});
const FuturePlan = dynamicImport(
  () => import("@/components/common/FuturePlan"),
  {
    loading: () => null,
  }
); // "use client"
const UseCases = dynamicImport(() => import("@/components/Landing/UseCases"), {
  loading: () => null,
});
const Pricing = dynamicImport(() => import("@/components/Landing/Pricing"), {
  loading: () => null,
});
const Footer = dynamicImport(() => import("@/components/Landing/Footer"), {
  loading: () => null,
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
      <Footer /> {/* can be lazy if it’s client or heavy */}
    </main>
  );
}
