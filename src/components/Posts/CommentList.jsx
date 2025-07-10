import React, { useState } from "react";
import { useSelector } from "react-redux";
import LikeButton from "./LikeButton";
import { commentsAPI } from '../../services/api';

export default function CommentList({ comments = [], onAddComment, onAddReply, onDeleteComment, postId, loading = false }) {
  const { user } = useSelector(state => state.auth);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [commentText, setCommentText] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Debug logging
  console.log('CommentList render - postId:', postId);
  console.log('CommentList render - comments:', comments);
  console.log('CommentList render - loading:', loading);

  // Show loading state if postId is not available
  if (!postId) {
    return (
      <div className="bg-white rounded-xl shadow p-6 max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-[#4A2343] mb-4">Comments</h2>
        <div className="text-gray-500 text-center mb-4">Loading comments...</div>
      </div>
    );
  }

  // Show loading state while comments are being fetched
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-[#4A2343] mb-4">Comments</h2>
        <div className="text-gray-500 text-center mb-4">Loading comments...</div>
      </div>
    );
  }

  const handleReply = async (parentId) => {
    if (!user) {
      setErrorMsg('You must be logged in to reply.');
      return;
    }
    if (replyText.trim()) {
      // Implement backend reply logic if needed
      onAddReply(parentId, replyText);
      setReplyText("");
      setReplyingTo(null);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('You must be logged in to comment.');
      return;
    }
    if (!postId) {
      setErrorMsg('Post ID is missing. Cannot create comment.');
      return;
    }
    if (commentText.trim()) {
      try {
        // Debug logging
        console.log('postId received:', postId);
        console.log('user:', user);
        
        const commentData = {
          content: commentText,
          author: { _id: user.id || user._id, name: user.full_name || user.name || user.username },
          createdAt: new Date().toISOString(),
          likes: [],
          replies: [],
          post_id: postId
        };
        
        console.log('Sending comment data:', commentData);
        
        // Send post_id in the body
        const res = await commentsAPI.addComment(commentData);
        onAddComment(res.data); // Use backend's returned comment
        setCommentText("");
      } catch (err) {
        console.error('Comment creation error:', err);
        setErrorMsg(err.response?.data?.detail || 'Failed to add comment');
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!user) {
      setErrorMsg('You must be logged in to delete comments.');
      return;
    }
    try {
      await commentsAPI.deleteComment(commentId);
      onDeleteComment(commentId);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to delete comment');
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!user) {
      setErrorMsg('You must be logged in to like comments.');
      return;
    }
    try {
      await commentsAPI.likeComment(commentId, user.id || user._id);
      // Optionally update UI state here
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to like comment');
    }
  };

  if (!comments || comments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl font-bold text-[#4A2343] mb-4">Comments</h2>
        <div className="text-gray-500 text-center mb-4">No comments yet. Be the first to comment!</div>
        {user ? (
          <form onSubmit={handleComment} className="flex gap-2 mt-2">
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
              placeholder="Add a comment..."
            />
            <button type="submit" className="bg-[#4A2343] text-white px-4 py-2 rounded font-semibold">Post</button>
          </form>
        ) : (
          <div className="text-center text-gray-400 mt-2">You must be logged in to post a comment.</div>
        )}
        {errorMsg && <div className="text-red-500 text-xs mt-2">{errorMsg}</div>}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-7xl mx-auto mb-8">
      <h2 className="text-2xl font-bold text-[#4A2343] mb-4">Comments</h2>
      <div className="flex flex-col gap-4">
        {comments.map((comment, idx) => (
          <div key={comment._id || idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-[#4A2343]">{comment.author.name}</span>
              <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            <p className="text-gray-700 m-0">{comment.content}</p>
            <div className="mt-2 flex items-center gap-4">
              <LikeButton count={comment.likes?.length || 0} onClick={() => handleLikeComment(comment._id)} />
              {/* Show reply if user is post author */}
              {user && (
                <button
                  className="text-xs text-[#4A2343] font-semibold hover:underline"
                  onClick={() => setReplyingTo(comment._id)}
                >
                  Reply
                </button>
              )}
              {/* Show delete if user is comment author */}
              {user && user._id === comment.author._id && (
                <button
                  className="text-xs text-red-600 font-semibold hover:underline"
                  onClick={() => handleDeleteComment(comment._id)}
                >
                  Delete
                </button>
              )}
            </div>
            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-6 mt-3 flex flex-col gap-2">
                {comment.replies.map((reply, ridx) => (
                  <div key={reply._id || ridx} className="bg-white border border-gray-100 rounded p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-[#4A2343]">{reply.author.name}</span>
                      <span className="text-xs text-gray-500">{new Date(reply.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-700 m-0">{reply.content}</p>
                    <div className="mt-1">
                      <LikeButton count={reply.likes?.length || 0} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Reply form */}
            {replyingTo === comment._id && user && (
              <form
                onSubmit={e => {
                  e.preventDefault();
                  handleReply(comment._id);
                }}
                className="flex gap-2 mt-2 ml-6"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="flex-1 border rounded px-3 py-2"
                  placeholder="Write a reply..."
                  autoFocus
                />
                <button type="submit" className="bg-[#4A2343] text-white px-3 py-2 rounded font-semibold">Reply</button>
                <button type="button" className="text-gray-500 px-2" onClick={() => setReplyingTo(null)}>Cancel</button>
              </form>
            )}
          </div>
        ))}
      </div>
      {/* New comment form */}
      {user ? (
        <form onSubmit={handleComment} className="flex gap-2 mt-6">
          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            className="flex-1 border rounded px-3 py-2"
            placeholder="Add a comment..."
          />
          <button type="submit" className="bg-[#4A2343] text-white px-4 py-2 rounded font-semibold">Post</button>
        </form>
      ) : (
        <div className="text-center text-gray-400 mt-6">You must be logged in to post a comment.</div>
      )}
      {errorMsg && <div className="text-red-500 text-xs mt-2">{errorMsg}</div>}
    </div>
  );
} 