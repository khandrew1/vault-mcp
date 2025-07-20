import type { Metadata } from "next";
import Link from "next/link";
import { Key, Table } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "API Key Management Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>API Keys</CardTitle>
            <CardDescription>Manage your API keys</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Create, view, and delete API keys for accessing our services.
            </p>
            <Button asChild>
              <Link href="/dashboard/keys">
                <Key className="mr-2 h-4 w-4" />
                Manage API Keys
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>View and manage your data</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Access and analyze your project data in a structured format.
            </p>
            <Button asChild>
              <Link href="/dashboard/memories">
                <Table className="mr-2 h-4 w-4" />
                View Memories
              </Link>
            </Button>
             <Button asChild>
              <Link href="/dashboard/context">
                <Table className="mr-2 h-4 w-4" />
                View Context
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
