"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiCamera,
  FiTrendingUp,
  FiClock,
  FiMapPin,
} from "react-icons/fi";

export function VisirekaMobileNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Dashboard", icon: FiGrid },
    { href: "/kebun", label: "Kebun", icon: FiMapPin },
    { href: "/inspeksi", label: "Scanner AI", icon: FiCamera, highlight: true },
    { href: "/estimasi", label: "Estimasi", icon: FiTrendingUp },
    { href: "/riwayat", label: "Riwayat", icon: FiClock },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-lg border-t border-border/80 px-2 sm:px-4 py-1.5 flex items-center justify-around shadow-2xl safe-area-pb">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        if (link.highlight) {
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center -mt-6 group focus:outline-none"
            >
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg transition-transform active:scale-95 border-4 border-background ${
                  isActive
                    ? "bg-gradient-to-tr from-emerald-700 to-emerald-500 shadow-emerald-600/50 scale-105"
                    : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/40"
                }`}
              >
                <Icon className="w-6 h-6 animate-pulse" />
              </div>
              <span
                className={`text-[10px] font-extrabold mt-1 tracking-tight ${
                  isActive
                    ? "text-emerald-600 dark:text-emerald-400 font-black"
                    : "text-muted-foreground group-hover:text-emerald-600"
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[10px] font-semibold transition-all ${
              isActive
                ? "text-emerald-600 dark:text-emerald-400 font-extrabold"
                : "text-muted-foreground hover:text-foreground active:scale-95"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-emerald-600 dark:text-emerald-400" : ""}`} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
