// src/pages/SearchResults.js
import React from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = () => {
  const query = new URLSearchParams(useLocation().search).get('q');

  return (
    <div className="search-results-page">
      <h2>Search Results</h2>
      <p>Showing results for: <strong>{query}</strong></p>
      {/* You can add filtering logic here using 'query' */}
    </div>
  );
};

export default SearchResults;
