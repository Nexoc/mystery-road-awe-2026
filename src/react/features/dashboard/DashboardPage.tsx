import type { ReactNode } from "react";
import { debugLog } from "../../../shared/debug.js";
import type {
  CaseData,
  Evidence,
  InvestigationData,
  TimelineEvent,
} from "../../../types.js";

type DashboardPageProps = Readonly<{
  data: InvestigationData;
}>;

type CaseSummaryProps = Readonly<{
  caseData: CaseData;
}>;

type DashboardStatsProps = Readonly<{
  evidenceCount: number;
  peopleCount: number;
  locationCount: number;
  bookmarkCount: number;
  reviewedCount: number;
}>;

type StatCardProps = Readonly<{
  label: string;
  value: number;
}>;

type ReviewProgressProps = Readonly<{
  reviewedCount: number;
  totalCount: number;
  percentage: number;
}>;

type RecentEvidenceProps = Readonly<{
  evidence: readonly Evidence[];
}>;

type RecentTimelineProps = Readonly<{
  timeline: readonly TimelineEvent[];
}>;

type PanelProps = Readonly<{
  title: string;
  children: ReactNode;
}>;

function getStatusBadgeClass(status: string): string {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "reviewed") return "badge-reviewed";
  if (normalizedStatus === "flagged") return "badge-flagged";

  return "badge-unreviewed";
}

function formatDate(timestamp: string): string {
  if (!timestamp) return "Unknown date";

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) return timestamp;

  const datePart = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const timePart = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${datePart} ${timePart}`;
}

function CaseSummary({ caseData }: CaseSummaryProps) {
  return (
    <div className="case-summary-card">
      <h3>{caseData.title}</h3>
      <p>
        <span className="badge badge-flagged">
          {caseData.status.toUpperCase()}
        </span>
      </p>
      <p>{caseData.summary}</p>
    </div>
  );
}

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function DashboardStats({
  evidenceCount,
  peopleCount,
  locationCount,
  bookmarkCount,
  reviewedCount,
}: DashboardStatsProps) {
  const stats = [
    { label: "Evidence items", value: evidenceCount },
    { label: "People", value: peopleCount },
    { label: "Locations", value: locationCount },
    { label: "Bookmarked", value: bookmarkCount },
    { label: "Reviewed", value: reviewedCount },
  ];

  return (
    <div className="stat-grid">
      {stats.map((stat) => (
        <StatCard key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
}

function ReviewProgress({
  reviewedCount,
  totalCount,
  percentage,
}: ReviewProgressProps) {
  return (
    <div className="dashboard-panel">
      <h3>Review progress</h3>
      <div
        className="progress-bar-outer"
        role="progressbar"
        aria-label="Evidence review progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
      >
        <div
          className="progress-bar-inner"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p>
        {percentage}% of evidence reviewed ({reviewedCount} of {totalCount})
      </p>
    </div>
  );
}

function Panel({ title, children }: PanelProps) {
  return (
    <div className="dashboard-panel">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function RecentEvidence({ evidence }: RecentEvidenceProps) {
  if (evidence.length === 0) {
    return <p>No evidence loaded yet.</p>;
  }

  return (
    <>
      {evidence.map((item) => (
        <div className="mini-list-item" key={item.id}>
          <strong>{item.id}</strong> &mdash; {item.title}{" "}
          <span className={`badge ${getStatusBadgeClass(item.status)}`}>
            {item.status}
          </span>
        </div>
      ))}
    </>
  );
}

function RecentTimeline({ timeline }: RecentTimelineProps) {
  if (timeline.length === 0) {
    return <p>No timeline events loaded yet.</p>;
  }

  return (
    <>
      {timeline.map((event) => (
        <div className="mini-list-item" key={event.id}>
          <strong>{formatDate(event.time)}</strong>
          <br />
          {event.title}
        </div>
      ))}
    </>
  );
}

export function DashboardPage({ data }: DashboardPageProps) {
  const reviewedCount = data.evidence.filter(
    (item) => item.status.toLowerCase() === "reviewed",
  ).length;
  const reviewPercentage =
    data.evidence.length === 0
      ? 0
      : Math.round((reviewedCount / data.evidence.length) * 100);
  const recentEvidence = data.evidence.slice(-5).reverse();
  const recentTimeline = data.timeline.slice(-5).reverse();

  debugLog("3.10", "DASHBOARD → derived values calculated", {
    evidenceCount: data.evidence.length,
    peopleCount: data.people.length,
    locationCount: data.locations.length,
    bookmarkCount: data.bookmarkIds.length,
    reviewedCount,
    reviewPercentage,
    recentEvidenceIds: recentEvidence.map((item) => item.id),
    recentTimelineIds: recentTimeline.map((event) => event.id),
  });

  return (
    <section>
      <h2>Case Dashboard</h2>

      <CaseSummary caseData={data.caseData} />

      <DashboardStats
        evidenceCount={data.evidence.length}
        peopleCount={data.people.length}
        locationCount={data.locations.length}
        bookmarkCount={data.bookmarkIds.length}
        reviewedCount={reviewedCount}
      />

      <ReviewProgress
        reviewedCount={reviewedCount}
        totalCount={data.evidence.length}
        percentage={reviewPercentage}
      />

      <div className="dashboard-columns">
        <Panel title="Recent evidence">
          <RecentEvidence evidence={recentEvidence} />
        </Panel>

        <Panel title="Recent timeline events">
          <RecentTimeline timeline={recentTimeline} />
        </Panel>
      </div>
    </section>
  );
}
