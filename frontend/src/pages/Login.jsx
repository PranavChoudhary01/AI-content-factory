import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed, check your details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-panel border border-line rounded-xl p-6">
        <h1 className="text-xl font-semibold text-text-primary font-display mb-1">Welcome back</h1>
        <p className="text-sm text-text-muted mb-6">Log in to your LearnKins account</p>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <label className="text-xs uppercase tracking-wide text-text-muted block mb-1">Email</label>
        <input
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 rounded-md bg-surface border border-border text-text-primary text-sm"
        />

        <label className="text-xs uppercase tracking-wide text-text-muted block mb-1">Password</label>
        <input
          name="password"
          type="password"
          required
          value={form.password}
          onChange={handleChange}
          className="w-full mb-6 px-3 py-2 rounded-md bg-surface border border-border text-text-primary text-sm"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-md bg-amber text-[#3A2900] text-sm font-medium disabled:opacity-70"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="text-sm text-text-muted mt-4 text-center">
          New here?{" "}
          <Link to="/signup" className="text-mint">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
