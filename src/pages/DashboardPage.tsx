
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { fetchDriveFiles, ingestFiles } from '@/lib/api';
import { DriveFile } from '@/lib/types';
import FileList from '@/components/FileList';
import BrandLogo from '@/components/BrandLogo';
import { toast } from '@/lib/toast';
import { Search, FileUp, Loader2, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardPageProps {
  accessToken: string;
  onLogout: () => void;
  onSearch: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ 
  accessToken, 
  onLogout,
  onSearch
}) => {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const loadFiles = async () => {
      try {
        const driveFiles = await fetchDriveFiles(accessToken);
        setFiles(driveFiles);
      } catch (error) {
        console.error('Error fetching files:', error);
        toast.error('Failed to fetch Drive files');
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [accessToken]);

  const handleFileSelect = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === files.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(files.map(file => file.id));
    }
  };

  const handleProcessFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    setProcessing(true);
    try {
      await ingestFiles(selectedFiles, accessToken);
      toast.success(`${selectedFiles.length} files processed successfully`);
      onSearch(); // Navigate to search page
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Failed to process files');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <BrandLogo />
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
      </header>
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-8 glass-card text-center">
            <motion.h1 
              className="text-2xl font-medium mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Select Files to Process
            </motion.h1>
            <motion.p 
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Choose the text documents you'd like to search semantically
            </motion.p>
          </div>
          
          <motion.div 
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium">Your Drive Files</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSelectAll}
                disabled={loading || files.length === 0}
              >
                {selectedFiles.length === files.length && files.length > 0
                  ? 'Deselect All'
                  : 'Select All'}
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <FileList 
                files={files} 
                selectedFiles={selectedFiles} 
                onFileSelect={handleFileSelect} 
              />
            )}
          </motion.div>
          
          <motion.div 
            className="mt-6 flex flex-col sm:flex-row justify-end gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Button
              variant="outline"
              onClick={onSearch}
              disabled={processing}
              className="bg-white hover:bg-gray-50"
            >
              <Search className="h-4 w-4 mr-2" />
              Go to Search
            </Button>
            <Button
              onClick={handleProcessFiles}
              disabled={selectedFiles.length === 0 || processing}
              className="bg-primary hover:bg-primary/90"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileUp className="h-4 w-4 mr-2" />
                  Process Selected Files
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;
