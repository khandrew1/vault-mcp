"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Filter, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Item {
  user: string;
  project: string;
  content: string;
}

export default function DataTablePage() {
  const [searchTerm, setSearchTerm] = useState("");

  const [projects, setProjects] = useState([]);
  const [items, setItems] = useState([]);

  const onClick = async (category: string) => {
    const response = await fetch(`/api/context?p=${category}`, {
      method: "GET",
    });

    const data = await response.json();

    setItems(data);
  };

  useEffect(() => {
    const getProjects = async () => {
      const response = await fetch("/api/projects", {
        method: "GET",
      });

      const data = await response.json();

      console.log("DATA", data);

      setProjects(data);

      onClick(data[0]);
    };

    getProjects();
  }, []);

  const categories = projects;

  console.log("CAT", categories);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item | null;
    direction: "ascending" | "descending" | null;
  }>({
    key: null,
    direction: null,
  });

  const requestSort = (key: keyof Item) => {
    let direction: "ascending" | "descending" | null = "ascending";

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    } else if (
      sortConfig.key === key &&
      sortConfig.direction === "descending"
    ) {
      direction = null;
    }

    setSortConfig({ key, direction });
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  const createNewApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Error", {
        description: "Please provide a name for your API key",
      });
      return;
    }

    setNewKeyName("");
    setIsDialogOpen(false);

    toast("API Key Created", {
      description: "Your new API key has been created successfully",
    });
  };

  return (
    categories && items && (
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Context</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search data..."
                className="w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New API Key</DialogTitle>
                  <DialogDescription>
                    Enter a name for your new API key. You will only be able to
                    view the key once after creation.
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
                  <Button
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={createNewApiKey}>Create API Key</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardContent>
            <Tabs defaultValue={categories[0]}>
              <TabsList className="mb-4">
                {categories.map((category) => (
                  <TabsTrigger
                    onClick={() => onClick(category)}
                    key={category}
                    value={category}
                    className="capitalize"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category}>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Button
                            variant="ghost"
                            className="p-0 font-medium hover:bg-transparent"
                            onClick={() => requestSort("user")}
                          >
                            <span className="flex items-center">
                              User
                              {/* {getSortIcon("user")} */}
                            </span>
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            className="p-0 font-medium hover:bg-transparent"
                            onClick={() => requestSort("project")}
                          >
                            <span className="flex items-center">
                              Project
                            </span>
                          </Button>
                        </TableHead>
                        <TableHead>
                          <Button
                            variant="ghost"
                            className="p-0 font-medium hover:bg-transparent"
                            onClick={() => requestSort("content")}
                          >
                            <span className="flex items-center">
                              Content
                            </span>
                          </Button>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.length === 0 && (
                        <TableRow className="">
                          <TableCell>There are no current context</TableCell>
                        </TableRow>
                      )}
                      {items.map((item, index) => (
                        <TableRow key={`${category}-${index}`}>
                          <TableCell className="font-medium">
                            {item.name}
                          </TableCell>
                          <TableCell>{item.project}</TableCell>
                          <TableCell>{item.content}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    )
  );
}
