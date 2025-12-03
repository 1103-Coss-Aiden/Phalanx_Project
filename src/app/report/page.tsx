'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type FileFormat = 'pdf' | 'csv';
type DateRange = '7' | '30' | '90';

type ReportData = {
  title?: string;
  subtitle?: string;
  generatedAt?: string;
  filters?: {
    dateRangeLabel?: string;
  };
  summaryMetrics?: {
    totalTests?: string | null;
    avgASR?: string | null;
    defenseRate?: string | null;
  };
  performanceMetrics?: {
    asr?: string | null;
    defenseRate?: string | null;
    avgResponseTime?: string | null;
    testsConducted?: string | null;
  };
};

export default function Page() {
  const router = useRouter();
  const [fileFormat, setFileFormat] = useState<FileFormat>('pdf');
  const [dateRange, setDateRange] = useState<DateRange>('30');

  // Replace with real data once available
  const report: ReportData | null = null;

  // Helper so TypeScript stops complaining
  const hasReport = !!report;
  const safeReport: ReportData = report ?? {};

  const activeSectionCount = 5; // We always show all 5 sections now

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-8 text-slate-900">
      {/* Top header */}
      <header className="mx-auto flex max-w-6xl items-center gap-3 pb-6">
        <button
          onClick={() => router.push('/demo')}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-sm transition hover:bg-slate-100 hover:border-slate-300 hover:ring-2 hover:ring-slate-300/50 hover:shadow-sm"
        >
          ←
        </button>
        <div>
          <h1 className="text-lg font-semibold">Export Report</h1>
          <p className="text-sm text-slate-500">
            Generate and download security evaluation reports
          </p>
        </div>
      </header>

      <section className="mx-auto flex max-w-6xl flex-col gap-6 lg:flex-row">
        {/* LEFT: configuration */}
        <aside className="w-full shrink-0 space-y-6 lg:w-80">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-semibold">Report Configuration</h2>

            {/* File format */}
            <div className="mt-5 space-y-1">
              <label className="text-xs font-medium text-slate-600">
                File Format<span className="text-red-500">*</span>
              </label>
              <select
                value={fileFormat}
                onChange={e => setFileFormat(e.target.value as FileFormat)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-slate-900"
              >
                <option value="pdf">PDF Document</option>
                <option value="csv">CSV Export</option>
              </select>
            </div>

            {/* Date range */}
            <div className="mt-4 space-y-1">
              <label className="text-xs font-medium text-slate-600">
                Date Range
              </label>
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value as DateRange)}
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
          </div>
        </aside>

        {/* RIGHT: preview */}
        <div className="flex-1 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-sm font-semibold">Report Preview</h2>
              <p className="text-xs text-slate-500">
                Phalanx Security Report · LLM jailbreak evaluation summary
              </p>
            </div>
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600">
              {activeSectionCount} section
            </span>
          </div>

          {/* If NO report data is available: show empty/“not ready” state */}
          {!hasReport && (
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
              <div className="text-xl font-semibold text-slate-800">
                Report Not Ready
              </div>
              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                Your report has not been generated yet. Once new security
                evaluations are completed, you&apos;ll be able to preview and
                export your report from this page.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                <span className="text-lg">⏳</span>
                Waiting for report data…
              </div>
            </div>
          )}

          {/* If report EXISTS: show the full preview UI */}
          {hasReport && (
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold">
                    {safeReport.title ?? 'Phalanx Security Report'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {safeReport.subtitle ?? 'Your report has yet to come in.'}
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div>
                    Generated:{' '}
                    {safeReport.generatedAt ?? 'Report has yet to come in'}
                  </div>
                  <div>
                    Format: {fileFormat === 'pdf' ? 'PDF' : 'CSV'}
                  </div>
                </div>
              </div>

              {/* Filters row */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
                  🗓
                  {safeReport.filters?.dateRangeLabel ??
                    (dateRange === '7'
                      ? 'Last 7 days'
                      : dateRange === '30'
                      ? 'Last 30 days'
                      : 'Last 90 days')}
                </span>
              </div>

              {/* Executive summary */}
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold">Executive Summary</h4>
                    <p className="mt-0.5 text-xs text-slate-500">
                      High-level overview of security posture
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <SummaryStat
                    label="Total Tests"
                    value={safeReport.summaryMetrics?.totalTests ?? null}
                  />
                  <SummaryStat
                    label="Avg ASR"
                    value={safeReport.summaryMetrics?.avgASR ?? null}
                  />
                  <SummaryStat
                    label="Defense Rate"
                    value={safeReport.summaryMetrics?.defenseRate ?? null}
                  />
                </div>
              </div>

              {/* Model performance metrics */}
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
                <h4 className="text-xs font-semibold">
                  Model Performance Metrics
                </h4>
                <p className="mt-0.5 text-xs text-slate-500">
                  ASR, defense rates, and performance statistics
                </p>

                <dl className="mt-4 space-y-2 text-xs">
                  <Row
                    label="Attack Success Rate (ASR)"
                    value={safeReport.performanceMetrics?.asr ?? null}
                  />
                  <Row
                    label="Defense Success Rate"
                    value={safeReport.performanceMetrics?.defenseRate ?? null}
                  />
                  <Row
                    label="Average Response Time"
                    value={
                      safeReport.performanceMetrics?.avgResponseTime ?? null
                    }
                  />
                  <Row
                    label="Tests Conducted"
                    value={
                      safeReport.performanceMetrics?.testsConducted ?? null
                    }
                  />
                </dl>
              </div>

              {/* Attack Analysis */}
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
                <h4 className="text-xs font-semibold text-slate-800">
                  Attack Analysis
                </h4>
                <p className="mt-1">
                  Breakdown by attack type and category. Your report has yet to
                  come in for this section.
                </p>
              </div>

              {/* Vulnerability Details */}
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
                <h4 className="text-xs font-semibold text-slate-800">
                  Vulnerability Details
                </h4>
                <p className="mt-1">
                  Specific vulnerabilities and recommendations will populate here
                  as new findings are generated. Your report has yet to come in.
                </p>
              </div>

              {/* Metadata */}
              <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4 text-xs text-slate-500">
                <h4 className="text-xs font-semibold text-slate-800">
                  Appendix & Metadata
                </h4>
                <p className="mt-1">
                  Raw metrics, configurations, and notes will be attached once a
                  report is available. Your report has yet to come in.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

/* ---------- small helper components ---------- */

function SummaryStat(props: { label: string; value?: string | null }) {
  const hasValue =
    props.value !== null && props.value !== undefined && props.value !== '';

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
      <div className="text-[11px] text-slate-500">{props.label}</div>
      <div className="mt-1 text-lg font-semibold">
        {hasValue ? (
          props.value
        ) : (
          <span className="text-xs font-normal text-slate-400">
            Your report has yet to come in
          </span>
        )}
      </div>
    </div>
  );
}

function Row(props: { label: string; value?: string | null }) {
  const hasValue =
    props.value !== null && props.value !== undefined && props.value !== '';

  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-600">{props.label}</dt>
      <dd className="font-medium text-slate-900">
        {hasValue ? (
          props.value
        ) : (
          <span className="text-[11px] font-normal text-slate-400">
            Your report has yet to come in
          </span>
        )}
      </dd>
    </div>
  );
}
