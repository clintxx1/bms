"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, ChevronDown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/bms/page-header";
import { permissions, roles, users } from "@/lib/data";
import { cn } from "@/lib/utils";

type TabType = "users" | "roles" | "permissions";

interface DropdownState {
  type: "permissions" | "roles" | "users" | null;
  id: string | null;
}

interface Modal {
  type: "permission" | "role" | "user" | "rolePermissions" | "delete" | null;
  data?: any;
}

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [dropdown, setDropdown] = useState<DropdownState>({ type: null, id: null });
  const [modal, setModal] = useState<Modal>({ type: null });
  const [formData, setFormData] = useState({
    feature: "",
    action: "create",
    label: "",
    description: "",
    name: "",
    email: "",
    role: "",
  });
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleAddPermission = () => {
    setFormData({ feature: "", action: "create", label: "", description: "", name: "", email: "", role: "" });
    setModal({ type: "permission" });
  };

  const handleAddRole = () => {
    setFormData({ feature: "", action: "create", label: "", description: "", name: "", email: "", role: "" });
    setModal({ type: "role" });
  };

  const handleAddUser = () => {
    setFormData({ feature: "", action: "create", label: "", description: "", name: "", email: "", role: "" });
    setModal({ type: "user" });
  };

  const handleEditPermission = (perm: typeof permissions[0]) => {
    setFormData({
      feature: perm.code.split(":")[0],
      action: perm.code.split(":")[1],
      label: perm.label,
      description: perm.description,
      name: "",
      email: "",
      role: "",
    });
    setModal({ type: "permission" });
    setDropdown({ type: null, id: null });
  };

  const handleEditRole = (role: typeof roles[0]) => {
    setFormData({ feature: "", action: "create", label: "", description: "", name: role.name, email: "", role: "" });
    setSelectedPermissions(role.permissions);
    setModal({ type: "role" });
    setDropdown({ type: null, id: null });
  };

  const handleEditUser = (user: typeof users[0]) => {
    setFormData({
      feature: "",
      action: "create",
      label: "",
      description: "",
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setModal({ type: "user" });
    setDropdown({ type: null, id: null });
  };

  const handleRolePermissions = (role: typeof roles[0]) => {
    setFormData({ feature: "", action: "create", label: "", description: "", name: role.name, email: "", role: "" });
    setSelectedPermissions(role.permissions);
    setModal({ type: "rolePermissions", data: role });
    setDropdown({ type: null, id: null });
  };

  const handleDeleteConfirm = (item: any, type: "permission" | "role" | "user") => {
    setModal({ type: "delete", data: { item, itemType: type } });
    setDropdown({ type: null, id: null });
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId) ? prev.filter((id) => id !== permissionId) : [...prev, permissionId],
    );
  };

  return (
    <>
      <PageHeader
        title="User Management"
        subtitle="Manage users, roles, and permissions"
      />

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-1 border-b border-slate-200">
        {(["users", "roles", "permissions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px",
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Permissions Tab */}
      {activeTab === "permissions" && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">Permissions</h3>
            <Button size="sm" onClick={handleAddPermission}>
              <Plus className="h-4 w-4" />
              New Permission
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Code</TableHead>
                <TableHead>Label</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {permissions.map((perm) => (
                <TableRow key={perm.id}>
                  <TableCell className="font-mono text-sm font-medium text-slate-700">
                    {perm.code}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">
                    {perm.label}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {perm.description}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="relative inline-block">
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => setDropdown({ type: "permissions", id: perm.id })}
                        title="More actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      {dropdown.type === "permissions" && dropdown.id === perm.id && (
                        <div className="absolute right-0 mt-1 w-40 rounded-lg border border-slate-200 bg-white shadow-lg z-10">
                          <button
                            onClick={() => handleEditPermission(perm)}
                            className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(perm, "permission")}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
            <span>1-10 of 50 items</span>
          </div>
        </Card>
      )}

      {/* Roles Tab */}
      {activeTab === "roles" && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">Roles</h3>
            <Button size="sm" onClick={handleAddRole}>
              <Plus className="h-4 w-4" />
              New Role
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead className="text-right">Users</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-medium text-slate-900">
                    {role.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions.map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                      {role.permissions.length > 0 && (
                        <span className="ml-2 text-xs text-slate-500">
                          {role.permissions.length > 3 ? `+${role.permissions.length - 3}` : ""}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-slate-900">
                    {role.users}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="relative inline-block">
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => setDropdown({ type: "roles", id: role.id })}
                        title="More actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      {dropdown.type === "roles" && dropdown.id === role.id && (
                        <div className="absolute right-0 mt-1 w-40 rounded-lg border border-slate-200 bg-white shadow-lg z-10">
                          <button
                            onClick={() => handleRolePermissions(role)}
                            className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            Permissions
                          </button>
                          <button
                            onClick={() => handleEditRole(role)}
                            className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(role, "role")}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">Users</h3>
            <Button size="sm" onClick={handleAddUser}>
              <Plus className="h-4 w-4" />
              New User
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-slate-900">
                    {user.name}
                  </TableCell>
                  <TableCell className="text-slate-600">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="green">active</Badge>
                  </TableCell>
                  <TableCell className="text-slate-700">{user.role}</TableCell>
                  <TableCell className="text-right">
                    <div className="relative inline-block">
                      <Button
                        variant="ghost"
                        size="iconSm"
                        onClick={() => setDropdown({ type: "users", id: user.id })}
                        title="More actions"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                      {dropdown.type === "users" && dropdown.id === user.id && (
                        <div className="absolute right-0 mt-1 w-40 rounded-lg border border-slate-200 bg-white shadow-lg z-10">
                          <button
                            onClick={() => handleEditUser(user)}
                            className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteConfirm(user, "user")}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* New Permission Modal */}
      {modal.type === "permission" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">New permission</h2>
              <button onClick={() => setModal({ type: null })} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">
                  Feature
                </label>
                <input
                  type="text"
                  placeholder="e.g. user"
                  value={formData.feature}
                  onChange={(e) => setFormData({ ...formData, feature: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">
                  Action
                </label>
                <select
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="create">create</option>
                  <option value="read">read</option>
                  <option value="update">update</option>
                  <option value="delete">delete</option>
                  <option value="view">view</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">
                  Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. View users"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="What this permission allows..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6 justify-end">
              <Button
                variant="outline"
                onClick={() => setModal({ type: null })}
              >
                Cancel
              </Button>
              <Button onClick={() => setModal({ type: null })}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New Role Modal */}
      {modal.type === "role" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">New role</h2>
              <button onClick={() => setModal({ type: null })} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Project Manager"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6 justify-end">
              <Button
                variant="outline"
                onClick={() => setModal({ type: null })}
              >
                Cancel
              </Button>
              <Button onClick={() => setModal({ type: null })}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Role Permissions Modal */}
      {modal.type === "rolePermissions" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Permissions for {modal.data?.name}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Toggle the permissions this role grants.
                </p>
              </div>
              <button onClick={() => setModal({ type: null })} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-3 my-6">
              {/* Group permissions by feature */}
              {["admin", "contract", "contractor"].map((feature) => {
                const featurePerms = permissions.filter((p) =>
                  p.code.startsWith(feature),
                );
                if (featurePerms.length === 0) return null;

                return (
                  <div key={feature} className="border-b border-slate-100 pb-4 last:border-0">
                    <p className="text-sm font-semibold text-slate-900 mb-3 capitalize">
                      {feature === "admin" ? "Admin" : feature.charAt(0).toUpperCase() + feature.slice(1)}
                    </p>
                    {featurePerms.map((perm) => (
                      <label
                        key={perm.id}
                        className="flex items-start gap-3 py-2.5 cursor-pointer hover:bg-slate-50 px-2 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={() => togglePermission(perm.id)}
                          className="mt-1 h-4 w-4 rounded border-slate-300"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{perm.label}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{perm.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-2 justify-end border-t border-slate-100 pt-4">
              <Button
                variant="outline"
                onClick={() => setModal({ type: null })}
              >
                Cancel
              </Button>
              <Button onClick={() => setModal({ type: null })}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* New User Modal */}
      {modal.type === "user" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">New user</h2>
              <button onClick={() => setModal({ type: null })} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>

            <p className="text-sm text-slate-500 mb-4">
              A password will be auto-generated and shown once. Make sure to copy it.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Franz Paradela"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Franz@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 mb-1.5">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-2 mt-6 justify-end">
              <Button
                variant="outline"
                onClick={() => setModal({ type: null })}
              >
                Cancel
              </Button>
              <Button onClick={() => setModal({ type: null })}>
                Create
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {modal.type === "delete" && modal.data && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-sm w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Delete confirmation</h2>
              <button onClick={() => setModal({ type: null })} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this {modal.data.itemType}? This action cannot be undone.
            </p>

            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setModal({ type: null })}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => setModal({ type: null })}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
