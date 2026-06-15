/**
 * Mock data for the BMS redesign demo.
 * Numbers are lifted from the v1 Figma screens so the math stays coherent:
 *   Available = Budget + Variance − Spent
 *   Progress  = Spent ÷ (Budget + Variance)
 * Verified: Builders 1 → 225,000 + 56,200 − 119,880 = 161,320 (42.63%).
 */

export type Money = number;

export const org = {
  name: "BMS",
  tagline: "Budget Monitoring System",
  user: { name: "Administrator", email: "gabriel@bms.com", initials: "Ad" },
};

/* ----------------------------- Projects (home) ---------------------------- */

export interface ProjectRow {
  id: string;
  name: string;
  budget: Money;
  spent: Money;
  remaining: Money;
  progress: number; // %
  created: string;
}

export const projects: ProjectRow[] = [
  {
    id: "golden-phoenix-yellow",
    name: "Golden Phoenix — Yellow Building Renovation",
    budget: 3461240,
    spent: 300682.86,
    remaining: 3160557.14,
    progress: 8.7,
    created: "May 23, 2026",
  },
  {
    id: "golden-phoenix-annex",
    name: "Golden Phoenix Annex Bldg Renovation",
    budget: 560000,
    spent: 11200,
    remaining: 548800,
    progress: 33.7,
    created: "May 24, 2026",
  },
  {
    id: "one-atillo-place",
    name: "One Atillo Place",
    budget: 110000,
    spent: 3123.36,
    remaining: 106876.64,
    progress: 2.8,
    created: "May 25, 2026",
  },
  {
    id: "consulate-nra",
    name: "Consulate Project — NRA",
    budget: 50000,
    spent: 0,
    remaining: 50000,
    progress: 0,
    created: "May 22, 2026",
  },
];

export const projectsSummary = {
  totalBudget: 4775440,
  spent: 512086.22,
  count: 8,
};

/* --------------------------- Contract page data --------------------------- */

export const contractor = {
  project: "Golden Phoenix — Yellow Building Renovation",
  name: "Builders 1",
  status: "On track" as const,
  budget: 225000,
  variance: 56200,
  spent: 119880,
  get available() {
    return this.budget + this.variance - this.spent;
  },
  get progress() {
    return (this.spent / (this.budget + this.variance)) * 100;
  },
};

export interface Contract {
  id: string;
  code: string;
  name: string;
  budget: Money;
  variance: Money;
  spent: Money;
}

export const contracts: Contract[] = [
  {
    id: "ef",
    code: "EF",
    name: "Electrical Fit-out",
    budget: 75000,
    variance: 35000,
    spent: 104200,
  },
  {
    id: "nra",
    code: "NRA",
    name: "Non-Residential Area Works",
    budget: 90000,
    variance: 12000,
    spent: 9880,
  },
  {
    id: "gf",
    code: "GF",
    name: "Groundfloor Finishing",
    budget: 60000,
    variance: 9200,
    spent: 5800,
  },
];

export function contractAvailable(c: Contract) {
  return c.budget + c.variance - c.spent;
}
export function contractProgress(c: Contract) {
  return (c.spent / (c.budget + c.variance)) * 100;
}

export type Method = "Check" | "Cash";
export type Category = "labor" | "supply";

export interface Payment {
  id: string;
  payee: string;
  method: Method;
  category: Category;
  bill: string;
  siNo: string;
  siDate: string;
  sale: Money;
  vat: Money;
  amount: Money;
  date: string;
  accepted: string;
}

/* Sums to the EF contract spend of ₱104,200 (12% VAT where applied). */
export const payments: Payment[] = [
  {
    id: "p1",
    payee: "Metro Hardware Supply",
    method: "Check",
    category: "supply",
    bill: "—",
    siNo: "123123",
    siDate: "May 22, 2026",
    sale: 15000,
    vat: 1800,
    amount: 16800,
    date: "May 22, 2026",
    accepted: "May 22, 2026",
  },
  {
    id: "p2",
    payee: "Ian Cruz (Foreman)",
    method: "Cash",
    category: "labor",
    bill: "4",
    siNo: "123123",
    siDate: "May 20, 2026",
    sale: 20000,
    vat: 2400,
    amount: 22400,
    date: "May 20, 2026",
    accepted: "May 20, 2026",
  },
  {
    id: "p3",
    payee: "RenDer Trading",
    method: "Check",
    category: "supply",
    bill: "—",
    siNo: "123123123",
    siDate: "May 18, 2026",
    sale: 15000,
    vat: 0,
    amount: 15000,
    date: "May 18, 2026",
    accepted: "May 18, 2026",
  },
  {
    id: "p4",
    payee: "Random Labor Crew",
    method: "Cash",
    category: "labor",
    bill: "—",
    siNo: "123",
    siDate: "May 18, 2026",
    sale: 50000,
    vat: 0,
    amount: 50000,
    date: "May 18, 2026",
    accepted: "May 18, 2026",
  },
];

/* ------------------------- Supply Tracking page data ----------------------- */

export type POStatus = "open" | "completed";

export interface SupplyLine {
  id: string;
  po: string;
  item: string;
  variant: string;
  ordered: number;
  received: number;
  status: POStatus;
}

export const supplyLines: SupplyLine[] = [
  {
    id: "s1",
    po: "PO-02",
    item: "Tiles",
    variant: "Marble",
    ordered: 10,
    received: 10,
    status: "completed",
  },
  {
    id: "s2",
    po: "PO-01",
    item: "Tiles",
    variant: "Mason",
    ordered: 10,
    received: 0,
    status: "open",
  },
];

export interface PurchaseOrder {
  id: string;
  po: string;
  payment: string;
  contractor: string;
  items: number;
  value: Money;
  ordered: string;
  expected: string;
  status: POStatus;
}

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "po2",
    po: "PO-02",
    payment: "Tiles",
    contractor: "Builders 1",
    items: 1,
    value: 16800,
    ordered: "May 28, 2026",
    expected: "May 28, 2026",
    status: "completed",
  },
  {
    id: "po1",
    po: "PO-01",
    payment: "Tiles",
    contractor: "Builders 1",
    items: 1,
    value: 15000,
    ordered: "May 26, 2026",
    expected: "May 27, 2026",
    status: "open",
  },
];

export interface ReceiptEntry {
  id: string;
  date: string;
  po: string;
  item: string;
  variant: string;
  qty: number;
  receivedTotal: number;
  items: number;
}

export const receiptHistory: ReceiptEntry[] = [
  {
    id: "r1",
    date: "May 28, 2026",
    po: "PO-02",
    item: "Tiles",
    variant: "Marble",
    qty: 10,
    receivedTotal: 10,
    items: 1,
  },
];

export const supplySummary = {
  purchaseOrders: 2,
  itemsTracked: 2,
  fullyReceived: 1,
  totalValue: 31800,
};

/* ----------------------- User Management page data ---------------------- */

export interface Permission {
  id: string;
  code: string;
  label: string;
  description: string;
}

export const permissions: Permission[] = [
  {
    id: "admin-admin",
    code: "admin:admin",
    label: "Admin privilege",
    description: "Allows admin only access",
  },
  {
    id: "contract-create",
    code: "contract:create",
    label: "Create contract",
    description: "Allows user to create a contract",
  },
  {
    id: "contract-delete",
    code: "contract:delete",
    label: "Delete contract",
    description: "Allows user to delete a contract",
  },
  {
    id: "contract-update",
    code: "contract:update",
    label: "Update contract",
    description: "Allows user to update a contract",
  },
  {
    id: "contract-view",
    code: "contract:view",
    label: "View contracts",
    description: "Allows user to access contractor's contract & payments",
  },
  {
    id: "contractor-create",
    code: "contractor:create",
    label: "Create contractor",
    description: "Allows user to create contractor",
  },
  {
    id: "contractor-delete",
    code: "contractor:delete",
    label: "Delete contractor",
    description: "Allows user to delete contractor",
  },
  {
    id: "contractor-print",
    code: "contractor:print",
    label: "Print contractor",
    description: "Allows user to update contractor",
  },
  {
    id: "contractor-update",
    code: "contractor:update",
    label: "Update contractor",
    description: "Allows user to update contractor",
  },
  {
    id: "contractor-view",
    code: "contractor:view",
    label: "View contractor",
    description: "Allows user to view contractor page",
  },
];

export interface Role {
  id: string;
  name: string;
  description: string;
  users: number;
}

export const roles: Role[] = [
  {
    id: "admin",
    name: "Admin",
    description: "Full access to all features and settings",
    users: 2,
  },
  {
    id: "manager",
    name: "Project Manager",
    description: "Can manage projects, contracts, and payments",
    users: 5,
  },
  {
    id: "viewer",
    name: "Viewer",
    description: "Read-only access to projects and reports",
    users: 8,
  },
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

export const users: User[] = [
  {
    id: "1",
    name: "Gabriel Montoya",
    email: "gabriel@bms.com",
    role: "Admin",
    status: "active",
  },
  {
    id: "2",
    name: "Maria Santos",
    email: "maria@bms.com",
    role: "Project Manager",
    status: "active",
  },
  {
    id: "3",
    name: "John Doe",
    email: "john@bms.com",
    role: "Viewer",
    status: "active",
  },
  {
    id: "4",
    name: "Jane Smith",
    email: "jane@bms.com",
    role: "Project Manager",
    status: "inactive",
  },
  {
    id: "5",
    name: "Robert Johnson",
    email: "robert@bms.com",
    role: "Viewer",
    status: "active",
  },
];
