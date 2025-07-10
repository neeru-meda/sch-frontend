
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import PostCard from "../components/Posts/PostCard";
import CreatePostForm from "../components/Posts/CreatePostForm";
import { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure } from '../store/slices/postsSlice';
import { postsAPI } from '../services/api';
// import PostFilterBar from "../components/Posts/PostFilterBar";


const PostsPage = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [postsTab, setPostsTab] = useState("my-posts");
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
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

  let filteredPosts = posts;
  if (postsTab === "my-posts" && user) {
    filteredPosts = posts.filter(post => {
      const authorId = post.author?._id || post.author?.id;
      const userId = user._id || user.id;
      return authorId === userId;
    });
  } else if (postsTab === "notes") {
    filteredPosts = posts.filter(post => post.category === "notes");
  } else if (postsTab === "threads") {
    filteredPosts = posts.filter(post => post.category === "threads");
  } else if (postsTab === "jobs") {
    filteredPosts = posts.filter(post => post.category === "jobs");
  }

  return (
    <div className="min-h-screen bg-[#fdfaf7] pt-8">
      <div className="w-full mx-auto px-4 mb-8">
        {/* Navigation Section (Tabs) and Create Post button aligned */}
        <div className="flex items-center justify-between mt-2 mb-2">
          <div className="flex flex-1 gap-2 mr-[32rem]">
            <button
              className={`flex-1 min-w-[110px] max-w-[140px] text-center px-2 py-2 font-semibold transition-all text-lg border-b-4 ${postsTab === 'my-posts' ? 'border-[#4A2343] text-[#4A2343] font-bold' : 'border-transparent text-gray-500 hover:text-[#4A2343]'}`}
              onClick={() => setPostsTab('my-posts')}
            >
              <span className="inline-block mr-1">📝</span>
              My Posts
            </button>
            <button
              className={`flex-1 min-w-[90px] max-w-[120px] text-center px-2 py-2 font-semibold transition-all text-lg border-b-4 ${postsTab === 'notes' ? 'border-[#4A2343] text-[#4A2343] font-bold' : 'border-transparent text-gray-500 hover:text-[#4A2343]'}`}
              onClick={() => setPostsTab('notes')}
            >
              <span className="inline-block mr-1">📒</span>
              Notes
            </button>
            <button
              className={`flex-1 min-w-[100px] max-w-[130px] text-center px-2 py-2 font-semibold transition-all text-lg border-b-4 ${postsTab === 'threads' ? 'border-[#4A2343] text-[#4A2343] font-bold' : 'border-transparent text-gray-500 hover:text-[#4A2343]'}`}
              onClick={() => setPostsTab('threads')}
            >
              <span className="inline-block mr-1">💬</span>
              Threads
            </button>
            <button
              className={`flex-1 min-w-[90px] max-w-[120px] text-center px-2 py-2 font-semibold transition-all text-lg border-b-4 ${postsTab === 'jobs' ? 'border-[#4A2343] text-[#4A2343] font-bold' : 'border-transparent text-gray-500 hover:text-[#4A2343]'}`}
              onClick={() => setPostsTab('jobs')}
            >
              <span className="inline-block mr-1">💼</span>
              Jobs
            </button>
          </div>
          <button
            className="bg-[#4A2343] text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-[#34182f] transition text-base ml-2 whitespace-nowrap"
            onClick={() => setShowCreate(true)}
          >
            + Create Post
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center text-gray-500 text-xl py-8">Loading posts...</div>
      ) : error ? (
        <div className="text-center text-red-500 text-xl py-8">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mx-auto px-4">
          {filteredPosts.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 text-xl">No posts to display.</div>
          ) : (
            filteredPosts.map(post => (
              <PostCard key={post._id} post={post} user={user} />
            ))
          )}
        </div>
      )}
      {showCreate && (
        <CreatePostForm onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
};

export default PostsPage; 