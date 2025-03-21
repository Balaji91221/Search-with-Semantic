
import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="relative w-full max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative">
        <input
          type="text"
          className="search-input pr-12"
          placeholder="Search your files semantically..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={isSearching}
        />
        <button
          type="submit"
          disabled={!query.trim() || isSearching}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg text-primary disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isSearching ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
          ) : (
            <Search className="h-5 w-5" />
          )}
        </button>
      </div>
    </motion.form>
  );
};

export default SearchBar;
