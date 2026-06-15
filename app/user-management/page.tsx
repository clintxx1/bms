"use client";

import { useEffect, useState } from "react";
import { Plus, MoreHorizontal, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PageHeader } from "@/components/bms/page-header";
import {
  permissions,
  roles,
  users,
  type Permission,
  type Role,
  type User,
} from "@/lib/data";
import { cn } from "@/lib/utils";

type TabType = "users" | "roles" | "permissions";
type DropKind = "users" | "roles" | "permissions";

type ModalState = {
  type: "permission" | "role" | "user" | "rolePermissions" | "delete" | null;
  mode?: "new" | "edit";
  role?: Role;
  del?: { itemType: "permission" | "role" | "user"; label: string };
};

const MAX_BADGES = 3;
const inputClass =
  "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
const emptyForm = {
  feature: "",
  action: "create",
  label: "",
  description: "",
  name: "",
  email: "",
  role: "",
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-900">{label}</label>
      {children}
    </div>
  );
}

function TableFooter({ count, noun }: { count: number; noun: string }) {
  return (
    <div className="border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
      {count} {noun}
      {count === 1 ? "" : "s"}
    </div>
  );
}

function RowActions({
  open,
  onToggle,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative inline-block text-left" data-dropdown-root>
      <Button variant="ghost" size="iconSm" onClick={onToggle} title="More actions">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          {children}
        </div>
      )}
    </div>
  );
}

function MenuItem({
  onClick,
  danger,
  children,
}: {
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "block w-full px-4 py-2 text-left text-sm transition-colors",
        danger ? "text-red-600 hover:bg-red-50" : "text-slate-700 hover:bg-slate-50",
      )}
    >
      {children}
    </button>
  );
}

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [drop, setDrop] = useState<{ kind: DropKind | null; id: string | null }>({
    kind: null,
    id: null,
  });
  const [modal, setModal] = useState<ModalState>({ type: null });
  const [form, setForm] = useState(emptyForm);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Close any open dropdown on outside-click or Escape.
  useEffect(() => {
    if (!drop.kind) return;
    const onDown = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest("[data-dropdown-root]")) {
        setDrop({ kind: null, id: null });
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrop({ kind: null, id: null });
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [drop.kind]);

  const toggleDrop = (kind: DropKind, id: string) =>
    setDrop((d) => (d.kind === kind && d.id === id ? { kind: null, id: null } : { kind, id }));
  const closeDrop = () => setDrop({ kind: null, id: null });
  const closeModal = () => setModal({ type: null });

  const openNewPermission = () => {
    setForm(emptyForm);
    setModal({ type: "permission", mode: "new" });
  };
  const openNewRole = () => {
    setForm(emptyForm);
    setSelectedPermissions([]);
    setModal({ type: "role", mode: "new" });
  };
  const openNewUser = () => {
    setForm(emptyForm);
    setModal({ type: "user", mode: "new" });
  };

  const editPermission = (p: Permission) => {
    const [feature, action] = p.code.split(":");
    setForm({ ...emptyForm, feature, action, label: p.label, description: p.description });
    setModal({ type: "permission", mode: "edit" });
    closeDrop();
  };
  const editRole = (r: Role) => {
    setForm({ ...emptyForm, name: r.name });
    setSelectedPermissions(r.permissions);
    setModal({ type: "role", mode: "edit" });
    closeDrop();
  };
  const editUser = (u: User) => {
    setForm({ ...emptyForm, name: u.name, email: u.email, role: u.role });
    setModal({ type: "user", mode: "edit" });
    closeDrop();
  };
  const openRolePermissions = (r: Role) => {
    setSelectedPermissions(r.permissions);
    setModal({ type: "rolePermissions", role: r });
    closeDrop();
  };
  const confirmDelete = (itemType: "permission" | "role" | "user", label: string) => {
    setModal({ type: "delete", del: { itemType, label } });
    closeDrop();
  };

  const togglePermission = (code: string) =>
    setSelectedPermissions((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );

  // Feature groups derived from the data (no hardcoding, no prefix collisions).
  const features = Array.from(new Set(permissions.map((p) => p.code.split(":")[0])));

  return (
    <>
      <PageHeader title="User Management" subtitle="Manage users, roles, and permissions" />

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-1 border-b border-slate-200">
        {(["users", "roles", "permissions"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "-mb-px border-b-2 px-4 py-3 text-sm font-medium capitalize transition-colors",
              activeTab === tab
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Users */}
      {activeTab === "users" && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">Users</h3>
            <Button size="sm" onClick={openNewUser}>
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
              {users.map((user) => {
                const role = roles.find((r) => r.id === user.role);
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium text-slate-900">{user.name}</TableCell>
                    <TableCell className="text-slate-600">{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "active" ? "green" : "secondary"}
                        className="capitalize"
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-700">{role?.name ?? user.role}</TableCell>
                    <TableCell className="text-right">
                      <RowActions
                        open={drop.kind === "users" && drop.id === user.id}
                        onToggle={() => toggleDrop("users", user.id)}
                      >
                        <MenuItem onClick={() => editUser(user)}>Edit</MenuItem>
                        <MenuItem danger onClick={() => confirmDelete("user", user.name)}>
                          Delete
                        </MenuItem>
                      </RowActions>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TableFooter count={users.length} noun="user" />
        </Card>
      )}

      {/* Roles */}
      {activeTab === "roles" && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">Roles</h3>
            <Button size="sm" onClick={openNewRole}>
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
              {roles.map((role) => {
                const shown = role.permissions.slice(0, MAX_BADGES);
                const extra = role.permissions.length - shown.length;
                return (
                  <TableRow key={role.id}>
                    <TableCell className="font-medium text-slate-900">
                      <span className="inline-flex items-center gap-1.5">
                        {role.name}
                        {role.system && (
                          <Lock className="h-3.5 w-3.5 text-slate-400" aria-label="System role" />
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      {role.permissions.length === 0 ? (
                        <span className="text-slate-400">—</span>
                      ) : (
                        <div className="flex flex-wrap items-center gap-1">
                          {shown.map((code) => (
                            <Badge key={code} variant="secondary">
                              {code}
                            </Badge>
                          ))}
                          {extra > 0 && (
                            <Badge variant="secondary" className="text-slate-500">
                              +{extra}
                            </Badge>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-900">
                      {role.users}
                    </TableCell>
                    <TableCell className="text-right">
                      <RowActions
                        open={drop.kind === "roles" && drop.id === role.id}
                        onToggle={() => toggleDrop("roles", role.id)}
                      >
                        <MenuItem onClick={() => openRolePermissions(role)}>Permissions</MenuItem>
                        <MenuItem onClick={() => editRole(role)}>Edit</MenuItem>
                        {!role.system && (
                          <MenuItem danger onClick={() => confirmDelete("role", role.name)}>
                            Delete
                          </MenuItem>
                        )}
                      </RowActions>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TableFooter count={roles.length} noun="role" />
        </Card>
      )}

      {/* Permissions */}
      {activeTab === "permissions" && (
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-900">Permissions</h3>
            <Button size="sm" onClick={openNewPermission}>
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
                <TableRow key={perm.code}>
                  <TableCell className="font-mono text-sm font-medium text-slate-700">
                    {perm.code}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">{perm.label}</TableCell>
                  <TableCell className="text-slate-600">{perm.description}</TableCell>
                  <TableCell className="text-right">
                    <RowActions
                      open={drop.kind === "permissions" && drop.id === perm.code}
                      onToggle={() => toggleDrop("permissions", perm.code)}
                    >
                      <MenuItem onClick={() => editPermission(perm)}>Edit</MenuItem>
                      <MenuItem danger onClick={() => confirmDelete("permission", perm.label)}>
                        Delete
                      </MenuItem>
                    </RowActions>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TableFooter count={permissions.length} noun="permission" />
        </Card>
      )}

      {/* Permission modal */}
      <Modal
        open={modal.type === "permission"}
        onClose={closeModal}
        title={modal.mode === "edit" ? "Edit permission" : "New permission"}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={closeModal}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Feature">
            <input
              type="text"
              placeholder="e.g. user"
              value={form.feature}
              onChange={(e) => setForm({ ...form, feature: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Action">
            <select
              value={form.action}
              onChange={(e) => setForm({ ...form, action: e.target.value })}
              className={inputClass}
            >
              {["create", "read", "update", "delete", "view", "print"].map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Label">
            <input
              type="text"
              placeholder="e.g. View users"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Description">
            <textarea
              rows={3}
              placeholder="What this permission allows..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={cn(inputClass, "resize-none")}
            />
          </Field>
        </div>
      </Modal>

      {/* Role modal */}
      <Modal
        open={modal.type === "role"}
        onClose={closeModal}
        title={modal.mode === "edit" ? "Edit role" : "New role"}
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={closeModal}>Save</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Name">
            <input
              type="text"
              placeholder="e.g. Project Manager"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
      </Modal>

      {/* Role permissions modal */}
      <Modal
        open={modal.type === "rolePermissions"}
        onClose={closeModal}
        title={`Permissions for ${modal.role?.name ?? ""}`}
        description="Toggle the permissions this role grants."
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={closeModal}>Save</Button>
          </>
        }
      >
        <div className="space-y-3">
          {features.map((feature) => {
            const featurePerms = permissions.filter((p) => p.code.split(":")[0] === feature);
            return (
              <div key={feature} className="border-b border-slate-100 pb-3 last:border-0">
                <p className="mb-2 text-sm font-semibold capitalize text-slate-900">{feature}</p>
                {featurePerms.map((perm) => (
                  <label
                    key={perm.code}
                    className="flex cursor-pointer items-start gap-3 rounded px-2 py-2 hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPermissions.includes(perm.code)}
                      onChange={() => togglePermission(perm.code)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="flex-1">
                      <span className="block text-sm font-medium text-slate-900">{perm.label}</span>
                      <span className="block font-mono text-xs text-slate-500">{perm.code}</span>
                    </span>
                  </label>
                ))}
              </div>
            );
          })}
        </div>
      </Modal>

      {/* User modal */}
      <Modal
        open={modal.type === "user"}
        onClose={closeModal}
        title={modal.mode === "edit" ? "Edit user" : "New user"}
        description={
          modal.mode === "edit"
            ? undefined
            : "A password will be auto-generated and shown once. Make sure to copy it."
        }
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button onClick={closeModal}>{modal.mode === "edit" ? "Save" : "Create"}</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Field label="Name">
            <input
              type="text"
              placeholder="Franz Paradela"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              placeholder="franz@gmail.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Role">
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className={inputClass}
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </Field>
        </div>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal
        open={modal.type === "delete"}
        onClose={closeModal}
        size="sm"
        title="Delete confirmation"
        footer={
          <>
            <Button variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={closeModal}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Are you sure you want to delete the {modal.del?.itemType}{" "}
          <span className="font-semibold text-slate-900">{modal.del?.label}</span>? This action
          cannot be undone.
        </p>
      </Modal>
    </>
  );
}
