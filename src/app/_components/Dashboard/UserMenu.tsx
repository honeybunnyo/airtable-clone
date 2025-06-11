'use client';

import { useState, useRef, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import type { Session } from 'next-auth'

export default function UserMenu({ session }: { session: Session }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {session?.user?.image && (
        <div
          className="w-7 h-7 rounded-full overflow-hidden cursor-pointer outline-1 outline-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Image
            src={session.user.image}
            alt="User"
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
        </div>
      )}

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-25 rounded-md shadow-lg bg-white ring-1 ring-black/10 z-50">
          <button
            onClick={() => signOut()}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
