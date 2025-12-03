'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

type Mode = 'red-teaming' | 'guardrails' | 'watermarking';

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('red-teaming');
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const modeDescription =
    mode === 'red-teaming'
      ? 'Probe your model for prompt injection, and other adversarial attacks.'
      : mode === 'guardrails'
      ? 'We will provide you with the most efficient guardrail your system needs.'
      : 'Uniquely mark your LLM so no matter who uses it, you\'ll know.';

  return (
    <main className="page">
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon" />
            <span className="logo-text">Phalanx</span>
          </div>

          <div className="account-wrapper" ref={menuRef}>
            <button
              className="account-button"
              onClick={() => setMenuOpen((open) => !open)}
            >
              Account
              <span className={`chevron ${menuOpen ? 'chevron-open' : ''}`}>
                ▼
              </span>
            </button>

            {menuOpen && (
              <div className="dropdown">
                <Link href="/login" className="dropdown-item">
                  <span>Log in</span>
                </Link>

                <Link href="/account" className="dropdown-item">
                  <span>Account settings</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="hero">
        <h1 className="hero-title">Welcome to Phalanx</h1>
        <p className="hero-subtitle">
          Your trusted platform for innovative solutions. We bring together
          cutting-edge technology and exceptional service to help you achieve
          your goals.
        </p>
      </section>

      <section className="features">
        <div className="features-inner">
          <div className="card">
            <h2 className="card-title">Reliable</h2>
            <p className="card-text">
              Built on solid foundations for maximum stability
            </p>
          </div>

          <div className="card">
            <h2 className="card-title">Scalable</h2>
            <p className="card-text">
              Grows with your needs and adapts to change
            </p>
          </div>

          <div className="card">
            <h2 className="card-title">Secure</h2>
            <p className="card-text">
              Protected by industry-leading security measures
            </p>
          </div>
        </div>

        {/* DEMO SECTION WITH BLACK BORDER */}
        <div className="demo-section">
          <div className="demo-container">
            <Link href="/demo" className="demo-card">
              <div className="demo-content">
                <h2 className="demo-title">Demo our service</h2>
                <p className="demo-text">
                  Run a live example and see how Phalanx detects and analyzes
                  jailbreak attempts in real time.
                </p>
              </div>
            </Link>
          </div>

          {/* MODE SLIDER – SEPARATE FROM DEMO BUTTON */}
          <div className="mode-section">
            <div className="mode-card">
              <div className="mode-header">
                <span className="mode-label"></span>
              </div>
              <div className="mode-options">
                <button
                  type="button"
                  className={`mode-option ${
                    mode === 'red-teaming' ? 'mode-option-active' : ''
                  }`}
                  onClick={() => setMode('red-teaming')}
                >
                  Red teaming
                </button>
                <button
                  type="button"
                  className={`mode-option ${
                    mode === 'guardrails' ? 'mode-option-active' : ''
                  }`}
                  onClick={() => setMode('guardrails')}
                >
                  Guardrails
                </button>
                <button
                  type="button"
                  className={`mode-option ${
                    mode === 'watermarking' ? 'mode-option-active' : ''
                  }`}
                  onClick={() => setMode('watermarking')}
                >
                  Watermarking
                </button>
              </div>
              <p className="mode-description">{modeDescription}</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        © 2025 Phalanx. All rights reserved.
      </footer>

      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
            sans-serif;
          color: #111827;
          background: #ffffff;
        }

        .page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        .header {
          border-bottom: 1px solid #e5e7eb;
          background: #ffffff;
        }

        .header-inner {
          max-width: 960px;
          margin: 0 auto;
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-icon {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: 2px solid #111827;
        }

        .logo-text {
          font-size: 18px;
          font-weight: 600;
        }

        .account-wrapper {
          position: relative;
        }

        .account-button {
          border-radius: 9999px;
          border: 1px solid #d1d5db;
          padding: 6px 14px;
          font-size: 14px;
          background: #f9fafb;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .account-button:hover {
          background: #f3f4f6;
        }

        .chevron {
          font-size: 10px;
          transition: transform 0.15s ease-out;
        }

        .chevron-open {
          transform: rotate(-180deg);
        }

        .dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          min-width: 180px;
          background: #ffffff;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
          padding: 6px 0;
          z-index: 20;
          display: flex;
          flex-direction: column;
        }

        .dropdown-item {
          display: block;
          padding: 8px 14px;
          font-size: 14px;
          text-decoration: none;
          color: #111827;
        }

        .dropdown-item:hover {
          background: #f9fafb;
        }

        .hero {
          max-width: 960px;
          margin: 0 auto;
          padding: 56px 24px 32px;
          text-align: center;
        }

        .hero-title {
          font-size: 32px;
          font-weight: 600;
          margin: 0 0 16px;
        }

        .hero-subtitle {
          max-width: 640px;
          margin: 0 auto;
          font-size: 15px;
          line-height: 1.6;
          color: #4b5563;
        }

        .features {
          max-width: 960px;
          margin: 0 auto;
          padding: 16px 24px 48px;
        }

        .features-inner {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .card {
          border-radius: 16px;
          border: 1px solid #000000ff;
          padding: 24px 20px;
          background: #ffffff;
        }

        .card-title {
          margin: 0 0 8px;
          font-size: 16px;
          font-weight: 600;
        }

        .card-text {
          margin: 0;
          font-size: 14px;
          line-height: 1.5;
          color: #4b5563;
        }

        /* ---------------- DEMO SECTION ---------------- */

        .demo-section {
          margin-top: 50px;
          padding: 10px 1px;  /* nearly touching */
          border: 2px solid #000;
          border-radius: 10px;
          background: #fff;
        }

        .demo-container {
          display: flex;
          justify-content: center;
        }

        .demo-card {
          position: relative;
          display: block;
          min-width: 200px;
          max-width: 400px;
          border-radius: 18px;
          padding: 18px 24px;
          text-decoration: none;
          background: #ffffff;
          color: #111827;
          border: 2px solid #000000;
          cursor: pointer;
          transition: transform 0.18s ease-out, box-shadow 0.18s ease-out;
        }

        .demo-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
        }

        .demo-title {
          margin: 0 0 6px;
          font-size: 18px;
          font-weight: 600;
          color: #111827;
        }

        .demo-text {
          margin: 0;
          font-size: 14px;
          color: #4b5563;
          line-height: 1.4;
        }

        /* ---------------- MODE SLIDER SECTION ---------------- */

        .mode-section {
          margin-top: 24px;
          display: flex;
          justify-content: center;
        }

        .mode-card {
          width: 100%;
          max-width: 480px;
          border-radius: 16px;
          border: 1px solid #000000;
          background: #ffffff;
          padding: 16px 18px 14px;
          box-sizing: border-box;
        }

        .mode-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .mode-label {
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #4b5563;
        }

        .mode-options {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          border-radius: 9999px;
          border: 1px solid #000000;
          overflow: hidden;
        }

        .mode-option {
          padding: 6px 8px;
          font-size: 13px;
          background: #ffffff;
          color: #111827;
          border: none;
          border-right: 1px solid #000000;
          cursor: pointer;
          line-height: 1.2;
        }

        .mode-option:last-child {
          border-right: none;
        }

        .mode-option-active {
          background: #111827;
          color: #ffffff;
        }

        .mode-description {
          margin: 10px 2px 0;
          font-size: 13px;
          line-height: 1.5;
          color: #111827;
        }

        /* ------------------------------------------------ */

        .footer {
          margin-top: auto;
          padding: 24px 16px 32px;
          font-size: 13px;
          text-align: center;
          color: #6b7280;
          border-top: 1px solid #f3f4f6;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 26px;
          }

          .features-inner {
            grid-template-columns: 1fr;
          }

          .demo-card {
            width: 100%;
          }

          .mode-card {
            max-width: 100%;
          }
        }
      `}</style>
    </main>
  );
}
/*import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.js file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}*/
