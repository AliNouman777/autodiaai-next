import logo from "@/public/logo.png";

import { SignupForm } from "@/components/SignUp/signup-form";
import Link from "next/link";
import Image from "next/image";
// import RedirectIfAuth from "@/components/Auth/RedirectIfAuth";

export default function LoginPage() {
  return (
    // <RedirectIfAuth>

    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="#"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className=" text-primary-foreground flex size-18 items-center justify-center rounded-md">
            <Image src={logo} alt="Company Logo" width={40} height={40} />
          </div>
          <div className="-ml-5 text-2xl font-bold">
            <span className="text-foreground">Auto</span>
            <span className="text-primary">Dia</span>{" "}
            <span className="text-foreground">AI</span>
          </div>
        </Link>
        <SignupForm />
      </div>
    </div>
    // </RedirectIfAuth>
  );
}
