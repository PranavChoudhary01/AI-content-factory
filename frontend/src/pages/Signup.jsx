import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const GRADES = ["6th", "7th", "8th"];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", grade: "6th" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password, form.grade);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-panel border border-line rounded-xl p-6">
        <h1 className="text-xl font-semibold text-text-primary font-display mb-1">Create your account</h1>
        <p className="text-sm text-text-muted mb-6">Join LearnKins to start generating content</p>

        {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

        <label className="text-xs uppercase tracking-wide text-text-muted block mb-1">Full name</label>
        <input
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 rounded-md bg-surface border border-border text-text-primary text-sm"
        />

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
          minLength={6}
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 rounded-md bg-surface border border-border text-text-primary text-sm"
        />

        <label className="text-xs uppercase tracking-wide text-text-muted block mb-1">Grade</label>
        <select
          name="grade"
          value={form.grade}
          onChange={handleChange}
          className="w-full mb-6 px-3 py-2 rounded-md bg-surface border border-border text-text-primary text-sm"
        >
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-md bg-amber text-[#3A2900] text-sm font-medium disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-sm text-text-muted mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-mint">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
