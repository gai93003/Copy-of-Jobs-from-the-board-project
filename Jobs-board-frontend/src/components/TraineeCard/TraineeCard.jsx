import "./TraineeCard.css";

export function TraineeCard({ trainee, onViewApplications }) {
  return (
    <li className="trainee-card">
      <div className="trainee-card-header">
        <h3 
          className="trainee-name-link" 
          onClick={() => onViewApplications(trainee)}
        >
          {trainee.full_name}
        </h3>
      </div>
      <div className="trainee-card-body">
        <p className="trainee-email">
          <strong>Email:</strong> {trainee.email}
        </p>
        {trainee.description && (
          <p className="trainee-description">
            <strong>Description:</strong> {trainee.description}
          </p>
        )}
        {trainee.created_at && (
          <p className="trainee-joined">
            <strong>Joined:</strong> {new Date(trainee.created_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </li>
  );
}
