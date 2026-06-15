"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wallet,
  Plus,
  PiggyBank,
  Banknote,
  Activity,
  Settings2,
  Pencil,
  Trash2,
  Truck,
  Printer,
  Clock,
  ChevronDown,
  Receipt,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Breadcrumb } from "@/components/bms/breadcrumb";
import { PageHeader } from "@/components/bms/page-header";
import { StatCard } from "@/components/bms/stat-card";
import {
  contractor,
  contracts,
  contractAvailable,
  contractProgress,
  payments,
} from "@/lib/data";
import { peso, pct, cn } from "@/lib/utils";

function MiniStat({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-100 bg-slate-50/60 px-3 py-2.5">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={cn("mt-0.5 text-lg font-bold tracking-tight text-slate-900", valueClass)}>
        {value}
      </p>
    </div>
  );
}

export default function ContractPage() {
  const [activeId, setActiveId] = useState(contracts[0].id);
  const active = contracts.find((c) => c.id === activeId)!;
  const available = contractAvailable(active);
  const progress = contractProgress(active);

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Project", href: "/" },
          { label: contractor.project, href: "/" },
          { label: contractor.name },
        ]}
      />

      <PageHeader
        title="Contract"
        subtitle="Contractor-level budget, contracts, and the full payment ledger."
      />

      {/* Contractor hero */}
      <div className="bms-hero relative mb-6 overflow-hidden rounded-2xl p-6 text-white shadow-lg shadow-blue-600/20">
        <div className="pointer-events-none absolute -right-10 -top-20 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-100/90">
              Contractor
            </p>
            <div className="mt-1 flex items-center gap-3">
              <h2 className="text-3xl font-bold tracking-tight">{contractor.name}</h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white ring-1 ring-inset ring-white/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                {contractor.status}
              </span>
            </div>
            <p className="mt-1 text-sm text-blue-50/80">{contractor.project}</p>
          </div>
          <div className="rounded-xl bg-white/10 p-4 ring-1 ring-inset ring-white/15 md:min-w-[220px]">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-100/90">
              Available
            </p>
            <p className="text-2xl font-bold tracking-tight">{peso(contractor.available)}</p>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${Math.min(100, contractor.progress)}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-blue-50/90">
              {pct(contractor.progress)} of {peso(contractor.budget + contractor.variance)} used
            </p>
          </div>
        </div>
      </div>

      {/* Contractor totals */}
      <div className="mb-7 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Total Budget"
          value={peso(contractor.budget)}
          icon={Wallet}
          accent="slate"
        />
        <StatCard
          label="Variance"
          value={peso(contractor.variance)}
          hint="Variation orders"
          icon={Plus}
          accent="blue"
        />
        <StatCard
          label="Available"
          value={peso(contractor.available)}
          icon={PiggyBank}
          accent="green"
        />
        <StatCard
          label="Spent"
          value={peso(contractor.spent)}
          icon={Banknote}
          accent="amber"
        />
        <StatCard
          label="Progress"
          value={pct(contractor.progress)}
          icon={Activity}
          accent="slate"
          className="col-span-2 lg:col-span-1"
        >
          <Progress value={contractor.progress} />
        </StatCard>
      </div>

      {/* Contracts */}
      <section className="mb-7">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-slate-900">Contracts</h3>
            <p className="text-sm text-slate-500">Scopes of work under {contractor.name}.</p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Add Contract
          </Button>
        </div>

        {/* contract tabs */}
        <div className="mb-4 flex flex-wrap gap-1.5">
          {contracts.map((c) => {
            const selected = c.id === activeId;
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors",
                  selected
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                {c.code}
                <span className="ml-1.5 text-xs text-slate-400">{c.name}</span>
              </button>
            );
          })}
        </div>

        {/* selected contract card */}
        <Card className="p-5">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-sm font-bold text-blue-700">
                {active.code}
              </span>
              <div>
                <h4 className="text-base font-semibold text-slate-900">{active.name}</h4>
                <p className="text-sm text-slate-500">
                  Progress {pct(progress)} ·{" "}
                  <span className={progress >= 100 ? "text-red-600" : "text-emerald-600"}>
                    {peso(available)} available
                  </span>
                </p>
              </div>
            </div>
            {progress >= 100 ? (
              <Badge variant="red">Over budget</Badge>
            ) : progress >= 75 ? (
              <Badge variant="amber">Watch</Badge>
            ) : (
              <Badge variant="green">On track</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <MiniStat label="Budget" value={peso(active.budget)} />
            <MiniStat label="Variance" value={peso(active.variance)} valueClass="text-blue-700" />
            <MiniStat
              label="Available"
              value={peso(available)}
              valueClass={available < 0 ? "text-red-600" : "text-emerald-600"}
            />
            <MiniStat label="Spent" value={peso(active.spent)} valueClass="text-amber-600" />
            <MiniStat label="Progress" value={pct(progress)} />
          </div>

          <div className="mt-4">
            <Progress value={progress} />
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-end gap-2 border-t border-slate-100 pt-4">
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4" />
              Manage Variance
            </Button>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
            <Link href="/supply-tracking">
              <Button size="sm">
                <Truck className="h-4 w-4" />
                Supply Tracking
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </section>

      {/* Payments */}
      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <Receipt className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Payments</h3>
              <p className="text-sm text-slate-500">All cash out recorded for this contract.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 hover:bg-slate-50">
              All methods
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>
            <Button size="sm" className="h-9">
              <Plus className="h-4 w-4" />
              Add Payment
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Payee</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Bill #</TableHead>
              <TableHead>SI No. / Date</TableHead>
              <TableHead className="text-right">Sale</TableHead>
              <TableHead className="text-right">VAT</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Accepted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="whitespace-nowrap font-medium text-slate-900">
                  {p.payee}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{p.method}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={p.category}>{p.category}</Badge>
                </TableCell>
                <TableCell className="text-slate-500">{p.bill}</TableCell>
                <TableCell className="whitespace-nowrap">
                  <span className="block font-medium text-slate-700">{p.siNo}</span>
                  <span className="block text-xs text-slate-400">{p.siDate}</span>
                </TableCell>
                <TableCell className="text-right tabular-nums text-slate-700">
                  {peso(p.sale)}
                </TableCell>
                <TableCell className="text-right tabular-nums text-slate-500">
                  {p.vat ? peso(p.vat) : "—"}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-slate-900">
                  {peso(p.amount)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-slate-500">{p.accepted}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-0">
                    <Button variant="ghost" size="iconSm" className="h-7 w-7" title="Print voucher">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="iconSm" className="h-7 w-7" title="Edit">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="iconSm" className="h-7 w-7" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="iconSm" className="h-7 w-7" title="History">
                      <Clock className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
          <span>{payments.length} payments</span>
          <span>
            Total spent:{" "}
            <span className="font-semibold text-slate-900">
              {peso(payments.reduce((s, p) => s + p.amount, 0))}
            </span>
          </span>
        </div>
      </Card>
    </>
  );
}
