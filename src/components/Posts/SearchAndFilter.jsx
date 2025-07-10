import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setSelectedCategory, filterPosts } from '../../store/slices/postsSlice';
import { FaSearch } from 'react-icons/fa';

const SearchAndFilter = () => {
  const dispatch = useDispatch();
  const { searchQuery, selectedCategory } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(filterPosts());
  }, [searchQuery, selectedCategory, dispatch]);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleCategoryChange = (e) => {
    dispatch(setSelectedCategory(e.target.value));
  };

  return (
    <div style={{
      backgroundColor: 'white',
      padding: '1.25rem',
      borderRadius: '12px',
      boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
      marginBottom: '2rem'
    }}>
      <div style={{
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '250px' }}>
          <div style={{ position: 'relative' }}>
            <FaSearch style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666',
              fontSize: '1rem'
            }} />
            <input
              type="text"
              placeholder="Search posts by title, content, or author..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        <div style={{ minWidth: '150px' }}>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem',
              backgroundColor: 'white'
            }}
          >
            <option value="all">All Categories</option>
            <option value="notes">Study Notes</option>
            <option value="jobs">Job Opportunities</option>
            <option value="threads">Discussion Threads</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchAndFilter; 