// components/ui/Button.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  href: string;
}

const Button: React.FC<ButtonProps> = ({ href, children, ...rest }) => {
  const router = useRouter();
  return (
    <button {...rest} onClick={() => router.push(href)}>
      {children}
    </button>
  );
};

export default Button;
