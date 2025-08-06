// import { GithubIcon } from "lucide-react";
import Button from "../common/Button";
import Logo from "@/public/logo.png";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b shadow-md border-slate-200 animate-slide-down">
      <div className="container mx-auto px-6 py-4">
        <div className=" flex items-center justify-between ">
          <div className="flex items-center space-x-2 animate-fade-in">
            <Image
              src={Logo}
              alt="Company logo"
              width={80}
              height={60}
              priority
              className="w-auto h-auto"
            />
            <div className="text-2xl -m-6 font-bold flex items-center">
              <span className="text-gray-700">Auto</span>
              <span className="text-blue-500">Dia</span>
              <span className="text-gray-700"> Ai</span>
            </div>
          </div>

          {/* <div className="hidden md:flex items-center space-x-8 animate-fade-in-delay">
            <a
              href="#docs"
              className="text-slate-600 hover:text-primary transition-colors duration-300 relative group"
            >
              Docs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#pricing"
              className="text-slate-600 hover:text-primary transition-colors duration-300 relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a
              href="#"
              className="text-slate-600 hover:text-primary transition-colors duration-300 flex items-center space-x-1 relative group"
            >
              <GithubIcon className="h-4 w-4" />
              <span>GitHub</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div> */}

          <div>
            {/* <Button
              href="/erd"
              className="bg-blue-500 text-white px-6 py-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all duration-300 font-medium hover-lift transform hover:scale-105 animate-glow"
            >
              Try For Free
            </Button> */}

            <Button
              href="/login"
              className="bg-blue-500 ml-2 text-white px-6 py-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all duration-300 font-medium hover-lift transform hover:scale-105 animate-glow"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
