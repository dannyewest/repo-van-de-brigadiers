import TopNav from "./TopNav.jsx";

type Props = {
  children: React.ReactNode;
};

export default function Shell({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <TopNav />
      
      <main className="flex-grow mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      <footer
        className="mt-8 border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-600"
        aria-label="Application Footer"
      >
        © {new Date().getFullYear()} Brigadiers — All rights reserved.
      </footer>
    </div>
  );
}

