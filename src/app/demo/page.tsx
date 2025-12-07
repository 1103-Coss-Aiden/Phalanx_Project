// Portions of this file were developed with assistance from ChatGPT (OpenAI)
// All final implementation and verification by John Althoff

'use client';

import Link from 'next/link';
import { useState, DragEvent } from 'react';

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'api'>('upload');
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
  }

  return (
    <main className="page">
      {/* HEADER */}
      <header className="topbar">
        {/* BLACK ARROW BUTTON */}
        <Link href="/" className="back-button">
          ←
        </Link>

        <div className="title-block">
          <div className="logo-icon">
            <span className="shield" />
          </div>
          <div>
            <h1 className="title">Add Model</h1>
            <p className="subtitle">
              Upload a model file or connect via API endpoint
            </p>
          </div>
        </div>
      </header>

      <section className="content">
        {/* TAB SWITCHER */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'upload' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            📁 Upload Model File
          </button>

          <button
            className={`tab ${activeTab === 'api' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('api')}
          >
            🧩 API Endpoint
          </button>
        </div>

        {/* UPLOAD TAB */}
        {activeTab === 'upload' && (
          <div className="card">
            <h2 className="card-title">Model File Upload</h2>
            <p className="card-description">
              Upload a local model file to analyze its security posture.
              Supported formats: .bin, .safetensors, .gguf, .pt, .pth
            </p>

            <div
              className={`dropzone ${isDragOver ? 'dropzone-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input type="file" className="file-input" />

              <div className="upload-icon-wrapper">
                <div className="upload-icon">
                  <span className="upload-arrow">↑</span>
                </div>
              </div>

              <p className="drop-main-text">
                Drag and drop your model file here, or
              </p>

              <button type="button" className="browse-button">
                browse files
              </button>

              <p className="drop-sub-text">Maximum file size: 10 GB</p>
            </div>

            <div className="field">
              <label className="label">
                Model Name <span className="required">*</span>
              </label>
              <input
                className="input"
                placeholder="e.g., Helios-7B"
                type="text"
              />
            </div>

            <div className="field">
              <label className="label">Description (Optional)</label>
              <textarea
                className="textarea"
                placeholder="Provide details about this model..."
                rows={4}
              />
            </div>

            {/* SUBMIT BUTTON */}
            <Link href="/report" className="submit-button">
              Submit Model
            </Link>
          </div>
        )}

        {/* API ENDPOINT TAB */}
        {activeTab === 'api' && (
          <div className="card">
            <h2 className="card-title">Connect via API Endpoint</h2>
            <p className="card-description">
              Provide your API endpoint details to connect a remote model for
              analysis.
            </p>

            <div className="field">
              <label className="label">
                Endpoint URL <span className="required">*</span>
              </label>
              <input
                className="input"
                type="text"
                placeholder="https://api.yourmodel.com/v1/generate"
              />
            </div>

            <div className="field">
              <label className="label">API Key (Optional)</label>
              <input className="input" type="text" placeholder="sk-xxxx" />
            </div>

            <div className="field">
              <label className="label">Model Name (Optional)</label>
              <input
                className="input"
                type="text"
                placeholder="e.g., Custom-LLM"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <Link href="/report" className="submit-button">
              Submit API Model
            </Link>
          </div>
        )}
      </section>

      {/* STYLES */}
      <style jsx global>{`
        body {
          margin: 0;
          font-family: system-ui, sans-serif;
          background: #f5f5f7;
        }

        .page {
          min-height: 100vh;
        }

        .topbar {
          padding-left: 80px;
          position: relative;
          max-width: 900px;
          margin: 0 auto;
          padding: 40px;
          display: flex;
          align-items: center;
          gap: 16px;
        }

        a.back-button {
          top: 30px;
          left: 16px;
          font-size: 40px;
          text-decoration: none;
          color: #000 !important;
          background: transparent;
          border: none;
        }

        .title-block {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: #020617;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .shield {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid #ffffffff;
        }

        .title {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #000000ff;
        }

        .subtitle {
          margin: 2px 0 0;
          font-size: 13px;
          color: #000000ff;
        }

        .content {
          max-width: 960px;
          margin: 0 auto;
          padding: 8px 24px 40px;
        }

        .tabs {
          display: flex;
          border-radius: 999px;
          padding: 4px;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          margin-bottom: 24px;
        }

        .tab {
          flex: 1;
          border: none;
          border-radius: 999px;
          padding: 10px 16px;
          font-size: 14px;
          background: transparent;
          cursor: pointer;
          color: #000000ff;
        }

        .tab-active {
          background: #fff;
          box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08);
          color: #111;
        }

        .card {
          background: #fff;
          border-radius: 20px;
          padding: 24px 24px 28px;
          box-shadow: 0 18px 45px rgba(15, 23, 42, 0.08);
          border: 1px solid #f3f4f6;
        }

        .card-title {
          margin: 0 0 8px;
          font-size: 18px;
          font-weight: 600;
          color: #000000ff;
        }

        .card-description {
          margin: 0 0 24px;
          font-size: 14px;
          color: #4b5563;
        }

        .dropzone {
          border-radius: 16px;
          border: 2px dashed #e5e7eb;
          padding: 40px 24px;
          text-align: center;
          margin-bottom: 24px;
          background: #fafafa;
          position: relative;
          color: #111;
        }

        .dropzone-active {
          border-color: #4f46e5;
          background: #eef2ff;
        }

        .file-input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }

        .upload-icon {
          width: 64px;
          height: 64px;
          background: #c9c9c9ff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }

        .upload-arrow {
          font-size: 22px;
          color: #000000ff !important;
        }

        .browse-button {
          background: none;
          border: none;
          color: #111;
          font-weight: 600;
          text-decoration: underline;
          cursor: pointer;
        }

        .field {
          margin-top: 20px;
        }

        .label {
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 6px;
          display: block;
          color: #111;
        }

        .required {
          color: red;
        }

        .input,
        .textarea {
          color: #111;
          width: 100%;
          border-radius: 10px;
          border: 1px solid #e5e7eb;
          padding: 10px 12px;
          font-size: 14px;
          background: #f9fafb;
        }

        .textarea {
          resize: vertical;
          border-radius: 12px;
        }

        .input:focus,
        .textarea:focus {
          outline: none;
          border-color: #000000ff;
          background: #ffffffff;
        }

        a.submit-button {
          margin-top: 30px;
          display: block;
          width: 100%;
          text-align: center;
          padding: 12px 0;
          border-radius: 12px;
          border: 1px solid #000000;
          background: #000000;
          color: #ffffff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.2s ease;
        }
      `}</style>
    </main>
  );
}

