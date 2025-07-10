import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createPostStart, createPostSuccess, createPostFailure } from '../../store/slices/postsSlice';
import { postsAPI, usersAPI } from '../../services/api';
import { FaUpload, FaTimes, FaFile } from 'react-icons/fa';
import FileUpload from "./FileUpload";
// import { mockUsers } from '../../services/mockData';

const CreatePostForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'notes',
    tags: [],
    link: '',
  });
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tagError, setTagError] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.posts);
  const currentUser = useSelector((state) => state.auth.user);
  const searchRef = useRef(null);

  // Click outside handler to close search results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const defaultDemoUser = { _id: 'user1', name: 'John Doe' };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return [];
    setUploading(true);
    const uploadedFiles = [];
    try {
      for (const file of files) {
        // For demo, just use file.name as a placeholder URL
        uploadedFiles.push(file.name);
        // If you want to use uploadAPI, uncomment below:
        // const response = await uploadAPI.uploadFile(file);
        // uploadedFiles.push(response.data.url);
      }
    } catch (error) {
      console.error('File upload failed:', error);
    } finally {
      setUploading(false);
    }
    return uploadedFiles;
  };

  const handleTagInputChange = (e) => {
    const value = e.target.value;
    setTagInput(value);
    setTagError("");
    setShowSearchResults(false);
    
    if (value.trim().length >= 2) {
      searchUsers(value.trim());
    } else {
      setSearchResults([]);
    }
  };

  const searchUsers = async (query) => {
    try {
      setSearching(true);
      console.log('Searching users with query:', query);
      const response = await usersAPI.searchUsers(query);
      console.log('Search response:', response.data);
      // Filter out current user from search results
      const filteredResults = response.data.filter(user => 
        user._id !== (currentUser?._id || currentUser?.id)
      );
      console.log('Filtered results:', filteredResults);
      setSearchResults(filteredResults);
      setShowSearchResults(filteredResults.length > 0);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const username = tagInput.trim();
      if (!username) return;
      
      // Check if user is already tagged
      const isAlreadyTagged = formData.tags.some(tag => 
        tag.username === username || tag.name === username
      );
      
      if (isAlreadyTagged) {
        setTagError("User is already tagged");
        return;
      }
      
      // Try to find user in search results
      const foundUser = searchResults.find(user => 
        user.username === username || user.name === username
      );
      
      if (foundUser) {
        addTag(foundUser);
      } else {
        setTagError("User not found");
      }
    }
  };

  const addTag = (user) => {
    console.log('Adding tag for user:', user);
    // Check if user is already tagged
    const isAlreadyTagged = formData.tags.some(tag => tag._id === user._id);
    
    if (isAlreadyTagged) {
      setTagError("User is already tagged");
      return;
    }
    
    const newTag = {
      _id: user._id,
      name: user.name,
      username: user.username
    };
    
    console.log('New tag:', newTag);
    setFormData({
      ...formData,
      tags: [...formData.tags, newTag],
    });
    
    setTagInput("");
    setTagError("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  const removeTag = (id) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag._id !== id),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    console.log("Form data:", formData);
    console.log("Tags:", formData.tags);
    if (!validateForm()) return;
    if (!currentUser) {
      dispatch(createPostFailure('You must be logged in to create a post.'));
      return;
    }
    try {
      dispatch(createPostStart());
      // Upload files first (placeholder logic)
      const uploadedFiles = await uploadFiles();
      // Prepare post data for backend
      const postData = {
        ...formData,
        attachments: uploadedFiles,
        tags: formData.tags,
        author: {
          _id: currentUser._id || currentUser.id,
          id: currentUser.id || currentUser._id,
          name: currentUser.full_name || currentUser.name || currentUser.username
        },
        createdAt: new Date().toISOString(),
        likes: [],
        comments: [],
      };
      console.log("Post data being sent:", postData);
      const response = await postsAPI.createPost(postData);
      console.log("Post created successfully:", response.data);
      dispatch(createPostSuccess(response.data));
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
      dispatch(createPostFailure(error.response?.data?.detail || error.response?.data?.message || 'Failed to create post'));
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
      <form className="bg-white/95 rounded-2xl shadow-2xl border-2 border-[#4A2343]/20 p-6 w-full max-w-lg" onSubmit={handleSubmit}>
        <h2 className="text-lg font-bold text-[#4A2343] mb-4">Create Post</h2>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="border rounded w-full mb-3 px-3 py-2 text-base"
          placeholder="Title"
          required
        />
        {errors.title && (
          <span className="text-red-500 text-xs">{errors.title}</span>
        )}
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows="6"
          className="border rounded w-full mb-3 px-3 py-2 text-base"
          placeholder="Content"
          required
        />
        {errors.content && (
          <span className="text-red-500 text-xs">{errors.content}</span>
        )}
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="border rounded w-full mb-3 px-3 py-2 text-base"
        >
          <option value="notes">Notes</option>
          <option value="jobs">Jobs</option>
          <option value="threads">Threads</option>
        </select>
        {formData.category === 'jobs' && (
          <div className="mb-3">
            <label className="block text-xs font-semibold mb-1 text-[#4A2343]">Job/Referral Link <span className="text-gray-400 font-normal">(optional)</span></label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="border rounded w-full px-3 py-2 text-base"
              placeholder="https://example.com/job-posting"
            />
          </div>
        )}
        <div className="mb-3 relative" ref={searchRef}>
          <label className="block text-xs font-semibold mb-1 text-[#4A2343]">Tag users <span className="text-gray-400 font-normal">(optional)</span></label>
          <input
            type="text"
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagInputKeyDown}
            className="border rounded w-full px-3 py-2 text-base"
            placeholder="Enter username and press Enter"
          />
          {tagError && <div className="text-red-500 text-xs mt-1">{tagError}</div>}
          
          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {searching ? (
                <div className="px-3 py-2 text-gray-500 text-sm">Searching...</div>
              ) : (
                searchResults.map(user => (
                  <div
                    key={user._id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                    onClick={() => addTag(user)}
                  >
                    <div className="font-medium">@{user.username}</div>
                    {user.name !== user.username && (
                      <div className="text-gray-500 text-xs">{user.name}</div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.tags.map(tag => (
              <span key={tag._id} className="bg-gray-200 text-[#4A2343] px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                @{tag.name}
                <button type="button" className="ml-1 text-[#4A2343] hover:text-red-500" onClick={() => removeTag(tag._id)}>&times;</button>
              </span>
            ))}
          </div>
        </div>
        <FileUpload files={files} setFiles={setFiles} />
        <div className="flex gap-4 mt-4">
          <button type="submit" className="bg-[#4A2343] text-white px-3 py-2 rounded font-semibold text-sm" disabled={loading || uploading}>
            {loading || uploading ? 'Posting...' : 'Post'}
          </button>
          <button type="button" className="bg-gray-200 text-[#4A2343] px-3 py-2 rounded font-semibold text-sm" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm; 