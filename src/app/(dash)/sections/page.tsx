"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Trash2,
  Pencil,
  Plus,
  MoreHorizontal,
  Link as LinkIcon,
  List,
} from "lucide-react";
import SectionDialog from "./SectionDialog";
import {
  fetchSectionsApi,
  createSectionApi,
  deleteSectionApi,
} from "@/services/network";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Section {
  _id: string;
  title: string;
  slug: string;
  isActive: boolean;
  displayOrder: number;
  products: any[];
}

export default function SectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchSections = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSectionsApi();
      setSections(data || []);
    } catch (err) {
      setError("Failed to fetch sections.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openCreateDialog = () => {
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    try {
      await deleteSectionApi(id);
      fetchSections();
    } catch {
      setError("Failed to delete section.");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sections</h1>
          <p className="text-muted-foreground">
            Manage product sections like Featured, Popular, etc.
          </p>
        </div>
        <Button onClick={openCreateDialog} className="shadow-lg">
          <Plus className="mr-2 h-4 w-4" /> Create Section
        </Button>
      </div>

      <SectionDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        onSuccess={fetchSections}
        createSectionApi={createSectionApi}
      />

      <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>All Sections</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : (
            <div className="rounded-md border bg-background">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Title
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Slug
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Order
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Products
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {sections.map((section) => (
                      <tr
                        key={section._id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg border bg-muted">
                              <List className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <span className="font-medium">{section.title}</span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex items-center text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded w-fit">
                            <LinkIcon className="mr-1 h-3 w-3" />
                            {section.slug}
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          {section.displayOrder}
                        </td>
                        <td className="p-4 align-middle">
                          <Badge variant="outline">
                            {section.products?.length || 0} Products
                          </Badge>
                        </td>
                        <td className="p-4 align-middle">
                          <div
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${
                              section.isActive
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                            }`}
                          >
                            {section.isActive ? "Active" : "Inactive"}
                          </div>
                        </td>
                        <td className="p-4 align-middle text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/sections/${section._id}`}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit Section
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(section._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Section
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {sections.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No sections found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
