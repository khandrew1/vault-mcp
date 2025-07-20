import type React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Key, Table } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "API Key Management Dashboard",
};

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-10 border-b bg-background">
          <div className="flex h-16 items-center justify-between py-4 w-full">
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="font-semibold">
                Vault MCP
              </Link>
            </div>
            <nav className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
            </nav>
          </div>
        </header>
        <div className="w-full items-start flex overflow-y-hidden">
          <div className="-ml-2 hidden overflow-y-auto border-r md:sticky md:block w-2/12">
            <div className="py-6 pr-6">
              <nav className="flex flex-col gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  asChild
                >
                  <Link href="/dashboard/keys">
                    <Key className="mr-2 h-4 w-4" />
                    API Keys
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  asChild
                >
                  <Link href="/dashboard/memories">
                    <Table className="mr-2 h-4 w-4" />
                    Memories
                  </Link>
                </Button>
                 <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                  asChild
                >
                  <Link href="/dashboard/context">
                    <Table className="mr-2 h-4 w-4" />
                    Context
                  </Link>
                </Button>
              </nav>
            </div>
          </div>
          <main className="flex w-10/12 flex-col overflow-hidden py-6 p-4">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
