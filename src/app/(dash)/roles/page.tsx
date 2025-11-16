"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2, Pencil, Plus } from "lucide-react";
import {
  fetchRolesApi,
  createRoleApi,
  updateRoleApi,
  deleteRoleApi,
} from "@/services/network";

import RoleDialog from "./RoleDialog";

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
    console.log("Editing role data:", role);
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
  const successFunction = () => {
    fetchRoles();

  }

  return (
    <>
      {/* DIALOG */}
      <RoleDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        editingRole={editingRole}
        onSuccess={successFunction}
        createRoleApi={createRoleApi}
        updateRoleApi={updateRoleApi}
      />

      <Card className="w-full border-0 h-full">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Role Management</CardTitle>

          <Button onClick={openCreateDialog}>
            <Plus className="mr-2 h-4 w-4" /> Create Role
          </Button>
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
              <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Name</th>
                    <th className="p-2">Description</th>
                    {/* <th className="p-2">Permissions</th> */}
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr
                      key={role._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="p-2 font-mono">{role.name}</td>
                      <td className="p-2"><p className="line-clamp-1">{role.description}</p></td>
                      {/* <td className="p-2 text-xs text-gray-700">
                        {role.permissions?.join(", ")}
                      </td> */}

                      <td className="p-2 flex gap-3">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => openEditDialog(role)}
                        >
                          <Pencil size={16} />
                        </Button>

                        <Button
                          size="icon"
                          variant="destructive"
                          onClick={() => handleDelete(role._id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {roles.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="text-center text-gray-500 py-10"
                      >
                        No roles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
