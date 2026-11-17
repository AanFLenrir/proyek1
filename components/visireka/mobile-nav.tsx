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
    { href: "/inspeksi", label: "Inspeksi AI", icon: FiCamera, highlight: true },
    { href: "/estimasi", label: "Estimasi", icon: FiTrendingUp },
    { href: "/kebun", label: "Kebun", icon: FiMapPin },
    { href: "/riwayat", label: "Riwayat", icon: FiClock },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border px-3 py-2 flex items-center justify-around shadow-lg">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;

        if (link.highlight) {
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex flex-col items-center -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40 border-4 border-background">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {link.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition ${
              isActive
                ? "text-emerald-600 dark:text-emerald-400 font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
