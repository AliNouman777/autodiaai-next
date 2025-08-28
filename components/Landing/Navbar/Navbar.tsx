// components/Landing/AppNavbar.tsx (Server Component — no "use client")
import Image from "next/image";
import dynamic from "next/dynamic";
import Logo from "@/public/logo.png";
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
} from "@/components/ui/resizable-navbar";

// Client-only islands loaded dynamically (NO ssr:false here)
const ThemeToggle = dynamic(() => import("@/components/common/ThemeToggle"), {
  loading: () => null,
});
const DesktopCTA = dynamic(() => import("./NavbarDesktopCTA.client"), {
  loading: () => null,
});
const MobileMenuProvider = dynamic(
  () => import("./NavbarMobileMenu.client").then((m) => m.MobileMenuProvider),
  { loading: () => null }
);
const MobileMenuHeaderControls = dynamic(
  () =>
    import("./NavbarMobileMenu.client").then((m) => m.MobileMenuHeaderControls),
  { loading: () => null }
);
const MobileMenuPanel = dynamic(
  () => import("./NavbarMobileMenu.client").then((m) => m.MobileMenuPanel),
  { loading: () => null }
);

export default function AppNavbar() {
  return (
    <Navbar>
      {/* Desktop */}
      <NavBody>
        {/* Brand */}
        <div className="flex items-center gap-2">
          <Image
            src={Logo}
            alt="Autodia AI logo"
            width={40}
            height={40}
            priority
          />
          <div className="-ml-2 text-2xl font-bold">
            <span className="text-foreground">Auto</span>
            <span className="text-primary">Dia</span>{" "}
            <span className="text-foreground">AI</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DesktopCTA />
        </div>
      </NavBody>

      {/* Mobile */}
      <MobileNav>
        <MobileMenuProvider>
          <MobileNavHeader>
            {/* Brand (compact) */}
            <div className="flex items-center gap-2">
              <Image
                src={Logo}
                alt="Autodia AI logo"
                width={45}
                height={36}
                priority
              />
              <span className="text-xl font-bold text-foreground">Auto</span>
              <span className="text-xl font-bold text-primary">Dia</span>
              <span className="text-xl font-bold text-foreground"> AI</span>
            </div>

            {/* Theme + Toggle (client) */}
            <MobileMenuHeaderControls />
          </MobileNavHeader>

          {/* Slide-out panel (client) */}
          <MobileMenuPanel />
        </MobileMenuProvider>
      </MobileNav>
    </Navbar>
  );
}
