
import logo from "@/public/logo.png";
import { LoginForm } from "@/components/Login/login-form";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 ">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="text-primary-foreground flex size-18 items-center justify-center rounded-md">
            <Image src={logo} alt="Company Logo" width={40} height={40} />
          </div>
          <div className="-ml-5 text-2xl font-bold">
            <span className="text-foreground">Auto</span>
            <span className="text-primary">Dia</span>{" "}
            <span className="text-foreground">AI</span>
          </div>
        </Link>

        <h1 className="sr-only">Log In to AutoDia AI</h1>
        <p className="text-sm text-muted-foreground text-center">
          Sign in to continue generating and editing clean, professional{" "}
          <strong>ERD diagrams</strong>. New here?{" "}
          <Link href="/signup" className="underline">
            Create a free account
          </Link>
          .
        </p>

        <LoginForm />

        <div className="text-xs text-muted-foreground text-center space-x-3">
          <Link href="/#features" className="underline">
            Features
          </Link>
          <Link href="/#pricing" className="underline">
            Pricing
          </Link>
        </div>
      </div>
    </div>
  );
}
