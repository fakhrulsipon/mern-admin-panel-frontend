"use client";
import { useEffect, useSyncExternalStore } from "react";
import { LogOut, LayoutDashboard, Package, ShoppingCart, Users, Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

// --- Auth logic (Cached) ---
const subscribeToAuthSnapshot = () => () => {};
let cachedToken = null, cachedStoredUser = null, cachedUser = null;

const getAuthSnapshot = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  if (!token || !storedUser) {
    cachedToken = token; cachedStoredUser = storedUser; cachedUser = null;
    return null;
  }
  if (token === cachedToken && storedUser === cachedStoredUser) return cachedUser;
  try {
    cachedToken = token; cachedStoredUser = storedUser;
    cachedUser = JSON.parse(storedUser);
    return cachedUser;
  } catch { return null; }
};

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSyncExternalStore(subscribeToAuthSnapshot, getAuthSnapshot, () => null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!user) return <div className="h-screen flex items-center justify-center font-light tracking-widest text-gray-400">VERIFYING SESSION...</div>;

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Products", icon: Package, href: "/dashboard/products" },
    { label: "Orders", icon: ShoppingCart, href: "/dashboard/orders" },
    { label: "Customers", icon: Users, href: "/dashboard/customers" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAF9F6] text-[#1A1A1A]">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white p-8 flex flex-col justify-between hidden lg:flex">
        <div>
          <div className="mb-12">
            <h2 className="text-xl font-light tracking-[0.2em] uppercase">iLMIFY</h2>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-1">Admin Console</p>
          </div>

          <nav className="space-y-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-4 text-xs uppercase tracking-widest transition-all hover:text-black ${
                    isActive ? "font-bold text-black" : "text-gray-400 font-medium"
                  }`}
                >
                  <item.icon size={16} strokeWidth={isActive ? 2 : 1.5} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <div className="mb-6 pb-6 border-b border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">Authenticated as</p>
            <p className="text-xs font-medium truncate">{user.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 text-xs uppercase tracking-widest text-rose-500 hover:text-rose-700 transition-all font-medium"
          >
            <LogOut size={16} strokeWidth={2} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content (এখানেই page.js এর ডাটাগুলো রেন্ডার হবে) */}
      <main className="flex-1 lg:ml-64 p-8 md:p-12">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}