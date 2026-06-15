"use client";

import { useState } from "react";
import { Plus, MoreHorizontal } from "lucide-react";
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

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>("permissions");

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
        {activeTab === "permissions" && (
          <Button size="sm" className="ml-auto">
            <Plus className="h-4 w-4" />
            New Permission
          </Button>
        )}
      </div>

      {/* Permissions Tab */}
      {activeTab === "permissions" && (
        <Card className="overflow-hidden">
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
                    <Button
                      variant="ghost"
                      size="iconSm"
                      title="More actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
            <span>1-10 of 50 items</span>
            <div className="flex items-center gap-1">
              <span>10 items per page</span>
            </div>
          </div>
        </Card>
      )}

      {/* Roles Tab */}
      {activeTab === "roles" && (
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Roles</h3>
              <Button size="sm">
                <Plus className="h-4 w-4" />
                New Role
              </Button>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {roles.map((role) => (
              <div
                key={role.id}
                className="flex items-center justify-between px-5 py-4"
              >
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-slate-900">
                    {role.name}
                  </h4>
                  <p className="mt-1 text-sm text-slate-500">
                    {role.description}
                  </p>
                </div>
                <div className="ml-4 text-right">
                  <p className="text-lg font-semibold text-slate-900">
                    {role.users}
                  </p>
                  <p className="text-xs text-slate-500">users</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <Card className="overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Users</h3>
              <Button size="sm">
                <Plus className="h-4 w-4" />
                New User
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
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
                  <TableCell className="text-slate-700">{user.role}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "active" ? "green" : "secondary"}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="iconSm"
                      title="More actions"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </>
  );
}
