import TopNav from "./TopNav.jsx";

export default function Shell({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <TopNav />
      <main className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">{children}</main>
      <footer className="mx-auto max-w-6xl p-6 text-center text-sm text-slate-500">
        © 2025 Brigadiers
      </footer>
    </div>
  );
}