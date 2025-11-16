"use client";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Loader2, Trash2, Pencil, Plus, UserCheck } from "lucide-react";
import UserDialog from "./UserDialog";
import {
  fetchUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  assignRoleApi,
} from "@/services/network";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface User {
  _id: string;
  email?: string;
  phone?: string;
  name?: string;
  avatar?: string;
  role?: { _id: string; name: string } | string;
  isActive: boolean;
  isProfileCompleted: boolean;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("");
  const [isActive, setIsActive] = useState("");
  const [isProfileCompleted, setIsProfileCompleted] = useState("");
  const [roles, setRoles] = useState<{ _id: string; name: string }[]>([]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (role) params.append("role", role);
      if (isActive) params.append("isActive", isActive);
      if (isProfileCompleted)
        params.append("isProfileCompleted", isProfileCompleted);
      const data = await fetchUsersApi("?" + params.toString());
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError("Failed to fetch users.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, [page, limit, debouncedSearch, role, isActive, isProfileCompleted]);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch roles for filter dropdown
  useEffect(() => {
    (async () => {
      try {
        const data = await import("@/services/network").then((m) =>
          m.fetchRolesApi()
        );
        setRoles(data.roles || []);
      } catch {
        setRoles([]);
      }
    })();
  }, []);

  const openCreateDialog = () => {
    setEditingUser(null);
    setDialogOpen(true);
  };

  const openEditDialog = (user: any) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUserApi(id);
      fetchUsers();
    } catch {
      setError("Failed to delete user.");
    }
  };

  // Assign role handler (can be used in dialog or inline)
  const handleAssignRole = async (id: string, roleId: string) => {
    try {
      await assignRoleApi(id, roleId);
      fetchUsers();
    } catch {
      setError("Failed to assign role.");
    }
  };

  // Pagination controls
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <>
      {/* DIALOG */}
      <UserDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        editingUser={editingUser}
        onSuccess={fetchUsers}
        createUserApi={createUserApi}
        updateUserApi={updateUserApi}
        assignRoleApi={assignRoleApi}
      />

      <Card className="w-full border-0 h-full">
        <CardHeader className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <CardTitle className="text-2xl font-bold">User Management</CardTitle>
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              placeholder="Search name, email, phone"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border rounded px-2 py-1 text-sm"
            />
            {/* Combined Filter Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Filters</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>User Filters</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-6 py-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="block text-xs font-semibold mb-1 text-gray-700">Role</label>
                      <select
                        value={role}
                        onChange={e => { setRole(e.target.value); setPage(1); }}
                        className="border rounded px-2 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Roles</option>
                        {roles.map(r => (
                          <option key={r._id} value={r._id}>{r.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="block text-xs font-semibold mb-1 text-gray-700">Active Status</label>
                      <select
                        value={isActive}
                        onChange={e => { setIsActive(e.target.value); setPage(1); }}
                        className="border rounded px-2 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Active?</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="block text-xs font-semibold mb-1 text-gray-700">Profile Completed</label>
                      <select
                        value={isProfileCompleted}
                        onChange={e => { setIsProfileCompleted(e.target.value); setPage(1); }}
                        className="border rounded px-2 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Profile?</option>
                        <option value="true">Completed</option>
                        <option value="false">Incomplete</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="block text-xs font-semibold mb-1 text-gray-700">Users Per Page</label>
                      <select
                        value={limit}
                        onChange={e => { setLimit(Number(e.target.value)); setPage(1); }}
                        className="border rounded px-2 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {[10, 20, 50, 100].map(l => (
                          <option key={l} value={l}>{l} / page</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4 gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setRole("");
                        setIsActive("");
                        setIsProfileCompleted("");
                        setLimit(20);
                        setPage(1);
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" /> Create User
            </Button>
          </div>
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
            <>
              <div className="overflow-x-auto border rounded-lg">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2">Name</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Phone</th>
                      <th className="p-2">Role</th>
                      <th className="p-2">Active</th>
                      <th className="p-2">Profile Completed</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-2 font-mono">{user.name || "-"}</td>
                        <td className="p-2">{user.email || "-"}</td>
                        <td className="p-2">{user.phone || "-"}</td>
                        <td className="p-2 text-xs text-gray-700">
                          {user.role && typeof user.role === "object"
                            ? user.role.name
                            : user.role || "-"}
                        </td>
                        <td className="p-2 text-xs font-semibold">
                          <span
                            className={
                              user.isActive ? "text-green-600" : "text-red-600"
                            }
                          >
                            {user.isActive ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="p-2 text-xs font-semibold">
                          <span
                            className={
                              user.isProfileCompleted
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {user.isProfileCompleted ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="p-2 flex gap-3">
                          <Button
                            size="icon"
                            variant="secondary"
                            onClick={() => openEditDialog(user)}
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            onClick={() => handleDelete(user._id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center text-gray-500 py-10"
                        >
                          No users found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handlePrevPage}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
