import { useEffect, useState } from "react";
import { fetchUserApplications } from "../../utils/applications";
import "./Insights.css";

// Helper: format 0.2 => "20%"
function formatPercent(value) {
  if (value == null || Number.isNaN(value)) return "-";
  return `${(value * 100).toFixed(0)}%`;
}

// Timeframe labels
const TIMEFRAME_LABELS = {
  "30_days": "Last 30 days",
  "3_months": "Last 3 months",
  "all_time": "All time",
};

export default function Insights() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("all_time");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetchUserApplications();
        setApplications(res?.data?.applications || []);
      } catch (err) {
        console.error("Failed to load applications for insights:", err);
        setApplications([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  // Filter by timeframe (optional)
  const filteredApplications = filterByTimeframe(applications, timeframe);

  if (loading) {
    return (
      <div className="insights-container">
        <p>Loading your application insights...</p>
      </div>
    );
  }

  if (!filteredApplications.length) {
    return (
      <div className="insights-container">
        <h2>Application Insights</h2>
        <p>
          You don’t have any applications yet. Once you start applying,
          your funnel and insights will show here.
        </p>
      </div>
    );
  }

  // Build status counts from real data
  const statusCounts = filteredApplications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const submitted = statusCounts["Application Submitted"] || 0;
  const screening = statusCounts["Initial Screening"] || 0;
  const round1    = statusCounts["1st Round Interview"] || 0;
  const round2    = statusCounts["2nd Round Interview"] || 0;
  const offers    = statusCounts["Offer Received"] || 0;
  const declined  = statusCounts["Application Declined"] || 0;

  // Funnel totals
  const funnelTotals = {
    submittedTotal: submitted + screening + round1 + round2 + offers + declined,
    screeningTotal: screening + round1 + round2 + offers,
    round1Total:    round1 + round2 + offers,
    round2Total:    round2 + offers,
    offersTotal:    offers,
    declinedTotal:  declined,
  };

  const totalSubmitted = funnelTotals.submittedTotal || 1; // avoid /0

  // Benchmarks based on your table: 4–6% from submitted to offer
  const BENCHMARKS = {
    initial_screening: { pessimistic: 0.04, mean: 0.05, optimistic: 0.06 },
    first_round:       { pessimistic: 0.33, mean: 0.52, optimistic: 0.70 },
    second_round:      { pessimistic: 0.17, mean: 0.26, optimistic: 0.38 },
    receive_offer:     { pessimistic: 0.33, mean: 0.42, optimistic: 0.50 },
  };

  // Build "stages" for the cards
  const stages = [
    {
      id: "applications",
      label: "Applications Submitted",
      count: funnelTotals.submittedTotal,
      value: null,
      benchmarks: null,
    },
    {
      id: "initial_screening",
      label: "Initial Screening",
      value: funnelTotals.screeningTotal / totalSubmitted,
      benchmarks: BENCHMARKS.initial_screening,
    },
    {
      id: "first_round",
      label: "1st Round Interview",
      value: funnelTotals.round1Total / totalSubmitted,
      benchmarks: BENCHMARKS.first_round,
    },
    {
      id: "second_round",
      label: "2nd Round Interview",
      value: funnelTotals.round2Total / totalSubmitted,
      benchmarks: BENCHMARKS.second_round,
    },
    {
      id: "receive_offer",
      label: "Offers Received",
      value: funnelTotals.offersTotal / totalSubmitted,
      benchmarks: BENCHMARKS.receive_offer,
    },
  ];

  const focusStageId = pickFocusStageId(stages);
  const focusStage = stages.find((s) => s.id === focusStageId);

  return (
    <div className="insights-page">
      {/* Top heading */}
      <div className="insights-header">
        <div>
          <h1 className="insights-title">My Application Insights</h1>
          <p className="insights-subtitle">
            Track your progress and get data-driven advice to land your first role in tech.
          </p>
        </div>

        <div className="timeframe-toggle">
          {Object.entries(TIMEFRAME_LABELS).map(([id, label]) => (
            <button
              key={id}
              className={
                timeframe === id
                  ? "timeframe-chip timeframe-chip--active"
                  : "timeframe-chip"
              }
              onClick={() => setTimeframe(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main cards strip */}
      <section className="insights-strip">
        {stages.map((stage, idx) => (
          <StageCard
            key={stage.id}
            stage={stage}
            isFirst={idx === 0}
            isLast={idx === stages.length - 1}
            isFocus={stage.id === focusStageId}
          />
        ))}
      </section>

      {/* Feedback panel */}
      <section className="feedback-panel">
        <div className="feedback-header">
          <div className="feedback-icon">💡</div>
          <h2>Actionable Feedback</h2>
        </div>

        <div className="feedback-body">
          <p className="feedback-focus-line">
            <strong>Focus on: </strong>
            {focusStage
              ? getFocusTitle(focusStage.id)
              : "Building your application funnel"}
          </p>

          <p className="feedback-summary">
            Your application numbers are a great starting point. Use this guidance
            to improve your conversion at the current bottleneck in your funnel.
          </p>

          <ul className="feedback-list">
            {getFocusBullets(focusStageId).map((item, i) => (
              <li key={i}>
                <span className="tick">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="feedback-note">
            Tip: These insights will become more accurate as you keep your application
            statuses up-to-date in the Job Board.
          </p>
        </div>
      </section>
    </div>
  );
}

/* ---------- helpers ---------- */

// Filter apps by timeframe
function filterByTimeframe(apps, timeframe) {
  if (timeframe === "all_time") return apps;
  const days = timeframe === "30_days" ? 30 : 90;
  const now = Date.now();
  const cutoff = now - days * 24 * 60 * 60 * 1000;

  return apps.filter((app) => {
    const created = new Date(app.created_at || app.active_from).getTime();
    return !Number.isNaN(created) && created >= cutoff;
  });
}

// Determine which stage is the "bottleneck"
function pickFocusStageId(stages) {
  for (const s of stages) {
    if (!s.benchmarks || s.value == null) continue;
    if (s.value < s.benchmarks.mean) return s.id;
  }
  return "applications";
}

// Human-friendly title
function getFocusTitle(stageId) {
  switch (stageId) {
    case "initial_screening":
      return "Initial Screening";
    case "first_round":
      return "1st Round Interview";
    case "second_round":
      return "2nd Round Interview";
    case "receive_offer":
      return "Receiving Offers";
    default:
      return "Your Funnel";
  }
}

// Feedback bullets
function getFocusBullets(stageId) {
  switch (stageId) {
    case "initial_screening":
      return [
        "Tailor your CV and cover letter to each job description.",
        "Use keywords from the job spec so ATS and recruiters see the match.",
        "Ask a mentor or peer to review your CV before submitting.",
      ];
    case "first_round":
      return [
        "Research the company and their product in depth.",
        "Prepare 3–4 strong stories using STAR (Situation, Task, Action, Result).",
        "Run at least one mock interview with a friend or mentor.",
      ];
    case "second_round":
      return [
        "Strengthen technical explanations with concrete examples.",
        "Show how you collaborate with teammates and handle disagreement.",
        "Review your previous rounds and refine any weak answers.",
      ];
    case "receive_offer":
      return [
        "Compare the offer against your minimum acceptable criteria (salary, location, growth).",
        "Clarify start date, probation period, and expectations.",
        "Celebrate your win and reflect on what worked in your process!",
      ];
    default:
      return [
        "Keep your application statuses updated.",
        "Aim to apply for roles where you have at least a 7/10 skill match.",
        "Use referrals and a targeted CV to improve your overall conversion.",
      ];
  }
}

/**
 * Stage card component
 * Shows % value + small benchmark ruler (pessimistic / mean / optimistic)
 */
function StageCard({ stage, isFirst, isLast, isFocus }) {
  const hasBenchmarks = !!stage.benchmarks;

  // Compute where current value sits between pessimistic and optimistic
  let pointerPos = 0;
  if (hasBenchmarks && stage.value != null) {
    const { pessimistic, optimistic } = stage.benchmarks;
    const clamped = Math.max(
      pessimistic,
      Math.min(optimistic, stage.value)
    );
    const ratio = (clamped - pessimistic) / (optimistic - pessimistic || 1);
    pointerPos = ratio * 100;
  }

  return (
    <div className="stage-card-wrapper">
      <div className={"stage-card" + (isFocus ? " stage-card--focus" : "")}>
        <div className="stage-header">
          <span className="stage-label">{stage.label}</span>
          {isFirst && (
            <span className="stage-apps-subtitle">
              Total applications sent
            </span>
          )}
        </div>

        {stage.value == null ? (
          <div className="stage-main">
            <div className="stage-number">{stage.count}</div>
          </div>
        ) : (
          <div className="stage-main">
            <div className="stage-number">{formatPercent(stage.value)}</div>
          </div>
        )}

        {hasBenchmarks && (
          <div className="stage-benchmarks">
            <div className="benchmarks-label-row">
              <span>
                Pessimistic: {formatPercent(stage.benchmarks.pessimistic)}
              </span>
              <span>Mean: {formatPercent(stage.benchmarks.mean)}</span>
              <span>
                Optimistic: {formatPercent(stage.benchmarks.optimistic)}
              </span>
            </div>
            <div className="benchmarks-bar">
              <div className="benchmarks-segment pessimistic" />
              <div className="benchmarks-segment mean" />
              <div className="benchmarks-segment optimistic" />
              {stage.value != null && (
                <div
                  className="benchmarks-pointer"
                  style={{ left: `${pointerPos}%` }}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {!isLast && <div className="stage-arrow">➜</div>}
    </div>
  );
}
