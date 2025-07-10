import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPost, addComment, addReply, updatePostLikes, deleteComment, refreshPosts } from '../../store/slices/postsSlice';
import { postsAPI, commentsAPI } from '../../services/api';
import { FaThumbsUp, FaComment, FaFile, FaUser, FaClock, FaArrowLeft, FaDownload, FaInfoCircle, FaPaperclip } from 'react-icons/fa';
import LikeButton from "./LikeButton";
import CommentList from "./CommentList";
import { useSelector as useReduxSelector } from 'react-redux';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentPost } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  
  // Remove unused comment state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postsAPI.getPostById(id);
        dispatch(setCurrentPost(response.data));
      } catch (error) {
        setError('Post not found');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, dispatch]);

  // Fetch comments when post is loaded
  useEffect(() => {
    const fetchComments = async () => {
      if (!currentPost?.id) {
        console.log('No currentPost.id available, skipping comment fetch');
        return;
      }
      
      console.log('Fetching comments for post:', currentPost.id);
      try {
        setCommentsLoading(true);
        const response = await commentsAPI.getComments(currentPost.id);
        console.log('Comments response:', response.data);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setComments([]);
      } finally {
        setCommentsLoading(false);
      }
    };

    fetchComments();
  }, [currentPost?.id]);

  const handleLike = async () => {
    if (!user) return;
    
    try {
      const isLiked = currentPost.likes?.includes(user._id);
      const response = isLiked 
        ? await postsAPI.unlikePost(id)
        : await postsAPI.likePost(id);
      
      dispatch(updatePostLikes({ postId: id, likes: response.data.likes }));
    } catch (error) {
      // Mock like functionality for demo
      console.log('Mock like functionality for demo');
      const newLikes = isLiked 
        ? currentPost.likes.filter(like => like !== user._id)
        : [...(currentPost.likes || []), user._id];
      
      dispatch(updatePostLikes({ postId: id, likes: newLikes }));
    }
  };

  // Remove the old handleComment function - it's not being used

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'notes': '#4CAF50',
      'jobs': '#2196F3',
      'threads': '#FF9800'
    };
    return colors[category] || '#666';
  };

  const handleAddComment = (commentObj) => {
    // commentObj is the backend's returned comment
    if (!user || !commentObj) return;
    setComments(prev => [...prev, commentObj]);
    dispatch(addComment({ postId: currentPost.id, comment: commentObj }));
    // Refresh posts to update comment counts in the posts list
    dispatch(refreshPosts());
  };

  const handleAddReply = (parentId, text) => {
    if (!user || !text.trim()) return;
    setComments(prev => {
      const updated = prev.map(comment =>
        comment._id === parentId
          ? {
              ...comment,
              replies: [
                ...comment.replies,
                {
                  _id: `reply-${Date.now()}`,
                  content: text,
                  author: {
                    _id: user._id,
                    name: user.name
                  },
                  createdAt: new Date().toISOString(),
                  likes: [],
                },
              ],
            }
          : comment
      );
      console.log('Updated comments after reply:', updated);
      return updated;
    });
    dispatch(addReply({ postId: currentPost.id, commentId: parentId, reply: {
      _id: `reply-${Date.now()}`,
      content: text,
      author: {
        _id: user._id,
        name: user.name
      },
      createdAt: new Date().toISOString(),
      likes: [],
    }}));
  };

  const handleDeleteComment = (commentId) => {
    setComments(prev => prev.filter(comment => comment._id !== commentId));
    dispatch(deleteComment({ postId: currentPost.id, commentId: commentId }));
    // Refresh posts to update comment counts in the posts list
    dispatch(refreshPosts());
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p>Loading post...</p>
      </div>
    );
  }

  if (error || !currentPost) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: '#c33' }}>{error || 'Post not found'}</p>
      </div>
    );
  }

  return (
    <div>
      {console.log('PostDetail render, comments:', comments)}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 max-w-7xl mx-auto mt-8" style={{ fontFamily: 'Poppins, Segoe UI, sans-serif' }}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
          <h1 className="text-[#4A2343] text-3xl md:text-4xl font-extrabold m-0" style={{ fontFamily: 'Poppins, Segoe UI, sans-serif' }}>
            {currentPost.title}
          </h1>
          <span className="px-4 py-2 rounded-full text-base font-bold uppercase ml-2" style={{ backgroundColor: getCategoryColor(currentPost.category), color: 'white', fontSize: '1rem', fontWeight: 600 }}>
            {currentPost.category}
          </span>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="h-12 w-12 rounded-full bg-[#4A2343] flex items-center justify-center text-white font-bold text-xl">
            {currentPost.author?.name?.charAt(0) || '?'}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-[#4A2343]">{currentPost.author?.name}</span>
            <span className="text-base text-gray-500">{formatDate(currentPost.createdAt)}</span>
          </div>
        </div>
        <div className="text-xl text-gray-700 mb-6" style={{ fontFamily: 'Poppins, Segoe UI, sans-serif' }}>
          {currentPost.content}
        </div>
        {currentPost.category === 'jobs' && currentPost.link && (
          <div className="mb-6">
            <a
              href={currentPost.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded font-semibold text-base hover:bg-blue-200 transition"
            >
              🔗 View Job/Referral
            </a>
          </div>
        )}

        {currentPost.attachments?.length > 0 && (
          <div className="mb-6">
            <h3 className="text-[#4A2343] mb-2 font-semibold">Attachments:</h3>
            <div className="flex flex-wrap gap-2">
              {currentPost.attachments.map((file, idx) => (
                <a key={idx} href={file} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded text-[#4A2343] hover:underline">
                  <FaPaperclip />
                  <span>Attachment {idx + 1}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-6 mb-8">
          <LikeButton count={currentPost.likes?.length || 0} />
          <span className="text-gray-500">{comments.length || currentPost.commentsCount || 0} comments</span>
        </div>
      </div>

      {currentPost.id && (
      <CommentList
        comments={comments}
        onAddComment={handleAddComment}
        onAddReply={handleAddReply}
        onDeleteComment={handleDeleteComment}
          postId={currentPost.id}
          loading={commentsLoading}
      />
      )}
      {console.log('PostDetail render - currentPost.id:', currentPost.id)}
      {console.log('PostDetail render - currentPost._id:', currentPost._id)}
      {console.log('PostDetail render - currentPost:', currentPost)}
    </div>
  );
};

export default PostDetail; 