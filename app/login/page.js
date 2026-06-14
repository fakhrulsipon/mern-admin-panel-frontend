"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showError } from "@/lib/alerts";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // --- ফ্রন্টএন্ড স্ট্যান্ডার্ড ভ্যালিডেশন চেক ---
    if (!email.includes("@")) {
      await showError("Please enter a valid administrative email address.");
      return;
    }
    if (password.length < 6) {
      await showError("Authentication failed. Password must be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch("https://mern-admin-panel-ao02.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      // ব্যাকএন্ড থেকে ভুল পাসওয়ার্ড বা ইমেইল দিলে এই স্ট্যান্ডার্ড মেসেজটি শো করবে
      if (!res.ok) {
        throw new Error(data.message || "Invalid email or password. Access denied.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      await showError(err);
    }
  };

  return (
    <main className="auth-shell">
      <section className="auth-editorial">
        <div>
          <p className="eyebrow">Maison Admin</p>
          <h1 className="mt-8 display-title">Commerce, composed with restraint.</h1>
        </div>
        <div className="max-w-xl border-t border-line pt-8">
          <p className="body-copy">
            Monitor orders, catalog quality, inventory pressure, and customer activity from a calm workspace built for decisive operations.
          </p>
        </div>
      </section>

      <section className="auth-panel-wrap">
        <div className="editorial-panel max-w-md max-w-full p-6 sm:p-8">
          <div className="space-y-3">
            <p className="eyebrow">Secure Access</p>
            <h2 className="page-title">Sign in</h2>
            <p className="body-copy">Enter your admin credentials to continue to the dashboard.</p>
          </div>

          {/* স্ট্যান্ডার্ড মিনিমালিস্ট এরর নোটিশ ইউআই */}
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="field-label" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="field-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <button type="submit" className="primary-button w-full">
                Sign In
              </button>

              {/* কাস্টম রেজিস্টার লিংক */}
              <div className="text-center pt-2">
                <p className="text-xs text-muted tracking-wide">
                  New to the console?{" "}
                  <Link 
                    href="/register" 
                    className="text-ink font-semibold underline underline-offset-4 hover:text-black transition-colors"
                  >
                    Create an admin account
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
