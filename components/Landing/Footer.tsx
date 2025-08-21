import {
  ChartScatter,
  TwitterIcon,
  GithubIcon,
  LinkedinIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Logo from "@/public/logo.png";

export default function Footer() {
  return (
    <footer className="py-16 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-xl font-bold text-white -ml-8">
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
                    <span className="text-white">Auto</span>
                    <span className="text-blue-500">Dia</span>
                    &nbsp;
                    <span className="text-white"> Ai</span>
                  </div>
                </div>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-md">
              The leading AI-powered Entity-Relationship Diagram generator.
              Transform database requirements into professional ERDs with SQL
              DDL export. Trusted by 10,000+ developers worldwide.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Follow us on Twitter"
              >
                <TwitterIcon className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Star us on GitHub"
              >
                <GithubIcon className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Connect on LinkedIn"
              >
                <LinkedinIcon className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Product</h3>
            <ul className="space-y-3 text-slate-400">
              {/* <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Documentation
                </Link>
              </li> */}
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3 text-slate-400">
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                {/* <Link href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </Li> */}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-2 pt-8 text-center text-slate-400">
          <p>&copy; 2025 AutoDia AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
