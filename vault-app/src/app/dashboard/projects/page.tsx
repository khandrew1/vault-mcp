"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Filter, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface Item {
  user: string
  project: string
  content: string
}

type Data = Record<string, Item[]>

export default function DataTablePage() {
  const [searchTerm, setSearchTerm] = useState("")

  // Sample data structure as per the interface
  const data: Data = {
    analytics: [
      { user: "john_doe", project: "Website Redesign", content: "User behavior analysis" },
      { user: "jane_smith", project: "Mobile App", content: "Conversion tracking setup" },
      { user: "alex_wong", project: "E-commerce Platform", content: "Sales funnel optimization" },
    ],
    development: [
      { user: "sarah_dev", project: "API Integration", content: "Authentication module" },
      { user: "mike_coder", project: "CRM System", content: "Database schema design" },
      { user: "lisa_engineer", project: "Payment Gateway", content: "Transaction processing" },
      { user: "tom_architect", project: "Cloud Migration", content: "Infrastructure setup" },
    ],
    marketing: [
      { user: "emma_marketer", project: "Product Launch", content: "Email campaign" },
      { user: "david_seo", project: "Content Strategy", content: "Keyword research" },
      { user: "olivia_social", project: "Brand Awareness", content: "Social media calendar" },
    ],
    design: [
      { user: "ryan_ui", project: "Mobile App", content: "UI component library" },
      { user: "natalie_ux", project: "Website Redesign", content: "User testing results" },
      { user: "chris_graphic", project: "Brand Refresh", content: "Logo variations" },
      { user: "zoe_product", project: "Dashboard", content: "Wireframes v2" },
    ],
  }

  const categories = Object.keys(data)

  const filterItems = (items: Item[]) => {
    if (!searchTerm) return items

    return items.filter(
      (item) =>
        item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item | null
    direction: "ascending" | "descending" | null
  }>({
    key: null,
    direction: null,
  })

  const requestSort = (key: keyof Item) => {
    let direction: "ascending" | "descending" | null = "ascending"

    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    } else if (sortConfig.key === key && sortConfig.direction === "descending") {
      direction = null
    }

    setSortConfig({ key, direction })
  }

  const getSortedItems = (items: Item[]) => {
    const filteredItems = filterItems(items)

    if (!sortConfig.key || !sortConfig.direction) return filteredItems

    return [...filteredItems].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key!] > b[sortConfig.key!]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  const getSortIcon = (key: keyof Item) => {
    if (sortConfig.key !== key) return null

    if (sortConfig.direction === "ascending") {
      return <ChevronUp className="ml-1 h-4 w-4" />
    }

    if (sortConfig.direction === "descending") {
      return <ChevronDown className="ml-1 h-4 w-4" />
    }

    return null
  }

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newKeyName, setNewKeyName] = useState("")

   const createNewApiKey = () => {
    if (!newKeyName.trim()) {
      toast.error("Error", {
        description: "Please provide a name for your API key",
      })
      return
    }

    setNewKeyName("")
    setIsDialogOpen(false)

    toast("API Key Created", {
      description: "Your new API key has been created successfully",
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
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
                Enter a name for your new API key. You will only be able to view the key once after creation.
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

      </div>

      <Card>
        <CardContent>
          <Tabs defaultValue={categories[0]}>
            <TabsList className="mb-4">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
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
                            {getSortIcon("user")}
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
                            {getSortIcon("project")}
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
                            {getSortIcon("content")}
                          </span>
                        </Button>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getSortedItems(data[category]).map((item, index) => (
                      <TableRow key={`${category}-${index}`}>
                        <TableCell className="font-medium">{item.user}</TableCell>
                        <TableCell>{item.project}</TableCell>
                        <TableCell>{item.content}</TableCell>
                      </TableRow>
                    ))}
                    {filterItems(data[category]).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-6 text-muted-foreground">
                          No matching data found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
