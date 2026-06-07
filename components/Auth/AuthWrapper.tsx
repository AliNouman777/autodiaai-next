// components/Auth/AuthWrapper.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access")?.value;

  if (!token) {
    redirect("/login");
  }

  return <>{children}</>;
}
