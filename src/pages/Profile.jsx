import { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure } from '../store/slices/postsSlice';
import { postsAPI, commentsAPI } from '../services/api';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FaUser, FaEnvelope, FaLinkedin, FaGithub, FaEdit, FaSave } from 'react-icons/fa';
import PostCard from '../components/Posts/PostCard';
import { authAPI } from '../services/api';
import { updateProfile as updateProfileAction } from '../store/slices/authSlice';

const NAV_ITEMS = [
  { key: 'profile', label: 'Profile Info' },
  { key: 'edit', label: 'Edit Details' },
  { key: 'contributions', label: 'My Posts' },
  { key: 'activity', label: 'My Activity' },
  { key: 'saved', label: 'Saved Posts' },
  { key: 'password', label: 'Change Password' },
];

const defaultProfile = {
  name: 'John Doe',
  username: 'johndoe',
  department: 'Computer Science',
  joined: '2023-09-01',
  bio: 'AI enthusiast, loves collaborative projects',
  linkedin: '',
  github: '',
};





function Profile() {
  const user = useSelector((state) => state.auth.user) || {
    ...defaultProfile,
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    college: "Indian Institute of Technology, Madras"
  };
  const [selected, setSelected] = useState('profile');
  const [editData, setEditData] = useState({ ...user });
  const [editMode, setEditMode] = useState(false);
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [pwError, setPwError] = useState('');
  const [profileMsg, setProfileMsg] = useState('');
  const [profileError, setProfileError] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  const [activityTab, setActivityTab] = useState('comments');

  // Add state for user comments
  const [userComments, setUserComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsError, setCommentsError] = useState('');

  // Fetch posts when profile page mounts or when "My Posts"/"My Activity"/"Saved Posts" tab is selected and posts are empty
  useEffect(() => {
    if ((selected === 'contributions' || selected === 'activity' || selected === 'saved') && posts.length === 0 && !loading) {
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
  }, [selected, posts.length, dispatch, loading]);

  // Fetch user comments when activity tab is selected
  useEffect(() => {
    if (selected === 'activity' && activityTab === 'comments' && userComments.length === 0 && !commentsLoading) {
      const fetchUserComments = async () => {
        try {
          setCommentsLoading(true);
          setCommentsError('');
          const userId = user?._id || user?.id;
          console.log('Fetching comments for user:', userId);
          if (!userId) {
            setCommentsError('User not found');
            return;
          }
          const response = await commentsAPI.getUserComments(userId);
          console.log('User comments response:', response.data);
          setUserComments(response.data);
        } catch (error) {
          setCommentsError('Failed to fetch comments');
          console.error('Error fetching user comments:', error);
        } finally {
          setCommentsLoading(false);
        }
      };
      fetchUserComments();
    }
  }, [selected, activityTab, userComments.length, commentsLoading, user]);

  // Helper for formatting date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Handlers for Edit Details
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const handleEditSave = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    setProfileError('');
    try {
      const res = await authAPI.updateProfile({
        full_name: editData.name,
        email: editData.email,
        bio: editData.bio,
        department: editData.department,
        linkedin: editData.linkedin,
        github: editData.github,
        college: editData.college,
        joined: editData.joined,
      });
      dispatch(updateProfileAction(res.data));
      setProfileMsg('Profile updated successfully!');
      setEditMode(false);
    } catch (err) {
      setProfileError(err.response?.data?.detail || err.response?.data?.message || 'Update failed');
    }
  };

  // Handlers for Change Password
  const handlePwChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };
  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwMsg('');
    setPwError('');
    if (passwords.new.length < 6) {
      setPwError('Password must be at least 6 characters.');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setPwError('Passwords do not match.');
      return;
    }
    try {
      await authAPI.changePassword(passwords.old, passwords.new);
      setPwMsg('Password changed successfully!');
      setPasswords({ old: '', new: '', confirm: '' });
    } catch (err) {
      setPwError(err.response?.data?.detail || err.response?.data?.message || 'Password change failed');
    }
  };

  // Get initial for avatar
  const getInitial = (name) => name?.charAt(0)?.toUpperCase() || 'A';

  // Handle activity tab change
  const handleActivityTabChange = (tab) => {
    setActivityTab(tab);
    // Clear comments when switching away from comments tab
    if (tab !== 'comments') {
      setUserComments([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7]">
      <div className="w-full flex h-screen">
        {/* Sidebar */}
        <div className="bg-white shadow-md p-6 min-w-[220px] flex flex-col h-full items-center justify-start">
          <div className="w-full flex flex-col items-center mt-4">
            {/* Avatar (Sidebar) */}
            <div className="w-32 h-32 rounded-full bg-[#4A2343] flex items-center justify-center text-white text-5xl font-bold mb-6 mt-4 border-4 border-[#c9a3c6]">
              {getInitial(user.name)}
            </div>
            {/* Nav */}
            <div className="w-full flex flex-col gap-y-5">
              {NAV_ITEMS.map(item => (
                <button
                  key={item.key}
                  className={`w-full text-center px-4 py-4 font-semibold transition-all text-lg ${selected === item.key ? 'bg-[#4A2343] text-white rounded-full shadow' : 'text-[#4A2343] rounded-none hover:bg-[#c9a3c6] hover:text-[#4A2343] hover:rounded-full cursor-pointer'}`}
                  onClick={() => setSelected(item.key)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Content Area */}
        <div className="flex-1 bg-white rounded-xl shadow-md p-10">
          {selected === 'profile' && (
            <div className="w-full px-8">
              <div className="flex flex-col md:flex-row items-center w-full gap-x-8">
                {/* Main Profile Card */}
                <div className="bg-gradient-to-br from-white to-[#f3e8f7] shadow-2xl rounded-3xl border border-[#e5e7eb] py-12 px-8 min-h-[575px] flex flex-col items-center w-full md:w-1/2 max-w-lg mx-auto font-sans relative ring-4 ring-[#c9a3c6]/20 hover:scale-[1.02] transition-transform duration-300">
                  {/* Avatar with gradient border */}
                  <div className="bg-gradient-to-br from-[#c9a3c6] to-[#4A2343] p-1 rounded-2xl mb-8 shadow-2xl">
                    <div className="w-72 h-72 bg-[#4A2343] flex items-center justify-center text-white text-8xl font-bold rounded-2xl">
                      {getInitial(user.name)}
                    </div>
                  </div>
                  {/* Divider */}
                  <hr className="w-1/2 border-t-2 border-[#c9a3c6] mb-8" />
                  <div className="flex flex-col items-center w-full gap-y-4">
                    <div className="text-4xl font-extrabold text-[#4A2343] text-center tracking-wide">{user.name}</div>
                    <div className="text-2xl font-semibold text-gray-500 text-center">@{user.username}</div>
                    <div className="italic text-lg text-[#7c4373] text-center">{user.bio || 'No bio provided.'}</div>
                  </div>
                  {/* Example badge (uncomment if needed) */}
                  {/* <span className="absolute top-6 right-6 bg-[#c9a3c6] text-[#4A2343] px-4 py-1 rounded-full text-sm font-bold shadow">Student</span> */}
                </div>
                {/* Side Cards */}
                <div className="flex flex-col gap-10 w-full md:w-1/2 max-w-lg">
                  {/* Social Links Card */}
                  <div className="bg-gradient-to-br from-white to-[#f3e8f7] shadow-lg rounded-3xl border border-[#e5e7eb] p-8 min-h-[220px] flex flex-col items-start font-sans relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-[#c9a3c6] rounded-b-xl mb-2"></div>
                    <div className="text-2xl font-bold text-[#4A2343] mb-4 tracking-wide">Links</div>
                    <div className="flex flex-col gap-3 w-full">
                      {user.linkedin ? (
                        <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c9a3c6] text-[#4A2343] text-lg font-semibold hover:bg-[#7c4373] hover:text-white transition">
                          <FaLinkedin className="text-2xl" /> LinkedIn
                        </a>
                      ) : (
                        <span className="text-gray-400 flex items-center gap-2 text-lg font-semibold"><FaLinkedin className="text-2xl" /> No LinkedIn</span>
                      )}
                      {user.github ? (
                        <a href={user.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#c9a3c6] text-[#4A2343] text-lg font-semibold hover:bg-[#7c4373] hover:text-white transition">
                          <FaGithub className="text-2xl" /> GitHub
                        </a>
                      ) : (
                        <span className="text-gray-400 flex items-center gap-2 text-lg font-semibold"><FaGithub className="text-2xl" /> No GitHub</span>
                      )}
                    </div>
                  </div>
                  {/* Details Card */}
                  <div className="bg-gradient-to-br from-white to-[#f3e8f7] shadow-lg rounded-3xl border border-[#e5e7eb] p-8 flex flex-col gap-3 font-sans relative w-full max-w-lg">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-[#c9a3c6] rounded-b-xl mb-2"></div>
                    <div className="text-2xl font-bold text-[#4A2343] mb-4 tracking-wide">Details</div>
                    <div className="flex items-center gap-2 text-[#4A2343] text-lg font-semibold"><span>📅</span> Joined: <span className="font-normal text-gray-700">{formatDate(user.joined)}</span></div>
                    <div className="flex items-center gap-2 text-[#4A2343] text-lg font-semibold"><span>📧</span> Email: <span className="font-normal text-gray-700">{user.email || user.username + '@mail.com'}</span></div>
                    <div className="flex items-center gap-2 text-[#4A2343] text-lg font-semibold"><span>🏫</span> College: <span className="font-normal text-gray-700 whitespace-nowrap">{user.college || 'N/A'}</span></div>
                    <div className="flex items-center gap-2 text-[#4A2343] text-lg font-semibold"><span>🎓</span> Stream: <span className="font-normal text-gray-700">{user.department || 'N/A'}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {selected === 'edit' && (
            <div className="bg-gradient-to-br from-white to-[#f3e8f7] shadow-2xl rounded-[2.5rem] border border-[#e5e7eb] py-8 px-16 max-w-7xl mx-auto font-sans relative focus-within:ring-4 focus-within:ring-[#c9a3c6]/30 transition-all duration-300 -mt-4">
              {/* Accent bar */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-2 bg-[#4A2343] rounded-b-xl mb-4"></div>
              <h2 className="text-4xl font-extrabold mb-8 text-[#4A2343] text-center tracking-wide">Edit Details</h2>
              <form className="flex flex-col gap-y-4" onSubmit={handleEditSave}>
                {profileError && <div className="text-red-500 text-sm mt-1">{profileError}</div>}
                {profileMsg && <div className="text-green-500 text-sm mt-1">{profileMsg}</div>}
                {/* Name & Username */}
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1 text-[#4A2343]">Full Name</label>
                    <input type="text" name="name" value={editData.name} onChange={handleEditChange} className="border rounded w-full px-3 py-3 text-lg" required />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1 text-[#4A2343]">Username</label>
                    <input type="text" name="username" value={editData.username} onChange={handleEditChange} className="border rounded w-full px-3 py-3 text-lg" required />
                  </div>
                </div>
                {/* Email, College, Stream */}
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1 text-[#4A2343]">Email</label>
                    <input type="email" name="email" value={editData.email || ''} onChange={handleEditChange} className="border rounded w-full px-3 py-3 text-lg" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1 text-[#4A2343]">College</label>
                    <input type="text" name="college" value={editData.college || ''} onChange={handleEditChange} className="border rounded w-full px-3 py-3 text-lg" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1 text-[#4A2343]">Stream</label>
                    <input type="text" name="department" value={editData.department || ''} onChange={handleEditChange} className="border rounded w-full px-3 py-3 text-lg" />
                  </div>
                </div>
                {/* Bio */}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-[#4A2343]">Bio / Description</label>
                  <textarea name="bio" value={editData.bio} onChange={handleEditChange} className="border rounded w-full px-3 py-3 text-lg" rows={3} />
                </div>
                {/* Links */}
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1 text-[#4A2343]">LinkedIn</label>
                    <input type="url" name="linkedin" value={editData.linkedin} onChange={handleEditChange} className="border rounded w-full px-3 py-3 text-lg" placeholder="https://linkedin.com/in/username" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-semibold mb-1 text-[#4A2343]">GitHub</label>
                    <input type="url" name="github" value={editData.github} onChange={handleEditChange} className="border rounded w-full px-3 py-3 text-lg" placeholder="https://github.com/username" />
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex gap-4 mt-4 justify-center">
                  <button type="submit" className="bg-[#4A2343] text-white px-6 py-3 rounded font-semibold flex items-center gap-2 text-lg"><FaSave />Save</button>
                  <button type="button" className="bg-gray-200 text-[#4A2343] px-6 py-3 rounded font-semibold flex items-center gap-2 text-lg" onClick={() => setEditData({ ...user })}><FaEdit />Reset</button>
                </div>
              </form>
            </div>
          )}
          {selected === 'contributions' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-[#4A2343]">My Posts</h2>
              {loading ? (
                <div className="text-center text-gray-500 text-xl py-8">Loading posts...</div>
              ) : error ? (
                <div className="text-center text-red-500 text-xl py-8">{error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(() => {
                    // Use the same logic as PostsPage for "My Posts"
                    const userId = user?._id || user?.id;
                    const myPosts = posts.filter(post => {
                      const authorId = post.author?._id || post.author?.id;
                      return authorId === userId;
                    });
                    if (myPosts.length === 0) {
                      return <div className="text-gray-500">You haven't created any posts yet.</div>;
                    }
                    return myPosts.map(post => (
                      <PostCard key={post._id} post={post} user={user} />
                    ));
                  })()}
                </div>
              )}
            </div>
          )}
          {selected === 'activity' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-[#4A2343]">My Activity</h2>
              <div className="flex w-full gap-4 mb-6 justify-evenly">
                <button
                  className={`flex-1 w-full text-center px-4 py-2 font-semibold transition-all text-xl border-b-4 ${activityTab === 'comments' ? 'border-[#4A2343] text-[#4A2343] font-bold' : 'border-transparent text-gray-500 hover:text-[#4A2343]'}`}
                  onClick={() => handleActivityTabChange('comments')}
                >
                  <span className="inline-block mr-2 animate-pulse">💬</span>
                  Comments
                </button>
                <button
                  className={`flex-1 w-full text-center px-4 py-2 font-semibold transition-all text-xl border-b-4 ${activityTab === 'likes' ? 'border-[#4A2343] text-[#4A2343] font-bold' : 'border-transparent text-gray-500 hover:text-[#4A2343]'}`}
                  onClick={() => handleActivityTabChange('likes')}
                >
                  <span className="inline-block mr-2 animate-pulse">👍</span>
                  Likes
                </button>
                <button
                  className={`flex-1 w-full text-center px-4 py-2 font-semibold transition-all text-xl border-b-4 ${activityTab === 'tag' ? 'border-[#4A2343] text-[#4A2343] font-bold' : 'border-transparent text-gray-500 hover:text-[#4A2343]'}`}
                  onClick={() => handleActivityTabChange('tag')}
                >
                  <span className="inline-block mr-2 animate-pulse">🏷️</span>
                  Tag
                </button>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {/* Show loading and error states for activity tab */}
                {loading ? (
                  <div className="text-center text-gray-500 text-xl py-8">Loading activity...</div>
                ) : error ? (
                  <div className="text-center text-red-500 text-xl py-8">{error}</div>
                ) : (
                  <>
                    {activityTab === 'comments' && (
                      (() => {
                        if (commentsLoading) {
                          return <div className="text-center text-gray-500 text-xl py-8">Loading comments...</div>;
                        }
                        if (commentsError) {
                          return <div className="text-center text-red-500 text-xl py-8">{commentsError}</div>;
                        }
                        if (userComments.length === 0) {
                          return <div className="text-gray-500">You haven't commented on any posts yet.</div>;
                        }
                        
                        console.log('Displaying user comments:', userComments);
                        
                        // Group comments by post_id and find the corresponding posts
                        const commentsByPost = {};
                        userComments.forEach(comment => {
                          const postId = comment.post_id;
                          if (!commentsByPost[postId]) {
                            commentsByPost[postId] = [];
                          }
                          commentsByPost[postId].push(comment);
                        });
                        
                        console.log('Comments grouped by post:', commentsByPost);
                        
                        // Find posts that have user comments
                        const postsWithUserComments = posts.filter(post => {
                          const postId = post._id || post.id;
                          return commentsByPost[postId];
                        });
                        
                        console.log('Posts with user comments:', postsWithUserComments);
                        
                        if (postsWithUserComments.length === 0) {
                          return <div className="text-gray-500">Loading posts for your comments...</div>;
                        }
                        
                        return postsWithUserComments.map(post => (
                          <div key={post._id} className="border border-gray-200 rounded-lg p-4">
                            <PostCard post={post} user={user} />
                            <div className="mt-4 ml-4 border-l-2 border-[#c9a3c6] pl-4">
                              <h4 className="text-lg font-semibold text-[#4A2343] mb-2">Your Comments:</h4>
                              {commentsByPost[post._id || post.id]?.map(comment => (
                                <div key={comment.id} className="bg-gray-50 rounded-lg p-3 mb-2">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm text-gray-500">@{user.username}</span>
                                    <span className="text-xs text-gray-400">
                                      {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-gray-700">{comment.content}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ));
                      })()
                    )}
                    {activityTab === 'likes' && (
                      (() => {
                        const likedPosts = posts.filter(post => Array.isArray(post.likes) && post.likes.includes(user._id || user.id));
                        if (likedPosts.length === 0) {
                          return <div className="text-gray-500">You haven't liked any posts yet.</div>;
                        }
                        return likedPosts.map(post => (
                          <PostCard key={post._id} post={post} user={user} />
                        ));
                      })()
                    )}
                    {activityTab === 'tag' && (
                      (() => {
                        const taggedPosts = posts.filter(post => 
                          Array.isArray(post.tags) && 
                          post.tags.some(tag => tag._id === (user._id || user.id))
                        );
                        if (taggedPosts.length === 0) {
                          return <div className="text-gray-500">You haven't been tagged in any posts yet.</div>;
                        }
                        return taggedPosts.map(post => (
                          <PostCard key={post._id} post={post} user={user} />
                        ));
                      })()
                    )}
                  </>
                )}
              </div>
            </div>
          )}
          {selected === 'saved' && (
            <div>
              <h2 className="text-3xl font-bold mb-8 text-[#4A2343]">Saved Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(() => {
                  const userId = user?._id || user?.id;
                  const savedPosts = posts.filter(post => Array.isArray(post.saves) && post.saves.includes(userId));
                  console.log('Saved posts filtering - userId:', userId, 'posts:', posts.length, 'savedPosts:', savedPosts.length);
                  console.log('All posts saves:', posts.map(p => ({ id: p.id, saves: p.saves })));
                  
                  if (savedPosts.length === 0) {
                    return <div className="text-gray-500">You haven't saved any posts yet.</div>;
                  }
                  return savedPosts.map(post => (
                    <PostCard key={post._id} post={post} user={user} />
                  ));
                })()}
              </div>
            </div>
          )}
          {selected === 'password' && (
            <div className="bg-gradient-to-br from-white to-[#f3e8f7] shadow-2xl rounded-[2.5rem] border border-[#e5e7eb] py-8 px-10 max-w-3xl mx-auto font-sans relative focus-within:ring-4 focus-within:ring-[#c9a3c6]/30 transition-all duration-300 mt-8">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-2 bg-[#4A2343] rounded-b-xl mb-4"></div>
              <h2 className="text-3xl font-bold mb-8 text-[#4A2343] text-center tracking-wide">Change Password</h2>
              <form className="flex flex-col gap-y-6" onSubmit={handlePwSubmit}>
                {pwError && <div className="text-red-500 text-sm mt-1">{pwError}</div>}
                {pwMsg && <div className="text-green-500 text-sm mt-1">{pwMsg}</div>}
                <div>
                  <label className="block text-sm font-semibold mb-1 text-[#4A2343]">Old Password</label>
                  <input type="password" name="old" value={passwords.old} onChange={handlePwChange} className="border rounded w-full px-3 py-3 text-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-[#4A2343]">New Password</label>
                  <input type="password" name="new" value={passwords.new} onChange={handlePwChange} className="border rounded w-full px-3 py-3 text-lg" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-[#4A2343]">Confirm Password</label>
                  <input type="password" name="confirm" value={passwords.confirm} onChange={handlePwChange} className="border rounded w-full px-3 py-3 text-lg" required />
                </div>
                <button type="submit" className="bg-[#4A2343] text-white px-6 py-3 rounded font-semibold mt-2 text-lg">Change Password</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
