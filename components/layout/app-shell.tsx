import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen app-canvas">
      <Sidebar />
      <main className="lg:pl-64">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-7 sm:px-8 lg:py-9">
          {children}
        </div>
      </main>
    </div>
  );
}
