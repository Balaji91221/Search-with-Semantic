
import React from 'react';
import { SearchResult } from '@/lib/types';
import { ExternalLink, File, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface SearchResultsProps {
  results: SearchResult[];
}

const SearchResults: React.FC<SearchResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return null;
  }

  const getFileIcon = (name: string) => {
    if (name.endsWith('.md')) {
      return <FileText className="h-5 w-5 text-blue-500" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  const formatScore = (score: number) => {
    return `${Math.round(score * 100)}%`;
  };

  return (
    <motion.div 
      className="mt-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
    >
      <h2 className="text-xl font-medium mb-4">Search Results</h2>
      <div className="space-y-3">
        {results.map((result, index) => (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            className="glass-card flex items-start gap-4"
          >
            <div className="p-2 bg-background rounded-lg">
              {getFileIcon(result.metadata.name)}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{result.metadata.name}</h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                <span>Match: <span className="font-medium text-foreground">{formatScore(result.score)}</span></span>
                <span>Modified: {formatDate(result.metadata.modifiedTime)}</span>
              </div>
            </div>
            <a
              href={result.metadata.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Open in Google Drive"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SearchResults;
