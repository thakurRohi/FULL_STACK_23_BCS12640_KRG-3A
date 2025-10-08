import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { searchPosts } from '../store/fileThunks';
import { Container } from './index';

const SearchBar = ({ className = '', placeholder = "Search posts..." }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const { searchResults, searchStatus, searchTerm: currentSearchTerm } = useSelector((state) => state.file);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        console.log('Searching for:', searchTerm.trim());
        setIsSearching(true);
        dispatch(searchPosts({ searchTerm: searchTerm.trim() }))
          .then((result) => {
            console.log('Search result:', result);
            setIsSearching(false);
          })
          .catch((error) => {
            console.error('Search error:', error);
            setIsSearching(false);
          });
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, dispatch]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowDropdown(false);
    }
  };

  const handleResultClick = (post) => {
    navigate(`/post/${post.$id}`);
    setShowDropdown(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowDropdown(e.target.value.length >= 2);
            }}
            onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
            placeholder={placeholder}
            className="w-full px-4 py-2 pl-10 pr-12 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
          />
          
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Loading Spinner */}
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <svg className="animate-spin h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}

          {/* Search Button */}
          {searchTerm.trim() && !isSearching && (
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-800"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Search Dropdown */}
      {showDropdown && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200 max-h-96 overflow-y-auto">
          <div className="py-2">
            {searchResults.slice(0, 5).map((post) => (
              <div
                key={post.$id}
                onClick={() => handleResultClick(post)}
                className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors duration-150"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {post.content?.substring(0, 60)}...
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {searchResults.length > 5 && (
              <div className="px-4 py-2 text-center">
                <button
                  onClick={handleSearchSubmit}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all {searchResults.length} results
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {showDropdown && searchStatus === 'succeeded' && searchResults.length === 0 && searchTerm.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-slate-200">
          <div className="px-4 py-3 text-center text-slate-500">
            No posts found for "{searchTerm}"
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar; 