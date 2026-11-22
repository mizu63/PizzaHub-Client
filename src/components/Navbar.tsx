
"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

interface User {
  name: string;
  email: string;
  role: string;
  image?: string | null;
}

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  const user = session?.user as User | undefined;

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        throw new Error(error.message);
      }

      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Sign out failed:", error);
      setSigningOut(false);
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const linkClass =
    "rounded-full px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-orange-50 hover:text-orange-600";

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-50 border-b border-orange-100/80 bg-white/95 shadow-sm backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center gap-2 text-2xl font-black tracking-tight text-[#d93824]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-50 text-2xl">
            🍕
          </span>
          PizzaHub<span className="text-orange-400">.</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/" className={linkClass}>Home</Link>
          <Link href="/menu" className={linkClass}>Browse Menu</Link>
        </div>

        {/* Desktop User Section */}
        <div className="relative hidden items-center gap-3 md:flex">

          {!isPending && !user && (
            <>
              <Link
                href="/sign-in"
                className="rounded-full px-5 py-2.5 text-sm font-bold text-gray-700 transition hover:text-[#d93824]"
              >
                Sign In
              </Link>

              <Link
                href="/sign-up"
                className="rounded-full bg-[#d93824] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-200/50 transition hover:-translate-y-0.5 hover:bg-[#b92d1c]"
              >
                Get Started →
              </Link>
            </>
          )}

          {!isPending && user && (
            <div className="relative">

              {/* Profile Button */}
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-3 rounded-full border border-orange-100 bg-white py-1.5 pl-2 pr-3 transition hover:bg-orange-50"
                aria-expanded={profileMenuOpen}
                aria-label="Open profile menu"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-10 w-10 rounded-full border-2 border-orange-100 object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#d93824] text-lg font-bold text-white">
                    {avatarLetter}
                  </span>
                )}

                <span className="max-w-28 truncate text-sm font-bold text-gray-700">
                  {user.name}
                </span>

                <span className="text-xs text-gray-500">
                  {profileMenuOpen ? "▲" : "▼"}
                </span>
              </button>

              {/* Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-xl">

                  <div className="border-b border-orange-100 bg-orange-50/70 px-5 py-4">
                    <p className="font-bold text-gray-800">
                      {user.name}
                    </p>
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {user.email}
                    </p>
                    <span className="mt-2 inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold capitalize text-[#d93824]">
                      {user.role}
                    </span>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/"
                      onClick={closeMenu}
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#d93824]"
                    >
                      🏠 Home
                    </Link>

                    <Link
                      href="/menu"
                      onClick={closeMenu}
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#d93824]"
                    >
                      🍕 Browse Menu
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={closeMenu}
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#d93824]"
                    >
                      📊 Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={closeMenu}
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-orange-50 hover:text-[#d93824]"
                    >
                      👤 My Profile
                    </Link>

                    <div className="my-2 border-t border-gray-100" />

                    <button
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                    >
                      {signingOut ? "Signing Out..." : "↪ Sign Out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-100 text-2xl text-gray-700 transition hover:bg-orange-50 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? "×" : "☰"}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="border-t border-orange-100 bg-white px-5 py-5 shadow-lg md:hidden">
          <div className="flex flex-col gap-2">

            {!isPending && user && (
              <div className="mb-3 flex items-center gap-3 rounded-2xl bg-orange-50 p-4">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-12 w-12 rounded-full border-2 border-orange-200 object-cover"
                  />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d93824] text-xl font-bold text-white">
                    {avatarLetter}
                  </span>
                )}

                <div className="min-w-0">
                  <p className="truncate font-bold text-gray-800">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            <Link href="/" onClick={closeMenu} className={linkClass}>
              🏠 Home
            </Link>

            <Link href="/menu" onClick={closeMenu} className={linkClass}>
              🍕 Browse Menu
            </Link>

            {!isPending && user && (
              <>
                <Link href="/dashboard" onClick={closeMenu} className={linkClass}>
                  📊 Dashboard
                </Link>

                <Link href="/dashboard/profile" onClick={closeMenu} className={linkClass}>
                  👤 My Profile
                </Link>

                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="rounded-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {signingOut ? "Signing Out..." : "↪ Sign Out"}
                </button>
              </>
            )}

            {!isPending && !user && (
              <>
                <Link href="/sign-in" onClick={closeMenu} className={linkClass}>
                  Sign In
                </Link>

                <Link
                  href="/sign-up"
                  onClick={closeMenu}
                  className="rounded-full bg-[#d93824] px-5 py-3 text-center text-sm font-bold text-white"
                >
                  Get Started →
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
