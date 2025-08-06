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

export default function AppNavbar() {
  const navItems = [
    { name: "Docs", link: "#docs" },
    { name: "Pricing", link: "#pricing" },
    { name: "GitHub", link: "https://github.com" }, // Add icon if you want!
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <Navbar>
      {/* Desktop navbar */}
      <NavBody>
        <div className="flex items-center space-x-2">
          <Image
            src={Logo}
            alt="Company logo"
            width={60}
            height={48}
            priority
            className="w-auto h-auto"
          />
          <div className="-ml-5 text-2xl font-bold flex items-center gap-1">
            <span className="text-gray-700">Auto</span>
            <span className="text-blue-500">Dia</span>
            <span className="text-gray-700"> Ai</span>
          </div>
        </div>
        <NavItems items={navItems} />
        <div className="flex items-center gap-2">
          {/* <Button href="/erd" className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition">Try For Free</Button> */}
          <Button
            href="/login"
            className="bg-blue-500 ml-2 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium"
          >
            Login
          </Button>
        </div>
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
          <Button
            href="/login"
            className="bg-blue-500 mt-4 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition font-medium w-full"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Button>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}
