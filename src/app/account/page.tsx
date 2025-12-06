'use client';

export default function AccountSettingsPage() {
  return (
    <main className="settings-page">
      <div className="settings-container">
        {/* Top title */}
        <h1 className="page-title">Settings</h1>

        {/* Header card */}
        <section className="header-card">
          <button
            className="back-button"
            onClick={() => window.history.back()}
            aria-label="Go back"
          >
            ←
          </button>
          <div className="header-icon">
            <span className="header-icon-inner">🛡️</span>
          </div>
          <div className="header-text">
            <h2 className="header-title">Settings</h2>
            <p className="header-subtitle">
              Manage your account and preferences
            </p>
          </div>
        </section>

        {/* Account information card */}
        <section className="card">
          <h3 className="card-title">Account Information</h3>

          <div className="field-group">
            <label className="field-label">Full Name</label>
            <input
              className="field-input"
              type="text"
              defaultValue="Blank"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Email Address</label>
            <input
              className="field-input"
              type="email"
              defaultValue="Blank@phalanx.com"
            />
          </div>

          <div className="field-group">
            <label className="field-label">Company</label>
            <input
              className="field-input"
              type="text"
              defaultValue="Blank Security Inc."
            />
          </div>

          <div className="button-row">
            <button className="btn-primary">✔ Save Changes</button>
            <button className="btn-ghost">Cancel</button>
          </div>
        </section>
      </div>

      {}
      <style jsx global>{`
        body {
          margin: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
            sans-serif;
          background: #f9fafb;
          color: #111827;
        }

        .settings-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          padding: 32px 16px 40px;
          background: #f9fafb;
        }

        .settings-container {
          width: 100%;
          max-width: 960px;
        }

        .page-title {
          text-align: center;
          font-size: 28px;
          font-weight: 600;
          margin: 0 0 24px;
        }

        .header-card {
          display: grid;
          grid-template-columns: auto auto 1fr;
          align-items: center;
          gap: 12px;
          background: #ffffff;
          border-radius: 24px;
          padding: 16px 20px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
          margin-bottom: 16px;
        }

        .back-button {
          border-radius: 9999px;
          border: none;
          background: transparent;
          font-size: 20px;
          cursor: pointer;
          padding: 4px 8px;
        }

        .header-icon {
          width: 40px;
          height: 40px;
          border-radius: 9999px;
          background: #0f172a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-icon-inner {
          font-size: 20px;
        }

        .header-text {
          display: flex;
          flex-direction: column;
        }

        .header-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }

        .header-subtitle {
          margin: 2px 0 0;
          font-size: 13px;
          color: #6b7280;
        }

        .card {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid #e5e7eb;
          padding: 20px 24px 24px;
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
          margin-bottom: 18px;
        }

        .card-title {
          margin: 0 0 18px;
          font-size: 17px;
          font-weight: 600;
        }

        .field-group {
          margin-bottom: 16px;
        }

        .field-label {
          display: block;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .field-input {
          width: 100%;
          padding: 10px 12px;
          border-radius: 9999px;
          border: none;
          background: #f3f4f6;
          font-size: 14px;
          outline: none;
        }

        .field-input:focus {
          box-shadow: 0 0 0 1px #111827;
          background: #f9fafb;
        }

        .button-row {
          display: flex;
          gap: 8px;
          margin-top: 12px;
        }

        .btn-primary {
          border-radius: 9999px;
          border: none;
          padding: 8px 16px;
          background: #020617;
          color: #ffffff;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-primary:hover {
          background: #0f172a;
        }

        .btn-ghost {
          border-radius: 9999px;
          border: 1px solid #e5e7eb;
          padding: 8px 16px;
          background: #ffffff;
          font-size: 14px;
          cursor: pointer;
        }

        .btn-ghost:hover {
          background: #f9fafb;
        }

        @media (max-width: 768px) {
          .settings-page {
            padding-top: 24px;
          }

          .header-card {
            grid-template-columns: auto 1fr;
            grid-template-rows: auto auto;
          }

          .header-icon {
            grid-row: span 2;
          }
        }
      `}</style>
    </main>
  );
}
