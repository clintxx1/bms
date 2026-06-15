import Link from "next/link";
import {
  Search,
  Plus,
  Printer,
  Pencil,
  Package,
  FileText,
  ArrowRight,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/bms/page-header";
import { projects, projectsSummary } from "@/lib/data";
import { peso, pct } from "@/lib/utils";

const destinations = [
  {
    href: "/contract",
    eyebrow: "Contractor detail",
    title: "Contract Page",
    desc: "Budget, variance & available cards, contracts, and the full payments ledger for Builders 1.",
    icon: FileText,
    stat: "₱225,000.00 budget · 42.63% spent",
  },
  {
    href: "/supply-tracking",
    eyebrow: "Procurement",
    title: "Supply Tracking",
    desc: "Purchase orders, ordered-vs-received quantities, receive goods, and receipt history.",
    icon: Package,
    stat: "2 POs · ₱31,800.00 tracked",
  },
];

export default function HomePage() {
  return (
    <>
      <PageHeader
        title="Project"
        subtitle="Track contractor-level spend, spot overages early, and keep cash flowing."
      />

      {/* Hero banner — matches the new layout's blue "Budget & Payment" banner */}
      <div className="bms-hero relative mb-6 overflow-hidden rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20">
        <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-bold tracking-tight">Budget &amp; Payment</h2>
            <p className="mt-1 text-sm text-blue-50/90">
              Track contractor-level spend, spot overages early, and keep cash flowing.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-emerald-600">
                Total budget: {peso(projectsSummary.totalBudget)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-amber-600">
                Spent: {peso(projectsSummary.spent)}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-blue-700">
                {projectsSummary.count} projects
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Search transactions..."
                className="h-10 w-full rounded-lg border-0 bg-white/95 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/60 lg:w-64"
              />
            </div>
            <Button variant="white" className="h-10 shrink-0">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      {/* Jump into the two redesigned pages */}
      <div className="mb-6">
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          Open a redesigned page
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {destinations.map((d) => {
            const Icon = d.icon;
            return (
              <Link key={d.href} href={d.href} className="group">
                <Card className="h-full p-5 transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md hover:shadow-blue-100">
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600">
                        {d.eyebrow}
                      </p>
                      <h3 className="flex items-center gap-1.5 text-lg font-semibold text-slate-900">
                        {d.title}
                        <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-blue-600" />
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">{d.desc}</p>
                      <p className="mt-3 text-xs font-medium text-slate-400">{d.stat}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Projects table — rows drill into the contract page */}
      <Card className="overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <h3 className="text-base font-semibold text-slate-900">All projects</h3>
            <p className="text-sm text-slate-500">
              Select a project to open its contractors and contracts.
            </p>
          </div>
          <div className="hidden items-center gap-4 text-sm sm:flex">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Wallet className="h-4 w-4 text-slate-400" />
              {peso(projectsSummary.totalBudget)}
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600">
              <TrendingUp className="h-4 w-4" />
              {peso(projectsSummary.spent)} spent
            </span>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="text-right">Spent</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.id} className="group">
                <TableCell className="max-w-[260px]">
                  <Link
                    href="/contract"
                    className="font-medium text-slate-900 group-hover:text-blue-700"
                  >
                    {p.name}
                  </Link>
                </TableCell>
                <TableCell className="text-right font-medium text-slate-700">
                  {peso(p.budget)}
                </TableCell>
                <TableCell className="text-right text-slate-600">
                  {peso(p.spent)}
                </TableCell>
                <TableCell className="text-right text-slate-600">
                  {peso(p.remaining)}
                </TableCell>
                <TableCell className="w-[160px]">
                  <Progress value={p.progress} size="sm" />
                  <span className="mt-1 block text-xs text-slate-500">
                    {pct(p.progress)}
                  </span>
                </TableCell>
                <TableCell className="whitespace-nowrap text-slate-500">
                  {p.created}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1">
                    <Link href="/supply-tracking">
                      <Button
                        variant="ghost"
                        size="iconSm"
                        title="Supply tracking"
                      >
                        <Package className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="iconSm" title="Print">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="iconSm" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <p className="mt-5 text-center text-xs text-slate-400">
        Demo build · only the <span className="font-medium text-slate-500">Contract</span> and{" "}
        <span className="font-medium text-slate-500">Supply Tracking</span> pages are wired up.
      </p>
    </>
  );
}
