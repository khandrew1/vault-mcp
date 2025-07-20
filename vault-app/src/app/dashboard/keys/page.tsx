"use client";
import { useState } from "react";
import { Copy, Eye, EyeOff, Key, Plus, Trash2 } from "lucide-react";
import { useAuth, useUser } from "@clerk/clerk-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
}

export default function ApiKeysPage() {
  const [visible, setVisible] = useState<boolean>(true);

  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return null;

  if (!isSignedIn) return null;

  console.log(user);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard", {
      description: "API key has been copied to clipboard",
    });
  };

  const { primaryEmailAddressId, createdAt } = user;

  const keys = [
    {
      id: "2",
      name: "Production API Key",
      key: primaryEmailAddressId,
      createdAt: createdAt,
    },
  ];

  const FIVE_MINUTES = 5 * 60 * 1000;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">API Keys</h1>
        {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create New API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Enter a name for your new API key. You will only be able to view
                the key once after creation.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">API Key Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Production API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={createNewApiKey}>Create API Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}
      </div>

      {Date.now() - createdAt.getTime() <= FIVE_MINUTES && (
        <Card className="border-green-500 bg-green-50 dark:bg-green-950/20">
          <CardHeader>
            <CardTitle className="text-green-700 dark:text-green-400">
              New API Key Created
            </CardTitle>
            <CardDescription>
              Make sure to copy your API key now. You won't be able to see it
              again!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 rounded-md bg-green-100 p-3 dark:bg-green-900/30">
              <code className="text-sm font-mono">{primaryEmailAddressId}</code>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => copyToClipboard(primaryEmailAddressId)}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy API key</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            {/* <Button
              variant="outline"
              onClick={() => setNewlyCreatedKey(null)}
              className="w-full"
            >
              I've copied my API key
            </Button> */}
          </CardFooter>
        </Card>
      )}

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.map((apiKey) => (
                <TableRow key={apiKey.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Key className="h-4 w-4 text-muted-foreground" />
                      {apiKey.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code
                        className={cn(
                          "font-mono text-xs",
                          visible && "filter blur-sm",
                        )}
                      >
                        {apiKey.key}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => setVisible(!visible)}
                      >
                        {visible ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {visible ? "Hide" : "Show"} API key
                        </span>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => copyToClipboard(apiKey.key)}
                      >
                        <Copy className="h-4 w-4" />
                        <span className="sr-only">Copy API key</span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {apiKey.createdAt.toLocaleString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: true,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
