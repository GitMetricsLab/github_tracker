import { useState, ChangeEvent } from "react";
import { Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rp-root {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f4f0;
    font-family: 'DM Sans', sans-serif;
    padding: 24px;
  }

  .rp-card {
    width: 100%;
    max-width: 420px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 24px 80px rgba(0,0,0,0.12), 0 4px 20px rgba(0,0,0,0.06);
    animation: rp-rise 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes rp-rise {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .rp-hero {
    background: #1a1a2e;
    padding: 36px 32px 32px;
    position: relative;
    overflow: hidden;
  }

  .rp-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 80% at 10% 110%, rgba(124,58,237,0.35) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 90% -10%, rgba(99,102,241,0.2) 0%, transparent 55%);
    pointer-events: none;
  }

  .rp-hero-orb {
    position: absolute;
    top: -40px;
    right: -40px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%);
  }

  .rp-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    position: relative;
    animation: rp-fade 0.5s 0.1s both;
  }

  @keyframes rp-fade {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .rp-brand-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #7c3aed, #6366f1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rp-brand-icon svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: #fff;
    stroke-width: 2;
    stroke-linecap: round;
  }

  .rp-brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.04em;
  }

  .rp-hero-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #a78bfa;
    margin-bottom: 6px;
    position: relative;
    animation: rp-fade 0.5s 0.18s both;
  }

  .rp-hero-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    line-height: 1.15;
    position: relative;
    animation: rp-fade 0.5s 0.24s both;
  }

  .rp-hero-sub {
    font-size: 13px;
    color: #8b8fa8;
    margin-top: 8px;
    line-height: 1.5;
    position: relative;
    animation: rp-fade 0.5s 0.3s both;
  }

  .rp-hero-dots {
    display: flex;
    gap: 6px;
    margin-top: 20px;
    position: relative;
    animation: rp-fade 0.5s 0.36s both;
  }

  .rp-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: rgba(255,255,255,0.15);
  }
  .rp-dot.active { background: #7c3aed; width: 18px; border-radius: 3px; }

  .rp-form {
    background: #fff;
    padding: 28px 32px 32px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .rp-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .rp-field {
    display: flex;
    flex-direction: column;
    gap: 6px;
    animation: rp-fade 0.4s both;
  }

  .rp-field:nth-child(1) { animation-delay: 0.32s; }
  .rp-field:nth-child(2) { animation-delay: 0.38s; }
  .rp-row + .rp-field:nth-child(1) { animation-delay: 0.44s; }

  .rp-label {
    font-size: 11.5px;
    font-weight: 500;
    color: #374151;
    letter-spacing: 0.01em;
  }

  .rp-input-wrap {
    position: relative;
  }

  .rp-input {
    width: 100%;
    height: 42px;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    background: #fafafa;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: #111;
    padding: 0 12px 0 38px;
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
  }

  .rp-input:focus {
    border-color: #7c3aed;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
  }

  .rp-input.no-icon {
    padding-left: 12px;
  }

  .rp-input-icon {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
    display: flex;
    align-items: center;
    pointer-events: none;
    transition: color 0.18s;
  }

  .rp-input-wrap:focus-within .rp-input-icon {
    color: #7c3aed;
  }

  .rp-eye {
    position: absolute;
    right: 11px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    display: flex;
    padding: 2px;
    transition: color 0.18s;
  }
  .rp-eye:hover { color: #6b7280; }

  .rp-btn {
    width: 100%;
    height: 46px;
    background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    letter-spacing: 0.01em;
    transition: transform 0.15s, box-shadow 0.15s, filter 0.15s;
    box-shadow: 0 4px 16px rgba(124,58,237,0.3);
    animation: rp-fade 0.4s 0.5s both;
    margin-top: 2px;
  }

  .rp-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(124,58,237,0.35);
    filter: brightness(1.05);
  }

  .rp-btn:active {
    transform: translateY(0);
    box-shadow: 0 2px 8px rgba(124,58,237,0.25);
  }

  .rp-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  .rp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    animation: rp-fade 0.4s 0.54s both;
  }

  .rp-divider hr {
    flex: 1;
    border: none;
    border-top: 1px solid #f0f0f0;
  }

  .rp-divider span {
    font-size: 11.5px;
    color: #b0b3bd;
    white-space: nowrap;
  }

  .rp-social {
    display: flex;
    gap: 10px;
    animation: rp-fade 0.4s 0.58s both;
  }

  .rp-social-btn {
    flex: 1;
    height: 40px;
    border: 1.5px solid #e5e7eb;
    border-radius: 10px;
    background: #fff;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #374151;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    transition: border-color 0.15s, background 0.15s, transform 0.12s;
  }

  .rp-social-btn:hover {
    border-color: #d1d5db;
    background: #fafafa;
    transform: translateY(-1px);
  }

  .rp-social-btn:active { transform: translateY(0); }

  .rp-footer {
    text-align: center;
    font-size: 13px;
    color: #9ca3af;
    animation: rp-fade 0.4s 0.62s both;
  }

  .rp-footer button {
    background: none;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: #7c3aed;
    cursor: pointer;
    padding: 0;
    transition: color 0.15s;
  }
  .rp-footer button:hover { color: #6d28d9; text-decoration: underline; }

  .rp-terms {
    font-size: 11px;
    color: #c4c7d0;
    text-align: center;
    line-height: 1.6;
    animation: rp-fade 0.4s 0.48s both;
  }
  .rp-terms a { color: #a78bfa; text-decoration: none; }
  .rp-terms a:hover { text-decoration: underline; }

  .rp-error {
    font-size: 11px;
    color: #ef4444;
    margin-top: 2px;
  }

  .rp-success {
    background: #fff;
    padding: 48px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    text-align: center;
    animation: rp-rise 0.4s both;
  }

  .rp-success-icon {
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7c3aed22, #6366f122);
    border: 2px solid #7c3aed44;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
  }

  .rp-success-title {
    font-family: 'Syne', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #1a1a2e;
  }

  .rp-success-sub {
    font-size: 13px;
    color: #9ca3af;
    line-height: 1.6;
  }
`;

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

interface IconEyeProps {
  open: boolean;
}

function IconUser(): JSX.Element {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  );
}

function IconMail(): JSX.Element {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/>
    </svg>
  );
}

function IconLock(): JSX.Element {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="11" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
    </svg>
  );
}

function IconEye({ open }: IconEyeProps): JSX.Element {
  return open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 7 10 7a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
}

function IconArrow(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  );
}

function IconCheck(): JSX.Element {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

function GoogleIcon(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function GitHubIcon(): JSX.Element {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#24292e">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  );
}

export default function RegisterPage(): JSX.Element {
  const [form, setForm] = useState<FormState>({ firstName: "", lastName: "", email: "", password: "" });
  const [showPass, setShowPass] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
    if (form.password.length < 8) e.password = "Min 8 characters";
    return e;
  };

  const handleChange = (field: keyof FormState) => (ev: ChangeEvent<HTMLInputElement>): void => {
    setForm((f) => ({ ...f, [field]: ev.target.value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const handleSubmit = async (): Promise<void> => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    await new Promise<void>((r) => setTimeout(r, 1400));
    setLoading(false);
    setSuccess(true);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="rp-root">
        <div className="rp-card">
          <div className="rp-hero">
            <div className="rp-hero-orb" />
            <div className="rp-brand">
              <div className="rp-brand-icon">
                <img src="crl.png" alt="logo" width={20} height={20} />
              </div>
              <span className="rp-brand-name">GitHub Tracker</span>
            </div>
            <div className="rp-hero-label">Welcome to</div>
            <div className="rp-hero-title">Your new<br/>workspace</div>
            <div className="rp-hero-sub">Create your account and start building something great today.</div>
            <div className="rp-hero-dots">
              <div className="rp-dot active" />
              <div className="rp-dot" />
              <div className="rp-dot" />
            </div>
          </div>

          {success ? (
            <div className="rp-success">
              <div className="rp-success-icon"><IconCheck /></div>
              <div className="rp-success-title">Account created!</div>
              <div className="rp-success-sub">Welcome to GitHub Tracker, {form.firstName}.<br/>Check your email to verify your account.</div>
            </div>
          ) : (
            <div className="rp-form">
              <div className="rp-row">
                <div className="rp-field">
                  <label className="rp-label">First name</label>
                  <div className="rp-input-wrap">
                    <span className="rp-input-icon"><IconUser /></span>
                    <input
                      className="rp-input"
                      type="text"
                      placeholder="Jane"
                      value={form.firstName}
                      onChange={handleChange("firstName")}
                    />
                  </div>
                  {errors.firstName && <span className="rp-error">{errors.firstName}</span>}
                </div>
                <div className="rp-field">
                  <label className="rp-label">Last name</label>
                  <div className="rp-input-wrap">
                    <span className="rp-input-icon"><IconUser /></span>
                    <input
                      className="rp-input"
                      type="text"
                      placeholder="Doe"
                      value={form.lastName}
                      onChange={handleChange("lastName")}
                    />
                  </div>
                  {errors.lastName && <span className="rp-error">{errors.lastName}</span>}
                </div>
              </div>

              <div className="rp-field">
                <label className="rp-label">Email address</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon"><IconMail /></span>
                  <input
                    className="rp-input"
                    type="email"
                    placeholder="jane@example.com"
                    value={form.email}
                    onChange={handleChange("email")}
                  />
                </div>
                {errors.email && <span className="rp-error">{errors.email}</span>}
              </div>

              <div className="rp-field">
                <label className="rp-label">Password</label>
                <div className="rp-input-wrap">
                  <span className="rp-input-icon"><IconLock /></span>
                  <input
                    className="rp-input"
                    type={showPass ? "text" : "password"}
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={handleChange("password")}
                  />
                  <button className="rp-eye" onClick={() => setShowPass((v) => !v)} aria-label="Toggle password">
                    <IconEye open={showPass} />
                  </button>
                </div>
                {errors.password && <span className="rp-error">{errors.password}</span>}
              </div>

              <p className="rp-terms">
                By creating an account you agree to our{" "}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </p>

              <button className="rp-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? "Creating account…" : "Create account"}
                {!loading && <IconArrow />}
              </button>

              <div className="rp-divider">
                <hr /><span>or continue with</span><hr />
              </div>

              <p className="rp-footer">
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#7c3aed", fontWeight: 500, textDecoration: "none" }}>
                  Sign in
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
