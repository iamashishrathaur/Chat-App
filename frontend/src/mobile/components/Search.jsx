import React, { useState } from 'react';

const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (onSearch) {
      onSearch(e.target.value);
    }
  };

  return (
    <div className='p-2'>
      <input
        type="search"
        className="w-full input input-bordered h-10 rounded-lg input-sm sm:input-md"
        placeholder="Search Here..."
        value={query}
        onChange={handleChange}
        aria-label="Search"
      />
    </div>
  );
};

export default Search;
