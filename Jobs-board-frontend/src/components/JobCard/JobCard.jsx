import { useState } from "react";
import "./JobCard.css";
import { formatSalaryRange } from "../../utils/jobListHelper.js";
import slackBadge from "../../assets/slack-badge.png";
import { fetchWithAuth } from "../../utils/api.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5501/api";

export function JobCard(props){
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);

  let diffDaysText = "N/A";
    const salaryText = formatSalaryRange(props.salary_min, props.salary_max, props.currency || "GBP");
   if (props.active_from) {
    const activeDate = new Date(props.active_from);
    if (!isNaN(activeDate)) {
      const diffMs = new Date() - activeDate;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      diffDaysText = `${diffDays} days ago`;
    }
  }
      const starDescription = "Star company is a company that has hired CYFers before or works with the CYF community.";

  const fetchComments = async () => {
    if (!props.application_id) return;
    
    setLoadingComments(true);
    try {
      const {response , data} = await fetchWithAuth(`/job-comments/${props.application_id}`)
      if (response.ok) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !props.application_id) return;

    try {
      // const {response, data} = await fetchWithAuth(`/job-comments`),{

      
      const response = await fetch(`${API_URL}/job-comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          applicationId: props.application_id,
          comment: newComment,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setComments([...comments, data.comment]);
        setNewComment("");
        setShowCommentInput(false);
      } else {
        alert(data.error || "Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment");
    }
  };

  const toggleComments = () => {
    if (!showComments && comments.length === 0) {
      fetchComments();
    }
    setShowComments(!showComments);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return(

    
    <article className={`job-card ${props.isInterested ? "interested" : ""}`}>
  
      {props.isInterested && (
        <div className="interested-badge">
          
        </div>
      )}
      <div className="source-badge">
        {props.api_source === "CYFslack" ? 

        <div className="job-card-slack-badge">
           <img src={slackBadge} alt="CYF Slack" />
        </div>
        
        : "🌐"}
      </div>

      <h3 className="job-title">
        {props.title}
      </h3>

      <p className="company">{props.company}
        {props.is_star && <span className="star-badge" title={starDescription}> ⭐</span>}
      </p>


      <p>Location:<strong> {props.location}</strong></p>
      <p>Type: <strong>{props.employment_type}</strong></p>
      <p>Work Place: <strong>{props.location_type}</strong></p>
      <p>Salary range:<strong>{" "}{salaryText ?? "Not provided"}</strong></p>
      <p>Experience:<strong> {props.exp_level}</strong></p>
      {/* <p><strong>Source:</strong> {props.partner_name}</p> */}
      <p className="source-row">
          Source:{" "}
          <span
            className={
              props.api_source === "CYFslack"
                ? "source-pill source-pill--slack"
                : "source-pill source-pill--platform"
            }
          >
            {props.partner_name || props.api_source}
          </span>
      </p>

      <p>Job Age:<strong> {diffDaysText}</strong></p>

       {/* New Delete Button */}
          {props.onDelete && (
            <button 
              onClick={props.onDelete} 
              className="delete-app-btn"
              title="Remove this application"
            >
              🗑️
            </button>
          )}   
      {/* MY APPLICATIONS — SHOW DROPDOWN */}
      {props.status && props.onStatusChange && (
        <div className="status-row">
          {/* <label>Status: </label> */}
          <select
            value={props.status}
            onChange={(e) => props.onStatusChange(e.target.value)}
          >
            <option value="Interested">Interested</option>
            <option value="Application Submitted">Application Submitted</option>
            <option value="Initial Screening">Initial Screening</option>
            <option value="1st Round Interview">1st Round Interview</option>
            <option value="2nd Round Interview">2nd Round Interview</option>
            <option value="Offer Received">Offer Received</option>
            <option value="Application Declined">Application Declined</option>
          </select>
        </div>
      )}


      <div className="job-card-actions">
        {/* DASHBOARD — SHOW INTERESTED BUTTON ABOVE APPLY LINK */}
        {!props.status && props.onInterested && (
          <button
            className={`interested-btn ${props.isInterested ? 'interested-active' : ''}`}
            onClick={() => props.onInterested(props)}
            disabled={props.isInterested}
          >
            {props.isInterested ? '💚 Interested' : '🤍 Mark as Interested'}
          </button>
        )}
        
        <a 
          className="apply-link" 
          href={props.apply_url} 
          target="_blank"
          rel="noopener noreferrer"
        >
          Apply Here
        </a>
      </div>

      {/* Comments section - only show for applications */}
      {props.application_id && (
        <div className="comments-section">
          <button className="toggle-comments-btn" onClick={toggleComments}>
            {showComments ? '▼' : '▶'} Comments - 💬
          </button>

          {showComments && (
            <div className="comments-container">
              {loadingComments ? (
                <p className="loading-text">Loading comments...</p>
              ) : (
                <>
                  {comments.length === 0 ? (
                    <p className="no-comments-text">No comments yet</p>
                  ) : (
                    <div className="comments-list">
                      {comments.map((comment) => (
                        <div key={comment.comment_id} className="comment-item">
                          <div className="comment-header">
                            <span className="comment-author">{comment.author_name}</span>
                            <span className="comment-role">({comment.role})</span>
                            <span className="comment-date">{formatDate(comment.created_at)}</span>
                          </div>
                          <p className="comment-text">{comment.comment_text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {showCommentInput ? (
                    <div className="add-comment-form">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="comment-textarea"
                        rows="2"
                      />
                      <div className="comment-actions">
                        <button 
                          onClick={handleAddComment} 
                          className="post-comment-btn"
                          disabled={!newComment.trim()}
                        >
                          Post
                        </button>
                        <button 
                          onClick={() => {
                            setShowCommentInput(false);
                            setNewComment("");
                          }} 
                          className="cancel-comment-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button 
                      className="add-comment-btn" 
                      onClick={() => setShowCommentInput(true)}
                    >
                      <span className="plus-icon">+</span> Add Comment
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}

    </article>
  )

}
