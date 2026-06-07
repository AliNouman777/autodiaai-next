// app/about/page.tsx
import JsonLd from "@/components/seo/JsonLd";
import PageHeader from "@/components/about/PageHeader";
import StorySection from "@/components/about/StorySection";
import PrinciplesGrid from "@/components/about/PrinciplesGrid";
import BuildSection from "@/components/about/BuildSection";
import WhoWeServeGrid from "@/components/about/WhoWeServeGrid";
import CommitmentsGrid from "@/components/about/CommitmentsGrid";
import RoadmapCommunity from "@/components/about/RoadmapCommunity";
import GentleCta from "@/components/about/GentleCta";
import { ABOUT_JSONLD } from "@/lib/content/about";

export default function AboutPage() {
  const jsonLd = ABOUT_JSONLD("https://www.autodia.tech");

  return (
    <>
      <JsonLd data={jsonLd} />
      <PageHeader />
      <StorySection />
      <PrinciplesGrid />
      <BuildSection />
      <WhoWeServeGrid />
      <CommitmentsGrid />
      <RoadmapCommunity />
      <GentleCta />
    </>
  );
}
