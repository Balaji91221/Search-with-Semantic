
import React from 'react';
import { Search } from 'lucide-react';

const BrandLogo: React.FC = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="bg-primary p-2 rounded-lg">
        <Search className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="font-display text-xl font-semibold">DriveSearch</span>
    </div>
  );
};

export default BrandLogo;
