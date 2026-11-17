"use client";

import { useState, ReactNode } from "react";
import { VisirekaSidebar } from "./sidebar";
import { VisirekaHeader } from "./header";
import { VisirekaMobileNav } from "./mobile-nav";
import { UserRole } from "@/lib/visireka-store";

interface AppShellProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function VisirekaAppShell({ children, title, subtitle }: AppShellProps) {
  const [currentRole, setCurrentRole] = useState<UserRole>("qc_inspector");

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased selection:bg-emerald-500/20 selection:text-emerald-700">
      {/* Desktop Sidebar */}
      <VisirekaSidebar currentRole={currentRole} onRoleChange={setCurrentRole} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <VisirekaHeader currentRole={currentRole} title={title} subtitle={subtitle} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <VisirekaMobileNav />
    </div>
  );
}
