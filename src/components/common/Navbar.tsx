"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0d0f12]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6 lg:px-8 font-mono text-xs">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="tracking-widest text-slate-300 transition-colors hover:text-white"
          >
            KARSALOKA <span className="text-slate-600">•</span> GLOBAL INNOVATORS
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex text-slate-400">
          <Link
            href="/atlas"
            className="transition-colors hover:text-white"
          >
            ATLAS
          </Link>
          <Link
            href="/cases/alphafold-protein-structures"
            className="transition-colors hover:text-white"
          >
            KASUS
          </Link>
          <Link
            href="/quiz"
            className="transition-colors hover:text-white"
          >
            DIAGNOSA
          </Link>
          <Link
            href="/paths"
            className="transition-colors hover:text-white"
          >
            ROADMAP
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-amber-500 font-medium">ID</span>
          <span className="text-slate-600">EN</span>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-400 hover:text-white md:hidden"
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
        >
          {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-white/[0.08] bg-[#0d0f12] px-6 py-4 font-mono text-xs md:hidden">
          <div className="flex flex-col gap-3 text-slate-400">
            <Link
              href="/atlas"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-200 hover:text-white"
            >
              01 • ATLAS
            </Link>
            <Link
              href="/cases/alphafold-protein-structures"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-200 hover:text-white"
            >
              02 • KASUS
            </Link>
            <Link
              href="/quiz"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-200 hover:text-white"
            >
              03 • DIAGNOSA
            </Link>
            <Link
              href="/paths"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-slate-200 hover:text-white"
            >
              04 • ROADMAP
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
