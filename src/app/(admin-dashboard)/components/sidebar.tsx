import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-2">
        <li>
          <Link href="/admin-dashboard" className="block py-2 px-4 hover:bg-gray-700 rounded-lg">
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/recharge-approval" className="block py-2 px-4 hover:bg-gray-700 rounded-lg">
            Recharge Approval
          </Link>
        </li>
        <li>
          <Link href="/trade-execution" className="block py-2 px-4 hover:bg-gray-700 rounded-lg">
            Trade Execution
          </Link>
        </li>
        <li>
          <Link href="/admin-addresses" className="block py-2 px-4 hover:bg-gray-700 rounded-lg">
            Addresses
          </Link>
        </li>
        <li>
          <Link href="/tickets" className="block py-2 px-4 hover:bg-gray-700 rounded-lg">
            Tickets
          </Link>
        </li>
      </ul>
    </div>
  );
}