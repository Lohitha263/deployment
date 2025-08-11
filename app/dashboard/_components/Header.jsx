'use client'

import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/questions', label: 'Upcoming Updates' },
  { href: '/dashboard/upgrade', label: 'Upgrade' },
  { href: '/dashboard/faq', label: 'About' },
]

const Header = () => {
  const path = usePathname()

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center">
          <Image src="/logo.svg" alt="Logo" width={140} height={40} priority />
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex space-x-8 font-semibold text-gray-700">
          {navItems.map(({ href, label }) => {
            const isActive = path === href
            return (
              <Link
                key={href}
                href={href}
                className={`
                  relative py-2 px-1 cursor-pointer transition-colors duration-300 group
                  ${isActive ? 'text-primary font-bold' : 'hover:text-primary'}
                `}
              >
                {label}
                {/* Underline on active or hover */}
                <span
                  className={`
                    absolute left-0 bottom-0 w-full h-0.5 bg-primary transition-transform
                    origin-left
                    ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}
                  `}
                />
              </Link>
            )
          })}
        </nav>

        {/* User button */}
        <div className="flex items-center">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: 'w-9 h-9 rounded-full',
                userButtonRoot: 'focus:ring-2 focus:ring-primary',
              },
            }}
          />
        </div>
      </div>
    </header>
  )
}

export default Header
