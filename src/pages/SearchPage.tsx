
import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import SearchResults from '@/components/SearchResults';
import BrandLogo from '@/components/BrandLogo';
import { Button } from '@/components/ui/button';
import { searchFiles } from '@/lib/api';
import { SearchResult } from '@/lib/types';
import { LogOut, FileText, Loader2 } from 'lucide-react';
import { toast } from '@/lib/toast';
import { motion } from 'framer-motion';

interface SearchPageProps {
  accessToken: string;
  onLogout: () => void;
  onGoToDashboard: () => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ 
  accessToken, 
  onLogout,
  onGoToDashboard
}) => {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSearch = async (query: string) => {
    setSearching(true);
    setCurrentQuery(query);
    
    try {
      const searchResults = await searchFiles(query, accessToken);
      setResults(searchResults);
      setHasSearched(true);
      
      if (searchResults.length === 0) {
        toast.info('No matching documents found');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search files');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onGoToDashboard}
              className="text-muted-foreground hover:text-foreground"
            >
              <FileText className="h-4 w-4 mr-2" />
              Manage Files
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onLogout}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-medium mb-3">Semantic Document Search</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Search your Google Drive documents using natural language queries to find exactly what you're looking for
            </p>
          </motion.div>
          
          <SearchBar onSearch={handleSearch} isSearching={searching} />
          
          {searching && (
            <div className="mt-12 flex flex-col items-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-muted-foreground">Searching for "{currentQuery}"...</p>
            </div>
          )}
          
          {hasSearched && !searching && (
            <>
              {results.length > 0 ? (
                <SearchResults results={results} />
              ) : (
                <motion.div 
                  className="mt-12 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-muted-foreground">No results found for "{currentQuery}"</p>
                  <p className="text-sm mt-2">Try a different search term or process more files</p>
                </motion.div>
              )}
            </>
          )}
          
          {!hasSearched && !searching && (
            <motion.div 
              className="mt-24 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <p className="text-muted-foreground">Enter a search query to find documents</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
