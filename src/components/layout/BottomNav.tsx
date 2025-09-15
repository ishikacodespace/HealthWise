"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutDashboard, HeartPulse, Moon, Sun, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

type NavLink = {
  href: string;
  label: string;
};

const iconMap: { [key: string]: React.ReactNode } = {
  "/": <Home className="h-5 w-5" />,
  "/dashboard": <LayoutDashboard className="h-5 w-5" />,
  "/awareness": <HeartPulse className="h-5 w-5" />,
  "/login": <User className="h-5 w-5" />,
};

export default function BottomNav({ navLinks }: { navLinks: NavLink[] }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-muted-foreground/10 group",
              pathname === link.href ? "text-primary" : "text-muted-foreground"
            )}
          >
            {iconMap[link.href]}
            <span className="text-xs">{link.label}</span>
          </Link>
        ))}
        <div className="inline-flex flex-col items-center justify-center px-5 text-muted-foreground hover:bg-muted-foreground/10 group">
           {mounted && (
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
               <span className="text-xs mt-8">Theme</span>
            </Button>
          )}
        </div>
        <Link
            href="/login"
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-muted-foreground/10 group",
              pathname === "/login" ? "text-primary" : "text-muted-foreground"
            )}
          >
            {iconMap['/login']}
            <span className="text-xs">Login</span>
          </Link>
      </div>
    </div>
  );
}
