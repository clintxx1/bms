import Link from "next/link";
import {
  Package,
  Boxes,
  CircleDollarSign,
  Plus,
  PackageCheck,
  Trash2,
  Tag,
  ArrowLeft,
  History,
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
  supplyLines,
  purchaseOrders,
  receiptHistory,
  supplySummary,
} from "@/lib/data";
import { peso, pct } from "@/lib/utils";

function StatusBadge({ status }: { status: "open" | "completed" }) {
  return status === "completed" ? (
    <Badge variant="green">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
      completed
    </Badge>
  ) : (
    <Badge variant="blue">
      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
      open
    </Badge>
  );
}

export default function SupplyTrackingPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "Project", href: "/" },
          { label: contractor.project, href: "/" },
          { label: contractor.name, href: "/contract" },
          { label: "Supply Tracking" },
        ]}
      />

      <PageHeader
        title="Supply Tracking"
        subtitle="Ordered vs received quantities across all purchase orders."
        actions={
          <Link href="/contract">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
              Back to contract
            </Button>
          </Link>
        }
      />

      {/* Summary */}
      <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Purchase Orders"
          value={supplySummary.purchaseOrders}
          icon={Package}
          accent="blue"
        />
        <StatCard
          label="Items Tracked"
          value={supplySummary.itemsTracked}
          hint={`${supplySummary.fullyReceived} fully received`}
          icon={Boxes}
          accent="slate"
        />
        <StatCard
          label="Total PO Value"
          value={peso(supplySummary.totalValue)}
          icon={CircleDollarSign}
          accent="green"
        />
      </div>

      {/* Supply tracking table */}
      <Card className="mb-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
              <Package className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-slate-900">Supply Tracking</h3>
              <p className="text-sm text-slate-500">
                Ordered vs received quantities across all purchase orders.
              </p>
            </div>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4" />
            New Purchase Order
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>PO #</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead className="text-right">Ordered</TableHead>
              <TableHead className="text-right">Received</TableHead>
              <TableHead className="text-right">Remaining</TableHead>
              <TableHead className="w-[180px]">Progress</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {supplyLines.map((s) => {
              const remaining = s.ordered - s.received;
              const progress = (s.received / s.ordered) * 100;
              return (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-sm font-medium text-slate-700">
                    {s.po}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900">{s.item}</TableCell>
                  <TableCell className="text-slate-500">{s.variant}</TableCell>
                  <TableCell className="text-right tabular-nums text-slate-700">
                    {s.ordered} pcs
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-slate-700">
                    {s.received} pcs
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        remaining === 0
                          ? "font-medium text-emerald-600"
                          : "font-medium text-amber-600"
                      }
                    >
                      {remaining} pcs
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={progress}
                        size="sm"
                        variant="completion"
                        className="flex-1"
                      />
                      <span className="w-9 text-right text-xs tabular-nums text-slate-500">
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={s.status} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Purchase orders table */}
      <Card className="mb-6 overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-semibold text-slate-900">Purchase Orders</h3>
          <p className="text-sm text-slate-500">Each PO links a payment back to the budget.</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>PO #</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Contractor</TableHead>
              <TableHead className="text-right">Items</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead>Ordered</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-mono text-sm font-medium text-slate-700">
                  {po.po}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-1.5 text-slate-600">
                    <Tag className="h-3.5 w-3.5 text-slate-400" />
                    {po.payment}
                  </span>
                </TableCell>
                <TableCell className="text-slate-700">{po.contractor}</TableCell>
                <TableCell className="text-right tabular-nums text-slate-600">
                  {po.items}
                </TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-slate-900">
                  {peso(po.value)}
                </TableCell>
                <TableCell className="whitespace-nowrap text-slate-500">{po.ordered}</TableCell>
                <TableCell className="whitespace-nowrap text-slate-500">{po.expected}</TableCell>
                <TableCell>
                  <StatusBadge status={po.status} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-1.5">
                    {po.status === "completed" ? (
                      <Button variant="ghost" size="sm" disabled className="opacity-60">
                        <PackageCheck className="h-4 w-4 text-emerald-600" />
                        Received
                      </Button>
                    ) : (
                      <Button variant="soft" size="sm">
                        <PackageCheck className="h-4 w-4" />
                        Receive
                      </Button>
                    )}
                    <Button variant="ghost" size="iconSm" title="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Receipt history */}
      <Card>
        <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600">
            <History className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-slate-900">Receipt History</h3>
            <p className="text-sm text-slate-500">Deliveries logged against purchase orders.</p>
          </div>
        </div>
        <div className="p-5">
          <ol className="relative space-y-5 border-l border-slate-200 pl-6">
            {receiptHistory.map((r) => (
              <li key={r.id} className="relative">
                <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full bg-emerald-50 ring-4 ring-white">
                  <PackageCheck className="h-3.5 w-3.5 text-emerald-600" />
                </span>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {r.date}
                      <span className="ml-2 font-normal text-slate-400">PO: {r.po}</span>
                    </p>
                    <p className="mt-0.5 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <Tag className="h-3.5 w-3.5 text-slate-400" />
                        {r.item} ({r.variant})
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{r.items} item</Badge>
                    <span className="text-sm font-semibold text-emerald-600">+{r.qty} pcs</span>
                    <span className="text-xs text-slate-400">
                      received {r.receivedTotal} pcs
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Card>
    </>
  );
}
