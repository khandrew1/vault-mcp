"use client";
import { useState } from "react";
import { Copy, Eye, EyeOff, Key, Plus, Trash2 } from "lucide-react";

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
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "Production API Key",
      key: "sk_prod_2023_abcdefghijklmnopqrstuvwxyz123456",
      createdAt: new Date("2023-01-15"),
    },
    {
      id: "2",
      name: "Development API Key",
      key: "sk_dev_2023_zyxwvutsrqponmlkjihgfedcba654321",
      createdAt: new Date("2023-03-22"),
    },
    {
      id: "3",
      name: "Testing API Key",
      key: "sk_test_2023_123456abcdefghijklmnopqrstuvwxyz",
      createdAt: new Date("2023-06-10"),
    },
  ]);

  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [newKeyName, setNewKeyName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("Copied to clipboard", {
      description: "API key has been copied to clipboard",
    });
  };

  const createNewApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Error", {
        description: "Please provide a name for your API key",
      });
      return;
    }

    // Generate a random API key (in a real app, this would be done on the server)
    const randomKey = `sk_${Math.random().toString(36).substring(2, 15)}_${Math.random().toString(36).substring(2, 15)}`;

    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: newKeyName,
      key: randomKey,
      createdAt: new Date(),
    };

    setApiKeys([...apiKeys, newKey]);
    setNewKeyName("");
    setNewlyCreatedKey(randomKey);
    setIsDialogOpen(false);

    toast("API Key Created", {
      description: "Your new API key has been created successfully",
    });
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id));
    toast("API Key Deleted", {
      description: "The API key has been deleted successfully",
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">API Keys</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
        </Dialog>
      </div>

      {newlyCreatedKey && (
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
              <code className="text-sm font-mono">{newlyCreatedKey}</code>
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8"
                onClick={() => copyToClipboard(newlyCreatedKey)}
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy API key</span>
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => setNewlyCreatedKey(null)}
              className="w-full"
            >
              I've copied my API key
            </Button>
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
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
                          !visibleKeys[apiKey.id] && "filter blur-sm",
                        )}
                      >
                        {apiKey.key}
                      </code>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        {visibleKeys[apiKey.id] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {visibleKeys[apiKey.id] ? "Hide" : "Show"} API key
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
                  <TableCell>{apiKey.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/20"
                      onClick={() => deleteApiKey(apiKey.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete API key</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {apiKeys.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-muted-foreground"
                  >
                    No API keys found. Create your first API key to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
