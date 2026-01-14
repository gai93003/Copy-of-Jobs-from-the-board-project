import { useState, useEffect } from "react";
import { fetchWithAuth } from "../../utils/api";
import "./CommentSection.css";

export function CommentSectionold({ traineeId, mentorId, mode = "trainee" }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);



  useEffect(() => {
    fetchComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [traineeId, mentorId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const { response, data } = await fetchWithAuth(
        `/comments?traineeId=${traineeId}&mentorId=${mentorId}`
      );
      if (response.ok) {
        setComments(data.comments || []);
      } else {
        console.error("Failed to fetch comments:", data.error);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const { response, data } = await fetchWithAuth("/comments", {
        method: "POST",
        body: JSON.stringify({
          traineeId,
          mentorId,
          comment: newComment,
        }),
      });

      if (response.ok) {
        setComments([...comments, data.comment]);
        setNewComment("");
      } else {
        alert(data.error || "Failed to post comment");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="comment-section">
      <h3 className="comment-section-title">
        {mode === "mentor" ? "Mentee Comments" : "Comments from Your Mentor"}
      </h3>

      {loading ? (
        <p className="loading-comments">Loading comments...</p>
      ) : (
        <>
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">
                No comments yet. Start a conversation!
              </p>
            ) : (
              comments.map((comment) => (
                <div key={comment.comment_id} className="comment-card">
                  <div className="comment-header">
                    <span className="comment-author">
                      {comment.author_name}
                    </span>
                    <span className="comment-role">
                      ({comment.role})
                    </span>
                    <span className="comment-date">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="comment-text">{comment.comment_text}</p>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSubmitComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="comment-input"
              rows="3"
              disabled={submitting}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="comment-submit-btn"
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export function CommentSection({ traineeId, mentorId, mode = "trainee" }) {
  return ""
}