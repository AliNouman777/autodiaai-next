"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import Button from "../common/Button";
import Logo from "@/public/logo.png";
import Image from "next/image";
import React, { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import ButtonSkeleton from "../skeleton/landing/ButtonSkeleton";

export default function AppNavbar() {
  const navItems = [
    { name: "Docs", link: "#docs" },
    { name: "Pricing", link: "#pricing" },
    { name: "GitHub", link: "https://github.com" },
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, initializing } = useAuth();

  const DesktopCTA = () => {
    if (initializing) {
      return (
        <div className="flex items-center gap-2">
          <ButtonSkeleton />
          <ButtonSkeleton />
        </div>
      );
    }
    if (user) {
      return (
        <div className="flex items-center gap-2">
          <Button
            href="/diagram"
            className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium w-full cursor-pointer z-100"
          >
            Generate Diagram
          </Button>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <Button
          href="/signup"
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium w-full cursor-pointer z-100"
        >
          SignUp
        </Button>
        <Button
          href="/login"
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium w-full cursor-pointer z-100"
        >
          Login
        </Button>
      </div>
    );
  };

  const MobileCTA = () => {
    if (initializing) {
      return (
        <div className="mt-4 w-full">
          <ButtonSkeleton fullWidth className="mt-0" />
        </div>
      );
    }
    if (user) {
      return (
        <div className="flex items-center mx-auto gap-2">
          <Button
            href="/diagram"
            className="bg-blue-500 mt-4 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium w-full cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Generate Diagram
          </Button>
        </div>
      );
    }
    return (
      <div className="flex items-center mx-auto gap-2">
        <Button
          href="/signup"
          className="bg-blue-500 mt-4 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium w-full cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          SignUp
        </Button>
        <Button
          href="/login"
          className="bg-blue-500 mt-4 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium w-full cursor-pointer"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          Login
        </Button>
      </div>
    );
  };

  return (
    <Navbar>
      {/* Desktop navbar */}
      <NavBody>
        <div className="flex items-center space-x-2 ">
          <Image
            src={Logo}
            alt="Company logo"
            width={60}
            height={48}
            priority
            className="w-auto h-auto"
          />
          <div className="-ml-5 text-2xl font-bold flex items-center ">
            <span className="text-gray-700">Auto</span>
            <span className="text-blue-500">Dia</span>
            &nbsp;
            <span className="text-gray-700"> Ai</span>
          </div>
        </div>

        <NavItems items={navItems} />

        <DesktopCTA />
      </NavBody>

      {/* Mobile navbar */}
      <MobileNav>
        <MobileNavHeader>
          <div className="flex items-center space-x-2">
            <Image
              src={Logo}
              alt="Company logo"
              width={45}
              height={36}
              priority
              className="w-auto h-auto"
            />
            <span className="text-xl font-bold text-gray-700">Auto</span>
            <span className="text-xl font-bold text-blue-500">Dia</span>
            <span className="text-xl font-bold text-gray-700"> Ai</span>
          </div>
          <MobileNavToggle
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
          />
        </MobileNavHeader>

        <MobileNavMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        >
          {navItems.map((item, idx) => (
            <a
              key={`mobile-link-${idx}`}
              href={item.link}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full px-4 py-2 text-lg text-neutral-700 hover:bg-blue-100 rounded"
            >
              {item.name}
            </a>
          ))}

          <MobileCTA />
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
