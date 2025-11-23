'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function UserDropdown({ onLogout }: { onLogout: () => void }) {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    onLogout()
    router.refresh()
  }

  return (
    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-50">
      <ul className="text-sm text-gray-700 dark:text-gray-200">
        <li>
          <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            My Profile
          </Link>
        </li>
        <li>
          <Link href="/orders" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
            My Orders
          </Link>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}
