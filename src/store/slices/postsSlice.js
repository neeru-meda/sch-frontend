import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all',
  filteredPosts: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    fetchPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action) => {
      state.loading = false;
      // Normalize posts: ensure each post has both id and _id
      // and add commentsCount by fetching from backend if not present
      const normalized = action.payload.map(post => ({
        ...post,
        _id: post._id || post.id,
        id: post.id || post._id,
        commentsCount: typeof post.commentsCount === 'number' ? post.commentsCount : (Array.isArray(post.comments) ? post.comments.length : 0)
      }));
      state.posts = normalized;
      state.filteredPosts = normalized;
    },
    fetchPostsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    createPostStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createPostSuccess: (state, action) => {
      state.loading = false;
      state.posts.unshift(action.payload);
      state.filteredPosts.unshift(action.payload);
    },
    createPostFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentPost: (state, action) => {
      state.currentPost = action.payload;
    },
    addComment: (state, action) => {
      const { postId, comment } = action.payload;
      const post = state.posts.find(p => p._id === postId || p.id === postId);
      if (post) {
        if (!post.comments) post.comments = [];
        post.comments.push(comment);
        // Update comment count
        post.commentsCount = (post.commentsCount || 0) + 1;
      }
      if (state.currentPost && (state.currentPost._id === postId || state.currentPost.id === postId)) {
        if (!state.currentPost.comments) state.currentPost.comments = [];
        state.currentPost.comments.push(comment);
        // Update comment count
        state.currentPost.commentsCount = (state.currentPost.commentsCount || 0) + 1;
      }
    },
    addReply: (state, action) => {
      const { postId, commentId, reply } = action.payload;
      const post = state.posts.find(p => p._id === postId || p.id === postId);
      if (post) {
        const comment = post.comments?.find(c => c._id === commentId);
        if (comment) {
          if (!comment.replies) comment.replies = [];
          comment.replies.push(reply);
        }
      }
      if (state.currentPost && (state.currentPost._id === postId || state.currentPost.id === postId)) {
        const comment = state.currentPost.comments?.find(c => c._id === commentId);
        if (comment) {
          if (!comment.replies) comment.replies = [];
          comment.replies.push(reply);
        }
      }
    },
    deleteComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const post = state.posts.find(p => p._id === postId || p.id === postId);
      if (post) {
        post.comments = post.comments?.filter(c => c._id !== commentId) || [];
        // Update comment count
        post.commentsCount = Math.max(0, (post.commentsCount || 0) - 1);
      }
      if (state.currentPost && (state.currentPost._id === postId || state.currentPost.id === postId)) {
        state.currentPost.comments = state.currentPost.comments?.filter(c => c._id !== commentId) || [];
        // Update comment count
        state.currentPost.commentsCount = Math.max(0, (state.currentPost.commentsCount || 0) - 1);
      }
    },
    updatePostLikes: (state, action) => {
      const { postId, likes } = action.payload;
      // Replace the post object in posts array
      state.posts = state.posts.map(p =>
        (p._id === postId || p.id === postId) ? { ...p, likes } : p
      );
      // Also update filteredPosts if present
      if (state.filteredPosts && Array.isArray(state.filteredPosts)) {
        state.filteredPosts = state.filteredPosts.map(p =>
          (p._id === postId || p.id === postId) ? { ...p, likes } : p
        );
      }
      if (state.currentPost && (state.currentPost._id === postId || state.currentPost.id === postId)) {
        state.currentPost = { ...state.currentPost, likes };
      }
    },
    updatePostSaves: (state, action) => {
      const { postId, saves } = action.payload;
      console.log('updatePostSaves - postId:', postId, 'saves:', saves);
      const post = state.posts.find(p => p._id === postId || p.id === postId);
      if (post) {
        console.log('Found post to update saves:', post.id, 'old saves:', post.saves, 'new saves:', saves);
        post.saves = saves;
      }
      if (state.currentPost && (state.currentPost._id === postId || state.currentPost.id === postId)) {
        console.log('Updating currentPost saves:', state.currentPost.id, 'old saves:', state.currentPost.saves, 'new saves:', saves);
        state.currentPost.saves = saves;
      }
    },
    updatePost: (state, action) => {
      const { postId, updatedData } = action.payload;
      const idx = state.posts.findIndex(p => p._id === postId || p.id === postId);
      if (idx !== -1) {
        state.posts[idx] = { ...state.posts[idx], ...updatedData };
      }
      if (state.currentPost && (state.currentPost._id === postId || state.currentPost.id === postId)) {
        state.currentPost = { ...state.currentPost, ...updatedData };
      }
    },
    deletePost: (state, action) => {
      const postId = action.payload;
      state.posts = state.posts.filter(p => p._id !== postId && p.id !== postId);
      state.filteredPosts = state.filteredPosts.filter(p => p._id !== postId && p.id !== postId);
      if (state.currentPost && (state.currentPost._id === postId || state.currentPost.id === postId)) {
        state.currentPost = null;
      }
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    filterPosts: (state) => {
      let filtered = state.posts;
      
      // Filter by category
      if (state.selectedCategory !== 'all') {
        filtered = filtered.filter(post => post.category === state.selectedCategory);
      }
      
      // Filter by search query
      if (state.searchQuery.trim()) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(post => 
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.author.name.toLowerCase().includes(query)
        );
      }
      
      state.filteredPosts = filtered;
    },
    clearError: (state) => {
      state.error = null;
    },
    refreshPosts: (state) => {
      // This action will trigger a posts refresh
      // The actual refresh will be handled by the component that listens to this action
      state.loading = true;
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  createPostStart,
  createPostSuccess,
  createPostFailure,
  setCurrentPost,
  addComment,
  addReply,
  deleteComment,
  updatePostLikes,
  updatePostSaves,
  updatePost,
  deletePost,
  setSearchQuery,
  setSelectedCategory,
  filterPosts,
  clearError,
  refreshPosts,
} = postsSlice.actions;

export default postsSlice.reducer; 