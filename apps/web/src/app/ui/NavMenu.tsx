"use client";

import { useState } from "react";
import Link from "next/link";

import { cn } from "@potential/ui";

import { Logo } from "../_components/branding/logo";
import { Button } from "../components/button";

interface NavLink {
  href: string;
  label: string;
}

interface NavMenuProps {
  className?: string;
  links?: NavLink[];
}

export function NavMenu({
  className,
  links = [
    { href: "/#open", label: "Open Health" },
    { href: "/app", label: "Tracking App" },
    { href: "/#story", label: "Story" },
    { href: "/vision", label: "Vision" },
    { href: "/pitch", label: "Pitch" },
  ],
}: NavMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex w-full justify-center px-0 md:px-4">
      <nav
        className={cn(
          "bg-sand-1 my-4 grid w-full max-w-screen-lg grid-cols-6 items-center justify-between rounded-full px-0 py-0 pl-0 shadow-sm md:pr-8",
          className,
        )}
      >
        <Link href="/" className="flex items-center">
          <Logo size="2xl" />
        </Link>

        <div className="place-center col-span-4 hidden w-full justify-between gap-4 justify-self-center md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sand-11 hover:text-sand-12 font-serif font-medium transition duration-150"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden justify-self-end md:block">
          <Button size={"sm"}>Join Now</Button>
        </div>

        <button
          className="col-span-5 justify-self-end pr-6 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="bg-sand-2 absolute left-0 right-0 top-16 z-50 mx-4 my-4 rounded-2xl shadow-lg md:hidden">
            <div className="flex flex-col space-y-4 p-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sand-11 hover:text-sand-12 py-2 font-serif font-medium transition duration-150"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button onClick={() => setIsMenuOpen(false)} size={"sm"}>
                Join Now
              </Button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
