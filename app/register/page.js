"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

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
          <h1 className="mt-8 display-title">A refined command center for modern retail.</h1>
        </div>
        <div className="max-w-xl border-t border-line pt-8">
          <p className="body-copy">
            Create an administrator profile for managing products, order flow, merchandising, and customer operations with clarity.
          </p>
        </div>
      </section>

      <section className="auth-panel-wrap">
        <div className="editorial-panel max-w-md p-6 sm:p-8">
          <div className="space-y-3">
            <p className="eyebrow">Admin Onboarding</p>
            <h2 className="page-title">Create account</h2>
            <p className="body-copy">Set up protected access for ecommerce management.</p>
          </div>

          {error && <div className="danger-notice mt-6">{error}</div>}

          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div>
              <label className="field-label" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                className="field-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
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
              Sign Up
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
