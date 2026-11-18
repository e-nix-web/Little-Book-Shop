import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService.js";
import { useAuth } from "../context/AuthContext.jsx";
import { Feedback } from "../components/Feedback.jsx";

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const profile = await signIn(email, password);
      navigate(profile.role === "admin" ? "/admin" : "/books", { replace: true });
    } catch (issue) {
      setError(issue.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="form-page">
      <div className="form-heading"><span className="eyebrow">Welcome back</span><h1>Sign in to your shelf</h1><p>Customer and shopkeeper demos use the same sign-in page.</p></div>
      <form className="card-form" onSubmit={submit}>
        <Feedback error={error} />
        <label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label>Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <button className="button primary full-width" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        <div className="form-links"><Link to="/forgot-password">Forgot password?</Link><span>New here? <Link to="/signup">Create a customer account</Link></span></div>
      </form>
      <aside className="demo-credentials">
        <strong>Try the demo</strong>
        <p>Reader: customer@littlebookshop.demo / bookshop-reader</p>
        <p>Shopkeeper: admin@littlebookshop.demo / bookshop-admin</p>
        <small>Demo credentials only. This is not real account security.</small>
      </aside>
    </section>
  );
}

export function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await signUp(form.name, form.email);
      navigate("/books", { replace: true });
    } catch (issue) {
      setError(issue.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="form-page">
      <div className="form-heading"><span className="eyebrow">Make yourself at home</span><h1>Create a reader account</h1><p>Public sign-up creates a customer-only demo profile and signs you in. No password is stored.</p></div>
      <form className="card-form" onSubmit={submit}>
        <Feedback error={error} />
        <label>Your name<input autoComplete="name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required maxLength={70} /></label>
        <label>Email<input type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
        <button className="button primary full-width" disabled={busy}>{busy ? "Creating…" : "Create customer account"}</button>
        <div className="form-links"><span>Already have an account? <Link to="/login">Sign in</Link></span></div>
      </form>
    </section>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      setSuccess(await authService.requestPasswordReset(email));
    } catch (issue) {
      setError(issue.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="form-page">
      <div className="form-heading"><span className="eyebrow">No worries</span><h1>Forgot your password?</h1><p>We’ll show the reset flow without sending an email.</p></div>
      <form className="card-form" onSubmit={submit}>
        <Feedback error={error} success={success} />
        <label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <button className="button primary full-width" disabled={busy}>{busy ? "Checking…" : "Continue"}</button>
        <Link to="/reset-password">Go to reset password demo</Link>
      </form>
    </section>
  );
}

export function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      setSuccess(await authService.resetPassword(password, confirmation));
    } catch (issue) {
      setError(issue.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="form-page">
      <div className="form-heading"><span className="eyebrow">Almost there</span><h1>Choose a new password</h1><p>This screen demonstrates validation only; there is no real reset token.</p></div>
      <form className="card-form" onSubmit={submit}>
        <Feedback error={error} success={success} />
        <label>New password<input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required /></label>
        <label>Confirm password<input type="password" autoComplete="new-password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required /></label>
        <button className="button primary full-width" disabled={busy}>{busy ? "Saving…" : "Reset password"}</button>
      </form>
    </section>
  );
}
