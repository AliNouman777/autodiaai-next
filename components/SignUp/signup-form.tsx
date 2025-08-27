"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { useAuth } from "@/src/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// 👇 import your Spinner component (adjust path as needed)
import { Spinner } from "@/src/components/ui/shadcn-io/spinner";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { signup, loading } = useAuth();

  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  // 👇 new local state for Google button
  const [googleLoading, setGoogleLoading] = React.useState(false);

  const validate = () => {
    const e = email.trim();
    if (!firstName.trim()) {
      setError("First name is required.");
      return false;
    }
    if (!lastName.trim()) {
      setError("Last name is required.");
      return false;
    }
    if (!e || !/^\S+@\S+\.\S+$/.test(e)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return false;
    }
    return true;
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError(null);

    if (!validate()) {
      toast.error("Fix the highlighted errors and try again.");
      return;
    }

    try {
      await signup(firstName.trim(), lastName.trim(), email.trim(), password);
      toast.success("Account created! Welcome 👋");
      router.replace("/");
    } catch (err: any) {
      const msg =
        err?.data?.error?.message ||
        err?.message ||
        "Sign up failed. Please try again.";
      setError(msg);

      if (err?.status === 409 || err?.code === "EMAIL_TAKEN") {
        toast.error("This email is already registered.");
      } else if (err?.status === 400) {
        toast.error("Invalid input. Please check your details.");
      } else {
        toast.error(msg);
      }
    }
  }

  function handleGoogleSignup() {
    setGoogleLoading(true); // 👈 start spinner
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
    const url = `${base}/auth/google/login`;
    // full page navigation (preserves cookies set on callback)
    window.location.assign(url);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome</CardTitle>
          <CardDescription>Sign up with your Google account</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-6" noValidate>
            <div className="flex flex-col gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full cursor-pointer"
                onClick={handleGoogleSignup}
                disabled={loading || googleLoading}
                aria-label="Sign up with Google"
              >
                {googleLoading ? (
                  <Spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="mr-2 h-4 w-4"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="#2196F3"
                    />
                  </svg>
                )}
                {googleLoading ? "Redirecting…" : "Sign up with Google"}
              </Button>
            </div>

            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>

            <div className="grid gap-6">
              <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
                <div className="flex flex-col gap-1 flex-1">
                  <Label htmlFor="firstname">First name</Label>
                  <Input
                    id="firstname"
                    placeholder="Tyler"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                    aria-invalid={!!error && !firstName.trim()}
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <Label htmlFor="lastname">Last name</Label>
                  <Input
                    id="lastname"
                    placeholder="Durden"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                    aria-invalid={!!error && !lastName.trim()}
                    required
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  aria-invalid={!!error && !/^\S+@\S+\.\S+$/.test(email.trim())}
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  aria-invalid={!!error && password.length < 8}
                />
              </div>

              {error && (
                <p className="text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-500 ml-2 text-white px-6 py-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all duration-300 font-medium hover-lift transform hover:scale-105 animate-glow disabled:opacity-60"
              >
                {loading ? "Creating account…" : "Sign Up"}
              </Button>
            </div>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="underline underline-offset-4 font-semibold text-blue-500"
              >
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
