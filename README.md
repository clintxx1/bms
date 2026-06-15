# BMS — Contract & Supply Tracking (redesign demo)

A focused Next.js demo that redesigns two BMS workflow screens — **Contract** and
**Supply Tracking** — in the new blue design language from `BMS.png`, plus a home
hub that navigates to both.

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Tailwind CSS** with shadcn-style hand-rolled UI primitives (`components/ui`)
- **Inter** via `next/font`
- **lucide-react** icons
- Primary blue: **`#2563EB`** (Tailwind `blue-600`)

## Run

```bash
cd bms-app
npm install
npm run dev          # http://localhost:3000
```

## Pages

| Route               | Screen                                                            |
| ------------------- | ---------------------------------------------------------------- |
| `/`                 | Project hub — hero banner, nav cards, projects table (entry pt.) |
| `/contract`         | Contractor detail — budget cards, contracts, payments ledger     |
| `/supply-tracking`  | Purchase orders, ordered-vs-received, receipt history            |

Flow: **Home → Contract → Supply Tracking** (mirrors the BMS hierarchy
`Project → Contractor → Contract → Supply`). The sidebar's other items
(Dashboard, Profile, User Management) are shown for design fidelity but are not
wired up in this demo.

## Structure

```
app/
  layout.tsx              # Inter font + AppShell
  page.tsx                # home / navigation hub
  contract/page.tsx       # Contract page (client — contract tabs)
  supply-tracking/page.tsx
components/
  layout/                 # sidebar, app-shell
  ui/                     # button, card, badge, table, progress (shadcn-style)
  bms/                    # page-header, stat-card, breadcrumb, stat helpers
lib/
  data.ts                 # mock data lifted from the v1 screens (math is coherent)
  utils.ts                # cn(), peso(), pct()
```

## Notes

- Numbers come straight from the v1 Figma screens so the math checks out
  (`Available = Budget + Variance − Spent`; Builders 1 → 42.63%).
- Progress bars are health-coloured: spend uses green→amber→red; supply
  fulfilment uses blue→green (100% received = done, not "over").
