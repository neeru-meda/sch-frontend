
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostCard from "../components/Posts/PostCard";
import SearchAndFilter from "../components/Posts/SearchAndFilter";
import { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure } from '../store/slices/postsSlice';
import { postsAPI } from '../services/api';

const Search = () => {
  const dispatch = useDispatch();
  const filteredPosts = useSelector((state) => state.posts.filteredPosts);
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
    // Fetch posts from backend on mount
    const fetchPosts = async () => {
      try {
        dispatch(fetchPostsStart());
        const response = await postsAPI.getAllPosts();
        dispatch(fetchPostsSuccess(response.data));
      } catch (error) {
        dispatch(fetchPostsFailure('Failed to fetch posts from backend.'));
      }
    };
    fetchPosts();
  }, [dispatch]);

  // Listen for refreshPosts action and refetch posts
  useEffect(() => {
    if (loading) {
      const fetchPosts = async () => {
        try {
          dispatch(fetchPostsStart());
          const response = await postsAPI.getAllPosts();
          dispatch(fetchPostsSuccess(response.data));
        } catch (error) {
          dispatch(fetchPostsFailure('Failed to fetch posts from backend.'));
        }
      };
      fetchPosts();
    }
  }, [loading, dispatch]);

  return (
    <div className="min-h-screen bg-[#fdfaf7] pt-8">
      <div className="w-full mx-auto px-4 mb-8">
        <SearchAndFilter />
      </div>
      {loading ? (
        <div className="text-center text-gray-500 text-xl py-8">Loading posts...</div>
      ) : error ? (
        <div className="text-center text-red-500 text-xl py-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="col-span-3 text-center text-gray-500 text-base py-8">No posts found.</div>
          ) : (
            filteredPosts.map((post) => (
              <PostCard key={post._id} post={post} user={user} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Search; 