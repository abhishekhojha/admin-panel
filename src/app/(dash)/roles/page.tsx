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
  Shield,
  MoreHorizontal,
  CheckCircle2,
} from "lucide-react";
import {
  fetchRolesApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
} from "@/services/network";
import RoleDialog from "./RoleDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface Role {
  _id: string;
  name: string;
  description: string;
  permissions?: string[];
}

export default function RolePage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);

  const fetchRoles = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchRolesApi();
      setRoles(data.roles || []);
    } catch (err) {
      setError("Failed to fetch roles.");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const openCreateDialog = () => {
    setEditingRole(null);
    setDialogOpen(true);
  };

  const openEditDialog = (role: any) => {
    setEditingRole(role);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await deleteRoleApi(id);
      fetchRoles();
    } catch {
      setError("Failed to delete role.");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Roles & Permissions
          </h1>
          <p className="text-muted-foreground">
            Manage user roles and access control.
          </p>
        </div>
        <Button onClick={openCreateDialog} className="shadow-lg">
          <Plus className="mr-2 h-4 w-4" /> Create New Role
        </Button>
      </div>

      <RoleDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        editingRole={editingRole}
        onSuccess={fetchRoles}
        createRoleApi={createRoleApi}
        updateRoleApi={updateRoleApi}
      />

      <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>All Roles</CardTitle>
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
                        Role Name
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Description
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Permissions
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {roles.map((role) => (
                      <tr
                        key={role._id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-2 font-medium">
                            <Shield className="h-4 w-4 text-primary" />
                            {role.name}
                          </div>
                        </td>
                        <td className="p-4 align-middle text-muted-foreground">
                          {role.description || "-"}
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-wrap gap-1">
                            {role.permissions && role.permissions.length > 0 ? (
                              role.permissions.slice(0, 3).map((perm) => (
                                <Badge
                                  key={perm}
                                  variant="secondary"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {perm}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                No permissions
                              </span>
                            )}
                            {role.permissions &&
                              role.permissions.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  +{role.permissions.length - 3} more
                                </Badge>
                              )}
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
                              <DropdownMenuItem
                                onClick={() => openEditDialog(role)}
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit Role
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDelete(role._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Role
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}

                    {roles.length === 0 && (
                      <tr>
                        <td
                          colSpan={4}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No roles found
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
