import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure } from '../store/slices/postsSlice';
import { postsAPI } from '../services/api';
import PostCard from '../components/Posts/PostCard';
import SearchAndFilter from '../components/Posts/SearchAndFilter';
import { FaSpinner, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { posts, filteredPosts, loading, error } = useSelector((state) => state.posts);

    const fetchPosts = async () => {
      try {
        dispatch(fetchPostsStart());
        const response = await postsAPI.getAllPosts();
        dispatch(fetchPostsSuccess(response.data));
      } catch (error) {
        dispatch(fetchPostsFailure('Failed to fetch posts from backend.'));
      }
    };

  useEffect(() => {
    fetchPosts();
  }, [dispatch]);

  // Listen for refreshPosts action and refetch posts
  useEffect(() => {
    if (loading) {
      fetchPosts();
    }
  }, [loading]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <FaSpinner style={{ fontSize: '2rem', color: '#4A2343', animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#666' }}>Loading posts...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <FaExclamationTriangle style={{ fontSize: '2rem', color: '#c33' }} />
        <p style={{ color: '#c33' }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4A2343',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf7] pt-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mx-auto px-4">
        {filteredPosts.length === 0 ? (
          <div className="col-span-3 text-center text-gray-500 text-base py-8">No posts found.</div>
        ) : (
          filteredPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard; 