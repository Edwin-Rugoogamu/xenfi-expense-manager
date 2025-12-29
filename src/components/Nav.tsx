"use client"

import { useState } from "react"
import Link from "next/link"
import { signOut, useSession } from "next-auth/react"

export default function Nav() {
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/dashboard">
              <h1 className="text-xl font-semibold text-gray-900">
                XenFi Expense Manager
              </h1>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {session && (
              <>
                <span className="text-gray-700">Welcome, {session.user?.name}</span>
                <Link
                  href="/expenses"
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Expenses
                </Link>
                <Link
                  href="/categories"
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  Categories
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Sign out
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {session && (
                <>
                  <div className="px-3 py-2 text-gray-700">
                    Welcome, {session.user?.name}
                  </div>
                  <Link
                    href="/expenses"
                    className="block px-3 py-2 text-indigo-600 hover:text-indigo-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Expenses
                  </Link>
                  <Link
                    href="/categories"
                    className="block px-3 py-2 text-indigo-600 hover:text-indigo-900"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Categories
                  </Link>
                  <button
                    onClick={() => {
                      signOut()
                      setIsMenuOpen(false)
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-gray-900"
                  >
                    Sign out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
