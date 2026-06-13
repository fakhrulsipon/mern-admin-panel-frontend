"use client";
import { useEffect, useSyncExternalStore } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

const subscribeToAuthSnapshot = () => () => {};

let cachedToken = null;
let cachedStoredUser = null;
let cachedUser = null;

const getAuthSnapshot = () => {
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");

  if (!token || !storedUser) {
    cachedToken = token;
    cachedStoredUser = storedUser;
    cachedUser = null;
    return cachedUser;
  }

  if (token === cachedToken && storedUser === cachedStoredUser) {
    return cachedUser;
  }

  try {
    cachedToken = token;
    cachedStoredUser = storedUser;
    cachedUser = JSON.parse(storedUser);
    return cachedUser;
  } catch {
    cachedToken = token;
    cachedStoredUser = storedUser;
    cachedUser = null;
    return cachedUser;
  }
};

export default function DashboardLayout() {
  const router = useRouter();
  const user = useSyncExternalStore(subscribeToAuthSnapshot, getAuthSnapshot, () => null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!user) {
    return (
      <main className="admin-shell grid place-items-center px-5">
        <div className="editorial-panel max-w-sm p-6 text-center">
          <p className="eyebrow">Preparing Dashboard</p>
          <p className="mt-4 body-copy">Verifying your secure admin session.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <div className="admin-container">
        <header className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow">Commerce Operations</p>
            <h1 className="mt-4 page-title">Welcome back, {user.name}</h1>
            <p className="mt-4 body-copy">
              Review store health, protect catalog quality, and keep daily ecommerce decisions focused.
            </p>
          </div>
          <button onClick={handleLogout} className="quiet-button gap-2 self-start sm:self-auto">
            <LogOut aria-hidden="true" size={16} strokeWidth={1.8} />
            Logout
          </button>
        </header>

        <section className="grid gap-4 py-8 sm:grid-cols-2 xl:grid-cols-4">
          {[
            ["Session", "Active", "Authenticated admin access"],
            ["Catalog", "Ready", "Product management workspace"],
            ["Orders", "Queued", "Fulfillment review area"],
            ["Customers", "Available", "Customer activity overview"],
          ].map(([label, value, detail]) => (
            <article key={label} className="section-panel p-5">
              <p className="eyebrow">{label}</p>
              <p className="mt-6 font-display text-3xl leading-none text-ink">{value}</p>
              <p className="mt-4 text-sm leading-6 text-muted">{detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="section-panel p-6 sm:p-8">
            <p className="eyebrow">Workspace</p>
            <h2 className="mt-4 font-display text-3xl leading-tight text-ink">Editorial-grade control for retail teams.</h2>
            <p className="mt-5 body-copy">
              The interface foundation now favors quiet contrast, measured spacing, precise typography, and refined borders for a premium admin experience.
            </p>
          </div>
          <div className="section-panel divide-y divide-line">
            {["Products", "Inventory", "Orders", "Customers"].map((item) => (
              <div key={item} className="flex items-center justify-between px-6 py-5">
                <span className="text-sm font-semibold text-ink">{item}</span>
                <span className="text-xs uppercase tracking-[0.18em] text-muted">Enabled</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
