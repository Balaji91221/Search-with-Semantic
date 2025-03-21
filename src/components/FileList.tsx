
import React from 'react';
import { DriveFile } from '@/lib/types';
import { File, FileText, Check, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface FileListProps {
  files: DriveFile[];
  selectedFiles: string[];
  onFileSelect: (fileId: string) => void;
}

const FileList: React.FC<FileListProps> = ({ files, selectedFiles, onFileSelect }) => {
  if (files.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No files found</p>
      </div>
    );
  }

  const getFileIcon = (mimeType: string) => {
    switch (mimeType) {
      case 'text/markdown':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-2 mt-4">
      {files.map((file, index) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`p-3 rounded-xl cursor-pointer flex items-center justify-between ${
            selectedFiles.includes(file.id)
              ? 'bg-primary/10 border border-primary/30'
              : 'bg-card/50 hover:bg-card/80 border border-border/50'
          } transition-all duration-200`}
          onClick={() => onFileSelect(file.id)}
        >
          <div className="flex items-center gap-3">
            {getFileIcon(file.mimeType)}
            <div>
              <h3 className="font-medium text-sm">{file.name}</h3>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatDate(file.modifiedTime)}</span>
              </div>
            </div>
          </div>
          <div className="ml-2">
            {selectedFiles.includes(file.id) && (
              <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FileList;
