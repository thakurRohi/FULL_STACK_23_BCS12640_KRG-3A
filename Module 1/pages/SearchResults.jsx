import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchPosts } from '../store/fileThunks';
import { Container, PostCard } from '../Components';
import SearchBar from '../Components/SearchBar';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('all');

  const { searchResults, searchStatus, searchTerm, searchTotal } = useSelector((state) => state.file);
  const { status: isAuthenticated } = useSelector((state) => state.auth);

  const query = searchParams.get('q');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (query) {
      dispatch(searchPosts({ searchTerm: query }));
    }
  }, [query, dispatch, isAuthenticated, navigate]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    if (query) {
      dispatch(searchPosts({ searchTerm: query, filters: filter !== 'all' ? [filter] : [] }));
    }
  };

  const PostCardSkeleton = () => (
    <div className="w-full bg-white rounded-2xl p-0 shadow-md border border-slate-200 opacity-60 animate-pulse flex flex-col">
      <div className="relative w-full h-52 bg-slate-200 rounded-t-2xl"></div>
      <div className="block cursor-pointer">
        <div className="flex items-center gap-2 px-5 py-2 border-b border-slate-100 bg-slate-50 w-full">
          <div className="w-7 h-7 rounded-full bg-blue-100"></div>
          <span className="h-4 w-20 bg-slate-200 rounded"></span>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-between p-5">
        <div className="h-7 w-3/4 bg-slate-200 rounded mb-2"></div>
        <div className="h-5 w-1/4 bg-slate-200 rounded mb-4"></div>
        <div className="mt-4 flex items-center justify-between">
          <span className="h-4 w-16 bg-slate-200 rounded"></span>
          <span className="h-5 w-5 bg-slate-200 rounded-full"></span>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full py-12">
      <Container>
        <div className="mb-8">
          <div className="max-w-2xl mx-auto mb-6">
            <SearchBar 
              className="w-full" 
              placeholder={`Search for "${query}"...`}
            />
          </div>
          
          {query && (
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                Search Results
              </h1>
              <p className="text-slate-600">
                {searchStatus === 'loading' ? 'Searching...' : 
                 searchTotal > 0 ? `Found ${searchTotal} result${searchTotal === 1 ? '' : 's'} for "${query}"` :
                 `No results found for "${query}"`}
              </p>
            </div>
          )}

          {searchTotal > 0 && (
            <div className="flex justify-center mb-6">
              <div className="flex space-x-1 bg-slate-100 rounded-lg p-1">
                {[
                  { key: 'all', label: 'All Results' },
                  { key: 'recent', label: 'Recent' },
                  { key: 'popular', label: 'Popular' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => handleFilterChange(filter.key)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                      activeFilter === filter.key
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {searchStatus === 'loading' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx}>
                <PostCardSkeleton />
              </div>
            ))}
          </div>
        )}

        {searchStatus === 'succeeded' && searchResults.length === 0 && query && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg className="mx-auto h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                No posts found
              </h2>
              <p className="text-slate-600 mb-6">
                Try adjusting your search terms or browse our latest posts
              </p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Browse All Posts
              </button>
            </div>
          </div>
        )}

        {searchStatus === 'succeeded' && searchResults.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {searchResults.map((post) => (
              <div key={post.$id}>
                <PostCard {...post} />
              </div>
            ))}
          </div>
        )}

        {searchStatus === 'failed' && (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="mb-6">
                <svg className="mx-auto h-16 w-16 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Search Error
              </h2>
              <p className="text-slate-600 mb-6">
                Something went wrong while searching. Please try again.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default SearchResults; 