import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, updatePostLikes, updatePostSaves } from "../../store/slices/postsSlice";
import LikeButton from "./LikeButton";
import { FaPaperclip, FaRegCommentDots } from "react-icons/fa";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import { postsAPI } from '../../services/api';

const typeColors = {
  notes: "bg-blue-100 text-blue-800",
  jobs: "bg-green-100 text-green-800",
  threads: "bg-purple-100 text-purple-800",
};

const tagMap = {
  notes: "N",
  jobs: "J",
  threads: "T",
};

const PostCard = ({ post, user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const isOwner = user && post.author?._id === user._id;
  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState({
    title: post.title,
    content: post.content,
    attachments: post.attachments || [],
  });
  const saves = post.saves || [];
  const userId = currentUser ? (currentUser.id || currentUser._id) : null;
  const [localSaved, setLocalSaved] = useState(userId ? saves.includes(userId) : false);
  const isSaved = localSaved;
  const [errorMsg, setErrorMsg] = useState('');
  
  // Debug logging
  console.log('PostCard render - post.saves:', saves, 'userId:', userId, 'isSaved:', isSaved);
  
  // Sync localSaved with Redux when post.saves changes
  React.useEffect(() => {
    setLocalSaved(userId ? saves.includes(userId) : false);
  }, [JSON.stringify(saves), userId]);

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowEdit(true);
  };
  const handleLike = async (e) => {
    if (!currentUser) {
      setErrorMsg('You must be logged in to like posts.');
      return;
    }
    try {
      const res = await postsAPI.likePost(post._id, currentUser.id || currentUser._id);
      dispatch(updatePostLikes({ postId: post._id, likes: res.data.likes }));
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to like post');
    }
  };
  const handleSave = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      setErrorMsg('You must be logged in to save posts.');
      return;
    }
    const userId = currentUser.id || currentUser._id;
    console.log('Save button clicked - post:', post._id, 'user:', userId);
    console.log('Current post saves:', post.saves);
    try {
      const res = await postsAPI.savePost(post._id, userId);
      console.log('Save response:', res.data);
      dispatch(updatePostSaves({ postId: post._id, saves: res.data.saves }));
      setLocalSaved(res.data.saves.includes(userId));
    } catch (err) {
      console.error('Save error:', err);
      setErrorMsg(err.response?.data?.detail || 'Failed to save post');
    }
  };
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!currentUser) {
      setErrorMsg('You must be logged in to delete posts.');
      return;
    }
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.deletePost(post._id);
        dispatch(deletePost(post._id));
      } catch (err) {
        setErrorMsg(err.response?.data?.detail || 'Failed to delete post');
      }
    }
  };
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    dispatch(updatePost({ postId: post._id, updatedData: editData }));
    setShowEdit(false);
  };
  return (
    <>
      <div
        className={`bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl relative flex flex-col min-h-[260px] h-auto w-full box-border`}
        onClick={() => navigate(`/post/${post._id || post.id}`)}
      >
        {/* Card Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-3">
          <div className="flex items-center gap-4">
            {/* Avatar (placeholder with first letter) */}
            <div className="h-10 w-10 rounded-full bg-[#4A2343] flex items-center justify-center text-white font-bold text-lg">
              {post.author?.name?.charAt(0) || "?"}
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-[#4A2343]">{post.author?.name}</span>
              <div className="flex items-center gap-2 mt-1">
                {/* Username as @username, then dot, then date */}
                <span className="text-sm text-gray-500">@{post.author?.name?.replace(/\s+/g, '').toLowerCase()}</span>
                <span className="text-sm text-gray-500">• {new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          {/* Type of post badge at top right */}
          <span className={`px-2 py-0.5 rounded-md text-sm font-semibold capitalize ${typeColors[post.category]}`}>{post.category}</span>
        </div>
        {/* Card Content */}
        <div className="px-6 pb-3 flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="text-lg text-gray-900 font-bold line-clamp-1 truncate overflow-hidden" style={{ fontFamily: 'Poppins, Segoe UI, sans-serif' }}>{post.title}</div>
            {/* Link/File badge */}
            {post.link && <span className="ml-1 px-2 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold">Link</span>}
            {post.file && <span className="ml-1 px-2 py-1 rounded bg-green-50 text-green-700 text-xs font-semibold">File</span>}
          </div>
          <div className="text-base text-gray-700 mb-2 line-clamp-3 flex-1 truncate overflow-hidden" style={{ fontFamily: 'Poppins, Segoe UI, sans-serif' }}>{post.content}</div>
          {/* Show job/referral link for jobs posts */}
          {post.category === 'jobs' && post.link && (
            <div className="mt-2 mb-2">
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded font-semibold text-sm hover:bg-blue-200 transition"
              >
                🔗 View Job/Referral
              </a>
            </div>
          )}
          {/* Show attachments for notes */}
          {post.category === 'notes' && post.attachments && post.attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {post.attachments.map((file, idx) => (
                <a key={idx} href={file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded text-[#4A2343] text-sm font-semibold">
                  <FaPaperclip />
                  <span>{file.split('/').pop()}</span>
                </a>
              ))}
            </div>
          )}
          {/* Show tagged users for all post types, below attachments */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 items-center border-t border-gray-100 pt-2">
              <span className="text-xs text-gray-500 font-semibold mr-1">Tagged:</span>
              {post.tags.map(tag => (
                <span key={tag._id} className="bg-gray-200 text-[#4A2343] px-2 py-1 rounded text-xs font-semibold">@{tag.name}</span>
              ))}
            </div>
          )}
        </div>
        {/* Card Footer */}
        <div className="flex items-center gap-8 px-6 py-3 border-t border-gray-100 bg-white">
          {/* Comment count */}
          <span className="flex items-center gap-3 text-gray-500 text-base">
            <FaRegCommentDots className="h-5 w-5" />
            {post.commentsCount || 0}
          </span>
          {/* Reply icon */}
          <span className="flex items-center gap-3 text-gray-500 text-base">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h7V6l7 7-7 7v-4H3v-6z" /></svg>
            Reply
          </span>
          {/* Like button beside Reply */}
          <LikeButton 
            count={post.likes?.length || 0}
            liked={currentUser ? (post.likes || []).includes(currentUser.id || currentUser._id) : false}
            onClick={handleLike}
          />
          {/* Save button beside Like */}
          <button
            className={`flex items-center gap-2 px-2 py-1 rounded transition-colors duration-150 text-base font-semibold ${isSaved ? 'bg-[#4A2343] text-white' : 'bg-gray-100 text-[#4A2343]'} hover:cursor-pointer`}
            onClick={handleSave}
            title={isSaved ? 'Unsave' : 'Save'}
          >
            {isSaved ? <MdBookmark className="h-5 w-5 text-white" /> : <MdBookmarkBorder className="h-5 w-5" />}
            <span className="hidden sm:inline">Save</span>
          </button>
          {/* Show error message if any */}
          {errorMsg && <div className="text-red-500 text-xs mt-2">{errorMsg}</div>}
        </div>
        {isOwner && (
          <button onClick={handleDelete} className="text-red-500 ml-2">Delete</button>
        )}
        <div className="px-6 pb-2">
          <span className="text-xs text-gray-400 font-medium">Click to expand</span>
        </div>
      </div>
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <form className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md" onSubmit={handleEditSubmit} onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4 text-[#4A2343]">Edit Post</h2>
            <input
              type="text"
              name="title"
              value={editData.title}
              onChange={handleEditChange}
              className="border rounded w-full mb-3 px-3 py-2"
              placeholder="Title"
              required
            />
            <textarea
              name="content"
              value={editData.content}
              onChange={handleEditChange}
              rows="6"
              className="border rounded w-full mb-3 px-3 py-2"
              placeholder="Content"
              required
            />
            {/* Attachments display only (no upload for simplicity) */}
            {editData.attachments && editData.attachments.length > 0 && (
              <div className="mb-3">
                <div className="font-semibold text-xs mb-1 text-[#4A2343]">Attachments:</div>
                <ul className="list-disc ml-5 text-xs">
                  {editData.attachments.map((file, idx) => (
                    <li key={idx}>{file}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-4 mt-4">
              <button type="submit" className="bg-[#4A2343] text-white px-3 py-2 rounded font-semibold text-sm">Save</button>
              <button type="button" className="bg-gray-200 text-[#4A2343] px-3 py-2 rounded font-semibold text-sm" onClick={() => setShowEdit(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default PostCard;