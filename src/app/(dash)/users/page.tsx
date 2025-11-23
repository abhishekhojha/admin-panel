"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Trash2,
  Pencil,
  Plus,
  Search,
  MoreHorizontal,
  Shield,
  CheckCircle2,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import UserDialog from "./UserDialog";
import {
  fetchUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  assignRoleApi,
  fetchRolesApi,
} from "@/services/network";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const [role, setRole] = useState("all");
  const [isActive, setIsActive] = useState("all");
  const [isProfileCompleted, setIsProfileCompleted] = useState("all");
  const [roles, setRoles] = useState<{ _id: string; name: string }[]>([]);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (role && role !== "all") params.append("role", role);
      if (isActive && isActive !== "all") params.append("isActive", isActive);
      if (isProfileCompleted && isProfileCompleted !== "all")
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
        const data = await fetchRolesApi();
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

  // Pagination controls
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  const resetFilters = () => {
    setRole("all");
    setIsActive("all");
    setIsProfileCompleted("all");
    setLimit(20);
    setPage(1);
    setSearch("");
  };

  return (
    <>
      <UserDialog
        open={dialogOpen}
        setOpen={setDialogOpen}
        editingUser={editingUser}
        onSuccess={fetchUsers}
        createUserApi={createUserApi}
        updateUserApi={updateUserApi}
        assignRoleApi={assignRoleApi}
      />

      <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage user access, roles, and profiles.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="shadow-lg">
            <Plus className="mr-2 h-4 w-4" /> Add New User
          </Button>
        </div>

        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-9 bg-background"
                />
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                {/* Mobile Filter Sheet */}
                <div className="md:hidden w-full">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full">
                        <Filter className="mr-2 h-4 w-4" /> Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                        <SheetDescription>
                          Refine your user list
                        </SheetDescription>
                      </SheetHeader>
                      <div className="flex flex-col gap-4 mt-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Role</label>
                          <Select
                            value={role}
                            onValueChange={(val) => {
                              setRole(val);
                              setPage(1);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All Roles" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Roles</SelectItem>
                              {roles.map((r) => (
                                <SelectItem key={r._id} value={r._id}>
                                  {r.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Status</label>
                          <Select
                            value={isActive}
                            onValueChange={(val) => {
                              setIsActive(val);
                              setPage(1);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="All Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="true">Active</SelectItem>
                              <SelectItem value="false">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          variant="secondary"
                          onClick={resetFilters}
                          className="mt-4"
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Desktop Filters */}
                <div className="hidden md:flex gap-2 items-center">
                  <Select
                    value={role}
                    onValueChange={(val) => {
                      setRole(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[150px] bg-background">
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map((r) => (
                        <SelectItem key={r._id} value={r._id}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={isActive}
                    onValueChange={(val) => {
                      setIsActive(val);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="w-[140px] bg-background">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  {(role !== "all" ||
                    isActive !== "all" ||
                    isProfileCompleted !== "all" ||
                    search) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={resetFilters}
                      title="Reset Filters"
                    >
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert className="mb-4" variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="rounded-md border bg-background">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        User
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Contact
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Role
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Profile
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="h-24 text-center">
                          <div className="flex justify-center items-center">
                            <Loader2 className="animate-spin h-6 w-6 text-primary" />
                          </div>
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No users found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr
                          key={user._id}
                          className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage
                                  src={user.avatar}
                                  className="object-cover"
                                />
                                <AvatarFallback>
                                  {user.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {user.name || "Unknown"}
                                </span>
                                <span className="text-xs text-muted-foreground md:hidden">
                                  {user.email}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm">
                                {user.email || "-"}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {user.phone || "-"}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                              <Shield className="mr-1 h-3 w-3" />
                              {user.role && typeof user.role === "object"
                                ? user.role.name
                                : "No Role"}
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${
                                user.isActive
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                            >
                              {user.isActive ? "Active" : "Inactive"}
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-2">
                              {user.isProfileCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="text-xs text-muted-foreground">
                                {user.isProfileCompleted
                                  ? "Completed"
                                  : "Pending"}
                              </span>
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
                                  onClick={() => openEditDialog(user)}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => handleDelete(user._id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
