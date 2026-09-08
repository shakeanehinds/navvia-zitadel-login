"use client";

import { ReactNode, useEffect, useState } from "react";

const SYSTEM_STATUSES = [
  "Connecting to satellites",
  "Triangulating vehicle location",
  "Securing your connection",
  "Checking vehicle signal",
] as const;

export function NavviaLoginShell({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  const [headerStatus, setHeaderStatus] = useState("Connecting");
  const [systemStatusIndex, setSystemStatusIndex] = useState(0);

  useEffect(() => {
    const inviteStatus = window.setTimeout(() => setHeaderStatus("Invite-only beta"), 1_300);
    const statusCycle = window.setInterval(() => {
      setSystemStatusIndex((current) => (current + 1) % SYSTEM_STATUSES.length);
    }, 4_400);

    return () => {
      window.clearTimeout(inviteStatus);
      window.clearInterval(statusCycle);
    };
  }, []);

  const systemStatus = SYSTEM_STATUSES[systemStatusIndex];

  return (
    <>
      <a className="navvia-login-skip" href="#navvia-login-content">
        Skip to sign in
      </a>
      <main className="navvia-login-shell" data-theme="light" id="navvia-login-content">
        <header className="navvia-login-intro">
          <p className="navvia-login-brand">NAVVIA</p>
          <p className="navvia-login-status">
            <span aria-hidden className="navvia-login-status-dot" />
            {headerStatus}
          </p>
          <h1>Protecting what matters to you.</h1>
          <p className="navvia-login-detail">Sign in to your private command center.</p>
        </header>

        <div aria-hidden className="navvia-login-stage" />

        <section className="navvia-login-route">{children}</section>

        <div className="navvia-login-meta">
          {footer}
          <p aria-live="polite" className="navvia-login-system-status" key={systemStatus}>
            {Array.from(systemStatus).map((character, index) => (
              <span key={`${character}-${index}`} style={{ animationDelay: `${index * 45}ms` }}>
                {character}
              </span>
            ))}
          </p>
        </div>
      </main>
    </>
  );
}
