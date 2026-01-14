import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { fetchWithAuth } from "../../utils/api.js";
import { TraineeApplications } from "../TraineeApplications/TraineeApplications";
import Footer from "../Footer/Footer";
import "chart.js/auto";
import "./StaffDashboard.css";

export default function StaffDashboard() {
  const [funnel, setFunnel] = useState(null);
  const [trainees, setTrainees] = useState([]);
  const [selectedTrainee, setSelectedTrainee] = useState(null); 

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    const funnelRes = await fetchWithAuth("/staff/cohort/funnel");
    setFunnel(funnelRes.data);

    const traineeRes = await fetchWithAuth("/staff/cohort/trainees");
    setTrainees(mapTraineeData(traineeRes.data.rows));
  }

  // When clicking back
  const handleBack = () => {
    setSelectedTrainee(null);
  };

  // IF TRAINEE IS SELECTED > SHOW THEIR APPLICATIONS
  if (selectedTrainee) {
    return (
          <div className="mentor-layout">
            <main className="trainee-content">
                <TraineeApplications
                    trainee={selectedTrainee}
                    onBack={handleBack}
                />
            </main>
          </div>
    );
  }

  if (!funnel) return <p>Loading dashboard...</p>;

  const stats = funnel?.stats || {};
  const LABELS = [
  "Application Submitted",
  "Initial Screening",
  "1st Round Interview",
  "2nd Round Interview",
  "Offer Received",
  "Application Declined",
];

const chartData = {
  labels: LABELS,
  datasets: [
    {
      data: LABELS.map(label => stats[label] || 0),
      backgroundColor: [
        "#EE4344", // submitted
        "#F59E0B", // initial screening
        "#3B82F6", // 1st interview
        "#6366F1", // 2nd interview
        "#10B981", // offer
        "#6B7280", // declined
      ],
    },
  ],
};

const submittedTotal =
  (stats["Application Submitted"] || 0) +
  (stats["Initial Screening"] || 0) +
  (stats["1st Round Interview"] || 0) +
  (stats["2nd Round Interview"] || 0) +
  (stats["Offer Received"] || 0) +
  (stats["Application Declined"] || 0);

const initialScreeningTotal =
  (stats["Initial Screening"] || 0) +
  (stats["1st Round Interview"] || 0) +
  (stats["2nd Round Interview"] || 0) +
  (stats["Offer Received"] || 0);

const firstRoundTotal =
  (stats["1st Round Interview"] || 0) +
  (stats["2nd Round Interview"] || 0) +
  (stats["Offer Received"] || 0);

const secondRoundTotal =
  (stats["2nd Round Interview"] || 0) +
  (stats["Offer Received"] || 0);

const offersTotal = stats["Offer Received"] || 0;

const declinedTotal =
  (stats["Application Declined"] || 0)

  return (
    <div className="staff-dashboard">
      <h1>Cohort Application</h1>
      <p className="cohort-name">Launch Module Nov25</p>

      {/* SUMMARY CARDS  */}
    <div className="summary-grid">
          <Summary title="Applications Submitted" value={submittedTotal} />
          <Summary title="Initial Screening" value={initialScreeningTotal} />
          <Summary title="1st Round Interview" value={firstRoundTotal} />
          <Summary title="2nd Round Interview" value={secondRoundTotal} />
          <Summary title="Offers" value={offersTotal} />
          <Summary title="Declined" value={declinedTotal} />
    </div>


      {/* TRAINEE STATUS TABLE */}
      <table className="staff-table">
        <thead>
          <tr>
            <th>Trainee</th>
            <th>Submitted</th>
            <th>Initial Screening</th>
            <th>1st Interview</th>
            <th>2nd Interview</th>
            <th>Offer</th>
            <th>Declined</th>
          </tr>
        </thead>
        <tbody>
          {trainees.map((t) => (
            <tr key={t.user_id}>
              {/* CLICKABLE TRAINEE NAME */}
              <td
                className="trainee-name-link"
                onClick={() => setSelectedTrainee(t)}
                style={{ cursor: "pointer", color: "#EE4344", fontWeight: 600 }}
              >
                {t.full_name}
              </td>
              <td>{t["Application Submitted"]}</td>
              <td>{t["Initial Screening"]}</td>
              <td>{t["1st Round Interview"]}</td>
              <td>{t["2nd Round Interview"]}</td>
              <td>{t["Offer Received"]}</td>
              <td>{t["Application Declined"]}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PIE CHART */}
      <div className="pie-section">
        <h2>Application Distribution Chart</h2>
        <Pie data={chartData} />
      </div>
    </div>
  );
}

function Summary({ title, value }) {
  return (
    <div className="summary-card">
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}



export function mapTraineeData(rows) {
  const map = {};

  rows.forEach((row) => {
    if (!map[row.user_id]) {
      map[row.user_id] = {
        user_id: row.user_id,
        full_name: row.full_name,
        email: row.email,
        "Application Submitted": 0,
        "Initial Screening": 0,
        "1st Round Interview": 0,
        "2nd Round Interview": 0,
        "Offer Received": 0,
        "Application Declined": 0,
      };
    }

    if (row.status && map[row.user_id][row.status] !== undefined) {
      map[row.user_id][row.status] += row.total;
    }
  });

  const trainees = Object.values(map);

  trainees.forEach((t) => {
    const submitted = t["Application Submitted"] || 0;
    const initial   = t["Initial Screening"] || 0;
    const first     = t["1st Round Interview"] || 0;
    const second    = t["2nd Round Interview"] || 0;
    const offers    = t["Offer Received"] || 0;
    const declined  = t["Application Declined"] || 0;

    const submittedTotal =
      submitted + initial + first + second + declined + offers;

    const initialScreeningTotal =
      initial + first + second + offers;

    const firstRoundTotal =
      first + second + offers;

    const secondRoundTotal =
      second + offers;
      
    const offersTotal = offers;
    const declinedTotal = declined;
    

    t["Application Submitted"] = submittedTotal;
    t["Initial Screening"]     = initialScreeningTotal;
    t["1st Round Interview"]   = firstRoundTotal;
    t["2nd Round Interview"]   = secondRoundTotal;
    t["Offer Received"]        = offersTotal;
    t["Application Declined"]  = declinedTotal;
  });

  return trainees;
}