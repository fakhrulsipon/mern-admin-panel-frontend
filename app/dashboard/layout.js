"use client";
import { useEffect, useSyncExternalStore, useState } from "react";
import { LogOut, LayoutDashboard, Package, ShoppingCart, Users, Settings, Menu, X } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { confirmAction, showSuccess } from "@/lib/alerts";

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
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    const confirmed = await confirmAction({
      title: "Are you sure you want to log out?",
      text: "Your current admin session will be closed.",
    });

    if (!confirmed) return;

    localStorage.clear();
    await showSuccess("Logged out successfully.");
    router.push("/login");
  };

  if (!user) return <div className="h-screen flex items-center justify-center font-light tracking-widest text-gray-400 bg-[#FAF9F6]">VERIFYING SESSION...</div>;

  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Products", icon: Package, href: "/dashboard/products" },
    { label: "Orders", icon: ShoppingCart, href: "/dashboard/orders" },
    { label: "Customers", icon: Users, href: "/dashboard/customers" },
    { label: "Settings", icon: Settings, href: "/dashboard/settings" },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between">
      <div>
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-light tracking-[0.2em] uppercase">E-Shop</h2>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-1">Admin Console</p>
          </div>
          <button className="lg:hidden p-1 text-gray-500 hover:text-black" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} strokeWidth={1.5} />
          </button>
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
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] flex flex-col lg:flex-row">
      
      {/* Mobile Header Top Bar */}
      <header className="lg:hidden w-full bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between sticky top-0 z-40">
        <div>
          <h2 className="text-md font-light tracking-[0.15em] uppercase">E-Shop</h2>
          <p className="text-[8px] text-gray-400 tracking-wider uppercase">Console</p>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-1.5 border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors text-black"
        >
          <Menu size={18} strokeWidth={1.5} />
        </button>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="fixed inset-y-0 left-0 w-64 max-w-xs bg-white p-6 shadow-xl border-r border-gray-200 transition-transform duration-300 ease-in-out">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Permanent Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white p-8 hidden lg:block z-30">
        <SidebarContent />
      </aside>

      {/* Main Content Container with X-Axis Overflow Protection */}
      <main className="min-w-0 flex-1 w-full overflow-x-hidden p-4 sm:p-6 md:p-8 lg:ml-64 lg:p-12">
        <div className="mx-auto w-full max-w-6xl min-w-0">
          {children}
        </div>
      </main>

    </div>
  );
}