"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unable to sign in");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
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
        <div className="editorial-panel max-w-md p-6 sm:p-8">
          <div className="space-y-3">
            <p className="eyebrow">Secure Access</p>
            <h2 className="page-title">Sign in</h2>
            <p className="body-copy">Enter your admin credentials to continue to the dashboard.</p>
          </div>

          {error && <div className="danger-notice mt-6">{error}</div>}

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

            <button type="submit" className="primary-button w-full">
              Sign In
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
