"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, LayoutDashboard, HeartPulse, Moon, Sun, User, Stethoscope, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

type NavLink = {
  href: string;
  label: string;
};

const iconMap: { [key: string]: React.ReactNode } = {
  "/": <Home className="h-5 w-5" />,
  "/dashboard": <LayoutDashboard className="h-5 w-5" />,
  "/symptom-checker": <Stethoscope className="h-5 w-5" />,
  "/awareness": <HeartPulse className="h-5 w-5" />,
  "/login": <User className="h-5 w-5" />,
};

export default function BottomNav({ navLinks }: { navLinks: NavLink[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const mainNavLinks = navLinks.filter(link => link.href !== '/login');


  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {mainNavLinks.map((link) => (
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
        
        {user ? (
            <div 
                onClick={handleLogout}
                className={cn("cursor-pointer inline-flex flex-col items-center justify-center px-5 hover:bg-muted-foreground/10 group text-muted-foreground")}
            >
                <LogOut className="h-5 w-5" />
                <span className="text-xs">Logout</span>
            </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
